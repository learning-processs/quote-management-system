import { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()
  
  // Mobile drop-down menu state toggler
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <aside className={`w-full md:w-52 flex-shrink-0 border-b md:border-b-0 md:border-r ${theme.border} ${theme.bg} flex flex-col transition-colors duration-300 z-40 sticky md:relative top-0 md:min-h-screen`}>

      {/* ── Top Bar Container (Header) ── */}
      <div className={`px-5 py-4 flex items-center justify-between border-b ${theme.border}`}>
        <div>
          <h1 className={`text-base font-bold tracking-tight ${theme.text}`}>
            life<span className="text-blue-500 font-light">fkd</span>24x7
          </h1>
          <span className="text-[10px] font-mono opacity-40 uppercase md:hidden">
            Terminal Profile: {user?.name || 'Guest'}
          </span>
        </div>

        {/* Mobile Hamburger Trigger Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 rounded-xl border ${theme.border} ${theme.text2} md:hidden hover:text-blue-500 transition-all text-sm`}
        >
          {mobileMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* ── Collapsible Menu Wrapper ── */}
      <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 divide-y md:divide-y-0 divide-gray-500/10`}>
        
        {/* User profile identifier pane (Hidden on mobile top bar for minimalism) */}
        <div className={`px-5 py-5 border-b ${theme.border} hidden md:block animate-in fade-in duration-200`}>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold mb-3 shadow-lg shadow-blue-500/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={`text-sm font-medium ${theme.text} truncate`}>{user?.name}</div>
          <div className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-md font-mono mt-1 uppercase inline-block">
            {user?.role || 'User'}
          </div>
        </div>

        {/* Interactive Navigation links layout */}
        <nav className="py-2 md:py-4 flex-1 flex flex-col">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              onClick={() => setMobileMenuOpen(false)} // Auto collapse mobile menu on link click
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

        {/* System sign out control zone */}
        <div className={`px-5 py-4 md:py-5 md:border-t ${theme.border} bg-black/5 dark:bg-white/[0.01] md:bg-transparent`}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 text-sm ${theme.text2} hover:text-red-500 font-medium transition w-full py-1`}
          >
            <span className="text-base">🚪</span> Sign out
          </button>
        </div>

      </div>

    </aside>
  )
}

export default Sidebar