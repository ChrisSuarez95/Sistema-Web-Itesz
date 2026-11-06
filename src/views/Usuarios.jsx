export default function Usuarios({ data, vm }){
  return (
    <div className="bg-white rounded shadow border-t-4 border-[#00a65a]">
      <div className="p-4 border-b flex justify-between"><h2 className="font-bold">Usuarios ({data.users.length})</h2><button onClick={vm.openNew} className="bg-[#00a65a] text-white px-4 py-1.5 rounded">+ Agregar Usuario</button></div>
      <div className="divide-y">{data.users.map(u=><div key={u.id} className="flex justify-between p-4"><div><p className="font-bold">{u.nombre} - <span className={u.rol==="Admin"?"text-red-600":u.rol==="Tecnico"?"text-blue-600":"text-green-600"}>{u.rol}</span></p><p className="text-[11px]">{u.email} | {u.depto}</p></div><div className="flex gap-3"><button onClick={()=>vm.openEdit(u)} className="text-blue-600 font-bold">Modificar</button><button onClick={()=>vm.deleteUser(u.id)} className="text-red-500 font-bold">Eliminar</button></div></div>)}</div>
    </div>
  )
}