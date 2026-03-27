import React from 'react';
import { Dumbbell, ArrowRight } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute top-[-10%] left-[-20%] w-[50%] h-[50%] bg-orange-600/10 blur-[150px] rounded-full"></div>
      
      <div className="relative z-10 text-center px-6">
        <div className="flex justify-center mb-4">
          <Dumbbell className="text-orange-600 animate-pulse" size={50} />
        </div>
        <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-2 text-white">
          FitLift<span className="text-orange-600">.</span>
        </h1>
        <p className="text-xl md:text-2xl font-light italic text-zinc-400 mb-10 max-w-xl mx-auto">
          "The only bad workout is the one that didn't happen."
        </p>
        
        <button 
          onClick={onStart}
          className="group relative bg-orange-600 hover:bg-orange-700 text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] transition-all transform hover:scale-105 flex items-center gap-3 mx-auto" >
          Start Your Journey
          <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default LandingPage;