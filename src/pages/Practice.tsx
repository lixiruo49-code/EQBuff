
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, BrainCircuit, Star, MessageCircle, Info, RefreshCw, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SCENES, DIFFICULTY_LABELS } from "../constants";
import { generateQuestion, scorePractice } from "../services/geminiService";
import { cn } from "../lib/utils";
import { UserProfile, EQDimensions } from "../types";

export function Practice({ user, setUser }: { user: UserProfile, setUser: (u: UserProfile) => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'config' | 'answering' | 'result'>('config');
  const [category, setCategory] = useState(Object.keys(SCENES)[0]);
  const [difficulty, setDifficulty] = useState<'entry' | 'intermediate' | 'advanced'>('entry');
  const [questionData, setQuestionData] = useState<{ question: string, reference: string[] } | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startPractice = async () => {
    setLoading(true);
    try {
      const q = await generateQuestion(category, difficulty);
      setQuestionData(q);
      setStep('answering');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    try {
      const r = await scorePractice(questionData!.question, userAnswer);
      setResult(r);
      
      // Update global user EQ dimensions (averaging)
      const updateDimensions = (old: EQDimensions, incoming: EQDimensions) => {
        const updated = { ...old };
        Object.keys(incoming).forEach(key => {
          const k = key as keyof EQDimensions;
          updated[k] = Math.round((old[k] * user.practiceCount + incoming[k]) / (user.practiceCount + 1));
        });
        return updated;
      };

      const newDimensions = updateDimensions(user.eqDimensions, r.dimensions);
      setUser({
        ...user,
        practiceCount: user.practiceCount + 1,
        eqDimensions: newDimensions
      });

      // Save practice record
      const record = {
        id: Date.now().toString(),
        question: questionData!.question,
        userAnswer,
        ...r,
        timestamp: Date.now()
      };
      const history = JSON.parse(localStorage.getItem('eq_practice_history') || '[]');
      localStorage.setItem('eq_practice_history', JSON.stringify([record, ...history].slice(0, 50)));

      setStep('result');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto min-h-screen bg-white pb-10"
    >
      <header className="p-6 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">练习模式</h1>
      </header>

      <div className="px-6">
        <AnimatePresence mode="wait">
          {step === 'config' && (
            <motion.div 
              key="config"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="p-8 bg-purple-50 rounded-[40px] text-center space-y-4">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-purple-600 mx-auto shadow-sm">
                  <BrainCircuit size={40} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-purple-900">实战演练</h2>
                  <p className="text-sm text-purple-600/70">模拟真实场景，获得 AI 专业反馈</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">选择题目分类</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(SCENES).map(([key, scenes]) => (
                    <button
                      key={key}
                      onClick={() => setCategory(key)}
                      className={cn(
                        "p-4 rounded-3xl border text-left transition-all",
                        category === key ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-gray-50 text-gray-600 border-gray-100"
                      )}
                    >
                      <span className="text-xs opacity-60 block truncate mb-1">{scenes.join('/')}</span>
                      <span className="font-bold">{
                        key === 'answer' ? '职场/学业' : 
                        key === 'liven-up' ? '聚会助兴' : 
                        key === 'hit-back' ? '质疑回击' : '社交互动'
                      }</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">难道系数</label>
                <div className="flex gap-3">
                  {(['entry', 'intermediate', 'advanced'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "flex-1 py-4 rounded-3xl border font-bold transition-all",
                        difficulty === d ? "bg-purple-600 text-white border-purple-600" : "bg-gray-50 text-gray-500 border-gray-100"
                      )}
                    >
                      {DIFFICULTY_LABELS[d]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startPractice}
                disabled={loading}
                className="w-full py-5 bg-black text-white rounded-3xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" /> : '开始出题'}
                {!loading && <ChevronRight size={20} />}
              </button>
            </motion.div>
          )}

          {step === 'answering' && questionData && (
            <motion.div 
              key="answering"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <span className="inline-block px-3 py-1 bg-white rounded-full text-[10px] font-bold text-purple-600 mb-3 uppercase border border-purple-100">
                  {DIFFICULTY_LABELS[difficulty]} · {category}
                </span>
                <p className="text-lg font-bold text-gray-800 leading-relaxed italic">
                  “{questionData.question}”
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">你的回答</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="说点什么吧..."
                  className="w-full h-48 p-6 rounded-[32px] border border-gray-100 bg-gray-50 focus:ring-4 focus:ring-purple-50 focus:bg-white outline-none transition-all resize-none text-base"
                />
              </div>

              <button
                onClick={submitAnswer}
                disabled={loading || !userAnswer.trim()}
                className="w-full py-5 bg-purple-600 text-white rounded-3xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-purple-100"
              >
                {loading ? <RefreshCw className="animate-spin" /> : '提交回答'}
              </button>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="p-8 bg-black text-white rounded-[40px] text-center space-y-4">
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-6xl font-black">{result.score}</span>
                  <span className="text-xl font-bold opacity-50">/100</span>
                </div>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={20} fill={s <= Math.round(result.score / 20) ? "white" : "none"} />
                  ))}
                </div>
                <p className="text-sm opacity-70">AI 评估得分</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-blue-50 rounded-3xl space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <MessageCircle size={18} />
                    <span>AI 点评</span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">{result.comment}</p>
                </div>
                <div className="p-5 bg-green-50 rounded-3xl space-y-2">
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <Info size={18} />
                    <span>优化建议</span>
                  </div>
                  <p className="text-xs text-green-800 leading-relaxed font-medium">{result.improvement}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400">高情商参考</h3>
                {result.references.map((ref: string, i: number) => (
                  <div key={i} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm leading-relaxed text-gray-600 italic">
                    “{ref}”
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('config')}
                  className="flex-1 py-5 bg-white border border-gray-200 text-gray-900 rounded-3xl font-bold active:scale-95 transition-all"
                >
                  再练一题
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex-1 py-5 bg-purple-600 text-white rounded-3xl font-bold active:scale-95 transition-all"
                >
                  查看反馈图
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
