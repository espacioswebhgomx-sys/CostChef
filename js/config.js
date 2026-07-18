/*=====================================================
    COSTCHEF v1.0
    config.js
    Administración de la configuración
======================================================*/

const CONFIG_DEFAULT = {
    empresa: "",
    rfc: "",
    moneda: "MXN",
    iva: 16,
    utilidad: 40,
    logo: ""
};

/*=====================================================
    Inicializar
======================================================*/

document.addEventListener("DOMContentLoaded", () => {

    cargarConfiguracion();

    document
        .getElementById("guardarConfig")
        .addEventListener("click", guardarConfiguracionSistema);

});


/*=====================================================
    Cargar configuración
======================================================*/

function cargarConfiguracion() {

    let config = obtenerConfiguracion();

    if (!config) {

        config = CONFIG_DEFAULT;

    }

    document.getElementById("empresa").value = config.empresa || "";

    document.getElementById("rfc").value = config.rfc || "";

    document.getElementById("moneda").value = config.moneda || "MXN";

    document.getElementById("iva").value = config.iva || 16;

    document.getElementById("utilidad").value = config.utilidad || 40;

}


/*=====================================================
    Guardar configuración
======================================================*/

function guardarConfiguracionSistema() {

    const config = {

        empresa: document.getElementById("empresa").value.trim(),

        rfc: document.getElementById("rfc").value.trim(),

        moneda: document.getElementById("moneda").value,

        iva: Number(document.getElementById("iva").value),

        utilidad: Number(document.getElementById("utilidad").value),

        logo: ""

    };

    guardarConfiguracion(config);

    alert("Configuración guardada correctamente.");

}


/*=====================================================
    Restaurar valores
======================================================*/

function restaurarConfiguracion() {

    if (!confirm("¿Restablecer la configuración predeterminada?")) {

        return;

    }

    guardarConfiguracion(CONFIG_DEFAULT);

    cargarConfiguracion();

}


/*=====================================================
    Obtener moneda
======================================================*/

function obtenerMoneda() {

    return obtenerConfiguracion().moneda;

}


/*=====================================================
    Obtener IVA
======================================================*/

function obtenerIVA() {

    return Number(obtenerConfiguracion().iva);

}


/*=====================================================
    Obtener utilidad
======================================================*/

function obtenerUtilidad() {

    return Number(obtenerConfiguracion().utilidad);

}


/*=====================================================
    Obtener empresa
======================================================*/

function obtenerEmpresa() {

    return obtenerConfiguracion().empresa;

}


/*=====================================================
    Logo (Base64)
======================================================*/

const logoInput = document.getElementById("logo");

if (logoInput) {

    logoInput.addEventListener("change", function (e) {

        const archivo = e.target.files[0];

        if (!archivo) return;

        const lector = new FileReader();

        lector.onload = function () {

            const config = obtenerConfiguracion();

            config.logo = lector.result;

            guardarConfiguracion(config);

        };

        lector.readAsDataURL(archivo);

    });

}


/*=====================================================
    Mostrar información
======================================================*/

function mostrarConfiguracion() {

    console.table(obtenerConfiguracion());

}


/*=====================================================
    Validar datos
======================================================*/

function validarConfiguracion() {

    if (document.getElementById("empresa").value.trim() === "") {

        alert("Ingrese el nombre de la empresa.");

        return false;

    }

    if (Number(document.getElementById("iva").value) < 0) {

        alert("IVA incorrecto.");

        return false;

    }

    if (Number(document.getElementById("utilidad").value) < 0) {

        alert("Utilidad incorrecta.");

        return false;

    }

    return true;

}


/*=====================================================
    Guardado seguro
======================================================*/

function guardarConfiguracionSistema() {

    if (!validarConfiguracion()) {

        return;

    }

    const config = {

        empresa: document.getElementById("empresa").value,

        rfc: document.getElementById("rfc").value,

        moneda: document.getElementById("moneda").value,

        iva: Number(document.getElementById("iva").value),

        utilidad: Number(document.getElementById("utilidad").value),

        logo: obtenerConfiguracion().logo || ""

    };

    guardarConfiguracion(config);

    alert("Configuración guardada correctamente.");

}