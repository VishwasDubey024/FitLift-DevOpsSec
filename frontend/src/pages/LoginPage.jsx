import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', credentials);
            
            if (response.status === 200) {
              
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username || credentials.username);
                
                console.log("Login Success. Token saved:", response.data.token);
                alert("Welcome back to FitLift!");
                navigate('/dashboard'); 
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data);
            alert("Login Failed: " + (error.response?.data?.error || "Invalid Credentials"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6">
            <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem]">
                <h2 className="text-4xl font-black uppercase italic mb-8 text-white text-center tracking-tighter">Login</h2>
                
                <form className="space-y-6" onSubmit={handleLogin}>
                    <input 
                        name="username"
                        placeholder="Username" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-600 text-white"
                        onChange={handleChange}
                        required 
                    />
                    <input 
                        name="password"
                        type="password"
                        placeholder="Password" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-600 text-white"
                        onChange={handleChange}
                        required 
                    />
                    <button type="submit" className="w-full bg-orange-600 text-white font-black uppercase py-4 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
                        Let's Go
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;