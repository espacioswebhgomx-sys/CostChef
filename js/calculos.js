/* ======================================================
   COSTCHEF v1.0
   calculos.js
   Motor de cálculos
====================================================== */

const CONFIG = {
    IVA: 16,
    UTILIDAD: 40
};

/*=========================================
    Costo de un ingrediente
=========================================*/

function calcularCostoIngrediente(cantidadUsada, cantidadCompra, precioCompra){

    cantidadUsada = Number(cantidadUsada);
    cantidadCompra = Number(cantidadCompra);
    precioCompra = Number(precioCompra);

    if(cantidadCompra <= 0)
        return 0;

    return (cantidadUsada / cantidadCompra) * precioCompra;

}

/*=========================================
    Total ingredientes
=========================================*/

function calcularTotalIngredientes(){

    let total = 0;

    document.querySelectorAll("#t tbody tr").forEach(fila=>{

        const inputs = fila.querySelectorAll("input");

        const usada = Number(inputs[2].value || 0);

        const compra = Number(inputs[3].value || 0);

        const precio = Number(inputs[4].value || 0);

        const costo = calcularCostoIngrediente(
            usada,
            compra,
            precio
        );

        fila.querySelector(".cost").innerHTML = costo.toFixed(2);

        total += costo;

    });

    return total;

}

/*=========================================
    Total gastos
=========================================*/

function calcularGastos(){

    const gas = Number(document.getElementById("gas").value || 0);

    const luz = Number(document.getElementById("luz").value || 0);

    const agua = Number(document.getElementById("agua").value || 0);

    const empaque = Number(document.getElementById("emp").value || 0);

    const mano = Number(document.getElementById("mo").value || 0);

    return gas + luz + agua + empaque + mano;

}

/*=========================================
    Costo producción
=========================================*/

function calcularCostoProduccion(){

    return calcularTotalIngredientes() + calcularGastos();

}

/*=========================================
    Utilidad
=========================================*/

function calcularUtilidad(costo){

    return costo * (CONFIG.UTILIDAD / 100);

}

/*=========================================
    IVA
=========================================*/

function calcularIVA(costo){

    return costo * (CONFIG.IVA / 100);

}

/*=========================================
    Precio venta
=========================================*/

function calcularPrecioVenta(){

    const costo = calcularCostoProduccion();

    const utilidad = calcularUtilidad(costo);

    const subtotal = costo + utilidad;

    const iva = calcularIVA(subtotal);

    return subtotal + iva;

}

/*=========================================
    Costo por porción
=========================================*/

function calcularCostoPorPorcion(){

    const porciones = Number(
        document.getElementById("porciones").value || 1
    );

    if(porciones <= 0)
        return 0;

    return calcularCostoProduccion() / porciones;

}

/*=========================================
    Ganancia por porción
=========================================*/

function calcularGananciaPorPorcion(){

    const porciones = Number(
        document.getElementById("porciones").value || 1
    );

    if(porciones <= 0)
        return 0;

    const venta = calcularPrecioVenta();

    const costo = calcularCostoProduccion();

    return (venta - costo) / porciones;

}

/*=========================================
    Actualizar resumen
=========================================*/

function actualizarResumen(){

    const ingredientes = calcularTotalIngredientes();

    const gastos = calcularGastos();

    const produccion = ingredientes + gastos;

    const venta = calcularPrecioVenta();

    const porcion = calcularCostoPorPorcion();

    const ganancia = calcularGananciaPorPorcion();

    document.getElementById("ti").innerHTML =
        ingredientes.toFixed(2);

    document.getElementById("tg").innerHTML =
        gastos.toFixed(2);

    document.getElementById("cp").innerHTML =
        produccion.toFixed(2);

    document.getElementById("pv").innerHTML =
        venta.toFixed(2);

    document.getElementById("pp").innerHTML =
        porcion.toFixed(2);

    const gp = document.getElementById("gp");

    if(gp)
        gp.innerHTML = ganancia.toFixed(2);

}

/*=========================================
    Eventos automáticos
=========================================*/

function iniciarCalculos(){

    document.querySelectorAll("input").forEach(input=>{

        input.addEventListener("input",actualizarResumen);

    });

    actualizarResumen();

}

document.addEventListener("DOMContentLoaded",iniciarCalculos);