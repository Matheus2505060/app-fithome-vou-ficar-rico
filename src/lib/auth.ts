import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

// Simular banco de dados local (em produção, usar Supabase)
let users: Array<User & { password_hash: string }> = []

export async function registerUser(email: string, name: string, password: string): Promise<AuthResponse> {
  try {
    // Verificar se usuário já existe
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return { success: false, error: 'Email já está em uso' }
    }

    // Hash da senha
    const password_hash = await bcrypt.hash(password, 10)

    // Criar usuário
    const user = {
      id: crypto.randomUUID(),
      email,
      name,
      password_hash,
      created_at: new Date().toISOString()
    }

    users.push(user)

    // Gerar token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    // Retornar usuário sem senha
    const { password_hash: _, ...userWithoutPassword } = user
    
    return {
      success: true,
      user: userWithoutPassword,
      token
    }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    // Buscar usuário
    const user = users.find(u => u.email === email)
    if (!user) {
      return { success: false, error: 'Email ou senha inválidos' }
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: 'Email ou senha inválidos' }
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    // Retornar usuário sem senha
    const { password_hash: _, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      token
    }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    return decoded
  } catch (error) {
    return null
  }
}

export function getUserById(id: string): User | null {
  const user = users.find(u => u.id === id)
  if (!user) return null

  const { password_hash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}