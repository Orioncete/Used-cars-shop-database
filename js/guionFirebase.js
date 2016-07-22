
// Array que recogerá todos los objetos que se generen en el formulario--------------------------------------------

var coches = new Array;

// FUNCIONES E INSTRUCCIONES PARA FIREBASE-------------------------------------------------------------------------

var baseDeDatos = firebase.database();
baseDeDatos.ref("metaDatos").push();
baseDeDatos.ref("metaDatos").set({
    app: "base de datos de concesionario",
    version: "0.0.1",
    authors: "pedro pablo gonzalo, david carrión",
    email: "uliaoth@hotmail.com",
});

if(baseDeDatos.ref("dataBase").orderByValue()) {
    baseDeDatos.ref("dataBase").on("value", function(snapshot){
        if (snapshot.val() != null) {
            coches = snapshot.val();
        }
        muestraDatos();
    });
}
else {
    baseDeDatos.ref("dataBase").push();
    baseDeDatos.ref("dataBase").set(coches);
}

// FUNCIONES PARA LA COMPROBACION Y VALIDACION DE DATOS------------------------------------------------------------

// Función para la eliminación de simbolos comprometidos de las entradas a evaluar---------------------------------

function limpiaEntrada(cuadroEntrada) {
    var entrada = cuadroEntrada.value.trim().replace(",", ".");
    var mensaje = "", prohibidos = "";
    var carateresOut = ["<", ">", "/", "$", "(", ")", "+", "*", "%", "&", ";", "[", "]", "{", "}", '"', ":", "_", "'", "^", "¨", "=", "¿", "!", "¡", "?", "@", "·", "~", "#", "º", "ª"];
    $.each(carateresOut, function(indice, simbolo){
        if (entrada.indexOf(simbolo) != -1) {
            mensaje = "<h4 style='color:darkred;'>Los datos introducidos contienen caracteres no permitidos,<br>se va a proceder a su eliminación.</h4><br>";
            prohibidos += " " + simbolo + " ";
            $("#simbologia").html(mensaje);
            entrada = entrada.split(simbolo).join("");
            mensaje += '<h4 style="color:green;">Se han eliminado los siguientes caracteres no permitidos:<br> " ' + prohibidos.trim() + ' "</h4>';
        }
    });
    if(mensaje != ""){
        modalOn();
        $("#simbologia").html(mensaje);
    }
    $(cuadroEntrada).val(entrada);
}

// Función para comprobar que la matrícula tiene el formato esperado------------------------------------------------

function patronMatricula(cuadroMatricula) {
    var matricula = cuadroMatricula.value.replace(" ", "").replace(/-/g, "").toUpperCase();
    var expreg = /^[A-Z]{0,2}\d{4}[A-Z]{2,3}$/i;
    if (matricula.length == 0) {
        reiniciarAlerta();
        modalOn();
        muestraAlerta("<h3>Por favor, rellene el campo Matrícula,<br> ya que es necesario para realizar esta operación.</h3>", "", "transparent", "transparent", cuadroMatricula, "coral", "true");
        return false;
    }
    else {
        if(expreg.test(matricula) && matricula && matricula != ""){
            $(cuadroMatricula).val(matricula);
            muestraAlerta(null, null, null, null, cuadroMatricula, "lightgreen", "false");
            return true;
        }
        else {
            modalOn();
            muestraAlerta("<h3>La matrícula introducida no tiene el formato correcto.<br>Por favor introduzca una matrícula válida.</h3>", "<h4><u>Formatos admitidos:</u> <br><br>1234-LO<br>AB-1234-LO<br>1234-ABC</h4>", "transparent", "darkred", cuadroMatricula, "coral", "true");
            return false;
        }
    }
}

// Funcion para comprobar que la matricula no existe ya en la base de datos-------------------------------------------

