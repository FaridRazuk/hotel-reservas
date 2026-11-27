// ADMIN: ABM DE HABITACIONES.

const sesion = requerirSesion("ADMIN");

const form = document.getElementById("form-habitacion");
const tituloForm = document.getElementById("titulo-form");
const inputTipo = document.getElementById("tipo");
const inputPrecio = document.getElementById("precio");
const inputDisponible = document.getElementById("disponible");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelarEdicion = document.getElementById("btn-cancelar-edicion");
const tabla = document.getElementById("tabla-habitaciones");
const mensaje = document.getElementById("mensaje");

let idEditando = null;

const mostrarMensaje = (texto, ok = false) => {
    mensaje.textContent = texto;
    mensaje.classList.toggle("ok", ok);
};

const salirDeEdicion = () => {
    idEditando = null;
    form.reset();
    tituloForm.textContent = "Nueva habitación";
    btnGuardar.textContent = "Agregar habitación";
    btnCancelarEdicion.hidden = true;
};

const entrarEnEdicion = (habitacion) => {
    idEditando = habitacion.id;
    inputTipo.value = habitacion.tipo;
    inputPrecio.value = habitacion.precio;
    inputDisponible.checked = habitacion.disponible;
    tituloForm.textContent = "Editar habitación";
    btnGuardar.textContent = "Guardar cambios";
    btnCancelarEdicion.hidden = false;
    inputTipo.focus();
};

const eliminarHabitacion = async (id) => {
    mostrarMensaje("");

    const reservas = await getAll("reservations");
    const conReservas = reservas.some(
        (r) => r.roomId === id && r.estado !== ESTADOS.CANCELADA
    );

    if (conReservas) {
        mostrarMensaje("No se puede eliminar: tiene reservas activas. Marcala como no disponible.");
        return;
    }

    if (!confirm("¿Querés eliminar esta habitación?")) {
        return;
    }

    await remove("rooms", id);
    if (idEditando === id) {
        salirDeEdicion();
    }
    mostrarMensaje("Habitación eliminada.", true);
    mostrarHabitaciones();
};

const crearFila = (habitacion) => {
    const fila = document.createElement("tr");

    const celdaTipo = document.createElement("td");
    celdaTipo.textContent = habitacion.tipo;

    const celdaPrecio = document.createElement("td");
    celdaPrecio.textContent = formatearPrecio(habitacion.precio);

    const celdaDisponible = document.createElement("td");
    celdaDisponible.textContent = habitacion.disponible ? "Sí" : "No";

    const celdaAcciones = document.createElement("td");
    const acciones = document.createElement("div");
    acciones.className = "acciones";

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-chico";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => entrarEnEdicion(habitacion));

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-chico btn-peligro";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarHabitacion(habitacion.id));

    acciones.append(btnEditar, btnEliminar);
    celdaAcciones.appendChild(acciones);
    fila.append(celdaTipo, celdaPrecio, celdaDisponible, celdaAcciones);
    return fila;
};

const mostrarHabitaciones = async () => {
    const habitaciones = await getAll("rooms");
    tabla.innerHTML = "";

    if (habitaciones.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.colSpan = 4;
        celda.textContent = "Todavía no hay habitaciones cargadas.";
        fila.appendChild(celda);
        tabla.appendChild(fila);
        return;
    }

    habitaciones.forEach((habitacion) => tabla.appendChild(crearFila(habitacion)));
};

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mostrarMensaje("");

    const tipo = inputTipo.value.trim();
    const precio = Number(inputPrecio.value);
    const disponible = inputDisponible.checked;

    if (tipo === "") {
        mostrarMensaje("Ingresá el tipo de habitación.");
        return;
    }

    if (!(precio > 0)) {
        mostrarMensaje("El precio debe ser mayor a 0.");
        return;
    }

    if (idEditando) {
        await update("rooms", idEditando, { tipo, precio, disponible });
        mostrarMensaje("Habitación actualizada.", true);
    } else {
        await create("rooms", { tipo, precio, disponible });
        mostrarMensaje("Habitación agregada.", true);
    }

    salirDeEdicion();
    mostrarHabitaciones();
});

btnCancelarEdicion.addEventListener("click", salirDeEdicion);

if (sesion) {
    mostrarHabitaciones();
}