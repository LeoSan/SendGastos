//@ sourceURL=/gastosfact/public/js/convenios/estructuras.js

$(".grid-title").html("Estructuras de convenios");
var paragraphs = $( "select#add-up-parrafos option" ).clone();

$( "#carteras" ).change(function() {
    cartera   = $('#carteras').find(':selected').val();
    documento = $('#documentos').find(':selected').val();
    subtipo   = $('#subtipos').find(':selected').val();

    $('#inventario-estructuras-wrapper ul.estructura li').remove();
    if ( cartera > 0 && documento > 0 && subtipo > 0 ) {
        getEstructura(cartera, documento, subtipo);
    }
    getDocumentos( cartera );
});

$( "#documentos" ).change(function() {
    cartera   = $('#carteras').find(':selected').val();
    documento = $('#documentos').find(':selected').val();
    subtipo   = $('#subtipos').find(':selected').val();

    $('#inventario-estructuras-wrapper ul.estructura li').remove();
    if ( cartera > 0 && documento > 0 && subtipo > 0 ) {
        getEstructura(cartera, documento, subtipo);
    }
    getSubtipos( cartera, documento );
});

$( "#subtipos" ).change(function() {
    cartera   = $('#carteras').find(':selected').val();
    documento = $('#documentos').find(':selected').val();
    subtipo   = $('#subtipos').find(':selected').val();

    $('#inventario-estructuras-wrapper ul.estructura li').remove();
    if ( cartera != 0 && documento != 0 && subtipo != 0 ){
        getEstructura( cartera, documento, subtipo );
    }
});

$( "#add-up-carteras" ).change(function() {
    cartera   = $('#add-up-carteras').find(':selected').val();
    documento = $('#add-up-documentos').find(':selected').val();
    subtipo   = $('#add-up-subtipos').find(':selected').val();

    $('#modalAddUpEstructura ul.estructura li').remove();
    if ( cartera != 0 && documento > 0 && subtipo > 0 ) {
        $("#modalAddUpEstructura select#add-up-estructura").removeAttr('disabled');
        $("#modalAddUpEstructura select#add-up-parrafos").removeAttr('disabled');
        $("#modalAddUpEstructura select#add-up-parrafos option").removeAttr('disabled');
    }
    //getDocumentosNotAdded( cartera );
});

$( "#add-up-documentos" ).change(function() {
    cartera   = $('#add-up-carteras').find(':selected').val();
    documento = $('#add-up-documentos').find(':selected').val();
    subtipo   = $('#add-up-subtipos').find(':selected').val();

    $('#modalAddUpEstructura ul.estructura li').remove();
    if ( cartera != 0 && documento > 0 && subtipo > 0 ) {
        $("#modalAddUpEstructura select#add-up-estructura").removeAttr('disabled');
        $("#modalAddUpEstructura select#add-up-parrafos").removeAttr('disabled');
    }
    getSubtiposNotAdded( cartera, documento );
});

$( "#add-up-subtipos" ).change(function() {
    cartera   = $('#add-up-carteras').find(':selected').val();
    documento = $('#add-up-documentos').find(':selected').val();
    subtipo   = $('#add-up-subtipos').find(':selected').val();

    $('#modalAddUpEstructura ul.estructura li').remove();
    if ( cartera != 0 && documento > 0 && subtipo > 0 ) {
        $("#modalAddUpEstructura select#add-up-estructura").removeAttr('disabled');
        $("#modalAddUpEstructura select#add-up-parrafos").removeAttr('disabled');
        $("#modalAddUpEstructura select#add-up-parrafos option").removeAttr('disabled');
    }
});

$( "#btnShowAddEstructura" ).click(function() {
    restoreWindowForAdd();
    $('#modalAddUpEstructura').modal();
});

$( "#btnShowEditEstructura" ).click(function() {
    var url = baseUrl + '/convenios/estructuras/getestructura';
    //var url = baseUrl + '/convenios/estructuras/getestructuraids';
    var cartera = $( "select#carteras").val();
    var documento = $( "select#documentos").val();
    var subtipo = $("select#subtipos").val();
    var subtipo_txt = $("select#subtipos").text();
    //var to_delete = array();

    var request = $.ajax({
        url: url,
        method: "GET",
        data: { cartera : cartera, documento : documento, subtipo : subtipo },
        dataType: "json"
    });

    request.done(function( res ) {
        console.log( "cartera: " + $("select#add-up-carteras").val() );
        $("h3#lblModalEstructura").html("Editar estructura");
        $("input#add-up-carteras-label").val(cartera);
        //$("input#add-up-carteras-hidden").val(cartera);
        $("input#add-up-carteras-label").show();
        $("select#add-up-carteras").hide();

        console.log( "documento: " + $("select#add-up-documentos").val() );
        $("input#add-up-documentos-label").val( $('select#documentos option:selected').text() );
        $("input#add-up-documentos-hidden").val(documento);
        $("input#add-up-documentos-label").show();
        $("select#add-up-documentos").hide();

        console.log( "subtipo: " + $("select#add-up-subtipos").val() );
        $("input#add-up-subtipos-label").val( $('select#subtipos option:selected').text() );
        $("input#add-up-subtipos-hidden").val( $('select#subtipos option:selected').value );
        $("input#add-up-subtipos-label").show();
        $("select#add-up-subtipos").hide();
        console.log( res );
        /**/
        first = 1;
        $.each(res, function(k, v) {
            var ejecuta = "";
            if( v.FCEJECUTA == null ){
                ejecuta = "";
            }else{
                ejecuta = v.FCEJECUTA;
            }
            if ( $('div#modalAddUpEstructura form#frmAddUpEstructura select#add-up-estructura option[value="' + v.IDPARRAFO + '"]').length == 0 ){
                $('div#modalAddUpEstructura form#frmAddUpEstructura select#add-up-estructura').append( '<option value="' + v.IDPARRAFO + '">' + v.FCDESCRIPCION + '</option>' );
            }
            //$('div#modalAddUpEstructura form#frmAddUpEstructura select#add-up-estructura').append( '<li style="list-style-type: none;"><table style="width: 40%"><tr><td style="width: 5%">' + v.FNORDEN + '</td><td style="width: 60%">' + v.FCDESCRIPCION + '</td><td style="width: 10%"></td><td style="width: 20%">' + ejecuta + '</td></tr></table></li>' );
        });
        /**/
        $( "div#modalAddUpEstructura form#frmAddUpEstructura select#add-up-estructura option" ).each(function( index ) {
            //console.log( "--> " + 'div#modalAddUpEstructura form#frmAddUpEstructura select#add-up-parrafos option[value="' + this.value + '"]' );
            if( $('div#modalAddUpEstructura form#frmAddUpEstructura select#add-up-parrafos option[value="' + this.value + '"]').length > 0 ){
                //console.log( "Deleted --> " + this.value );
                $('div#modalAddUpEstructura form#frmAddUpEstructura select#add-up-parrafos option[value="' + this.value + '"]').prop('disabled', 'disabled');
                //$('div#modalAddUpEstructura form#frmAddUpEstructura select#add-up-parrafos option[value="' + this.value + '"]').remove();

            }
        });
        /*
        $( "div#modalAddUpEstructura form#frmAddUpEstructura select#add-up-estructura option" ).each(function( index ) {
            //console.log( "--> " + index + ": " + this.value );
        });
        */
        $("div#modalAddUpEstructura h3.lblModalEstructura").html("Editar estructura");
        $("select#add-up-estructura").prop( "disabled", false );
        $("select#add-up-parrafos").prop( "disabled", false );

        $('#modalAddUpEstructura').modal();
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed documentos: " + textStatus );
    });
});

$( "#btnShowDeleteEstructura" ).click(function() {
    var r = confirm( "Desea eliminar la estructura?" );

    if ( r == true ){
        cartera   = $('#carteras').find(':selected').val();
        documento = $('#documentos').find(':selected').val();
        subtipo   = $('#subtipos').find(':selected').val();
        deleteEstructura( cartera, documento, subtipo );
    }
});

$( "#btnAddParrafo" ).click(function() {
    var option = $( "select#add-up-parrafos option:selected" ).clone();
    $( "select#add-up-parrafos option:selected").prop('disabled', 'disabled');
    if ( option ){
        $( "select#add-up-estructura").append( option );
    }
    $("select#add-up-parrafos option:selected").removeAttr("selected");
});

