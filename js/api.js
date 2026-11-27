// CAPA DE DATOS. Se comunica con mockapi.io.

const API_URLS = {
    users: "https://6b075aa258419b87a4382c8e.mockapi.io",
    rooms: "https://6b075aa258419b87a4382c8e.mockapi.io",
    reservations: "https://6b08c8026a4ecd58b006ab99.mockapi.io"
};

// ---------- Almacenamiento local (temporal) ----------

const DB_KEY = "hotel_db";

const leerDB = () => {
    const guardado = localStorage.getItem(DB_KEY);
    return guardado ? JSON.parse(guardado) : {};
};

const guardarDB = (db) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const localGetAll = (recurso) => leerDB()[recurso] || [];

const localGetById = (recurso, id) =>
    localGetAll(recurso).find((item) => item.id === String(id)) || null;

const localCreate = (recurso, datos) => {
    const db = leerDB();
    const lista = db[recurso] || [];
    const ids = lista.map((item) => Number(item.id));
    const nuevoId = String(ids.length > 0 ? Math.max(...ids) + 1 : 1);
    const nuevo = { ...datos, id: nuevoId };
    lista.push(nuevo);
    db[recurso] = lista;
    guardarDB(db);
    return nuevo;
};

const localUpdate = (recurso, id, datos) => {
    const db = leerDB();
    const lista = db[recurso] || [];
    const indice = lista.findIndex((item) => item.id === String(id));
    if (indice === -1) {
        return null;
    }
    lista[indice] = { ...lista[indice], ...datos, id: String(id) };
    db[recurso] = lista;
    guardarDB(db);
    return lista[indice];
};

const localRemove = (recurso, id) => {
    const db = leerDB();
    const lista = db[recurso] || [];
    const indice = lista.findIndex((item) => item.id === String(id));
    if (indice === -1) {
        return null;
    }
    const [borrado] = lista.splice(indice, 1);
    db[recurso] = lista;
    guardarDB(db);
    return borrado;
};

// ---------- Pedidos a mockapi ----------

const pedir = async (url, opciones = {}) => {
    const respuesta = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...opciones
    });

    if (respuesta.status === 404) {
        return null;
    }

    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status + " al comunicarse con el servidor");
    }

    return respuesta.json();
};

const urlRecurso = (base, recurso, id) =>
    base + "/" + recurso + (id === undefined ? "" : "/" + encodeURIComponent(id));

// ---------- Funciones que usa el resto del sistema ----------

const getAll = async (recurso) => {
    const base = API_URLS[recurso];
    if (!base) {
        return localGetAll(recurso);
    }
    const datos = await pedir(urlRecurso(base, recurso));
    return datos || [];
};

const getById = async (recurso, id) => {
    const base = API_URLS[recurso];
    if (!base) {
        return localGetById(recurso, id);
    }
    return pedir(urlRecurso(base, recurso, id));
};

const create = async (recurso, datos) => {
    const base = API_URLS[recurso];
    if (!base) {
        return localCreate(recurso, datos);
    }
    const { id, ...sinId } = datos;
    return pedir(urlRecurso(base, recurso), {
        method: "POST",
        body: JSON.stringify(sinId)
    });
};

const update = async (recurso, id, datos) => {
    const base = API_URLS[recurso];
    if (!base) {
        return localUpdate(recurso, id, datos);
    }
    const actual = await getById(recurso, id);
    if (!actual) {
        return null;
    }
    const nuevo = { ...actual, ...datos, id: String(id) };
    return pedir(urlRecurso(base, recurso, id), {
        method: "PUT",
        body: JSON.stringify(nuevo)
    });
};

const remove = async (recurso, id) => {
    const base = API_URLS[recurso];
    if (!base) {
        return localRemove(recurso, id);
    }
    return pedir(urlRecurso(base, recurso, id), { method: "DELETE" });
};