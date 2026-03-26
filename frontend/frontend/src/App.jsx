import React, { useEffect, useState } from 'react';
import { Dumbbell, Cloud, CheckCircle } from 'lucide-react';
import api from './api/axios';

function App() {
  const [serverStatus, setServerStatus] = useState("Checking...");

  useEffect(() => {
    // Backend se baat karne ki koshish
    api.get('health/')
      .then(res => setServerStatus(res.data.status))
      .catch(err => setServerStatus("Offline"));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center relative overflow-hidden">
      {/* Visual background glow */}
      <div className="absolute top-[-10%] left-[-20%] w-[50%] h-[50%] bg-orange-600/10 blur-[150px] rounded-full"></div>
      
      <div className="relative z-10 text-center">
        <div className="flex justify-center mb-6">
          <Dumbbell className="text-orange-600" size={60} />
        </div>
        <h1 className="text-8xl font-black italic uppercase tracking-tighter mb-4">FitLift<span className="text-orange-600">.</span></h1>
        
        <div className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
          <Cloud size={16} className="text-zinc-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">AWS Build Status:</span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${serverStatus === 'Offline' ? 'text-red-500' : 'text-green-500'}`}>
            {serverStatus}
          </span>
        </div>
      </div>

      <footer className="absolute bottom-10 text-[10px] font-black uppercase tracking-[0.6em] text-zinc-700">
        NCI Cloud Computing Project 2026
      </footer>
    </div>
  );
}

export default App;