function matriculaUnica(cuadroMatricula) {
    if (patronMatricula(cuadroMatricula)) {
        var duplicado = false;
        var matricula = cuadroMatricula.value.replace(" ", "").replace(/-/g, "").toUpperCase();
        $.each(coches, function(indice, coche) {
            $.each(coche, function(propiedad, valor) {
                if (propiedad == "0matricula" && valor == matricula) {
                    duplicado = true;
                }
            });
        });
        if(duplicado == true){ // Si la matrícula ya existe en la base de datos
            modalOn();
            muestraAlerta("<h3>La matrícula introducida ya existe en la base de datos.<br>Introduzca una matrícula nueva o edite los datos de la existente.</h3>", "", "transparent", "transparent", cuadroMatricula, "coral", "true");
            return false;
        }
        else { // Si la matrícula no existe en la base de datos
            muestraAlerta(null, null, null, null, cuadroMatricula, "lightgreen", "false");
            return true;
        }
    }
}

// Funcion para validar la marca del vehículo--------------------------------------------------------------------------

function validarMarca(cuadroMarca) {
    var marca = cuadroMarca.value;
    if (marca && marca != null && marca != "" && marca.length <= 15 && /^[a-zA-Z\s]+$/.test(marca)) {
        marca.toLowerCase();
        var colorTono = marca.split(" ");
        if (colorTono.length > 1) {
            marca = "";
            for (i = 0; i < colorTono.length; i++) {
                marca += colorTono[i].charAt(0).toUpperCase() + colorTono[i].slice(1).toLowerCase() + " ";
            }
        }
        else {
            marca = marca.charAt(0).toUpperCase() + marca.slice(1).toLowerCase();
        }
        marca.trim();
        $(cuadroMarca).val(marca);
        muestraAlerta(null, null, null, null, cuadroMarca, "lightgreen", "false");
        return true;
    }
    else {
        modalOn();
        muestraAlerta("<h3>Los datos introducidos no son válidos. Por favor,<br>revíselos y asegúrese de que sólo contienen nombres de <br>marcas de fabricantes (sin números).</h3>", "", "transparent", "transparent", cuadroMarca, "coral", "true");
        return false;
    }
}

// Funcion para validar el color del vehículo---------------------------------------------------------------------------

function validarColor(cuadroColor) {
    var color = cuadroColor.value;
    if (!color || color == null || color == "" || (color.length >= 3 && color.length <= 18 && /^[a-zA-Z\s]+$/.test(color))) {
        color.toLowerCase();
        var colorTono = color.split(" ");
        if (colorTono.length > 1) {
            color = "";
            for (i = 0; i < colorTono.length; i++) {
                color += colorTono[i].charAt(0).toUpperCase() + colorTono[i].slice(1).toLowerCase() + " ";
            }
        }
        else {
            color = color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
        }
        color.trim();
        $(cuadroColor).val(color);
        muestraAlerta(null, null, null, null, cuadroColor, "lightgreen", "false");
        return true;
    }
    else {
        reiniciarAlerta();
        modalOn();
        muestraAlerta("<h3>Los datos introducidos no son válidos. Por favor,<br>revíselos y asegúrese de que son <u>nombres de colores y/o tonos.</u></h3>", "No se admiten notaciones numéricas <br> tipo RGB, HSL o Pantone, p.ej.", "transparent", "darkred", cuadroColor, "coral", "true");
        return false;
    }
}

// Función para validar el precio del vehículo---------------------------------------------------------------------------

function validarPrecio(cuadroPrecio) {
    var precio = cuadroPrecio.value;
    if (precio && precio != null && precio != "" && precio.length <= 12 && /^\d+(\.\d{1,2})?$/.test(precio) && parseFloat(precio) <= 1000000 && !isNaN(precio)) {
        $(cuadroPrecio).val(parseFloat(precio).toFixed(2));
        muestraAlerta(null, null, null, null, cuadroPrecio, "lightgreen", "false");
        return true;
    }
    else {
        reiniciarAlerta();
        modalOn();
        muestraAlerta("<h3>El precio introducido no es correcto. <br>Por favor, no use <u>valores superiores al millón</u> y recuerde <br>que sólo se admiten <u>dos decimales como máximo.</u></h3>", "<h4>Tampoco introduzca unidades monetarias como € o $.</h4>", "transparent", "darkred", cuadroPrecio, "coral", "true");
        return false;
    }
}

