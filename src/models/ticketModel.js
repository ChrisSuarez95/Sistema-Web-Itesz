export const createTicket = (form, user, total) => ({
  id: Date.now(),
  num: `#${String(total+1).padStart(4,"0")}`,
  fecha: new Date().toLocaleDateString(),
  registradoPor: user.nombre,
  asignadoPor: user.nombre,
  finalizadoPor: "",
  fechaFin: "",
  imagen: form.imagen || "",
  ...form,
  cliente: form.cliente || user.nombre,
})
export const canAssign = (user) => user.rol==="Admin" || user.rol==="Tecnico"
export const canClose = (user) => user.rol==="Admin" || user.rol==="Tecnico"
export const canDeleteTicket = (user) => user.rol==="Admin"
export const visibleTickets = (tickets, user) =>
  user.rol==="Cliente" ? tickets.filter(t=>t.registradoPor===user.nombre || t.cliente===user.nombre) : tickets