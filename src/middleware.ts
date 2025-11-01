import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas que requerem autenticação
  const protectedRoutes = ['/dashboard']
  
  // Rotas de autenticação (redirecionar se já logado)
  const authRoutes = ['/login', '/signup']

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Obter token do cookie ou header
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Verificar se o token é válido
  const user = token ? verifyToken(token) : null

  if (isProtectedRoute && !user) {
    // Redirecionar para login se tentar acessar rota protegida sem estar logado
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && user) {
    // Redirecionar para dashboard se já estiver logado
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}