import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Remover cookie de autenticação
    const response = NextResponse.json({ success: true, message: 'Logout realizado com sucesso' })
    response.cookies.delete('auth-token')
    return response
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}