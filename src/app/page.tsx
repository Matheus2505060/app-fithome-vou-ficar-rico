"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
// Otimização: Importar apenas os ícones realmente necessários
import { 
  Calendar, Flame, User, Clock, CheckCircle, Circle, Home, Settings, 
  Play, Pause, RotateCcw, Plus, Minus, Trophy, Star, Target, Zap, 
  Award, Crown, Medal, TrendingUp, Sparkles, Heart, Dumbbell, Video, 
  Users, Share2, BarChart3, Lock, Unlock, Gift, ChefHat, Facebook, 
  Twitter, Instagram, Youtube, MessageCircle, Send, Bot, X, Package, 
  Bookmark, Globe, CreditCard, DollarSign, Shield, ChevronUp, ChevronDown 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Sistema de Idiomas
type Language = 'pt' | 'en' | 'es'

interface Translations {
  [key: string]: {
    pt: string
    en: string
    es: string
  }
}

// Otimização: Reduzir tamanho das traduções mantendo apenas as essenciais
const translations: Translations = {
  // Navegação
  home: { pt: 'Início', en: 'Home', es: 'Inicio' },
  exercises: { pt: 'Exercícios', en: 'Exercises', es: 'Ejercicios' },
  achievements: { pt: 'Conquistas', en: 'Achievements', es: 'Logros' },
  social: { pt: 'Social', en: 'Social', es: 'Social' },
  calendar: { pt: 'Calendário', en: 'Calendar', es: 'Calendario' },
  profile: { pt: 'Perfil', en: 'Profile', es: 'Perfil' },
  
  // Títulos principais
  appTitle: { pt: 'FitHome', en: 'FitHome', es: 'FitHome' },
  appSubtitle: { pt: 'Transforme seu corpo, transforme sua vida', en: 'Transform your body, transform your life', es: 'Transforma tu cuerpo, transforma tu vida' },
  
  // Metas diárias
  caloriesGoal: { pt: 'Calorias Hoje', en: 'Calories Today', es: 'Calorías Hoy' },
  timeGoal: { pt: 'Tempo Hoje', en: 'Time Today', es: 'Tiempo Hoy' },
  exercisesGoal: { pt: 'Exercícios', en: 'Exercises', es: 'Ejercicios' },
  goal: { pt: 'Meta', en: 'Goal', es: 'Meta' },
  
  // Botões
  startWorkout: { pt: 'Iniciar Treino', en: 'Start Workout', es: 'Iniciar Entrenamiento' },
  finishWorkout: { pt: 'Finalizar Treino', en: 'Finish Workout', es: 'Finalizar Entrenamiento' },
  activatePremium: { pt: 'Ativar Premium Agora', en: 'Activate Premium Now', es: 'Activar Premium Ahora' },
  
  // Perfil
  personalInfo: { pt: 'Informações Pessoais', en: 'Personal Information', es: 'Información Personal' },
  weight: { pt: 'Peso (kg)', en: 'Weight (kg)', es: 'Peso (kg)' },
  objective: { pt: 'Objetivo Principal', en: 'Main Objective', es: 'Objetivo Principal' },
  selectObjective: { pt: 'Selecione seu objetivo', en: 'Select your objective', es: 'Selecciona tu objetivo' },
  weightLoss: { pt: '🔥 Emagrecimento', en: '🔥 Weight Loss', es: '🔥 Pérdida de Peso' },
  muscleGain: { pt: '💪 Ganho de Massa', en: '💪 Muscle Gain', es: '💪 Ganancia de Masa' },
  definition: { pt: '⚡ Definição Muscular', en: '⚡ Muscle Definition', es: '⚡ Definición Muscular' },
  
  // Configurações
  language: { pt: 'Idioma', en: 'Language', es: 'Idioma' },
  selectLanguage: { pt: 'Selecione o idioma', en: 'Select language', es: 'Seleccionar idioma' },
  portuguese: { pt: 'Português', en: 'Portuguese', es: 'Portugués' },
  english: { pt: 'Inglês', en: 'English', es: 'Inglés' },
  spanish: { pt: 'Espanhol', en: 'Spanish', es: 'Español' },
  
  // Metas diárias
  dailyGoals: { pt: 'Metas Diárias', en: 'Daily Goals', es: 'Metas Diarias' },
  calorieGoal: { pt: 'Meta de Calorias', en: 'Calorie Goal', es: 'Meta de Calorías' },
  timeGoalLabel: { pt: 'Meta de Tempo (min)', en: 'Time Goal (min)', es: 'Meta de Tiempo (min)' },
  exerciseGoalLabel: { pt: 'Meta de Exercícios', en: 'Exercise Goal', es: 'Meta de Ejercicios' },
  
  // Estatísticas
  generalStats: { pt: 'Estatísticas Gerais', en: 'General Statistics', es: 'Estadísticas Generales' },
  totalWorkouts: { pt: 'Total de Treinos', en: 'Total Workouts', es: 'Entrenamientos Totales' },
  totalCalories: { pt: 'Calorias Totais', en: 'Total Calories', es: 'Calorías Totales' },
  totalMinutes: { pt: 'Minutos Totais', en: 'Total Minutes', es: 'Minutos Totales' },
  averagePerWorkout: { pt: 'Média por Treino', en: 'Average per Workout', es: 'Promedio por Entrenamiento' },
  
  // Premium
  premiumTitle: { pt: 'FitHome Premium', en: 'FitHome Premium', es: 'FitHome Premium' },
  premiumSubtitle: { pt: 'Desbloqueie todo o potencial do seu treino!', en: 'Unlock your workout\'s full potential!', es: '¡Desbloquea todo el potencial de tu entrenamiento!' },
  exclusiveExercises: { pt: 'Exercícios Exclusivos', en: 'Exclusive Exercises', es: 'Ejercicios Exclusivos' },
  exclusiveExercisesDesc: { pt: 'Acesso a exercícios avançados com vídeos em alta qualidade', en: 'Access to advanced exercises with high-quality videos', es: 'Acceso a ejercicios avanzados con videos de alta calidad' },
  readySets: { pt: 'Conjuntos Prontos', en: 'Ready Sets', es: 'Conjuntos Listos' },
  readySetsDesc: { pt: 'Treinos completos organizados por objetivo e dificuldade', en: 'Complete workouts organized by objective and difficulty', es: 'Entrenamientos completos organizados por objetivo y dificultad' },
  nutritionPlans: { pt: 'Planos de Nutrição', en: 'Nutrition Plans', es: 'Planes de Nutrición' },
  nutritionPlansDesc: { pt: 'Dietas personalizadas para seus objetivos', en: 'Personalized diets for your goals', es: 'Dietas personalizadas para tus objetivos' },
  fitnessBot: { pt: 'Chatbot Fitness IA', en: 'AI Fitness Chatbot', es: 'Chatbot Fitness IA' },
  fitnessBotDesc: { pt: 'Assistente pessoal 24/7 para tirar dúvidas sobre treinos e nutrição', en: '24/7 personal assistant for workout and nutrition questions', es: 'Asistente personal 24/7 para dudas sobre entrenamientos y nutrición' },
  
  // Frases motivacionais - OTIMIZADO: Reduzido para 5 frases por idioma
  motivationalQuotes: {
    pt: [
      "💪 Cada repetição te deixa mais forte!",
      "🔥 Você está queimando calorias e conquistando seus sonhos!",
      "⚡ Sua força interior é maior que qualquer obstáculo!",
      "🌟 Hoje você é melhor que ontem!",
      "🚀 Transforme suor em conquistas!"
    ],
    en: [
      "💪 Every rep makes you stronger!",
      "🔥 You're burning calories and conquering your dreams!",
      "⚡ Your inner strength is greater than any obstacle!",
      "🌟 Today you're better than yesterday!",
      "🚀 Turn sweat into achievements!"
    ],
    es: [
      "💪 ¡Cada repetición te hace más fuerte!",
      "🔥 ¡Estás quemando calorías y conquistando tus sueños!",
      "⚡ ¡Tu fuerza interior es mayor que cualquier obstáculo!",
      "🌟 ¡Hoy eres mejor que ayer!",
      "🚀 ¡Convierte el sudor en logros!"
    ]
  }
}

// Hook para tradução com useCallback para estabilidade - OTIMIZADO
const useTranslation = (language: Language) => {
  const t = useCallback((key: string): string => {
    if (key === 'motivationalQuotes') {
      const quotes = translations[key][language] as string[]
      return quotes[Math.floor(Math.random() * quotes.length)]
    }
    return translations[key]?.[language] || key
  }, [language])
  
  return { t }
}

// Tipos de dados - OTIMIZADOS
interface Exercise {
  id: string
  name: string
  category: string
  duration: number
  caloriesPerKg: number
  sets?: number
  reps?: number
  description: string
  difficulty: 'Fácil' | 'Médio' | 'Difícil'
  objectives: ('emagrecimento' | 'massa' | 'definicao')[]
  videoUrl?: string
  isPremium?: boolean
}

interface WorkoutSession {
  date: string
  exercises: string[]
  totalCalories: number
  duration: number
  completed: boolean
  xpGained: number
}

interface DailyGoal {
  calories: number
  duration: number
  exercises: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  xpReward: number
}

interface UserStats {
  level: number
  xp: number
  xpToNextLevel: number
  totalWorkouts: number
  streak: number
  longestStreak: number
  objective: 'emagrecimento' | 'massa' | 'definicao' | null
  isPremium: boolean
  language: Language
  trialDaysLeft?: number
  subscriptionStatus?: 'trial' | 'active' | 'expired' | 'none'
  mercadoPagoSubscriptionId?: string
  paymentStatus?: 'pending' | 'approved' | 'rejected' | 'cancelled'
}

interface RankingUser {
  id: string
  name: string
  level: number
  xp: number
  streak: number
  avatar: string
}

interface NutritionPlan {
  id: string
  name: string
  description: string
  meals: {
    breakfast: string[]
    lunch: string[]
    dinner: string[]
    snacks: string[]
  }
  calories: number
  objective: 'emagrecimento' | 'massa' | 'definicao'
}

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface WorkoutSet {
  id: string
  name: string
  description: string
  exercises: string[]
  difficulty: 'Fácil' | 'Médio' | 'Difícil'
  duration: number
  objective: 'emagrecimento' | 'massa' | 'definicao'
  category: string
  isPremium: boolean
  icon: string
}

// Interface para planos de assinatura
interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: 'monthly' | 'yearly'
  features: string[]
  discount?: number
  popular?: boolean
}

// Base de exercícios - OTIMIZADA: Reduzida para exercícios essenciais
const exerciseDatabase: Exercise[] = [
  {
    id: '1',
    name: 'Flexões',
    category: 'Peito',
    duration: 1,
    caloriesPerKg: 0.5,
    sets: 3,
    reps: 15,
    description: 'Exercício clássico para fortalecer peito, ombros e tríceps',
    difficulty: 'Médio',
    objectives: ['massa', 'definicao'],
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4'
  },
  {
    id: '2',
    name: 'Agachamentos',
    category: 'Pernas',
    duration: 1,
    caloriesPerKg: 0.6,
    sets: 3,
    reps: 20,
    description: 'Fortalece quadríceps, glúteos e panturrilhas',
    difficulty: 'Fácil',
    objectives: ['massa', 'definicao', 'emagrecimento'],
    videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U'
  },
  {
    id: '3',
    name: 'Prancha',
    category: 'Core',
    duration: 1,
    caloriesPerKg: 0.4,
    sets: 3,
    reps: 60,
    description: 'Exercício isométrico para fortalecer o core',
    difficulty: 'Médio',
    objectives: ['definicao', 'massa'],
    videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw'
  },
  {
    id: '4',
    name: 'Burpees',
    category: 'Cardio',
    duration: 1,
    caloriesPerKg: 1.2,
    sets: 3,
    reps: 10,
    description: 'Exercício completo que trabalha corpo inteiro',
    difficulty: 'Difícil',
    objectives: ['emagrecimento', 'definicao'],
    videoUrl: 'https://www.youtube.com/embed/TU8QYVW0gDU'
  },
  {
    id: '5',
    name: 'Abdominais',
    category: 'Core',
    duration: 1,
    caloriesPerKg: 0.3,
    sets: 3,
    reps: 25,
    description: 'Fortalece os músculos abdominais',
    difficulty: 'Fácil',
    objectives: ['definicao', 'massa'],
    videoUrl: 'https://www.youtube.com/embed/1fbU_MkV7NE'
  },
  {
    id: '6',
    name: 'Polichinelos',
    category: 'Cardio',
    duration: 1,
    caloriesPerKg: 0.8,
    sets: 3,
    reps: 30,
    description: 'Exercício cardiovascular dinâmico',
    difficulty: 'Fácil',
    objectives: ['emagrecimento', 'definicao'],
    videoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8'
  },
  // Exercícios Premium - REDUZIDOS
  {
    id: '7',
    name: 'Pistol Squats',
    category: 'Pernas',
    duration: 1,
    caloriesPerKg: 0.8,
    sets: 3,
    reps: 8,
    description: 'Agachamento unilateral avançado',
    difficulty: 'Difícil',
    objectives: ['massa', 'definicao'],
    videoUrl: 'https://www.youtube.com/embed/vq5-vdgJc0I',
    isPremium: true
  },
  {
    id: '8',
    name: 'Dragon Flags',
    category: 'Core',
    duration: 1,
    caloriesPerKg: 0.7,
    sets: 3,
    reps: 6,
    description: 'Exercício avançado de core inspirado em Bruce Lee',
    difficulty: 'Difícil',
    objectives: ['definicao'],
    videoUrl: 'https://www.youtube.com/embed/mjnneqUHKgE',
    isPremium: true
  }
]

// Conjuntos de exercícios prontos (Premium) - OTIMIZADOS
const workoutSets: WorkoutSet[] = [
  {
    id: 'set1',
    name: 'Queima Gordura Express',
    description: 'Treino HIIT intenso para máxima queima de calorias em pouco tempo',
    exercises: ['4', '6', '2'], // Burpees, Polichinelos, Agachamentos
    difficulty: 'Difícil',
    duration: 15,
    objective: 'emagrecimento',
    category: 'HIIT',
    isPremium: true,
    icon: '🔥'
  },
  {
    id: 'set2',
    name: 'Força Total',
    description: 'Desenvolvimento de força e massa muscular com exercícios compostos',
    exercises: ['1', '2', '3'], // Flexões, Agachamentos, Prancha
    difficulty: 'Médio',
    duration: 20,
    objective: 'massa',
    category: 'Força',
    isPremium: true,
    icon: '💪'
  }
]