// Función para validar el kilometraje del coche-------------------------------------------------------------------------

function validarKms(cuadroKms) {
    var kms = cuadroKms.value;
    if (!kms || kms == null || kms == "" || (kms.length >= 1 && kms.length <= 13 && /^\d+(\.\d{1,3})?$/.test(kms) && parseFloat(kms) <= 1000000 && !isNaN(kms))) {
        if (kms != "") {
            $(cuadroKms).val(parseFloat(kms).toFixed(2));
        }
        else {
            $(cuadroKms).val("");
        }
        muestraAlerta(null, null, null, null, cuadroKms, "lightgreen", "false");
        return true;
    }
    else{
        reiniciarAlerta();
        modalOn();
        muestraAlerta("<h3>El kilometraje introducido no es correcto.<br>Por favor, asegúrese de no introducir valores superiores<br>al <u>millón de kilómetros</u> ni más de <u>tres decimales</u>.</h3>", "<h4>Tampoco introduzca <br>unidades de medida,<br> ni ninguna letra o símbolo.</h4>", "transparent", "darkred", cuadroKms, "coral", "true");
        return false;
    }
}

// Función para validar el modelo del coche------------------------------------------------------------------------------

function validarModelo(cuadroModelo) {
    var modelo = cuadroModelo.value.replace("-", "");
    if(!modelo || modelo == "" || modelo.length < 2 || modelo.length >10) {
        reiniciarAlerta();
        modalOn();
        muestraAlerta("<h3>El modelo introducido no es válido. Por favor,<br>asegúrese de rellenar este campo con menos de<br><u>diez caracteres</u> (incluidos espacios).</h3>", "Si es necesario emplee abreviaturas<br> o añada sólo referencias.", "transparent", "darkred", cuadroModelo, "coral", "true");
        return false;
    }
    else {
        modelo = modelo.toLowerCase();
        if(modelo.match(/[^\d\s]/)) {
            modelo = modelo.replace(modelo.match(/[^\d\s]/)[0], modelo.match(/[^\d\s]/)[0].toUpperCase());
        }
        $(cuadroModelo).val(modelo);
        muestraAlerta(null, null, null, null, cuadroModelo, "lightgreen", "false");
        return true;
    }
}

// FUNCIONES PARA EL MANEJO INTERNO DE DATOS-----------------------------------------------------------------------------

// Función para recoger valores del formulario y generar objetos con ellos
// dichos objetos se añaden tambien al Array general en esta misma función

function recogeDatos(){
    $("#simbologia").html("");
    reiniciarAlerta();
    var matricula = document.getElementById("matricula"), marca = document.getElementById("marca"), modelo = document.getElementById("modelo"), kms = document.getElementById("kms"), color = document.getElementById("color"), precio = document.getElementById("precio");
    if(matriculaUnica(matricula) && validarMarca(marca) && validarModelo(modelo) && validarKms(kms) && validarColor(color) && validarPrecio(precio)) {
        var objeto = {}, entradas = $("input"), i=0;
        $.each(entradas, function(indice, valor){
            if (valor.name == "kms" && valor.value == "") {
                valor.value = "0";
            }
            objeto[i + valor.name] = valor.value;
            i++;
        });
        coches.unshift(objeto);
        baseDeDatos.ref("dataBase").set(coches);
        entradas.val("");
        entradas.css("background-color", "transparent");
        entradas[0].focus();
        reiniciarAlerta();
    }
    else{
        reiniciarAlerta();
        var ejemplo = "<h4>";
        if (!matriculaUnica(matricula)) {ejemplo += "&#x25CF Matrícula<br>"};
        if (!validarMarca(marca)) {ejemplo += "&#x25CF Marca<br>"};
        if (!validarModelo(modelo)) {ejemplo += "&#x25CF Modelo<br>"};
        if (!validarKms(kms)) {ejemplo += "&#x25CF Kilometraje<br>"};
        if (!validarColor(color)) {ejemplo += "&#x25CF Color<br>"};
        if (!validarPrecio(precio)) {ejemplo += "&#x25CF Precio<br>"};
        ejemplo += "</h4>";
        modalOn();
        muestraAlerta("<h3>Los siguientes campos contienen errores <br>que hacen imposible su validación <br>y admisión en la base de datos.<br><u>Por favor, revíselos;</u>", ejemplo, "transparent", "darkred", $("ejemplo"), "transparent", "false");
    }
    $("#alta").html("Alta");
    $("#alta").css("background-color", "#006dcc");
}

// FUNCIONES PARA PAGINAR LA TABLA DE CONTENIDOS------------------------------------------------------------------------------

// Función para la paginación y representación del array y los controles------------------------------------------------------

function paginadora(pagina){
    var lineasPerPage = parseInt($("#paginador").val());
    var pages =  Math.ceil((coches.length) / lineasPerPage);
    var paginas = "<button type='button' class='glyphicon glyphicon-fast-backward controlPage' id='controlInicio'></button><button type='button' class='glyphicon glyphicon-triangle-left controlPage' id='controlLeft'></button>";
    for (i=1; i<=pages; i++) {
        paginas += "<button type='button' class='paginaIcon' id='page" + i + "' value='" + i + "'>" + i + "</button>";
    }
    paginas += "</button><button type='button' class='glyphicon glyphicon-triangle-right controlPage' id='controlRight'></button><button type='button' class='glyphicon glyphicon-fast-forward controlPage' id='controlFinal'>";
    $("#paginas").html(paginas);
    $("#paginas").css({"width": ((pages * 2) + 9.6) + "em"});
    if(!pagina) {
        $(".paginaIcon").removeClass("currentPage");
        $("#page1").addClass("currentPage");
    }
    else {
        $("#page" + pagina.val()).addClass("currentPage");
    }
    if(window.innerWidth > 768) {
        $("#controlLeft").click(function (){muevePagina(-1, pages);});
        $("#controlRight").click(function (){muevePagina(+1, pages);});
    }
    $("#controlInicio").click(function(){fastStep(document.getElementById("page1"));});
    $("#controlFinal").click(function(){fastStep(document.getElementById("page" + pages));});
    $(".paginaIcon").click(function(){fastStep(this);});
    var origenPagina = (parseInt($(".currentPage").val() -1) * lineasPerPage);
    var finalPagina = origenPagina + lineasPerPage;
    if (finalPagina >= coches.length) {finalPagina = coches.length;}
    var pageContent = coches.slice(parseInt(origenPagina), parseInt(finalPagina));
    pageSelector(pagina);
    return pageContent;
}

// Función para gestionar el selector de página-----------------------------------------------------------------------------

function pageSelector(pagina){
    $(".selectorPagina").removeAttr("selected");
    $(".selectorPagina").removeAttr("disabled");
    if (!pagina || isNaN(pagina)) {
        var lineasPerPage = parseInt($("#paginador").val());
        var pages =  Math.ceil((coches.length) / lineasPerPage);
        var selectPage = "Pag. <select id='eligePagina'>";
        for (i=1; i<=pages; i++) {
            selectPage += "<option class='selectorPagina' value='" + i + "'>" + i + "</option>";
        }
        selectPage += "</select>"
        $("#selectorPagina").html(selectPage);
        $("#selectorPagina").css({"margin": ".15em .5em 0 0", "float": "right"});
        $("#eligePagina").on("change", function(){
            fastStep(document.getElementById("page" + this.value));
        });
        pagina = $(".currentPage").eq() || $(".selectorPagina").eq(pagina - 1);
    }
    else {
        if (pagina < 1) {pagina = pages}
        if (pagina > pages) {pagina = 1}
        $("#eligePagina").on("change", function(){
            fastStep(document.getElementById("page" + this.value));
        });
    }
    $(".selectorPagina").eq(pagina - 1).attr("selected", true);
    $(".selectorPagina").eq(pagina - 1).attr("disabled", true);
}

