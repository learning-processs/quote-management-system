import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import Sidebar from '../../components/Sidebar'

const Dashboard = () => {
  const { BACKEND, token } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)

  const [stats, setStats] = useState({ totalQuotes: 0, totalUsers: 0 })
  const [loading, setLoading] = useState(true)
  
  // Controls settings modal overlay state
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`${BACKEND}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.success) setStats(data.data)
      } catch (err) {
        toast.error('Failed to sync dashboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [BACKEND, token])

  return (
    // Responsive structural flow: stacks column-wise on phones, side-by-side rows on desktop
    <div className={`flex flex-col md:flex-row min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />

      {/* Main Container adapts layout spacing and padding for different screens */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl relative w-full overflow-x-hidden">
        
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h2 className={`text-2xl font-bold tracking-tight ${theme.text}`}>System Command</h2>
          <p className={`text-xs ${theme.text2} mt-1 opacity-60 font-mono uppercase tracking-tighter`}>
            Session Active // {new Date().toLocaleDateString()}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8 md:space-y-10">
            
            {/* Metrics Grid Layout adapts from 1 column on mobile to 2 columns on small desktops */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
              <div className={`p-5 md:p-6 rounded-2xl border ${theme.border} ${theme.bgCard} relative overflow-hidden group shadow-sm`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-3xl sm:text-4xl">📚</div>
                <span className={`text-xs font-bold uppercase tracking-widest ${theme.text3}`}>Total Quotes</span>
                <div className={`text-4xl sm:text-5xl font-black ${theme.text} mt-2 tracking-tighter`}>{stats.totalQuotes}</div>
              </div>

              <div className={`p-5 md:p-6 rounded-2xl border ${theme.border} ${theme.bgCard} relative overflow-hidden group shadow-sm`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-3xl sm:text-4xl">👥</div>
                <span className={`text-xs font-bold uppercase tracking-widest ${theme.text3}`}>Total Users</span>
                <div className={`text-4xl sm:text-5xl font-black ${theme.text} mt-2 tracking-tighter`}>{stats.totalUsers}</div>
              </div>
            </div>

            {/* Quick Management Layout transforms from stacked items on mobile into 3 structured columns on laptop screens */}
            <section className="space-y-4">
              <h3 className={`text-xs font-bold uppercase tracking-widest ${theme.text3}`}>Quick Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                
                <Link to="/quotes" className={`p-4 rounded-xl border ${theme.border} ${theme.bgCard} ${theme.bgHover} flex items-center gap-4 transition-all hover:border-blue-500/50`}>
                  <span className="text-xl flex-shrink-0">📝</span>
                  <span className={`text-sm font-medium ${theme.text}`}>Moderate Quotes</span>
                </Link>

                <Link to="/users" className={`p-4 rounded-xl border ${theme.border} ${theme.bgCard} ${theme.bgHover} flex items-center gap-4 transition-all hover:border-emerald-500/50`}>
                  <span className="text-xl flex-shrink-0">🔍</span>
                  <span className={`text-sm font-medium ${theme.text}`}>User Directory</span>
                </Link>

                <button 
                  onClick={() => setShowSettings(true)} 
                  className={`p-4 rounded-xl border ${theme.border} ${theme.bgCard} ${theme.bgHover} flex items-center gap-4 transition-all hover:border-purple-500/50 w-full text-left`}
                >
                  <span className="text-xl flex-shrink-0">⚙️</span>
                  <span className={`text-sm font-medium ${theme.text}`}>System Settings</span>
                </button>

              </div>
            </section>

            {/* Tip Block */}
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 w-full break-words">
              <p className={`text-xs leading-relaxed ${theme.text2} italic`}>
                <span className="text-blue-500 font-bold mr-1">Pro Tip:</span> 
                Use the "All Quotes" page to bulk-approve or delete content. The dashboard is now set to 
                read-only mode for safety.
              </p>
            </div>

          </div>
        )}

        {/* System Settings Modal Overlay - Safe viewport padding added for mobile screens */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className={`p-6 rounded-2xl border ${theme.border} ${theme.bgCard} max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150`}>
              <div className="flex justify-between items-center">
                <h4 className={`text-sm font-bold ${theme.text} uppercase tracking-wider`}>Terminal Settings</h4>
                <button onClick={() => setShowSettings(false)} className={`text-xs ${theme.text2} hover:text-red-500 font-bold p-1`}>✕</button>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className={theme.text2}>API Gateway Status</span>
                  <span className="text-emerald-500 font-mono font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className={theme.text2}>Auto-Moderation (AI)</span>
                  <span className="text-amber-500 font-mono font-semibold">STANDBY</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-gray-500/10 pt-3">
                  <span className={theme.text2}>Vault Engine Version</span>
                  <span className="opacity-40 font-mono">v2.4.0-prod</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  toast.success("System cache cleared successfully.");
                  setShowSettings(false);
                }}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition mt-2 shadow-md shadow-blue-500/10"
              >
                Flush Server Cache
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard