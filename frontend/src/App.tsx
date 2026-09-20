import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SocialMediaSimulator } from './components/SocialMediaSimulator';
import { RideSharingSimulator } from './components/RideSharingSimulator';
import { EcommerceSimulator } from './components/EcommerceSimulator';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('social_media');

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans antialiased">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pb-16">
        {activeTab === 'social_media' && <SocialMediaSimulator />}
        {activeTab === 'ride_sharing' && <RideSharingSimulator />}
        {activeTab === 'ecommerce' && <EcommerceSimulator />}
        {activeTab === 'dashboard' && <AnalyticsDashboard />}
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-2">
          <span>FeedbackPilot — Agentic Feedback Pipeline</span>
          <span className="font-mono text-emerald-400">Building....@2026</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
