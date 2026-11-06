export default function UserModal({ vm }){
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded w-full max-w-[400px] p-5 space-y-3">
      <div className="flex justify-between font-bold"><span>{vm.editUser?"Modificar":"Nuevo"} Usuario</span><button onClick={()=>vm.setShowUser(false)}>X</button></div>
      <input value={vm.userForm.nombre} onChange={e=>vm.setUserForm({...vm.userForm, nombre:e.target.value})} placeholder="Nombre" className="w-full border p-3 rounded"/>
      <input value={vm.userForm.email} onChange={e=>vm.setUserForm({...vm.userForm, email:e.target.value})} placeholder="Email" className="w-full border p-3 rounded"/>
      <input value={vm.userForm.password} onChange={e=>vm.setUserForm({...vm.userForm, password:e.target.value})} placeholder="Pass" className="w-full border p-3 rounded"/>
      <select value={vm.userForm.rol} onChange={e=>vm.setUserForm({...vm.userForm, rol:e.target.value})} className="w-full border p-3 rounded bg-yellow-50 font-bold"><option value="Admin">Admin - Todo</option><option value="Tecnico">Técnico - Asigna y cierra</option><option value="Cliente">Cliente - Solo crea y ve estado</option></select>
      <select value={vm.userForm.depto} onChange={e=>vm.setUserForm({...vm.userForm, depto:e.target.value})} className="w-full border p-3 rounded"><option>General</option><option>Soporte</option><option>TI</option><option>Ventas</option><option>RH</option></select>
      <button onClick={vm.saveUser} className="w-full bg-green-600 text-white py-2 rounded font-bold">Guardar</button>
    </div></div>
  )
}