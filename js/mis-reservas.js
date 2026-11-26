// MIS RESERVAS. Requiere api.js, session.js, menu.js y utils.js.

const sesion = requerirSesion("USUARIO");

const contActivas = document.getElementById("activas");
const contCanceladas = document.getElementById("canceladas");
const mensaje = document.getElementById("mensaje");

const crearTarjeta = (reserva, habitacion) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta reserva";

    const titulo = document.createElement("h3");
    titulo.textContent = habitacion ? "Habitación " + habitacion.tipo : "Habitación eliminada";

    const estado = document.createElement("span");
    estado.className = "estado estado-" + reserva.estado.toLowerCase();
    estado.textContent = reserva.estado;

    const fechas = document.createElement("p");
    fechas.textContent = formatearFecha(reserva.checkIn) + " al " + formatearFecha(reserva.checkOut);

    const noches = calcularNoches(reserva.checkIn, reserva.checkOut);
    const resumen = document.createElement("p");
    resumen.textContent = noches + " noche(s)";
    if (habitacion) {
        resumen.textContent += " - Total: " + formatearPrecio(noches * habitacion.precio);
    }

    tarjeta.append(titulo, estado, fechas, resumen);

    if (reserva.estado !== ESTADOS.CANCELADA) {
        const boton = document.createElement("button");
        boton.className = "btn btn-peligro";
        boton.textContent = "Cancelar reserva";
        boton.addEventListener("click", () => cancelarReserva(reserva.id));
        tarjeta.appendChild(boton);
    }

    return tarjeta;
};

const llenar = (contenedor, lista, habitaciones, textoVacio) => {
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        const vacio = document.createElement("p");
        vacio.textContent = textoVacio;
        contenedor.appendChild(vacio);
        return;
    }

    lista.forEach((reserva) => {
        const habitacion = habitaciones.find((h) => h.id === reserva.roomId);
        contenedor.appendChild(crearTarjeta(reserva, habitacion));
    });
};

const mostrarReservas = async () => {
    const [reservas, habitaciones] = await Promise.all([
        getAll("reservations"),
        getAll("rooms")
    ]);

    const mias = reservas
        .filter((r) => r.userId === sesion.id)
        .sort((a, b) => a.checkIn.localeCompare(b.checkIn));

    const activas = mias.filter((r) => r.estado !== ESTADOS.CANCELADA);
    const canceladas = mias.filter((r) => r.estado === ESTADOS.CANCELADA);

    llenar(contActivas, activas, habitaciones, "No tenés reservas activas.");
    llenar(contCanceladas, canceladas, habitaciones, "No tenés reservas canceladas.");
};

const cancelarReserva = async (id) => {
    mensaje.textContent = "";

    if (!confirm("¿Querés cancelar esta reserva?")) {
        return;
    }

    const reserva = await getById("reservations", id);

    if (!reserva || reserva.userId !== sesion.id) {
        mensaje.textContent = "No se puede cancelar esa reserva.";
        return;
    }

    await update("reservations", id, { estado: ESTADOS.CANCELADA });
    mostrarReservas();
};

if (sesion) {
    mostrarReservas();
}