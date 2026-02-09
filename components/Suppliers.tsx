import React, { useState, useEffect } from 'react';
import { Truck, Mail, DollarSign, ListFilter, ArrowRightLeft } from 'lucide-react';
import { Supplier, Material } from '../types';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'comparison'>('list');

  useEffect(() => {
    const savedSuppliers = JSON.parse(localStorage.getItem('estoquemark1_suppliers') || '[]');
    const savedMaterials = JSON.parse(localStorage.getItem('estoquemark1_materials') || '[]');

    if (savedSuppliers.length === 0) {
      const mock: Supplier[] = [
        { id: 's1', name: 'AngoBuild Ltda', contact: '+244 923 111 222', email: 'vendas@angobuild.ao' },
        { id: 's2', name: 'Ferragens Luanda', contact: '+244 912 333 444', email: 'geral@ferragensluanda.com' },
      ];
      setSuppliers(mock);
      localStorage.setItem('estoquemark1_suppliers', JSON.stringify(mock));
    } else {
      setSuppliers(savedSuppliers);
    }

    // Mock prices for comparison if missing
    const updatedMats = savedMaterials.map((m: Material) => ({
      ...m,
      prices: m.prices && Object.keys(m.prices).length > 0 ? m.prices : {
        's1': Math.floor(Math.random() * 5000) + 2000,
        's2': Math.floor(Math.random() * 5000) + 2000,
      }
    }));
    setMaterials(updatedMats);
  }, []);

  const sendOrderEmail = (sup: Supplier) => {
    const subject = `Solicitação de Cotação / Pedido de Material - EstoqueMark1`;
    const body = `Olá ${sup.name},\n\nGostaríamos de solicitar preços e disponibilidade para os seguintes itens...\n\nAtentamente,\nEquipa de Logística EstoqueMark1`;
    window.location.href = `mailto:${sup.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('list')}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === 'list' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
        >
          Lista de Fornecedores
        </button>
        <button 
          onClick={() => setActiveTab('comparison')}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === 'comparison' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
        >
          Quadro Comparativo de Preços
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map(sup => (
            <div key={sup.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-slate-100 p-3 rounded-xl text-slate-600"><Truck size={24} /></div>
                <h3 className="font-bold text-slate-900">{sup.name}</h3>
              </div>
              <div className="space-y-2 text-sm text-slate-500 mb-6 flex-1">
                <p>Tel: {sup.contact}</p>
                <p>Email: {sup.email}</p>
              </div>
              <button 
                onClick={() => sendOrderEmail(sup)}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium"
              >
                <Mail size={16} />
                <span>Solicitar Material</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Material</th>
                  {suppliers.map(s => (
                    <th key={s.id} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">{s.name}</th>
                  ))}
                  <th className="px-6 py-4 text-xs font-bold text-blue-600 uppercase text-center">Melhor Opção</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materials.map(m => {
                  const prices = suppliers.map(s => m.prices[s.id] || 0);
                  const minPrice = Math.min(...prices.filter(p => p > 0));
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{m.name}</td>
                      {suppliers.map(s => {
                        const isBest = m.prices[s.id] === minPrice;
                        return (
                          <td key={s.id} className={`px-6 py-4 text-center font-mono ${isBest ? 'text-green-600 font-bold' : 'text-slate-600'}`}>
                            {m.prices[s.id] ? `${m.prices[s.id].toLocaleString()} Kz` : 'N/A'}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 text-center">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          {minPrice.toLocaleString()} Kz
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;