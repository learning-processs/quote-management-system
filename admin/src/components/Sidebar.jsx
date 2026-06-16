import { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const { admin, logout } = useContext(AuthContext)
  const { dark, toggleTheme, theme } = useContext(ThemeContext)
  const navigate = useNavigate()
  
  // Mobile drawer panel visual flag toggler
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: '⚙️' },
    { path: '/quotes',    label: 'All Quotes', icon: '📚' },
    { path: '/users',     label: 'Users',      icon: '👥' },
  ]

  return (
    <aside className={`w-full md:w-52 flex-shrink-0 border-b md:border-b-0 md:border-r ${theme.border} ${theme.bg} flex flex-col transition-colors duration-300 z-40 sticky md:relative top-0 md:min-h-screen`}>
      
      {/* ── Top Bar Brand Header View ── */}
      <div className={`px-5 py-4 md:py-5 flex items-center justify-between border-b ${theme.border}`}>
        <div>
          <h1 className={`text-sm font-bold tracking-tight ${theme.text}`}>
            life<span className="text-blue-500 font-light">fkd</span>24x7
          </h1>
          <span className="text-[10px] text-blue-500 font-semibold uppercase tracking-widest mt-0.5 block">
            Admin Panel
          </span>
        </div>

        {/* Mobile Navbar Hamburger Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 rounded-xl border ${theme.border} ${theme.text2} md:hidden hover:text-blue-500 transition-all text-xs font-semibold`}
        >
          {mobileMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* ── Responsive Collapsible Panel Drawer ── */}
      <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 divide-y md:divide-y-0 divide-gray-500/10`}>

        {/* Admin profile view block (Hidden on mobile navigation rows for breathing space) */}
        <div className={`px-5 py-5 border-b ${theme.border} hidden md:block animate-in fade-in duration-150`}>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold mb-3 shadow-lg shadow-blue-500/20">
            {admin?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={`text-sm font-medium ${theme.text} truncate`}>{admin?.name}</div>
          <div className="text-[10px] text-blue-500 font-medium mt-0.5 uppercase tracking-wider font-mono">{admin?.role}</div>
        </div>

        {/* Navigation Core Routes Container */}
        <nav className="py-2 md:py-4 flex-1 flex flex-col">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              onClick={() => setMobileMenuOpen(false)} // Clear active overlay on item routing selection
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 md:py-2.5 text-sm transition border-b-2 md:border-b-0 md:border-l-2 ${
                  isActive
                    ? 'text-blue-500 bg-blue-500/5 md:bg-blue-500/10 border-blue-500'
                    : `${theme.text2} ${theme.bgHover} border-transparent`
                }`
              }
            >
              <span className="text-base">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Settings Control Block */}
        <div className={`px-5 py-4 md:py-5 md:border-t ${theme.border} space-y-3 bg-black/5 dark:bg-white/[0.01] md:bg-transparent`}>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 text-sm ${theme.text2} hover:text-blue-500 transition w-full group py-1 sm:py-0`}
          >
            <span className="group-hover:scale-110 transition-transform">{dark ? '☀️' : '🌙'}</span>
            <span className="font-medium">{dark ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 text-sm ${theme.text2} hover:text-red-500 transition w-full group py-1 sm:py-0`}
          >
            <span className="group-hover:scale-110 transition-transform">🚪</span> 
            <span className="font-medium">Sign out</span>
          </button>
        </div>

      </div>

    </aside>
  )
}

export default Sidebar