import { useState } from 'react'
export default function TicketModal({ vm, data, user }){
  const [preview, setPreview] = useState(null)
  const handleImage = (e)=>{
    const file=e.target.files[0]; if(!file) return
    const r=new FileReader(); r.onloadend=()=>{ vm.setTicketForm({...vm.ticketForm, imagen:r.result}); setPreview(r.result) }; r.readAsDataURL(file)
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded w-full max-w-[500px]">
      <div className="bg-[#3c8dbc] text-white p-3 flex justify-between font-bold"><span>Nuevo Ticket - {user.nombre}</span><button onClick={()=>vm.setShowTicket(false)}>X</button></div>
      <div className="p-5 space-y-3">
        <input value={vm.ticketForm.cliente} onChange={e=>vm.setTicketForm({...vm.ticketForm, cliente:e.target.value})} placeholder="Cliente" className="w-full border p-3 rounded text-sm"/>
        <input value={vm.ticketForm.asunto} onChange={e=>vm.setTicketForm({...vm.ticketForm, asunto:e.target.value})} placeholder="Asunto *" className="w-full border p-3 rounded text-sm"/>
        <textarea value={vm.ticketForm.desc} onChange={e=>vm.setTicketForm({...vm.ticketForm, desc:e.target.value})} placeholder="Descripción" className="w-full border p-3 rounded h-20 text-sm"/>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[11px] font-bold">Asignar a:</label><select value={vm.ticketForm.asignadoA} onChange={e=>vm.setTicketForm({...vm.ticketForm, asignadoA:e.target.value})} className="w-full border p-2 rounded bg-green-50 font-bold text-sm"><option value="">Seleccionar...</option>{data.users.filter(u=>u.rol!=="Cliente").map(u=><option key={u.id} value={u.nombre}>{u.nombre} ({u.rol})</option>)}</select></div>
          <div><label className="text-[11px] font-bold">Depto:</label><select value={vm.ticketForm.depto} onChange={e=>vm.setTicketForm({...vm.ticketForm, depto:e.target.value})} className="w-full border p-2 rounded text-sm">{data.depts.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
        </div>
        <div><label className="text-[11px] font-bold">Imagen / evidencia:</label><input type="file" accept="image/*" onChange={handleImage} className="w-full border p-2 rounded bg-yellow-50 text-[12px]"/>{preview && <img src={preview} className="mt-2 w-full h-32 object-cover rounded border"/>}</div>
        <div className="flex justify-end gap-2"><button onClick={()=>vm.setShowTicket(false)} className="border px-5 py-2 rounded text-sm">Cancelar</button><button onClick={vm.saveTicket} className="bg-[#3c8dbc] text-white px-7 py-2 rounded font-bold text-sm">Crear Ticket</button></div>
      </div>
    </div></div>
  )
}