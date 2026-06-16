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
        // Matches your nested object response schema data structure safely
        const usersArray = Array.isArray(data.data) ? data.data : data.data.users
        setUsers(usersArray || [])
      }
    } catch (err) {
      toast.error("Failed to load user registry")
      setUsers([])
    } finally {
      // Fixed: Replaced raw detached brackets with structured finally block
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
      // Matches your toggle backend route (no body data reading rules active on your server)
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
    <div className={`flex min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="mb-8">
          <h2 className={`text-3xl font-medium ${theme.text}`}>User Registry Directory</h2>
          <p className={`${theme.text2} text-sm mt-1`}>Manage accounts, toggle administrative access rights, or restrict system permissions live.</p>
        </div>

        <div className={`overflow-x-auto border ${theme.border} rounded-2xl`}>
          <table className="w-full text-left border-collapse">
            <thead className={`${theme.tableHead} ${theme.text} text-xs uppercase`}>
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`${theme.text2} text-sm divide-y ${theme.tableBorder}`}>
              {Array.isArray(users) && users.map((u) => (
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
                  <td className="px-6 py-4 text-right space-x-3">
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
          {!loading && users.length === 0 && (
            <p className="text-center py-10 text-gray-500">No registered profiles detected.</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Users