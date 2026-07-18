/* ======================================================
   COSTCHEF v1.0
   app.js
   ====================================================== */

const STORAGE_KEY = "costchef_recetas";
let recetaActual = null;

/* ===========================
   Obtener datos del formulario
=========================== */

function obtenerDatos() {

    const nombre = document.getElementById("nombreProducto") ?
        document.getElementById("nombreProducto").value : "";

    const categoria = document.getElementById("categoria") ?
        document.getElementById("categoria").value : "";

    const porciones = Number(document.getElementById("porciones").value || 1);

    const ingredientes = [];

    document.querySelectorAll("#t tbody tr").forEach(fila => {

        const inputs = fila.querySelectorAll("input");

        ingredientes.push({

            ingrediente: inputs[0].value,

            unidad: inputs[1].value,

            cantidadUsada: Number(inputs[2].value || 0),

            cantidadCompra: Number(inputs[3].value || 0),

            precioCompra: Number(inputs[4].value || 0),

            costo: Number(fila.querySelector(".cost").textContent || 0)

        });

    });

    return {

        id: recetaActual || generarID(),

        nombre,

        categoria,

        porciones,

        gastos: {

            gas: Number(document.getElementById("gas").value || 0),

            luz: Number(document.getElementById("luz").value || 0),

            agua: Number(document.getElementById("agua").value || 0),

            empaque: Number(document.getElementById("emp").value || 0),

            manoObra: Number(document.getElementById("mo").value || 0)

        },

        ingredientes

    };

}

/* ===========================
   Generar ID
=========================== */

function generarID() {

    return "REC-" + Date.now();

}

/* ===========================
   Guardar receta
=========================== */

function guardarReceta() {

    const receta = obtenerDatos();

    let lista = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const index = lista.findIndex(item => item.id === receta.id);

    if (index >= 0) {

        lista[index] = receta;

    } else {

        lista.push(receta);

    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));

    recetaActual = receta.id;

    alert("Receta guardada correctamente.");

}

/* ===========================
   Obtener recetas
=========================== */

function obtenerRecetas() {

    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

}

/* ===========================
   Buscar receta por ID
=========================== */

function buscarReceta(id) {

    const lista = obtenerRecetas();

    return lista.find(r => r.id === id);

}

/* ===========================
   Cargar receta
=========================== */

function cargarReceta(id) {

    const receta = buscarReceta(id);

    if (!receta) return;

    recetaActual = receta.id;

    document.getElementById("nombreProducto").value = receta.nombre;

    document.getElementById("categoria").value = receta.categoria;

    document.getElementById("porciones").value = receta.porciones;

    document.getElementById("gas").value = receta.gastos.gas;

    document.getElementById("luz").value = receta.gastos.luz;

    document.getElementById("agua").value = receta.gastos.agua;

    document.getElementById("emp").value = receta.gastos.empaque;

    document.getElementById("mo").value = receta.gastos.manoObra;

    const tbody = document.querySelector("#t tbody");

    tbody.innerHTML = "";

    receta.ingredientes.forEach(item => {

        agregarFila();

        const fila = tbody.lastElementChild;

        const inputs = fila.querySelectorAll("input");

        inputs[0].value = item.ingrediente;

        inputs[1].value = item.unidad;

        inputs[2].value = item.cantidadUsada;

        inputs[3].value = item.cantidadCompra;

        inputs[4].value = item.precioCompra;

    });

    calcularTodo();

}

/* ===========================
   Eliminar receta
=========================== */

function eliminarReceta(id) {

    let lista = obtenerRecetas();

    lista = lista.filter(r => r.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));

}

/* ===========================
   Nueva receta
=========================== */

function nuevaReceta() {

    recetaActual = null;

    location.reload();

}

/* ===========================
   Agregar fila
=========================== */

function agregarFila() {

    const tbody = document.querySelector("#t tbody");

    const fila = tbody.rows[0].cloneNode(true);

    fila.querySelectorAll("input").forEach(input => {

        input.value = "";

    });

    fila.querySelector(".cost").textContent = "0.00";

    tbody.appendChild(fila);

    activarEventos();

}

/* ===========================
   Activar eventos
=========================== */

function activarEventos() {

    document.querySelectorAll("input").forEach(input => {

        input.oninput = calcularTodo;

    });

}

/* ===========================
   Calcular costos
=========================== */

function calcularTodo() {

    let totalIngredientes = 0;

    document.querySelectorAll("#t tbody tr").forEach(fila => {

        const usada = Number(fila.querySelectorAll("input")[2].value || 0);

        const compra = Number(fila.querySelectorAll("input")[3].value || 0);

        const precio = Number(fila.querySelectorAll("input")[4].value || 0);

        let costo = 0;

        if (compra > 0) {

            costo = (usada / compra) * precio;

        }

        fila.querySelector(".cost").textContent = costo.toFixed(2);

        totalIngredientes += costo;

    });

    const gastos =

        Number(gas.value || 0) +

        Number(luz.value || 0) +

        Number(agua.value || 0) +

        Number(emp.value || 0) +

        Number(mo.value || 0);

    const costoProduccion = totalIngredientes + gastos;

    const utilidad = 0.40;

    const iva = 0.16;

    const precioVenta = costoProduccion * (1 + utilidad) * (1 + iva);

    const porciones = Number(document.getElementById("porciones").value || 1);

    document.getElementById("ti").textContent = totalIngredientes.toFixed(2);

    document.getElementById("tg").textContent = gastos.toFixed(2);

    document.getElementById("cp").textContent = costoProduccion.toFixed(2);

    document.getElementById("pv").textContent = precioVenta.toFixed(2);

    document.getElementById("pp").textContent = (costoProduccion / porciones).toFixed(2);

}

/* ===========================
   Inicializar
=========================== */

window.onload = function () {

    activarEventos();

    calcularTodo();

    const botones = document.querySelectorAll("button");

    botones.forEach(btn => {

        if (btn.textContent.includes("Guardar")) {

            btn.onclick = guardarReceta;

        }

        if (btn.textContent.includes("Nuevo")) {

            btn.onclick = nuevaReceta;

        }

    });

};