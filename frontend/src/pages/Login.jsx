import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { BACKEND, login } = useContext(AuthContext)

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${BACKEND}/api/auth/login`, form)
      login(data.data.token, data.data.user)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    /* 
      FIX 1: Altered vertical alignment behavior on small screens. 
      Using 'items-start pt-8 md:items-center md:pt-0' forces the login interface 
      upward on mobile devices, preventing it from getting squished by the native keyboard.
    */
    <div className="min-h-screen bg-gray-950 flex items-start justify-center pt-8 md:items-center md:pt-0 px-4 overflow-y-auto">
      
      {/* 
        FIX 2: Added a structural bottom margin cushion layer ('mb-36 md:mb-0'). 
        This introduces clean blank space beneath the login box layout context on mobile devices, 
        giving your viewport container plenty of room to scroll upward dynamically while entering your data.
      */}
      <div className="w-full max-w-md mb-36 md:mb-0">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white">
            life<span className="text-blue-500">fkd</span>24x7
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">quotes</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

          <h2 className="text-2xl font-medium text-white mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">Sign in to continue sharing quotes.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder-gray-600"
              />
            </div>

            <div className="flex items-center justify-between select-none">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer group hover:text-gray-400 transition">
                <input type="checkbox" className="accent-blue-500 cursor-pointer" />
                Remember me
              </label>
              <span className="text-sm text-blue-500 cursor-pointer hover:underline select-none">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            No account?{' '}
            <Link to="/register" className="text-blue-500 font-medium hover:underline cursor-pointer">
              Create one free
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login