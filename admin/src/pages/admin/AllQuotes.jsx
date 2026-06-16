import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import Sidebar from '../../components/Sidebar'

const AllQuotes = () => {
  const { BACKEND, token } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)

  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editQuote, setEditQuote] = useState(null)
  const [editForm, setEditForm] = useState({ text: '', author: '', category: '' })

  const categories = ['All', 'Motivation', 'Philosophy', 'Life', 'Love', 'Humor', 'Success', 'Other']

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (search)   params.append('search', search)
      params.append('page', page)
      params.append('limit', 10)

      const { data } = await axios.get(
        `${BACKEND}/api/admin/quotes?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
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

  useEffect(() => { fetchQuotes() }, [category, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchQuotes()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quote permanently?')) return
    try {
      const { data } = await axios.delete(
        `${BACKEND}/api/admin/quotes/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Quote deleted.')
        fetchQuotes()
      }
    } catch (err) {
      toast.error('Failed to delete.')
    }
  }

  const openEdit = (q) => {
    setEditQuote(q)
    setEditForm({ text: q.text, author: q.author, category: q.category })
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(
        `${BACKEND}/api/quotes/${editQuote._id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Quote updated!')
        setEditQuote(null)
        fetchQuotes()
      }
    } catch (err) {
      toast.error('Failed to update.')
    }
  }

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-10 w-full overflow-x-hidden">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-medium ${theme.text}`}>All Quotes</h2>
            <p className={`text-xs sm:text-sm ${theme.text2} mt-1`}>Manage every quote on the platform</p>
          </div>
        </div>

        {/* Search + Filter Container */}
        <div className="flex flex-col gap-4 mb-6 w-full">
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotes..."
              className={`${theme.bgInput} border ${theme.borderInput} ${theme.textInput} ${theme.placeholder} rounded-full px-4 py-2 text-sm outline-none ${theme.focusBorder} transition w-full sm:w-64`}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full transition whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* Horizontally Scrollable Category Badges for Mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 max-w-full no-scrollbar whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1) }}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border transition ${
                  (cat === 'All' && !category) || cat === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : `${theme.bgCard} ${theme.text2} ${theme.border} hover:border-blue-500 hover:text-blue-500`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Layer */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : quotes.length === 0 ? (
          <div className={`text-center py-20 ${theme.text2}`}>
            <p className="text-sm sm:text-base">No quotes found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className={`hidden md:block ${theme.bgCard} border ${theme.border} rounded-2xl overflow-hidden shadow-sm`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={theme.tableHead}>
                    <tr>
                      {['Quote', 'Author', 'Submitted By', 'Category', 'Date', 'Actions'].map(h => (
                        <th key={h} className={`text-left px-6 py-3 text-xs font-medium ${theme.text3} uppercase tracking-wider`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((q) => (
                      <tr key={q._id} className={`border-t ${theme.tableBorder} ${theme.tableRow} transition`}>
                        <td className={`px-6 py-4 text-sm ${theme.text2} max-w-xs truncate`}>
                          "{q.text}"
                        </td>
                        <td className={`px-6 py-4 text-sm ${theme.text}`}>{q.author || 'Unknown'}</td>
                        <td className={`px-6 py-4 text-sm ${theme.text2}`}>{q.submittedBy?.name || 'Anonymous'}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full">
                            {q.category}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${theme.text2}`}>
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(q)}
                              className={`text-xs ${theme.bgInput} border ${theme.border} ${theme.text2} hover:border-blue-500 hover:text-blue-500 px-3 py-1.5 rounded-full transition`}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(q._id)}
                              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-full transition"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards Stack View (Hidden on large viewports) */}
            <div className="grid grid-cols-1 gap-4 md:hidden w-full">
              {quotes.map((q) => (
                <div key={q._id} className={`p-5 rounded-2xl border ${theme.border} ${theme.bgCard} space-y-4 break-words shadow-sm`}>
                  <p className={`text-sm ${theme.text} font-light italic leading-relaxed`}>
                    "{q.text}"
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-xs border-t border-b border-gray-500/5 py-3">
                    <div>
                      <span className={`block opacity-40 ${theme.text2} font-mono text-[10px] uppercase`}>Author</span>
                      <span className={`font-medium ${theme.text}`}>{q.author || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className={`block opacity-40 ${theme.text2} font-mono text-[10px] uppercase`}>Submitted By</span>
                      <span className={`font-medium ${theme.text2}`}>{q.submittedBy?.name || 'Anonymous'}</span>
                    </div>
                    <div className="mt-1">
                      <span className={`block opacity-40 ${theme.text2} font-mono text-[10px] uppercase mb-0.5`}>Category</span>
                      <span className="bg-blue-500/10 text-blue-500 px-2.5 py-0.5 rounded-md font-medium text-[11px]">
                        {q.category}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className={`block opacity-40 ${theme.text2} font-mono text-[10px] uppercase`}>Date</span>
                      <span className={theme.text2}>{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => openEdit(q)}
                      className={`flex-1 text-center border ${theme.border} ${theme.text2} text-xs py-2 rounded-xl transition font-medium`}
                    >
                      ✏️ Edit Entry
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="flex-1 text-center bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs py-2 rounded-xl transition font-medium"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-1.5 text-xs sm:text-sm border ${theme.border} rounded-full ${theme.text2} hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 transition`}
            >
              Prev
            </button>
            <span className={`px-3 py-1 text-xs sm:text-sm ${theme.text2} font-medium`}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-1.5 text-xs sm:text-sm border ${theme.border} rounded-full ${theme.text2} hover:border-blue-500 hover:text-blue-500 disabled:opacity-40 transition`}
            >
              Next
            </button>
          </div>
        )}

      </main>

      {/* Edit Overlay Backdrop Modal */}
      {editQuote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
          <div className={`${theme.bgCard} border ${theme.border} rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl transition-all max-h-full overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-medium ${theme.text}`}>Edit Quote</h3>
              <button onClick={() => setEditQuote(null)} className={`${theme.text2} text-sm font-bold p-1 hover:text-red-500`}>✕</button>
            </div>
            
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text2} mb-1`}>Quote text</label>
                <textarea
                  value={editForm.text}
                  onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                  rows={4}
                  maxLength={500}
                  required
                  className={`w-full ${theme.bgInput} border ${theme.borderInput} ${theme.textInput} ${theme.placeholder} rounded-xl px-4 py-3 text-sm outline-none ${theme.focusBorder} transition resize-none`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.text2} mb-1`}>Author</label>
                <input
                  type="text"
                  value={editForm.author}
                  onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                  className={`w-full ${theme.bgInput} border ${theme.borderInput} ${theme.textInput} ${theme.placeholder} rounded-xl px-4 py-3 text-sm outline-none ${theme.focusBorder} transition`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.text2} mb-1`}>Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className={`w-full ${theme.bgInput} border ${theme.borderInput} ${theme.textInput} rounded-xl px-4 py-3 text-sm outline-none ${theme.focusBorder} transition`}
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-3 rounded-full transition font-semibold"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditQuote(null)}
                  className={`w-full sm:flex-1 border ${theme.border} ${theme.text2} text-sm py-3 rounded-full transition`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AllQuotes