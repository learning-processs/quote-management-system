import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import Sidebar from '../../components/Sidebar'

const Dashboard = () => {
  const { BACKEND, token }           = useContext(AuthContext)
  const { dark, toggleTheme, theme } = useContext(ThemeContext)

  const [stats, setStats]       = useState({ totalQuotes: 0, totalUsers: 0 })
  const [recentQuotes, setRecentQuotes] = useState([])
  const [recentUsers, setRecentUsers]   = useState([])
  const [loading, setLoading]   = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, quotesRes, usersRes] = await Promise.all([
        axios.get(`${BACKEND}/api/admin/stats`,
          { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BACKEND}/api/admin/quotes?limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BACKEND}/api/admin/users?limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (statsRes.data.success)  setStats(statsRes.data.data)
      if (quotesRes.data.success) setRecentQuotes(quotesRes.data.data.quotes)
      if (usersRes.data.success)  setRecentUsers(usersRes.data.data.users)
    } catch (err) {
      toast.error('Failed to load dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDeleteQuote = async (id) => {
    if (!window.confirm('Delete this quote?')) return
    try {
      const { data } = await axios.delete(
        `${BACKEND}/api/admin/quotes/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Quote deleted.')
        setRecentQuotes(recentQuotes.filter(q => q._id !== id))
        setStats(s => ({ ...s, totalQuotes: s.totalQuotes - 1 }))
      }
    } catch (err) {
      toast.error('Failed to delete.')
    }
  }

  const handleBanUser = async (id, isBanned) => {
    try {
      const { data } = await axios.put(
        `${BACKEND}/api/admin/users/${id}/ban`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(isBanned ? 'User unbanned.' : 'User banned.')
        fetchData()
      }
    } catch (err) {
      toast.error('Failed to update user.')
    }
  }

  return (
    // Changed to flex-col on mobile so layout stacks cleanly under the responsive top bar
    <div className={`flex flex-col md:flex-row min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />

      {/* Optimized responsive padding rules */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 w-full max-w-full overflow-hidden">

        {/* Header Layout */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className={`text-2xl md:text-3xl font-medium ${theme.text}`}>Dashboard</h2>
            <p className={`text-xs md:text-sm ${theme.text2} mt-1`}>Overview of Lifefkd24x7</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center border ${theme.border} ${theme.text2} hover:text-blue-500 transition text-lg cursor-pointer flex-shrink-0`}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Cards - Formats to 2 columns on larger breakpoints natively */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-10">
              {[
                { label: 'Total Quotes', value: stats.totalQuotes, sub: 'All time',           icon: '📚' },
                { label: 'Total Users',  value: stats.totalUsers,  sub: 'Registered members', icon: '👥' },
              ].map((s) => (
                <div key={s.label} className={`${theme.bgCard} border ${theme.border} rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6`}>
                  <div className="text-3xl md:text-4xl flex-shrink-0">{s.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-[10px] md:text-xs font-medium ${theme.text3} uppercase tracking-widest mb-1 truncate`}>
                      {s.label}
                    </div>
                    <div className={`text-2xl md:text-4xl font-medium ${theme.text}`}>
                      {s.value}
                    </div>
                    <div className="text-[10px] md:text-xs text-green-500 mt-1 truncate">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Quotes Block Container */}
            <div className={`${theme.bgCard} border ${theme.border} rounded-2xl overflow-hidden mb-6 md:mb-8`}>
              <div className={`flex items-center justify-between px-4 md:px-6 py-4 border-b ${theme.border}`}>
                <h3 className={`text-sm font-semibold ${theme.text}`}>Recent Quotes</h3>
                <Link to="/quotes" className="text-xs text-blue-500 hover:underline">
                  View all
                </Link>
              </div>

              {recentQuotes.length === 0 ? (
                <div className={`text-center py-10 ${theme.text2} text-sm`}>No quotes yet.</div>
              ) : (
                /* Wrapped tables with overflow horizontal safe-scrolling view layer */
                <div className="w-full overflow-x-auto JSON-table-scroll">
                  <table className="w-full min-w-[600px] md:min-w-full table-auto">
                    <thead className={theme.tableHead}>
                      <tr>
                        {['Quote', 'Author', 'Submitted By', 'Category', 'Action'].map(h => (
                          <th key={h} className={`text-left px-4 md:px-6 py-3 text-xs font-medium ${theme.text3} uppercase tracking-wider`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentQuotes.map((q) => (
                        <tr key={q._id} className={`border-t ${theme.tableBorder} ${theme.tableRow} transition`}>
                          <td className={`px-4 md:px-6 py-4 text-sm ${theme.text2} max-w-[200px] md:max-w-xs truncate`}>
                            "{q.text}"
                          </td>
                          <td className={`px-4 md:px-6 py-4 text-sm ${theme.text} truncate`}>{q.author}</td>
                          <td className={`px-4 md:px-6 py-4 text-sm ${theme.text2} truncate`}>{q.submittedBy?.name}</td>
                          <td className="px-4 md:px-6 py-4 white-space-nowrap">
                            <span className="text-[11px] md:text-xs bg-blue-500/10 text-blue-500 px-2.5 py-0.5 rounded-full inline-block">
                              {q.category}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 white-space-nowrap">
                            <button
                              onClick={() => handleDeleteQuote(q._id)}
                              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-full transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Users Block Container */}
            <div className={`${theme.bgCard} border ${theme.border} rounded-2xl overflow-hidden`}>
              <div className={`flex items-center justify-between px-4 md:px-6 py-4 border-b ${theme.border}`}>
                <h3 className={`text-sm font-semibold ${theme.text}`}>Recent Users</h3>
                <Link to="/users" className="text-xs text-blue-500 hover:underline">
                  View all
                </Link>
              </div>

              {recentUsers.length === 0 ? (
                <div className={`text-center py-10 ${theme.text2} text-sm`}>No users yet.</div>
              ) : (
                /* Wrapped tables with overflow horizontal safe-scrolling view layer */
                <div className="w-full overflow-x-auto JSON-table-scroll">
                  <table className="w-full min-w-[600px] md:min-w-full table-auto">
                    <thead className={theme.tableHead}>
                      <tr>
                        {['User', 'Email', 'Role', 'Status', 'Action'].map(h => (
                          <th key={h} className={`text-left px-4 md:px-6 py-3 text-xs font-medium ${theme.text3} uppercase tracking-wider`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((u) => (
                        <tr key={u._id} className={`border-t ${theme.tableBorder} ${theme.tableRow} transition`}>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className={`text-sm ${theme.text} truncate`}>{u.name}</span>
                            </div>
                          </td>
                          <td className={`px-4 md:px-6 py-4 text-sm ${theme.text2} truncate`}>{u.email}</td>
                          <td className="px-4 md:px-6 py-4 white-space-nowrap">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-blue-500/10 text-blue-500' : `${theme.bgInput} ${theme.text2}`}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 white-space-nowrap">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full ${u.isBanned ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                              {u.isBanned ? 'Banned' : 'Active'}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 white-space-nowrap">
                            <button
                              onClick={() => handleBanUser(u._id, u.isBanned)}
                              className={`text-xs px-3 py-1.5 rounded-full transition cursor-pointer ${u.isBanned ? 'bg-green-500/10 hover:bg-green-500/20 text-green-500' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500'}`}
                            >
                              {u.isBanned ? 'Unban' : 'Ban'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  )
}

export default Dashboard