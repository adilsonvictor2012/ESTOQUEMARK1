
import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Search, AlertCircle, FileText, MapPin } from 'lucide-react';
import { Material, Movement, Client, Supplier, MovementType } from '../types';

interface Props {
  onShowGuide: (guide: any) => void;
}

const Inventory: React.FC<Props> = ({ onShowGuide }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState<MovementType | null>(null);

  // Load Initial Data
  useEffect(() => {
    const savedMaterials = JSON.parse(localStorage.getItem('gestpro_materials') || '[]');
    const savedClients = JSON.parse(localStorage.getItem('gestpro_clients') || '[]');
    const savedSuppliers = JSON.parse(localStorage.getItem('gestpro_suppliers') || '[]');
    
    // Default Mock Data if empty
    if (savedMaterials.length === 0) {
      const mock: Material[] = [
        { id: '1', name: 'Cimento CP-II', category: 'Construção', quantity: 150, minStock: 50, unit: 'Saco 50kg', prices: {} },
        { id: '2', name: 'Barra de Ferro 10mm', category: 'Estrutura', quantity: 20, minStock: 100, unit: 'Unidade', prices: {} },
        { id: '3', name: 'Tinta Acrílica Branca', category: 'Acabamento', quantity: 15, minStock: 20, unit: 'Lata 18L', prices: {} },
      ];
      setMaterials(mock);
      localStorage.setItem('gestpro_materials', JSON.stringify(mock));
    } else {
      setMaterials(savedMaterials);
    }
    setClients(savedClients);
    setSuppliers(savedSuppliers);
  }, []);

  const handleMovement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const matId = formData.get('materialId') as string;
    const qty = Number(formData.get('quantity'));
    const dest = formData.get('destination') as string;
    const location = formData.get('location') as string;

    const prefix = showForm === 'ENTRADA' ? 'ENT' : showForm === 'SAIDA' ? 'SAI' : 'DEV';
    const num = Math.floor(1000 + Math.random() * 9000);
    const guideNumber = `${prefix}-${num}`;

    const updated = materials.map(m => {
      if (m.id === matId) {
        const newQty = showForm === 'ENTRADA' ? m.quantity + qty : m.quantity - qty;
        return { ...m, quantity: newQty };
      }
      return m;
    });

    setMaterials(updated);
    localStorage.setItem('gestpro_materials', JSON.stringify(updated));

    // Save Movement
    const movements = JSON.parse(localStorage.getItem('gestpro_movements') || '[]');
    const newMovement: Movement = {
      id: Math.random().toString(36).substr(2, 9),
      type: showForm!,
      materialId: matId,
      quantity: qty,
      date: new Date().toISOString(),
      location: location,
      guideNumber: guideNumber
    };
    movements.push(newMovement);
    localStorage.setItem('gestpro_movements', JSON.stringify(movements));

    // Auto-generate Guide for viewer
    const mat = materials.find(m => m.id === matId);
    onShowGuide({
      number: guideNumber,
      type: showForm === 'SAIDA' ? 'TRANSPORTE' : showForm,
      date: new Date().toLocaleDateString(),
      recipientName: dest || 'Estoque Central',
      address: location || 'N/A',
      items: [{ materialName: mat?.name, quantity: qty, unit: mat?.unit }]
    });

    setShowForm(null);
  };

  const filtered = materials.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => setShowForm('ENTRADA')} className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors shadow-sm">
            <Plus size={18} />
            <span>Entrada</span>
          </button>
          <button onClick={() => setShowForm('SAIDA')} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <Minus size={18} />
            <span>Saída</span>
          </button>
          <button onClick={() => setShowForm('DEVOLUCAO')} className="flex items-center space-x-2 bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-900 transition-colors shadow-sm">
            <RotateCcw size={18} />
            <span>Devolução</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Material</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Quantidade</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.unit}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{m.category}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${m.quantity <= m.minStock ? 'text-red-600' : 'text-slate-900'}`}>
                      {m.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {m.quantity <= m.minStock ? (
                      <div className="flex items-center justify-center space-x-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-medium">
                        <AlertCircle size={12} />
                        <span>Estoque Baixo</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                        <span>Normal</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                     <button className="text-slate-400 hover:text-blue-600 transition-colors">
                       <FileText size={18} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
            <div className="bg-slate-50 p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Registrar {showForm}</h3>
            </div>
            <form onSubmit={handleMovement} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
                <select name="materialId" required className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                  {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.quantity} {m.unit})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
                <input type="number" name="quantity" required min="1" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{showForm === 'ENTRADA' ? 'Fornecedor' : 'Cliente'}</label>
                <input type="text" name="destination" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Opcional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Local da Obra / Localização Geográfica</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="location" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Av. Central, 123 ou Coordenadas" />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowForm(null)} className="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors">Confirmar e Gerar Guia</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
