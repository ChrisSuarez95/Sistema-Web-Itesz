# Sistema de Tickets ITESZ - Sistema-Web-Itesz

Proyecto Integrador - Desarrollo Individual
Alumno: Christian Emmanuel Suarez Zinzun - ITESZ

Sistema web para organizar reportes de fallas de equipos en el ITESZ. Evita reportes perdidos en papel o WhatsApp, con control por folio, estado y usuario.

Repositorio: https://github.com/ChrisSuarez95/Sistema-Web-Itesz

## Funcionalidades

- Login con usuario y contraseña
- Dashboard con resumen: Total, Abiertos, En Proceso, Cerrados
- Crear ticket con asunto y descripción
- Listar tickets con folio consecutivo #0001, #0002...
- Cambiar estado: Abierto / En Proceso / Cerrado
- Asignar ticket solo a técnicos
- Gestión de Usuarios (CRUD completo)
- Gestión de Departamentos
- Eliminar ticket (CRUD completo)
- Reporte PDF de tickets

## Arquitectura

Se usa arquitectura MVVM:
- **Model:** Datos del ticket (folio, asunto, descripción, estado)
- **View:** Pantalla que ve el usuario (React)
- **ViewModel:** Lógica entre la vista y los datos

## Tecnologías

- React + Vite
- JavaScript
- Node.js v20
- Docker / Docker Compose
- GitHub Actions para pruebas automáticas

## Requisitos para correrlo

- Docker y Docker Compose instalados
- Navegador web (Chrome / Edge)
- Git

## Cómo ejecutarlo en local - Para el profe

1. Clonar el repositorio:
```bash
git clone https://github.com/ChrisSuarez95/Sistema-Web-Itesz.git
cd Sistema-Web-Itesz
