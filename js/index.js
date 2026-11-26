// PÁGINA DE INICIO. Requiere api.js, session.js y menu.js cargados antes.

const acciones = document.getElementById("acciones");
const sesionActiva = obtenerSesion();

const crearBoton = (texto, href, claseExtra = "") => {
    const enlace = document.createElement("a");
    enlace.className = ("btn " + claseExtra).trim();
    enlace.textContent = texto;
    enlace.href = href;
    return enlace;
};

if (sesionActiva) {
    const destino = sesionActiva.role === "ADMIN" ? "Ir al panel de administración" : "Ver habitaciones";
    acciones.appendChild(crearBoton(destino, PAGINA_INICIO[sesionActiva.role]));
} else {
    acciones.append(
        crearBoton("Iniciar sesión", "login.html"),
        crearBoton("Crear cuenta", "register.html", "btn-secundario")
    );
}