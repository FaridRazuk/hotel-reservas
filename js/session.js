// MANEJO DE LA SESIÓN. 

const SESSION_KEY = "hotel_session";

const PAGINA_INICIO = {
    ADMIN: "admin-habitaciones.html",
    USUARIO: "habitaciones.html"
};

const guardarSesion = (usuario) => {
    const { password, ...usuarioSinPassword } = usuario;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuarioSinPassword));
};

const obtenerSesion = () => {
    const guardada = sessionStorage.getItem(SESSION_KEY);
    return guardada ? JSON.parse(guardada) : null;
};

const cerrarSesion = () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
};

const iniciarSesion = async (email, password) => {
    const usuarios = await getAll("users");
    const usuario = usuarios.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!usuario) {
        return null;
    }
    guardarSesion(usuario);
    return obtenerSesion();
};

const requerirSesion = (rolPermitido) => {
    const sesion = obtenerSesion();
    if (!sesion) {
        window.location.href = "login.html";
        return null;
    }
    if (rolPermitido && sesion.role !== rolPermitido) {
        window.location.href = PAGINA_INICIO[sesion.role];
        return null;
    }
    return sesion;
};