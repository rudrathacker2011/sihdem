import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Creates a Supabase server client.
 * Accepts an optional pre-fetched cookieStore; if omitted, fetches it automatically.
 * This makes route handlers work with both signatures:
 *   await createClient()          — no args (standard usage in routes)
 *   createClient(cookieStore)     — explicit (legacy / middleware)
 */
export const createClient = async (
  cookieStore?: Awaited<ReturnType<typeof cookies>>
) => {
  const store = cookieStore ?? (await cookies());
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            store.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore
        }
      },
    },
  });
};
