// 4 Pruebas automáticas - Sistema de Tickets ITESZ
import { test } from 'node:test';
import assert from 'node:assert';

function validarLogin(email, password) {
  if (email === 'chris@test.com' && password === '123') return true;
  return false;
}

function validarAsunto(asunto) {
  return asunto.length >= 5;
}

function generarNumeroTicket(ultimo) {
  const num = parseInt(ultimo.replace('#', '')) + 1;
  return '#' + String(num).padStart(4, '0');
}

test('1 - Login correcto con chris@test.com / 123', () => {
  assert.strictEqual(validarLogin('chris@test.com', '123'), true);
});

test('2 - Login incorrecto rechaza contraseña mala', () => {
  assert.strictEqual(validarLogin('chris@test.com', 'mal'), false);
});

test('3 - Crear ticket rechaza asunto menor a 5 caracteres', () => {
  assert.strictEqual(validarAsunto('Hola'), false);
  assert.strictEqual(validarAsunto('No prende la PC'), true);
});

test('4 - Generar número de ticket consecutivo #0001 -> #0002', () => {
  assert.strictEqual(generarNumeroTicket('#0001'), '#0002');
});
