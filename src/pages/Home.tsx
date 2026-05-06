
import { motion } from "motion/react";
import { MessageSquare, PartyPopper, Zap, Skull, BrainCircuit, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

const FEATURES = [
  { id: 'answer', title: '帮我回答', icon: MessageSquare, desc: '面试、组会、职场难关。', label: '01 / RESPONSE', accent: 'text-blue-600', color: 'hover:bg-blue-50', path: '/feature/answer' },
  { id: 'liven-up', title: '帮我助兴', icon: PartyPopper, desc: '祝酒、破冰、开场白。', label: '02 / ATMOSPHERE', accent: 'text-yellow-500', color: 'hover:bg-yellow-50', path: '/feature/liven-up' },
  { id: 'hit-back', title: '帮我回击', icon: Zap, desc: '幽默回击恶意质疑。', label: '03 / DEFENSE', accent: 'text-emerald-500', color: 'hover:bg-emerald-50', path: '/feature/hit-back' },
  { id: 'destroy', title: '毁灭吧！', icon: Skull, desc: '极端场景尖锐防御。', label: '04 / EXTREME', accent: 'text-white', color: 'bg-[#EF4444] text-white hover:bg-red-600', path: '/feature/destroy', isDangerous: true },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto min-h-screen flex flex-col"
    >
      <header className="h-20 flex items-center justify-between px-6 bg-white border-b border-slate-200">
        <div className="flex items-baseline gap-2">
          <h1 className="text-3xl font-black tracking-tighter text-black uppercase">EQ Buff</h1>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">V1.0</span>
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold transition-transform active:scale-90"
        >
          JD
        </button>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <section className="grid grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.button
              key={f.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(f.path)}
              className={cn(
                "brutalist-card p-5 flex flex-col justify-between text-left h-48",
                f.id === 'destroy' ? 'bg-[#EF4444]' : 'bg-white',
                f.color
              )}
            >
              <div className="relative z-10">
                <div className={cn("text-[10px] font-black uppercase tracking-widest mb-2", f.accent)}>{f.label}</div>
                <h2 className={cn(
                  "text-3xl font-black leading-none mb-2 uppercase tracking-tighter whitespace-pre-line",
                  f.id === 'destroy' ? 'text-white' : 'text-black'
                )}>
                  {f.title === '毁灭吧！' ? '毁灭吧!!!' : f.title.replace('帮我', '帮我\n')}
                </h2>
                <p className={cn("text-[10px] font-bold leading-tight", f.id === 'destroy' ? 'text-white/90' : 'text-slate-500')}>
                  {f.desc}
                </p>
              </div>
              <div className="text-right relative z-10">
                <span className={cn(
                  "inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                  f.id === 'destroy' ? 'bg-white text-black' : 'bg-black text-white'
                )}>
                  ENTER
                </span>
              </div>
            </motion.button>
          ))}
        </section>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/practice')}
          className="w-full brutalist-card p-6 flex items-center justify-between group bg-black text-white active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white text-black border-2 border-white rounded-none">
              <BrainCircuit size={28} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-lg uppercase tracking-tighter text-white">能力练习 / PRACTICE</h3>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest text-white/80">提升话术，点亮你的能力图</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-white" />
        </motion.button>
      </main>

      <footer className="h-12 border-t border-slate-200 px-6 flex items-center justify-center text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
        © 2026 EQ Buff · SOCIAL INTELLIGENCE
      </footer>
    </motion.div>
  );
}
