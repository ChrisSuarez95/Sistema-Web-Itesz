import { useState } from 'react'
import { createUser } from '../models/userModel'
export function useUsersViewModel(data, setData){
  const [showUser, setShowUser] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [userForm, setUserForm] = useState({nombre:"", email:"", password:"", rol:"Cliente", depto:"General"})
  const openNew = () => { setEditUser(null); setUserForm({nombre:"", email:"", password:"", rol:"Cliente", depto:"General"}); setShowUser(true) }
  const openEdit = (u) => { setEditUser(u); setUserForm(u); setShowUser(true) }
  const saveUser = () => {
    if(!userForm.nombre || !userForm.email) return alert("Falta nombre/email")
    if(editUser) setData(p=>({...p, users:p.users.map(u=>u.id===editUser.id?{...u, ...userForm}:u)}))
    else setData(p=>({...p, users:[createUser(userForm), ...p.users]}))
    setShowUser(false); setEditUser(null)
  }
  const deleteUser = (id) => { if(confirm("¿Eliminar usuario?")) setData(p=>({...p, users:p.users.filter(x=>x.id!==id)})) }
  return { showUser, setShowUser, editUser, setEditUser, userForm, setUserForm, openNew, openEdit, saveUser, deleteUser }
}