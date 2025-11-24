import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirectTo = url.searchParams.get("redirectTo") || "/dashboard";
  const base = process.env.NEXT_PUBLIC_SITE_URL || url.origin;

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get() { return undefined; },
          set(name: string, value: string, options: any) {
            // Cookies serão definidos na resposta
          },
          remove(name: string, options: any) {
            // Cookies serão removidos na resposta
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(new URL(redirectTo, base));
    }
  }

  // Se houver erro ou não houver código, redirecionar para login
  return NextResponse.redirect(new URL("/login", base));
}