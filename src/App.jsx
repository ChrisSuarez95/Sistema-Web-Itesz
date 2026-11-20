import { useState, useEffect } from 'react'
const API = 'http://localhost:3002/api'
const AZUL = '#0B4F9C'
const AZUL_CLARO = '#0EA5E9'
const AZUL_OSCURO = '#082F5C'
export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [email, setEmail] = useState('chris@test.com')
  const [pass, setPass] = useState('123')
  const [error, setError] = useState('')
  const [tickets, setTickets] = useState([])
  const [users, setUsers] = useState([])
  const [deptos, setDeptos] = useState(['Soporte', 'Redes', 'Sistemas', 'General'])
  const [vista, setVista] = useState('tickets')
  const [filtro, setFiltro] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ asunto: '', desc: '', cliente: '', depto: 'Soporte', estado: 'Abierto', asignadoA: '', imagen: '' })
  const [editando, setEditando] = useState(null)
  const [fotoPreview, setFotoPreview] = useState('')

  // ===== USUARIOS =====
  const [showUserForm, setShowUserForm] = useState(false)
  const [userForm, setUserForm] = useState({ nombre: '', email: '', pass: '', rol: 'Cliente', depto: 'General' })
  const [editandoUser, setEditandoUser] = useState(null)

  // ===== DEPTOS =====
  const [nuevoDepto, setNuevoDepto] = useState('')
  const [editandoDepto, setEditandoDepto] = useState(null)

  const cargar = async () => {
    const t = await fetch(`${API}/tickets`).then(r => r.json()).catch(() => [])
    const u = await fetch(`${API}/users`).then(r => r.json()).catch(() => [])
    const d = await fetch(`${API}/deptos`).then(r => r.json()).catch(() => [])
    setTickets(Array.isArray(t) ? t : [])
    setUsers(Array.isArray(u) ? u : [])
    if (Array.isArray(d) && d.length) setDeptos(d)
  }
  useEffect(() => { if (user) cargar() }, [user])

  const login = async (e) => {
    e.preventDefault(); setError('')
    try {
      const res = await fetch(`${API}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), pass: pass.trim() }) })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Incorrecto')
      setUser(data); localStorage.setItem('user', JSON.stringify(data))
    } catch { setError('No conecta con backend. ¿Está corriendo node index.js en el puerto 3002?') }
  }
  const logout = () => { setUser(null); localStorage.removeItem('user') }

  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return alert('La foto debe pesar menos de 2MB')
    const reader = new FileReader()
    reader.onload = () => { setForm(prev => ({ ...prev, imagen: reader.result })); setFotoPreview(reader.result) }
    reader.readAsDataURL(file)
  }

  const guardarTicket = async (e) => {
    e.preventDefault()
    if (form.asunto.trim().length < 5) return alert('El asunto debe tener mínimo 5 caracteres')
    const body = { ...form, cliente: form.cliente || user.nombre, registradoPor: user.nombre, fecha: new Date().toLocaleString('es-MX') }
    const url = editando ? `${API}/tickets/${editando.id}` : `${API}/tickets`
    const res = await fetch(url, { method: editando ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (!res.ok) return alert(data.message)
    setShowForm(false); setEditando(null); setFotoPreview(''); setForm({ asunto: '', desc: '', cliente: '', depto: 'Soporte', estado: 'Abierto', asignadoA: '', imagen: '' }); cargar()
  }
  const borrarTicket = async (id) => { if (!confirm('¿Borrar ticket?')) return; await fetch(`${API}/tickets/${id}`, { method: 'DELETE' }); cargar() }
  const cambiarEstado = async (t, nuevoEstado) => { await fetch(`${API}/tickets/${t.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...t, estado: nuevoEstado, finalizadoPor: nuevoEstado === 'Finalizado' ? user.nombre : t.finalizadoPor, fechaFin: nuevoEstado === 'Finalizado' ? new Date().toLocaleString('es-MX') : t.fechaFin }) }); cargar() }

  // ===== CRUD USUARIOS - SOLO ADMIN =====
  const guardarUsuario = async (e) => {
    e.preventDefault()
    if (!userForm.nombre.trim() || !userForm.email.trim() || !userForm.pass.trim()) return alert('Nombre, email y contraseña obligatorios')
    const url = editandoUser ? `${API}/users/${editandoUser.id}` : `${API}/users`
    const res = await fetch(url, { method: editandoUser ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userForm) })
    const data = await res.json()
    if (!res.ok) return alert(data.message || 'Error al guardar usuario')
    setShowUserForm(false); setEditandoUser(null); setUserForm({ nombre: '', email: '', pass: '', rol: 'Cliente', depto: 'General' }); cargar()
  }
  const borrarUsuario = async (id) => {
    if (id === user.id) return alert('No puedes borrar tu propio usuario')
    if (!confirm('¿Borrar este usuario?')) return
    await fetch(`${API}/users/${id}`, { method: 'DELETE' }); cargar()
  }

  // ===== CRUD DEPTOS - SOLO ADMIN =====
  const agregarDepto = async (e) => {
    e.preventDefault()
    if (!nuevoDepto.trim()) return alert('Escribe el nombre del departamento')
    if (editandoDepto) {
      const res = await fetch(`${API}/deptos/${encodeURIComponent(editandoDepto)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: nuevoDepto.trim() }) })
      const data = await res.json()
      if (!res.ok) return alert(data.message || 'Error al actualizar departamento')
      setEditandoDepto(null)
    } else {
      const res = await fetch(`${API}/deptos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: nuevoDepto.trim() }) })
      const data = await res.json()
      if (!res.ok) return alert(data.message || 'Error, ¿ya existe ese depto?')
    }
    setNuevoDepto(''); cargar()
  }
  const borrarDepto = async (nombre) => {
    if (!confirm(`¿Borrar departamento ${nombre}?`)) return
    await fetch(`${API}/deptos/${encodeURIComponent(nombre)}`, { method: 'DELETE' }); cargar()
  }
  const iniciarEditarDepto = (nombre) => {
    setEditandoDepto(nombre)
    setNuevoDepto(nombre)
  }

  // ===== REPORTE PDF =====
  const generarPDF = () => {
    const lista = ticketsFiltrados
    if (lista.length === 0) return alert('No hay tickets para el reporte')
    const fechaHoy = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const abiertos = tickets.filter(t => t.estado === 'Abierto').length
    const proceso = tickets.filter(t => t.estado === 'En Proceso').length
    const finalizados = tickets.filter(t => t.estado === 'Finalizado').length
    const filas = lista.map(t => `<tr><td><b>${t.num}</b></td><td>${t.asunto}</td><td>${t.desc || ''}</td><td>${t.cliente}</td><td>${t.depto}</td><td><span style="padding:3px 8px;border-radius:10px;font-size:11px;font-weight:bold;background:${t.estado === 'Abierto' ? '#FEE2E2;color:#DC2626' : t.estado === 'En Proceso' ? '#FEF3C7;color:#D97706' : '#DCFCE7;color:#16A34A'}">${t.estado}</span></td><td>${t.asignadoA || 'Sin asignar'}</td><td>${t.fecha}</td><td>${t.imagen ? `<img src="${t.imagen}" style="width:80px;height:60px;object-fit:cover;border-radius:6px;" />` : 'Sin foto'}</td></tr>`).join('')
    const html = `<html><head><title>Reporte HelpDesk ITESZ</title><style>body{font-family:Arial,sans-serif;padding:20px;color:#0F172A}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid #0B4F9C;padding-bottom:12px;margin-bottom:16px}.header h1{margin:0;color:#0B4F9C;font-size:24px}.header p{margin:2px 0;color:#64748B;font-size:12px}.stats{display:flex;gap:12px;margin-bottom:16px}.stat{flex:1;border:1px solid #DBEAFE;border-radius:10px;padding:12px;text-align:center}.stat b{font-size:22px;display:block}.stat span{font-size:11px;color:#64748B;text-transform:uppercase}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#082F5C;color:white;padding:8px;text-align:left}td{padding:8px;border-bottom:1px solid #E2E8F0;vertical-align:top}.footer{margin-top:20px;text-align:center;font-size:11px;color:#94A3B8;border-top:1px solid #E2E8F0;padding-top:10px}@media print{button{display:none}}</style></head><body><div class="header"><div><h1>HelpDesk ITESZ</h1><p>Instituto Tecnológico de Estudios Superiores de Zamora</p><p>Reporte de Tickets • ${fechaHoy} • Filtro: ${filtro}</p><p>Generado por: ${user.nombre} (${user.rol})</p></div><div style="text-align:right"><div style="font-size:28px;font-weight:900;color:#0B4F9C">ITESZ</div><div style="font-size:10px;color:#64748B">ZAMORA • MICHOACÁN</div></div></div><div class="stats"><div class="stat"><b>${tickets.length}</b><span>Total</span></div><div class="stat"><b style="color:#DC2626">${abiertos}</b><span>Abiertos</span></div><div class="stat"><b style="color:#D97706">${proceso}</b><span>En Proceso</span></div><div class="stat"><b style="color:#16A34A">${finalizados}</b><span>Finalizados</span></div></div><table><thead><tr><th>#</th><th>Asunto</th><th>Descripción</th><th>Cliente</th><th>Depto</th><th>Estado</th><th>Asignado</th><th>Fecha</th><th>Foto</th></tr></thead><tbody>${filas}</tbody></table><div class="footer">© 2026 HelpDesk ITESZ • Total mostrados: ${lista.length} tickets</div><div style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#0B4F9C;color:white;border:none;padding:12px 24px;border-radius:10px;font-weight:bold;cursor:pointer;font-size:14px">🖨️ Imprimir / Guardar como PDF</button></div></body></html>`
    const win = window.open('', '_blank'); win.document.write(html); win.document.close()
  }

  const ticketsFiltrados = tickets.filter(t => (filtro === 'Todos' || t.estado === filtro) && (t.asunto?.toLowerCase().includes(busqueda.toLowerCase()) || t.num?.includes(busqueda) || t.cliente?.toLowerCase().includes(busqueda.toLowerCase())))
  const esAdmin = ['admin', 'administrador'].includes(user?.rol?.toLowerCase())
  const tecnicos = users.filter(u => ['tecnico', 'técnico'].includes(u.rol?.toLowerCase()))

  // ===== EXPORTAR A EXCEL (CSV) - DASHBOARD =====
  const exportarExcel = () => {
    if (ticketsFiltrados.length === 0) return alert('No hay tickets para exportar')
    const encabezados = ['#', 'Asunto', 'Descripción', 'Cliente', 'Depto', 'Estado', 'Asignado', 'Fecha', 'Registrado Por']
    const filas = ticketsFiltrados.map(t => [t.num, `"${(t.asunto||'').replace(/"/g, '""')}"`, `"${(t.desc||'').replace(/"/g, '""')}"`, t.cliente, t.depto, t.estado, t.asignadoA || 'Sin asignar', t.fecha, t.registradoPor || ''])
    const csv = [encabezados.join(','), ...filas.map(f => f.join(','))].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Reporte_Tickets_ITESZ_${new Date().toLocaleDateString('es-MX').replaceAll('/', '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${AZUL_OSCURO} 0%, ${AZUL} 50%, ${AZUL_CLARO} 100%)`, padding: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: 'white', width: '100%', maxWidth: 420, borderRadius: 20, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
        <div style={{ background: AZUL_OSCURO, padding: '28px 24px', textAlign: 'center', color: 'white' }}>
          <img src="/logo.png" alt="ITESZ Zamora" style={{ width: 130, height: 'auto', background: 'white', borderRadius: 16, padding: 8, margin: '0 auto 12px', display: 'block', objectFit: 'contain' }} />
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>HelpDesk <span style={{ color: '#38BDF8' }}>ITESZ</span></h1>
          <p style={{ margin: '6px 0 0', opacity: 0.85, fontSize: 13 }}>Instituto Tecnológico de Estudios Superiores de Zamora<br />Sistema de Gestión de Tickets</p>
        </div>
        <form onSubmit={login} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Correo Institucional</label><input value={email} onChange={e => setEmail(e.target.value)} style={input} placeholder="chris@test.com" /></div>
          <div><label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Contraseña</label><input type="password" value={pass} onChange={e => setPass(e.target.value)} style={input} placeholder="••••••" /></div>
          {error && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: 10, borderRadius: 8, fontSize: 13 }}>{error}</div>}
          <button style={{ background: AZUL, color: 'white', border: 'none', padding: 13, borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>Iniciar Sesión →</button>
          <div style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', padding: 12, borderRadius: 10, fontSize: 12, color: '#1E40AF' }}><b>Cuentas de prueba:</b><br />Admin: chris@test.com / 123<br />Técnico: juan@test.com / 123<br />Cliente: ana@test.com / 123</div>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', margin: 0 }}>© 2026 HelpDesk ITESZ - Zamora, Michoacán</p>
        </form>
      </div>
    </div>
  )
  const abiertos = tickets.filter(t => t.estado === 'Abierto').length
  const proceso = tickets.filter(t => t.estado === 'En Proceso').length
  const finalizados = tickets.filter(t => t.estado === 'Finalizado').length
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: 240, background: AZUL_OSCURO, color: 'white', padding: 18, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <img src="/logo.png" alt="ITESZ" style={{ width: 52, height: 52, background: 'white', borderRadius: 10, padding: 4, objectFit: 'contain' }} />
          <div><div style={{ fontWeight: 900, fontSize: 16, lineHeight: 1 }}>HelpDesk</div><div style={{ color: '#38BDF8', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>ITESZ</div><div style={{ fontSize: 10, opacity: 0.6 }}>ZAMORA • MICHOACÁN</div></div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{user.nombre}</div>
          <div style={{ fontSize: 12, color: '#93C5FD' }}>{user.rol} • {user.depto}</div>
          <div style={{ fontSize: 11, opacity: 0.6 }}>{user.email}</div>
          <div style={{ fontSize: 11, marginTop: 6, background: esAdmin ? '#16A34A' : '#F59E0B', display: 'inline-block', padding: '3px 8px', borderRadius: 20, fontWeight: 800 }}>{esAdmin ? '✅ Puedes gestionar usuarios y deptos' : '👁️ Solo puedes ver usuarios y deptos'}</div>
        </div>
        <button onClick={() => setVista('tickets')} style={{ textAlign: 'left', background: vista === 'tickets' ? AZUL : 'transparent', color: 'white', border: 'none', padding: '11px 12px', borderRadius: 10, cursor: 'pointer', marginBottom: 6, fontWeight: vista === 'tickets' ? 800 : 500 }}>🎫 Tickets</button>
        <button onClick={() => setVista('usuarios')} style={{ textAlign: 'left', background: vista === 'usuarios' ? AZUL : 'transparent', color: 'white', border: 'none', padding: '11px 12px', borderRadius: 10, cursor: 'pointer', marginBottom: 6, fontWeight: vista === 'usuarios' ? 800 : 500 }}>👥 Usuarios {esAdmin ? '' : '🔒'}</button>
        <button onClick={() => setVista('deptos')} style={{ textAlign: 'left', background: vista === 'deptos' ? AZUL : 'transparent', color: 'white', border: 'none', padding: '11px 12px', borderRadius: 10, cursor: 'pointer', marginBottom: 6, fontWeight: vista === 'deptos' ? 800 : 500 }}>🏢 Departamentos {esAdmin ? '' : '🔒'}</button>
        <button onClick={() => setVista('dashboard')} style={{ textAlign: 'left', background: vista === 'dashboard' ? AZUL : 'transparent', color: 'white', border: 'none', padding: '11px 12px', borderRadius: 10, cursor: 'pointer', marginBottom: 6, fontWeight: vista === 'dashboard' ? 800 : 500 }}>📊 Dashboard</button>
        <button onClick={generarPDF} style={{ background: '#16A34A', color: 'white', border: 'none', padding: 11, borderRadius: 10, cursor: 'pointer', fontWeight: 800, marginTop: 12 }}>📄 Reporte PDF</button>
        <button onClick={logout} style={{ marginTop: 'auto', background: '#DC2626', color: 'white', border: 'none', padding: 11, borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Cerrar Sesión</button>
      </div>
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div><h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#0F172A' }}>{vista === 'tickets' ? 'Panel de Tickets' : vista === 'usuarios' ? 'Gestión de Usuarios' : vista === 'deptos' ? 'Departamentos ITESZ' : 'Dashboard - Reportes'}</h2><p style={{ margin: '4px 0 0', color: '#64748B', fontSize: 13 }}>Bienvenido de nuevo, {user.nombre} • {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
          <div style={{ display: 'flex', gap: 10 }}>
            {vista === 'tickets' && <button onClick={generarPDF} style={{ background: '#16A34A', color: 'white', border: 'none', padding: '11px 16px', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>📄 Descargar PDF</button>}
            {vista === 'tickets' && <button onClick={() => { setShowForm(true); setEditando(null); setFotoPreview(''); setForm({ asunto: '', desc: '', cliente: '', depto: 'Soporte', estado: 'Abierto', asignadoA: '', imagen: '' }) }} style={{ background: AZUL, color: 'white', border: 'none', padding: '11px 18px', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>+ Nuevo Ticket</button>}
            {vista === 'usuarios' && esAdmin && <button onClick={() => { setShowUserForm(true); setEditandoUser(null); setUserForm({ nombre: '', email: '', pass: '', rol: 'Cliente', depto: 'General' }) }} style={{ background: AZUL, color: 'white', border: 'none', padding: '11px 18px', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>+ Nuevo Usuario</button>}
          </div>
        </div>

        {vista === 'tickets' && <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
            <Card titulo="Total" valor={tickets.length} color={AZUL} />
            <Card titulo="Abiertos" valor={abiertos} color="#DC2626" />
            <Card titulo="En Proceso" valor={proceso} color="#F59E0B" />
            <Card titulo="Finalizados" valor={finalizados} color="#16A34A" />
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="🔍 Buscar por #ticket, asunto o cliente..." style={{ ...input, margin: 0, flex: 1 }} />
            {['Todos', 'Abierto', 'En Proceso', 'Finalizado'].map(f => <button key={f} onClick={() => setFiltro(f)} style={{ padding: '8px 14px', borderRadius: 20, border: '1px solid #CBD5E1', background: filtro === f ? AZUL : 'white', color: filtro === f ? 'white' : '#334155', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>{f}</button>)}
          </div>
          {showForm && <form onSubmit={guardarTicket} style={{ background: 'white', padding: 18, borderRadius: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10, border: `2px solid ${AZUL}` }}>
            <b style={{ color: AZUL }}>{editando ? `Editar ${editando.num}` : 'Nuevo Ticket - HelpDesk ITESZ'}</b>
            <input value={form.asunto} onChange={e => setForm({ ...form, asunto: e.target.value })} placeholder="Asunto (mínimo 5 caracteres) Ej: No enciende PC del Lab 3" style={input} />
            <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Descripción detallada..." style={{ ...input, minHeight: 70 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} placeholder="Cliente / Alumno / Docente" style={{ ...input, flex: 1 }} />
              <select value={form.depto} onChange={e => setForm({ ...form, depto: e.target.value })} style={{ ...input, flex: 1 }}>{deptos.map(d => <option key={d}>{d}</option>)}</select>
              <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} style={{ ...input, flex: 1 }}><option>Abierto</option><option>En Proceso</option><option>Finalizado</option></select>
              {/* ASIGNAR SOLO A TECNICOS - CAMBIO NUEVO */}
              <select value={form.asignadoA} onChange={e => setForm({ ...form, asignadoA: e.target.value })} style={{ ...input, flex: 1 }}>
                <option value="">Asignado a - Sin asignar</option>
                {tecnicos.map(u => (<option key={u.id} value={u.nombre}>{u.nombre} • {u.depto}</option>))}
                {tecnicos.length === 0 && <option disabled>No hay técnicos registrados</option>}
              </select>
            </div>
            <div style={{ border: '2px dashed #CBD5E1', borderRadius: 12, padding: 14, textAlign: 'center', background: '#F8FAFC' }}>
              <label style={{ cursor: 'pointer', fontWeight: 800, color: AZUL }}>📷 Subir foto del problema (opcional)<br /><span style={{ fontWeight: 400, fontSize: 12, color: '#64748B' }}>Toca aquí para elegir foto. Máx 2MB</span><input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} /></label>
              {fotoPreview && <div style={{ marginTop: 10 }}><img src={fotoPreview} alt="preview" style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 10, border: '2px solid #DBEAFE' }} /><br /><button type="button" onClick={() => { setFotoPreview(''); setForm(prev => ({ ...prev, imagen: '' })) }} style={{ marginTop: 6, background: '#FEE2E2', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', color: '#DC2626', fontWeight: 700 }}>❌ Quitar foto</button></div>}
            </div>
            <div style={{ display: 'flex', gap: 10 }}><button style={{ background: AZUL, color: 'white', border: 'none', padding: 11, borderRadius: 8, fontWeight: 800, cursor: 'pointer', flex: 1 }}>{editando ? 'Guardar Cambios' : 'Crear Ticket'}</button><button type="button" onClick={() => setShowForm(false)} style={{ background: '#E2E8F0', border: 'none', padding: 11, borderRadius: 8, cursor: 'pointer' }}>Cancelar</button></div>
          </form>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ticketsFiltrados.length === 0 && <div style={{ background: 'white', padding: 30, textAlign: 'center', borderRadius: 14, color: '#94A3B8' }}>No hay tickets. ¡Crea el primero!</div>}
            {ticketsFiltrados.map(t => (
              <div key={t.id} style={{ background: 'white', padding: 16, borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, borderLeft: `5px solid ${t.estado === 'Abierto' ? '#DC2626' : t.estado === 'En Proceso' ? '#F59E0B' : '#16A34A'}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><b style={{ color: AZUL }}>{t.num}</b><span style={{ background: t.estado === 'Abierto' ? '#FEF2F2' : t.estado === 'En Proceso' ? '#FFFBEB' : '#F0FDF4', color: t.estado === 'Abierto' ? '#DC2626' : t.estado === 'En Proceso' ? '#D97706' : '#16A34A', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{t.estado}</span><span style={{ background: '#EFF6FF', color: AZUL, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{t.depto}</span></div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginTop: 5 }}>{t.asunto}</div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>{t.desc} • 👤 {t.cliente} • 📅 {t.fecha} • Asignado: {t.asignadoA || 'Sin asignar'}</div>
                  {t.imagen && <a href={t.imagen} target="_blank" rel="noreferrer"><img src={t.imagen} alt="evidencia" style={{ width: 160, height: 110, objectFit: 'cover', borderRadius: 10, marginTop: 10, border: '1px solid #E2E8F0', cursor: 'pointer' }} /></a>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {t.estado !== 'Finalizado' && <button onClick={() => cambiarEstado(t, t.estado === 'Abierto' ? 'En Proceso' : 'Finalizado')} style={btnSmall}>{t.estado === 'Abierto' ? '▶ Iniciar' : '✅ Finalizar'}</button>}
                  <button onClick={() => { setEditando(t); setFotoPreview(t.imagen || ''); setForm({ asunto: t.asunto, desc: t.desc, cliente: t.cliente, depto: t.depto, estado: t.estado, asignadoA: t.asignadoA, imagen: t.imagen || '' }); setShowForm(true) }} style={{ ...btnSmall, background: '#F59E0B' }}>✏️</button>
                  <button onClick={() => borrarTicket(t.id)} style={{ ...btnSmall, background: '#DC2626' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* ===== VISTA USUARIOS ===== */}
        {vista === 'usuarios' && <>
          {!esAdmin && <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: 12, borderRadius: 10, marginBottom: 14, fontSize: 13, color: '#92400E' }}>🔒 Estás como <b>{user.rol}</b>, solo puedes ver usuarios. Entra como Admin (<b>chris@test.com / 123</b>) para agregar, editar y eliminar.</div>}
          {showUserForm && esAdmin && <form onSubmit={guardarUsuario} style={{ background: 'white', padding: 18, borderRadius: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10, border: `2px solid ${AZUL}` }}>
            <b style={{ color: AZUL }}>{editandoUser ? `Editar usuario ${editandoUser.nombre}` : 'Nuevo Usuario - HelpDesk ITESZ'}</b>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={userForm.nombre} onChange={e => setUserForm({ ...userForm, nombre: e.target.value })} placeholder="Nombre completo" style={{ ...input, flex: 1 }} />
              <input value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} placeholder="Correo" style={{ ...input, flex: 1 }} />
              <input value={userForm.pass} onChange={e => setUserForm({ ...userForm, pass: e.target.value })} placeholder="Contraseña" style={{ ...input, flex: 1 }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <select value={userForm.rol} onChange={e => setUserForm({ ...userForm, rol: e.target.value })} style={{ ...input, flex: 1 }}><option>Admin</option><option>Técnico</option><option>Cliente</option></select>
              <select value={userForm.depto} onChange={e => setUserForm({ ...userForm, depto: e.target.value })} style={{ ...input, flex: 1 }}>{deptos.map(d => <option key={d}>{d}</option>)}<option>General</option></select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}><button style={{ background: AZUL, color: 'white', border: 'none', padding: 11, borderRadius: 8, fontWeight: 800, cursor: 'pointer', flex: 1 }}>{editandoUser ? 'Guardar Cambios' : 'Crear Usuario'}</button><button type="button" onClick={() => setShowUserForm(false)} style={{ background: '#E2E8F0', border: 'none', padding: 11, borderRadius: 8, cursor: 'pointer' }}>Cancelar</button></div>
          </form>}
          <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden' }}>
            {users.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>No hay usuarios</div>}
            {users.map(u => <div key={u.id} style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
              <div><b>{u.nombre} {u.id === user.id && '(Tú)'}</b><div style={{ fontSize: 12, color: '#64748B' }}>{u.email} • {u.rol} • {u.depto}</div></div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ background: u.rol === 'Admin' ? '#DBEAFE' : u.rol === 'Técnico' ? '#FEF3C7' : '#DCFCE7', color: '#1E3A8A', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{u.rol}</span>
                {esAdmin && <>
                  <button onClick={() => { setEditandoUser(u); setUserForm({ nombre: u.nombre, email: u.email, pass: u.pass, rol: u.rol, depto: u.depto }); setShowUserForm(true) }} style={{ ...btnSmall, background: '#F59E0B' }}>✏️ Editar</button>
                  <button onClick={() => borrarUsuario(u.id)} style={{ ...btnSmall, background: '#DC2626' }}>🗑️ Borrar</button>
                </>}
              </div>
            </div>)}
          </div>
        </>}

        {/* ===== VISTA DEPTOS - CON ACTUALIZAR SOLO ADMIN ===== */}
        {vista === 'deptos' && <>
          {!esAdmin && <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: 12, borderRadius: 10, marginBottom: 14, fontSize: 13, color: '#92400E' }}>🔒 Estás como <b>{user.rol}</b>, solo puedes ver departamentos. Entra como Admin para agregar, actualizar y eliminar.</div>}
          {esAdmin && <form onSubmit={agregarDepto} style={{ background: 'white', padding: 16, borderRadius: 14, marginBottom: 16, display: 'flex', gap: 10, border: `2px solid ${AZUL}` }}>
            <input value={nuevoDepto} onChange={e => setNuevoDepto(e.target.value)} placeholder={editandoDepto ? `Editando: ${editandoDepto} - escribe el nuevo nombre` : "Nuevo departamento Ej: Laboratorios, Biblioteca..."} style={{ ...input, flex: 1, margin: 0 }} />
            <button style={{ background: editandoDepto ? '#F59E0B' : AZUL, color: 'white', border: 'none', padding: '11px 18px', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>{editandoDepto ? '✏️ Actualizar Depto' : '+ Agregar Depto'}</button>
            {editandoDepto && <button type="button" onClick={() => { setEditandoDepto(null); setNuevoDepto('') }} style={{ background: '#E2E8F0', border: 'none', padding: '11px 14px', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>Cancelar</button>}
          </form>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {deptos.map(d => <div key={d} style={{ background: 'white', padding: '14px 16px', borderRadius: 12, fontWeight: 800, color: AZUL, border: `1px solid #DBEAFE`, display: 'flex', alignItems: 'center', gap: 10 }}>🏢 {d} {esAdmin && <>
              <button onClick={() => iniciarEditarDepto(d)} style={{ background: '#FEF3C7', color: '#D97706', border: 'none', padding: '5px 9px', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}>✏️</button>
              <button onClick={() => borrarDepto(d)} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '5px 9px', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}>🗑️</button>
            </>}</div>)}
          </div>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 12 }}>Total departamentos: {deptos.length} • Los departamentos que agregues aquí aparecen automáticamente en el formulario de tickets.</p>
        </>}

        {/* ===== VISTA DASHBOARD ===== */}
        {vista === 'dashboard' && <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="🔍 Buscar por #ticket, asunto o cliente..." style={{ ...input, margin: 0, flex: 1, minWidth: 200 }} />
            {['Todos', 'Abierto', 'En Proceso', 'Finalizado'].map(f => <button key={f} onClick={() => setFiltro(f)} style={{ padding: '8px 14px', borderRadius: 20, border: '1px solid #CBD5E1', background: filtro === f ? AZUL : 'white', color: filtro === f ? 'white' : '#334155', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>{f}</button>)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 16 }}>
            <Card titulo="Total Tickets" valor={ticketsFiltrados.length} color={AZUL} />
            <Card titulo="Abiertos" valor={ticketsFiltrados.filter(t => t.estado === 'Abierto').length} color="#DC2626" />
            <Card titulo="En Proceso" valor={ticketsFiltrados.filter(t => t.estado === 'En Proceso').length} color="#F59E0B" />
            <Card titulo="Finalizados" valor={ticketsFiltrados.filter(t => t.estado === 'Finalizado').length} color="#16A34A" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div style={{ background: 'white', padding: 16, borderRadius: 14 }}>
              <b>📊 Tickets por Estado</b>
              {['Abierto', 'En Proceso', 'Finalizado'].map(est => {
                const cant = ticketsFiltrados.filter(t => t.estado === est).length
                const pct = ticketsFiltrados.length ? Math.round(cant / ticketsFiltrados.length * 100) : 0
                const color = est === 'Abierto' ? '#DC2626' : est === 'En Proceso' ? '#F59E0B' : '#16A34A'
                return <div key={est} style={{ marginTop: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{est}</span><b>{cant} ({pct}%)</b></div><div style={{ background: '#F1F5F9', height: 10, borderRadius: 20, marginTop: 4 }}><div style={{ width: `${pct}%`, background: color, height: 10, borderRadius: 20 }} /></div></div>
              })}
            </div>
            <div style={{ background: 'white', padding: 16, borderRadius: 14 }}>
              <b>🏢 Tickets por Departamento</b>
              {deptos.map(d => {
                const cant = ticketsFiltrados.filter(t => t.depto === d).length
                const pct = ticketsFiltrados.length ? Math.round(cant / ticketsFiltrados.length * 100) : 0
                return <div key={d} style={{ marginTop: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{d}</span><b>{cant} ({pct}%)</b></div><div style={{ background: '#F1F5F9', height: 10, borderRadius: 20, marginTop: 4 }}><div style={{ width: `${pct}%`, background: AZUL, height: 10, borderRadius: 20 }} /></div></div>
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={generarPDF} style={{ background: '#DC2626', color: 'white', border: 'none', padding: '11px 18px', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>📄 Exportar a PDF</button>
            <button onClick={exportarExcel} style={{ background: '#16A34A', color: 'white', border: 'none', padding: '11px 18px', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>📗 Exportar a Excel</button>
            <span style={{ alignSelf: 'center', fontSize: 13, color: '#64748B' }}>Mostrando {ticketsFiltrados.length} tickets • Filtro: {filtro}</span>
          </div>

          <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: AZUL_OSCURO, color: 'white', textAlign: 'left' }}><th style={{ padding: 10 }}>#</th><th style={{ padding: 10 }}>Asunto</th><th style={{ padding: 10 }}>Cliente</th><th style={{ padding: 10 }}>Depto</th><th style={{ padding: 10 }}>Estado</th><th style={{ padding: 10 }}>Fecha</th></tr></thead>
              <tbody>
                {ticketsFiltrados.map(t => <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={{ padding: 10 }}><b style={{ color: AZUL }}>{t.num}</b></td><td style={{ padding: 10 }}>{t.asunto}</td><td style={{ padding: 10 }}>{t.cliente}</td><td style={{ padding: 10 }}>{t.depto}</td><td style={{ padding: 10 }}>{t.estado}</td><td style={{ padding: 10 }}>{t.fecha}</td></tr>)}
                {ticketsFiltrados.length === 0 && <tr><td colSpan="6" style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>No hay tickets con ese filtro</td></tr>}
              </tbody>
            </table>
          </div>
        </>}
      </div>
    </div>
  )
}
const input = { width: '100%', padding: '11px 12px', borderRadius: 9, border: '1px solid #CBD5E1', fontSize: 14, boxSizing: 'border-box', outline: 'none' }
const btnSmall = { background: '#0B4F9C', color: 'white', border: 'none', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 12 }
function Card({ titulo, valor, color }) { return <div style={{ background: 'white', padding: 16, borderRadius: 14, borderTop: `4px solid ${color}` }}><div style={{ fontSize: 12, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>{titulo}</div><div style={{ fontSize: 26, fontWeight: 900, color }}>{valor}</div></div> }
