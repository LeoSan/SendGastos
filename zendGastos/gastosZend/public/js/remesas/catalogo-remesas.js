var procesoRemesas = {
    //Declaracion Variables
    EstruturaMesajeExito: '<div class="alert alert-success"> <span class="glyphicon glyphicon-ok"></span> <span> i_mensaje</span> </div>',
    EstruturaMesajeInfo: '<div class="alert alert-info"> <span class="glyphicon glyphicon-ok"></span> <span> i_mensaje</span> </div>',
    EstruturaMesajePeligro: '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> <span> i_mensaje</span> </div>',
    EstruturaMesajeAdvertencia: '<div class="alert alert-warning"> <span class="glyphicon glyphicon-info-sign"></span> <span> i_mensaje</span> </div>',
    mensajeExito01:  '! Almacenamiento exitoso de Datos ¡',
    mensajeExito02:  '! Almacenamiento exitoso del Archivo ¡',
    mensajeExito03:  '! Validacion exitosa del archivo ¡',
    mensajeExito04:  '! Carga exitosa del archivo ¡',
    mensajeExito05:  '! Registro eliminado ¡',
    mensajePeligro01:  '! Falla en el almacenamiento, intente mas tarde ¡',
    mensajeAdvertencia02:'! Debe seleccionar un archivo valido¡',
    mensajeAdvertencia03:'! Hubo Problema con la validacion, por favor revise el archivo CSV ¡',
    mensajeAdvertencia04:'! El monto suministrado no puede ser superior al importe ¡',
    //Metodo Inicial
    init: function () {
        procesoRemesas.renderGrid();
        procesoRemesas.changeRegional();
        procesoRemesas.changeConcepto();
        procesoRemesas.seltipoAnticipo();
        procesoRemesas.changeMoneda();
        procesoRemesas.procesoGuardado();
        procesoRemesas.procesoGuardadoFicha();
        procesoRemesas.validaTeclado();
        procesoRemesas.procesoMuestra();
        procesoRemesas.procesoMuestraFicha();
        procesoRemesas.validaDeshabilitar();
        procesoRemesas.validaHabilitar();
        procesoRemesas.procesoDeleteFicha();
        procesoRemesas.procesoUpload();

        procesoRemesas.procesoCargaMasivo();
        procesoRemesas.procesoCargaMasivoVerifica();
        procesoRemesas.procesoCargaMasivoProcesa();
        procesoRemesas.funtCerrarReload();
        procesoRemesas.funtLimpiarForm();
        procesoRemesas.cargaCalendario();
        procesoRemesas.obtenerCvetra();

    },// fin init
    renderGrid: function () {
        var alto = $(document).height();
        var ancho = $(document).width();
        var grid = $('#jqGridRemesa').jqGrid({
            //  url: baseUrl + '/remesas/index/obtener-json-remesa',
            datatype: "local",
            data: jsondata,
            autowidth: true,
            shrinkToFit: true,
            height: 300,
            ignoreCase: true,
            colModel: [
                {label: 'ID', name: 'ID_REMESA', key: true, align:'right', width:"55", sortable: true, sorttype: 'integer'},
                {label: 'Co. anticipo', name: 'ID_ANTICIPO',sortable: true},
                {label: 'Concepto', name: 'NOM_CONCEPTO',sortable: true },
                {label: 'Nombre', name: 'NOM_REMESA',sortable: true},
                {label: 'Región', name: 'ID_REGIONAL',sortable: true},
                {label: 'Importe deposito', name: 'IMPORTE_DEPOSITO', align:'right', sortable: true, sorttype: 'integer'},
                {label: 'Importe comprobado', name: 'IMPORTE_COMPROBADO', align:'right', sortable: true, sorttype: 'integer'},
                {label: 'Estatus', name: 'ESTATUS',sortable: true},
                {label: 'Fecha registro', name: 'FECHA_REGISTRO',sortable: true},
                {label: 'Fecha inicio', name: 'FECHA_INICIO',sortable: true},
                {label: 'Fecha fin', name: 'FECHA_FIN',sortable: true},
                {label: 'Tipo', name: 'TIPO_ANTICIPO',sortable: true},
                {label: 'Usuario', name: 'NOM_EMPLEADO',sortable: true},
                {label: 'Acción', name: 'ACCION',sortable: true },
            ],
            viewrecords: true,
            //multiselect: true,
            rowNum: 200,
            pager: "#jqGridjqGridRemesa",
            sortorder: "asc",
        });
        $('#jqGridRemesa').jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false, defaultSearch: "cn"});
        $("#inpAccion").val("Insertar");
    },
    refreshGrid: function (result) {
        var json = JSON.stringify(eval("(" + result.json + ")"));
        var result = JSON.parse(json);
        $('#jqGridRemesa').jqGrid('clearGridData');
        $('#jqGridRemesa').jqGrid('setGridParam', {data: result}).trigger('reloadGrid', [{page: 1}]);
        $("#inpAccion").val("Insertar");
    },
    changeRegional:function () {
        $(document).on("change", "#selRegional", function () {
            var valor = $("#selRegional option:selected").val();
            $("#inpRegional").val(valor);
        });
    },
    seltipoAnticipo:function () {
        $(document).on("change", "#seltipoAnticipo", function () {
            var valor = $("#seltipoAnticipo option:selected").val();
            $("#inptipoAnticipo").val(valor);
        });
    },
    changeConcepto:function () {
        $(document).on("change", "#selConcepto", function () {
            var valor = $("#selConcepto option:selected").val();
            $("#inpConcepto").val(valor);
        });
    },
    changeMoneda:function () {
        $(".mascaraFloat").on({
            "focus": function (event) {
                $(event.target).select();
            },
            "keyup": function (event) {
                $(event.target).val(function (index, value ) {
                    return value.replace(/\D/g, "")
                        .replace(/([0-9])([0-9]{2})$/, '$1.$2')
                        .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
                });
            }
        });
    },
    procesoGuardado: function () {
        //ValInicio - No puede ser mayor que fin
        $.validator.addMethod("valInicio", function(value, element) {
            //Fecha Inicio
            var arrayIni = new Array();
            arrayIni     = value.split('/');
            var f1       = new Date(arrayIni[2], arrayIni[1], arrayIni[0]); //y/m/d

            //Fecha fin
            var myString = $("#inpFechaFin").val();
            var arrayFin = new Array();
            arrayFin     = myString.split('/');
            var f2       = new Date(arrayFin[2], arrayFin[1], arrayFin[0]);//y/m/d

            //validacion
            if (f1 > f2 )
                return false;
            return true;

        }, "Disculpe la fecha inicio no puede ser mayor que fecha fin!");

        //ValInicio - No puede ser mayor que fin
        $.validator.addMethod("valFin", function(value, element) {
            //Fecha fin
            var arrayIni = new Array();
            arrayIni     = value.split('/');
            var fin       = new Date(arrayIni[2], arrayIni[1], arrayIni[0]); //y/m/d

            //Fecha inicio
            var myString = $("#inpFechaInicio").val();
            var arrayFin = new Array();
            arrayFin     = myString.split('/');
            var inicio      = new Date(arrayFin[2], arrayFin[1], arrayFin[0]);//y/m/d

            //validacion
            if (fin > inicio )
                return true;
            return false;

        }, "Disculpe la fecha FIN no puede ser menor que fecha inicio!");

        var validaCampos = $(function () {//esto permite convertir todo el validate en una funcion
            $("#formRemesa").validate({
                event: "blur",
                rules: {
                    inpNombre: {
                        required: true
                    },
                    inpMonto: {
                        required: true
                    },
                    selRegional: {
                        required: true
                    },
                    inpCoAnticipo: {
                        required: true
                    },
                    selConcepto: {
                        required: true
                    },
                    seltipoAnticipo: {
                        required: true
                    },
                    inpFechaInicio: {
                        required: true,
                        valInicio: true

                    },
                    inpFechaFin: {
                        required: true,
                        valFin:true

                    },

                },
                messages: {
                    inpNombre: {
                        required: "Este campo es obligatorio.",
                    },
                    inpMonto: {
                        required: "Este campo es obligatorio.",
                    },
                    selRegional: {
                        required: "Este campo es obligatorio.",
                    },
                    inpCoAnticipo: {
                        required: "Este campo es obligatorio.",
                    },
                    selConcepto: {
                        required: "Este campo es obligatorio.",
                    },
                    seltipoAnticipo: {
                        required: "Este campo es obligatorio.",
                    },
                    inpFechaInicio: {
                        required: "Este campo es obligatorio.",
                        valInicio: "Disculpe la fecha inicio no puede ser mayor que fecha fin.",
                    },
                    inpFechaFin: {
                        required: "Este campo es obligatorio.",
                        valFin: "Disculpe la fecha fin no puede ser menor que fecha inicio.",

                    },
                }
                , debug: true
                , errorElement: "label"
                , submitHandler: function (form) {
                    var val = $("#cvtraEmpleado").text();
                    $("#inpEmpleado").val( val );

                    var formData = new FormData();
                    formData.append('file_recibo', $('#file_recibo')[0].files[0]);
                    formData.append('inpAccion', $('#inpAccion').val());
                    formData.append('inpIDremesa', $('#inpIDremesa').val());
                    formData.append('inpUrlAcuse', $('#inpUrlAcuse').val());
                    formData.append('inpEmpleado', $('#inpEmpleado').val());
                    formData.append('inpNombre', $('#inpNombre').val());
                    formData.append('inpMonto', $('#inpMonto').val());
                    formData.append('inpRegional', $('#inpRegional').val());
                    formData.append('inpCoAnticipo', $('#inpCoAnticipo').val());
                    formData.append('inpConcepto', $('#inpConcepto').val());
                    formData.append('inptipoAnticipo', $('#inptipoAnticipo').val());
                    formData.append('inpFechaInicio', $('#inpFechaInicio').val());
                    formData.append('inpFechaFin', $('#inpFechaFin').val());
                    formData.append('inpFechaFin', $('#inpFechaFin').val());
                    formData.append('inpFechaFin', $('#inpFechaFin').val());
                    formData.append('selRegional', $('#selRegional option:selected').val());
                    formData.append('selConcepto', $('#selConcepto option:selected').val());

                    if ($("#inpAccion").val() == "Editar"){
                        var url = baseUrl + '/remesas/index/procesa-remesa';
                    }else{
                        var url = baseUrl + '/remesas/index/uploadfile';
                    }

                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: formData, //el data es tu objeto formData
                        processData: false, //indicas a jQuery que no procese la información
                        contentType: false //indicas a jQuery que no configure el contentType del request
                        ,beforeSend: function( ) {
                            $("#btnGuardar").attr("disabled","disabled");
                        }
                    }).done(function(data) {
                        data = $.parseJSON(data);
                        var json = JSON.stringify(eval("(" + data + ")"));
                        var result = JSON.parse(json);
                        if ( result.valida == 'false' ) {
                            $("#btnGuardar").removeAttr("disabled");
                            var str = procesoRemesas.EstruturaMesajeAdvertencia;
                            var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeAdvertencia02);
                            $(".msjRespuesta").html(respHtml);
                        }

                        if ( result.valida == 'true' ) {
                            $("#sMontoDeposito").html(result.montoDeposito);
                            $("#sMontoComprobado").html(result.montoComprobado);

                            procesoRemesas.refreshGrid(result);
                            $("#btnGuardar").attr("disabled","disabled");
                            document.getElementById("formFichaDeposito").reset();
                            var str = procesoRemesas.EstruturaMesajeExito;
                            var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeExito01);
                            $(".msjRespuesta").html(respHtml);

                            setTimeout(function(){
                                $("#inpConcepto").removeAttr("disabled");
                                $("#inpCoAnticipo").removeAttr("disabled");
                                $("#inpFechaInicio").removeAttr("disabled");
                                $("#inpFechaFin").removeAttr("disabled");
                                $("#inpMonto").removeAttr("disabled", "disabled");
                                $("#spTitulomodalRegEdir").html("Registrar");
                                $("#bntTitulomodalRegEdir").html("Registrar");
                                $("#forIdFile").show();
                                $(".msjRespuesta").html("");
                                $("#exampleModal").modal("hide");
                                $("#btnGuardar").removeAttr("disabled");
                            }, 3000);

                        }

                    }).fail(function() {
                        console.log("error");
                    })
                },
                errorPlacement: function (error, element) {
                    error.insertBefore(element.parent().next('div').children().first());
                },
                highlight: function (element) {
                    $(element).parent().next('div').show();
                    $(element).parent().next('div').addClass("error");
                    $(element).parent().find('span').addClass('glyphicon-red');
                },
                unhighlight: function (element) {
                    //$(element).parent().next('div').hide();
                    $(element).parent().find('span').removeClass('glyphicon-red');
                }
            })//fin del validate
        });//Esto permite transformar el validate en una funcion y encapsularla en la clase
    },
    procesoMuestra: function () {
        $(document).on("click", ".btnEdita", function () {

            var Remesa = $(this).attr("data-Remesa");
            var NOM_REMESA = $(this).attr("data-NOM_REMESA");
            var MONTO_REMESA = $(this).attr("data-MONTO_REMESA");
            var ESTATUS = $(this).attr("data-ESTATUS");
            var FECHA_REGISTRO = $(this).attr("data-FECHA_REGISTRO");
            var FECHA_CAMBIO = $(this).attr("data-FECHA_CAMBIO");
            var CVETRA = $(this).attr("data-CVETRA");
            var ID_REGIONAL = $(this).attr("data-ID_REGIONAL");
            var ID_ANTICIPO = $(this).attr("data-ID_ANTICIPO");
            var ID_CONCEPTO = $(this).attr("data-ID_CONCEPTO");
            var FECHA_INICIO = $(this).attr("data-FECHA_INICIO");
            var FECHA_FIN = $(this).attr("data-FECHA_FIN");
            var TIPO_ANTICIPO = $(this).attr("data-TIPO_ANTICIPO");

            $("#inpIDremesa").val(Remesa);
            $("#inpNombre").val(NOM_REMESA);
            $("#inpMonto").val(  MONTO_REMESA.replace(/\D/g, "").replace(/([0-9])([0-9]{2})$/, '$1.$2').replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") );
            $("#inpMonto").attr("disabled", "disabled");
            $("#inpRegional").val(ID_REGIONAL);
            $("#selRegional").val(ID_REGIONAL);
            $("#inpCoAnticipo").val(ID_ANTICIPO);
            $("#inpCoAnticipo").attr("disabled", "disabled");
            $("#inpConcepto").val(ID_CONCEPTO);
            $("#selConcepto").val(ID_CONCEPTO);
            $("#inpConcepto").attr("disabled", "disabled");

            $("#inpFechaInicio").val(FECHA_INICIO);
            $("#inpFechaFin").val(FECHA_FIN);

            $("#inptipoAnticipo").val(TIPO_ANTICIPO);
            $("#seltipoAnticipo").val(TIPO_ANTICIPO);

            $("#spTitulomodalRegEdir").html("Editar");
            $("#bntTitulomodalRegEdir").html("Editar");
            $("#inpConcepto").attr("disabled", "disabled");
            $("#inpAccion").val("Editar");
            $("#inpFechaInicio").attr("disabled","disabled" );
            $("#inpFechaFin").attr("disabled","disabled");
            $("#forIdFile").hide();

            $("#btnGuardar").removeAttr("disabled");
            $(".msjRespuesta").html("");

        });
    },
    procesoDeleteFicha: function () {
        $(document).on("click", ".btnElimiFicha", function () {
            var idFicha = $(this).attr("data-id_ficha");
            var idRemesa = $(this).attr("data-id_remesa");
            var montoFicha = $(this).attr("data-montoficha");
            $(".msjRespuestaFicha").html("");
            var varCompuesta = idFicha+"-"+idRemesa+"-"+montoFicha;


            procesoRemesas.modalMensaje('Confirmación', '¿Está seguro de eliminar este registro?', varCompuesta, 'btnEliminarFicha');

        });
    },
    procesoMuestraFicha: function () {
        $(document).on("click", ".btnFichaAjuste", function () {
            var Remesa  = $(this).attr("data-Remesa");
            var monto   = $(this).attr("data-monto");
            var importe = $(this).attr("data-importe");

            $("#inpIdRemesa").val(Remesa);
            $("#inpMontoF").val(monto);
            $("#inpImpote").val(importe);
            $(".msjRespuestaFicha").html(' ');

            $.ajax({
                url: baseUrl + '/remesas/index/obtener-ficha',
                type: 'POST',
                data:{inpIdRemesa: Remesa},
                dataType: 'html',
            }).done(function(data) {
                //coloco la tabulación.
                $("#trTableFicha").html(data);

            }).fail(function() {
                $("#trTableFicha").html("Error de conexió");
            })

        });
    },
    procesoUpload: function () {
        $(document).on("click", "#btnCargarRecibo", function () {
            var formData = new FormData();
            formData.append('file_recibo', $('#file_recibo')[0].files[0]);
            var url = baseUrl + '/remesas/index/uploadfile';
            $.ajax({
                url: url,
                type: 'POST',
                data: formData, //el data es tu objeto formData
                processData: false, //indicas a jQuery que no procese la información
                contentType: false //indicas a jQuery que no configure el contentType del request
            }).done(function(data) {
                data = $.parseJSON(data);

                if ( data.valida == 'false' ) {
                    var str = procesoRemesas.EstruturaMesajeAdvertencia;
                    var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeAdvertencia02);
                    $(".msjRespuesta").html(respHtml);
                }

                if ( data.valida == 'true' ) {
                    var str = procesoRemesas.EstruturaMesajeExito;
                    var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeExito02);
                    $(".msjRespuesta").html(respHtml);
                    $("#inpUrlAcuse").val(data.url);
                }

            }).fail(function() {
                console.log("error");
            })

        });
    },
    procesoCargaMasivo: function () {
        $(document).on("click", "#btnCargarMasiva", function () {
            var formData = new FormData();
            formData.append('file_csv', $('#file_csv')[0].files[0]);
            var url = baseUrl + '/remesas/index/uploadfile-remesa';
            $.ajax({
                url: url,
                type: 'POST',
                data: formData, //el data es tu objeto formData
                processData: false, //indicas a jQuery que no procese la información
                contentType: false //indicas a jQuery que no configure el contentType del request
            }).done(function(data) {
                data = $.parseJSON(data);

                if ( data.valida == 'false' ) {
                    var str = procesoRemesas.EstruturaMesajeAdvertencia;
                    var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeAdvertencia02);
                    $(".msjRespuestaMasiva").html(respHtml);
                }

                if ( data.valida == 'true' ) {
                    var str = procesoRemesas.EstruturaMesajeExito;
                    var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeExito02);
                    $(".msjRespuestaMasiva").html(respHtml);
                    $("#inpUrlMasivo").val(data.url);
                    $("#btnCargarMasivaVerifica").removeAttr('disabled');
                }

            }).fail(function() {
                console.log("error");
            })

        });
    },
    procesoCargaMasivoVerifica: function () {
        $(document).on("click", "#btnCargarMasivaVerifica", function () {
            $.ajax({
                url: baseUrl + '/remesas/index/validaarchivoasigna-remesa',
                type: 'POST',
                data: "archivo=" + $("#inpUrlMasivo").val() + "&solicitudid=" + procesoRemesas.obtenerCvetra(),
                dataType: 'json',
            }).done(function(data) {
                //data = $.parseJSON(data);

                if ( data.valida == 'fail' ) {
                    var str = procesoRemesas.EstruturaMesajeAdvertencia;
                    var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeAdvertencia03);
                    $(".msjRespuestaMasiva").html(respHtml);
                }

                if ( data.valida == 'success' ) {
                    var str = procesoRemesas.EstruturaMesajeInfo;
                    var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeExito03);
                    $(".msjRespuestaMasiva").html(respHtml);
                    $("#btnCargarMasivaProcesar").removeAttr('disabled');
                }

            }).fail(function() {
                console.log("error");
            })

        });
    },
    procesoCargaMasivoProcesa: function () {
        $(document).on("click", "#btnCargarMasivaProcesar", function () {
            $.ajax({
                url: baseUrl + '/remesas/index/carga-remesa-masivo',
                type: 'POST',
                data: "archivo=" + $("#inpUrlMasivo").val() + "&solicitudid=" + procesoRemesas.obtenerCvetra(),
                dataType: 'json',
            }).done(function(data) {

                if ( data.valida == 'fail' ) {
                    var str = procesoRemesas.EstruturaMesajeAdvertencia;
                    var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeAdvertencia03);
                    $(".msjRespuestaMasiva").html(respHtml);
                }

                if ( data.valida == 'success' ) {
                    var str = procesoRemesas.EstruturaMesajeExito;
                    var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeExito04);
                    $(".msjRespuestaMasiva").html(respHtml);
                    $("#btnCargarMasivaVerifica").attr('disabled', 'disabled');
                    $("#btnCargarMasivaProcesar").attr('disabled', 'disabled');
                }

            }).fail(function() {
                console.log("error");
            })

        });
    },

    procesoDeshabilitar: function (valor, proceso) {
        if (proceso == 'btnDeshabilitar'){
            var inpAccion = 'Deshabilitar'
        }else if ( proceso == "btnEliminarFicha"){
            var inpAccion = 'EliminarFicha'
        }else{
            var inpAccion = 'Habilitar'

        }

        $.ajax({
            type: "POST",
            url: baseUrl + '/remesas/index/procesa-remesa',
            processData: true,
            dataType: 'html',
            data: {inpAccion: inpAccion, inpIdRemesa: valor, inpEmpleado: procesoRemesas.obtenerCvetra() },
            success: function (data) {
                var json = JSON.stringify(eval("(" + data + ")"));
                var result = JSON.parse(json);
                procesoRemesas.refreshGrid(result);
                //coloco la tabulación.
                if ( proceso == "btnEliminarFicha") {

                    $("#trTableFicha").html(result.json_tr);

                    if ( result.valida == 'false' ) {
                        var str = procesoRemesas.EstruturaMesajeAdvertencia;
                        var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeAdvertencia02);
                        $(".msjRespuestaFicha").html(respHtml);
                    }

                    if ( result.valida == 'true' ) {
                        procesoRemesas.refreshGrid(result);
                        var str = procesoRemesas.EstruturaMesajeExito;
                        var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeExito05);
                        document.getElementById("formFichaDeposito").reset();
                        $(".msjRespuestaFicha").html(respHtml);
                    }

                }

            }
        });

    },
    procesoGuardadoFicha: function () {
        var validaCampos = $(function () {//esto permite convertir todo el validate en una funcion
            $("#formFichaDeposito").validate({
                event: "blur",
                rules: {
                    inpMontoFicha: {
                        required: true
                    },
                    file_ficha: {
                        required: true
                    },
                },
                messages: {
                    inpMontoFicha: {
                        required: "Este campo es obligatorio.",
                    },
                    file_ficha: {
                        required: "Este campo es obligatorio.",
                    },
                }
                , debug: true
                , errorElement: "label"
                , submitHandler: function (form) {
                    //Extraigo la id empleado
                    var val = $("#cvtraEmpleado").text();
                    $("#inpEmpleadoFicha").val( val );
                    //Cargo las variables de esta forma para componer la carga de archivo con ajax
                    var formData = new FormData();
                    formData.append('file_ficha', $('#file_ficha')[0].files[0]);
                    formData.append('inpMontoFicha', $('#inpMontoFicha').val());
                    formData.append('inpIdRemesa', $('#inpIdRemesa').val());
                    formData.append('inpEmpleadoFicha', $('#inpEmpleadoFicha').val());

                    var url = baseUrl + '/remesas/index/uploadfile-ficha';

                    var monto    =  parseFloat($("#inpMontoF").val());
                    var importe  =  parseFloat($("#inpImpote").val());
                    var inpMontoFicha  = $('#inpMontoFicha').val();
                    var newInpMontoFicha = 0;

                    if( inpMontoFicha.indexOf(",") != -1 ){
                        newInpMontoFicha =  inpMontoFicha.replace(",", ""); // Cien
                        newInpMontoFicha = newInpMontoFicha.replace(",", ""); // mil
                        newInpMontoFicha = newInpMontoFicha.replace(",", "");//millon
                    }else{
                        newInpMontoFicha =  inpMontoFicha
                    }

                    var total = importe + parseFloat(newInpMontoFicha);

                    //Valido Manualmente
                    if( parseFloat(monto) < parseFloat( total ) ){

                        var str = procesoRemesas.EstruturaMesajePeligro;
                        var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeAdvertencia04);
                        $(".msjRespuestaFicha").html(respHtml);
                        return false;
                    }else{
                        $(".msjRespuestaFicha").html('');
                    }

                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: formData, //el data es tu objeto formData
                        processData: false, //indicas a jQuery que no procese la información
                        contentType: false //indicas a jQuery que no configure el contentType del request
                        ,beforeSend: function( ) {
                            $("#btnGuardarFicha").attr("disabled","disabled");
                        }
                    }).done(function(data) {
                        data = $.parseJSON(data);
                        var json = JSON.stringify(eval("(" + data + ")"));
                        var result = JSON.parse(json);
                        //coloco la tabulación.
                        $("#trTableFicha").html(result.json_tr);

                        if ( result.valida == 'false' ) {
                            var str = procesoRemesas.EstruturaMesajeAdvertencia;
                            var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeAdvertencia02);
                            $(".msjRespuestaFicha").html(respHtml);
                        }

                        if ( result.valida == 'true' ) {
                            procesoRemesas.refreshGrid(result);
                            var str = procesoRemesas.EstruturaMesajeExito;
                            var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeExito02);
                            document.getElementById("formFichaDeposito").reset();
                            $(".msjRespuestaFicha").html(respHtml);
                            $("#inpImpote").val(total);
                            $("#btnGuardarFicha").removeAttr("disabled");
                        }

                    }).fail(function() {
                        console.log("error");
                    })
                },
                errorPlacement: function (error, element) {
                    error.insertBefore(element.parent().next('div').children().first());
                },
                highlight: function (element) {
                    $(element).parent().next('div').show();
                    $(element).parent().next('div').addClass("error");
                    $(element).parent().find('span').addClass('glyphicon-red');
                },
                unhighlight: function (element) {
                    //$(element).parent().next('div').hide();
                    $(element).parent().find('span').removeClass('glyphicon-red');
                }
            })//fin del validate
        });//Esto permite transformar el validate en una funcion y encapsularla en la clase
    },


    metodoMensaje: function (result) {
        if (result['valida'] == 1) {
            var str = '<div class="alert alert-success"> <span class="glyphicon glyphicon-ok"></span> <span> i_mensaje</span> </div>';
            var respHtml = str.replace("i_mensaje", procesoRemesas.mensajeExito01);
            $(".msjRespuesta").html(respHtml);
            $("#btnGuardar").attr('disabled', 'disable');
        }
        if (result['valida'] == 0) {
            var str = '<div class="alert alert-danger"> <span class="glyphicon glyphicon-remove"></span> <span> i_mensaje</span> </div>';
            var respHtml = str.replace("i_mensaje", procesoRemesas.mensajePeligro01);
            $(".msjRespuesta").html(respHtml);
        }
        // procesoRemesas.renderGrid(result['json']);
    },
    validaTeclado: function () {

        var validaCamposTeclado = $(function () {
            $(".soloLetras").keypress(function (e) {
                procesoRemesas.metodoTeclado(e, "nombre", this);
            });
            $(".soloDecimal").keypress(function (e) {
                procesoRemesas.metodoTeclado(e, "float", this);
            });
            $(".soloCodigo").keypress(function (e) {
                procesoRemesas.metodoTeclado(e, "anticipo", this);
            });
        });

    },
    metodoTeclado: function (e, permitidos, fieldObj, upperCase) {

        if (fieldObj.readOnly) return false;
        upperCase = typeof(upperCase) != 'undefined' ? upperCase : true;
        e = e || event;

        charCode = e.keyCode; // || e.keyCode;

        if ((procesoRemesas.is_nonChar(charCode)) && e.shiftKey == 0)
            return true;
        else if (charCode == '')
            charCode = e.charCode;

        if (fieldObj.value.length == fieldObj.maxLength) return false;

        var caracter = String.fromCharCode(charCode);

        // Variables que definen los caracteres permitidos
        var numeros = "0123456789";
        var float = "0123456789.";
        var caracteres = "  abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóúÁÉÍÓÚ";
        var car_especiales = ".-_()'\"/&";
        var anticipo = numeros + caracteres;


        //Los valores de las llaves del array representan los posibles valores permitidos
        var selectArray = new Array();
        selectArray['all'] = '';
        selectArray['num'] = numeros;
        selectArray['float'] = float;
        selectArray['anticipo'] = anticipo;
        selectArray['nombre'] = caracteres + numeros;


        // Comprobar si la tecla pulsada se encuentra en los caracteres permitidos
        if ((selectArray[permitidos].indexOf(caracter) != -1) || (permitidos == 'all')) {
            return (true);
        }
        else {
            if (e.preventDefault)
                e.preventDefault();
            else
                e.returnValue = false;
        }
    },
    is_nonChar: function (charCode) {

        // 8 = BackSpace, 9 = tabulador, 13 = enter, 35 = fin, 36 = inicio, 37 = flecha izquierda, 38 = flecha arriba,
        // 39 = flecha derecha, 37 = flecha izquierda, 40 = flecha abajo 46 = delete.

        var teclas_especiales = [8, 9, 13, 35, 36, 37, 38, 39, 40, 46];
        if ($.browser.msie) {
            return (false);
        }
        for (var i in teclas_especiales) {

            if (charCode == teclas_especiales[i]) {
                return (true);
            }
        }
    },
    validaDeshabilitar: function () {
        $(document).on("click", ".btnDeshabilitar", function () {
            var id = $(this).attr("data-Remesa");
            procesoRemesas.modalMensaje('Confirmación', '¿ Está seguro de deshabilitar ?', id, 'btnDeshabilitar');

        });
    },
    validaHabilitar: function () {
        $(document).on("click", ".btnhabilitar", function () {
            var id = $(this).attr("data-Remesa");
            procesoRemesas.modalMensaje('Confirmación', '¿ Está seguro de habilitar ?', id, 'btnhabilitar');

        });
    },
    modalMensaje: function (titulo1, mensaje, valor, proceso) {

        BootstrapDialog.show({
            title: titulo1,
            message: mensaje,
            cssClass: 'prueba',
            type: 'type-danger',
            size: 'size-normal',
            closable: true,
            spinicon: 'glyphicon glyphicon-eur',
            buttons: [{
                id: 'btn-remove',
                icon: 'glyphicon glyphicon-remove',
                label: 'No',
                cssClass: 'btn-danger',
                action: function (dialog) {
                    dialog.close();
                }
            }, {
                id: 'btn-ok',
                icon: 'glyphicon glyphicon-check',
                label: 'Si',
                cssClass: 'btn-info',
                autospin: false,
                action: function (dialog) {
                    procesoRemesas.procesoDeshabilitar(valor, proceso);
                    var resp = valor.split("-");
                    var montoNew = resp[2];
                    var monOld = $("#inpImpote").val();
                    var resta = parseFloat(monOld) - parseFloat(montoNew);
                    $("#inpImpote").val(resta);
                    dialog.close();
                }
            }]
        });

    },
    funtCerrarReload: function () {
        $(".btnCerrar").on("click", function () {
            $("#btnGuardar").removeAttr("disabled");
            $("#msjRespuesta").html(' ');
        });
    },
    funtLimpiarForm: function () {

        $(document).on("click", "#btnRegistrar", function () {
            $("#exampleModal").css("top", "-15px");
            document.getElementById("formRemesa").reset();
            $("#inpConcepto").removeAttr("disabled");
            $("#inpCoAnticipo").removeAttr("disabled");
            $("#inpFechaInicio").removeAttr("disabled");
            $("#inpFechaFin").removeAttr("disabled");
            $("#inpMonto").removeAttr("disabled", "disabled");
            $("#spTitulomodalRegEdir").html("Registrar");
            $("#bntTitulomodalRegEdir").html("Registrar");
            $("#btnGuardar").removeAttr("disabled");
            $("#forIdFile").show();
        });
    },
    cargaCalendario: function () {
        $('.datepicker').datepicker({
            format: 'dd/mm/yyyy',
            //startDate: '-3d'
        });
    },
    obtenerCvetra:function () {
        var val = $("#cvtraEmpleado").text();
        return val;
    }
};
procesoRemesas.init();