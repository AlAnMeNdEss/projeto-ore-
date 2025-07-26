-- EXECUTE ESTE SQL NO SUPABASE DASHBOARD (SQL Editor)
-- Vá para: https://supabase.com/dashboard/project/[SEU_PROJECT_ID]/sql/new

-- Criar tabela prayer_messages
CREATE TABLE IF NOT EXISTS public.prayer_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prayer_request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.prayer_messages ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view messages" ON public.prayer_messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.prayer_messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.prayer_messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.prayer_messages;

-- Criar políticas RLS
CREATE POLICY "Users can view messages" ON public.prayer_messages
    FOR SELECT USING (true);

CREATE POLICY "Users can insert messages" ON public.prayer_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON public.prayer_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON public.prayer_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_prayer_messages_request_id ON public.prayer_messages(prayer_request_id);
CREATE INDEX IF NOT EXISTS idx_prayer_messages_user_id ON public.prayer_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_messages_created_at ON public.prayer_messages(created_at);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para updated_at
DROP TRIGGER IF EXISTS update_prayer_messages_updated_at ON public.prayer_messages;
CREATE TRIGGER update_prayer_messages_updated_at 
    BEFORE UPDATE ON public.prayer_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar se a tabela foi criada
SELECT 'Tabela prayer_messages criada com sucesso!' as status; 