import React, { useState } from 'react';
import { User } from '../../types';

interface Props {
  onLogin: (user: User) => void;
  onToggle: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // In a real app, this would be an API call
    const users: User[] = JSON.parse(localStorage.getItem('estoquemark1_users') || '[]');
    
    // Creator back-door for testing/demo
    if (email === 'admin@estoquemark1.com' || (email === 'admin@gestpro.com' && password === 'admin123')) {
      onLogin({ id: '0', email, name: 'Criador EstoqueMark1', role: 'creator' });
      return;
    }

    const found = users.find(u => u.email === email);
    if (found) {
       onLogin(found);
    } else {
       setError('Credenciais inválidas. Use admin@estoquemark1.com / admin123 para acesso criador.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">EstoqueMark1</h1>
          <p className="text-slate-500 mt-2">Acesse sua conta para gerenciar estoque</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Palavra-passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Não tem conta? <button onClick={onToggle} className="text-blue-600 font-semibold hover:underline">Registe-se aqui</button>
        </div>
      </div>
    </div>
  );
};

export default Login;