# Sistema de Tickets ITESZ - Sistema-Web-Itesz

Proyecto Integrador - Desarrollo Individual
Alumno: Christian Emmanuel Suarez Zinzun- ITESZ

Sistema web para organizar reportes de fallas de equipos en el ITESZ. Evita reportes perdidos en papel o WhatsApp, con control por folio, estado y usuario.

Repositorio: https://github.com/ChrisSuarez95/Sistema-Web-Itesz

## Funcionalidades

- Login con usuario y contraseña
- Crear ticket con asunto y descripción
- Listar tickets con folio consecutivo #0001, #0002...
- Cambiar estado: Abierto / En proceso / Cerrado
- Eliminar ticket (CRUD completo)

## Arquitectura

Se usa arquitectura MVVM:
- **Model:** Datos del ticket (folio, asunto, descripción, estado)
- **View:** Pantalla que ve el usuario (React)
- **ViewModel:** Lógica entre la vista y los datos

## Tecnologías

- React + Vite
- JavaScript
- Node.js v20
- GitHub Actions para pruebas automáticas

## Requisitos para correrlo

- Node.js v20 o superior
- Navegador web (Chrome / Edge)
- Git

## Cómo ejecutarlo en local - Para el profe

1. Clonar el repositorio:
```bash
git clone https://github.com/ChrisSuarez95/Sistema-Web-Itesz.git
