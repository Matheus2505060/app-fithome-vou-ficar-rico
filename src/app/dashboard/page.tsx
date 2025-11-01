"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  LogOut, 
  Crown, 
  Trophy, 
  Flame, 
  Target, 
  Calendar,
  Settings,
  Shield,
  CheckCircle,
  Activity,
  TrendingUp,
  Award
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se usuário está logado
    const token = localStorage.getItem('auth-token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Olá, {user.name}! 👋
                </h1>
                <p className="text-gray-300">
                  Bem-vindo ao seu dashboard pessoal
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Barra de boas-vindas */}
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <h2 className="text-xl font-bold text-green-300">
                    🎉 Conta criada com sucesso!
                  </h2>
                  <p className="text-gray-300">
                    Sua jornada fitness começa agora. Explore todas as funcionalidades disponíveis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-2xl">
            <CardContent className="p-6 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm opacity-90">Calorias Queimadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-0 shadow-2xl">
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm opacity-90">Treinos Realizados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-2xl">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm opacity-90">Metas Atingidas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-2xl">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm opacity-90">Conquistas</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Perfil do Usuário */}
          <Card className="bg-black/30 backdrop-blur-sm border-gray-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">Nome:</span>
                <span className="font-semibold">{user.name}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">E-mail:</span>
                <span className="font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">Membro desde:</span>
                <span className="font-semibold">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">Status:</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ativo
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="bg-black/30 backdrop-blur-sm border-gray-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Ações Rápidas
              </CardTitle>
              <CardDescription className="text-gray-300">
                Acesse rapidamente as principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white justify-start"
                onClick={() => router.push('/')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Iniciar Treino
              </Button>
              <Button 
                variant="outline"
                className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 justify-start"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ver Calendário
              </Button>
              <Button 
                variant="outline"
                className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 justify-start"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Minhas Conquistas
              </Button>
              <Button 
                variant="outline"
                className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 justify-start"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Progresso
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seção Premium */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-300">
              <Crown className="w-6 h-6" />
              Upgrade para Premium
            </CardTitle>
            <CardDescription className="text-gray-300">
              Desbloqueie recursos exclusivos e acelere seus resultados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                <Award className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="font-semibold text-white">Exercícios Exclusivos</p>
                  <p className="text-sm text-gray-300">Acesso a treinos avançados</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                <Shield className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="font-semibold text-white">Planos Personalizados</p>
                  <p className="text-sm text-gray-300">Treinos sob medida</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <div>
                  <p className="font-semibold text-white">Análises Avançadas</p>
                  <p className="text-sm text-gray-300">Relatórios detalhados</p>
                </div>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold">
              <Crown className="w-4 h-4 mr-2" />
              Assinar Premium
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>© 2024 FitHome. Transforme seu corpo, transforme sua vida.</p>
        </div>
      </div>
    </div>
  )
}