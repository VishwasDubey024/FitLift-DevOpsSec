import React, { useState } from 'react';
import { User, Mail, Weight, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ goal: '', gender: '', age: '' });

    const goals = [
        { id: 'loss', label: 'Weight Loss', icon: '🔥' },
        { id: 'gain', label: 'Muscle Gain', icon: '💪' },
        { id: 'endurance', label: 'Endurance', icon: '🏃' }
    ];

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6 py-20 bg-black">
            <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem]">
                <h2 className="text-4xl font-black uppercase italic mb-8 text-white">Create Account</h2>

                <form className="space-y-6" onSubmit={handleRegister}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input placeholder="Full Name" className="bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-600 text-white" required />
                        <input placeholder="Email" type="email" className="bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-600 text-white" required />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <input placeholder="Weight (kg)" className="bg-black/50 border border-white/10 rounded-xl p-4 outline-none text-white" required />
                        <input placeholder="Height (cm)" className="bg-black/50 border border-white/10 rounded-xl p-4 outline-none text-white" required />
                        <select className="col-span-2 bg-black/50 border border-white/10 rounded-xl px-4 text-zinc-400 outline-none focus:border-orange-600" required>
                            <option value="">Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>

                    <input
                        type="number"
                        placeholder="Age"
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-600 text-white"
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        required
                    />

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Select Your Goal</label>
                        <div className="grid grid-cols-3 gap-3">
                            {goals.map(g => (
                                <div
                                    key={g.id}
                                    onClick={() => setFormData({ ...formData, goal: g.id })}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${formData.goal === g.id ? 'border-orange-600 bg-orange-600/10' : 'border-white/5 bg-black/20'}`}
                                >
                                    <div className="text-2xl mb-1">{g.icon}</div>
                                    <div className="text-[10px] font-bold uppercase text-zinc-300">{g.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-orange-600 text-white font-black uppercase py-4 rounded-xl hover:bg-orange-700 transition-colors">
                        Register Now
                    </button>
                </form>

                <p className="mt-8 text-center text-zinc-500 text-sm">
                    Already have an account? <span onClick={() => navigate('/login')} className="text-orange-600 cursor-pointer font-bold hover:underline">Login here</span>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;