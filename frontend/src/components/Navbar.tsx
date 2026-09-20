import React from 'react';
import { MessageSquare, Share2, Car, ShoppingBag, BarChart2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'social_media', label: 'Social Media Feed', icon: Share2, badge: 'Auto-Reply' },
    { id: 'ride_sharing', label: 'In-App Service', icon: Car, badge: 'Ride/Delivery' },
    { id: 'ecommerce', label: 'E-Commerce Store', icon: ShoppingBag, badge: 'Rating Request' },
    { id: 'dashboard', label: 'Ops Dashboard', icon: BarChart2, badge: 'Traces' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2.5 sm:py-0 sm:h-16 gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-100 whitespace-nowrap">FeedbackPilot</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-mono">v1.2</span>
              </div>
              <p className="text-[11px] text-slate-400 whitespace-nowrap hidden sm:block">Agentic Feedback Triage Engine</p>
            </div>
          </div>

          {/* Scenario Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-slate-100 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded hidden xl:inline-block font-mono whitespace-nowrap ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </header>
  );
};
