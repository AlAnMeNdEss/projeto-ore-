import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Loader2, Github, Linkedin, Instagram, Triangle } from 'lucide-react';
import { InstallButton } from './InstallButton';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(loginForm.email, loginForm.password);
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      return;
    }
    setLoading(true);
    await signUp(signupForm.email, signupForm.password, signupForm.name);
    setLoading(false);
  };

  return (
    <div className="w-full relative">
      {/* Botão de instalação no topo direito */}
      <div className="absolute top-6 right-6 z-50">
        <InstallButton />
      </div>
      {/* Conteúdo do AuthPage */}
      <div className="flex flex-col items-center justify-center mb-4 gap-2 relative z-30">
        {/* Logo minimalista: círculo com mãos em oração */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#a78bfa] via-[#f3e8ff] to-[#6d28d9] shadow-md">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 24V12M16 12L12 16M16 12L20 16" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#a78bfa] via-[#f3e8ff] to-[#6d28d9] bg-clip-text text-transparent tracking-wide drop-shadow" style={{ letterSpacing: '0.04em' }}>
          Ore+
        </h1>
      </div>
      <p className="text-base text-gray-200 mb-6 text-center relative z-30">
        Compartilhe, ore e fortaleça sua fé em comunidade
      </p>
      <Card className="rounded-2xl shadow-xl border border-white/20 bg-white/5 p-4 relative z-20" style={{boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.12)'}}>
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-xl text-white">Bem-vindo</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Entre ou crie sua conta para participar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="flex w-full gap-2 mb-6 overflow-x-auto scrollbar-hide rounded-xl bg-black/30 p-1 relative z-0">
              <TabsTrigger value="login" className="flex-1 min-w-[120px] text-white rounded-lg px-4 py-2 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Entrar</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 min-w-[120px] text-white rounded-lg px-4 py-2 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                    disabled={loading}
                    placeholder="Digite seu email"
                    className="placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                    disabled={loading}
                    placeholder="Digite sua senha"
                    className="placeholder:text-gray-300"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-300 text-white font-semibold py-3 rounded-xl shadow-md hover:brightness-110 transition-all duration-200" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-white">Nome (opcional)</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                    disabled={loading}
                    placeholder="Seu nome"
                    className="text-white placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                    required
                    disabled={loading}
                    placeholder="Digite seu email"
                    className="placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                    required
                    disabled={loading}
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="placeholder:text-gray-300"
                  />
                  <p className="text-sm text-[#8b5cf6] font-semibold">💡 Dica: Use uma senha segura com letras, números e símbolos</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                    required
                    disabled={loading}
                    minLength={6}
                    placeholder="Digite a senha novamente"
                    className="placeholder:text-gray-300"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-prayer" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* Versículo bíblico */}
      <p className="mt-8 text-center text-sm italic text-[#b2a4ff] drop-shadow-sm max-w-xs mx-auto font-medium">
        "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus."<br/>
        <span className="text-xs text-[#8b5cf6] font-semibold">Filipenses 4:6</span>
      </p>
      <a href="#" className="block text-center text-sm text-gray-200 underline mb-6">Ainda não tenho uma conta</a>
    </div>
  );
}