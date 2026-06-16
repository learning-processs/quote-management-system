import { useState, useContext } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
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
    setMobileMenuOpen(false)
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
    <>
      {/* Structural base wrapper container */}
      <aside className={`w-full md:w-52 flex-shrink-0 border-b md:border-b-0 md:border-r ${theme.border} ${theme.bg} flex flex-col transition-colors duration-300 z-40 sticky md:relative top-0 md:min-h-screen`}>
        
        {/* ── Top Bar Brand Header View ── */}
        <div className={`px-5 py-4 flex items-center justify-between border-b ${theme.border} h-16 relative z-50`}>
          <div className="flex flex-col justify-center">
            <Link 
              to="/dashboard" 
              className="block hover:opacity-85 transition-opacity cursor-pointer"
              onClick={() => setMobileMenuOpen(false)} 
            >
              <h1 className={`text-sm font-bold tracking-tight ${theme.text} leading-none`}>
                life<span className="text-blue-500 font-light">fkd</span>24x7
              </h1>
            </Link>
            <span className="text-[10px] text-blue-500 font-semibold uppercase tracking-widest mt-1 block leading-none">
              Admin Panel
            </span>
          </div>

          {/* Mobile Navbar Hamburger Toggle Button centered perfectly */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`px-3 py-1.5 rounded-xl border ${theme.border} ${theme.text2} md:hidden hover:text-blue-500 transition-all text-xs font-semibold flex items-center justify-center h-8 my-auto cursor-pointer active:scale-95 select-none`}
          >
            {mobileMenuOpen ? '✕ Close' : '☰ Menu'}
          </button>
        </div>

        {/* ── Responsive Side-Drawer Panel (Slides Right-to-Left on Mobile) ── */}
        <div className={`
          fixed top-0 right-0 h-full w-64 shadow-2xl transform transition-transform duration-300 ease-in-out z-40
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} 
          md:relative md:translate-x-0 md:flex md:h-auto md:w-full md:shadow-none
          flex flex-col divide-y md:divide-y-0 divide-gray-500/10 ${theme.bg} ${theme.border} md:border-none
        `}>

          {/* Top layout padding offset spacing context placeholder for mobile only */}
          <div className="h-16 md:hidden flex-shrink-0" />

          {/* Admin profile view block (Hidden on mobile navigation lists for clean sizing) */}
          <div className={`px-5 py-5 border-b ${theme.border} hidden md:block animate-in fade-in duration-150`}>
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold mb-3 shadow-lg shadow-blue-500/20">
              {admin?.name?.charAt(0).toUpperCase()}
            </div>
            <div className={`text-sm font-medium ${theme.text} truncate`}>{admin?.name}</div>
            <div className="text-[10px] text-blue-500 font-medium mt-0.5 uppercase tracking-wider font-mono">{admin?.role}</div>
          </div>

          {/* Navigation Core Routes Container */}
          <nav className="py-4 md:py-4 flex-1 flex flex-col">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-4 md:py-2.5 text-sm transition border-r-4 md:border-r-0 md:border-l-2 cursor-pointer ${
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
          <div className={`px-5 py-6 md:py-5 md:border-t ${theme.border} space-y-4 bg-black/5 dark:bg-white/[0.01] md:bg-transparent`}>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-3 text-sm ${theme.text2} hover:text-blue-500 transition w-full group py-1 cursor-pointer`}
            >
              <span className="group-hover:scale-110 transition-transform">{dark ? '☀️' : '🌙'}</span>
              <span className="font-medium">{dark ? 'Light mode' : 'Dark mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 text-sm ${theme.text2} hover:text-red-500 transition w-full group py-1 cursor-pointer`}
            >
              <span className="group-hover:scale-110 transition-transform">🚪</span> 
              <span className="font-medium">Sign out</span>
            </button>
          </div>

        </div>
      </aside>

      {/* ── Background Blurred Mask Overlay (Hides drawer instantly on external taps) ── */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar