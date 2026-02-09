import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  FileText, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  MinusCircle,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';
import { User, Material, Client, Supplier, Movement } from './types';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Clients from './components/Clients';
import Suppliers from './components/Suppliers';
import Reports from './components/Reports';
import AdminTab from './components/AdminTab';
import GuideViewer from './components/GuideViewer';

type Tab = 'dashboard' | 'inventory' | 'clients' | 'suppliers' | 'reports' | 'admin';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentGuide, setCurrentGuide] = useState<any | null>(null);

  // Persistence logic (Mock DB in localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('estoquemark1_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('estoquemark1_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('estoquemark1_user');
  };

  if (!user) {
    return isRegistering ? (
      <Register onToggle={() => setIsRegistering(false)} onRegister={handleLogin} />
    ) : (
      <Login onToggle={() => setIsRegistering(true)} onLogin={handleLogin} />
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Estoque Central', icon: Package },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'suppliers', label: 'Fornecedores', icon: Truck },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  if (user.role === 'creator') {
    navItems.push({ id: 'admin', label: 'Configuração', icon: ShieldCheck });
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-400">EstoqueMark1</h1>
          <p className="text-xs text-slate-400 mt-1">Logística & Gestão</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 text-red-400 hover:text-red-300 px-2 py-1"
          >
            <LogOut size={18} />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden md:block">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
            <h2 className="text-lg font-semibold text-slate-800 md:hidden">EstoqueMark1</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
              <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'inventory' && <Inventory onShowGuide={(g) => setCurrentGuide(g)} />}
          {activeTab === 'clients' && <Clients />}
          {activeTab === 'suppliers' && <Suppliers />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'admin' && user.role === 'creator' && <AdminTab />}
        </main>

        {/* Bottom Nav for Mobile */}
        <nav className="md:hidden bg-white border-t border-slate-200 flex items-center justify-around py-2 px-4 shrink-0 no-print">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          ))}
          <button
             onClick={() => setActiveTab('reports')}
             className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'reports' ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <FileText size={20} />
            <span className="text-[10px] mt-1 font-medium">Relatórios</span>
          </button>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-64 bg-slate-900 text-white flex flex-col p-6 animate-slide-in">
            <button className="absolute top-4 right-4" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
            <h1 className="text-2xl font-bold text-blue-400 mb-8">EstoqueMark1</h1>
            <nav className="space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                    activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-300'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t border-slate-800">
               <button onClick={handleLogout} className="flex items-center space-x-2 text-red-400">
                 <LogOut size={20} />
                 <span>Sair</span>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Modal Viewer */}
      {currentGuide && (
        <GuideViewer guide={currentGuide} onClose={() => setCurrentGuide(null)} />
      )}
    </div>
  );
};

export default App;