/*=====================================================
  COSTCHEF v1.0
  storage.js
  Administración de datos (LocalStorage)
=====================================================*/

const STORAGE_KEY = "costchef_recetas";
const CONFIG_KEY = "costchef_config";

/*=====================================================
  Generar ID único
=====================================================*/
function generarID() {

    const fecha = new Date();

    const yyyy = fecha.getFullYear();

    const mm = String(fecha.getMonth() + 1).padStart(2, "0");

    const dd = String(fecha.getDate()).padStart(2, "0");

    const hh = String(fecha.getHours()).padStart(2, "0");

    const mi = String(fecha.getMinutes()).padStart(2, "0");

    const ss = String(fecha.getSeconds()).padStart(2, "0");

    return `REC-${yyyy}${mm}${dd}-${hh}${mi}${ss}`;

}

/*=====================================================
  Obtener todas las recetas
=====================================================*/
function obtenerRecetas() {

    const datos = localStorage.getItem(STORAGE_KEY);

    if (!datos) {
        return [];
    }

    try {

        return JSON.parse(datos);

    } catch (e) {

        console.error("Error leyendo recetas", e);

        return [];

    }

}

/*=====================================================
  Guardar todas las recetas
=====================================================*/
function guardarTodas(recetas) {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(recetas)

    );

}

/*=====================================================
  Guardar receta
=====================================================*/
function guardarReceta(receta) {

    let recetas = obtenerRecetas();

    if (!receta.id) {

        receta.id = generarID();

    }

    receta.fechaActualizacion = new Date().toISOString();

    recetas.push(receta);

    guardarTodas(recetas);

    return receta.id;

}

/*=====================================================
  Actualizar receta
=====================================================*/
function actualizarReceta(receta) {

    let recetas = obtenerRecetas();

    const index = recetas.findIndex(r => r.id === receta.id);

    if (index === -1) {

        return false;

    }

    receta.fechaActualizacion = new Date().toISOString();

    recetas[index] = receta;

    guardarTodas(recetas);

    return true;

}

/*=====================================================
  Obtener una receta
=====================================================*/
function obtenerReceta(id) {

    const recetas = obtenerRecetas();

    return recetas.find(r => r.id === id);

}

/*=====================================================
  Eliminar receta
=====================================================*/
function eliminarReceta(id) {

    let recetas = obtenerRecetas();

    recetas = recetas.filter(r => r.id !== id);

    guardarTodas(recetas);

}

/*=====================================================
  Duplicar receta
=====================================================*/
function duplicarReceta(id) {

    const receta = obtenerReceta(id);

    if (!receta) {

        return null;

    }

    const copia = structuredClone(receta);

    copia.id = generarID();

    copia.nombre += " (Copia)";

    copia.fechaActualizacion = new Date().toISOString();

    guardarReceta(copia);

    return copia.id;

}

/*=====================================================
  Buscar recetas
=====================================================*/
function buscarRecetas(texto) {

    texto = texto.toLowerCase();

    return obtenerRecetas().filter(r => {

        return (

            r.nombre.toLowerCase().includes(texto) ||

            r.categoria.toLowerCase().includes(texto)

        );

    });

}

/*=====================================================
  Exportar respaldo
=====================================================*/
function exportarJSON() {

    const datos = JSON.stringify(

        obtenerRecetas(),

        null,

        2

    );

    const blob = new Blob(

        [datos],

        { type: "application/json" }

    );

    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");

    enlace.href = url;

    enlace.download = "costchef_respaldo.json";

    enlace.click();

    URL.revokeObjectURL(url);

}

/*=====================================================
  Importar respaldo
=====================================================*/
function importarJSON(json) {

    try {

        const datos = JSON.parse(json);

        guardarTodas(datos);

        return true;

    } catch (e) {

        console.error(e);

        return false;

    }

}

/*=====================================================
  Eliminar toda la base
=====================================================*/
function limpiarBase() {

    localStorage.removeItem(STORAGE_KEY);

}

/*=====================================================
  Configuración
=====================================================*/
function guardarConfiguracion(config) {

    localStorage.setItem(

        CONFIG_KEY,

        JSON.stringify(config)

    );

}

function obtenerConfiguracion() {

    const datos = localStorage.getItem(CONFIG_KEY);

    if (!datos) {

        return {

            empresa: "",

            iva: 16,

            utilidad: 40,

            moneda: "MXN"

        };

    }

    return JSON.parse(datos);

}

/*=====================================================
  Estadísticas
=====================================================*/
function totalRecetas() {

    return obtenerRecetas().length;

}

function totalCategorias() {

    const categorias = [];

    obtenerRecetas().forEach(r => {

        if (!categorias.includes(r.categoria)) {

            categorias.push(r.categoria);

        }

    });

    return categorias.length;

}

function obtenerCategorias() {

    const lista = [];

    obtenerRecetas().forEach(r => {

        if (!lista.includes(r.categoria)) {

            lista.push(r.categoria);

        }

    });

    return lista.sort();

}

/*=====================================================
  Inicialización
=====================================================*/

console.log("Storage CostChef listo");