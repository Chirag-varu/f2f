'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; 
import { useRouter } from 'next/navigation';

export default function IndustryAuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [industryName, setIndustryName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');

  const handleAuthAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 

    try {
      if (isSignup) {
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
          email, 
          password 
        });

        if (authError) throw authError;

        if (authData?.user) {
          // 2. Immediately store extra data in the 'profiles' table
          const { error: profileError } = await supabase.from('industries').insert({
            id: authData.user.id, // Links to the Auth user
            company_name: industryName,
            contact_person: contactNumber,
            state: state,
            district: district,
            email: email,
          });

          if (profileError) throw profileError;
          
          alert("Account created and data saved!");
          router.push('/dashboard/industry');
        }
      } else {
        // Sign In Logic
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push('/dashboard/industry');
      }
    } catch (error: any) {
      alert(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* Branding Side */}
      <div className="hidden lg:flex w-1/2 bg-emerald-900 p-12 flex-col justify-between relative overflow-hidden text-white">
        <div className="relative z-10">
          <h2 className="text-5xl font-black leading-tight">Farmer 2 Fuel</h2>
          <p className="mt-4 text-emerald-200 text-lg">Direct database storage enabled. No OTP required.</p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-800 rounded-full opacity-30"></div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-black mb-8">{isSignup ? 'Register Industry' : 'Login'}</h1>
          
          <form onSubmit={handleAuthAction} className="space-y-4">
            {isSignup && (
              <>
                <input required placeholder="Industry Name" onChange={e => setIndustryName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none" />
                <input required type="tel" placeholder="Contact Number" onChange={e => setContactNumber(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="State" onChange={e => setState(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none" />
                  <input required placeholder="District" onChange={e => setDistrict(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none" />
                </div>
              </>
            )}
            <input required type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none" />
            <input required type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none" />
            
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? 'SAVING DATA...' : (isSignup ? 'CREATE ACCOUNT' : 'SIGN IN')}
            </button>
          </form>

          <button onClick={() => setIsSignup(!isSignup)} className="mt-6 text-emerald-600 font-bold block w-full text-center">
            {isSignup ? 'Switch to Login' : 'Register your Industry'}
          </button>
        </div>
      </div>
    </div>
  );
}