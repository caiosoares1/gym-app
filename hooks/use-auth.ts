import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há uma sessão salva
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔐 Sessão recuperada:', session ? 'Logado ✅' : 'Não logado ❌');
      if (error) {
        console.error('❌ Erro ao recuperar sessão:', error.message);
      }
      setSession(session);
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔄 Mudança de auth:', _event, session ? 'Logado ✅' : 'Deslogado ❌');
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}
