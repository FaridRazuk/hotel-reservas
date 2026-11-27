// LOGIN.

const sesionActual = obtenerSesion();
if (sesionActual) {
    window.location.href = PAGINA_INICIO[sesionActual.role];
}

const formLogin = document.getElementById("form-login");
const mensaje = document.getElementById("mensaje");

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    mensaje.textContent = "";

    const usuario = await iniciarSesion(email, password);

    if (!usuario) {
        mensaje.textContent = "Email o contraseña incorrectos.";
        return;
    }

    window.location.href = PAGINA_INICIO[usuario.role];
});