// Función para el cambio de página mediante los controles------------------------------------------------------------------

function muevePagina(step, pages) {
    $("#eligePagina").off();
    var paginaActual = $(".currentPage");
    var numeroPagina = parseInt(paginaActual.attr("id").replace("page", ""));
    paginaActual.removeClass("currentPage");
    if(numeroPagina >= 1 && numeroPagina <= pages){
        var nuevaPagina = numeroPagina + step;
    }
    if (nuevaPagina < 1) {nuevaPagina = pages}
    if (nuevaPagina > pages) {nuevaPagina = 1}
    var paginaElegida = $("#page" + nuevaPagina);
    paginaElegida.addClass("currentPage");
    muestraDatos($(".currentPage"));
    pageSelector(parseInt(paginaElegida.attr("id").replace("page", "")));
}

// Función para el cambio de página manual directo--------------------------------------------------------------------------

function fastStep(pagina) {
    $("#eligePagina").off();
    var pagina = pagina.value;
    var paginaActual = $(".currentPage");
    var numeroPagina = parseInt(paginaActual.attr("id").replace("page", ""));
    var lineasPerPage = parseInt($("#paginador").val());
    var pages =  Math.ceil((coches.length) / lineasPerPage);
    var step = parseInt(pagina) - numeroPagina;
    muevePagina(step, pages);
}

// Función para la impresión de la tabla------------------------------------------------------------------------------------

function imprimeTabla(){
    $("#modalCloser").css("display", "none");
    modalOn();
    muestraAlerta("<h3>¿Desea imprimir la tabla de referencias mostrada en pantalla?</h3>", "<button type='button' class='btn btn-primary imprimidor' value='true'>SI</button><button type='button' class='btn btn-danger imprimidor' value='false'>NO</button>", "transparent", "transparent", "#alerta", "transparent", "false");
    $(".imprimidor").click(function() {
        var acceptado = "false";
        acceptado = $(this).attr("value");
        if (acceptado == "true"){
            reiniciarAlerta();
            window.print();
        }
    reiniciarAlerta();
    $("#modalCloser").css("display", "inline-block");
    pageSelector($(".currentPage").val());
    });
}

// Función para mostrar los datos en la tabla-------------------------------------------------------------------------------

function muestraDatos(pagina){
    if(window.innerWidth > 768 && coches) {
        $("#cantidad").html("");
        $("#cantidad").html(coches.length + " ");
    }
    var pageContent = paginadora(pagina);
    var lineasPerPage =parseInt($("#paginador").val());
    var paginaActual = $(".currentPage");
    var numeroPagina = parseInt(paginaActual.attr("id").replace("page", ""));
    $("#contenidos").html("");
    $.each(pageContent, function(indice, objeto){
        var nuevoIndice = indice + (lineasPerPage * (numeroPagina - 1));
        var fila = "<tr class='lineaDatos' id='fila" + nuevoIndice + "'></tr><br>";
        $("#contenidos").append(fila);
        $.each(objeto, function(nombre, valor){
                $("#fila" + nuevoIndice).append("<td id='" + nombre + nuevoIndice + "'>" + valor + "</td>");
        });
        $("#fila" + nuevoIndice).parent().children().last().append("<button onclick='editaDatos(this);' class='botonEdit glyphicon glyphicon-pencil'></button><button onclick='borraDatos(this);' class='botonBorrar glyphicon glyphicon-trash'></button>");
        $(".botoncicos").css("width", "4em");
    });
    if(window.innerWidth <= 768) {
        $("tbody td").click(function(){
            reiniciarAlerta();
            modalOn();
            var info = ""
            var hijos = this.parentElement.getElementsByTagName("td");
            $.each(hijos, function(indice, objeto){
                var nombreObjeto = objeto.id.replace(/\d/g, "");
                info += "<h4><u>" + nombreObjeto.charAt(0).toUpperCase() + nombreObjeto.slice(1).toLowerCase() + ":</u> " + objeto.textContent + "</h4><br>";
            });
            muestraAlerta("", info, "transparent", "brown", "modalCloser", "transparent", "false");
        });
    }
}

