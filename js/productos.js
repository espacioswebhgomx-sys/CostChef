/*=====================================================
    COSTCHEF v1.0
    productos.js
======================================================*/

let recetas = [];
let recetasFiltradas = [];

/*=====================================================
    Inicializar
======================================================*/

document.addEventListener("DOMContentLoaded", () => {

    cargarRecetas();

    inicializarEventos();

});


/*=====================================================
    Eventos
======================================================*/

function inicializarEventos() {

    const buscar = document.getElementById("buscar");

    if (buscar) {

        buscar.addEventListener("keyup", filtrarRecetas);

    }

}


/*=====================================================
    Cargar recetas
======================================================*/

function cargarRecetas() {

    recetas = obtenerRecetas();

    recetasFiltradas = [...recetas];

    renderizar();

}


/*=====================================================
    Renderizar tarjetas
======================================================*/

function renderizar() {

    const lista = document.getElementById("lista");

    const contador = document.getElementById("contador");

    lista.innerHTML = "";

    contador.innerHTML = recetasFiltradas.length + " receta(s)";

    if (recetasFiltradas.length === 0) {

        lista.innerHTML = `

            <div class="card-vacia">

                <h2>No existen recetas</h2>

                <p>Crea tu primera receta.</p>

                <a href="index.html">

                    <button>Nueva receta</button>

                </a>

            </div>

        `;

        return;

    }

    recetasFiltradas.forEach(receta => {

        lista.innerHTML += crearTarjeta(receta);

    });

}


/*=====================================================
    Tarjeta HTML
======================================================*/

function crearTarjeta(receta) {

    return `

    <div class="card-receta">

        <div class="card-header">

            <h2>${receta.nombre}</h2>

        </div>

        <div class="card-body">

            <p>

                <strong>Categoría:</strong>

                ${receta.categoria}

            </p>

            <p>

                <strong>Porciones:</strong>

                ${receta.porciones}

            </p>

            <p>

                <strong>Actualizado:</strong>

                ${formatearFecha(receta.fechaActualizacion)}

            </p>

        </div>

        <div class="card-footer">

            <button onclick="editar('${receta.id}')">

                ✏ Editar

            </button>

            <button onclick="duplicar('${receta.id}')">

                📄 Duplicar

            </button>

            <button onclick="eliminar('${receta.id}')">

                🗑 Eliminar

            </button>

        </div>

    </div>

    `;

}


/*=====================================================
    Buscar
======================================================*/

function filtrarRecetas() {

    const texto = document

        .getElementById("buscar")

        .value

        .toLowerCase()

        .trim();

    if (texto === "") {

        recetasFiltradas = [...recetas];

    } else {

        recetasFiltradas = recetas.filter(r => {

            return (

                r.nombre.toLowerCase().includes(texto) ||

                r.categoria.toLowerCase().includes(texto)

            );

        });

    }

    renderizar();

}


/*=====================================================
    Editar
======================================================*/

function editar(id) {

    location.href =

        "receta.html?id=" + id;

}


/*=====================================================
    Duplicar
======================================================*/

function duplicar(id) {

    if (!confirm("¿Duplicar esta receta?")) {

        return;

    }

    duplicarReceta(id);

    cargarRecetas();

}


/*=====================================================
    Eliminar
======================================================*/

function eliminar(id) {

    if (!confirm("¿Eliminar esta receta?")) {

        return;

    }

    eliminarReceta(id);

    cargarRecetas();

}


/*=====================================================
    Fecha bonita
======================================================*/

function formatearFecha(fecha) {

    if (!fecha) {

        return "-";

    }

    const f = new Date(fecha);

    return f.toLocaleDateString("es-MX");

}


/*=====================================================
    Exportar
======================================================*/

function exportar() {

    exportarJSON();

}


/*=====================================================
    Importar
======================================================*/

function importar(evento) {

    const archivo = evento.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function(e) {

        if (importarJSON(e.target.result)) {

            cargarRecetas();

            alert("Importación correcta.");

        } else {

            alert("Archivo inválido.");

        }

    };

    lector.readAsText(archivo);

}


/*=====================================================
    Estadísticas
======================================================*/

function actualizarEstadisticas() {

    console.log("Recetas:", totalRecetas());

    console.log("Categorías:", totalCategorias());

}