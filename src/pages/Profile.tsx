
import { motion } from "motion/react";
import { ArrowLeft, Settings as SettingsIcon, History, Award, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { DIMENSION_LABELS } from "../constants";
import { UserProfile } from "../types";

export function Profile({ user, setUser }: { user: UserProfile, setUser: (u: UserProfile) => void }) {
  const navigate = useNavigate();

  const chartData = Object.entries(user.eqDimensions).map(([key, value]) => ({
    subject: DIMENSION_LABELS[key as keyof typeof DIMENSION_LABELS],
    value: value,
    fullMark: 100,
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto min-h-screen bg-[#F9FAFB] pb-10"
    >
      <header className="p-6 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors border-2 border-transparent active:border-black">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">玩家档案 / PROFILE</h1>
        <button onClick={() => navigate('/settings')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors border-2 border-transparent active:border-black">
          <SettingsIcon size={24} />
        </button>
      </header>

      <div className="p-6 space-y-6">
        <section className="bg-white p-8 brutalist-card rounded-none flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-none flex items-center justify-center text-4xl border-4 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            {user.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{user.name}</h2>
            <div className="flex gap-6 mt-3">
              <div className="text-left border-l-2 border-black pl-3">
                <p className="text-2xl font-black text-slate-900 leading-none">{user.usageCount}</p>
                <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mt-1">RESPONSE</p>
              </div>
              <div className="text-left border-l-2 border-black pl-3">
                <p className="text-2xl font-black text-slate-900 leading-none">{user.practiceCount}</p>
                <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mt-1">PRACTICE</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 brutalist-card rounded-none space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              成长轨迹 / EQ PROFILE
            </h3>
            <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest">ACTIVE</span>
          </div>
          
          <div className="h-[280px] w-full flex items-center justify-center py-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#E2E8F0" strokeWidth={1} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 10, fontWeight: 900 }} />
                <Radar
                  name="EQ Dimensions"
                  dataKey="value"
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.15}
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
             {chartData.map(d => (
               <div key={d.subject} className="p-4 bg-slate-50 border border-slate-100 rounded-none flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{d.subject}</span>
                 <span className="text-xl font-black text-slate-900 leading-none">{d.value}</span>
               </div>
             ))}
          </div>
        </section>

        <nav className="space-y-4 pt-2">
          <button 
            onClick={() => navigate('/history')}
            className="w-full brutalist-card p-6 flex items-center justify-between group rounded-none"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black text-white rounded-none">
                <History size={24} />
              </div>
              <span className="text-lg font-black uppercase tracking-tighter">历史记录 / HISTORY</span>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-black transition-colors" />
          </button>
        </nav>
      </div>
    </motion.div>
  );
}
