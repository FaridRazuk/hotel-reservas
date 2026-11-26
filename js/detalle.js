// DETALLE Y RESERVA. Requiere api.js, session.js, menu.js y utils.js.

const sesion = requerirSesion("USUARIO");

const params = new URLSearchParams(window.location.search);
const idHabitacion = params.get("id");

const detalle = document.getElementById("detalle");
const noEncontrada = document.getElementById("no-encontrada");
const titulo = document.getElementById("titulo");
const precio = document.getElementById("precio");
const formReserva = document.getElementById("form-reserva");
const mensaje = document.getElementById("mensaje");
const inputCheckIn = document.getElementById("checkin");
const inputCheckOut = document.getElementById("checkout");
const total = document.getElementById("total");

let habitacion = null;

const mostrarTotal = () => {
    total.textContent = "";
    if (!inputCheckIn.value || !inputCheckOut.value) {
        return;
    }
    const noches = calcularNoches(inputCheckIn.value, inputCheckOut.value);
    if (noches > 0) {
        total.textContent =
            noches + " noche(s) x " + formatearPrecio(habitacion.precio) +
            " = " + formatearPrecio(noches * habitacion.precio);
    }
};

const cargarHabitacion = async () => {
    habitacion = await getById("rooms", idHabitacion);

    if (!habitacion || !habitacion.disponible) {
        noEncontrada.hidden = false;
        return;
    }

    titulo.textContent = "Habitación " + habitacion.tipo;
    precio.textContent = formatearPrecio(habitacion.precio) + " por noche";
    inputCheckIn.min = hoy();
    inputCheckOut.min = hoy();
    detalle.hidden = false;
};

formReserva.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensaje.textContent = "";
    mensaje.classList.remove("ok");

    const checkIn = inputCheckIn.value;
    const checkOut = inputCheckOut.value;

    if (checkIn < hoy()) {
        mensaje.textContent = "La fecha de entrada no puede ser anterior a hoy.";
        return;
    }

    if (checkOut <= checkIn) {
        mensaje.textContent = "La salida debe ser posterior a la entrada.";
        return;
    }

    const reservas = await getAll("reservations");
    const ocupada = reservas.some(
        (r) =>
            r.roomId === habitacion.id &&
            r.estado !== ESTADOS.CANCELADA &&
            r.checkIn < checkOut &&
            r.checkOut > checkIn
    );

    if (ocupada) {
        mensaje.textContent = "La habitación ya está reservada en esas fechas.";
        return;
    }

    await create("reservations", {
        userId: sesion.id,
        roomId: habitacion.id,
        checkIn,
        checkOut,
        estado: ESTADOS.PENDIENTE
    });

    mensaje.classList.add("ok");
    mensaje.textContent = "¡Reserva creada! Quedó pendiente de confirmación.";
    formReserva.reset();
    total.textContent = "";
});

inputCheckIn.addEventListener("change", mostrarTotal);
inputCheckOut.addEventListener("change", mostrarTotal);

if (sesion) {
    cargarHabitacion();
}