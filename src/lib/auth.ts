import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
  created_at: string
  is_premium?: boolean
  subscription_status?: 'trial' | 'active' | 'expired' | 'none'
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export async function registerUser(email: string, name: string, password: string): Promise<AuthResponse> {
  try {
    // Registrar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Erro ao criar usuário' }
    }

    // Criar perfil do usuário na tabela profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        name: name,
        is_premium: false,
        subscription_status: 'trial', // 7 dias grátis para novos usuários
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError)
      // Não falhar o registro se o perfil não for criado
    }

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      name: name,
      created_at: authData.user.created_at,
      is_premium: true, // Trial conta como premium
      subscription_status: 'trial'
    }

    return {
      success: true,
      user
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro interno do servidor' }
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      return { success: false, error: 'Email ou senha inválidos' }
    }

    if (!authData.user) {
      return { success: false, error: 'Erro ao fazer login' }
    }

    // Buscar dados do perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      name: profile?.name || authData.user.user_metadata?.name || 'Usuário',
      created_at: authData.user.created_at,
      is_premium: profile?.is_premium || false,
      subscription_status: profile?.subscription_status || 'none'
    }

    return {
      success: true,
      user
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro interno do servidor' }
  }
}

export async function logoutUser(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao fazer logout' }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) return null

    // Buscar dados do perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    return {
      id: authUser.id,
      email: authUser.email!,
      name: profile?.name || authUser.user_metadata?.name || 'Usuário',
      created_at: authUser.created_at,
      is_premium: profile?.is_premium || false,
      subscription_status: profile?.subscription_status || 'none'
    }
  } catch (error) {
    return null
  }
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao atualizar perfil' }
  }
}