import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import Sidebar from '../../components/Sidebar'

const MyQuotes = () => {
  const { BACKEND, token } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)

  const [quotes, setQuotes]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [editQuote, setEditQuote] = useState(null)
  const [editForm, setEditForm]   = useState({ text: '', author: '', category: '' })

  const categories = ['Motivation', 'Philosophy', 'Life', 'Love', 'Humor', 'Success', 'Other']

  const fetchMyQuotes = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(
        `${BACKEND}/api/users/my-quotes`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) setQuotes(data.data.quotes)
    } catch (err) {
      toast.error('Failed to load your quotes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyQuotes()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quote?')) return
    try {
      const { data } = await axios.delete(
        `${BACKEND}/api/quotes/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Quote deleted.')
        setQuotes(quotes.filter(q => q._id !== id))
      }
    } catch (err) {
      toast.error('Failed to delete quote.')
    }
  }

  const openEdit = (quote) => {
    setEditQuote(quote)
    setEditForm({ text: quote.text, author: quote.author, category: quote.category })
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
        toast.success('Quote updated live!')
        setEditQuote(null)
        fetchMyQuotes()
      }
    } catch (err) {
      toast.error('Failed to update quote.')
    }
  }

  return (
    <div className={`flex min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />

      <main className="flex-1 p-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-medium ${theme.text}`}>My Quotes</h2>
            <p className={`text-sm ${theme.text2} mt-1`}>Quotes you have submitted</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/add-quote"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition"
            >
              + Add Quote
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : quotes.length === 0 ? (
          <div className={`text-center py-20 ${theme.text2}`}>
            <p className="text-4xl mb-4">📝</p>
            <p className="text-lg">No quotes yet.</p>
            <p className="text-sm mt-2">Add your first quote!</p>
            <Link
              to="/add-quote"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2.5 rounded-full transition"
            >
              + Add Quote
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((q) => (
              <div
                key={q._id}
                className={`${theme.bgCard} border ${theme.border} rounded-2xl p-6 transition`}
              >
                <p className={`${theme.text} text-base leading-relaxed mb-3 italic font-light`}>
                  "{q.text}"
                </p>
                <p className={`text-xs ${theme.text2} mb-4`}>— {q.author}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-green-500/10 text-green-500 px-3 py-1 rounded-full font-medium">
                    ● Live
                  </span>
                  <span className="text-xs bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full">
                    {q.category}
                  </span>
                </div>
                <div className={`flex gap-2 pt-4 border-t ${theme.border}`}>
                  <button
                    onClick={() => openEdit(q)}
                    className={`flex-1 border ${theme.border} ${theme.text2} hover:border-blue-500 hover:text-blue-500 text-xs py-2 rounded-full transition`}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs py-2 rounded-full transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Edit Modal */}
      {editQuote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className={`${theme.bgCard} border ${theme.border} rounded-2xl p-8 w-full max-w-md shadow-xl`}>
            <h3 className={`text-xl font-medium ${theme.text} mb-6`}>Edit Quote</h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text2} mb-1`}>Quote text</label>
                <textarea
                  value={editForm.text}
                  onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                  rows={4}
                  maxLength={500}
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
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-3 rounded-full transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditQuote(null)}
                  className={`flex-1 border ${theme.border} ${theme.text2} text-sm py-3 rounded-full transition`}
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

export default MyQuotes