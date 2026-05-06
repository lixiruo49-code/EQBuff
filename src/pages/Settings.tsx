
import { motion } from "motion/react";
import { ArrowLeft, ShieldAlert, Trash2, Info, ChevronRight, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Settings() {
  const navigate = useNavigate();

  const clearCache = () => {
    if (confirm("确定要删除所有历史记录和练习数据吗？此操作不可撤销。")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

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
        <h1 className="text-xl font-bold">基础设置</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="bg-red-50 p-6 rounded-[32px] border border-red-100 space-y-4">
          <div className="flex items-center gap-3 text-red-600 font-bold">
            <ShieldAlert size={20} />
            安全性提示
          </div>
          <p className="text-xs text-red-800 leading-relaxed opacity-80 font-medium">
            “毁灭吧！”功能生成的攻击性话术极具破坏性。我们强烈建议仅在遭遇极端恶意攻击时使用。系统不会保存该功能生成的任何内容以保护隐私。
          </p>
        </div>

        <section className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">通用管理</label>
          <div className="bg-white rounded-[32px] shadow-sm overflow-hidden divide-y divide-gray-50">
            <button className="w-full p-6 flex items-center justify-between text-left group active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-xl text-gray-500">
                  <MessageSquare size={20} />
                </div>
                <span className="font-bold text-gray-700">意见反馈</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
            
            <button className="w-full p-6 flex items-center justify-between text-left group active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-xl text-gray-500">
                  <Info size={20} />
                </div>
                <span className="font-bold text-gray-700">关于 EQ buff</span>
              </div>
              <span className="text-xs font-bold text-gray-300 mr-1">v1.0.0</span>
            </button>
          </div>
        </section>

        <section className="space-y-4 pt-4">
          <button 
            onClick={clearCache}
            className="w-full p-6 bg-white rounded-[32px] shadow-sm flex items-center justify-center gap-3 text-red-500 font-bold active:scale-[0.98] active:bg-red-50 transition-all border border-transparent hover:border-red-100"
          >
            <Trash2 size={20} />
            清除所有缓存数据
          </button>
          <p className="text-center text-[10px] text-gray-400 px-10 leading-relaxed uppercase tracking-tighter">
            删除后，您的历史话术、练习记录和能力多边形图表将全部重置。
          </p>
        </section>
      </div>

      <footer className="mt-10 py-10 text-center space-y-1">
        <p className="text-xs font-bold text-gray-300 tracking-tighter">EQ BUFF: BOOST YOUR SOCIAL INTELLIGENCE</p>
        <p className="text-[10px] text-gray-200">MADE WITH ✨ BY AI STUDIO</p>
      </footer>
    </motion.div>
  );
}
