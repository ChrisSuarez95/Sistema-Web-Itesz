export default function DeptModal({ vm }){
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded w-full max-w-[400px] p-5 space-y-3">
      <div className="flex justify-between font-bold"><span>{vm.editDeptIndex!==null?"Modificar":"Nuevo"} Depto</span><button onClick={()=>vm.setShowDept(false)}>X</button></div>
      <input value={vm.deptForm} onChange={e=>vm.setDeptForm(e.target.value)} placeholder="Nombre" className="w-full border p-3 rounded"/>
      <button onClick={vm.saveDept} className="w-full bg-yellow-600 text-white py-2 rounded font-bold">Guardar</button>
    </div></div>
  )
}