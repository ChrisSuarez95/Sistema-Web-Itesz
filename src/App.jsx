import { useAppViewModel } from './viewmodels/useAppViewModel'
import { useAuthViewModel } from './viewmodels/useAuthViewModel'
import { useTicketsViewModel } from './viewmodels/useTicketsViewModel'
import { useUsersViewModel } from './viewmodels/useUsersViewModel'
import { useDeptViewModel } from './viewmodels/useDeptViewModel'
import Dashboard from './views/Dashboard'
import Tickets from './views/Tickets'
import Usuarios from './views/Usuarios'
import Departamentos from './views/Departamentos'
import Reportes from './views/Reportes'
import TicketModal from './views/Modals/TicketModal'
import UserModal from './views/Modals/UserModal'
import DeptModal from './views/Modals/DeptModal'

export default function App(){
  const { data, setData, view, setView } = useAppViewModel()
  const { user, login, setLogin, doLogin, doLogout } = useAuthViewModel(data)
  const ticketsVM = useTicketsViewModel(data, setData, user || {rol:"Cliente", nombre:""})
  const usersVM = useUsersViewModel(data, setData)
  const deptVM = useDeptViewModel(data, setData)

  if(!user){
    return (
      <div className="min-h-screen bg-[#2c3b41] flex items-center justify-center p-4">
        <div className="bg-white rounded w-full max-w-[400px] overflow-hidden"><div className="bg-[#3c8dbc] p-6 text-white text-center"><h1 className="font-bold text-xl">Sistema Web ITESZ - Login</h1><p className="text-[12px] mt-2">prueba123@gmail.com / chris123 (Admin)<br/>juan@test.com / 123456 (Técnico)<br/>maria@test.com / maria123 (Cliente)</p></div>
          <div className="p-6">
            <input value={login.email} onChange={e=>setLogin({...login, email:e.target.value})} className="w-full border p-3 rounded mb-3"/>
            <input type="password" value={login.password} onChange={e=>setLogin({...login, password:e.target.value})} className="w-full border p-3 rounded mb-3"/>
            <button onClick={doLogin} className="w-full bg-[#3c8dbc] text-white py-3 rounded font-bold">Entrar</button>
          </div>
        </div>
      </div>
    )
  }

  const menu = ["Dashboard","Tickets","Usuarios","Departamentos","Reportes"].filter(m=>{
    if(user.rol==="Cliente" && (m==="Usuarios" || m==="Departamentos")) return false
    return true
  })

  return (
    <div className="flex min-h-screen bg-[#ecf0f5] text-[13px]">
      <div className="w-[230px] bg-[#222d32] text-white flex flex-col">
        <div className="p-3 bg-[#367fa9] font-bold">Sistema Web ITESZ </div>
        <div className="p-4 flex gap-3 items-center border-b"><div className="w-9 h-9 bg-orange-400 rounded-full flex items-center justify-center font-bold">{user.nombre[0].toUpperCase()}</div><div><p className="font-bold">{user.nombre}</p><p className="text-[11px] text-green-400">● {user.rol}</p></div></div>
        {menu.map(m=><button key={m} onClick={()=>setView(m)} className={`text-left px-4 py-3 ${view===m?"bg-[#1e282c] border-l-4 border-[#3c8dbc]":"text-[#b8c7ce]"}`}>{m}</button>)}
        <div className="mt-auto p-3"><button onClick={doLogout} className="w-full bg-[#dd4b39] py-2 rounded">Cerrar Sesión</button></div>
      </div>
      <div className="flex-1">
        <div className="bg-[#3c8dbc] h-[45px] text-white flex items-center px-4 justify-between"><span className="bg-white text-[#3c8dbc] px-3 py-1 rounded font-bold">{view} </span><span>{user.email} - {user.rol}</span></div>
        <div className="p-4">
          {view==="Dashboard" && <Dashboard data={data} user={user} />}
          {view==="Tickets" && <Tickets vm={ticketsVM} data={data} user={user} />}
          {view==="Usuarios" && <Usuarios data={data} vm={usersVM} />}
          {view==="Departamentos" && <Departamentos data={data} vm={deptVM} />}
          {view==="Reportes" && <Reportes data={data} user={user} />}
        </div>
      </div>
      {usersVM.showUser && <UserModal vm={usersVM} />}
      {ticketsVM.showTicket && <TicketModal vm={ticketsVM} data={data} user={user} />}
      {deptVM.showDept && <DeptModal vm={deptVM} />}
    </div>
  )
}