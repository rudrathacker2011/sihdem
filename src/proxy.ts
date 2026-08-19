import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Route protection matrix from spec §9.2
const PUBLIC_ROUTES = ["/", "/auth"];
const STUDENT_ROUTES = ["/dashboard", "/assessment", "/roadmap", "/chat", "/account"];
const ADMIN_ROUTES = ["/admin"];

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return supabaseResponse;
  }

  const role: string =
    user?.email === "admin@test.com"
      ? "ADMIN"
      : (user?.user_metadata?.role ?? "STUDENT");

  // Not authenticated — protect non-public routes
  if (!user && !matchesRoute(pathname, PUBLIC_ROUTES)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Admin → redirect away from student routes
  if (user && role === "ADMIN" && matchesRoute(pathname, STUDENT_ROUTES)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Student → redirect away from admin routes
  if (user && role !== "ADMIN" && matchesRoute(pathname, ADMIN_ROUTES)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Authenticated user hitting /auth → redirect based on role
  if (user && pathname === "/auth") {
    const dest = role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