$( "#btnDeleteParrafo" ).click(function() {
    var option = $( "select#add-up-estructura option:selected" );
    if ( option ){
        //$( "select#add-up-parrafos" ).append( option );
        //console.log( "Selector = " + $("select#add-up-parrafos option[value='" + $("select#add-up-estructura option:selected").val() + "']")).val();
        $("select#add-up-parrafos option[value='" + $("select#add-up-estructura option:selected").val() + "']").prop("disabled", false);
        $("select#add-up-parrafos option[value='" + $("select#add-up-estructura option:selected").val() + "']").prop("selected", false);
        //$("select#add-up-parrafos option[value='" + $("select#add-up-estructura option:selected").val() + "']").removeAttr("selected");
        $("select#add-up-estructura option:selected").remove();
    }
});

$( "#btnGuardarEstructura" ).click(function() {
    var url = baseUrl + '/convenios/estructuras/saveestructura';

    if ( $("h3#lblModalEstructura").html() == "Editar estructura" ){    //edit
        if ( $("select#add-up-estructura option").length == 0 ){
            alert( "Debe al menos tener una opci&oacute;n en la estructura. En caso de querer borrar seleccione cartera, documento, subtitpo y posteriormente borrar" );
            return;
        }
        var cartera = $("input#add-up-carteras-label").val();
        var documento = $("input#add-up-documentos-hidden").val();
        var subtipos = $("input#add-up-subtipos-hidden").val();
    }else{                                                              //add
        var cartera = $( "select#add-up-carteras").val();
        var documento = $( "select#add-up-documentos").val();
        var subtipos = $("select#add-up-subtipos").val();
    }

    var estructura = "";
    var i = 0;
    $("select#add-up-estructura option").each(function()
    {
        if( i == 0 ){
            estructura = $(this).val();
        }else{
            estructura = estructura + "," + $(this).val();
        }
        i = 1;
    });

    var request = $.ajax({
        url: url,
        method: "GET",
        data: { cartera : cartera, documento : documento, subtipo : subtipo, estructura : estructura },
        dataType: "json"
    });

    request.done(function( res ) {
        console.log( res );
        $( "#btnModalCancelar" ).trigger( "click" );
        $("div.navbar ul li a[rel-module='convenios'][rel-controller='estructuras']").click();
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed documentos: " + textStatus );
    });
});

$( "#btnModalCancelar" ).click(function() {
    $("#modalAddUpEstructura select#add-up-subtipos").prop('disabled', 'disabled');
    $("#modalAddUpEstructura select#add-up-subtipos option").remove();

    $("#modalAddUpEstructura select#add-up-estructura").prop('disabled', 'disabled');
    $("#modalAddUpEstructura select#add-up-estructura option").remove();
    $("#modalAddUpEstructura select#add-up-parrafos").prop('disabled', 'disabled');

    $("#modalAddUpEstructura select#add-up-carteras").val( $("#modalAddUpEstructura select#add-up-carteras option:first").val() );
    $("#modalAddUpEstructura select#add-up-documentos").val( $("#modalAddUpEstructura select#add-up-documentos option:first").val() );
});

function getDocumentos( cartera ){
    var url = baseUrl + '/convenios/estructuras/getdocumentos';

    var request = $.ajax({
        url: url,
        method: "GET",
        data: { cartera : cartera },
        dataType: "json"
    });

    request.done(function( res ) {
        console.log( res );
        if ( $('select#documentos option').length ){
            $('select#documentos option').remove();
        }

        i = 0;
        $.each(res, function(k, v) {
            if ( i == 0 ){
                $('select#documentos').append( '<option value="0">Seleccionar:</option>');
                $('select#documentos').removeAttr('disabled');
                $('button#btnShowEditEstructura').prop('disabled', 'disabled');
                $('button#btnShowDeleteEstructura').prop('disabled', 'disabled');
            }
            $('select#documentos').append( '<option value="' + v.IDTPODOCTO + '">' + v.NMTPODOCTO + '</option>' );
            i = 1;
        });
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed documentos: " + textStatus );
    });
}

function getSubtiposNotAdded( cartera, documento ){
    var url = baseUrl + '/convenios/estructuras/getsubtiposnotadded';

    var request = $.ajax({
        url: url,
        method: "GET",
        data: { cartera : cartera, documento : documento },
        dataType: "json"
    });

    request.done(function( res ) {
        console.log( res );
        if ( $('select#add-up-subtipos option').length ){
            $('select#add-up-subtipos option').remove();
        }

        var i = 0;
        $.each(res, function(k, v) {
            if ( i == 0 ){
                $('select#add-up-subtipos').append( '<option value="0">Seleccionar:</option>');
                $('select#add-up-subtipos').removeAttr('disabled');
            }
            $('select#add-up-subtipos').append( '<option value="' + v.IDSBTIPO + '">' + v.NMSBTIPO + '</option>' );
            i = 1;
        });
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed documentos: " + textStatus );
    });
}

function getSubtipos( cartera, documento ){
    var url = baseUrl + '/convenios/estructuras/getsubtipos';

    var request = $.ajax({
        url: url,
        method: "GET",
        data: { cartera : cartera, documento : documento },
        dataType: "json"
    });

    request.done(function( res ) {
        console.log( res );
        if ( $('select#subtipos option').length ){
            $('select#subtipos option').remove();
        }

        var i = 0;
        $.each(res, function(k, v) {
            if ( i == 0 ){
                $('select#subtipos').append( '<option value="0">Seleccionar:</option>');
                $('select#subtipos').removeAttr('disabled');
                $('button#btnShowEditEstructura').prop('disabled', 'disabled');
                $('button#btnShowDeleteEstructura').prop('disabled', 'disabled');
            }
            $('select#subtipos').append( '<option value="' + v.IDSBTIPO + '">' + v.NMSBTIPO + '</option>' );
            i = 1;
        });
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed documentos: " + textStatus );
    });
}

function getEstructura( cartera, documento, subtipo ){
    var url = baseUrl + '/convenios/estructuras/getestructura';

    var request = $.ajax({
        url: url,
        method: "GET",
        data: { cartera : cartera, documento : documento, subtipo : subtipo },
        dataType: "json"
    });

    request.done(function( res ) {
        console.log( res );
        //console.log( res.length );
        $('#inventario-estructuras-wrapper ul.estructura li').remove();
        $.each(res, function(k, v) {
            var ejecuta = "";
            if( v.FCEJECUTA == null ){
                ejecuta = "";
            }else{
                ejecuta = v.FCEJECUTA;
            }
            $('#inventario-estructuras-wrapper ul.estructura').append( '<li style="list-style-type: none;"><table style="width: 40%"><tr><td style="width: 5%">' + v.FNORDEN + '</td><td style="width: 60%">' + v.FCDESCRIPCION + '</td><td style="width: 10%"></td><td style="width: 20%">' + ejecuta + '</td></tr></table></li>' );
        });
        if ( res.length > 0 ) {
            $('button#btnShowEditEstructura').removeAttr('disabled');
            $('button#btnShowDeleteEstructura').removeAttr('disabled');
        }
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed: " + textStatus );
    });
}

function deleteEstructura( cartera, documento, subtipo ){
    var url = baseUrl + '/convenios/estructuras/deleteestructura';

    var request = $.ajax({
        url: url,
        method: "GET",
        data: { cartera : cartera, documento : documento, subtipo : subtipo },
        dataType: "json"
    });

    request.done(function( res ) {
        console.log( res );
        if ( res == 1 ) {
            console.log(1);
            $("div.navbar ul li a[rel-module='convenios'][rel-controller='estructuras']").click();
        }
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed: " + textStatus );
    });
}

function restoreWindowForAdd(){
    $("h3#lblModalEstructura").html("Agregar estructura");
    $("input#add-up-carteras-label").hide();
    $("select#add-up-carteras").show();
    $("input#add-up-documentos-label").hide();
    $("select#add-up-documentos").show();
    $("input#add-up-subtipos-label").hide();
    $("select#add-up-subtipos").show();
    $( "div#modalAddUpEstructura form#frmAddUpEstructura select#add-up-estructura option" ).remove();
    $( "select#add-up-parrafos option" ).remove();
    paragraphs.each(function( index ) {
        $( "select#add-up-parrafos" ).append( this );
    });
}