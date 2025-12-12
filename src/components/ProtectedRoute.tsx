'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { AlertCircle, LogIn } from 'lucide-react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = true,
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check cookies first for quick validation
        const authToken = Cookies.get('authToken')
        const userRole = Cookies.get('userRole')
        
        if (!authToken) {
          console.log('No auth token found, redirecting to login')
          router.replace('/login')
          return
        }

        // Verify with Firebase Auth
        const auth = getAuth()
        
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            console.log('No Firebase user found, redirecting to login')
            // Clear invalid cookies
            Cookies.remove('authToken')
            Cookies.remove('userEmail')
            Cookies.remove('userDisplayName')
            Cookies.remove('userRole')
            Cookies.remove('userId')
            router.replace('/login')
            return
          }

          // User is authenticated
          console.log('User authenticated:', user.email)
          
          // Check admin status
          const isUserAdmin = userRole === 'admin'
          setIsAdmin(isUserAdmin)

          if (requireAdmin && !isUserAdmin) {
            console.log('User is not admin, showing access denied')
            setIsAuthorized(false)
            setLoading(false)
            return
          }

          // User is authorized
          console.log('User is authorized')
          setIsAuthorized(true)
          setLoading(false)
        })

        // Cleanup subscription
        return () => unsubscribe()
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/login')
      }
    }

    checkAuth()
  }, [router, requireAdmin])

  const handleLogout = () => {
    const auth = getAuth()
    auth.signOut()
    
    // Clear all cookies
    Cookies.remove('authToken')
    Cookies.remove('userEmail')
    Cookies.remove('userDisplayName')
    Cookies.remove('userRole')
    Cookies.remove('userId')
    
    router.replace('/login')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show access denied for non-admin users
  if (requireAdmin && !isAdmin && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page. Only admin users can access the admin panel.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Home
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LogIn size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  // User is not authorized (shouldn't reach here but just in case)
  if (!isAuthorized && !loading) {
    return null
  }

  // User is authorized, render children
  return <>{children}</>
}

export default ProtectedRoute