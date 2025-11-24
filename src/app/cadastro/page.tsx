"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Gift } from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    // Validações
    if (!email || !senha || !confirmarSenha || !nome) {
      setErro("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=/dashboard`,
        data: {
          full_name: nome,
        }
      }
    });

    setLoading(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setSucesso("Conta criada com sucesso! Verifique seu e-mail para confirmar a conta.");
  }

  async function loginGoogle() {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=/dashboard` 
      },
    });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Criar Conta
          </h1>
          <p className="text-sm text-slate-500">Junte-se ao FitHome e transforme sua vida</p>
        </div>

        {/* Banner de benefício */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
            <Gift className="w-4 h-4" />
            🎁 Oferta Especial!
          </div>
          <p className="text-xs text-green-600">
            Ao criar sua conta, você ganha <strong>7 dias grátis</strong> de acesso Premium!
          </p>
        </div>

        {sucesso ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold mb-2">✅ Conta criada com sucesso!</p>
              <p className="text-sm text-green-600">{sucesso}</p>
            </div>
            <Button 
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Ir para Login
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome" className="text-slate-700">Nome Completo</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="nome"
                    type="text" 
                    required 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Seu nome completo" 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-700">E-mail</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="email"
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="voce@exemplo.com" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="senha" className="text-slate-700">Senha</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    required 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 pr-10 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Mínimo 6 caracteres" 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmarSenha" className="text-slate-700">Confirmar Senha</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="confirmarSenha"
                    type={showPassword ? "text" : "password"}
                    required 
                    value={confirmarSenha} 
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Repita sua senha" 
                  />
                </div>
              </div>
              
              {erro && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{erro}</p>
                </div>
              )}
              
              <Button 
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 font-semibold"
              >
                {loading ? "Criando conta..." : "Criar Conta Grátis"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">ou</span>
              </div>
            </div>

            <Button 
              onClick={loginGoogle}
              variant="outline"
              className="w-full rounded-lg border border-slate-300 py-2.5 hover:bg-slate-50 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </Button>

            <div className="mt-6 text-center text-sm">
              <div className="text-slate-500">
                Já tem uma conta?{" "}
                <a href="/login" className="text-purple-600 hover:text-purple-700 underline font-semibold">
                  Fazer login
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}