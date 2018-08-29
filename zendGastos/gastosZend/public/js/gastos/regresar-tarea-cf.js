var pantallaRegresarTarea = {

    init : function() {

        pantallaRegresarTarea.BuscarNumeroCaso();
        pantallaRegresarTarea.RegresarTareaComprobanteFiscal();
    },
    BuscarNumeroCaso:function(){
        $("#btnNumGasto").click(function(e){
            e.preventDefault();
            var NumCaso = $("#idgastobuscar").val();
            if (  parseInt(NumCaso) > 0 ){
                $.ajax({
                    url: baseUrl + '/gastos/comprobacionfactura/lista-tareas',
                    type: 'POST',
                    data: {NumCaso : NumCaso},
                    dataType: 'html',
                    success: function(data) {
                        $('#inpTableLisResultado').html(data);
                    }
                });
                console.log("hola mundo");
                console.log(NumCaso);
            }else{
               alert("Debe Ingresar un numero de Caso Valido.");
            }

        });


    },
    RegresarTareaComprobanteFiscal:function () {

        $( document ).on({
            click : function( e ) {
                e.preventDefault();

                    var NumCaso = $('#idgastobuscar').val();
                    var APP_UID = $(this).data('app_uid');
                    var APP_USR = $(this).data('app_usr');
                    var APP_TAS = $(this).data('app_tas');
                    var APP_INDEX = $(this).data('index');
                var valida = confirm("Esta Seguro Regresar este caso :" + NumCaso );

                if (valida){
                    $.ajax({
                        url: baseUrl + '/gastos/comprobacionfactura/regresar-tarea-pm',
                        type: 'POST',
                        data: {NumCaso : NumCaso, APP_UID:APP_UID, APP_USR:APP_USR, APP_TAS:APP_TAS, APP_INDEX:APP_INDEX},
                        dataType: 'html',
                        success: function(data) {
                            $('#inpTableLisResultado').html(data);
                        }
                    });
                }


            }
        }, ".btnRegresarTarea");
    }

};
pantallaRegresarTarea.init();