import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import Sidebar from '../../components/Sidebar'

const Users = () => {
  const { BACKEND, token } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${BACKEND}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        const usersArray = Array.isArray(data.data) ? data.data : data.data.users
        setUsers(usersArray || [])
      }
    } catch (err) {
      toast.error("Failed to load user registry")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!window.confirm(`Change user role to ${newRole.toUpperCase()}?`)) return
    
    try {
      const { data } = await axios.put(`${BACKEND}/api/admin/users/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success("Role updated successfully")
        fetchUsers()
      }
    } catch (err) {
      toast.error("Failed to alter user privileges")
    }
  }

  const handleBanUser = async (id, isBanned) => {
    const actionLabel = isBanned ? 'unban' : 'ban'
    if (!window.confirm(`Are you sure you want to ${actionLabel} this user?`)) return

    try {
      const { data } = await axios.put(`${BACKEND}/api/admin/users/${id}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message || `User access status toggled successfully.`)
        fetchUsers()
      }
    } catch (err) {
      toast.error(`Operation failed`)
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm("CRITICAL: Permanent deletion purges this profile and all submitted quotes. Proceed?")) return
    try {
      const { data } = await axios.delete(`${BACKEND}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success("Account permanently deleted")
        setUsers(users.filter(u => u._id !== id))
      }
    } catch (err) {
      toast.error("Account elimination failed")
    }
  }

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 md:p-10 w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-2xl sm:text-3xl font-medium ${theme.text}`}>User Registry Directory</h2>
          <p className={`${theme.text2} text-xs sm:text-sm mt-1`}>
            Manage accounts, toggle administrative access rights, or restrict system permissions live.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center py-10 text-gray-500 text-sm">No registered profiles detected.</p>
        ) : (
          <>
            {/* Desktop Table Layout (Visible on md screens and up) */}
            <div className={`hidden md:block overflow-x-auto border ${theme.border} rounded-2xl ${theme.bgCard} shadow-sm`}>
              <table className="w-full text-left border-collapse">
                <thead className={`${theme.tableHead} ${theme.text} text-xs uppercase tracking-wider`}>
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Account Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`${theme.text2} text-sm divide-y ${theme.tableBorder}`}>
                  {users.map((u) => (
                    <tr key={u._id} className={`${theme.tableRow} transition`}>
                      <td className={`px-6 py-4 font-medium ${theme.text}`}>{u.name}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs uppercase tracking-wider font-semibold ${
                          u.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.isBanned ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                        }`}>
                          {u.isBanned ? '⛔ Banned' : '⚡ Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                        <button 
                          onClick={() => handleRoleChange(u._id, u.role)} 
                          className="text-blue-500 hover:underline text-xs font-medium"
                        >
                          Toggle Role
                        </button>
                        <button 
                          onClick={() => handleBanUser(u._id, u.isBanned)} 
                          className={`${u.isBanned ? 'text-green-500' : 'text-amber-500'} hover:underline text-xs font-medium`}
                        >
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u._id)} 
                          className="text-red-500 hover:underline text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Profile Cards Stack (Visible on mobile/tablet) */}
            <div className="grid grid-cols-1 gap-4 md:hidden w-full">
              {users.map((u) => (
                <div key={u._id} className={`p-5 rounded-2xl border ${theme.border} ${theme.bgCard} space-y-4 shadow-sm break-words`}>
                  {/* User Primary Block */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className={`text-base font-bold ${theme.text}`}>{u.name}</h4>
                      <p className={`text-xs ${theme.text2} opacity-70 truncate max-w-[200px] sm:max-w-xs`}>{u.email}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                        u.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {u.role}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        u.isBanned ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {u.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Actions Block Grid */}
                  <div className={`flex gap-2 pt-3 border-t ${theme.border}`}>
                    <button
                      onClick={() => handleRoleChange(u._id, u.role)}
                      className={`flex-1 text-center border ${theme.border} ${theme.text2} text-xs py-2 rounded-xl font-medium transition`}
                    >
                      🔄 Role
                    </button>
                    <button
                      onClick={() => handleBanUser(u._id, u.isBanned)}
                      className={`flex-1 text-center text-xs py-2 rounded-xl font-medium transition ${
                        u.isBanned 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                          : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                      }`}
                    >
                      {u.isBanned ? '🔓 Unban' : '🚫 Ban'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="flex-1 text-center bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs py-2 rounded-xl font-medium transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Users