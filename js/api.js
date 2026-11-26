// CAPA DE DATOS TEMPORAL: simula mockapi usando localStorage.
// Cuando mockapi esté listo, se reemplaza el contenido de este archivo
// y el resto del sistema no se entera.

const DB_KEY = "hotel_db";

const datosIniciales = {
    users: [
        { id: "1", nombre: "Administrador", email: "admin@hotel.com", password: "admin123", role: "ADMIN" },
        { id: "2", nombre: "Usuario de prueba", email: "usuario@hotel.com", password: "user123", role: "USUARIO" }
    ],
    rooms: [
        { id: "1", tipo: "Simple", precio: 30000, disponible: true },
        { id: "2", tipo: "Doble", precio: 50000, disponible: true },
        { id: "3", tipo: "Suite", precio: 90000, disponible: true },
        { id: "4", tipo: "Familiar", precio: 70000, disponible: false }
    ],
    reservations: []
};

const guardarDB = (db) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const leerDB = () => {
    const guardado = localStorage.getItem(DB_KEY);
    if (guardado) {
        return JSON.parse(guardado);
    }
    guardarDB(datosIniciales);
    return datosIniciales;
};

// Funciones de lectura. Son async porque fetch (con mockapi) es asíncrono:
// así el resto del código queda preparado y no hay que cambiarlo después.

const getAll = async (recurso) => {
    const db = leerDB();
    return db[recurso];
};

const getById = async (recurso, id) => {
    const db = leerDB();
    return db[recurso].find((item) => item.id === String(id));
};

const create = async (recurso, datos) => {
    const db = leerDB();
    const ids = db[recurso].map((item) => Number(item.id));
    const nuevoId = String(ids.length > 0 ? Math.max(...ids) + 1 : 1);
    const nuevo = { ...datos, id: nuevoId };
    db[recurso].push(nuevo);
    guardarDB(db);
    return nuevo;
};

const update = async (recurso, id, datos) => {
    const db = leerDB();
    const indice = db[recurso].findIndex((item) => item.id === String(id));
    if (indice === -1) {
        return null;
    }
    db[recurso][indice] = { ...db[recurso][indice], ...datos, id: String(id) };
    guardarDB(db);
    return db[recurso][indice];
};

const remove = async (recurso, id) => {
    const db = leerDB();
    const indice = db[recurso].findIndex((item) => item.id === String(id));
    if (indice === -1) {
        return null;
    }
    const [borrado] = db[recurso].splice(indice, 1);
    guardarDB(db);
    return borrado;
};