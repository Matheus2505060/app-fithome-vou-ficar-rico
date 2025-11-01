"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Salvar token no localStorage
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirecionar para dashboard
        router.push('/dashboard')
      } else {
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Digite seu e-mail primeiro')
      return
    }

    // Simular envio de email de recuperação
    alert(`Email de recuperação enviado para ${formData.email}. Verifique sua caixa de entrada.`)
    setShowForgotPassword(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/30 backdrop-blur-sm border-gray-600 text-white">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              FitHome
            </h1>
          </div>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription className="text-gray-300">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-300">E-mail</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </div>
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Esqueci minha senha
              </Button>
            </div>

            <div className="text-center">
              <p className="text-gray-300 text-sm">
                Não tem uma conta?{' '}
                <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">
                  Criar conta
                </Link>
              </p>
            </div>
          </form>

          {/* Modal de Esqueci a Senha */}
          {showForgotPassword && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-sm bg-gray-800 border-gray-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Recuperar Senha</CardTitle>
                  <CardDescription className="text-gray-300">
                    Digite seu e-mail para receber instruções de recuperação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="recovery-email" className="text-gray-300">E-mail</Label>
                    <Input
                      id="recovery-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleForgotPassword}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Enviar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}