
import React, { useState, useEffect } from 'react';
import { UserPlus, History, MapPin, Search, Phone, Mail, Building2 } from 'lucide-react';
import { Client, Movement, Material } from '../types';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [history, setHistory] = useState<Movement[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gestpro_clients') || '[]');
    const movements = JSON.parse(localStorage.getItem('gestpro_movements') || '[]');
    const mats = JSON.parse(localStorage.getItem('gestpro_materials') || '[]');
    
    if (saved.length === 0) {
      const mock: Client[] = [
        { id: 'c1', name: 'Construtora Angola Nova', nif: '5400112233', email: 'obra@angolanova.com', address: 'Bairro Talatona, Luanda' },
        { id: 'c2', name: 'Imobiliária Horizonte', nif: '5400445566', email: 'suporte@horizonte.ao', address: 'Kilamba, Bloco G' },
      ];
      setClients(mock);
      localStorage.setItem('gestpro_clients', JSON.stringify(mock));
    } else {
      setClients(saved);
    }
    setMaterials(mats);
  }, []);

  const viewHistory = (client: Client) => {
    const movements = JSON.parse(localStorage.getItem('gestpro_movements') || '[]');
    const clientHistory = movements.filter((m: any) => m.destination === client.name || m.clientId === client.id);
    setHistory(clientHistory);
    setSelectedClient(client);
  };

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.nif.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou NIF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-100 font-medium">
          <UserPlus size={18} />
          <span>Cadastrar Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Building2 size={24} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NIF</span>
                <p className="text-xs font-mono font-medium text-slate-700">{client.nif}</p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{client.name}</h3>
            <div className="flex items-center space-x-2 text-slate-500 text-sm mb-4">
              <MapPin size={14} />
              <span>{client.address}</span>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Mail size={12} />
                <span>{client.email}</span>
              </div>
            </div>

            <button 
              onClick={() => viewHistory(client)}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition-colors font-medium text-sm"
            >
              <History size={16} />
              <span>Histórico de Recebimentos</span>
            </button>
          </div>
        ))}
      </div>

      {/* History Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedClient(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedClient.name}</h3>
                <p className="text-xs text-slate-500">Histórico detalhado de movimentações</p>
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-2 text-slate-400 hover:text-slate-600"><Search size={24} className="rotate-45" /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic">Nenhum recebimento registrado para este cliente.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                      <th className="pb-2 font-bold">Data</th>
                      <th className="pb-2 font-bold">Material</th>
                      <th className="pb-2 font-bold text-right">Qtd</th>
                      <th className="pb-2 font-bold">Local Aplicado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {history.map(h => {
                      const mat = materials.find(m => m.id === h.materialId);
                      return (
                        <tr key={h.id}>
                          <td className="py-3 text-sm text-slate-500">{new Date(h.date).toLocaleDateString()}</td>
                          <td className="py-3 font-medium text-slate-900">{mat?.name || 'Material'}</td>
                          <td className="py-3 text-right font-bold text-blue-600">{h.quantity}</td>
                          <td className="py-3 text-sm text-slate-500 italic">{h.location || 'Central'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
