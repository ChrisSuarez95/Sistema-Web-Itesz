import { useState, useEffect } from 'react'

const initialData = {
  tickets: [
    {id:1, num:"#0001", subject:"No puedo entrar al sistema", status:"Open", priority:"Alta", dept:"Soporte", agent:"Sin asignar", client:{name:"Juan Pérez", email:"juan@test.com"}, threads:[{user:"Juan Pérez", time:"Hace 2h", msg:"No puedo loguearme"}]},
    {id:2, num:"#0002", subject:"Error de factura", status:"Pending", priority:"Media", dept:"Finanzas", agent:"Ana García", client:{name:"María López", email:"maria@test.com"}, threads:[{user:"María López", time:"Ayer", msg:"Mi factura sale mal"}]},
  ],
  clients: [
    {id:1, name:"Juan Pérez", email:"juan@test.com", company:"Empresa A", tickets:1, role:"Cliente", dept:"Soporte"},
    {id:2, name:"María López", email:"maria@test.com", company:"Empresa B", tickets:1, role:"Cliente", dept:"Finanzas"},
  ],
  agents: [
    {id:1, name:"Ana García", email:"ana@faveo.com", dept:"Soporte", role:"Agente", tickets:5, status:"Activo"},
    {id:2, name:"Carlos Ruiz", email:"carlos@faveo.com", dept:"Soporte", role:"Admin", tickets:3, status:"Activo"},
  ],
  depts: ["Soporte", "Ventas", "Finanzas", "TI", "RH"]
}

export function useFaveo() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("faveo_data_v2")
      return saved ? JSON.parse(saved) : initialData
    } catch { return initialData }
  })

  useEffect(() => {
    localStorage.setItem("faveo_data_v2", JSON.stringify(data))
  }, [data])

  const createTicket = (form) => {
    const newTicket = {
      id: Date.now(),
      num: `#${String(data.tickets.length + 1).padStart(4,"0")}`,
      subject: form.subject,
      status: "Open",
      priority: form.priority,
      dept: form.dept,
      agent: "Sin asignar",
      client: {name: form.name || "Anónimo", email: form.email || "no@email.com"},
      threads: [{user: form.name || "Cliente", time:"Ahora", msg: form.msg || form.subject}]
    }
    setData(prev => ({...prev, tickets:[newTicket, ...prev.tickets]}))
  }

  const updateTicket = (id, patch) => {
    setData(prev => ({...prev, tickets: prev.tickets.map(t=> t.id===id ? {...t, ...patch} : t)}))
  }

  const addThread = (id, msg) => {
    if(!msg.trim()) return
    setData(prev => ({
      ...prev, 
      tickets: prev.tickets.map(t=> t.id===id ? {...t, threads:[...t.threads, {user:"Soporte", time:"Ahora", msg}]} : t)
    }))
  }

  return {data, setData, createTicket, updateTicket, addThread}
}