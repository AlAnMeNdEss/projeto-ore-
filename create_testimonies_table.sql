-- Criar tabela de testemunhos
CREATE TABLE IF NOT EXISTS testimonies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos vejam os testemunhos
CREATE POLICY "Permitir visualização de testemunhos" ON testimonies
  FOR SELECT USING (true);

-- Política para permitir que usuários logados criem testemunhos
CREATE POLICY "Permitir criação de testemunhos" ON testimonies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários editem seus próprios testemunhos
CREATE POLICY "Permitir edição de testemunhos próprios" ON testimonies
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para permitir que usuários deletem seus próprios testemunhos
CREATE POLICY "Permitir deleção de testemunhos próprios" ON testimonies
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_testimonies_updated_at 
  BEFORE UPDATE ON testimonies 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 