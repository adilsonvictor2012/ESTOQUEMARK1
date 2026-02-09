import React from 'react';
import { X, Printer, Share2, Mail, Download } from 'lucide-react';

interface Props {
  guide: {
    number: string;
    type: string;
    date: string;
    recipientName: string;
    recipientNif?: string;
    address: string;
    items: { materialName: string; quantity: number; unit: string }[];
  };
  onClose: () => void;
}

const GuideViewer: React.FC<Props> = ({ guide, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const subject = `Guia de ${guide.type} - ${guide.number}`;
    const body = `Olá ${guide.recipientName},\n\nSegue em anexo os detalhes da guia de ${guide.type} número ${guide.number} emitida em ${guide.date}.\n\nLocal: ${guide.address}\n\nObrigado pela preferência.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 no-print">
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-3xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header toolbar */}
        <div className="bg-slate-900 p-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold italic">EM</div>
             <span className="font-bold">Pré-visualização da Guia</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handlePrint} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Printer size={20} /></button>
            <button onClick={handleEmail} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Mail size={20} /></button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Download size={20} /></button>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors ml-4 border-l border-slate-700 pl-4"><X size={24} /></button>
          </div>
        </div>

        {/* Paper Content */}
        <div className="flex-1 overflow-y-auto p-12 bg-slate-100">
          <div className="bg-white p-12 shadow-sm border border-slate-200 mx-auto max-w-[210mm] min-h-[297mm] flex flex-col" id="printable-guide">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-black text-blue-800 mb-1 italic">ESTOQUEMARK1</h1>
                <p className="text-sm text-slate-500">Logística & Gestão de Materiais</p>
                <div className="mt-4 text-xs text-slate-400">
                  <p>Rua da Logística, Edifício 4, Luanda</p>
                  <p>NIF: 5400123456 | Tel: +244 9XX XXX XXX</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-blue-600 text-white px-4 py-2 inline-block font-bold rounded-lg mb-2">
                  GUIA DE {guide.type.toUpperCase()}
                </div>
                <p className="text-xl font-bold text-slate-900"># {guide.number}</p>
                <p className="text-sm text-slate-500">Data: {guide.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12 py-8 border-y border-slate-100">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Destinatário / Cliente</p>
                <p className="text-lg font-bold text-slate-900">{guide.recipientName}</p>
                <p className="text-sm text-slate-600">{guide.address}</p>
                {guide.recipientNif && <p className="text-sm text-slate-500 mt-1">NIF: {guide.recipientNif}</p>}
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Local de Aplicação</p>
                <p className="text-sm text-slate-600">{guide.address}</p>
              </div>
            </div>

            <div className="flex-1 mb-12">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="text-left py-4 font-bold text-slate-900">Descrição do Material</th>
                    <th className="text-right py-4 font-bold text-slate-900">Qtd.</th>
                    <th className="text-right py-4 font-bold text-slate-900">Unid.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guide.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-4 text-slate-800 font-medium">{item.materialName}</td>
                      <td className="py-4 text-right font-bold">{item.quantity}</td>
                      <td className="py-4 text-right text-slate-500">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-auto pt-12">
               <div className="border-t border-slate-300 pt-4 text-center">
                 <p className="text-[10px] uppercase font-bold text-slate-400 mb-8">Responsável pela Emissão</p>
                 <div className="h-px bg-slate-200 w-48 mx-auto mb-2" />
                 <p className="text-xs text-slate-500">Assinatura & Carimbo</p>
               </div>
               <div className="border-t border-slate-300 pt-4 text-center">
                 <p className="text-[10px] uppercase font-bold text-slate-400 mb-8">Recebido por (Cliente)</p>
                 <div className="h-px bg-slate-200 w-48 mx-auto mb-2" />
                 <p className="text-xs text-slate-500">Assinatura & Carimbo</p>
               </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
               <div className="text-[10px] text-slate-400 max-w-sm italic">
                 Este documento serve para fins logísticos e de transporte. Processado por EstoqueMark1 Software de Gestão Certificado.
               </div>
               <div className="flex flex-col items-center">
                 {/* Mock QR Code Integration */}
                 <div className="w-20 h-20 bg-slate-100 border border-slate-200 p-1 rounded-lg">
                   <div className="w-full h-full bg-[repeating-conic-gradient(#334155_0%_25%,#f8fafc_0%_50%)] bg-[length:10px_10px]" />
                 </div>
                 <p className="text-[8px] text-slate-400 mt-1 uppercase">Validar Online</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actual print media overlay */}
      <div className="print-only fixed inset-0 bg-white p-0">
         <div id="print-content" className="p-8">
            {/* React usually handles printing the DOM, we can just ensure only the guide shows */}
         </div>
      </div>
    </div>
  );
};

export default GuideViewer;