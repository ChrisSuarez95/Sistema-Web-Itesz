import { describe, it, expect } from 'vitest'
import { createDept } from '../models/deptModel'

describe('SRS - Departamentos', () => {
  it('SRS-08: No permite depto vacío', () => {
    expect(createDept('  ')).toBe('')
  })
  it('SRS-09: Guarda nombre limpio', () => {
    expect(createDept('  Soporte  ')).toBe('Soporte')
  })
})