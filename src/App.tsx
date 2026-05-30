import React, { useState, useEffect } from 'react';
import { Search, Loader2, Info, MapPin, FileText, Clock, CreditCard, ChevronRight, Gavel, Home, User, Landmark, Leaf, Users, Download, Phone, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PROCEDURES, askGeminiProcedure, type Procedure } from './services/procedureService.ts';
import PWAUpdater from './components/PWAUpdater.tsx';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Procedure | string | null>(null);
  const [procedureList, setProcedureList] = useState<Procedure[]>([]);
  const [stats, setStats] = useState({ installed: 1245, online: 32 });

  useEffect(() => {
    // Initial fetch of common procedures
    setProcedureList(MOCK_PROCEDURES);
    
    // Support screen=search deep link
    const params = new URLSearchParams(window.location.search);
    if (params.get('screen') === 'search') {
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.focus();
    }

    // Simulate online users changes
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        online: Math.max(12, prev.online + Math.floor(Math.random() * 7) - 3)
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await askGeminiProcedure(finalQuery);
      setResult(res);
      
      // Scroll to result on small screens
      setTimeout(() => {
        const resultEl = document.getElementById('result-area');
        if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      setResult("Có lỗi hệ thống. Bà con vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const selectProcedure = (proc: Procedure) => {
    setQuery(proc.name);
    setResult(proc);
    setTimeout(() => {
        const resultEl = document.getElementById('result-area');
        if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-red-pride to-brand-red-deep text-white font-sans selection:bg-brand-yellow selection:text-brand-red-pride">
      {/* Header */}
      <header className="pt-8 pb-6 px-4 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center mb-6"
        >
          <div className="flex flex-col items-center gap-4 bg-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Premium National Round Seal Emblem */}
              <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0" id="modern-app-logo">
                <defs>
                   {/* Drop shadow for the outer app icon container */}
                   <filter id="appIconGlow" x="-15%" y="-15%" width="130%" height="130%">
                     <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.35" />
                   </filter>
                   
                   {/* State Red #EE2830 Vivid Crimson style */}
                   <linearGradient id="redGovernmentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="#EE2830" />
                     <stop offset="100%" stopColor="#BD1017" />
                   </linearGradient>
                </defs>

                {/* Symmetrical App Icon Base - Perfect Circular Emblem */}
                <circle cx="100" cy="100" r="88" fill="url(#redGovernmentGrad)" filter="url(#appIconGlow)" stroke="rgba(255,255,255,0.22)" strokeWidth="3" />

                {/* Inside subtle border highlight */}
                <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
              </svg>

              {/* Centered logo image replacing the star with perfect scaling and shadow */}
              <img 
                src="/logo-dichvucong.png" 
                alt="Logo dịch vụ công xã Bát Xát" 
                referrerPolicy="no-referrer"
                className="absolute w-[62%] h-[62%] object-contain select-none pointer-events-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]"
              />
            </div>
            <div className="text-center border-t border-white/10 pt-5 w-full">
              <h1 className="text-lg md:text-xl font-black leading-tight tracking-tight uppercase mb-0.5" id="app-title">
                TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG
              </h1>
              <div className="text-brand-yellow font-black text-2xl tracking-[0.25em] h-7 flex items-center justify-center uppercase">XÃ BÁT XÁT</div>
            </div>
          </div>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5 text-xs font-bold shadow-sm">
             <Download className="w-3 h-3 text-brand-yellow" />
             <span>{stats.installed.toLocaleString()} lượt tải về</span>
          </div>
          <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full backdrop-blur-sm border border-green-500/30 text-xs font-bold shadow-sm">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
             <span>{stats.online} người đang online</span>
          </div>
        </div>

        <div className="flex justify-center w-full px-4">
          <p className="inline-block text-[15px] md:text-lg px-8 py-3 bg-gradient-to-r from-brand-yellow/5 via-brand-yellow/20 to-brand-yellow/5 border border-brand-yellow/40 text-brand-yellow font-black tracking-widest text-center rounded-2xl shadow-[0_4px_25px_rgba(255,201,60,0.15)] backdrop-blur-md uppercase">
            Dân biết - Dân dùng - Dân hài lòng
          </p>
        </div>

        {/* Hotline hỗ trợ bà con di chuyển lên đầu trang */}
        <div className="mt-5 flex justify-center">
          <a href="tel:0987295067" className="inline-flex items-center gap-3.5 bg-brand-yellow text-brand-red-pride px-6 py-3 rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform active:scale-95 group border-2 border-white/10">
            <div className="bg-brand-red-pride p-2.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg">
              <Phone className="w-5 h-5 text-white fill-current" />
            </div>
            <div className="text-left leading-none">
              <span className="text-[9px] uppercase block opacity-70 mb-1 font-bold tracking-widest">Hotline hỗ trợ bà con</span>
              <span className="text-xl font-black">0987295067</span>
            </div>
          </a>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pb-24">
        {/* Search Bar */}
        <section className="mt-8">
          <form onSubmit={handleSearch} className="relative group" id="search-form">
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bà con cần hỏi thủ tục gì? Ví dụ: khai sinh, đất đai..."
              className="w-full bg-white text-gray-900 rounded-2xl py-5 pl-6 pr-16 shadow-2xl focus:outline-none focus:ring-4 focus:ring-brand-yellow/50 placeholder:text-gray-400 text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 bg-brand-yellow hover:bg-[#FFE605] text-brand-red-pride px-6 rounded-xl font-bold flex items-center justify-center transition-all active:scale-95 disabled:opacity-70 shadow-md"
              id="search-button"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Tra cứu</span>
                </span>
              )}
            </button>
          </form>
        </section>

        {/* Quick Links */}
        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-widest font-bold opacity-70 mb-4 ml-1 flex items-center gap-2">
            <Info className="w-4 h-4" /> Gợi ý nhanh cho bà con
          </h2>
          <div className="grid grid-cols-2 gap-3" id="quick-links-container">
            {procedureList.map((proc) => (
              <button
                key={proc.id}
                onClick={() => selectProcedure(proc)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-left p-4 rounded-xl flex items-start gap-3 transition-all hover:translate-y-[-2px] group"
                id={`quick-link-${proc.id}`}
              >
                <div className="bg-brand-yellow/20 p-2 rounded-lg group-hover:bg-brand-yellow transition-colors">
                  {proc.category === 'civil' ? (
                    <User className="w-5 h-5 text-brand-yellow group-hover:text-brand-red-pride" />
                  ) : proc.category === 'land' ? (
                    <Home className="w-5 h-5 text-brand-yellow group-hover:text-brand-red-pride" />
                  ) : proc.category === 'agriculture' ? (
                    <Leaf className="w-5 h-5 text-brand-yellow group-hover:text-brand-red-pride" />
                  ) : (
                    <Heart className="w-5 h-5 text-brand-yellow group-hover:text-brand-red-pride" />
                  )}
                </div>
                <span className="text-sm font-semibold leading-snug">{proc.name}</span>
              </button>
            ))}
            
            <button
              onClick={() => handleSearch(undefined, "Hòa giải tranh chấp đất đai")}
              className="bg-white/5 border border-white/5 text-left p-4 rounded-xl flex items-center justify-between transition-all hover:bg-white/10"
              id="more-options-btn"
            >
              <span className="text-sm font-medium opacity-80 italic">Thủ tục khác...</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </section>

        {/* Results Area */}
        <section id="result-area" className="mt-12 min-h-[300px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="relative">
                   <Loader2 className="w-16 h-16 text-brand-yellow animate-spin" />
                   <img 
                     src="/logo-dichvucong.png" 
                     alt="Logo" 
                     referrerPolicy="no-referrer"
                     className="w-7 h-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain opacity-70 select-none pointer-events-none" 
                   />
                </div>
                <p className="mt-4 text-center font-medium">Hệ thống đang tra cứu cho bà con...</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white text-gray-900 rounded-3xl overflow-hidden shadow-2xl border-t-8 border-brand-yellow"
                id="result-card"
              >
                {typeof result === 'string' ? (
                  <div className="p-8">
                    <div className="flex gap-4 mb-4">
                        <Landmark className="w-8 h-8 text-brand-red-pride flex-shrink-0" />
                        <h3 className="text-xl font-bold text-brand-red-pride">Thông tin hướng dẫn</h3>
                    </div>
                    <div className="prose prose-sm leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">
                      {result}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h3 className="text-2xl font-extrabold text-brand-red-pride flex items-center gap-3">
                        <Landmark className="w-8 h-8" />
                        {result.name}
                      </h3>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        result.category === 'civil' ? 'bg-blue-100 text-blue-800' : 
                        result.category === 'land' ? 'bg-green-100 text-green-800' :
                        result.category === 'agriculture' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {result.category === 'civil' ? 'Hộ tịch - Chứng thực' : 
                         result.category === 'land' ? 'Đất đai - Xây dựng' :
                         result.category === 'agriculture' ? 'Nông nghiệp' :
                         'Chính sách xã hội'}
                      </span>
                    </div>

                    <div className="space-y-6">
                      <DetailItem icon={<User />} label="Ai nên làm thủ tục này?" value={result.targetAudience} />
                      <DetailItem icon={<MapPin />} label="Nơi liên hệ/Nộp hồ sơ" value={result.location} />
                      
                      <div>
                        <div className="flex items-center gap-2 mb-3 text-brand-red-pride font-bold uppercase text-xs tracking-widest">
                          <FileText className="w-4 h-4" /> Hồ sơ cần chuẩn bị
                        </div>
                        <ul className="grid gap-2" id="docs-list">
                          {result.documents.map((doc, i) => (
                            <li key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg text-sm font-medium border-l-4 border-gray-200">
                                <span className="w-5 h-5 rounded-full bg-brand-red-pride text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">{i+1}</span>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem icon={<Clock />} label="Thời hạn giải quyết" value={result.duration} />
                        <DetailItem icon={<CreditCard />} label="Phí, lệ phí" value={result.fee} />
                      </div>

                      <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-brand-red-deep font-bold text-sm">
                          <Gavel className="w-4 h-4" /> Các bước thực hiện
                        </div>
                        <div className="space-y-3" id="steps-list">
                          {result.steps.map((step, i) => (
                            <div key={i} className="flex gap-3 text-sm">
                              <div className="w-1 h-auto bg-brand-red-pride rounded-full opacity-30 mt-1" />
                              <span className="font-medium text-gray-700">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-red-50 p-4 rounded-xl border border-red-100 italic text-sm text-red-900 leading-relaxed">
                        <span className="font-bold block not-italic mb-1 uppercase text-xs text-red-600 tracking-wider">Lưu ý cho bà con:</span>
                        {result.notes}
                      </div>

                      {result.reference && (
                        <div className="text-[10px] text-gray-400 mt-4 text-right">
                           Nguồn: {result.reference}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
                <motion.div 
                   key="empty"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 0.6 }}
                   className="flex flex-col items-center justify-center py-12 text-center"
                >
                   <Landmark className="w-20 h-20 mb-4 opacity-20" />
                   <p className="text-lg italic px-10">Bà con hãy nhập câu hỏi ở trên hoặc chọn các gợi ý nhanh để bắt đầu tra cứu.</p>
                </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Global Warning */}
        <section className="mt-12 bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/10" id="global-warning">
          <p className="text-xs sm:text-sm text-center leading-relaxed">
            <span className="font-bold text-brand-yellow block mb-1">CẢNH BÁO / LƯU Ý:</span>
            Thông tin mang tính hướng dẫn. Bà con vui lòng kiểm tra lại tại Bộ phận Một cửa xã Bát Xát hoặc Cổng Dịch vụ công Quốc gia trước khi nộp hồ sơ.
          </p>
        </section>


      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 px-4 text-center text-sm opacity-80" id="app-footer">
        <p className="font-bold text-lg mb-1">UBND xã Bát Xát</p>
        <p className="mb-4">Trung tâm Dịch vụ tổng hợp xã Bát Xát hỗ trợ kỹ thuật ứng dụng</p>
        <div className="flex justify-center mb-6">
             <div className="w-12 h-1 bg-brand-yellow rounded-full opacity-50" />
        </div>
        <p className="italic">Phục vụ người dân tra cứu thủ tục hành chính nhanh chóng, thuận tiện</p>
      </footer>
      <PWAUpdater />
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-100 text-brand-red-pride flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-red-pride opacity-80 mb-0.5">{label}</div>
        <div className="text-sm font-semibold text-gray-800 leading-tight">{value}</div>
      </div>
    </div>
  );
}
