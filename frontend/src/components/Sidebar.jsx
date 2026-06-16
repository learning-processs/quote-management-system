import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const { user, logout }             = useContext(AuthContext)
  const { theme }                    = useContext(ThemeContext)
  const navigate                     = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const links = [
    { path: '/dashboard',  label: 'Browse Quotes', icon: '📋' },
    { path: '/add-quote',  label: 'Add Quote',     icon: '➕' },
    { path: '/my-quotes',  label: 'My Quotes',     icon: '📝' },
  ]

  return (
    <aside className={`w-52 flex-shrink-0 border-r ${theme.border} ${theme.bg} flex flex-col min-h-screen transition-colors duration-300`}>

      {/* Logo */}
      <div className={`px-5 py-5 border-b ${theme.border}`}>
        <h1 className={`text-sm font-semibold ${theme.text}`}>
          life<span className="text-blue-500">fkd</span>24x7
        </h1>
      </div>

      {/* User info */}
      <div className={`px-5 py-5 border-b ${theme.border}`}>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold mb-3">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className={`text-sm font-medium ${theme.text}`}>{user?.name}</div>
        <div className="text-xs text-blue-500 font-medium mt-0.5">{user?.role}</div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition border-l-2 ${
                isActive
                  ? 'text-blue-500 bg-blue-500/10 border-blue-500'
                  : `${theme.text2} ${theme.bgHover} border-transparent`
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className={`px-5 py-5 border-t ${theme.border}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 text-sm ${theme.text2} hover:text-red-500 transition w-full`}
        >
          <span>🚪</span> Sign out
        </button>
      </div>

    </aside>
  )
}

export default Sidebar