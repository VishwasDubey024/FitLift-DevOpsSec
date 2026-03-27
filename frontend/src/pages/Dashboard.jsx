import React from 'react';
import {Home, PlusCircle, Settings, Users, User,LogOut, Download, Activity, TrendingUp, FireExtinguisher} from 'lucide-react';
import {PieChart, Pie, Cell, ResponsiveContainer,Tooltip, Legend, BarChart, Bar, XAxis, YAxis} from 'recharts';

const Dashboard = () => {
    const macroData = [
        { name: 'Protein', value: 160, color: '#ea580c' }, 
        { name: 'Carbs', value: 200, color: '#f97316' },   
        { name: 'Fats', value: 70, color: '#fb923c' },    
    ];

    const strengthData = [
        { name: 'Squat', weight: 120 },
        { name: 'Bench', weight: 80 },
        { name: 'Deadlift', weight: 150 },
    ];

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    };

    return (
        <div className="flex min-h-screen bg-black text-white font-sans">
            <aside className="w-64 border-r border-white/10 flex flex-col p-6 fixed h-full bg-black z-20">
                <div className="text-3xl font-black italic uppercase tracking-tighter mb-12">
                    FitLift<span className="text-orange-600">.</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem icon={<Home size={20} />} label="Home" active />
                    <NavItem icon={<PlusCircle size={20} />} label="Add PR" />
                    <NavItem icon={<Users size={20} />} label="Leaderboard" badge="Soon" />
                    <NavItem icon={<User size={20} />} label="Profile" />
                    <NavItem icon={<Settings size={20} />} label="Settings" />
                </nav>

                <button onClick={handleLogout}className="flex items-center gap-3 text-zinc-500 hover:text-red-500 transition-all mt-auto group">
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase text-[10px] tracking-widest">Logout</span>
                </button>
            </aside>

            <main className="flex-1 ml-64 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter">Your Progress</h1>
                        <p className="text-zinc-500 font-medium">Welcome back, Let's crush it today.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/10 px-6 py-3 rounded-2xl">
                        <Activity className="text-orange-600 animate-pulse" size={20} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Live Tracking</span>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard title="BMI Index" value="24.2" desc="Healthy Weight" color="text-green-500" />
                    <StatCard title="Target Calories" value="2,800" desc="Muscle Gain Phase" color="text-orange-600" />
                    <StatCard title="Daily Protein" value="160g" desc="Target Reached" color="text-blue-500" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

                    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem]">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                            <TrendingUp size={14} /> Macro Distribution
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-zinc-500">
                                    Charts Loading soon...
                                </div>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-zinc-900 via-black to-orange-900/20 border border-orange-600/20 p-10 rounded-[2.5rem] flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><FireExtinguisher size={100} /></div>
                        <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(234,88,12,0.3)] transform -rotate-6">
                            <Download className="text-white" size={36} />
                        </div>
                        <h2 className="text-3xl font-black uppercase italic mb-3 tracking-tighter text-white">Gemini AI Diet</h2>
                        <p className="text-zinc-400 text-sm mb-10 max-w-xs leading-relaxed">
                            Get a personalized 7-day nutrition plan generated by AI based on your body stats.
                        </p>
                        <button className="w-full bg-white text-black font-black uppercase py-5 rounded-2xl hover:bg-orange-600 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 text-xs tracking-widest">
                            Generate Diet Plan (PDF)
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, badge }) => (
    <div className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}>
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