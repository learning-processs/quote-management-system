import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import Sidebar from '../../components/Sidebar'

const Users = () => {
  const { BACKEND, token }           = useContext(AuthContext)
  const { dark, toggleTheme, theme } = useContext(ThemeContext)

  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [role, setRole]       = useState('')
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const [total, setTotal]     = useState(0)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (role)   params.append('role', role)
      if (search) params.append('search', search)
      params.append('page', page)
      params.append('limit', 10)

      const { data } = await axios.get(
        `${BACKEND}/api/admin/users?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setUsers(data.data.users)
        setTotal(data.data.total)
      }
    } catch (err) {
      toast.error('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [role, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const handleBan = async (id, isBanned) => {
    try {
      const { data } = await axios.put(
        `${BACKEND}/api/admin/users/${id}/ban`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(isBanned ? 'User unbanned.' : 'User banned.')
        fetchUsers()
      }
    } catch (err) {
      toast.error('Failed to update user.')
    }
  }

  const handleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!window.confirm(`Change role to ${newRole}?`)) return
    try {
      const { data } = await axios.put(
        `${BACKEND}/api/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(`Role updated to ${newRole}.`)
        fetchUsers()
      }
    } catch (err) {
      toast.error('Failed to update role.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all their quotes permanently?')) return
    try {
      const { data } = await axios.delete(
        `${BACKEND}/api/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('User deleted.')
        fetchUsers()
      }
    } catch (err) {
      toast.error('Failed to delete user.')
    }
  }

  return (
    // Changed to stack into column layout on phone screens cleanly below top bars
    <div className={`flex flex-col md:flex-row min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />

      {/* Responsive layout padding adjustments */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 w-full max-w-full overflow-hidden">

        {/* Header Layout Component */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className={`text-2xl md:text-3xl font-medium ${theme.text}`}>Manage Users</h2>
            <p className={`text-xs md:text-sm ${theme.text2} mt-1`}>{total} registered members</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center border ${theme.border} ${theme.text2} hover:text-blue-500 transition text-lg flex-shrink-0 cursor-pointer`}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Responsive Search + Filter Wrapper row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center w-full">
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className={`${theme.bgInput} border ${theme.borderInput} ${theme.textInput} ${theme.placeholder} rounded-full px-4 py-2 text-sm outline-none ${theme.focusBorder} transition w-full sm:w-64`}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full transition flex-shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Role selector filter block */}
          <div className="flex gap-1.5 flex-wrap">
            {['All', 'user', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r === 'All' ? '' : r); setPage(1) }}
                className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm border transition capitalize cursor-pointer ${
                  (r === 'All' && !role) || r === role
                    ? 'bg-blue-600 text-white border-blue-600'
                    : `${theme.bgCard} ${theme.text2} ${theme.border} hover:border-blue-500 hover:text-blue-500`
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Main Data Table Wrapper Frame */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className={`text-center py-20 ${theme.text2}`}>
            <p>No users found.</p>
          </div>
        ) : (
          /* Locked horizontal safe swipe layer container */
          <div className={`${theme.bgCard} border ${theme.border} rounded-2xl overflow-hidden w-full overflow-x-auto`}>
            <table className="w-full min-w-[700px] md:min-w-full table-auto">
              <thead className={theme.tableHead}>
                <tr>
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className={`text-left px-4 md:px-6 py-3 text-xs font-medium ${theme.text3} uppercase tracking-wider`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className={`border-t ${theme.tableBorder} ${theme.tableRow} transition`}>

                    {/* User identifier block layout */}
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className={`text-sm font-medium ${theme.text} truncate max-w-[120px]`}>{u.name}</span>
                      </div>
                    </td>

                    {/* Email column entry field */}
                    <td className={`px-4 md:px-6 py-4 text-sm ${theme.text2} truncate max-w-[150px]`}>{u.email}</td>

                    {/* Role allocation parameters badge */}
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize ${
                        u.role === 'admin'
                          ? 'bg-blue-500/10 text-blue-500'
                          : `${theme.bgInput} ${theme.text2}`
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Account status ban validation check */}
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full ${
                        u.isBanned
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        {u.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>

                    {/* Account Creation TimeStamp Formatting Layer */}
                    <td className={`px-4 md:px-6 py-4 text-sm ${theme.text2} whitespace-nowrap`}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    {/* Administrative operational control button action layers */}
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRole(u._id, u.role)}
                          className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-3 py-1.5 rounded-full transition cursor-pointer select-none"
                        >
                          {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleBan(u._id, u.isBanned)}
                          className={`text-xs px-3 py-1.5 rounded-full transition cursor-pointer select-none ${
                            u.isBanned
                              ? 'bg-green-500/10 hover:bg-green-500/20 text-green-500'
                              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500'
                          }`}
                        >
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-full transition cursor-pointer select-none"
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Adaptive Pagination Interface section */}
        {total > 10 && (
          <div className="flex justify-center gap-2 mt-8 select-none">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 text-sm border ${theme.border} rounded-full ${theme.text2} hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed`}
            >
              Prev
            </button>
            <span className={`px-4 py-2 text-sm ${theme.text2} flex items-center`}>
              Page {page}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={users.length < 10}
              className={`px-4 py-2 text-sm border ${theme.border} rounded-full ${theme.text2} hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed`}
            >
              Next
            </button>
          </div>
        )}

      </main>
    </div>
  )
}

export default Users