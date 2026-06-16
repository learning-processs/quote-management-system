import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'

const Landing = () => {
  const { BACKEND }              = useContext(AuthContext)
  const { dark, toggleTheme, theme } = useContext(ThemeContext)

  const [stats, setStats]   = useState({ totalQuotes: 0, totalUsers: 0 })
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, quotesRes] = await Promise.all([
          axios.get(`${BACKEND}/api/admin/public-stats`),
          axios.get(`${BACKEND}/api/quotes?limit=6`),
        ])
        if (statsRes.data.success)  setStats(statsRes.data.data)
        if (quotesRes.data.success) setQuotes(quotesRes.data.data.quotes)
      } catch (err) {
        console.log('Fetch failed:', err.message)
      }
    }
    fetchData()
  }, [BACKEND])

  const categories = ['All', 'Motivation', 'Philosophy', 'Humor', 'Life', 'Love', 'Success']

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>

      {/* ── Navbar ── */}
      <nav className={`${theme.navBg} backdrop-blur-md border-b ${theme.border} px-8 h-14 flex items-center justify-between sticky top-0 z-50`}>
        <h1 className={`text-base font-semibold ${theme.text}`}>
          life<span className="text-blue-500">fkd</span>24x7
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center border ${theme.border} ${theme.text2} hover:text-blue-500 transition text-lg`}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <Link to="/login" className={`text-sm ${theme.text2} hover:text-blue-500 px-4 py-2 rounded-full transition`}>
            Sign in
          </Link>
          <Link to="/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition">
            Join free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="max-w-5xl mx-auto px-8 pt-24 pb-16">
        <span className={`text-xs font-medium ${theme.text3} uppercase tracking-widest`}>
          Community quote vault
        </span>

        <h2 className={`text-7xl font-medium ${theme.text} leading-tight mb-6 tracking-tight mt-6`}>
          Words that<br />
          <span className="text-blue-500 italic">actually</span> hit.
        </h2>

        <p className={`text-lg ${theme.text2} max-w-md leading-relaxed mb-10 font-light`}>
          Real quotes from real people. Raw, honest, mixed — add yours, own it. No fluff, no noise.
        </p>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`px-4 py-2 rounded-full text-sm border ${theme.border} ${theme.text2} hover:border-blue-500 hover:text-blue-500 cursor-pointer transition`}
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-full transition">
            Start sharing
          </Link>
          <Link to="/login" className={`border ${theme.border} ${theme.text2} hover:text-blue-500 hover:border-blue-500 text-sm font-medium px-6 py-3 rounded-full transition`}>
            Browse quotes
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={`max-w-5xl mx-auto px-8 py-12 border-t ${theme.border}`}>
        <div className="flex gap-16 flex-wrap">
          {[
            { num: stats.totalQuotes.toLocaleString(), label: 'Quotes shared' },
            { num: stats.totalUsers.toLocaleString(),  label: 'Members' },
            { num: '12',                               label: 'Categories' },
          ].map((s) => (
            <div key={s.label}>
              <div className={`text-4xl font-medium ${theme.text}`}>{s.num}</div>
              <div className={`text-sm ${theme.text2} mt-1`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Quotes ── */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className={`text-xs font-medium ${theme.text3} uppercase tracking-widest mb-2`}>Featured</div>
        <h3 className={`text-3xl font-medium ${theme.text} mb-10`}>What the community is sharing</h3>

        {quotes.length === 0 ? (
          <div className={`text-center py-20 ${theme.text2}`}>
            <p className="text-lg">No quotes yet.</p>
            <p className="text-sm mt-2">Be the first to add one!</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px ${theme.gridGap} border ${theme.border} rounded-2xl overflow-hidden`}>
            {quotes.map((q) => (
              <div key={q._id} className={`${theme.bgCard} p-8 ${theme.bgHover} transition`}>
                <p className={`${theme.text} text-lg leading-relaxed mb-4 font-light italic`}>
                  "{q.text}"
                </p>
                <p className={`text-sm ${theme.text2} mb-4`}>— {q.author}</p>
                <span className="text-xs bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full">
                  {q.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div className={`${theme.footer} border-t border-gray-800 py-20 px-8 text-center`}>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Join the vault</p>
        <h3 className="text-5xl font-medium text-white mb-4">Your words matter.</h3>
        <p className="text-gray-400 text-base mb-10 font-light">
          Add quotes that moved you. Help others feel less alone.
        </p>
        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-8 py-3 rounded-full transition">
          Start sharing — it's free
        </Link>
      </div>

      {/* ── Footer ── */}
      <footer className={`${theme.footer} border-t border-gray-800 px-8 py-10`}>
        <div className="max-w-5xl mx-auto flex justify-between items-start flex-wrap gap-8">
          <div>
            <h4 className="text-white text-sm font-medium mb-2">lifefkd24x7</h4>
            <p className="text-gray-500 text-sm max-w-xs font-light">
              A community-powered quote vault. Raw, honest, and real — 24x7.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <h5 className="text-gray-500 text-xs uppercase tracking-widest mb-4">Pages</h5>
              <div className="flex flex-col gap-2">
                <Link to="/login"    className="text-gray-500 text-sm hover:text-white transition">Sign in</Link>
                <Link to="/register" className="text-gray-500 text-sm hover:text-white transition">Join</Link>
              </div>
            </div>
            <div>
              <h5 className="text-gray-500 text-xs uppercase tracking-widest mb-4">Follow</h5>
              <div className="flex flex-col gap-2">
                <a className="text-gray-500 text-sm hover:text-white transition cursor-pointer">Twitter / X</a>
                <a className="text-gray-500 text-sm hover:text-white transition cursor-pointer">Instagram</a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-gray-800 flex justify-between flex-wrap gap-4">
          <span className="text-gray-600 text-xs">© 2026 Lifefkd24x7. All rights reserved.</span>
          <span className="text-gray-600 text-xs">Privacy · Terms</span>
        </div>
      </footer>

    </div>
  )
}

export default Landing