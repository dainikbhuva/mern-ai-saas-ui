import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordsMatch = password.length > 0 && password === confirmPassword
  const canSubmit = email.trim().length > 0 && password.length >= 6 && passwordsMatch && !loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email: email.trim(),
        password,
      })

      if (response.data.success) {
        login(response.data.data.token)
        navigate('/dashboard')
      } else {
        setError(response.data.error?.message || 'Registration failed')
      }
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Registration failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:py-12">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 to-violet-600 p-10 text-white md:flex">
            <div>
              <div className="text-sm font-semibold tracking-wide">MarketingAI</div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight">Create your account</h1>
              <p className="mt-3 text-sm text-white/90">
                Free plan: 5 AI generations/month. Generate ads, blogs, social posts, SEO & product copy.
              </p>
            </div>

            <div className="text-xs text-white/80">© {new Date().getFullYear()} MarketingAI</div>
          </div>

          <div className="p-6 md:p-10">
            <div>
              <h2 className="text-2xl font-semibold">Get started</h2>
              <p className="mt-1 text-sm text-slate-600">Create an account in less than a minute.</p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-14 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15"
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-transparent px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/15"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="text-xs text-slate-500">Use at least 6 characters.</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Confirm password</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-type your password"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15"
                  autoComplete="new-password"
                  disabled={loading}
                />
                {confirmPassword.length > 0 && !passwordsMatch ? (
                  <div className="text-xs font-medium text-rose-600">Passwords do not match</div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <div className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-indigo-700 hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
