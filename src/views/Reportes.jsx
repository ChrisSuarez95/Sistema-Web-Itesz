import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
export default function Reportes({data, user}){
  const tickets = user.rol==="Cliente" ? data.tickets.filter(t=>t.registradoPor===user.nombre) : data.tickets
  const expExcel = ()=>{
    const ws = XLSX.utils.json_to_sheet(tickets.map(t=>({Numero:t.num, Fecha:t.fecha, RegistradoPor:t.registradoPor, AsignadoPor:t.asignadoPor, AsignadoA:t.asignadoA, Asunto:t.asunto, Estado:t.estado, FinalizadoPor:t.finalizadoPor})))
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Tickets"); XLSX.writeFile(wb, "tickets.xlsx")
  }
  const expPDF = ()=>{
    const doc = new jsPDF(); doc.text("Reporte Tickets ITESZ - MVVM", 10, 15); let y=25
    tickets.forEach(t=>{ doc.text(`${t.num} | ${t.registradoPor} | ${t.asignadoPor} | ${t.asignadoA} | ${t.asunto} | ${t.estado}`, 10, y); y+=8 })
    doc.save("tickets.pdf")
  }
  return (
    <div className="bg-white rounded shadow p-6"><h2 className="font-bold mb-4">Reportes - {user.rol==="Cliente" ? "Mis Tickets" : "Todos"}</h2><button onClick={expExcel} className="bg-green-600 text-white px-4 py-2 rounded mr-2">Excel</button><button onClick={expPDF} className="bg-red-600 text-white px-4 py-2 rounded">PDF</button></div>
  )
}