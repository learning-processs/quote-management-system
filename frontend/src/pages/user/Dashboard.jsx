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

  const [quotes, setQuotes]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [category, setCategory]     = useState('')
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = ['All', 'Motivation', 'Philosophy', 'Life', 'Love', 'Humor', 'Success', 'Other']

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (search)   params.append('search', search)
      params.append('page', page)
      params.append('limit', 12)

      const { data } = await axios.get(`${BACKEND}/api/quotes?${params}`)
      if (data.success) {
        setQuotes(data.data.quotes)
        setTotalPages(data.data.pages)
      }
    } catch (err) {
      toast.error('Failed to load quotes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [category, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchQuotes()
  }

  const handleLike = async (id) => {
    try {
      const { data } = await axios.put(
        `${BACKEND}/api/quotes/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setQuotes(quotes.map(q =>
          q._id === id ? { ...q, likes: Array(data.data.likes).fill('') } : q
        ))
        toast.success(data.message)
      }
    } catch (err) {
      toast.error('Failed to like quote.')
    }
  }

  return (
    <div className={`flex min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />

      <main className="flex-1 p-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-medium ${theme.text}`}>Browse Quotes</h2>
            <p className={`text-sm ${theme.text2} mt-1`}>Discover what the community is sharing</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center border ${theme.border} ${theme.text2} hover:text-blue-500 transition text-lg`}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6 flex-wrap items-center">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotes, authors..."
              className={`${theme.bgInput} border ${theme.borderInput} ${theme.textInput} ${theme.placeholder} rounded-full px-4 py-2 text-sm outline-none ${theme.focusBorder} transition w-64`}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full transition"
            >
              Search
            </button>
          </form>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1) }}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  (cat === 'All' && !category) || cat === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : `${theme.bgCard} ${theme.text2} ${theme.border} hover:border-blue-500 hover:text-blue-500`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Link
            to="/add-quote"
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition"
          >
            + Add Quote
          </Link>
        </div>

        {/* Quotes Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : quotes.length === 0 ? (
          <div className={`text-center py-20 ${theme.text2}`}>
            <p className="text-lg">No quotes found.</p>
            <p className="text-sm mt-2">Try a different category or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((q) => (
              <div
                key={q._id}
                className={`${theme.bgCard} border ${theme.border} rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition`}
              >
                <p className={`${theme.text} text-base leading-relaxed mb-3 italic font-light`}>
                  "{q.text}"
                </p>
                <p className={`text-xs ${theme.text2} mb-4`}>— {q.author}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full">
                    {q.category}
                  </span>
                  <button
                    onClick={() => handleLike(q._id)}
                    className={`text-xs ${theme.text2} hover:text-blue-500 transition flex items-center gap-1`}
                  >
                    ♥ {q.likes?.length || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 text-sm border ${theme.border} rounded-full ${theme.text2} hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 transition`}
            >
              Prev
            </button>
            <span className={`px-4 py-2 text-sm ${theme.text2}`}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 text-sm border ${theme.border} rounded-full ${theme.text2} hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 transition`}
            >
              Next
            </button>
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard