import { useState } from 'react'
export function useAuthViewModel(data){
  const [user, setUser] = useState(()=>JSON.parse(localStorage.getItem("itesz_user")||"null"))
  const [login, setLogin] = useState({email:"prueba123@gmail.com", password:"chris123"})
  const doLogin = () => {
    const f = data.users.find(u=>u.email===login.email && u.password===login.password)
    if(!f) return alert("Incorrecto")
    localStorage.setItem("itesz_user", JSON.stringify(f)); setUser(f)
  }
  const doLogout = () => { localStorage.removeItem("itesz_user"); setUser(null) }
  return { user, login, setLogin, doLogin, doLogout }
}