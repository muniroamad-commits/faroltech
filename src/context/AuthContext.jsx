import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null) // documento em "clients" (inclui "role")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) { setProfile(null); setLoading(false); return }

      // Ouve o documento do cliente em tempo real (permite promover a admin sem re-login)
      const unsubDoc = onSnapshot(doc(db, 'clients', u.uid), (snap) => {
        setProfile(snap.exists() ? snap.data() : null)
        setLoading(false)
      })
      return () => unsubDoc()
    })
    return unsubAuth
  }, [])

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function signup(name, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    // Todo novo registo começa como "client" — promover a "admin" é feito manualmente
    // na consola Firebase, editando este campo directamente no documento.
    await setDoc(doc(db, 'clients', cred.user.uid), {
      name, email, role: 'client', createdAt: serverTimestamp(),
    })
  }

  async function logout() {
    await signOut(auth)
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
