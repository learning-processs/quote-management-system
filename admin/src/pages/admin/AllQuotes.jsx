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

  const fetchAllQuotes = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${BACKEND}/api/admin/quotes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (data.success) {
        // Unpacking the data based on your specific backend structure
        const quotesArray = Array.isArray(data.data) ? data.data : data.data.quotes;
        setQuotes(quotesArray || []);
      }
    } catch (err) {
      toast.error("Failed to fetch quotes")
      setQuotes([]);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAllQuotes() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent delete? This cannot be undone.")) return
    try {
      await axios.delete(`${BACKEND}/api/admin/quotes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Quote removed from platform")
      setQuotes(quotes.filter(q => q._id !== id))
    } catch (err) {
      toast.error("Delete failed")
    }
  }

  return (
    <div className={`flex min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="mb-8">
          <h2 className={`text-3xl font-medium ${theme.text}`}>Content Moderation</h2>
          <p className={`${theme.text2} text-sm mt-1`}>Quotes are live instantly. Use this to delete inappropriate content.</p>
        </div>

        <div className={`overflow-x-auto border ${theme.border} rounded-2xl`}>
          <table className="w-full text-left border-collapse">
            <thead className={`${theme.tableHead} ${theme.text} text-xs uppercase`}>
              <tr>
                <th className="px-6 py-4">Quote Content</th>
                <th className="px-6 py-4">Author Name</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`${theme.text2} text-sm divide-y ${theme.tableBorder}`}>
              {quotes.map((q) => (
                <tr key={q._id} className={`${theme.tableRow} transition`}>
                  <td className={`px-6 py-4 max-w-sm truncate italic ${theme.text}`}>"{q.text}"</td>
                  <td className="px-6 py-4">{q.author || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    {q.submittedBy ? (
                      <div>
                        <div className={theme.text}>{q.submittedBy.name}</div>
                        <div className="text-[10px] opacity-50">{q.submittedBy.email}</div>
                      </div>
                    ) : (
                      <span className="opacity-40 italic text-xs">System</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(q._id)} 
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs px-4 py-2 rounded-full transition font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && quotes.length === 0 && <p className="text-center py-10">No quotes currently live.</p>}
        </div>
      </main>
    </div>
  )
}

export default AllQuotes