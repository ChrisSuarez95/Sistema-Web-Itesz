import { useState } from 'react'
import { createTicket, canAssign, canClose, canDeleteTicket, visibleTickets } from '../models/ticketModel'
export function useTicketsViewModel(data, setData, user){
  const [showTicket, setShowTicket] = useState(false)
  const [ticketForm, setTicketForm] = useState({cliente:"", asunto:"", desc:"", depto:"Soporte", estado:"Abierto", asignadoA:"", imagen:""})
  const tickets = user ? visibleTickets(data.tickets, user) : []
  const openNew = () => {
    setTicketForm({cliente:user.nombre, asunto:"", desc:"", depto:data.depts[0], estado:"Abierto", asignadoA:"", imagen:""})
    setShowTicket(true)
  }
  const saveTicket = () => {
    if(!ticketForm.asunto) return alert("Falta asunto")
    const nuevo = createTicket(ticketForm, user, data.tickets.length)
    setData(p=>({...p, tickets:[nuevo, ...p.tickets]}))
    setShowTicket(false)
  }
  const changeAsignado = (id, nuevo) => {
    if(!canAssign(user)) return alert("Solo Admin/Técnico puede asignar")
    setData(p=>({...p, tickets:p.tickets.map(t=>t.id===id?{...t, asignadoA:nuevo, asignadoPor:user.nombre}:t)}))
  }
  const changeEstado = (id, nuevoEstado) => {
    if(!canClose(user)) return alert("Solo Admin/Técnico puede cerrar")
    setData(p=>({...p, tickets:p.tickets.map(t=>{
      if(t.id!==id) return t
      if(nuevoEstado==="Terminado" || nuevoEstado==="Cerrado") return {...t, estado:nuevoEstado, finalizadoPor:user.nombre, fechaFin:new Date().toLocaleDateString()}
      return {...t, estado:nuevoEstado, finalizadoPor:""}
    })}))
  }
  const deleteTicket = (id) => {
    if(!canDeleteTicket(user)) return alert("Solo Admin puede eliminar")
    if(confirm("¿Eliminar ticket?")) setData(p=>({...p, tickets:p.tickets.filter(t=>t.id!==id)}))
  }
  return { tickets, showTicket, setShowTicket, ticketForm, setTicketForm, openNew, saveTicket, changeAsignado, changeEstado, deleteTicket }
}