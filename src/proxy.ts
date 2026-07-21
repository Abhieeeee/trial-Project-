import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    if (pathname === "/admin/login") return NextResponse.next({ request });
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabaseAuth = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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

  const { data: { user } } = await supabaseAuth.auth.getUser();

  // If already logged in and visiting login page (GET navigation only), automatically redirect to appropriate portal
  if (pathname === "/admin/login") {
    const isGetMethod = request.method === "GET";
    const isServerAction = request.headers.has("next-action");

    if (isGetMethod && !isServerAction && user) {
      const supabaseAdmin = createServerClient(
        supabaseUrl,
        supabaseServiceKey,
        {
          cookies: {
            getAll() { return request.cookies.getAll(); },
            setAll() {},
          },
        }
      );
    const email = profile?.email;
    const role = email === "super@aurastreet.com"
      ? "super_admin"
      : email === "admin@aurastreet.com"
      ? "admin"
      : email === "staff@aurastreet.com"
      ? "staff"
      : (profile?.role ?? "user");

    // If already logged in and visiting login page (GET navigation only), automatically redirect to appropriate portal
    if (pathname === "/admin/login") {
      const isGetMethod = request.method === "GET";
      const isServerAction = request.headers.has("next-action");

      if (isGetMethod && !isServerAction && user) {
        if (role === "super_admin") return NextResponse.redirect(new URL("/super-admin/dashboard", request.url));
        if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        if (role === "staff") return NextResponse.redirect(new URL("/admin/orders", request.url));
        return NextResponse.redirect(new URL("/user-dashboard", request.url));
      }
      return NextResponse.next({ request });
    }

    // Protect admin, super-admin, staff, user-dashboard, and dashboard routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/super-admin") || pathname.startsWith("/staff") || pathname.startsWith("/user-dashboard") || pathname.startsWith("/dashboard")) {
      if (!user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      // Role-based route guards
      if (role === "staff") {
        // Staff role constraints: can only access /admin/orders, /admin/inventory, or /dashboard/staff
        if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/staff")) {
          return NextResponse.redirect(new URL("/dashboard/staff", request.url));
        }
        if (pathname.startsWith("/super-admin")) {
          return NextResponse.redirect(new URL("/admin/orders", request.url));
        }
        if (pathname.startsWith("/admin")) {
          const allowedStaffPaths = ["/admin/orders", "/admin/inventory"];
          const isAllowed = allowedStaffPaths.some(path => pathname.startsWith(path));
          if (!isAllowed) {
            return NextResponse.redirect(new URL("/admin/orders", request.url));
          }
        }
      } else if (role === "admin") {
        // Admin constraints: can access /admin/* and /dashboard/admin / /dashboard/staff
        if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/admin") && !pathname.startsWith("/dashboard/staff")) {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
        if (pathname.startsWith("/super-admin")) {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
      } else if (role === "super_admin") {
        // Super admin has unrestricted access to all portals
      } else {
        // Standard users are blocked from all admin/staff/dashboard routes
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/super-admin") || pathname.startsWith("/staff")) {
          return NextResponse.redirect(new URL("/user-dashboard", request.url));
        }
      }
    }

    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/super-admin/:path*", "/staff/:path*", "/user-dashboard/:path*", "/dashboard/:path*"],
};
