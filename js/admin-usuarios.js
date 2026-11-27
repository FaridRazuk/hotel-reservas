// ADMIN: GESTIÓN DE USUARIOS. 

const sesion = requerirSesion("ADMIN");

const ROLES = ["ADMIN", "USUARIO"];

const formUsuario = document.getElementById("form-usuario");
const seccionPassword = document.getElementById("seccion-password");
const tituloPassword = document.getElementById("titulo-password");
const formPassword = document.getElementById("form-password");
const btnCancelarPassword = document.getElementById("btn-cancelar-password");
const tabla = document.getElementById("tabla-usuarios");
const mensaje = document.getElementById("mensaje");

let idCambiandoPassword = null;

const mostrarMensaje = (texto, ok = false) => {
    mensaje.textContent = texto;
    mensaje.classList.toggle("ok", ok);
};

const cerrarCambioPassword = () => {
    idCambiandoPassword = null;
    formPassword.reset();
    seccionPassword.hidden = true;
};

const abrirCambioPassword = (usuario) => {
    mostrarMensaje("");
    idCambiandoPassword = usuario.id;
    formPassword.reset();
    tituloPassword.textContent = "Cambiar contraseña de " + usuario.nombre;
    seccionPassword.hidden = false;
    seccionPassword.scrollIntoView({ behavior: "smooth" });
    document.getElementById("nueva-password").focus();
};

const crearFila = (usuario) => {
    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = usuario.nombre;
    if (sesion && usuario.id === sesion.id) {
        celdaNombre.textContent += " (vos)";
    }

    const celdaEmail = document.createElement("td");
    celdaEmail.textContent = usuario.email;

    const celdaRol = document.createElement("td");
    celdaRol.textContent = usuario.role;

    const celdaAcciones = document.createElement("td");
    const boton = document.createElement("button");
    boton.className = "btn btn-chico";
    boton.textContent = "Cambiar contraseña";
    boton.addEventListener("click", () => abrirCambioPassword(usuario));
    celdaAcciones.appendChild(boton);

    fila.append(celdaNombre, celdaEmail, celdaRol, celdaAcciones);
    return fila;
};

const mostrarUsuarios = async () => {
    const usuarios = await getAll("users");
    tabla.innerHTML = "";
    usuarios.forEach((usuario) => tabla.appendChild(crearFila(usuario)));
};

formUsuario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mostrarMensaje("");

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const role = document.getElementById("rol").value;

    if (nombre === "") {
        mostrarMensaje("Ingresá el nombre.");
        return;
    }

    if (!ROLES.includes(role)) {
        mostrarMensaje("El rol elegido no es válido.");
        return;
    }

    if (password.length < 6) {
        mostrarMensaje("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    const usuarios = await getAll("users");
    const yaExiste = usuarios.some((u) => u.email.toLowerCase() === email);

    if (yaExiste) {
        mostrarMensaje("Ya existe un usuario con ese email.");
        return;
    }

    await create("users", { nombre, email, password, role });
    formUsuario.reset();
    mostrarMensaje("Usuario creado.", true);
    mostrarUsuarios();
});

formPassword.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mostrarMensaje("");

    const nueva = document.getElementById("nueva-password").value;
    const confirmar = document.getElementById("confirmar-password").value;

    if (nueva.length < 6) {
        mostrarMensaje("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    if (nueva !== confirmar) {
        mostrarMensaje("Las contraseñas no coinciden.");
        return;
    }

    await update("users", idCambiandoPassword, { password: nueva });
    cerrarCambioPassword();
    mostrarMensaje("Contraseña actualizada.", true);
});

btnCancelarPassword.addEventListener("click", cerrarCambioPassword);

if (sesion) {
    mostrarUsuarios();
}