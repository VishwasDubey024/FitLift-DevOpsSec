import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Settings, Users, User, LogOut, Download, Activity, TrendingUp, FireExtinguisher, Edit2, Trophy, Trash2, Zap } from 'lucide-react';

const Dashboard = () => {
    const API_BASE_URL = 'http://127.0.0.1:8000';
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        username: 'User', weight: 0, height: 0, age: 0, gender: 'Male', goal: 'Fitness', calories: 0, macros: []
    });

    const [userPrs, setUserPrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const fetchDashboardData = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        try {
            const response = await axios.get(`${API_BASE_URL}/api/profile/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setUserData(response.data);
        } catch (error) { console.error("Fetch Error:", error); }
    };

    const fetchPrs = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/get-prs/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setUserPrs(response.data);
            setLoading(false);
        } catch (error) {
            console.error("PR Fetch Error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchPrs();
    }, []);

    const calculateBMI = (w, h) => {
        if (!w || !h || h === 0) return "0.0";
        return (w / ((h / 100) ** 2)).toFixed(1);
    };

    const getBMICategory = (bmi) => {
        const val = parseFloat(bmi);
        if (val < 18.5) return { label: "Underweight", color: "text-blue-400", bg: "bg-blue-400", percent: 25 };
        if (val < 25) return { label: "Healthy", color: "text-green-500", bg: "bg-green-500", percent: 50 };
        if (val < 30) return { label: "Overweight", color: "text-yellow-500", bg: "bg-yellow-500", percent: 75 };
        return { label: "Obese", color: "text-red-500", bg: "bg-red-500", percent: 100 };
    };

    const bmiValue = calculateBMI(userData.weight, userData.height);
    const bmiInfo = getBMICategory(bmiValue);

    const handleDeletePR = async (id) => {
        if (!window.confirm("Bhai, sach mein delete karna hai?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_BASE_URL}/api/delete-pr/${id}/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            fetchPrs(); 
        } catch (err) { alert("Delete failed!"); }
    };

    const handleEditPR = async (pr) => {
        const newWeight = prompt(`Update weight for ${pr.exercise_name} (KG):`, pr.weight);
        if (newWeight && !isNaN(newWeight)) {
            const token = localStorage.getItem('token');
            try {
                await axios.patch(`${API_BASE_URL}/api/edit-pr/${pr.id}/`, 
                    { weight: parseFloat(newWeight) },
                    { headers: { 'Authorization': `Token ${token}` } }
                );
                fetchPrs();
            } catch (err) { alert("Update failed!"); }
        }
    };

    const handleGenerateDiet = async () => {
        const token = localStorage.getItem('token');
        setGenerating(true);
        try {
            const response = await axios({
                url: `${API_BASE_URL}/api/generate-diet/`,
                method: 'GET',
                responseType: 'blob',
                headers: { 'Authorization': `Token ${token}` }
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${userData.username}_AI_Diet_Plan.pdf`);
            document.body.appendChild(link);
            link.click();
            alert("Success! Your AI Diet Plan is ready.");
        } catch (error) {
            alert("Bhai, Gemini API busy hai!");
        } finally {
            setGenerating(false);
        }
    };

    const handleUpdateWeight = async () => {
        const newWeight = prompt("Enter your new weight (kg):", userData.weight);
        if (newWeight && !isNaN(newWeight)) {
            try {
                const token = localStorage.getItem('token');
                await axios.patch(`${API_BASE_URL}/api/profile/update/`,
                    { weight: parseFloat(newWeight) },
                    { headers: { Authorization: `Token ${token}` } }
                );
                alert("Weight Updated!");
                fetchDashboardData();
            } catch (error) { alert("Update failed!"); }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center font-black italic uppercase tracking-widest">
                <Activity className="text-orange-600 animate-spin mb-4" size={48} />
                Loading FitLift Stats...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-black text-white font-sans">
            <aside className="w-64 border-r border-white/10 flex flex-col p-6 fixed h-full bg-black z-20">
                <div className="text-3xl font-black italic uppercase tracking-tighter mb-12 text-white">
                    FitLift<span className="text-orange-600">.</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <NavItem icon={<Home size={20} />} label="Home" active onClick={() => navigate('/dashboard')} />
                    <NavItem icon={<PlusCircle size={20} />} label="Add PR" onClick={() => navigate('/add-pr')} />
                    <NavItem icon={<Users size={20} />} label="Leaderboard" badge="Soon" onClick={() => { }} />
                    <NavItem icon={<User size={20} />} label="Profile" onClick={() => navigate('/profile')} />
                </nav>
                <button onClick={handleLogout} className="flex items-center gap-3 text-zinc-500 hover:text-red-500 transition-all mt-auto group">
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase text-[10px] tracking-widest">Logout</span>
                </button>
            </aside>

            <main className="flex-1 ml-64 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Dashboard</h1>
                        <p className="text-zinc-500 font-medium italic mt-2">Welcome back, {userData.username}.</p>
                    </div>
                    <button onClick={handleUpdateWeight} className="flex items-center gap-3 bg-orange-600 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
                        <Edit2 size={16} /> Update Weight
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-8 rounded-[2.5rem] lg:col-span-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">Health Category</p>
                        <div className="flex justify-between items-end mb-2">
                            <h4 className="text-5xl font-black italic tracking-tighter">{bmiValue}</h4>
                            <span className={`font-black uppercase text-[10px] mb-2 ${bmiInfo.color}`}>{bmiInfo.label}</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                            <div className={`h-full ${bmiInfo.bg} transition-all duration-1000`} style={{ width: `${bmiInfo.percent}%` }}></div>
                        </div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                            Ideal: {Math.round(18.5 * (userData.height/100)**2)} - {Math.round(24.9 * (userData.height/100)**2)} KG
                        </p>
                    </div>
                    <StatCard title="Target Daily Calories" value={`${userData.calories}`} desc={`Goal: ${userData.goal}`} color="text-orange-600" />
                    <StatCard title="Current Body Weight" value={`${userData.weight}kg`} desc={`Age: ${userData.age} yrs`} color="text-blue-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* --- UPDATED MACRO PIE CHART SECTION --- */}
                    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] relative min-h-[450px]">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                            <Activity size={14} className="text-orange-600" /> Daily Macro Targets
                        </h3>
                        
                        {userData.macros && userData.macros.length > 0 ? (
                            <div className="flex flex-col items-center">
                                <div className="h-[250px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={userData.macros} 
                                                cx="50%" cy="50%" 
                                                innerRadius={70} 
                                                outerRadius={90} 
                                                paddingAngle={8} 
                                                dataKey="value" 
                                                stroke="none"
                                            >
                                                {userData.macros.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                        <p className="text-3xl font-black italic text-white leading-none">{userData.calories}</p>
                                        <p className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest">Total Kcal</p>
                                    </div>
                                </div>

                                {/* Macro Details Grid */}
                                <div className="grid grid-cols-3 gap-4 w-full mt-6 pt-6 border-t border-white/5">
                                    {userData.macros.map((macro, index) => (
                                        <div key={index} className="text-center">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${macro.name === 'Protein' ? 'text-orange-600' : 'text-zinc-500'}`}>
                                                {macro.name}
                                            </p>
                                            <p className="text-xl font-black italic text-white">{macro.grams}g</p>
                                            <p className="text-[8px] text-zinc-600 font-bold uppercase">{Math.round((macro.value / userData.calories) * 100)}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-zinc-600 italic text-[10px] uppercase font-bold tracking-widest">
                                Loading Macros...
                            </div>
                        )}
                    </div>

                    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] flex flex-col max-h-[450px]">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                            <Trophy size={14} className="text-orange-600" /> Personal Records
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {userPrs.length > 0 ? userPrs.map((pr, index) => (
                                <div key={index} className="group flex items-center justify-between bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-orange-600/30 transition-all">
                                    <div>
                                        <p className="text-white font-black uppercase italic text-sm">{pr.exercise_name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Zap size={10} className="text-yellow-500" />
                                            <p className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest">Est. 1RM: {Math.round(pr.weight * (1 + pr.reps / 30))}KG</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-orange-600 font-black text-xl italic leading-none">{pr.weight}KG</p>
                                            <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest">{pr.reps} Reps</p>
                                        </div>
                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditPR(pr)} className="text-zinc-500 hover:text-white transition-colors"><Edit2 size={12} /></button>
                                            <button onClick={() => handleDeletePR(pr.id)} className="text-zinc-500 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-zinc-600 italic font-bold uppercase text-[10px] text-center py-20">No PRs found.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-zinc-900 to-orange-900/20 border border-orange-600/20 p-10 rounded-[2.5rem] flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><FireExtinguisher size={120} /></div>
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-600/40 rotate-6">
                            <Download className="text-white" size={36} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">AI Personal Diet Plan</h2>
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Generated by Gemini based on your demographics</p>
                        </div>
                    </div>
                    <button onClick={handleGenerateDiet} disabled={generating} className={`px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl ${generating ? 'bg-zinc-700 text-zinc-500' : 'bg-white text-black hover:bg-orange-600 hover:text-white'}`}>
                        {generating ? 'Processing AI...' : 'Download PDF'}
                    </button>
                </div>
            </main>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #ea580c; border-radius: 10px; }
            `}</style>
        </div>
    );
};

const NavItem = ({ icon, label, active, badge, onClick }) => (
    <div onClick={onClick} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}>
        <div className="flex items-center gap-4">
            {icon} <span className="font-bold uppercase text-[10px] tracking-widest">{label}</span>
        </div>
        {badge && <span className="bg-zinc-800 text-[8px] px-2 py-1 rounded-md text-zinc-400 font-bold uppercase">{badge}</span>}
    </div>
);

const StatCard = ({ title, value, desc, color }) => (
    <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-8 rounded-[2rem] transition-all hover:border-white/10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">{title}</p>
        <h4 className="text-5xl font-black italic tracking-tighter mb-2">{value}</h4>
        <p className={`text-[10px] font-bold uppercase ${color} tracking-widest`}>{desc}</p>
    </div>
);

export default Dashboard;