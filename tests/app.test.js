// 4 Pruebas automáticas - Sistema de Tickets ITESZ
const { test } = require('node:test');
const assert = require('node:assert');

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

// 1 - Login correcto
test('1 - Login correcto con chris@test.com / 123', () => {
  assert.strictEqual(validarLogin('chris@test.com', '123'), true);
});

// 2 - Login incorrecto
test('2 - Login incorrecto rechaza contraseña mala', () => {
  assert.strictEqual(validarLogin('chris@test.com', 'mal'), false);
});

// 3 - Crear ticket rechaza asunto menor a 5 caracteres
test('3 - Crear ticket rechaza asunto menor a 5 caracteres', () => {
  assert.strictEqual(validarAsunto('Hola'), false);
  assert.strictEqual(validarAsunto('No prende la PC'), true);
});

// 4 - Generar número de ticket consecutivo
test('4 - Generar número de ticket consecutivo #0001 -> #0002', () => {
  assert.strictEqual(generarNumeroTicket('#0001'), '#0002');
});
