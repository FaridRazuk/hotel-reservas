// ADMIN: GESTIÓN DE RESERVAS. Requiere api.js, session.js, menu.js y utils.js.

const sesion = requerirSesion("ADMIN");

const tabla = document.getElementById("tabla-reservas");
const filtro = document.getElementById("filtro-estado");
const mensaje = document.getElementById("mensaje");

let datos = { reservas: [], usuarios: [], habitaciones: [] };

const mostrarMensaje = (texto, ok = false) => {
    mensaje.textContent = texto;
    mensaje.classList.toggle("ok", ok);
};

const haySolapamiento = (reserva, todas) =>
    todas.some(
        (r) =>
            r.id !== reserva.id &&
            r.roomId === reserva.roomId &&
            r.estado !== ESTADOS.CANCELADA &&
            r.checkIn < reserva.checkOut &&
            r.checkOut > reserva.checkIn
    );

const cambiarEstado = async (reserva, nuevoEstado) => {
    mostrarMensaje("");

    const reactiva =
        reserva.estado === ESTADOS.CANCELADA && nuevoEstado !== ESTADOS.CANCELADA;

    if (reactiva) {
        const actuales = await getAll("reservations");
        if (haySolapamiento(reserva, actuales)) {
            mostrarMensaje("No se puede reactivar: la habitación ya fue reservada en esas fechas.");
            mostrarReservas();
            return;
        }
    }

    await update("reservations", reserva.id, { estado: nuevoEstado });
    mostrarMensaje("Estado actualizado.", true);
    cargarDatos();
};

const crearFila = (reserva) => {
    const usuario = datos.usuarios.find((u) => u.id === reserva.userId);
    const habitacion = datos.habitaciones.find((h) => h.id === reserva.roomId);

    const fila = document.createElement("tr");

    const celdaHuesped = document.createElement("td");
    celdaHuesped.textContent = usuario
        ? usuario.nombre + " (" + usuario.email + ")"
        : "Usuario eliminado";

    const celdaHabitacion = document.createElement("td");
    celdaHabitacion.textContent = habitacion ? habitacion.tipo : "Habitación eliminada";

    const celdaEntrada = document.createElement("td");
    celdaEntrada.textContent = formatearFecha(reserva.checkIn);

    const celdaSalida = document.createElement("td");
    celdaSalida.textContent = formatearFecha(reserva.checkOut);

    const celdaEstado = document.createElement("td");
    const select = document.createElement("select");
    Object.values(ESTADOS).forEach((estado) => {
        const opcion = document.createElement("option");
        opcion.value = estado;
        opcion.textContent = estado;
        select.appendChild(opcion);
    });
    select.value = reserva.estado;
    select.addEventListener("change", () => cambiarEstado(reserva, select.value));
    celdaEstado.appendChild(select);

    fila.append(celdaHuesped, celdaHabitacion, celdaEntrada, celdaSalida, celdaEstado);
    return fila;
};

const mostrarReservas = () => {
    const estadoFiltro = filtro.value;

    const lista = datos.reservas
        .filter((r) => estadoFiltro === "" || r.estado === estadoFiltro)
        .sort((a, b) => a.checkIn.localeCompare(b.checkIn));

    tabla.innerHTML = "";

    if (lista.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.colSpan = 5;
        celda.textContent = "No hay reservas para mostrar.";
        fila.appendChild(celda);
        tabla.appendChild(fila);
        return;
    }

    lista.forEach((reserva) => tabla.appendChild(crearFila(reserva)));
};

const cargarDatos = async () => {
    const [reservas, usuarios, habitaciones] = await Promise.all([
        getAll("reservations"),
        getAll("users"),
        getAll("rooms")
    ]);
    datos = { reservas, usuarios, habitaciones };
    mostrarReservas();
};

Object.values(ESTADOS).forEach((estado) => {
    const opcion = document.createElement("option");
    opcion.value = estado;
    opcion.textContent = estado;
    filtro.appendChild(opcion);
});

filtro.addEventListener("change", mostrarReservas);

if (sesion) {
    cargarDatos();
}