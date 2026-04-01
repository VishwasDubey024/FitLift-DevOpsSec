import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Save, Trophy } from 'lucide-react';
import axios from 'axios';

const AddPR = () => {
    const navigate = useNavigate();
    const API_BASE_URL = 'http://127.0.0.1:8000';
    const [prData, setPrData] = useState({
        exercise_name: '',
        weight: '',
        reps: '',
        date: new Date().toISOString().split('T')[0] 
    });

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            await axios.post(`${API_BASE_URL}/api/add-pr/`, prData, {
                headers: { 'Authorization': `Token ${token}` }
            });
            alert("Boom! New PR Recorded. 🔥");
            navigate('/dashboard');
        } catch (error) {
            console.error("PR Save Error:", error);
            alert("Failed to save PR. Check if backend is running!");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col items-center">
            <div className="w-full max-w-xl">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-orange-600 transition-all mb-12 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase text-[10px] tracking-widest">Back to Dashboard</span>
                </button>

                <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
                    {/* Background Decoration */}
                    <div className="absolute -top-10 -right-10 opacity-10">
                        <Trophy size={200} />
                    </div>

                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-600/40 rotate-6">
                            <Dumbbell className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Log New PR</h1>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Push your limits, {localStorage.getItem('username')}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Exercise Name</label>
                            <input 
                                type="text"
                                placeholder="e.g. Bench Press, Deadlift"
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 mt-2 outline-none focus:border-orange-600 text-white font-bold transition-all"
                                onChange={(e) => setPrData({...prData, exercise_name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Weight (KG)</label>
                                <input 
                                    type="number"
                                    placeholder="100"
                                    className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 mt-2 outline-none focus:border-orange-600 text-white font-bold transition-all"
                                    onChange={(e) => setPrData({...prData, weight: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Reps</label>
                                <input 
                                    type="number"
                                    placeholder="5"
                                    className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 mt-2 outline-none focus:border-orange-600 text-white font-bold transition-all"
                                    onChange={(e) => setPrData({...prData, reps: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-white text-black hover:bg-orange-600 hover:text-white font-black uppercase py-6 rounded-3xl transition-all text-xs tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 group"
                        >
                            <Save size={18} className="group-hover:scale-125 transition-transform" />
                            Record Achievement
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPR;