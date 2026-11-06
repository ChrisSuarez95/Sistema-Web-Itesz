export default function Dashboard({data, user}){
  const misTickets = user.rol==="Cliente" ? data.tickets.filter(t=>t.registradoPor===user.nombre) : data.tickets
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#00c0ef] text-white p-6 rounded"><h3 className="text-[30px] font-bold">{misTickets.length}</h3><p>Tickets</p></div>
        <div className="bg-[#00a65a] text-white p-6 rounded"><h3 className="text-[30px] font-bold">{data.users.length}</h3><p>Usuarios</p></div>
        <div className="bg-[#f39c12] text-white p-6 rounded"><h3 className="text-[30px] font-bold">{data.depts.length}</h3><p>Departamentos</p></div>
      </div>
      <div className="bg-white p-4 mt-4 rounded shadow">Hola <b>{user.nombre}</b> - Rol: <b>{user.rol}</b><br/>{user.rol==="Cliente" ? "Solo puedes crear tickets y ver tu estado." : user.rol==="Tecnico" ? "Puedes asignar y cerrar tickets." : "Puedes hacer todo."}</div>
    </div>
  )
}