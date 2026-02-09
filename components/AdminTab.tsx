import React from 'react';
import { ShieldCheck, UserCog, Settings2, Database, Trash2 } from 'lucide-react';

const AdminTab: React.FC = () => {
  const clearDatabase = () => {
    if (confirm('ATENÇÃO: Isso apagará TODOS os dados de estoque, clientes e fornecedores. Deseja continuar?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex items-center space-x-6">
        <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
          <ShieldCheck size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-black italic">PAINEL DO CRIADOR</h2>
          <p className="text-slate-400 mt-1">Acesso exclusivo para manutenção e controle do EstoqueMark1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center space-x-3 text-slate-800 font-bold border-b border-slate-50 pb-4">
            <UserCog size={20} />
            <span>Controle de Utilizadores</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-500">
            Atualmente, todos os novos registros recebem permissões básicas. Você pode gerir promoções de conta futuramente.
          </div>
          <button className="w-full py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-medium text-slate-600 transition-colors">
            Gerir Acessos Ativos
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center space-x-3 text-slate-800 font-bold border-b border-slate-50 pb-4">
            <Database size={20} />
            <span>Manutenção do Sistema</span>
          </div>
          <div className="space-y-3">
             <button onClick={clearDatabase} className="w-full flex items-center justify-between p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
               <span className="font-bold">Resetar Banco de Dados</span>
               <Trash2 size={18} />
             </button>
             <button className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
               <span className="font-bold">Exportar Backup Global</span>
               <Database size={18} />
             </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 text-white p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h4 className="font-bold">Status da Versão</h4>
          <p className="text-blue-100 text-sm">Versão 3.0.4 - Canal Estável (Enterprise)</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-ping" />
          <span className="font-bold text-xs uppercase tracking-widest">Sistema Operacional</span>
        </div>
      </div>
    </div>
  );
};

export default AdminTab;