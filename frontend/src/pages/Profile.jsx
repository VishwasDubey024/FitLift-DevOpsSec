import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Save, Scale, Ruler, Calendar, Target } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const API_BASE_URL = 'http://98.88.37.221:8000';
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        username: '', weight: '', height: '', age: '', goal: 'Fitness'
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${API_BASE_URL}/api/profile/`, {
                    headers: { 'Authorization': `Token ${token}` }
                });
                setProfile(res.data);
                setLoading(false);
            } catch (err) { navigate('/login'); }
        };
        fetchProfile();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.patch(`${API_BASE_URL}/api/profile/update/`, profile, {
                headers: { 'Authorization': `Token ${token}` }
            });
            alert("Profile Updated Successfully! 🚀");
            navigate('/dashboard');
        } catch (err) { alert("Update failed. Check your data."); }
    };

    if (loading) return <div className="bg-black min-h-screen text-white flex items-center justify-center font-black italic uppercase tracking-widest animate-pulse">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-10 transition-all group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase text-[10px] tracking-widest">Back to Dashboard</span>
                </button>

                <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl relative overflow-hidden">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-20 h-20 bg-orange-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-orange-600/30 rotate-3">
                            <User className="text-white" size={36} />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{profile.username}</h1>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">Edit Your Stats</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProfileInput label="Age" icon={<Calendar size={14}/>} value={profile.age} 
                            onChange={(e) => setProfile({...profile, age: e.target.value})} />
                        
                        <ProfileInput label="Weight (KG)" icon={<Scale size={14}/>} value={profile.weight} 
                            onChange={(e) => setProfile({...profile, weight: e.target.value})} />
                        
                        <ProfileInput label="Height (CM)" icon={<Ruler size={14}/>} value={profile.height} 
                            onChange={(e) => setProfile({...profile, height: e.target.value})} />

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Current Goal</label>
                            <select 
                                className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-orange-600 transition-all font-bold appearance-none cursor-pointer"
                                value={profile.goal}
                                onChange={(e) => setProfile({...profile, goal: e.target.value})}
                            >
                                <option value="Weight Loss">Weight Loss</option>
                                <option value="Muscle Gain">Muscle Gain</option>
                                <option value="Endurance">Endurance</option>
                                <option value="Fitness">General Fitness</option>
                            </select>
                        </div>

                        <button type="submit" className="md:col-span-2 mt-4 bg-white text-black font-black uppercase py-6 rounded-2xl hover:bg-orange-600 hover:text-white transition-all text-xs tracking-[0.3em] flex items-center justify-center gap-3">
                            <Save size={18} /> Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ProfileInput = ({ label, icon, value, onChange }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 flex items-center gap-2">
            {icon} {label}
        </label>
        <input 
            type="number" value={value} onChange={onChange}
            className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-orange-600 transition-all font-bold"
        />
    </div>
);

export default Profile;