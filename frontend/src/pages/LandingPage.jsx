import React from 'react';
import { Dumbbell, ArrowRight } from 'lucide-react';
import bg from '../assets/bg.mp4';

const LandingPage = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50">
          <source src={bg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
      </div>

      <div className="absolute top-[-10%] left-[-20%] w-[50%] h-[50%] bg-orange-600/20 blur-[150px] rounded-full z-0"></div>
      
      <div className="relative z-10 text-center px-6">
        

        <h1 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter mb-2 text-white leading-none">
          FitLift<span className="text-orange-600">.</span>
        </h1>
        

        <p className="text-lg md:text-xl font-light italic text-zinc-300 mb-12 max-w-xl mx-auto leading-relaxed border-l-2 border-orange-600 pl-4">
          "The only bad workout."
        </p>
        
        <button 
          onClick={onStart}
          className="group relative bg-orange-600 hover:bg-orange-700 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:scale-105 flex items-center gap-4 mx-auto shadow-2xl shadow-orange-600/40"
        >
          Start Your Journey
          <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      {/* Bottom Aesthetic Element */}
      <div className="absolute bottom-10 left-10 z-10 hidden md:block">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 vertical-text rotate-180" style={{writingMode: 'vertical-rl'}}>
            EST. 2026 / NCI PROJECT
        </p>
      </div>
    </div>
  );
};

export default LandingPage;