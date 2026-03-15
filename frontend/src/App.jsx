import React, { useState } from 'react';
import { Shield, Link2, FileText, FileUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

import URLScanner from './components/URLScanner';
import TextScanner from './components/TextScanner';
import DocumentScanner from './components/DocumentScanner';

function App() {
  const [activeTab, setActiveTab] = useState('url');

  const tabs = [
    { id: 'url', label: 'URL Scanner', icon: Link2 },
    { id: 'text', label: 'Text Analysis', icon: FileText },
    { id: 'doc', label: 'Document Scan', icon: FileUp },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-2 shadow-lg shadow-blue-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                  CampusShield AI
                </h1>
                <p className="text-xs text-slate-400 font-medium">Next-Gen Threat Detection</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                <Activity className="w-3 h-3 mr-1.5 animate-pulse" />
                System Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Intelligent Threat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Analysis</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Leverage advanced AI to detect phishing URLs, analyze suspicious messages, and scan documents for potential risks in real-time.
          </motion.p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass-panel p-1.5 rounded-2xl inline-flex space-x-1 relative z-10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-xl flex items-center space-x-2 text-sm font-semibold transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.5)] -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="max-w-4xl mx-auto mt-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'url' && <URLScanner />}
            {activeTab === 'text' && <TextScanner />}
            {activeTab === 'doc' && <DocumentScanner />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;