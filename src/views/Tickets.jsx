export default function Tickets({ vm, data, user }){
  const isAdmin = user.rol==="Admin"
  const isTecnico = user.rol==="Tecnico"
  const isCliente = user.rol==="Cliente"
  return (
    <div className="bg-white rounded shadow border-t-4 border-[#3c8dbc]">
      <div className="p-4 border-b flex justify-between items-center"><h2 className="font-bold">Tickets ({vm.tickets.length}) {isCliente && "- Mis Tickets"}</h2><button onClick={vm.openNew} className="bg-[#3c8dbc] text-white px-4 py-1.5 rounded text-[12px]">+ Nuevo Ticket</button></div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead><tr className="bg-gray-100 text-left text-[10px]"><th className="p-2">Num</th><th>Img</th><th>Registrado Por</th><th>Asignado Por</th><th>Asignado A</th><th>Asunto</th><th>Estado</th><th>Finalizado Por</th>{isAdmin && <th>Acción</th>}</tr></thead>
          <tbody>{vm.tickets.map(t=><tr key={t.id} className="border-b">
            <td className="p-2 font-bold">{t.num}</td>
            <td className="p-2">{t.imagen ? <img src={t.imagen} className="w-10 h-10 object-cover rounded border"/> : "-"}</td>
            <td className="p-2"><span className="bg-blue-100 px-2 py-0.5 rounded font-bold">{t.registradoPor}</span></td>
            <td className="p-2"><span className="bg-purple-100 px-2 py-0.5 rounded">{t.asignadoPor||"-"}</span></td>
            <td className="p-2">{(isAdmin||isTecnico) ? <select value={t.asignadoA||""} onChange={e=>vm.changeAsignado(t.id, e.target.value)} className="border px-1 py-1 bg-green-50 font-bold text-[10px]"><option value="">Sin asignar</option>{data.users.filter(u=>u.rol!=="Cliente").map(u=><option key={u.id} value={u.nombre}>{u.nombre} ({u.rol})</option>)}</select> : <span>{t.asignadoA||"-"}</span>}</td>
            <td className="p-2">{t.asunto}</td>
            <td className="p-2">{(isAdmin||isTecnico) ? <select value={t.estado} onChange={e=>vm.changeEstado(t.id, e.target.value)} className="border px-1 py-1 font-bold text-[10px]"><option>Abierto</option><option>En Proceso</option><option>Terminado</option><option>Cerrado</option></select> : <span className="bg-yellow-100 px-2 py-0.5 rounded font-bold">{t.estado}</span>}</td>
            <td className="p-2">{t.finalizadoPor ? <span className="bg-green-600 text-white px-2 py-0.5 rounded font-bold">{t.finalizadoPor} {t.fechaFin||""}</span> : "-"}</td>
            {isAdmin && <td className="p-2"><button onClick={()=>vm.deleteTicket(t.id)} className="text-red-500 font-bold">X</button></td>}
          </tr>)}</tbody>
        </table>
        {isCliente && <div className="p-3 bg-blue-50 text-[11px] text-center">Como Cliente solo puedes ver tu reporte/estado.</div>}
      </div>
    </div>
  )
}