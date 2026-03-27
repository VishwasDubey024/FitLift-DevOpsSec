import React from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('access_token', 'dummy_token');
    onLogin(); 
    navigate('/dashboard'); 
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem]">
        <h2 className="text-4xl font-black uppercase italic mb-8 text-white">Welcome Back</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input type="email" placeholder="Email" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 outline-none focus:border-orange-600 text-white" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input type="password" placeholder="Password" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 outline-none focus:border-orange-600 text-white" required />
          </div>
          <button type="submit" className="w-full bg-white text-black font-black uppercase py-4 rounded-xl hover:bg-orange-600 hover:text-white transition-all">
            Login
          </button>
        </form>
        <p className="mt-8 text-center text-zinc-500 text-sm">
          New to FitLift? <span onClick={() => navigate('/signup')} className="text-orange-600 cursor-pointer font-bold hover:underline">Create one</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;