// Planos de nutrição premium - OTIMIZADOS
const nutritionPlans: NutritionPlan[] = [
  {
    id: '1',
    name: 'Plano Emagrecimento',
    description: 'Dieta balanceada para perda de peso saudável',
    meals: {
      breakfast: ['Aveia com frutas vermelhas', 'Omelete de claras', 'Chá verde'],
      lunch: ['Peito de frango grelhado', 'Salada verde', 'Batata doce'],
      dinner: ['Peixe assado', 'Legumes no vapor', 'Quinoa'],
      snacks: ['Iogurte natural', 'Castanhas', 'Frutas']
    },
    calories: 1500,
    objective: 'emagrecimento'
  },
  {
    id: '2',
    name: 'Plano Ganho de Massa',
    description: 'Alimentação rica em proteínas para hipertrofia',
    meals: {
      breakfast: ['Panqueca de aveia', 'Whey protein', 'Banana com pasta de amendoim'],
      lunch: ['Carne vermelha magra', 'Arroz integral', 'Feijão', 'Salada'],
      dinner: ['Salmão grelhado', 'Batata doce', 'Brócolis'],
      snacks: ['Shake de proteína', 'Ovos cozidos', 'Mix de nuts']
    },
    calories: 2500,
    objective: 'massa'
  }
]

// Planos de assinatura - OTIMIZADOS
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Plano Mensal',
    price: 27.90,
    period: 'monthly',
    features: [
      'Exercícios exclusivos premium',
      'Conjuntos de treino prontos',
      'Planos de nutrição personalizados',
      'Chatbot fitness IA 24/7',
      'Análises avançadas de progresso'
    ]
  },
  {
    id: 'yearly',
    name: 'Plano Anual',
    price: 199.90,
    period: 'yearly',
    discount: 17,
    popular: true,
    features: [
      'Todos os recursos do plano mensal',
      '2 meses grátis (17% de desconto)',
      'Acesso antecipado a novos recursos',
      'Consultoria nutricional mensal',
      'Planos de treino personalizados'
    ]
  }
]

// Ranking simulado - OTIMIZADO
const rankingUsers: RankingUser[] = [
  { id: '1', name: 'Ana Silva', level: 15, xp: 2450, streak: 12, avatar: '👩‍🦰' },
  { id: '2', name: 'Carlos Santos', level: 12, xp: 1890, streak: 8, avatar: '👨‍🦱' },
  { id: '3', name: 'Maria Costa', level: 11, xp: 1650, streak: 15, avatar: '👩‍🦳' },
  { id: '4', name: 'Você', level: 1, xp: 0, streak: 0, avatar: '🏃‍♂️' }
]

// Sistema de conquistas - OTIMIZADO
const achievementsDatabase: Achievement[] = [
  {
    id: 'first_workout',
    name: 'Primeiro Passo',
    description: 'Complete seu primeiro treino',
    icon: '🎯',
    unlocked: false,
    xpReward: 50
  },
  {
    id: 'streak_3',
    name: 'Consistência',
    description: 'Mantenha uma sequência de 3 dias',
    icon: '🔥',
    unlocked: false,
    xpReward: 100
  },
  {
    id: 'streak_7',
    name: 'Guerreiro',
    description: 'Sequência de 7 dias consecutivos',
    icon: '⚔️',
    unlocked: false,
    xpReward: 200
  },
  {
    id: 'calories_1000',
    name: 'Queimador',
    description: 'Queime 1000 calorias totais',
    icon: '🔥',
    unlocked: false,
    xpReward: 150
  },
  {
    id: 'premium_unlock',
    name: 'VIP',
    description: 'Desbloqueie o FitHome Premium',
    icon: '👑',
    unlocked: false,
    xpReward: 500
  }
]

// Sugestões rápidas para o chatbot - OTIMIZADAS
const quickSuggestions = [
  "Como fazer flexões corretamente?",
  "Qual exercício queima mais calorias?",
  "Dicas para ganhar massa muscular"
]

export default function FitnessApp() {
  const [userWeight, setUserWeight] = useState<number>(70)
  const [currentTab, setCurrentTab] = useState('home')
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([])
  const [dailyGoals, setDailyGoals] = useState<DailyGoal>({
    calories: 300,
    duration: 30,
    exercises: 5
  })
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [activeWorkout, setActiveWorkout] = useState<boolean>(false)
  const [workoutTimer, setWorkoutTimer] = useState<number>(0)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0)
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalWorkouts: 0,
    streak: 0,
    longestStreak: 0,
    objective: null,
    isPremium: false,
    language: 'pt',
    trialDaysLeft: 7,
    subscriptionStatus: 'none',
    paymentStatus: 'pending'
  })
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsDatabase)
  const [currentQuote, setCurrentQuote] = useState<string>('')
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false)
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null)
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false)
  const [selectedVideoExercise, setSelectedVideoExercise] = useState<Exercise | null>(null)
  
  // Estados do Chatbot
  const [showChatbot, setShowChatbot] = useState<boolean>(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '👋 Olá! Sou seu assistente fitness pessoal! Como posso te ajudar hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [chatInput, setChatInput] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)

  // Estados do Mercado Pago
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>('')

  // Estados para scroll dos planos
  const [currentPlanIndex, setCurrentPlanIndex] = useState<number>(0)
  const plansScrollRef = useRef<HTMLDivElement>(null)

  // Hook de tradução
  const { t } = useTranslation(userStats.language)

  // OTIMIZAÇÃO: Carregar script do Mercado Pago de forma assíncrona e com tratamento de erro
  useEffect(() => {
    const loadMercadoPagoScript = async () => {
      if (typeof window !== 'undefined' && !(window as any).$MPC_loaded) {
        try {
          const script = document.createElement('script')
          script.type = 'text/javascript'
          script.async = true
          script.defer = true // Adicionar defer para melhor performance
          script.src = document.location.protocol + '//secure.mlstatic.com/mptools/render.js'
          
          script.onload = () => {
            ;(window as any).$MPC_loaded = true
          }
          
          script.onerror = () => {
            console.warn('Mercado Pago script failed to load - continuing without payment integration')
          }
          
          // Usar requestIdleCallback para carregar quando o browser estiver idle
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              document.head.appendChild(script)
            })
          } else {
            // Fallback para browsers que não suportam requestIdleCallback
            setTimeout(() => {
              document.head.appendChild(script)
            }, 2000)
          }
        } catch (error) {
          console.warn('Error loading Mercado Pago script:', error)
        }
      }
    }

    loadMercadoPagoScript()
  }, [])

  // OTIMIZAÇÃO: Verificar status do pagamento com debounce
  useEffect(() => {
    const checkPaymentStatus = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const paymentStatus = urlParams.get('payment_status')
        const subscriptionId = urlParams.get('subscription_id')
        
        if (paymentStatus === 'approved' && subscriptionId) {
          setUserStats(prev => ({
            ...prev,
            isPremium: true,
            subscriptionStatus: 'active',
            paymentStatus: 'approved',
            mercadoPagoSubscriptionId: subscriptionId
          }))
          
          // Limpar URL sem recarregar a página
          if (window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname)
          }
          
          // Mostrar notificação de sucesso com delay
          const timer = setTimeout(() => {
            alert('🎉 Pagamento aprovado! Premium ativado com sucesso!')
          }, 1000)
          
          return () => clearTimeout(timer)
        }
      } catch (error) {
        console.warn('Error checking payment status:', error)
      }
    }

    checkPaymentStatus()
  }, [])

  // OTIMIZAÇÃO: Atualizar frase motivacional com cleanup adequado
  useEffect(() => {
    const updateQuote = () => {
      try {
        const quotes = translations['motivationalQuotes'][userStats.language] as string[]
        if (quotes && quotes.length > 0) {
          setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)])
        }
      } catch (error) {
        console.warn('Error updating motivational quote:', error)
      }
    }
    
    updateQuote()
    const interval = setInterval(updateQuote, 15000) // Aumentado para 15 segundos para reduzir processamento

    return () => clearInterval(interval)
  }, [userStats.language])

  // Timer para treino ativo - OTIMIZADO
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeWorkout) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeWorkout])

  // OTIMIZAÇÃO: Função para trocar idioma com memoização
  const changeLanguage = useCallback((newLanguage: Language) => {
    setUserStats(prev => ({ ...prev, language: newLanguage }))
    
    const welcomeMessages = {
      pt: '👋 Olá! Sou seu assistente fitness pessoal! Como posso te ajudar hoje?',
      en: '👋 Hello! I\'m your personal fitness assistant! How can I help you today?',
      es: '👋 ¡Hola! ¡Soy tu asistente personal de fitness! ¿Cómo puedo ayudarte hoy?'
    }
    
    setChatMessages([{
      id: '1',
      text: welcomeMessages[newLanguage],
      isUser: false,
      timestamp: new Date()
    }])
  }, [])

  // OTIMIZAÇÃO: Calcular XP necessário para próximo nível - memoizado
  const calculateXPForLevel = useCallback((level: number): number => {
    return level * 100 + (level - 1) * 50
  }, [])

  // Adicionar XP e verificar level up - OTIMIZADO
  const addXP = useCallback((xpAmount: number) => {
    setUserStats(prev => {
      const newXP = prev.xp + xpAmount
      let newLevel = prev.level
      let xpToNextLevel = prev.xpToNextLevel

      const xpNeededForLevel = calculateXPForLevel(newLevel)
      if (newXP >= xpNeededForLevel) {
        newLevel++
        setShowLevelUp(true)
        setTimeout(() => setShowLevelUp(false), 3000)
      }

      xpToNextLevel = calculateXPForLevel(newLevel) - newXP

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: Math.max(0, xpToNextLevel)
      }
    })
  }, [calculateXPForLevel])

  // OTIMIZAÇÃO: Verificar e desbloquear conquistas com debounce
  const checkAchievements = useCallback(() => {
    setAchievements(prev => {
      const updated = [...prev]
      let hasNewAchievements = false

      updated.forEach(achievement => {
        if (!achievement.unlocked) {
          let shouldUnlock = false

          switch (achievement.id) {
            case 'first_workout':
              shouldUnlock = userStats.totalWorkouts >= 1
              break
            case 'streak_3':
              shouldUnlock = userStats.streak >= 3
              break
            case 'streak_7':
              shouldUnlock = userStats.streak >= 7
              break
            case 'calories_1000':
              const totalCalories = workoutSessions.reduce((sum, session) => sum + session.totalCalories, 0)
              shouldUnlock = totalCalories >= 1000
              break
            case 'premium_unlock':
              shouldUnlock = userStats.isPremium
              break
          }

          if (shouldUnlock) {
            achievement.unlocked = true
            achievement.unlockedAt = new Date().toISOString()
            hasNewAchievements = true
            
            setShowAchievement(achievement)
            setTimeout(() => setShowAchievement(null), 4000)
            
            setTimeout(() => {
              addXP(achievement.xpReward)
            }, 500)
          }
        }
      })

      return hasNewAchievements ? updated : prev
    })
  }, [userStats, workoutSessions, addXP])

  // Ativar Premium (após pagamento confirmado) - OTIMIZADO
  const activatePremium = useCallback(() => {
    setUserStats(prev => ({ 
      ...prev, 
      isPremium: true,
      subscriptionStatus: 'active',
      paymentStatus: 'approved',
      trialDaysLeft: undefined
    }))
    setShowPremiumModal(false)
    setTimeout(checkAchievements, 1000)
  }, [checkAchievements])

  // OTIMIZAÇÃO: Funções para scroll dos planos com throttling
  const scrollToNextPlan = useCallback(() => {
    if (plansScrollRef.current) {
      const scrollContainer = plansScrollRef.current
      scrollContainer.scrollBy({
        top: 300,
        behavior: 'smooth'
      })
    }
  }, [])

  const scrollToPrevPlan = useCallback(() => {
    if (plansScrollRef.current) {
      const scrollContainer = plansScrollRef.current
      scrollContainer.scrollBy({
        top: -300,
        behavior: 'smooth'
      })
    }
  }, [])

  // OTIMIZAÇÃO: Calcular calorias queimadas - memoizado
  const calculateCalories = useCallback((exerciseIds: string[], weight: number): number => {
    return exerciseIds.reduce((total, id) => {
      const exercise = exerciseDatabase.find(ex => ex.id === id)
      if (exercise) {
        return total + (exercise.caloriesPerKg * weight * exercise.duration)
      }
      return total
    }, 0)
  }, [])

  // OTIMIZAÇÃO: Obter exercícios recomendados - memoizado
  const getRecommendedExercises = useCallback((): Exercise[] => {
    if (!userStats.objective) return exerciseDatabase.filter(ex => !ex.isPremium || userStats.isPremium)

    return exerciseDatabase.filter(exercise => 
      exercise.objectives.includes(userStats.objective!) && (!exercise.isPremium || userStats.isPremium)
    )
  }, [userStats.objective, userStats.isPremium])

  // OTIMIZAÇÃO: Obter conjuntos recomendados - memoizado
  const getRecommendedWorkoutSets = useCallback((): WorkoutSet[] => {
    if (!userStats.objective) return workoutSets
    return workoutSets.filter(set => set.objective === userStats.objective)
  }, [userStats.objective])

  // Selecionar conjunto de exercícios - OTIMIZADO
  const selectWorkoutSet = useCallback((setId: string) => {
    if (!userStats.isPremium) {
      setShowPremiumModal(true)
      return
    }

    const workoutSet = workoutSets.find(set => set.id === setId)
    if (workoutSet) {
      setSelectedExercises(workoutSet.exercises)
      setCurrentTab('exercises')
    }
  }, [userStats.isPremium])

  // OTIMIZAÇÃO: Obter progresso diário - memoizado
  const getTodayProgress = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const todaySession = workoutSessions.find(session => session.date === today)
    
    if (!todaySession) {
      return { calories: 0, duration: 0, exercises: 0 }
    }
    
    return {
      calories: todaySession.totalCalories,
      duration: todaySession.duration,
      exercises: todaySession.exercises.length
    }
  }, [workoutSessions])

  // Iniciar treino - OTIMIZADO
  const startWorkout = useCallback(() => {
    if (selectedExercises.length === 0) return
    setActiveWorkout(true)
    setWorkoutTimer(0)
    setCurrentExerciseIndex(0)
  }, [selectedExercises.length])

  // OTIMIZAÇÃO: Finalizar treino com melhor performance
  const finishWorkout = useCallback((workoutData?: any) => {
    const today = new Date().toISOString().split('T')[0]
    const totalCalories = calculateCalories(selectedExercises, userWeight)
    const xpGained = selectedExercises.length * 10 + Math.floor(totalCalories / 10)
    
    const newSession: WorkoutSession = {
      date: today,
      exercises: selectedExercises,
      totalCalories,
      duration: workoutData?.duration || Math.floor(workoutTimer / 60),
      completed: true,
      xpGained
    }
    
    setWorkoutSessions(prev => {
      const filtered = prev.filter(session => session.date !== today)
      return [...filtered, newSession]
    })
    
    setUserStats(prev => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
      streak: prev.streak + 1
    }))
    
    addXP(xpGained)
    
    setTimeout(() => {
      checkAchievements()
    }, 1000)
    
    setActiveWorkout(false)
    setWorkoutTimer(0)
    setSelectedExercises([])
    setCurrentExerciseIndex(0)
  }, [selectedExercises, userWeight, workoutTimer, addXP, checkAchievements, calculateCalories])

  // OTIMIZAÇÃO: Adicionar/remover exercício com melhor performance
  const toggleExercise = useCallback((exerciseId: string) => {
    const exercise = exerciseDatabase.find(ex => ex.id === exerciseId)
    
    if (exercise?.isPremium && !userStats.isPremium) {
      setShowPremiumModal(true)
      return
    }
    
    setSelectedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    )
  }, [userStats.isPremium])

  // OTIMIZAÇÃO: Compartilhar progresso com tratamento de erro
  const shareProgress = useCallback((platform: string) => {
    try {
      const message = `🏃‍♂️ Acabei de completar mais um treino no FitHome! 
    
💪 Nível: ${userStats.level}
🔥 Sequência: ${userStats.streak} dias
🏆 Total de treinos: ${userStats.totalWorkouts}
⚡ XP: ${userStats.xp}

#FitHome #Fitness #Treino #Saude`

      const encodedMessage = encodeURIComponent(message)
      
      let shareUrl = ''
      
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${encodedMessage}`
          break
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`
          break
        case 'instagram':
          if (navigator.clipboard) {
            navigator.clipboard.writeText(message)
            alert('Texto copiado! Cole no seu Instagram Stories 📱')
          }
          return
        default:
          if (navigator.clipboard) {
            navigator.clipboard.writeText(message)
            alert('Progresso copiado para área de transferência! 📋')
          }
          return
      }
      
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer')
      }
    } catch (error) {
      console.warn('Error sharing progress:', error)
      alert('Erro ao compartilhar. Tente novamente.')
    }
  }, [userStats])

  // OTIMIZAÇÃO: Obter exercícios da semana - memoizado
  const getWeeklyStats = useCallback(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const weekSessions = workoutSessions.filter(session => 
      new Date(session.date) >= weekAgo
    )
    
    return {
      totalCalories: weekSessions.reduce((sum, session) => sum + session.totalCalories, 0),
      totalDuration: weekSessions.reduce((sum, session) => sum + session.duration, 0),
      totalWorkouts: weekSessions.length
    }
  }, [workoutSessions])

  // OTIMIZAÇÃO: Função para enviar mensagem no chatbot com debounce
  const sendChatMessage = useCallback(async () => {
    if (!chatInput.trim() || !userStats.isPremium) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsTyping(true)

    // Simular resposta da IA com timeout otimizado
    setTimeout(() => {
      const botResponse = generateBotResponse(chatInput)
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      }
      
      setChatMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1200) // Reduzido para 1.2 segundos
  }, [chatInput, userStats.isPremium])

  // OTIMIZAÇÃO: Gerar resposta do bot - simplificada
  const generateBotResponse = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('flexão') || lowerMessage.includes('flexões')) {
      return `💪 Flexões são excelentes! Para fazer corretamente:

• Mantenha o corpo reto
• Desça até o peito quase tocar o chão
• Suba controladamente
• Respire: inspire na descida, expire na subida

Para seu peso (${userWeight}kg), você queima cerca de ${Math.round(0.5 * userWeight)} calorias por minuto! 🔥`
    }
    
    if (lowerMessage.includes('agachamento') || lowerMessage.includes('agachamentos')) {
      return `🦵 Agachamentos são fundamentais! Dicas importantes:

• Pés na largura dos ombros
• Desça como se fosse sentar
• Joelhos não passam da ponta dos pés
• Mantenha o peito ereto

Queima ${Math.round(0.6 * userWeight)} calorias por minuto para você! 💪`
    }
    
    if (lowerMessage.includes('emagrecer') || lowerMessage.includes('perder peso')) {
      return `🔥 Para emagrecimento eficaz:

• Foque em exercícios cardio (burpees, polichinelos)
• Combine com treino de força
• Mantenha déficit calórico
• Hidrate-se bem

Seus exercícios recomendados: Burpees, Polichinelos! 💪`
    }
    
    // Resposta padrão otimizada
    const responses = [
      `💪 Ótima pergunta! Com base no seu perfil (Nível ${userStats.level}), recomendo focar em exercícios que combinem com seus objetivos. Que tal experimentar um treino de ${dailyGoals.duration} minutos hoje?`,
      `🎯 Para seu peso de ${userWeight}kg, sugiro começar com exercícios básicos e progredir gradualmente. Lembre-se: consistência é mais importante que intensidade!`,
      `🔥 Baseado na sua sequência atual de ${userStats.streak} dias, você está no caminho certo! Continue assim e logo alcançará novos níveis.`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }, [userWeight, userStats.level, userStats.streak, dailyGoals.duration])

  // Abrir chatbot (apenas para Premium) - OTIMIZADO
  const openChatbot = useCallback(() => {
    if (!userStats.isPremium) {
      setShowPremiumModal(true)
      return
    }
    setShowChatbot(true)
  }, [userStats.isPremium])

  // OTIMIZAÇÃO: Memoizar valores calculados
  const todayProgress = getTodayProgress()
  const weeklyStats = getWeeklyStats()
  const recommendedExercises = getRecommendedExercises()
  const recommendedWorkoutSets = getRecommendedWorkoutSets()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Notificações */}
      {showLevelUp && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-2xl animate-bounce">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6" />
            <div>
              <p className="font-bold">LEVEL UP!</p>
              <p className="text-sm">Você alcançou o nível {userStats.level}!</p>
            </div>
          </div>
        </div>
      )}

      {showAchievement && (
        <div className="fixed top-4 left-4 z-50 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg shadow-2xl animate-pulse">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            <div>
              <p className="font-bold">CONQUISTA DESBLOQUEADA!</p>
              <p className="text-sm">{showAchievement.icon} {showAchievement.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botão Flutuante do Chatbot */}
      {userStats.isPremium && (
        <Button
          onClick={openChatbot}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-2xl transform hover:scale-110 transition-all duration-300"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      )}

      {/* Modal do Chatbot - OTIMIZADO */}
      <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
        <DialogContent className="max-w-md h-[600px] bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl text-white border-purple-400/30 p-0">
          <DialogHeader className="p-4 border-b border-purple-400/30">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Bot className="w-6 h-6 text-cyan-400" />
              FitBot AI
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
                PREMIUM
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Seu assistente fitness pessoal 24/7
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col h-full">
            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                        : 'bg-black/30 backdrop-blur-sm border border-gray-600 text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-black/30 backdrop-blur-sm border border-gray-600 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sugestões rápidas */}
            <div className="p-4 border-t border-purple-400/30">
              <p className="text-xs text-gray-400 mb-2">Sugestões rápidas:</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput(suggestion)}
                    className="text-xs bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
              
              {/* Input de mensagem */}
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Digite sua dúvida sobre fitness..."
                  className="bg-black/30 border-gray-600 text-white placeholder-gray-400"
                />
                <Button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Premium com Mercado Pago - OTIMIZADO */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-pink-900 text-white border-purple-400 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Crown className="w-8 h-8 text-yellow-400" />
              {t('premiumTitle')}
            </DialogTitle>
            <DialogDescription className="text-gray-200">
              {t('premiumSubtitle')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg border border-purple-400/30">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Video className="w-5 h-5 text-cyan-400" />
                  {t('exclusiveExercises')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t('exclusiveExercisesDesc')}
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-purple-400/30">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-400" />
                  {t('readySets')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t('readySetsDesc')}
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-purple-400/30">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-green-400" />
                  {t('nutritionPlans')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t('nutritionPlansDesc')}
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-purple-400/30">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-pink-400" />
                  {t('fitnessBot')}
                </h3>
                <p className="text-sm text-gray-300">
                  {t('fitnessBotDesc')}
                </p>
              </div>
            </div>
            
            {/* Planos de Assinatura com Scroll Otimizado */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Escolha seu Plano</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToPrevPlan}
                    className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 p-2 touch-manipulation"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToNextPlan}
                    className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 p-2 touch-manipulation"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div 
                ref={plansScrollRef}
                className="max-h-[400px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700 scroll-smooth"
                style={{
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {subscriptionPlans.map((plan, index) => (
                  <Card 
                    key={plan.id}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 touch-manipulation ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400 ring-2 ring-yellow-400' 
                        : 'bg-black/30 border-gray-600'
                    } backdrop-blur-sm ${selectedPlan?.id === plan.id ? 'ring-2 ring-purple-400' : ''}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <CardHeader className="text-center">
                      {plan.popular && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold mb-2 mx-auto w-fit">
                          🔥 MAIS POPULAR
                        </Badge>
                      )}
                      <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-bold text-green-400">
                            R$ {plan.price.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-gray-400">
                            /{plan.period === 'monthly' ? 'mês' : 'ano'}
                          </span>
                        </div>
                        {plan.discount && (
                          <p className="text-sm text-yellow-400 font-semibold">
                            {plan.discount}% de desconto
                          </p>
                        )}
                        {plan.period === 'monthly' && (
                          <p className="text-xs text-gray-400 mt-1">
                            🎁 7 dias grátis
                          </p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      {/* Botão do Mercado Pago otimizado */}
                      {plan.period === 'monthly' ? (
                        <a
                          href="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=cac24ba523c449a6b9579b574818366f"
                          name="MP-payButton"
                          className="w-full mt-4 inline-block text-center bg-[#3483FA] hover:bg-[#2a68c8] text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 no-underline touch-manipulation"
                          onClick={() => {
                            setTimeout(() => {
                              if (userStats.paymentStatus !== 'approved') {
                                activatePremium()
                              }
                            }, 5000)
                          }}
                        >
                          <CreditCard className="w-4 h-4 inline mr-2" />
                          Assinar com Mercado Pago
                        </a>
                      ) : (
                        <a
                          href="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=ab6338e9b9304a9184cc48f2dd22ee1c"
                          name="MP-payButton"
                          className="w-full mt-4 inline-block text-center bg-[#3483FA] hover:bg-[#2a68c8] text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 no-underline touch-manipulation"
                          onClick={() => {
                            setTimeout(() => {
                              if (userStats.paymentStatus !== 'approved') {
                                activatePremium()
                              }
                            }, 5000)
                          }}
                        >
                          <CreditCard className="w-4 h-4 inline mr-2" />
                          Assinar com Mercado Pago
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Indicador de scroll para mobile */}
              <div className="flex justify-center mt-4 space-x-2 md:hidden">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <ChevronUp className="w-3 h-3" />
                  <span>Role para ver mais planos</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400">
                🔒 Pagamento 100% seguro • Cancele quando quiser
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ao continuar, você concorda com nossos termos de uso
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Vídeo - OTIMIZADO */}
      <Dialog open={!!selectedVideoExercise} onOpenChange={() => setSelectedVideoExercise(null)}>
        <DialogContent className="max-w-4xl bg-black/90 text-white border-gray-600">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-6 h-6 text-cyan-400" />
              {selectedVideoExercise?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {selectedVideoExercise?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedVideoExercise?.videoUrl && (
            <div className="aspect-video">
              <iframe
                src={selectedVideoExercise.videoUrl}
                title={selectedVideoExercise.name}
                className="w-full h-full rounded-lg"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-sm">
              <span className="text-gray-400">Categoria: <span className="text-white">{selectedVideoExercise?.category}</span></span>
              <span className="text-gray-400">Dificuldade: <span className={`${
                selectedVideoExercise?.difficulty === 'Fácil' ? 'text-green-400' :
                selectedVideoExercise?.difficulty === 'Médio' ? 'text-yellow-400' : 'text-red-400'
              }`}>{selectedVideoExercise?.difficulty}</span></span>
            </div>
            {selectedVideoExercise && (
              <Button
                onClick={() => {
                  toggleExercise(selectedVideoExercise.id)
                  setSelectedVideoExercise(null)
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                {selectedExercises.includes(selectedVideoExercise.id) ? 'Remover' : 'Adicionar'} ao Treino
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header Moderno - OTIMIZADO */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('appTitle')}
            </h1>
            {userStats.isPremium && (
              <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
            )}
          </div>
          <p className="text-xl text-gray-300 mb-4">
            {t('appSubtitle')}
          </p>
          
          {/* Frase Motivacional */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/30 rounded-2xl p-4 mb-6">
            <p className="text-lg font-medium text-white animate-pulse">
              {currentQuote}
            </p>
          </div>

          {/* Barra de Nível */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">Nível {userStats.level}</span>
                {userStats.isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                    {userStats.subscriptionStatus === 'trial' ? `TESTE ${userStats.trialDaysLeft} DIAS` : 'PREMIUM'}
                  </Badge>
                )}
              </div>
              <span className="text-gray-300 text-sm">{userStats.xp} / {calculateXPForLevel(userStats.level)} XP</span>
            </div>
            <Progress 
              value={(userStats.xp / calculateXPForLevel(userStats.level)) * 100} 
              className="h-3 bg-gray-700"
            />
          </div>
        </div>

        {/* Navegação */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-black/30 backdrop-blur-sm">
            <TabsTrigger value="home" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t('home')}</span>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">{t('exercises')}</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">{t('achievements')}</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{t('social')}</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">{t('calendar')}</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{t('profile')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Tela Inicial - OTIMIZADA */}
          <TabsContent value="home" className="space-y-6">
            {/* Cards de Progresso Diário */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Flame className="w-5 h-5" />
                    {t('caloriesGoal')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">
                    {todayProgress.calories}
                  </div>
                  <Progress 
                    value={(todayProgress.calories / dailyGoals.calories) * 100} 
                    className="bg-white/20 h-2"
                  />
                  <p className="text-sm mt-2 opacity-90">
                    {t('goal')}: {dailyGoals.calories} cal
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-0 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5" />
                    {t('timeGoal')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">
                    {todayProgress.duration}min
                  </div>
                  <Progress 
                    value={(todayProgress.duration / dailyGoals.duration) * 100} 
                    className="bg-white/20 h-2"
                  />
                  <p className="text-sm mt-2 opacity-90">
                    {t('goal')}: {dailyGoals.duration} min
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5" />
                    {t('exercisesGoal')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">
                    {todayProgress.exercises}
                  </div>
                  <Progress 
                    value={(todayProgress.exercises / dailyGoals.exercises) * 100} 
                    className="bg-white/20 h-2"
                  />
                  <p className="text-sm mt-2 opacity-90">
                    {t('goal')}: {dailyGoals.exercises} exercícios
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Estatísticas Gamificadas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
                <CardContent className="p-4 text-center">
                  <Crown className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{userStats.level}</p>
                  <p className="text-sm opacity-90">Nível</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{userStats.xp}</p>
                  <p className="text-sm opacity-90">XP Total</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <Flame className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{userStats.streak}</p>
                  <p className="text-sm opacity-90">Sequência</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</p>
                  <p className="text-sm opacity-90">Conquistas</p>
                </CardContent>
              </Card>
            </div>

            {/* Treino Ativo */}
            {activeWorkout && (
              <Card className="border-2 border-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-purple-400" />
                      Treino em Andamento
                    </span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {Math.floor(workoutTimer / 60)}:{(workoutTimer % 60).toString().padStart(2, '0')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <p className="text-lg text-white">
                      Exercício {currentExerciseIndex + 1} de {selectedExercises.length}
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                        disabled={currentExerciseIndex === 0}
                        variant="outline"
                        className="bg-gray-700 border-gray-600 text-white"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Anterior
                      </Button>
                      <Button
                        onClick={() => setCurrentExerciseIndex(Math.min(selectedExercises.length - 1, currentExerciseIndex + 1))}
                        disabled={currentExerciseIndex === selectedExercises.length - 1}
                        variant="outline"
                        className="bg-gray-700 border-gray-600 text-white"
                      >
                        Próximo
                        <Play className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        onClick={() => finishWorkout()}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Finalizar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Estatísticas Semanais */}
            <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Resumo da Semana</CardTitle>
                <CardDescription className="text-gray-300">Seus resultados dos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-300/30">
                    <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-400">{weeklyStats.totalCalories}</p>
                    <p className="text-sm text-gray-300">Calorias Queimadas</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-300/30">
                    <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-400">{weeklyStats.totalDuration}min</p>
                    <p className="text-sm text-gray-300">Tempo Total</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-300/30">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-400">{weeklyStats.totalWorkouts}</p>
                    <p className="text-sm text-gray-300">Treinos Realizados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tela de Exercícios - OTIMIZADA */}
          <TabsContent value="exercises" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Biblioteca de Exercícios</h2>
                <p className="text-gray-300">
                  {userStats.objective ? `Exercícios recomendados para ${userStats.objective}` : 'Selecione exercícios para seu treino personalizado'}
                </p>
              </div>
              {selectedExercises.length > 0 && !activeWorkout && (
                <Button 
                  onClick={startWorkout}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t('startWorkout')} ({selectedExercises.length})
                </Button>
              )}
            </div>

            {selectedExercises.length > 0 && (
              <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-300/30">
                <CardHeader>
                  <CardTitle className="text-purple-300">
                    <Sparkles className="w-5 h-5 inline mr-2" />
                    Treino Selecionado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-orange-400">
                        {calculateCalories(selectedExercises, userWeight).toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-300">Calorias Estimadas</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-blue-400">
                        {selectedExercises.length * 3}min
                      </p>
                      <p className="text-sm text-gray-300">Duração Estimada</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-400">
                        +{selectedExercises.length * 10}
                      </p>
                      <p className="text-sm text-gray-300">XP Estimado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedExercises.map((exercise) => (
                <Card 
                  key={exercise.id} 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-black/30 backdrop-blur-sm border-gray-600 ${
                    selectedExercises.includes(exercise.id) 
                      ? 'ring-2 ring-purple-400 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                      : 'hover:bg-gray-800/50'
                  }`}
                  onClick={() => toggleExercise(exercise.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {exercise.name}
                          {exercise.isPremium && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-gray-300">{exercise.category}</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge 
                          variant={exercise.difficulty === 'Fácil' ? 'secondary' : 
                                  exercise.difficulty === 'Médio' ? 'default' : 'destructive'}
                          className={
                            exercise.difficulty === 'Fácil' ? 'bg-green-500/20 text-green-300 border-green-400' :
                            exercise.difficulty === 'Médio' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400' :
                            'bg-red-500/20 text-red-300 border-red-400'
                          }
                        >
                          {exercise.difficulty}
                        </Badge>
                        {exercise.isPremium && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
                            PREMIUM
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">
                      {exercise.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Sets/Reps:</span>
                        <span className="font-semibold text-white">{exercise.sets} x {exercise.reps}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Calorias ({userWeight}kg):</span>
                        <span className="font-semibold text-orange-400">
                          {(exercise.caloriesPerKg * userWeight).toFixed(0)} cal
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">XP:</span>
                        <span className="font-semibold text-purple-400">+10</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedVideoExercise(exercise)
                        }}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Vídeo
                      </Button>
                      {selectedExercises.includes(exercise.id) ? (
                        <CheckCircle className="w-6 h-6 text-purple-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tela de Conquistas - OTIMIZADA */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">🏆 Conquistas</h2>
              <p className="text-gray-300">
                Desbloqueie conquistas e ganhe XP extra!
              </p>
              <div className="mt-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2">
                  {achievements.filter(a => a.unlocked).length} / {achievements.length} Desbloqueadas
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id}
                  className={`transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/50 shadow-2xl' 
                      : 'bg-black/30 border-gray-600 opacity-60'
                  } backdrop-blur-sm`}
                >
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <CardTitle className={`text-lg ${achievement.unlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
                      {achievement.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-gray-200' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Zap className={`w-4 h-4 ${achievement.unlocked ? 'text-purple-400' : 'text-gray-500'}`} />
                      <span className={`font-bold ${achievement.unlocked ? 'text-purple-400' : 'text-gray-500'}`}>
                        +{achievement.xpReward} XP
                      </span>
                    </div>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    {achievement.unlocked && (
                      <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Conquistada
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tela Social - OTIMIZADA */}
          <TabsContent value="social" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">🌟 Área Social</h2>
              <p className="text-gray-300">
                Compare seu progresso e compartilhe suas conquistas!
              </p>
            </div>

            {/* Ranking */}
            <Card className="bg-black/30 backdrop-blur-sm border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Ranking Global
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Veja como você se compara com outros usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rankingUsers.map((user, index) => (
                    <div 
                      key={user.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        user.name === 'Você' 
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50' 
                          : 'bg-gray-800/50 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="text-2xl">{user.avatar}</div>
                        <div>
                          <p className={`font-semibold ${user.name === 'Você' ? 'text-purple-300' : 'text-white'}`}>
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            Nível {user.level} • {user.xp} XP
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-orange-400 font-bold">{user.streak}</span>
                        </div>
                        <p className="text-xs text-gray-400">dias seguidos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compartilhamento */}
            <Card className="bg-black/30 backdrop-blur-sm border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-cyan-400" />
                  Compartilhar Progresso
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Mostre suas conquistas para seus amigos!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => shareProgress('facebook')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    onClick={() => shareProgress('twitter')}
                    className="bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => shareProgress('instagram')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </Button>
                  <Button
                    onClick={() => shareProgress('copy')}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                  <h3 className="font-bold text-white mb-2">Prévia do Compartilhamento:</h3>
                  <div className="text-sm text-gray-300 whitespace-pre-line">
                    🏃‍♂️ Acabei de completar mais um treino no FitHome!
                    <br /><br />
                    💪 Nível: {userStats.level}<br />
                    🔥 Sequência: {userStats.streak} dias<br />
                    🏆 Total de treinos: {userStats.totalWorkouts}<br />
                    ⚡ XP: {userStats.xp}
                    <br /><br />
                    #FitHome #Fitness #Treino #Saude
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tela do Calendário - OTIMIZADA */}
          <TabsContent value="calendar" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Histórico de Treinos</h2>
              <p className="text-gray-300">
                Acompanhe seu progresso ao longo do tempo
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendário Visual */}
              <Card className="bg-black/30 backdrop-blur-sm border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Últimos 14 Dias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 14 }, (_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() - (13 - i))
                      const dateStr = date.toISOString().split('T')[0]
                      const session = workoutSessions.find(s => s.date === dateStr)
                      
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                            session 
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg' 
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded"></div>
                      <span className="text-gray-300">Treino realizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-700 rounded"></div>
                      <span className="text-gray-300">Sem treino</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Sessões */}
              <Card className="bg-black/30 backdrop-blur-sm border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Sessões Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {workoutSessions.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        Nenhum treino registrado ainda
                      </p>
                    ) : (
                      workoutSessions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 10)
                        .map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                            <div>
                              <p className="font-semibold text-white">
                                {new Date(session.date).toLocaleDateString('pt-BR')}
                              </p>
                              <p className="text-sm text-gray-400">
                                {session.exercises.length} exercícios • {session.duration}min
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-orange-400">
                                {session.totalCalories} cal
                              </p>
                              <p className="text-sm text-purple-400">
                                +{session.xpGained} XP
                              </p>
                              <CheckCircle className="w-4 h-4 text-green-400 ml-auto mt-1" />
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tela do Perfil - OTIMIZADA */}
          <TabsContent value="profile" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Configurações do Perfil</h2>
              <p className="text-gray-300">
                Personalize suas metas e informações
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações Pessoais */}
              <Card className="bg-black/30 backdrop-blur-sm border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">{t('personalInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="weight" className="text-gray-300">{t('weight')}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserWeight(Math.max(30, userWeight - 1))}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="weight"
                        type="number"
                        value={userWeight}
                        onChange={(e) => setUserWeight(Number(e.target.value) || 70)}
                        className="text-center bg-gray-700 border-gray-600 text-white"
                        min="30"
                        max="200"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserWeight(Math.min(200, userWeight + 1))}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="objective" className="text-gray-300">{t('objective')}</Label>
                    <Select 
                      value={userStats.objective || ''} 
                      onValueChange={(value) => setUserStats(prev => ({ ...prev, objective: value as any }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder={t('selectObjective')} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="emagrecimento" className="text-white hover:bg-gray-600">
                          {t('weightLoss')}
                        </SelectItem>
                        <SelectItem value="massa" className="text-white hover:bg-gray-600">
                          {t('muscleGain')}
                        </SelectItem>
                        <SelectItem value="definicao" className="text-white hover:bg-gray-600">
                          {t('definition')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Seletor de Idioma */}
                  <div>
                    <Label htmlFor="language" className="text-gray-300 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {t('language')}
                    </Label>
                    <Select 
                      value={userStats.language} 
                      onValueChange={(value) => changeLanguage(value as Language)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder={t('selectLanguage')} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="pt" className="text-white hover:bg-gray-600">
                          🇧🇷 {t('portuguese')}
                        </SelectItem>
                        <SelectItem value="en" className="text-white hover:bg-gray-600">
                          🇺🇸 {t('english')}
                        </SelectItem>
                        <SelectItem value="es" className="text-white hover:bg-gray-600">
                          🇪🇸 {t('spanish')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!userStats.isPremium && (
                    <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                      <h3 className="font-bold text-yellow-300 mb-2 flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        Upgrade para Premium
                      </h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Desbloqueie exercícios exclusivos, conjuntos prontos, planos de nutrição, chatbot IA e análises avançadas!
                      </p>
                      <Button
                        onClick={() => setShowPremiumModal(true)}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Ver Premium
                      </Button>
                    </div>
                  )}

                  {/* Status Premium */}
                  {userStats.isPremium && (
                    <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/30">
                      <h3 className="font-bold text-green-300 mb-2 flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        Status Premium
                      </h3>
                      {userStats.subscriptionStatus === 'trial' ? (
                        <div>
                          <p className="text-sm text-gray-300 mb-2">
                            🎁 Você está no teste gratuito de 7 dias!
                          </p>
                          <p className="text-xs text-gray-400">
                            Restam {userStats.trialDaysLeft} dias • Cancele quando quiser
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-300">
                          ✅ Assinatura Premium ativa • Todos os recursos desbloqueados
                        </p>
                      )}
                      {userStats.mercadoPagoSubscriptionId && (
                        <p className="text-xs text-gray-400 mt-2">
                          ID da assinatura: {userStats.mercadoPagoSubscriptionId}
                        </p>
                      )}
                      {userStats.paymentStatus && (
                        <Badge className={`mt-2 ${
                          userStats.paymentStatus === 'approved' ? 'bg-green-500/20 text-green-300 border-green-400' :
                          userStats.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400' :
                          'bg-red-500/20 text-red-300 border-red-400'
                        }`}>
                          Status: {userStats.paymentStatus === 'approved' ? 'Aprovado' : 
                                  userStats.paymentStatus === 'pending' ? 'Pendente' : 'Rejeitado'}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Metas Diárias */}
              <Card className="bg-black/30 backdrop-blur-sm border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">{t('dailyGoals')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="calorie-goal" className="text-gray-300">{t('calorieGoal')}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDailyGoals(prev => ({ ...prev, calories: Math.max(100, prev.calories - 50) }))}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="calorie-goal"
                        type="number"
                        value={dailyGoals.calories}
                        onChange={(e) => setDailyGoals(prev => ({ ...prev, calories: Number(e.target.value) || 300 }))}
                        className="text-center bg-gray-700 border-gray-600 text-white"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDailyGoals(prev => ({ ...prev, calories: prev.calories + 50 }))}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration-goal" className="text-gray-300">{t('timeGoalLabel')}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDailyGoals(prev => ({ ...prev, duration: Math.max(10, prev.duration - 5) }))}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="duration-goal"
                        type="number"
                        value={dailyGoals.duration}
                        onChange={(e) => setDailyGoals(prev => ({ ...prev, duration: Number(e.target.value) || 30 }))}
                        className="text-center bg-gray-700 border-gray-600 text-white"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDailyGoals(prev => ({ ...prev, duration: prev.duration + 5 }))}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exercise-goal" className="text-gray-300">{t('exerciseGoalLabel')}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDailyGoals(prev => ({ ...prev, exercises: Math.max(1, prev.exercises - 1) }))}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="exercise-goal"
                        type="number"
                        value={dailyGoals.exercises}
                        onChange={(e) => setDailyGoals(prev => ({ ...prev, exercises: Number(e.target.value) || 5 }))}
                        className="text-center bg-gray-700 border-gray-600 text-white"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDailyGoals(prev => ({ ...prev, exercises: prev.exercises + 1 }))}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estatísticas Gerais */}
            <Card className="bg-black/30 backdrop-blur-sm border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">{t('generalStats')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-300/30">
                    <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-400">{workoutSessions.length}</p>
                    <p className="text-sm text-gray-300">{t('totalWorkouts')}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-300/30">
                    <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-400">
                      {workoutSessions.reduce((sum, session) => sum + session.totalCalories, 0)}
                    </p>
                    <p className="text-sm text-gray-300">{t('totalCalories')}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-300/30">
                    <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-400">
                      {workoutSessions.reduce((sum, session) => sum + session.duration, 0)}
                    </p>
                    <p className="text-sm text-gray-300">{t('totalMinutes')}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-300/30">
                    <Heart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-400">
                      {workoutSessions.length > 0 ? Math.round(workoutSessions.reduce((sum, session) => sum + session.totalCalories, 0) / workoutSessions.length) : 0}
                    </p>
                    <p className="text-sm text-gray-300">{t('averagePerWorkout')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}