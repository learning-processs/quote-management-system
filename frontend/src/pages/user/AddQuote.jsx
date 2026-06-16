import { useState, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import Sidebar from '../../components/Sidebar'

const AddQuote = () => {
  const { BACKEND, token } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    text: '',
    author: '',
    category: 'Motivation',
  })
  const [loading, setLoading] = useState(false)

  const categories = ['Motivation', 'Philosophy', 'Life', 'Love', 'Humor', 'Success', 'Other']

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.text.trim()) return toast.error('Quote text is required.')

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${BACKEND}/api/quotes`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Quote published live instantly!')
        navigate('/my-quotes')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quote.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="max-w-xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-3xl font-medium ${theme.text}`}>Add a Quote</h2>
              <p className={`text-sm ${theme.text2} mt-1`}>Share something that moved you</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Quote text */}
            <div>
              <label className={`block text-sm font-medium ${theme.text2} mb-2`}>
                Quote text
              </label>
              <textarea
                name="text"
                value={form.text}
                onChange={handleChange}
                placeholder="Type the quote here..."
                rows={5}
                maxLength={500}
                required
                className={`w-full ${theme.bgInput} border ${theme.borderInput} ${theme.textInput} ${theme.placeholder} rounded-2xl px-4 py-3 text-sm outline-none ${theme.focusBorder} transition resize-none`}
              />
              <div className={`text-right text-xs ${theme.text3} mt-1`}>
                {form.text.length} / 500
              </div>
            </div>

            {/* Author */}
            <div>
              <label className={`block text-sm font-medium ${theme.text2} mb-2`}>
                Author
              </label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Who said this? (or leave blank for Unknown)"
                className={`w-full ${theme.bgInput} border ${theme.borderInput} ${theme.textInput} ${theme.placeholder} rounded-2xl px-4 py-3 text-sm outline-none ${theme.focusBorder} transition`}
              />
            </div>

            {/* Category */}
            <div>
              <label className={`block text-sm font-medium ${theme.text2} mb-2`}>
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full ${theme.bgInput} border ${theme.borderInput} ${theme.textInput} rounded-2xl px-4 py-3 text-sm outline-none ${theme.focusBorder} transition`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Live Preview */}
            {form.text && (
              <div>
                <label className={`block text-sm font-medium ${theme.text2} mb-2`}>
                  Live preview
                </label>
                <div className={`${theme.bgCard} border ${theme.border} border-l-4 border-l-blue-500 rounded-2xl px-6 py-5`}>
                  <p className={`${theme.text} text-base italic font-light leading-relaxed`}>
                    "{form.text}"
                  </p>
                  {form.author && (
                    <p className={`text-xs ${theme.text2} mt-3`}>— {form.author}</p>
                  )}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-8 py-3 rounded-full transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Quote'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className={`border ${theme.border} ${theme.text2} hover:border-blue-500 hover:text-blue-500 text-sm font-medium px-8 py-3 rounded-full transition`}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}

export default AddQuote