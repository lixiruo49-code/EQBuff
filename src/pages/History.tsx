
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Trash2, Search, Copy, Check, MessageSquare, PartyPopper, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MessageRecord } from "../types";
import { cn } from "../lib/utils";

export function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<MessageRecord[]>([]);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('eq_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const deleteRecord = (id: string) => {
    const updated = history.filter(r => r.id !== id);
    setHistory(updated);
    localStorage.setItem('eq_history', JSON.stringify(updated));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = history.filter(r => 
    r.input.toLowerCase().includes(search.toLowerCase()) || 
    r.scene.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto min-h-screen bg-[#F8F9FA]"
    >
      <header className="p-6 flex items-center gap-4 bg-white sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate('/profile')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">话术记录</h1>
      </header>

      <div className="p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索场景或关键词..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[24px] shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center space-y-2 opacity-30">
            <Search size={48} className="mx-auto mb-4" />
            <p className="font-bold">暂无相关记录</p>
            <p className="text-xs">快去主页生成对话吧</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 flex flex-col gap-3 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-2 rounded-xl",
                        r.type === 'answer' ? "bg-blue-50 text-blue-600" : 
                        r.type === 'liven-up' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      )}>
                        {r.type === 'answer' ? <MessageSquare size={16} /> : 
                         r.type === 'liven-up' ? <PartyPopper size={16} /> : <Zap size={16} />}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{r.scene}</span>
                    </div>
                    <button onClick={() => deleteRecord(r.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 line-clamp-2 px-1">问：{r.input}</p>
                  
                  <div className="space-y-2 mt-1">
                    {r.output.map((out, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-2xl text-xs leading-relaxed text-gray-700 relative group">
                        {out}
                        <button 
                          onClick={() => handleCopy(out, `${r.id}-${idx}`)}
                          className="absolute right-2 bottom-2 p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          {copiedId === `${r.id}-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-[10px] text-gray-300 font-medium px-1">
                    {new Date(r.timestamp).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
