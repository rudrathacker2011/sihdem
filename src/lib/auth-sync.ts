import { prisma } from "@/lib/prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Finds or creates a Prisma User matching the logged-in Supabase user.
 * Seamlessly links pre-seeded database accounts (matched by email) to the Supabase auth session.
 */
export async function getOrCreateDbUser(user: SupabaseUser) {
  // 1. Try finding by supabaseId
  let dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (dbUser) return dbUser;

  // 2. If not found by supabaseId, link by email (for pre-seeded test accounts)
  if (user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (dbUser) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { supabaseId: user.id },
      });
      return dbUser;
    }
  }

  // 3. Create fresh student user if brand new
  const role = user.email === "admin@test.com" ? "ADMIN" : (user.user_metadata?.role ?? "STUDENT");

  dbUser = await prisma.user.create({
    data: {
      supabaseId: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User",
      role: role as any,
    },
  });

  return dbUser;
}
