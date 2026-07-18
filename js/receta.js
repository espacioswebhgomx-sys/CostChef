/*=====================================================
    COSTCHEF v1.0
    receta.js
======================================================*/

let recetaID = null;

document.addEventListener("DOMContentLoaded", () => {

    obtenerParametro();

    cargarRecetaActual();

    activarEventos();

});

/*=====================================================
    Obtener ID desde la URL
======================================================*/

function obtenerParametro() {

    const parametros = new URLSearchParams(window.location.search);

    recetaID = parametros.get("id");

}

/*=====================================================
    Cargar receta
======================================================*/

function cargarRecetaActual() {

    if (!recetaID) {

        alert("No se recibió un ID de receta.");

        location.href = "productos.html";

        return;

    }

    const receta = obtenerReceta(recetaID);

    if (!receta) {

        alert("La receta no existe.");

        location.href = "productos.html";

        return;

    }

    llenarFormulario(receta);

}

/*=====================================================
    Llenar formulario
======================================================*/

function llenarFormulario(receta) {

    document.getElementById("nombreProducto").value = receta.nombre;

    document.getElementById("categoria").value = receta.categoria;

    document.getElementById("porciones").value = receta.porciones;

    document.getElementById("gas").value = receta.gastos.gas;

    document.getElementById("luz").value = receta.gastos.luz;

    document.getElementById("agua").value = receta.gastos.agua;

    document.getElementById("emp").value = receta.gastos.empaque;

    document.getElementById("mo").value = receta.gastos.mano;

    const tbody = document.querySelector("#t tbody");

    tbody.innerHTML = "";

    receta.ingredientes.forEach(item => {

        agregarFila(item);

    });

    actualizarResumen();

}

/*=====================================================
    Agregar fila
======================================================*/

function agregarFila(datos = null) {

    const tbody = document.querySelector("#t tbody");

    const fila = document.createElement("tr");

    fila.innerHTML = `

        <td><input type="text"></td>

        <td><input type="text"></td>

        <td><input type="number" step="0.001"></td>

        <td><input type="number" step="0.001"></td>

        <td><input type="number" step="0.01"></td>

        <td class="cost">0.00</td>

    `;

    if (datos) {

        const inputs = fila.querySelectorAll("input");

        inputs[0].value = datos.ingrediente;

        inputs[1].value = datos.unidad;

        inputs[2].value = datos.usada;

        inputs[3].value = datos.compra;

        inputs[4].value = datos.precio;

    }

    tbody.appendChild(fila);

}

/*=====================================================
    Eventos
======================================================*/

function activarEventos() {

    document.getElementById("guardar").addEventListener(

        "click",

        guardarCambios

    );

    document.getElementById("agregar").addEventListener(

        "click",

        () => {

            agregarFila();

            actualizarResumen();

        }

    );

    document.addEventListener(

        "input",

        actualizarResumen

    );

}

/*=====================================================
    Obtener ingredientes
======================================================*/

function obtenerIngredientes() {

    const lista = [];

    document.querySelectorAll("#t tbody tr").forEach(fila => {

        const i = fila.querySelectorAll("input");

        lista.push({

            ingrediente: i[0].value,

            unidad: i[1].value,

            usada: Number(i[2].value || 0),

            compra: Number(i[3].value || 0),

            precio: Number(i[4].value || 0)

        });

    });

    return lista;

}

/*=====================================================
    Guardar cambios
======================================================*/

function guardarCambios() {

    const receta = {

        id: recetaID,

        nombre: document.getElementById("nombreProducto").value,

        categoria: document.getElementById("categoria").value,

        porciones: Number(document.getElementById("porciones").value),

        gastos: {

            gas: Number(document.getElementById("gas").value),

            luz: Number(document.getElementById("luz").value),

            agua: Number(document.getElementById("agua").value),

            empaque: Number(document.getElementById("emp").value),

            mano: Number(document.getElementById("mo").value)

        },

        ingredientes: obtenerIngredientes(),

        fechaActualizacion: new Date().toISOString()

    };

    actualizarReceta(receta);

    alert("Receta actualizada correctamente.");

    location.href = "productos.html";

}

/*=====================================================
    Eliminar fila (para futuras versiones)
======================================================*/

function eliminarFila(boton) {

    boton.closest("tr").remove();

    actualizarResumen();

}

/*=====================================================
    Nueva receta
======================================================*/

function nuevaReceta() {

    location.href = "index.html";

}