// DASHBOARD.

const sesion = requerirSesion("ADMIN");

const INTERVALO_MS = 5000;

const COLORES = {
    [ESTADOS.PENDIENTE]: "#e3a008",
    [ESTADOS.CONFIRMADA]: "#1a7f37",
    [ESTADOS.CANCELADA]: "#b42318"
};

const kpiTotal = document.getElementById("kpi-total");
const kpiPendientes = document.getElementById("kpi-pendientes");
const kpiConfirmadas = document.getElementById("kpi-confirmadas");
const kpiCanceladas = document.getElementById("kpi-canceladas");
const sinDatos = document.getElementById("sin-datos");
const contenedorGrafico = document.getElementById("contenedor-grafico");
const dona = document.getElementById("dona");
const leyenda = document.getElementById("leyenda");
const actualizado = document.getElementById("actualizado");

const contarPorEstado = (reservas) =>
    Object.values(ESTADOS).reduce((conteo, estado) => {
        conteo[estado] = reservas.filter((r) => r.estado === estado).length;
        return conteo;
    }, {});

const construirGradiente = (conteo, total) => {
    let acumulado = 0;
    const tramos = Object.entries(conteo).map(([estado, cantidad]) => {
        const desde = acumulado;
        acumulado += (cantidad / total) * 100;
        return COLORES[estado] + " " + desde + "% " + acumulado + "%";
    });
    return "conic-gradient(" + tramos.join(", ") + ")";
};

const dibujarLeyenda = (conteo, total) => {
    leyenda.innerHTML = "";

    Object.entries(conteo).forEach(([estado, cantidad]) => {
        const item = document.createElement("li");

        const muestra = document.createElement("span");
        muestra.className = "muestra";
        muestra.style.backgroundColor = COLORES[estado];

        const porcentaje = Math.round((cantidad / total) * 100);
        const texto = document.createElement("span");
        texto.textContent = estado + ": " + cantidad + " (" + porcentaje + "%)";

        item.append(muestra, texto);
        leyenda.appendChild(item);
    });
};

const cargarDashboard = async () => {
    const reservas = await getAll("reservations");
    const conteo = contarPorEstado(reservas);
    const total = reservas.length;

    kpiTotal.textContent = total;
    kpiPendientes.textContent = conteo[ESTADOS.PENDIENTE];
    kpiConfirmadas.textContent = conteo[ESTADOS.CONFIRMADA];
    kpiCanceladas.textContent = conteo[ESTADOS.CANCELADA];

    const hayReservas = total > 0;
    sinDatos.hidden = hayReservas;
    contenedorGrafico.hidden = !hayReservas;

    if (hayReservas) {
        dona.style.background = construirGradiente(conteo, total);
        dona.dataset.total = total;
        dibujarLeyenda(conteo, total);
    }

    actualizado.textContent = "Actualizado a las " + new Date().toLocaleTimeString("es-AR");
};

if (sesion) {
    cargarDashboard();
    setInterval(cargarDashboard, INTERVALO_MS);
}