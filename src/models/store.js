const KEY = "itesz_mvvm_v1"
export const initialData = {
  tickets: [
    {id:1, num:"#0001", fecha:"21 Sep 2023", cliente:"chris", asunto:"No puedo instalar Office", desc:"Error", estado:"Abierto", depto:"Soporte", registradoPor:"chris", asignadoPor:"chris", asignadoA:"Juan Pérez", finalizadoPor:"", fechaFin:"", imagen:""},
    {id:2, num:"#0002", fecha:"20 Sep 2023", cliente:"María López", asunto:"Recuperar contraseña", desc:"Olvidé clave", estado:"En Proceso", depto:"TI", registradoPor:"María López", asignadoPor:"chris", asignadoA:"María López", finalizadoPor:"", fechaFin:"", imagen:""},
  ],
  users: [
    {id:1, nombre:"chris", email:"prueba123@gmail.com", password:"chris123", rol:"Admin", depto:"TI"},
    {id:2, nombre:"Juan Pérez", email:"juan@test.com", password:"123456", rol:"Tecnico", depto:"Soporte"},
    {id:3, nombre:"María López", email:"maria@test.com", password:"maria123", rol:"Cliente", depto:"General"},
  ],
  depts: ["Soporte","TI","Ventas","RH","General"],
}
export const loadData = () => {
  const s = localStorage.getItem(KEY)
  return s ? JSON.parse(s) : initialData
}
export const saveData = (data) => localStorage.setItem(KEY, JSON.stringify(data))