import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const { admin, logout } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Admin logged out')
    navigate('/login')
  }

  const links = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/quotes',    label: 'Manage Quotes', icon: '📝' },
    { path: '/users',     label: 'User Directory', icon: '👥' },
  ]

  return (
    <aside className={`w-64 flex-shrink-0 border-r ${theme.border} ${theme.bg} flex flex-col min-h-screen transition-colors duration-300`}>
      <div className={`px-6 py-6 border-b ${theme.border}`}>
        <h1 className={`text-sm font-semibold ${theme.text}`}>
          life<span className="text-blue-500">fkd</span>24x7
          <span className="ml-2 text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded uppercase">Admin</span>
        </h1>
      </div>

      <div className={`px-6 py-6 border-b ${theme.border}`}>
        <div className={`text-sm font-medium ${theme.text}`}>{admin?.name}</div>
        <div className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">System Administrator</div>
      </div>

      <nav className="flex-1 py-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition border-l-4 ${
                isActive
                  ? 'text-blue-500 bg-blue-500/10 border-blue-500'
                  : `${theme.text2} ${theme.bgHover} border-transparent`
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className={`px-6 py-6 border-t ${theme.border}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 text-sm ${theme.text2} hover:text-red-500 transition w-full`}
        >
          <span>👋</span> Sign out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar