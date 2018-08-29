//@ sourceURL=/gastosfact/public/js/convenios/tractos.js

$(".grid-title").html("Administraci&oacute;n de tractos");

$( "#carteras" ).change(function() {
    value = $('#carteras').find(':selected').val();
    getTractos( value );
});

function getTractos( cartera ){
    var url = baseUrl + '/convenios/tractos/get-tractos';

    var request = $.ajax({
        url: url,
        method: "GET",
        data: { cartera : cartera },
        dataType: "json"
    });

    request.done(function( res ) {
        console.log( res );
        //result = jQuery.parseJSON( res );
        $('#inventario-tractos-wrapper table').remove();
        $('#inventario-tractos-wrapper').append(  '<table style="width: 40%" />' );
        //console.log( res );
        $.each(res, function(k, v) {
            $('#inventario-tractos-wrapper table').append( '<tr><td style="width: 10%">'
                + v.IDTRACTOCESION
                + '</td><td style="width: 45%">'
                + v.FCORIGCEDENTE
                + '</td><td style="width: 15%"><a href="#" onclick="javascript:openTracto( ' + v.IDTRACTOCESION + ')">Ver</a></td>' +
                '<td style="width: 15%"><a href="#" onclick="javascript:editTracto( ' + v.IDTRACTOCESION + ')">Editar</a>' +
                '</td><td style="width: 15%"><a href="javascript:deleteTracto(\''
                + baseUrl
                + '/convenios/tractos/delete/tracto/'
                + v.IDTRACTOCESION
                + '\');">Borrar</a></td></tr>' );
        });
    });
    /*
     $('#inventario-tractos-wrapper table').append( '<tr><td style="width: 10%">'
     + v.IDTRACTOCESION
     + '</td><td style="width: 45%">'
     + v.FCORIGCEDENTE
     + '</td><td style="width: 15%"><a href="http://10.73.98.2/pendulum/contratos/version2/openTracto.php?bd=workflow&tracto='
     + v.IDTRACTOCESION
     + '" target="_blank">Ver</a></td><td style="width: 15%"><a href="http://10.73.98.2/pendulum/contratos/version2/editTracto.php?bd=workflow&tracto='
     + v.IDTRACTOCESION
     + '" target="_blank">Editar</a></td><td style="width: 15%"><a href="javascript:deleteTracto(\''
     + baseUrl
     + '/convenios/tractos/delete/tracto/'
     + v.IDTRACTOCESION
     + '\');">Borrar</a></td></tr>' );
    */
    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed: " + textStatus );
    });
}

function deleteTracto( url ){
    var request = $.ajax({
        url: url,
        method: "GET",
        //data: { cartera : cartera },
        //dataType: "json"
    });

    request.done(function( res ) {
        //console.log( res );
        $( "#carteras" ).trigger('change');
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed: " + textStatus );
    });
}

function openTracto( idTracto ){
    var rand = Math.floor((Math.random() * 1000) + 1);
    window.open('http://quantum1.pendulum.com.mx/pendulum/contratos/version2/openTracto.php?r=' + rand + '&bd=workflow&tracto=' + idTracto, 'Contrato', 'directories=no, titlebar=no, toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
}

function editTracto( idTracto ){
    window.open('http://quantum1.pendulum.com.mx/pendulum/contratos/version2/editTracto.php?bd=workflow&tracto=' + idTracto, 'Contrato', 'directories=no, titlebar=no, toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
}

function newTracto(){
    window.open('http://quantum1.pendulum.com.mx/pendulum/contratos/version2/newTracto.php', 'Contrato', 'directories=no, titlebar=no, toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
}