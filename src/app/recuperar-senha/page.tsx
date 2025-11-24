"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    if (!email) {
      setErro("Por favor, digite seu e-mail");
      setLoading(false);
      return;
    }

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });

    setLoading(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setSucesso("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Recuperar Senha
            </h1>
            <p className="text-sm text-slate-500">
              Digite seu e-mail para receber as instruções de recuperação
            </p>
          </div>
        </div>

        {sucesso ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold mb-2">✅ E-mail enviado!</p>
              <p className="text-sm text-green-600">{sucesso}</p>
            </div>
            <div className="text-xs text-slate-500">
              Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente.
            </div>
            <Button 
              onClick={() => {
                setSucesso(null);
                setEmail("");
              }}
              variant="outline"
              className="w-full"
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
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
              {loading ? "Enviando..." : "Enviar E-mail de Recuperação"}
            </Button>
          </form>
        )}

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