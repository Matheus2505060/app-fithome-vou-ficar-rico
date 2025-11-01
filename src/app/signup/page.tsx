"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock, UserPlus, Gift } from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validações
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Salvar token no localStorage
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirecionar para dashboard
        router.push('/dashboard')
      } else {
        setError(data.error || 'Erro ao criar conta')
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
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
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription className="text-gray-300">
            Crie sua conta e comece sua jornada fitness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
              <div className="flex items-center gap-2 text-yellow-300 font-semibold mb-1">
                <Gift className="w-4 h-4" />
                🎁 Oferta Especial!
              </div>
              <p className="text-xs text-gray-300">
                Ao criar sua conta, você ganha acesso completo por 7 dias grátis
              </p>
            </div>

            <div>
              <Label htmlFor="name" className="text-gray-300">Nome</Label>
              <div className="relative mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

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

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
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
                  Criando conta...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Criar Conta
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-gray-300 text-sm">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                  Fazer login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}