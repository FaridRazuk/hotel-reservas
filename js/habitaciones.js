// CATÁLOGO DE HABITACIONES.

requerirSesion("USUARIO");

const listado = document.getElementById("listado");

const mostrarHabitaciones = async () => {
    const habitaciones = await getAll("rooms");
    const disponibles = habitaciones.filter((h) => h.disponible);

    listado.innerHTML = "";

    if (disponibles.length === 0) {
        const vacio = document.createElement("p");
        vacio.textContent = "No hay habitaciones disponibles por el momento.";
        listado.appendChild(vacio);
        return;
    }

    disponibles.forEach((habitacion) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta habitacion";

        const titulo = document.createElement("h2");
        titulo.textContent = "Habitación " + habitacion.tipo;

        const precio = document.createElement("p");
        precio.className = "precio";
        precio.textContent = formatearPrecio(habitacion.precio) + " por noche";

        const enlace = document.createElement("a");
        enlace.className = "btn";
        enlace.href = "detalle.html?id=" + habitacion.id;
        enlace.textContent = "Ver detalle";

        tarjeta.append(titulo, precio, enlace);
        listado.appendChild(tarjeta);
    });
};

mostrarHabitaciones();