// Funciones para borrar datos del Array "base de datos" (coches)-----------------------------------------------------------

function borraDatos(boton) {
    if ($(boton).hasClass("botonBorrar")) {
        var matricula = $(boton).parent().children().first().text();
        reiniciarAlerta();
        modalOn();
        $("#modalCloser").css("display", "none");
        muestraAlerta("<h3>¿Realmente desea eliminar los datos referentes a la matrícula " + matricula + " ?</h3>", "<button type='button' id='confirmar' class='btn btn-danger' value='true'>SI</button><button type='button' id='denegar' class='btn btn-primary' value='false'>NO</button>", "transparent", "transparent", "#alerta", "transparent", "false");
        $("#ejemplo button").click(function() {
            var acceptado = "false";
            acceptado = $(this).attr("value");
            if (acceptado == "true"){
                var identificador = $(boton).parent().attr("id");
                var indice = identificador.replace("fila", "");
                coches.splice(parseInt(indice), 1);
                baseDeDatos.ref("dataBase").set(coches);
            }
        $("#modalCloser").css("display", "inline-block");
        muestraDatos($(".currentPage"));
        reiniciarAlerta();
        pageSelector($(".currentPage").val());
        });
    }
    else {
        var identificador = $(boton).parent().attr("id");
        var indice = identificador.replace("fila", "");
        coches.splice(parseInt(indice), 1);
        reiniciarAlerta();
        pageSelector($(".currentPage").val());
    }
}

// Función para modificar datos del Array "base de datos" (coches)-----------------------------------------------------------

function editaDatos(boton) {
    var linea = boton;
    $(".botonEdit").attr("onclick", "return false;");
    $(".botonBorrar").attr("onclick", "return false;");
    var identificador = $(linea).parent().attr("id");
    var indice = identificador.replace("fila", "");
    $.each(coches[parseInt(indice)], function(nombre,valor){
    nombre = nombre.slice(1);
        $("#" + nombre).val(valor);
    });
    baseDeDatos.ref("dataBase").set(coches);
    $("#alta").html("Confirmar");
    $("#alta").css("background-color", "#32c932");
    borraDatos(linea);
    $("#alta").click(function(){
        $(".botonEdit").attr("onclick", "editaDatos(this);");
        $(".botonBorrar").attr("onclick", "borraDatos(this);");
    });
}


// FUNCIONES DE BUSQUEDA EN LA BASE DE DATOS--------------------------------------------------------------------------------

// La primera gestiona el cuadro de busqueda y la segunda efetua dicha busqueda y pinta los datos en la tabla---------------


