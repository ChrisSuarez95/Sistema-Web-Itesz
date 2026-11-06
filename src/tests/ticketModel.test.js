import { describe, it, expect } from 'vitest'
import { createTicket, canAssign, canClose, canDeleteTicket, visibleTickets } from '../models/ticketModel'

describe('SRS - Tickets y Roles', () => {
  const admin = { nombre: 'chris', rol: 'Admin' }
  const tecnico = { nombre: 'Juan Pérez', rol: 'Tecnico' }
  const cliente = { nombre: 'María López', rol: 'Cliente' }

  it('SRS-01: Cliente solo ve sus tickets', () => {
    const tickets = [
      { registradoPor: 'María López', cliente: 'María López' },
      { registradoPor: 'chris', cliente: 'chris' }
    ]
    const vistos = visibleTickets(tickets, cliente)
    expect(vistos.length).toBe(1)
    expect(vistos[0].registradoPor).toBe('María López')
  })

  it('SRS-02: Solo Admin/Tecnico puede asignar', () => {
    expect(canAssign(admin)).toBe(true)
    expect(canAssign(tecnico)).toBe(true)
    expect(canAssign(cliente)).toBe(false)
  })

  it('SRS-03: Solo Admin/Tecnico puede cerrar', () => {
    expect(canClose(admin)).toBe(true)
    expect(canClose(cliente)).toBe(false)
  })

  it('SRS-04: Solo Admin puede eliminar', () => {
    expect(canDeleteTicket(admin)).toBe(true)
    expect(canDeleteTicket(tecnico)).toBe(false)
    expect(canDeleteTicket(cliente)).toBe(false)
  })

  it('SRS-05: Al crear ticket se guarda registradoPor y asignadoPor', () => {
    const t = createTicket({ cliente: 'María López', asunto: 'Error', depto: 'Soporte' }, admin, 2)
    expect(t.num).toBe('#0003')
    expect(t.registradoPor).toBe('chris')
    expect(t.asignadoPor).toBe('chris')
  })
})