
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, RefreshCw, Copy, Check, AlertCircle } from "lucide-react";
import { SCENES, FOCUS_POINTS, TONES } from "../constants";
import { generateResponse } from "../services/geminiService";
import { cn } from "../lib/utils";
import { UserProfile, MessageRecord } from "../types";

export function FeaturePage({ user, setUser }: { user: UserProfile, setUser: (u: UserProfile) => void }) {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [scene, setScene] = useState("");
  const [extra, setExtra] = useState(""); // focus point or tone
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const isDestroy = type === 'destroy';
  
  useEffect(() => {
    if (isDestroy) {
      setScene('极端场景');
      setExtra('尖锐');
    } else {
      setScene(SCENES[type as keyof typeof SCENES]?.[0] || "");
      setExtra(type === 'answer' ? FOCUS_POINTS[0] : type === 'hit-back' ? TONES[0] : "");
    }
  }, [type]);

  const performGeneration = async () => {
    setShowWarning(false);
    setLoading(true);
    setResults([]);
    setError("");
    try {
      const data = { scene, input, focus: extra, style: extra, tone: extra };
      const generated = await generateResponse(type!, data);
      setResults(generated);
      
      if (!isDestroy) {
        // Save to history
        const newRecord: MessageRecord = {
          id: Date.now().toString(),
          type: type as any,
          scene,
          input,
          output: generated,
          timestamp: Date.now(),
        };
        const history = JSON.parse(localStorage.getItem('eq_history') || '[]');
        localStorage.setItem('eq_history', JSON.stringify([newRecord, ...history].slice(0, 50)));
        
        setUser({ ...user, usageCount: user.usageCount + 1 });
      }
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes('API_KEY')) {
        setError("配置错误：API秘钥未生效，请检查侧边栏设置。");
      } else if (err?.message?.includes('quota')) {
        setError("使用频率过高，请稍后再试。");
      } else {
        setError("生成失败，请重试。" + (err?.message ? `(${err.message.substring(0, 20)}...)` : ""));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("请输入相关内容后生成");
      return;
    }
    setError("");

    if (isDestroy) {
      setShowWarning(true);
    } else {
      performGeneration();
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const themeColor = isDestroy ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-slate-800";
  const textColor = isDestroy ? "text-red-600" : "text-black";
  const bgColor = "bg-white";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto min-h-screen bg-[#F9FAFB]"
    >
      {isDestroy && (
        <div className="bg-red-600 text-white text-[11px] font-black py-2 px-4 text-center sticky top-0 z-50 uppercase tracking-widest">
          ⚠️ EXTREME ATTACK MODE: USE WITH CAUTION
        </div>
      )}

      <header className="p-6 flex items-center gap-4 bg-white border-b border-slate-200">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors brutalist-card shadow-none border-slate-200">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">{
          type === 'answer' ? '帮我回答' : 
          type === 'liven-up' ? '帮我助兴' : 
          type === 'hit-back' ? '帮我回击' : '毁灭吧!!!'
        }</h1>
      </header>

      <div className="p-6 space-y-8">
        {!isDestroy && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">01 / 选择场景</label>
            <div className="flex flex-wrap gap-2">
              {SCENES[type as keyof typeof SCENES]?.map(s => (
                <button
                  key={s}
                  onClick={() => setScene(s)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                    scene === s ? "bg-black text-white border-black" : "bg-white text-slate-600 border-slate-100 hover:border-black"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {isDestroy ? '01 / 目标恶意内容' : '02 / 输入详情'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isDestroy ? "输入你想回击的恶意留言..." : "在此输入情境或对方的问题..."}
            className={cn(
              "w-full h-32 p-4 rounded-2xl border-2 bg-white focus:outline-none transition-all resize-none text-sm font-medium",
              isDestroy ? "border-red-600 focus:ring-4 focus:ring-red-100" : "border-black focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            )}
          />
          {error && <p className="text-red-500 text-xs font-black flex items-center gap-1 mt-1 uppercase"><AlertCircle size={12} /> {error}</p>}
        </div>

        {!isDestroy && (type === 'answer' || type === 'hit-back') && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">03 / 语气微调</label>
            <div className="flex flex-wrap gap-2">
              {(type === 'answer' ? FOCUS_POINTS : TONES).map(p => (
                <button
                  key={p}
                  onClick={() => setExtra(p)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all",
                    extra === p ? "bg-black text-white border-black" : "bg-white text-slate-600 border-slate-100 hover:border-black"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={cn(
            "w-full py-5 rounded-2xl text-white font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2",
            themeColor,
            !isDestroy && "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? <RefreshCw className="animate-spin" /> : '开始生成 / GENERATE'}
        </button>

        <div className="space-y-6 pt-4">
          <AnimatePresence>
            {results.map((res, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "brutalist-card p-6 relative group",
                  isDestroy ? "border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]" : "border-black"
                )}
              >
                <div className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-30">RESULT {idx + 1}</div>
                <p className="text-sm font-bold leading-relaxed text-slate-800 pr-8 italic">“{res}”</p>
                <button 
                  onClick={() => handleCopy(res, idx)}
                  className={cn(
                    "absolute top-4 right-4 p-2 rounded-xl transition-all active:scale-90 border-2 border-slate-100 hover:border-black",
                    textColor
                  )}
                >
                  {copiedIndex === idx ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border-4 border-red-600 p-8 rounded-[40px] max-w-sm w-full text-center space-y-6 shadow-[12px_12px_0px_0px_rgba(220,38,38,1)]"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border-2 border-red-600">
                <AlertCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-red-600">极端警示 / DANGER</h3>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  你正在进入“毁灭吧！”模式。系统将生成极具毁灭性的回击，可能造成无法挽回的社交裂痕。你想好了吗？
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowWarning(false)}
                  className="py-4 border-2 border-black font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 bg-white text-black"
                >
                  撤退
                </button>
                <button 
                  onClick={() => performGeneration()}
                  className="py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all"
                >
                  确认毁灭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
