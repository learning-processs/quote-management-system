import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const Landing = () => {
  const { user } = useContext(AuthContext);
  const { dark, toggleTheme, theme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen ${theme.bg} transition-colors duration-500 font-sans antialiased flex flex-col justify-between relative overflow-hidden`}
    >
      {/* Decorative Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

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
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${theme.border} ${theme.text2} hover:bg-blue-500/5 hover:text-blue-500 transition-all text-sm`}
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

      {/* ── Hero Content / Minimalist Split Screen ── */}
      <main className="max-w-7xl mx-auto px-6 md:px-16 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center flex-1 w-full relative z-10">
        {/* Left Core Message Column */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[11px] font-bold uppercase tracking-widest">
            <span>⚡ The Unfiltered Stream</span>
          </div>

          <h2
            className={`text-5xl sm:text-7xl font-bold ${theme.text} tracking-tight leading-tight`}
          >
            Stop scrolling. <br />
            <span className="italic font-serif font-normal text-blue-500">
              Start feeling.
            </span>
          </h2>

          <p
            className={`text-lg ${theme.text2} max-w-lg leading-relaxed font-light opacity-80`}
          >
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

        {/* Right Interactive Mockup Terminal */}
        <div className="lg:col-span-6 relative w-full max-w-lg mx-auto lg:max-w-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-3xl blur-xl" />

          <div
            className={`border ${theme.border} ${theme.bgCard} rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden group`}
          >
            {/* Top Command Control Header Bar */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-500/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
              </div>
              <span className="text-[10px] font-mono opacity-30 uppercase tracking-widest">
                Live_Core_Feed
              </span>
            </div>

            {/* Simulated Dynamic Code Terminal Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-mono text-blue-500/60">
                  # Active thought payload
                </p>
                <p
                  className={`text-xl sm:text-2xl font-serif italic ${theme.text} leading-relaxed`}
                >
                  "Everything happens twice. Once in your head, and once in
                  reality. Master the first."
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-500/5">
                <span className={`text-xs font-mono opacity-50 ${theme.text2}`}>
                  — Variable_Author
                </span>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 font-mono px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Philosophy
                </span>
              </div>
            </div>

            {/* Subtle floating card background logic texture decoration */}
            <div className="absolute bottom-[-10px] right-4 font-mono text-[80px] text-gray-500/[0.02] font-black select-none pointer-events-none">
              ”
            </div>
          </div>
        </div>
      </main>

      {/* ── Ultra Clean Structural Footer ── */}
      <footer
        className={`border-t ${theme.border} px-6 md:px-16 py-8 bg-black/5 dark:bg-white/[0.01]`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono opacity-50">
          <span className={theme.text2}>
            © 2026 Lifefkd24x7. Built for clean expression.
          </span>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Architecture</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">
              Access Terminals
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
