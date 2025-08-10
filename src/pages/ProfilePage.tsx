import { useAuth } from '@/hooks/useAuth';
import { LogOut, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 py-3 flex items-center gap-2">
        <button
          className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
          onClick={() => navigate('/')}
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center font-bold text-gray-800">Meu Perfil</h1>
        <div className="w-9" />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-lg border-2 border-white/30">
            <span className="text-3xl font-bold text-white">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold">{user?.user_metadata?.name || 'Usuário'}</div>
            <div className="text-sm text-blue-100">{user?.email}</div>
            <div className="mt-1 text-xs text-blue-100">
              Membro há {user ? Math.ceil((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0} dias
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Estatísticas principais */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">-</div>
            <div className="text-xs text-blue-700 font-medium">Orações Recebidas</div>
            <div className="text-xs text-blue-500 mt-1">🙏</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">-</div>
            <div className="text-xs text-green-700 font-medium">Pedidos Criados</div>
            <div className="text-xs text-green-500 mt-1">📝</div>
          </div>
        </div>

        {/* Estatísticas adicionais */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-700">-</div>
            <div className="text-xs text-gray-600">Feitas</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-700">-</div>
            <div className="text-xs text-gray-600">Hoje</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-700">-</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>

        {/* Informações detalhadas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="text-sm text-purple-700">Data de Cadastro</div>
            <div className="text-sm font-medium text-purple-800">{user ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-sm text-blue-700">Dias Ativo</div>
            <div className="text-sm font-medium text-blue-800">{user ? Math.ceil((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="text-sm text-green-700">Status</div>
            <div className="text-sm font-medium text-green-800">Ativo</div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="flex items-center gap-3 p-3 text-left text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 touch-ripple border border-blue-200 hover:border-blue-300 hover:shadow-md"
            onClick={() => {}}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-sm">Configurações</div>
              <div className="text-xs text-blue-500">Personalizar conta</div>
            </div>
          </button>
          <button
            className="flex items-center gap-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 touch-ripple border border-red-200 hover:border-red-300 hover:shadow-md"
            onClick={() => signOut?.()}
          >
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <LogOut className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="font-medium text-sm">Sair da Conta</div>
              <div className="text-xs text-red-500">Encerrar sessão</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
