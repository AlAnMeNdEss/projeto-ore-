-- Criar tabela para mensagens de oração
CREATE TABLE IF NOT EXISTS prayer_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE prayer_messages ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura de mensagens de pedidos públicos
CREATE POLICY "Users can view messages for prayer requests" ON prayer_messages
  FOR SELECT USING (true);

-- Política para permitir inserção de mensagens
CREATE POLICY "Users can insert messages" ON prayer_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para permitir atualização de próprias mensagens
CREATE POLICY "Users can update own messages" ON prayer_messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para permitir exclusão de próprias mensagens
CREATE POLICY "Users can delete own messages" ON prayer_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_prayer_messages_request_id ON prayer_messages(prayer_request_id);
CREATE INDEX IF NOT EXISTS idx_prayer_messages_user_id ON prayer_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_messages_created_at ON prayer_messages(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_prayer_messages_updated_at 
    BEFORE UPDATE ON prayer_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 