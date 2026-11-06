import { useState } from 'react'
export function useDeptViewModel(data, setData){
  const [showDept, setShowDept] = useState(false)
  const [deptForm, setDeptForm] = useState("")
  const [editDeptIndex, setEditDeptIndex] = useState(null)
  const openNew = () => { setDeptForm(""); setEditDeptIndex(null); setShowDept(true) }
  const openEdit = (i, name) => { setEditDeptIndex(i); setDeptForm(name); setShowDept(true) }
  const saveDept = () => {
    if(!deptForm.trim()) return alert("Falta nombre")
    if(editDeptIndex!==null){ const nd=[...data.depts]; nd[editDeptIndex]=deptForm; setData(p=>({...p, depts:nd})) }
    else setData(p=>({...p, depts:[deptForm, ...p.depts]}))
    setShowDept(false); setDeptForm(""); setEditDeptIndex(null)
  }
  const deleteDept = (i) => { if(confirm("¿Eliminar depto?")) setData(p=>({...p, depts:p.depts.filter((_,idx)=>idx!==i)})) }
  return { showDept, setShowDept, deptForm, setDeptForm, editDeptIndex, setEditDeptIndex, openNew, openEdit, saveDept, deleteDept }
}