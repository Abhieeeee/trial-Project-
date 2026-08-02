import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { resolveRole } from "@/lib/roles";

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

  // Retrieve user role securely from database profiles with seed email fallback
  let role = "user";
  if (user) {
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
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role, email")
      .eq("id", user.id)
      .single();

    const userEmail = profile?.email || user.email;
    role = resolveRole(userEmail, profile?.role);
  }

  // Handle /admin/login GET navigation auto-redirect if logged in
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
    if (role === "super_admin") {
      // Super admin has full unrestricted access to all portals (/super-admin, /admin, /dashboard, /staff)
      return supabaseResponse;
    } else if (role === "admin") {
      if (pathname.startsWith("/super-admin")) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/admin") && !pathname.startsWith("/dashboard/staff")) {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
    } else if (role === "staff") {
      if (pathname.startsWith("/super-admin")) {
        return NextResponse.redirect(new URL("/admin/orders", request.url));
      }
      if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/staff")) {
        return NextResponse.redirect(new URL("/dashboard/staff", request.url));
      }
      if (pathname.startsWith("/admin")) {
        const allowedStaffPaths = ["/admin/orders", "/admin/inventory"];
        const isAllowed = allowedStaffPaths.some(path => pathname.startsWith(path));
        if (!isAllowed) {
          return NextResponse.redirect(new URL("/admin/orders", request.url));
        }
      }
    } else {
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/super-admin") || pathname.startsWith("/staff")) {
        return NextResponse.redirect(new URL("/user-dashboard", request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/super-admin/:path*", "/staff/:path*", "/user-dashboard/:path*", "/dashboard/:path*"],
};
