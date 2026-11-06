export default function Departamentos({ data, vm }){
  return (
    <div className="bg-white rounded shadow border-t-4 border-[#f39c12] p-4">
      <div className="flex justify-between mb-4"><h2 className="font-bold">Departamentos ({data.depts.length})</h2><button onClick={vm.openNew} className="bg-[#f39c12] text-white px-4 py-1.5 rounded">+ Agregar</button></div>
      <div className="grid grid-cols-3 gap-3">{data.depts.map((d,i)=>(
        <div key={i} className="border p-3 rounded flex justify-between items-center"><span className="font-bold">{d}</span><span className="flex gap-2 text-[11px]"><button onClick={()=>vm.openEdit(i,d)} className="text-[#3c8dbc]">Modificar</button><button onClick={()=>vm.deleteDept(i)} className="bg-red-500 text-white px-2 py-1 rounded">X</button></span></div>
      ))}</div>
    </div>
  )
}