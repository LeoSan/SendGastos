//@ sourceURL=/gastosfact/public/js/convenios/parrafos.js

$(".grid-title").html("Administraci&oacute;n de p&aacute;rrafos");

function deleteParrafo( url ){
    var request = $.ajax({
        url: url,
        method: "GET",
    });

    request.done(function( res ) {
        $("ul.dropdown-menu li a[rel-module='convenios'][rel-controller='parrafos']").click();
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed: " + textStatus );
    });
}

function openParrafo( idParrafo ){
    window.open('http://10.73.98.126/pendulum/contratos/version2/openParagraph.php?bd=workflow&parrafo=' + idParrafo, 'Contrato', 'directories=no, titlebar=no, toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
}

function editParrafo( idParrafo ){
    window.open('http://10.73.98.126/pendulum/contratos/version2/editParagraph.php?bd=workflow&parrafo=' + idParrafo, 'Contrato', 'directories=no, titlebar=no, toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
}

function newParrafo(){
    window.open('http://10.73.98.126/pendulum/contratos/version2/newParagraph.php', 'Contrato', 'directories=no, titlebar=no, toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
}