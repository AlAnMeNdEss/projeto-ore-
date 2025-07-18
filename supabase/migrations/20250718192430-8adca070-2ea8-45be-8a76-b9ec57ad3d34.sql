-- Limpar tabelas existentes que não são do sistema de oração
DROP TABLE IF EXISTS public.schedule_participants CASCADE;
DROP TABLE IF EXISTS public.schedules CASCADE;
DROP TABLE IF EXISTS public.team_users CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.churches CASCADE;
DROP TABLE IF EXISTS public.equipes CASCADE;
DROP TABLE IF EXISTS public.escala_membros CASCADE;
DROP TABLE IF EXISTS public.escalas CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;

-- Criar sistema de pedidos de oração
CREATE TABLE public.prayer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  name TEXT, -- Nome opcional (null = anônimo)
  category TEXT NOT NULL CHECK (category IN ('saude', 'familia', 'trabalho', 'financeiro', 'espiritual', 'outros')),
  user_id UUID REFERENCES auth.users(id), -- Opcional para permitir pedidos anônimos
  prayer_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para rastrear quem orou por cada pedido
CREATE TABLE public.prayer_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(prayer_request_id, user_id) -- Evita orar pelo mesmo pedido mais de uma vez
);

-- Tabela de perfis para usuários registrados
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para prayer_requests (todos podem ver, qualquer um pode criar)
CREATE POLICY "Todos podem ver pedidos de oração" 
ON public.prayer_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem criar pedidos" 
ON public.prayer_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL); -- Permite anônimos

CREATE POLICY "Usuários podem editar seus próprios pedidos" 
ON public.prayer_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios pedidos" 
ON public.prayer_requests 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas para prayer_interactions
CREATE POLICY "Usuários podem ver suas próprias interações" 
ON public.prayer_interactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias interações" 
ON public.prayer_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Políticas para profiles
CREATE POLICY "Usuários podem ver todos os perfis" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Função para incrementar contador de oração
CREATE OR REPLACE FUNCTION public.increment_prayer_count(request_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  interaction_exists BOOLEAN;
BEGIN
  -- Verificar se o usuário já orou por este pedido
  SELECT EXISTS(
    SELECT 1 FROM public.prayer_interactions 
    WHERE prayer_request_id = request_id AND prayer_interactions.user_id = increment_prayer_count.user_id
  ) INTO interaction_exists;
  
  IF interaction_exists THEN
    RETURN FALSE; -- Usuário já orou por este pedido
  END IF;
  
  -- Criar interação
  INSERT INTO public.prayer_interactions (prayer_request_id, user_id)
  VALUES (request_id, increment_prayer_count.user_id);
  
  -- Incrementar contador
  UPDATE public.prayer_requests 
  SET prayer_count = prayer_count + 1 
  WHERE id = request_id;
  
  RETURN TRUE;
END;
$$;

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_prayer_requests_updated_at
  BEFORE UPDATE ON public.prayer_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();