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

  const [stats, setStats]     = useState({ totalQuotes: 0, pendingQuotes: 0, totalUsers: 0 })
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, pendingRes] = await Promise.all([
        axios.get(`${BACKEND}/api/admin/stats`,
          { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BACKEND}/api/admin/quotes?status=pending&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (statsRes.data.success)   setStats(statsRes.data.data)
      if (pendingRes.data.success) setPending(pendingRes.data.data.quotes)
    } catch (err) {
      toast.error('Failed to load dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleApprove = async (id) => {
    try {
      const { data } = await axios.put(
        `${BACKEND}/api/admin/quotes/${id}/approve`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Quote approved!')
        setPending(pending.filter(q => q._id !== id))
        setStats(s => ({ ...s, pendingQuotes: s.pendingQuotes - 1 }))
      }
    } catch (err) {
      toast.error('Failed to approve.')
    }
  }

  const handleReject = async (id) => {
    try {
      const { data } = await axios.put(
        `${BACKEND}/api/admin/quotes/${id}/reject`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Quote rejected.')
        setPending(pending.filter(q => q._id !== id))
        setStats(s => ({ ...s, pendingQuotes: s.pendingQuotes - 1 }))
      }
    } catch (err) {
      toast.error('Failed to reject.')
    }
  }

  return (
    <div className={`flex min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />

      <main className="flex-1 p-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-medium ${theme.text}`}>Dashboard</h2>
            <p className={`text-sm ${theme.text2} mt-1`}>Overview of Lifefkd24x7</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center border ${theme.border} ${theme.text2} hover:text-blue-500 transition text-lg`}
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                { label: 'Total Quotes',   value: stats.totalQuotes,   sub: 'All time',           warn: false },
                { label: 'Pending Review', value: stats.pendingQuotes, sub: 'Needs attention',    warn: true  },
                { label: 'Total Users',    value: stats.totalUsers,    sub: 'Registered members', warn: false },
              ].map((s) => (
                <div key={s.label} className={`${theme.bgCard} border ${theme.border} rounded-2xl p-6`}>
                  <div className={`text-xs font-medium ${theme.text3} uppercase tracking-widest mb-2`}>
                    {s.label}
                  </div>
                  <div className={`text-4xl font-medium ${theme.text} mb-1`}>
                    {s.value}
                  </div>
                  <div className={`text-xs ${s.warn ? 'text-amber-500' : 'text-green-500'}`}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Quotes Table */}
            <div className={`${theme.bgCard} border ${theme.border} rounded-2xl overflow-hidden`}>
              <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.border}`}>
                <h3 className={`text-sm font-semibold ${theme.text}`}>Pending Approval</h3>
                <Link to="/quotes" className="text-xs text-blue-500 hover:underline">
                  View all
                </Link>
              </div>

              {pending.length === 0 ? (
                <div className={`text-center py-12 ${theme.text2}`}>
                  <p className="text-sm">No pending quotes</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className={theme.tableHead}>
                    <tr>
                      {['Quote', 'Author', 'Submitted By', 'Category', 'Action'].map(h => (
                        <th key={h} className={`text-left px-6 py-3 text-xs font-medium ${theme.text3} uppercase tracking-wider`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map((q) => (
                      <tr key={q._id} className={`border-t ${theme.tableBorder} ${theme.tableRow} transition`}>
                        <td className={`px-6 py-4 text-sm ${theme.text2} max-w-xs truncate`}>
                          "{q.text}"
                        </td>
                        <td className={`px-6 py-4 text-sm ${theme.text}`}>{q.author}</td>
                        <td className={`px-6 py-4 text-sm ${theme.text2}`}>{q.submittedBy?.name}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full">
                            {q.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(q._id)}
                              className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-500 px-3 py-1.5 rounded-full transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(q._id)}
                              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-full transition"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  )
}

export default Dashboard