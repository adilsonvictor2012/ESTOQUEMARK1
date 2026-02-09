
import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Share2, Filter, Calendar } from 'lucide-react';
import { Movement, Material } from '../types';

const Reports: React.FC = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [range, setRange] = useState<'daily' | 'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const savedMovements = JSON.parse(localStorage.getItem('gestpro_movements') || '[]');
    const savedMaterials = JSON.parse(localStorage.getItem('gestpro_materials') || '[]');
    setMovements(savedMovements);
    setMaterials(savedMaterials);
  }, []);

  const exportCSV = () => {
    const headers = ['Data', 'Tipo', 'Material', 'Quantidade', 'Local', 'Guia No.'];
    const rows = movements.map(m => [
      new Date(m.date).toLocaleDateString(),
      m.type,
      materials.find(mat => mat.id === m.materialId)?.name || 'N/A',
      m.quantity.toString(),
      m.location || 'Central',
      m.guideNumber
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_movimentacoes_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Calendar size={24} /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Gerador de Relatórios</h3>
            <p className="text-sm text-slate-500">Exporte e analise os dados de movimentação</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={range}
            onChange={(e) => setRange(e.target.value as any)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="daily">Vista Diária</option>
            <option value="monthly">Vista Mensal</option>
            <option value="annual">Vista Anual</option>
          </select>
          <button onClick={exportCSV} className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-sm font-bold transition-colors">
            <Download size={16} />
            <span>Excel (CSV)</span>
          </button>
          <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-sm font-bold transition-colors">
            <Printer size={16} />
            <span>Imprimir PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Movimentações Recentes</h4>
          <span className="text-xs text-slate-400 font-medium">Total de {movements.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Data</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Material</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Quantidade</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Destino/Local</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Documento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.slice().reverse().map(m => {
                const mat = materials.find(x => x.id === m.materialId);
                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(m.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                        m.type === 'ENTRADA' ? 'bg-green-100 text-green-700' : 
                        m.type === 'SAIDA' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{mat?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-700">{m.quantity}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic">{m.location || 'Estoque Central'}</td>
                    <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">{m.guideNumber}</td>
                  </tr>
                );
              })}
              {movements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Nenhum dado disponível para o período selecionado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
