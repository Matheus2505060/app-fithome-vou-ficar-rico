"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

export default function ResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Verificar se há um token de reset na URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    
    if (!accessToken) {
      setErro("Link de recuperação inválido ou expirado");
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    if (!novaSenha || !confirmarSenha) {
      setErro("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.updateUser({
      password: novaSenha
    });

    setLoading(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setSucesso(true);
    
    // Redirecionar para login após 3 segundos
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }

  if (sucesso) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Senha Redefinida!
          </h1>
          <p className="text-slate-600 mb-6">
            Sua senha foi alterada com sucesso. Você será redirecionado para o login em instantes.
          </p>
          <Button 
            onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Ir para Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Nova Senha
          </h1>
          <p className="text-sm text-slate-500">
            Digite sua nova senha para finalizar a recuperação
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="novaSenha" className="text-slate-700">Nova Senha</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="novaSenha"
                type={showPassword ? "text" : "password"}
                required 
                value={novaSenha} 
                onChange={(e) => setNovaSenha(e.target.value)}
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
            <Label htmlFor="confirmarSenha" className="text-slate-700">Confirmar Nova Senha</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="confirmarSenha"
                type={showPassword ? "text" : "password"}
                required 
                value={confirmarSenha} 
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Repita sua nova senha" 
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
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <div className="text-slate-500">
            Lembrou da senha?{" "}
            <a href="/login" className="text-purple-600 hover:text-purple-700 underline font-semibold">
              Fazer login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}