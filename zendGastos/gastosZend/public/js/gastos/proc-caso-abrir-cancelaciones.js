var pantallaAbrirCancelaciones = {
    msjEspere:"<div id='msjEspere' class='alert alert-warning' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Mensaje : </span> Por favor espere.</div>",
    msjAlerta01:"<div id='msjAlerta01' class='alert alert-warning'  role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Mensaje : </span> Este caso no esta cancelado.</div>",

    init : function() {
        pantallaAbrirCancelaciones.BuscarNumeroCaso();
        pantallaAbrirCancelaciones.btnDetalleHistorico();
        pantallaAbrirCancelaciones.confirmaEliminar();
        pantallaAbrirCancelaciones.BuscadorEmpleado();

    },
    BuscarNumeroCaso:function(){
        $("#btnNumGasto").click(function(e){
            e.preventDefault();
            var NumCaso = $("#idgastobuscar").val();
            if (  parseInt(NumCaso) > 0 ){
                $.ajax({
                    url: baseUrl + '/gastos/comprobacionfactura/lista-caso-abrir',
                    type: 'POST',
                    data: {NumCaso : NumCaso},
                    dataType: 'html',
                    beforeSend: function () {
                        $('#inpTableLisResultado').html(pantallaAbrirCancelaciones.msjEspere);
                    },

                    success: function(data) {

                        if (data == false){
                            $('#inpTableLisResultado').html(pantallaAbrirCancelaciones.msjAlerta01);
                        }else{

                            $('#inpTableLisResultado').html(data);
                        }
                    }
                });
            }else{
                alert("Debe Ingresar un numero de Caso Valido.");
            }

        });
    },
    BuscadorEmpleado:function(){
        //Asi se declara el typeahead

        $('#inpUsuarioAsigna').typeahead({
            source: function (query, process) {
                states = [];
                map = {};
                $.ajax({
                    type: "POST",
                    url: baseUrl + '/catalogos/soporte/getresponsable',
                    data: { texto: query },
                    dataType: 'json',
                    success: function(data) {
                        console.log(data);
                        $.each(data.empleados, function (i, state) {
                            map[state.NOMBRE] = state;
                            states.push(state.NOMBRE);
                        });
                        process(states);
                    }
                });
            },
            updater: function (item) {
                selectedState = map[item].UID;
                $("#inpHiddenUSRUIDAsigna").val(selectedState);
                return item;
            },
            showHintOnFocus:'all'
        });

    },
    btnDetalleHistorico:function () {
        $( document ).on({
            click : function( e ) {
                e.preventDefault();
                var NumCaso = $(this).data("id_caso");
                $.ajax({
                    url: baseUrl + '/gastos/comprobacionfactura/lista-bitacora-caso',
                    type: 'POST',
                    data: {NumCaso : NumCaso},
                    dataType: 'html',
                    beforeSend: function () {
                        $('#divHistoricoBitacora').html(pantallaAbrirCancelaciones.msjEspere);
                    },

                    success: function(data) {

                        if (data == false){
                            $('#divHistoricoBitacora').html(pantallaAbrirCancelaciones.msjAlerta01);
                        }else{
                            $('#divHistoricoBitacora').html(data);
                        }
                    }
                });


            }
        }, ".btnDetalleHistorico");
    },
    btnAbrirCaso:function () {

        $( document ).on({
            click : function( e ) {
                e.preventDefault();

                var NumCaso = $("#inpIdCaso").val();
                $.ajax({
                    url: baseUrl + '/gastos/comprobacionfactura/interfaz-llenar-nota',
                    type: 'POST',
                    data: {NumCaso : NumCaso },
                    dataType: 'html',
                    beforeSend: function () {
                        $('#divHistoricoBitacora').html(pantallaAbrirCancelaciones.msjEspere);
                    },
                    success: function(data) {
                        if (data == false){
                            $('#divHistoricoBitacora').html(pantallaAbrirCancelaciones.msjAlerta01);
                        }else{
                            $(this).attr('disable', 'disable');
                            $('#divHistoricoBitacora').html(data);


                        }
                    }
                });


            }
        }, ".btnAbrirCaso");
    },
    procesoGuardar:function () {
        var NumCaso = $("#inpIdCaso").val();
        var inpNota = $("#inpNota").val();

        var nomUsuarioCaso = $("#inpUsuarioCaso").val();
        var nomUsuarioAsigna = $("#inpUsuarioAsigna").val();

        var inpUsuarioCaso = $("#inpUsuarioCasoUSRUID").val();
        var inpUsuarioAsigna = $("#inpHiddenUSRUIDAsigna").val();
                $.ajax({
                    url: baseUrl + '/gastos/comprobacionfactura/proceso-abrir-caso-cancelado',
                    type: 'POST',
                    data: {NumCaso : NumCaso, inpNota:inpNota, inpUsuarioCaso:inpUsuarioCaso, inpUsuarioAsigna:inpUsuarioAsigna, nomUsuarioCaso:nomUsuarioCaso, nomUsuarioAsigna:nomUsuarioAsigna },
                    dataType: 'html',
                    beforeSend: function () {
                        $('#divHistoricoBitacora').html(pantallaAbrirCancelaciones.msjEspere);
                    },
                    success: function(data) {
                        if (data == false){
                            $('#inpTableLisResultado').html(pantallaAbrirCancelaciones.msjAlerta01);
                        }else{
                            $(this).attr('disable', 'disable');
                            $('#inpTableLisResultado').html(data);
                            $('#divHistoricoBitacora').html(pantallaAbrirCancelaciones.msjAlerta01);
                        }
                    }
                });
    },
    confirmaEliminar:  function (){
        $( document ).on("click", "#btnGuardar",  function () {
            var id = $("#inpIdCaso").val();
            pantallaAbrirCancelaciones.modalMensaje('Confirmación','¿ Está seguro de abrir este caso '+id+' ?', id, 'eliminar');

        });
    },
    modalMensaje:function (titulo1, mensaje, valor, proceso) {

        BootstrapDialog.show({
            title: titulo1,
            message: mensaje,
            cssClass:'prueba',
            type:'type-danger',
            size:'size-normal',
            closable:true,
            spinicon:'glyphicon glyphicon-eur',
            buttons: [{
                id: 'btn-remove',
                icon: 'glyphicon glyphicon-remove',
                label: 'No',
                cssClass: 'btn-danger',
                action: function(dialog) {
                    dialog.close();
                }
            }, {
                id: 'btn-ok',
                icon: 'glyphicon glyphicon-check',
                label: 'Si',
                cssClass: 'btn-info',
                autospin: false,
                action: function(dialog){
                    pantallaAbrirCancelaciones.procesoGuardar();
                    dialog.close();

                }
            }]
        });

    },

};
pantallaAbrirCancelaciones.init();