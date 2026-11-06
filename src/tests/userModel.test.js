import { describe, it, expect } from 'vitest'
import { canManageUsers, createUser } from '../models/userModel'

describe('SRS - Usuarios', () => {
  it('SRS-06: Solo Admin gestiona usuarios', () => {
    expect(canManageUsers({ rol: 'Admin' })).toBe(true)
    expect(canManageUsers({ rol: 'Cliente' })).toBe(false)
  })
  it('SRS-07: Crear usuario guarda rol y depto', () => {
    const u = createUser({ nombre: 'Ana', email: 'ana@test.com', rol: 'Cliente', depto: 'General' })
    expect(u.nombre).toBe('Ana')
    expect(u.rol).toBe('Cliente')
  })
})