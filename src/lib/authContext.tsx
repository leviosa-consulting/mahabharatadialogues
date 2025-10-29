
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import db from '@/firebase/firebaseServices'
import Cookies from 'js-cookie'

interface UserData {
  uid: string
  email: string
  displayName: string
  role: 'user' | 'admin'
  createdAt: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  isAdmin: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
     
          setUser(currentUser)

         
          try {
            const userDocRef = doc(db, 'users', currentUser.uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
              const data = userDoc.data() as UserData
              setUserData(data)
              setIsAdmin(data.role === 'admin')

            
              Cookies.set('userEmail', data.email, {
                expires: 7,
                secure: true,
                sameSite: 'strict',
              })
              Cookies.set('userDisplayName', data.displayName, {
                expires: 7,
                secure: true,
                sameSite: 'strict',
              })
              Cookies.set('userRole', data.role, {
                expires: 7,
                secure: true,
                sameSite: 'strict',
              })
            } else {
             
              console.warn('User document not found in Firestore')
              setUserData(null)
              setIsAdmin(false)
            }
          } catch (firestoreError) {
            console.error('Error fetching user data from Firestore:', firestoreError)
            setUserData(null)
            setIsAdmin(false)
          }
        } else {
         
          setUser(null)
          setUserData(null)
          setIsAdmin(false)

          
          Cookies.remove('authToken')
          Cookies.remove('userEmail')
          Cookies.remove('userDisplayName')
          Cookies.remove('userRole')
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        setUser(null)
        setUserData(null)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      setUser(null)
      setUserData(null)
      setIsAdmin(false)
      Cookies.remove('authToken')
      Cookies.remove('userEmail')
      Cookies.remove('userDisplayName')
      Cookies.remove('userRole')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    userData,
    loading,
    isAdmin,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}