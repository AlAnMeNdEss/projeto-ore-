const { createClient } = require('@supabase/supabase-js');

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testando conexão com Supabase...');
  
  try {
    // Testar se a tabela prayer_messages existe
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'prayer_messages');
    
    console.log('Tabelas encontradas:', tables);
    console.log('Erro ao buscar tabelas:', tablesError);
    
    if (!tables || tables.length === 0) {
      console.log('Tabela prayer_messages não existe. Criando...');
      
      // Criar a tabela
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS prayer_messages (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            prayer_request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            message TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          ALTER TABLE prayer_messages ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view messages" ON prayer_messages FOR SELECT USING (true);
          CREATE POLICY "Users can insert messages" ON prayer_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
          CREATE POLICY "Users can update own messages" ON prayer_messages FOR UPDATE USING (auth.uid() = user_id);
          CREATE POLICY "Users can delete own messages" ON prayer_messages FOR DELETE USING (auth.uid() = user_id);
          
          CREATE INDEX idx_prayer_messages_request_id ON prayer_messages(prayer_request_id);
          CREATE INDEX idx_prayer_messages_user_id ON prayer_messages(user_id);
        `
      });
      
      console.log('Erro ao criar tabela:', createError);
    }
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

testConnection(); 