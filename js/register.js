// REGISTRO. Requiere api.js y session.js cargados antes.

const sesionActual = obtenerSesion();
if (sesionActual) {
    window.location.href = PAGINA_INICIO[sesionActual.role];
}

const formRegistro = document.getElementById("form-registro");
const mensaje = document.getElementById("mensaje");

formRegistro.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensaje.textContent = "";

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar").value;

    if (nombre === "") {
        mensaje.textContent = "Ingresá tu nombre.";
        return;
    }

    if (password !== confirmar) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        return;
    }

    const usuarios = await getAll("users");
    const yaExiste = usuarios.some((u) => u.email.toLowerCase() === email);

    if (yaExiste) {
        mensaje.textContent = "Ya existe una cuenta con ese email.";
        return;
    }

    await create("users", { nombre, email, password, role: "USUARIO" });

    const usuario = await iniciarSesion(email, password);
    window.location.href = PAGINA_INICIO[usuario.role];
});