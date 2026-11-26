// FUNCIONES DE APOYO COMPARTIDAS.

const formatearPrecio = (precio) => "$" + Number(precio).toLocaleString("es-AR");

const ESTADOS = {
    PENDIENTE: "Pendiente",
    CONFIRMADA: "Confirmada",
    CANCELADA: "Cancelada"
};

const hoy = () => new Date().toLocaleDateString("en-CA");

const calcularNoches = (checkIn, checkOut) => {
    const msPorDia = 24 * 60 * 60 * 1000;
    return Math.round((new Date(checkOut) - new Date(checkIn)) / msPorDia);
};

const formatearFecha = (fecha) => fecha.split("-").reverse().join("/");