import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import Sidebar from '../../components/Sidebar'

const Dashboard = () => {
  const { BACKEND, token } = useContext(AuthContext)
  const { toggleTheme, theme, dark } = useContext(ThemeContext)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${BACKEND}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.success) setStats(data.data)
      } catch (err) {
        console.error("Stats fetch failed", err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [BACKEND, token])

  // Adjusted the loop cards to cleanly match your backend's exact data return properties
  const cards = [
    { label: 'Total Quotes Live', val: stats?.totalQuotes ?? 0, color: 'text-blue-500' },
    { label: 'Bypassed Queue',    val: stats?.pendingQuotes ?? 0, color: 'text-gray-400' }, // Shows 0 since instant publishing is on
    { label: 'Total Users Registered', val: stats?.totalUsers ?? 0, color: 'text-green-500' },
  ]

  return (
    <div className={`flex min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />
      <main className="flex-1 p-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className={`text-3xl font-medium ${theme.text}`}>System Overview</h2>
            <p className={`${theme.text2} text-sm mt-1`}>Real-time platform metrics and activity index</p>
          </div>
          <button 
            onClick={toggleTheme} 
            className={`w-10 h-10 rounded-full border ${theme.border} ${theme.text2} flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition`}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Dashboard Grid System */}
        {loading ? (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className={`h-32 ${theme.bg2} rounded-2xl`} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((item) => (
              <div key={item.label} className={`${theme.bgCard} border ${theme.border} p-6 rounded-2xl shadow-sm transition-transform hover:-translate-y-0.5 duration-200`}>
                <p className={`text-xs uppercase tracking-wider ${theme.text3} mb-2 font-semibold`}>
                  {item.label}
                </p>
                <p className={`text-4xl font-bold ${item.color}`}>
                  {item.val.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard