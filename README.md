# Sistema de Reservas de Hotel

Trabajo Práctico Integrador – Programación III – UTN, Facultad Regional Villa María (Tema 2).

## Descripción

Sistema web para que un hotel gestione sus habitaciones y sus reservas en línea. Los huéspedes se registran, consultan las habitaciones disponibles, reservan y cancelan. El administrador gestiona el inventario, el estado de las reservas y los usuarios, y supervisa todo desde un dashboard.

## Integrantes

- Ken Mendez
- Axel Monzo
- Farid Razuk

## Tecnologías

- **HTML5** con etiquetas semánticas y formularios con validaciones.
- **CSS3**: Flexbox, Grid, variables CSS, media queries y diseño responsivo.
- **JavaScript (ES6+)**: arrow functions, `async`/`await`, `fetch`, manejo de eventos, objetos y arrays, y manipulación del DOM.
- **mockapi.io** como backend simulado (API REST).
- Sin frameworks ni librerías externas.

## Funcionalidades

### Sin sesión
- Página de inicio, inicio de sesión y registro.

### Rol USUARIO
- Explorar el listado de habitaciones disponibles y ver el detalle de cada una.
- Reservar eligiendo fechas de entrada y salida, viendo el total antes de confirmar.
- Consultar sus reservas activas y canceladas, y cancelar las activas.

### Rol ADMIN
- **Habitaciones:** alta, edición (tipo, precio y disponibilidad) y baja.
- **Reservas:** ver todas las reservas con el huésped y la habitación, filtrar por estado y cambiar el estado (Pendiente, Confirmada o Cancelada).
- **Usuarios:** crear usuarios (con rol USUARIO o ADMIN) y cambiar la contraseña de cualquier usuario.
- **Dashboard:** cantidades por estado y un gráfico de dona de la distribución de reservas, que se actualiza solo cada 5 segundos.

## Páginas

| Página | Acceso | Descripción |
|---|---|---|
| `index.html` | Público | Inicio |
| `login.html` | Público | Inicio de sesión |
| `register.html` | Público | Registro de usuarios |
| `habitaciones.html` | USUARIO | Catálogo de habitaciones disponibles |
| `detalle.html` | USUARIO | Detalle de una habitación y formulario de reserva |
| `mis-reservas.html` | USUARIO | Historial y cancelación de reservas |
| `admin-habitaciones.html` | ADMIN | ABM de habitaciones |
| `admin-reservas.html` | ADMIN | Gestión de reservas |
| `admin-usuarios.html` | ADMIN | Alta de usuarios y cambio de contraseña |
| `dashboard.html` | ADMIN | Panel con gráfico de reservas |

## Estructura del proyecto

```
├── index.html, login.html, register.html ...   (páginas)
├── css/
│   └── base.css          Estilos de todo el sitio
└── js/
    ├── api.js            Acceso a los datos (mockapi) y avisos de error
    ├── session.js        Sesión, login y protección de páginas por rol
    ├── menu.js           Menú que se arma según el rol
    ├── utils.js          Funciones de apoyo (precios, fechas, estados)
    └── (un archivo por página)
```

## Modelo de datos (mockapi.io)

**users**: `id`, `nombre`, `email`, `password`, `role` (`ADMIN` o `USUARIO`)

**rooms**: `id`, `tipo`, `precio`, `disponible` (verdadero o falso)

**reservations**: `id`, `userId`, `roomId`, `checkIn`, `checkOut`, `estado` (`Pendiente`, `Confirmada` o `Cancelada`)

Las fechas se guardan como texto con formato `AAAA-MM-DD`. Los `id` son texto, como los entrega mockapi.

## Cómo está resuelto el backend

Las tres entidades se guardan en mockapi.io. El plan gratuito permite 2 recursos por proyecto, por lo que se usan **dos proyectos**: uno con `users` y `rooms`, y otro con `reservations`. Las direcciones están configuradas en un único lugar, `js/api.js`:

```js
const API_URLS = {
    users: "https://CODIGO-PROYECTO-1.mockapi.io",
    rooms: "https://CODIGO-PROYECTO-1.mockapi.io",
    reservations: "https://CODIGO-PROYECTO-2.mockapi.io"
};
```

Todas las páginas piden y guardan datos a través de `getAll`, `getById`, `create`, `update` y `remove`, definidas en `js/api.js`. Para usar otros proyectos de mockapi, solo hay que cambiar esas direcciones.

Como mockapi no tiene JOINs ni integridad referencial, los cruces (por ejemplo, mostrar el nombre de la habitación en cada reserva) se hacen en memoria con JavaScript.

## Seguridad y roles

- La sesión se guarda en `sessionStorage` y **no incluye la contraseña**.
- Cada página protegida llama a `requerirSesion(rol)` al cargarse: sin sesión redirige al login, y con un rol equivocado redirige a la página de inicio del rol correspondiente.
- El menú se arma según el rol: cada usuario solo ve las opciones que le corresponden.
- El registro siempre crea usuarios con rol USUARIO. Los administradores solo se crean desde el panel del ADMIN.
- Antes de cancelar una reserva se verifica que pertenezca al usuario que tiene la sesión iniciada.

## Cómo ejecutarlo

1. Clonar el repositorio.
2. Abrir la carpeta en Visual Studio Code y levantar `index.html` con la extensión **Live Server** (o cualquier servidor estático).
3. Se necesita conexión a internet, porque los datos están en mockapi.io.

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| ADMIN | `admin@hotel.com` | `admin123` |
| USUARIO | `usuario@hotel.com` | `user123` |

## Decisiones de diseño

- **Cancelar una reserva** cambia su estado a `Cancelada` y no la borra, para conservar el historial y que el dashboard la cuente.
- **Reservas que se pisan:** no se puede reservar una habitación en fechas que se superponen con una reserva activa. Una reserva cancelada libera la habitación. Al reactivar una reserva cancelada se vuelve a validar.
- **Eliminar una habitación** se bloquea si tiene reservas activas. En ese caso se puede marcar como no disponible.
- **El dashboard** simula el tiempo real consultando los datos cada 5 segundos, ya que mockapi no ofrece conexiones en vivo. El gráfico se dibuja solo con CSS (`conic-gradient`).
- **Avisos de error:** si falla la comunicación con el servidor, se muestra una franja roja arriba de la página.

## Limitaciones conocidas

- Mockapi no valida contraseñas ni protege rutas: el login y los permisos por rol se resuelven en el cliente con JavaScript, y por eso **no constituyen seguridad real**. Las contraseñas se guardan en texto plano en mockapi, algo aceptable solo para este trabajo.
- Las direcciones de mockapi son públicas: cualquier persona que las conozca puede leer y modificar los datos.
- La reserva no guarda el precio de la noche, así que el total que se muestra se calcula con el precio actual de la habitación.