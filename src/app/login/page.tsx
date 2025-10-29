'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  getAuth, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth'
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import Cookies from 'js-cookie'

const LoginContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccessMessage(message)
      setTimeout(() => setSuccessMessage(''), 5000)
    }

    const authToken = Cookies.get('authToken')
    if (authToken) {
      router.push('/admin')
    }
  }, [searchParams, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      const idToken = await userCredential.user.getIdToken()
      
      // Set cookies with 7 days expiry
      Cookies.set('authToken', idToken, { 
        expires: 7,
        secure: true,
        sameSite: 'strict'
      })
      
      Cookies.set('userEmail', userCredential.user.email || '', { 
        expires: 7,
        secure: true,
        sameSite: 'strict'
      })
      
      Cookies.set('userDisplayName', userCredential.user.displayName || '', { 
        expires: 7,
        secure: true,
        sameSite: 'strict'
      })
      
      router.push('/admin')
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password')
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many login attempts. Try again later.')
      } else {
        setError(err.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResetSuccess(false)

    if (!resetEmail) {
      setError('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetEmail)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setResetLoading(true)
      const auth = getAuth()
      
      await sendPasswordResetEmail(auth, resetEmail)
      setResetSuccess(true)
      setResetEmail('')
      
      setTimeout(() => {
        setShowForgotPassword(false)
        setResetSuccess(false)
      }, 5000)
    } catch (err: any) {
      console.error('Password reset error:', err)
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.')
      } else {
        setError('Failed to send reset email. Please try again.')
      }
    } finally {
      setResetLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>

          {resetSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-green-800 font-medium">Check your email</p>
                <p className="text-green-700 text-sm">
                  We've sent you a password reset link. Please check your email inbox (and spam folder) to continue.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="Enter your email"
                  disabled={resetLoading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {resetLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <button
            onClick={() => {
              setShowForgotPassword(false)
              setError('')
              setResetSuccess(false)
            }}
            className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium"
            disabled={resetLoading}
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => setShowForgotPassword(true)}
          className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
          type="button"
        >
          Forgot your password?
        </button>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
