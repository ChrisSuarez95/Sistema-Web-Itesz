import { useState, useEffect } from 'react'

const API = 'http://localhost:3002'

const AZUL = '#1e40af'
const AZUL_CLARO = '#dbeafe'
const GRIS = '#f3f4f6'
const VERDE = '#16a34a'
const AMARILLO = '#eab308'
const ROJO = '#dc2626'

function App() {
  const [tickets, setTickets] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [vista, setVista] = useState('dashboard')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')

  const [formTicket, setFormTicket] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    estado: 'abierto',
    asignado_a: ''
  })

  const [formUsuario, setFormUsuario] = useState({
    nombre: '',
    email: '',
    rol: 'tecnico',
    password: ''
  })
  const [editandoUsuario, setEditandoUsuario] = useState(null)

  const cargarDatos = async () => {
    try {
      const resT = await fetch(`${API}/tickets`)
      const dataT = await resT.json()
      setTickets(Array.isArray(dataT) ? dataT : dataT.tickets || [])
    } catch (e) { console.log('Error tickets', e) }

    try {
      const resU = await fetch(`${API}/usuarios`)
      const dataU = await resU.json()
      setUsuarios(Array.isArray(dataU) ? dataU : dataU.usuarios || [])
    } catch (e) { console.log('Error usuarios', e) }
  }

  useEffect(() => { cargarDatos() }, [])

  // Solo técnicos para asignar
  const tecnicos = usuarios.filter(u => {
    const rol = (u.rol || u.tipo || u.role || '').toString().toLowerCase()
    return rol === 'tecnico' || rol === 'técnico' || rol === 'tecnico/a'
  })

  // Datos Dashboard
  const total = tickets.length
  const abiertos = tickets.filter(t => t.estado === 'abierto').length
  const enProceso = tickets.filter(t => t.estado === 'en_proceso' || t.estado === 'en proceso' || t.estado === 'proceso').length
  const cerrados = tickets.filter(t => t.estado === 'cerrado' || t.estado === 'resuelto').length
  const alta = tickets.filter(t => t.prioridad === 'alta').length

  const ticketsFiltrados = tickets.filter(t => {
    if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false
    if (filtroPrioridad !== 'todos' && t.prioridad !== filtroPrioridad) return false
    if (busqueda && !(t.titulo + ' ' + t.descripcion).toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

  const crearTicket = async (e) => {
    e.preventDefault()
    if (!formTicket.titulo) return setMensaje('Pon un título')
    try {
      await fetch(`${API}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formTicket)
      })
      setMensaje('Ticket creado ✅')
      setFormTicket({ titulo: '', descripcion: '', prioridad: 'media', estado: 'abierto', asignado_a: '' })
      cargarDatos()
    } catch { setMensaje('Error al crear ticket') }
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await fetch(`${API}/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      })
      cargarDatos()
    } catch {}
  }

  const asignarTecnico = async (id, tecnicoId) => {
    try {
      await fetch(`${API}/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asignado_a: tecnicoId })
      })
      setMensaje('Asignado solo a técnico ✅')
      cargarDatos()
    } catch {}
  }

  const eliminarTicket = async (id) => {
    if (!confirm('¿Eliminar ticket?')) return
    await fetch(`${API}/tickets/${id}`, { method: 'DELETE' })
    cargarDatos()
  }

  const crearUsuario = async (e) => {
    e.preventDefault()
    try {
      if (editandoUsuario) {
        await fetch(`${API}/usuarios/${editandoUsuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formUsuario)
        })
        setMensaje('Usuario actualizado ✅')
        setEditandoUsuario(null)
      } else {
        await fetch(`${API}/usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formUsuario)
        })
        setMensaje('Usuario creado ✅')
      }
      setFormUsuario({ nombre: '', email: '', rol: 'tecnico', password: '' })
      cargarDatos()
    } catch { setMensaje('Error con usuario') }
  }

  const getNombreTecnico = (id) => {
    const u = usuarios.find(x => String(x.id) === String(id))
    return u ? u.nombre : id || 'Sin asignar'
  }

  const estiloBoton = (activo) => ({
    padding: '10px 18px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    background: activo ? AZUL : '#fff',
    color: activo ? '#fff' : '#111',
    fontWeight: 'bold',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ddd'
  })

  return (
    <div style={{ fontFamily: 'Arial', background: GRIS, minHeight: '100vh', padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ color: AZUL }}>🎫 Sistema de Tickets</h1>
        <p>Gestión de soporte - Dashboard, Tickets y Usuarios</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <button style={estiloBoton(vista === 'dashboard')} onClick={() => setVista('dashboard')}>📊 Dashboard</button>
          <button style={estiloBoton(vista === 'tickets')} onClick={() => setVista('tickets')}>🎫 Tickets</button>
          <button style={estiloBoton(vista === 'usuarios')} onClick={() => setVista('usuarios')}>👥 Usuarios</button>
        </div>

        {mensaje && <div style={{ background: AZUL_CLARO, padding: 12, borderRadius: 8, marginBottom: 15 }}>{mensaje}</div>}

        {vista === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15, marginBottom: 20 }}>
              <div style={{ background: '#fff', padding: 20, borderRadius: 12, textAlign: 'center' }}><h3>Total</h3><h1 style={{ color: AZUL }}>{total}</h1></div>
              <div style={{ background: '#fff', padding: 20, borderRadius: 12, textAlign: 'center' }}><h3>Abiertos</h3><h1 style={{ color: ROJO }}>{abiertos}</h1></div>
              <div style={{ background: '#fff', padding: 20, borderRadius: 12, textAlign: 'center' }}><h3>En Proceso</h3><h1 style={{ color: AMARILLO }}>{enProceso}</h1></div>
              <div style={{ background: '#fff', padding: 20, borderRadius: 12, textAlign: 'center' }}><h3>Cerrados</h3><h1 style={{ color: VERDE }}>{cerrados}</h1></div>
              <div style={{ background: '#fff', padding: 20, borderRadius: 12, textAlign: 'center' }}><h3>Prioridad Alta</h3><h1>{alta}</h1></div>
            </div>
            <div style={{ background: '#fff', padding: 20, borderRadius: 12 }}>
              <h3>Últimos Tickets</h3>
              {tickets.slice(0, 5).map(t => (
                <div key={t.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span><b>{t.titulo}</b> - {t.estado} - {t.prioridad}</span>
                  <span>{getNombreTecnico(t.asignado_a)}</span>
                </div>
              ))}
              {tickets.length === 0 && <p>No hay tickets todavía</p>}
            </div>
          </div>
        )}

        {vista === 'tickets' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
            <div style={{ background: '#fff', padding: 20, borderRadius: 12, height: 'fit-content' }}>
              <h3>Crear Ticket</h3>
              <form onSubmit={crearTicket} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input placeholder="Título" value={formTicket.titulo} onChange={e => setFormTicket({ ...formTicket, titulo: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
                <textarea placeholder="Descripción" value={formTicket.descripcion} onChange={e => setFormTicket({ ...formTicket, descripcion: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
                <select value={formTicket.prioridad} onChange={e => setFormTicket({ ...formTicket, prioridad: e.target.value })} style={{ padding: 10 }}>
                  <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>
                </select>
                <label>Asignar solo a Técnicos:</label>
                <select value={formTicket.asignado_a} onChange={e => setFormTicket({ ...formTicket, asignado_a: e.target.value })} style={{ padding: 10 }}>
                  <option value="">-- Sin asignar --</option>
                  {tecnicos.map(u => <option key={u.id} value={u.id}>{u.nombre} - Técnico</option>)}
                </select>
                {tecnicos.length === 0 && <small style={{ color: ROJO }}>No hay técnicos registrados. Crea un usuario con rol técnico.</small>}
                <button style={{ background: AZUL, color: '#fff', padding: 12, border: 'none', borderRadius: 8, fontWeight: 'bold' }}>Crear Ticket</button>
              </form>
            </div>

            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 15, flexWrap: 'wrap' }}>
                <input placeholder="🔍 Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', flex: 1 }} />
                <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={{ padding: 10 }}><option value="todos">Todos los estados</option><option value="abierto">Abierto</option><option value="en_proceso">En Proceso</option><option value="cerrado">Cerrado</option></select>
                <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)} style={{ padding: 10 }}><option value="todos">Todas prioridades</option><option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option></select>
              </div>
              {ticketsFiltrados.map(t => (
                <div key={t.id} style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <b>{t.titulo}</b>
                    <span style={{ background: t.prioridad === 'alta' ? '#fee2e2' : '#fef9c3', padding: '4px 10px', borderRadius: 20 }}>{t.prioridad}</span>
                  </div>
                  <p>{t.descripcion}</p>
                  <p><small>Estado: {t.estado} | Asignado a: {getNombreTecnico(t.asignado_a)}</small></p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <select value={t.asignado_a || ''} onChange={e => asignarTecnico(t.id, e.target.value)} style={{ padding: 8 }}>
                      <option value="">Reasignar a técnico...</option>
                      {tecnicos.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                    </select>
                    <button onClick={() => cambiarEstado(t.id, 'en_proceso')} style={{ padding: '8px 12px', background: AMARILLO, border: 'none', borderRadius: 6 }}>En Proceso</button>
                    <button onClick={() => cambiarEstado(t.id, 'cerrado')} style={{ padding: '8px 12px', background: VERDE, color: '#fff', border: 'none', borderRadius: 6 }}>Cerrar</button>
                    <button onClick={() => eliminarTicket(t.id)} style={{ padding: '8px 12px', background: ROJO, color: '#fff', border: 'none', borderRadius: 6 }}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vista === 'usuarios' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
            <div style={{ background: '#fff', padding: 20, borderRadius: 12, height: 'fit-content' }}>
              <h3>{editandoUsuario ? 'Editar Usuario' : 'Crear Usuario'}</h3>
              <form onSubmit={crearUsuario} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input placeholder="Nombre" value={formUsuario.nombre} onChange={e => setFormUsuario({ ...formUsuario, nombre: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
                <input placeholder="Email" value={formUsuario.email} onChange={e => setFormUsuario({ ...formUsuario, email: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
                <select value={formUsuario.rol} onChange={e => setFormUsuario({ ...formUsuario, rol: e.target.value })} style={{ padding: 10 }}>
                  <option value="tecnico">Técnico</option><option value="admin">Admin</option><option value="usuario">Usuario</option>
                </select>
                <input placeholder="Password" type="password" value={formUsuario.password} onChange={e => setFormUsuario({ ...formUsuario, password: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
                <button style={{ background: AZUL, color: '#fff', padding: 12, border: 'none', borderRadius: 8, fontWeight: 'bold' }}>{editandoUsuario ? 'Guardar' : 'Crear Usuario'}</button>
              </form>
            </div>
            <div style={{ background: '#fff', padding: 20, borderRadius: 12 }}>
              <h3>Lista de Usuarios ({usuarios.length}) - Técnicos: {tecnicos.length}</h3>
              {usuarios.map(u => (
                <div key={u.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span><b>{u.nombre}</b> - {u.email} - <span style={{ background: AZUL_CLARO, padding: '2px 8px', borderRadius: 12 }}>{u.rol}</span></span>
                  <button onClick={() => { setFormUsuario({ nombre: u.nombre, email: u.email, rol: u.rol, password: '' }); setEditandoUsuario(u.id) }} style={{ padding: '6px 10px', background: AZUL, color: '#fff', border: 'none', borderRadius: 6 }}>Editar</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApperTop: `4px solid ${color}` }}><div style={{ fontSize: 12, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>{titulo}</div><div style={{ fontSize: 26, fontWeight: 900, color }}>{valor}</div></div> }