function cuadroBusqueda() {
    $("form input").css("background-color", "transparent");
    reiniciarAlerta();
    $("#simbologia").html("");
    $("#buscador").css({"font-size": "1.5em", "color": "#006dcc"});
    $("#buscador").html("<div id='searchBox' class='col-xs-12 col-md-8 col-md-offset-2'><select id='tipoBusqueda' autofocus class='text-center col-xs-10 col-sm-4'><option value='void' selected disabled>-- Buscar por --</option><option value='matricula'>Matrícula</option><option value='marca'>Marca</option><option value='modelo'>Modelo</option><option value='kms'>Kilometraje max.</option><option value='color'>Color</option><option value='precio'>Precio máximo</option></select><input id='valorBusqueda' onfocus='this.select();' type='text' maxlenght='12' width='12' placeholder='Buscar' class='col-xs-10 col-sm-4 col-lg-5'><button id='lupa' type='button' class='glyphicon glyphicon-search col-xs-11 col-sm-2 col-md-1' onclick='buscaDatos(tipoBusqueda.value, valorBusqueda);'></button></div>");
    $("#valorBusqueda").css("text-align", "right");
    $("#tipoBusqueda").css("text-align", "center");
    $("#tipoBusqueda").css("height", "1.7em");
    $("#searchBox").css({"background-color": "lightgrey", "border-radius": ".3em"});
    $("#lupa").css("margin-left", ".5em");
    $("#buscar").css("display", "none");
    $("#volverBusqueda").css("display", "inline-block");
    $("#tipoBusqueda").focus();
    $("#cuerpo").mouseup(function(newFocus){
        if ((!$("#searchBox").is(newFocus.target) && $("#searchBox").has(newFocus.target).length == 0 && !$("#buscar").is(newFocus.target) && !$("#modalCloser").is(newFocus.target) && !$("#confirmar").is(newFocus.target) && !$("#denegar").is(newFocus.target) && !$(".botonBorrar").is(newFocus.target) && !$(".botonEdit").is(newFocus.target) && !$("#printButton").is(newFocus.target) && !$(".imprimidor").is(newFocus.target)) || $("#volverBusqueda").is(newFocus.target)) {
            reiniciarAlerta();
            $("#buscador").html("");
            $("#buscador").css("background-color", "transparent");
            muestraDatos($(".currentPage"));
            pageSelector($(".currentPage").val());
            $("#volverBusqueda").css("display", "none");
            $("#buscar").css("display", "inline-block");
            $("#cuerpo").off();
        }
    });
}

function buscaDatos(tipo, termino) {
    if(tipo == "void" || !tipo) {
        reiniciarAlerta();
        modalOn();
        muestraAlerta("<h3>Por favor, elija el tipo de valor<br>sobre el que desea efectuar la búsqueda,<br>en el campo señalado en azul.</h3>", "", "transparent", "transparent", "#tipoBusqueda", "cyan", "true");
    }
    else {
        limpiaEntrada(termino);
        if((tipo == "matricula" && patronMatricula(termino)) || (tipo == "marca" && validarMarca(termino)) || (tipo == "modelo" && validarModelo(termino)) || (tipo == "kms" && validarKms(termino)) || (tipo == "color" && validarColor(termino)) || (tipo == "precio" && validarPrecio(termino))) {
            reiniciarAlerta();
            modalOn();
            muestraAlerta("", "No se han encontrado coincidencias.<br>Por favor revise los terminos de búsqueda.", "transparent", "darkred", "#valorBusqueda", "coral", "false");
            $("#contenidos").html("");
            $.each(coches, function(indice, coche) {
                $.each(coche, function(propiedad, valor) {
                    if ((tipo == propiedad.slice(1) && termino.value == valor) || (tipo == propiedad.slice(1) && propiedad.slice(1) == "color" && valor.indexOf(termino.value) != -1) || (tipo == propiedad.slice(1) && propiedad.slice(1) == "precio" && parseFloat(valor) < parseFloat(termino.value)) || (tipo == propiedad.slice(1) && propiedad.slice(1) == "kms" && parseFloat(valor) < parseFloat(termino.value))) {
                        var fila = "<tr class='lineaDatos' id='fila" + indice + "'></tr><br>";
                        $("#contenidos").append(fila);
                        $.each(coche, function(propiedad, valor) {
                            $("#fila" + indice).append("<td id='" + propiedad + indice + "'>" + valor + "</td>");
                        });
                        $("#fila" + indice).parent().children().last().append("<button onclick='editaDatos(this);' class='botonEdit glyphicon glyphicon-pencil'></button><button onclick='borraDatos(this);' class='botonBorrar glyphicon glyphicon-trash'></button>");
                        $(".botoncicos").css("width", "4em");
                        $("#" + propiedad + indice).css("background-color", "lightgreen");
                        reiniciarAlerta();
                        $("#valorBusqueda").css("background-color", "transparent");
                    }
                });
            });
            $("#buscar").css("background-color", "#006dcc");
            $("#buscar").css("color", "beige");
        }
    }
}

