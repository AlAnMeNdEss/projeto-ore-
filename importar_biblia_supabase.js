import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fidiulbnuucqfckozbrv.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGl1bGJudXVjcWZja296YnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDcxMDU4OSwiZXhwIjoyMDY2Mjg2NTg5fQ.geZx43mnZ_yI3qvu4q1Z23NkLcXCGvGpWfoDt2PKi58';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function importar() {
  try {
    const data = JSON.parse(fs.readFileSync('./public/pt_nvi.json', 'utf8'));
    let total = 0;
    let batch = [];

    for (const livro of data) {
      const nomeLivro = livro.name;
      for (const [capitulo, versiculos] of Object.entries(livro.chapters)) {
        for (const [versiculo, texto] of Object.entries(versiculos)) {
          batch.push({
            livro: nomeLivro,
            capitulo: parseInt(capitulo),
            versiculo: parseInt(versiculo),
            texto: texto.trim(),
          });
          total++;
          if (batch.length === 500) {
            const { error } = await supabase.from('versiculos_biblia').insert(batch);
            if (error) {
              console.error('Erro ao inserir:', error);
              process.exit(1);
            }
            console.log(`${total} versículos inseridos...`);
            batch = [];
          }
        }
      }
    }
    if (batch.length > 0) {
      const { error } = await supabase.from('versiculos_biblia').insert(batch);
      if (error) {
        console.error('Erro ao inserir:', error);
        process.exit(1);
      }
    }
    console.log(`Importação concluída! Total: ${total} versículos.`);
  } catch (err) {
    console.error('Erro geral:', err);
  }
}

importar();  