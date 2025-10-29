
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'
import { AlertCircle, LogIn } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = true,
}) => {
  const router = useRouter()
  const { user, userData, loading, isAdmin, logout } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (loading) return

    
    if (!user) {
      router.push('/login')
      return
    }
// console.log("admin ", user)
    // Check if admin access is required and user is not admin
    // if (requireAdmin && !isAdmin) {
    //   router.push('/unauthoriz')
    //   return
    // }

    // User is authorized
    setIsAuthorized(true)
  }, [user, isAdmin, loading, requireAdmin, router])

   const handleLogout = async () => {
    await logout()
    router.push('/login')
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


  if (requireAdmin && !isAdmin) {
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

 
  if (!isAuthorized) {
    return null
  }

  
  return <>{children}</>
}

export default ProtectedRoute