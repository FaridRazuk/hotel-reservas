// MENÚ DINÁMICO SEGÚN EL ROL. Requiere api.js y session.js cargados antes.

const MENUS = {
    SIN_SESION: [
        { texto: "Iniciar sesión", href: "login.html" },
        { texto: "Registrarse", href: "register.html" }
    ],
    USUARIO: [
        { texto: "Habitaciones", href: "habitaciones.html" },
        { texto: "Mis reservas", href: "mis-reservas.html" }
    ],
    ADMIN: [
        { texto: "Habitaciones", href: "admin-habitaciones.html" },
        { texto: "Reservas", href: "admin-reservas.html" },
        { texto: "Usuarios", href: "admin-usuarios.html" },
        { texto: "Dashboard", href: "dashboard.html" }
    ]
};

const renderMenu = () => {
    const contenedor = document.getElementById("menu");
    if (!contenedor) {
        return;
    }

    const sesion = obtenerSesion();
    const opciones = MENUS[sesion ? sesion.role : "SIN_SESION"] || [];

    const lista = document.createElement("ul");

    opciones.forEach((opcion) => {
        const item = document.createElement("li");
        const enlace = document.createElement("a");
        enlace.textContent = opcion.texto;
        enlace.href = opcion.href;
        item.appendChild(enlace);
        lista.appendChild(item);
    });

    if (sesion) {
        const item = document.createElement("li");
        const boton = document.createElement("button");
        boton.textContent = "Cerrar sesión (" + sesion.nombre + ")";
        boton.addEventListener("click", cerrarSesion);
        item.appendChild(boton);
        lista.appendChild(item);
    }

    contenedor.innerHTML = "";
    contenedor.appendChild(lista);
};

renderMenu();