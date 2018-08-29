var ReportesGenarchivoscomproba = {
    init : function() {
        $(".grid-title").html("Generación de archivos de comprobación");
        ReportesGenarchivoscomproba.contarSeleccionados();
        $( "#checkAll" ).click(function(e){
            $("#tablaArchivosAnticipos input[type=checkbox]").each(function(e){
                if( $(this).attr('id') != 'checkAll' ){
                    var checado = $("#checkAll").is(':checked');

                    if( $("#checkAll").is(':checked') == true ){
                        $(this).prop( "checked", true);
                    }else{
                        $(this).prop( "checked",false );
                    }
                }
            });
            ReportesGenarchivoscomproba.contarSeleccionados();
        });


        $( document ).on({
            click : function( e ) {
                if( $(this).is(":checked") == false ){
                    $("#checkAll").prop( "checked",false );
                }

                ReportesGenarchivoscomproba.contarSeleccionados();
            }
        }, "#tablaArchivosAnticipos .checkbox");

        $("#btnGenerarArchivo").click(function(e){
            e.preventDefault();
            var userid = $("#noEmpleado").html();
            var folio = $("#noFolio").val();
            var url = baseUrl + "/planesdeviaje/reportes/generararchivocomproba?userid=" + userid + "&folio=" + folio;
            window.open( url ,'_blank');
        });

        $("#btnFinalizar").click(function(e){
            Layout.showLoading();
            Menu.loadModuleMenu('planesdeviaje', 'contabilidad', 'archivocomprobanuevo', '#');
            Layout.hideLoading();
        });

        $("#btnGuardar").off('click').on('click',function(e){
            e.preventDefault();

            $("#btnGuardar").attr('disabled', 'disabled' );
            $("#btnGuardar").text('Por favor espere....');

            var idsGastos = '';
            var anticipo = '';
            var userid = $("#noEmpleado").html();
            var pantalla = 'setArchAnticipo';

            //Numero de seleccionados
            var nsel = 0;
            nsel = $("#tablaArchivosAnticipos").find("input[type=checkbox]:checked").length;
            if( nsel == 0 ){
                alert("Seleccione los gatos a procesar.");
                return false;
            }

            $("#tablaArchivosAnticipos input[type=checkbox]").each(function(e){
                if( $(this).attr('id') != 'checkAll' ){
                    var checado = $("#checkAll").is(':checked');

                    if( $(this).is(':checked') == true ){
                        idsGastos += $(this).attr( "planviaje" ) + "|";
                        anticipo += $(this).attr( "importe" ) + "|";
                    }
                }
            });
            Layout.showLoading();
            //Aplicamos a conntabilidad
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: baseUrl + '/planesdeviaje/reportes/setgeneraarchivoscomproba',
                data: {
                    idGasto	: idsGastos,
                    anticipo: anticipo,
                    userid	: userid,
                    pantalla: pantalla
                },
                success: function (data) {
                    console.log(data);
                    Layout.hideLoading();
                    if (data.success == true) {
                        $("#noFolio").val(data.folio);
                        $("#btnGenerarArchivo").show();
                        $("#btnFinalizar").show();
                        $("#btnGuardar").hide();
                    } else {
                        alert("Ocurrio un error: " + data.msg);
                    }
                }
            });
            return false;
        });
    },// End Init()
    resetearCampos : function() {
        $("#idCategoria").val("0");
        $("#categoria").val("");
        $("#divStatus").hide();
        $("#status").val("A");
        $('#lblFormModalSuc').html("Agregar sucursal");
        $("#status-activo").addClass("active");
        $("#status-inactivo").removeClass("active");
    },// End Init()
    contarSeleccionados : function() {
        var seleccionados = 0;
        var importe = 0;
        var importeAvion = 0;
        var importeAuto = 0;
        var importeViatico = 0;
        var importeSaldoFavor = 0;
        var cadena = '';
        var cadenaArray = '';
        var anticipo = '';
        var avion = '';
        var auto = '';
        var viaticos = '';
        var saldoFavor = '';
        $("#tablaArchivosAnticipos input[type=checkbox]").each(function(e){
            //console.log( $(this).attr("checked") );
            if( $(this).attr("name") != "checkAll" ){
                if( $(this).is(':checked') ) {
                    //cada elemento seleccionado
                    seleccionados += 1;
                    anticipo = $(this).attr('importe');
                    avion =$(this).attr('avion');
                    auto =$(this).attr('auto');
                    viaticos =$(this).attr('viaticos');
                    saldoFavor =$(this).attr('saldofavor');
                    //cadenaArray = cadena.split("-");
                    //anticipo = $("#importe-" + cadenaArray[1] ).html();
                    importe += parseFloat( anticipo.replace( ",", "") );
                    importeAvion += parseFloat( avion.replace( ",", "") );
                    importeAuto += parseFloat( auto.replace( ",", "") );
                    importeViatico += parseFloat( viaticos.replace( ",", "") );
                    importeSaldoFavor += parseFloat( saldoFavor.replace( ",", "") );
                }
            }
        });


        $("#anticipoSeleccionados").html(seleccionados);
        $("#importeADepositar").html( "$ " +  parseFloat(importe).toFixed(2) );
        $("#importeAvionADepositar").html( "$ " +  parseFloat(importeAvion).toFixed(2) );
        $("#importeAutoADepositar").html( "$ " +  parseFloat(importeAuto).toFixed(2) );
        $("#importeViaticoADepositar").html( "$ " +  parseFloat(importeViatico).toFixed(2) );
        $("#importeSaldoFavorADepositar").html( "$ " +  parseFloat(importeSaldoFavor).toFixed(2) );
    }
};
function checkBox(e)
{
    e = e||event;/* get IE event ( not passed ) */
    e.stopPropagation? e.stopPropagation() : e.cancelBubble = true;
    //Selecciona y deselecciona todos los checks
    $("#tablaDepositoAnticipos input[type=checkbox]").each(function(e){
        $(this).attr( "checked", $("#checkAll").is(':checked') );
    });

    ReportesGenarchivoscomproba.contarSeleccionados();
}
ReportesGenarchivoscomproba.init();