// FUNCIONES PARA EL MANEJO DE ALERTAS AL USUARIO----------------------------------------------------------------------------

// Función para mostrar alertas----------------------------------------------------------------------------------------------

function muestraAlerta(textoAlerta, textoEjemplo, estiloAlerta, estiloEjemplo, cuadroOrigen, colorCuadro, volver) {
    $("#alerta").html(textoAlerta);
    $("#alerta").css("background-color", estiloAlerta);
    $("#ejemplo").html(textoEjemplo);
    $("#ejemplo").css("background-color", estiloEjemplo);
    $(cuadroOrigen).css("background-color", colorCuadro);
    if (volver == "true") {
        $(cuadroOrigen).focus().select().val("");
    }
}

// Funcion para reiniciar los cuadros de dialogo-----------------------------------------------------------------------------

function reiniciarAlerta(){
    $("#modalWindow").css("display", "none");
    $("#alerta").html("");
    $("#ejemplo").html("");
    $("#ejemplo").css("background-color", "transparent");
}

// Funcion para abrir la ventana modal---------------------------------------------------------------------------------------

function modalOn(){
    $("#modalWindow").css("display", "block");
}

$(function(){ // FUNCION GLOBAL DE jQuery------------------------------------------------------------------------------------

    // Manejadores de evento de los botones----------------------------------------------------------------------------------

    $("#alta").click(function(){recogeDatos(); muestraDatos($(".currentPage")); pageSelector($(".currentPage").val());});
    $("#buscar").click(function(){cuadroBusqueda()});
    $("#printButton").click(function(){imprimeTabla()});

    // Manejador de evento del selector de lineas de la tabla----------------------------------------------------------------

    $("#paginador").change(function(){muestraDatos($("#page1")); pageSelector();});

    // Manejadores de evento de los campos input-----------------------------------------------------------------------------

    $("#matricula").change(function(){limpiaEntrada(this); matriculaUnica(this);});
    $("#marca").change(function(){limpiaEntrada(this); validarMarca(this);});
    $("#color").change(function(){limpiaEntrada(this); validarColor(this);});
    $("#precio").change(function(){limpiaEntrada(this); validarPrecio(this);});
    $("#kms").change(function(){limpiaEntrada(this); validarKms(this);});
    $("#modelo").change(function(){limpiaEntrada(this); validarModelo(this);});

    // Manejadores de cierre de alerta modal---------------------------------------------------------------------------------

    $("#modalCloser").click(function(){reiniciarAlerta();});

    // Manejadores de entradas tactiles para mobile--------------------------------------------------------------------------

    var inicio;
    if(window.innerWidth <= 768) {
        document.getElementById("tabla").addEventListener('touchstart', function(primerToque){
            primerToque.stopPropagation();
            var toque1st = primerToque.changedTouches[0];
            inicio = parseInt(toque1st.clientX);
            document.getElementById("tabla").addEventListener('touchend', function(segundoToque){
                segundoToque.stopImmediatePropagation();
                var toqueLast = segundoToque.changedTouches[0];
                var dist = parseInt(toqueLast.clientX) - inicio;
                var lineasPerPage = parseInt($("#paginador").val());
                var pages =  Math.ceil((coches.length) / lineasPerPage);
                if (Math.abs(dist) > 50) {
                    if (dist > 0) {
                        muevePagina(-1, pages);
                    }
                    if (dist < 0) {
                        muevePagina(+1, pages);
                    }
                }
            });
        });
    }
})