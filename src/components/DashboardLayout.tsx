import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bot, Home, Users, BookOpen, BarChart3, Settings, LogOut, Menu, X, Shield, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { ActivationBanner } from './ActivationBanner';

export const DashboardLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Bots', href: '/dashboard/bots', icon: Bot },
    { name: 'Leads', href: '/dashboard/leads', icon: BarChart3 },
    { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: BookOpen },
    { name: 'Usage', href: '/dashboard/usage', icon: TrendingUp },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Affiliate', href: '/dashboard/affiliate', icon: DollarSign },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin Panel', href: '/admin', icon: Shield });
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Bot className="w-6 h-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">BotForge</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">BotForge</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="ml-3 font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-6">
          <ActivationBanner />
          <Outlet />
        </div>
      </main>
    </div>
  );
};
