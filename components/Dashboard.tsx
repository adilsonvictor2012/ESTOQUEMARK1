
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Package, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Entradas (Hoje)', value: '124', icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Saídas (Hoje)', value: '86', icon: ArrowDownLeft, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Itens', value: '1,420', icon: Package, color: 'text-slate-600', bg: 'bg-slate-50' },
    { label: 'Estoque Baixo', value: '8', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const data = [
    { name: 'Seg', entradas: 400, saidas: 240 },
    { name: 'Ter', entradas: 300, saidas: 139 },
    { name: 'Qua', entradas: 200, saidas: 980 },
    { name: 'Qui', entradas: 278, saidas: 390 },
    { name: 'Sex', entradas: 189, saidas: 480 },
    { name: 'Sáb', entradas: 239, saidas: 380 },
    { name: 'Dom', entradas: 349, saidas: 430 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`${stat.bg} p-3 rounded-xl`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Fluxo de Movimentação Semanal</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEnt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="entradas" stroke="#2563eb" fillOpacity={1} fill="url(#colorEnt)" />
                <Area type="monotone" dataKey="saidas" stroke="#94a3b8" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Categorias mais Movimentadas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {name: 'Cimento', val: 400},
                {name: 'Areia', val: 300},
                {name: 'Ferro', val: 200},
                {name: 'Tintas', val: 278},
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
