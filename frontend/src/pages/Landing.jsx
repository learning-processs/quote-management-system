import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const Landing = () => {
  const { user, BACKEND } = useContext(AuthContext);
  const { dark, toggleTheme, theme } = useContext(ThemeContext);

  const [publicQuotes, setPublicQuotes] = useState([]);
  const [fetchingQuotes, setFetchingQuotes] = useState(true);

  useEffect(() => {
    const fetchPublicStream = async () => {
      try {
        const { data } = await axios.get(`${BACKEND}/api/quotes?limit=6`);
        if (data.success) {
          setPublicQuotes(data.data.quotes || []);
        }
      } catch (err) {
        console.log("Error loading public feed stream.");
      } finally {
        setFetchingQuotes(false);
      }
    };
    fetchPublicStream();
  }, [BACKEND]);

  return (
    <div
      className={`min-h-screen ${theme.bg} transition-colors duration-500 font-sans antialiased flex flex-col relative overflow-hidden`}
    >
      {/* 🔮 Moody Ambient Glows - Adjusted color saturation dynamically based on mode */}
      <div className={`absolute top-[-10%] left-[-20%] w-[800px] h-[800px] ${dark ? 'bg-blue-600/10' : 'bg-blue-500/[0.04]'} rounded-full blur-[150px] pointer-events-none animate-pulse`} />
      <div className={`absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] ${dark ? 'bg-purple-600/10' : 'bg-purple-500/[0.04]'} rounded-full blur-[130px] pointer-events-none`} />

      {/* ── Navbar ── */}
      <nav
        className={`${theme.navBg} backdrop-blur-md border-b ${theme.border} px-6 md:px-16 h-16 flex items-center justify-between sticky top-0 z-50`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h1 className={`text-base font-bold tracking-tight ${theme.text}`}>
            life<span className="text-blue-500 font-light">fkd</span>24x7
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${theme.border} ${theme.text2} hover:bg-blue-500/5 hover:text-blue-500 transition-all text-sm cursor-pointer`}
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <Link
              to="/dashboard"
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              Dashboard ({user.name}) →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-xs font-medium ${theme.text2} hover:text-blue-500 transition px-2`}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/10"
              >
                Join Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── SECTION 1: Hero Segment ── */}
      <main className="max-w-7xl mx-auto px-6 md:px-16 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full relative z-10 flex-shrink-0">
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[11px] font-bold uppercase tracking-widest">
            <span>⚡ The Unfiltered Stream</span>
          </div>

          <h2 className={`text-5xl sm:text-7xl font-bold ${theme.text} tracking-tight leading-tight`}>
            Stop scrolling. <br />
            <span className="italic font-serif font-normal text-blue-500">
              Start feeling.
            </span>
          </h2>

          <p className={`text-lg ${theme.text2} max-w-lg leading-relaxed font-light opacity-80`}>
            The world is loud enough. Here, we keep it real. No filters, no
            algorithms, just the raw thoughts that keep you up at night. Add
            your voice to the vault.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-500/10 text-center"
              >
                Open Your Vault
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-500/10 text-center"
                >
                  Drop Your First Quote
                </Link>
                <Link
                  to="/login"
                  className={`border ${theme.border} ${theme.text2} hover:border-blue-500/30 text-sm font-semibold px-8 py-4 rounded-xl transition-all text-center`}
                >
                  Browse Ecosystem
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 relative w-full max-w-lg mx-auto lg:max-w-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-3xl blur-xl" />
          <div className={`border ${theme.border} ${theme.bgCard} rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden group`}>
            <div className="flex justify-between items-center mb-8 border-b border-gray-500/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
              </div>
              <span className="text-[10px] font-mono opacity-30 uppercase tracking-widest">Live_Core_Feed</span>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-mono text-blue-500/60"># Active thought payload</p>
                <p className={`text-xl sm:text-2xl font-serif italic ${theme.text} leading-relaxed`}>
                  "Everything happens twice. Once in your head, and once in reality. Master the first."
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-500/5">
                <span className={`text-xs font-mono opacity-50 ${theme.text2}`}>— Lifefkd24x7</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 font-mono px-2.5 py-0.5 rounded-md uppercase tracking-wider">Philosophy</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── 🌌 SECTION 2: Fully Adaptive Multi-Theme Thoughts Gallery ── */}
      <section className={`w-full py-24 px-6 md:px-16 relative z-20 border-t ${theme.border} ${dark ? 'bg-gradient-to-b from-transparent to-black/50' : 'bg-gray-50/50'}`}>
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-3 border border-blue-500/20 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>The Midnight Mind</span> 
            </div>
            <h3 className={`text-3xl md:text-5xl font-bold tracking-tight ${theme.text}`}>
              The <span className="font-serif italic font-normal text-blue-500">3AM Thoughts</span> Gallery
            </h3>
            <p className={`text-xs md:text-sm ${theme.text2} mt-2 max-w-md mx-auto opacity-80`}>
              Where raw notes and real, unfiltered entries live when the rest of the world is asleep.
            </p>
          </div>

          {fetchingQuotes ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : publicQuotes.length === 0 ? (
            <div className={`text-center py-16 ${theme.text2} text-sm font-serif italic opacity-40 border border-dashed ${theme.border} rounded-3xl`}>
              The gallery is currently completely quiet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicQuotes.map((q) => (
                <div 
                  key={q._id} 
                  /* FIX CHANGES:
                    1. Replaced hardcoded 'bg-gray-950/30' with global context layout 'theme.bgCard'
                    2. Replaced hardcoded 'border-gray-700' with your global variable context theme 'theme.border'
                    3. Applied subtle dynamic ambient shadow variables based on active dark setting
                  */
                  className={`${theme.bgCard} ${theme.border} border hover:border-blue-500/60 rounded-2xl p-6 md:p-8 transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1 backdrop-blur-md ${dark ? 'shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'shadow-[0_4px_20px_rgba(0,0,0,0.04)]'}`}
                >
                  <div className="mb-4 opacity-30 group-hover:opacity-50 transition-opacity">
                    <span className="text-3xl font-serif text-blue-500 font-bold">“</span>
                  </div>

                  {/* FIX: Replaced hardcoded 'text-white' with 'theme.text' so it switches to crisp dark charcoal in Light Mode */}
                  <p className={`text-base md:text-lg font-serif italic ${theme.text} leading-relaxed tracking-wide mb-8`}>
                    {q.text}
                  </p>
                  
                  {/* FIX: Using universal 'theme.border' rules for the bottom horizontal alignment separator */}
                  <div className={`flex items-center justify-between pt-4 border-t ${theme.border} mt-auto`}>
                    {/* FIX: Replaced hardcoded 'text-gray-300' with layout variable helper component 'theme.text2' */}
                    <span className={`text-xs font-medium ${theme.text2} truncate max-w-[150px]`}>
                      — {q.author || "Someone"}
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 font-mono px-2.5 py-0.5 rounded-md uppercase tracking-wider font-semibold">
                      {q.category || "Thoughts"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={`border-t ${theme.border} px-6 md:px-16 py-8 ${dark ? 'bg-black/40' : 'bg-gray-50'} mt-auto`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono opacity-50">
          <span className={theme.text2}>
            © 2026 Lifefkd24x7. Built for clean expression.
          </span>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Architecture</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Access Terminals</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;