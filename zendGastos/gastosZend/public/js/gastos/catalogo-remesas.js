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
    mensajePeligro01:  '! Falla en el almacenamiento, intente mas tarde ¡',
    mensajeAdvertencia02:'! Debe seleccionar un archivo ¡',
    mensajeAdvertencia03:'! Hubo Problema con la validacion, por favor revise el archivo CSV ¡',
    //Metodo Inicial
    init: function () {
        procesoRemesas.renderGrid();
        procesoRemesas.changeRegional();
        procesoRemesas.changeConcepto();
        procesoRemesas.changeMoneda();
        procesoRemesas.procesoGuardado();
        procesoRemesas.validaTeclado();
        procesoRemesas.procesoMuestra();
        procesoRemesas.validaDeshabilitar();
        procesoRemesas.validaHabilitar();
        procesoRemesas.procesoUpload();
        procesoRemesas.procesoVerAcuse();
        procesoRemesas.procesoCargaMasivo();
        procesoRemesas.procesoCargaMasivoVerifica();
        procesoRemesas.procesoCargaMasivoProcesa();
        procesoRemesas.funtCerrarReload();
        procesoRemesas.funtLimpiarForm();

    },// fin init
    renderGrid: function () {
        var alto = $(document).height();
        var ancho = $(document).width();
        var grid = $('#jqGridRemesa').jqGrid({
            //  url: baseUrl + '/remesas/index/obtener-json-remesa',
            datatype: 'json',
            datatype: "local",
            data: jsondata,
            autowidth: true,
            shrinkToFit: true,
            height: 300,
            ignoreCase: true,
            colModel: [
                {label: 'ID', name: 'ID_REMESA', key: true, align:'right', witdh:"11", sortable: true, sorttype: 'integer'},
                {label: 'Concepto', name: 'CONCEPTO',sortable: true },
                {label: 'Nombre', name: 'NOM_REMESA',sortable: true},
                {label: 'Importe deposito', name: 'MONTO_REMESA_FORMAT', align:'right', sortable: true, sorttype: 'integer'},
                {label: 'Importe comprobado', name: 'MONTO_COMPRADO_FORMAT', align:'right', sortable: true, sorttype: 'integer'},
                {label: 'Estatus', name: 'ESTATUS',sortable: true},
                {label: 'Fecha registro', name: 'FECHA_REGISTRO',sortable: true},
                {label: 'Fecha cambio', name: 'FECHA_CAMBIO',sortable: true},
                {label: 'Usuario', name: 'CVETRA',sortable: true},
                {label: 'Región', name: 'ID_REGIONAL',sortable: true},
                {label: 'Co. anticipo', name: 'ID_ANTICIPO',sortable: true},
                {label: 'Acción', name: 'ACCION',sortable: true},
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
    changeConcepto:function () {
        $(document).on("change", "#selConcepto", function () {
            var valor = $("#selConcepto option:selected").val();
            $("#inpConcepto").val(valor);
        });
    },
    changeMoneda:function () {
        $("#inpMonto").on({
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

                }
                , debug: true
                , errorElement: "label"
                , submitHandler: function (form) {
                    var datosForm = $("#formRemesa").serializeArray();
                    $.ajax({
                        type: "POST",
                        url: baseUrl + '/remesas/index/procesa-remesa',
                        processData: true,
                        data: datosForm,
                        dataType: 'html',
                        success: function (data) {
                            var json = JSON.stringify(eval("(" + data + ")"));
                            var result = JSON.parse(json);
                            procesoRemesas.metodoMensaje(result);
                            procesoRemesas.refreshGrid(result);
                            procesoRemesas.funtCerrarReload();
                        }
                    });
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

            $("#spTitulomodal").html("Editar");
            $("#bntTitulomodal").html("Editar");
            $("#inpConcepto").attr("disabled", "disabled");
            $("#inpAccion").val("Editar");


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
                data: "archivo=" + $("#inpUrlMasivo").val() + "&solicitudid=" + 20112,
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
                data: "archivo=" + $("#inpUrlMasivo").val() + "&solicitudid=" + 20112,
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
    procesoVerAcuse: function () {
        $(document).on("click", ".btnVerAcuse", function () {
            var valorUrl = $(this).data('url');
            window.open(valorUrl);
        });
    },
    procesoDeshabilitar: function (valor, proceso) {
        if (proceso == 'btnDeshabilitar'){
            var inpAccion = 'Deshabilitar'
        }else{
            var inpAccion = 'Habilitar'
        }

        $.ajax({
            type: "POST",
            url: baseUrl + '/remesas/index/procesa-remesa',
            processData: true,
            dataType: 'html',
            data: {inpAccion: inpAccion, inpIdRemesa: valor},
            success: function (data) {
                var json = JSON.stringify(eval("(" + data + ")"));
                var result = JSON.parse(json);
                procesoRemesas.refreshGrid(result);
            }
        });

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
        console.log("Prueba");
        $(document).on("click", "#btnRegistrar", function () {
            document.getElementById("formRemesa").reset();
            $("#inpConcepto").attr("disabled", "disabled");
            $("#inpCoAnticipo").attr("disabled", "disabled");
            $("#inpConcepto").removeAttr("disabled");
            $("#inpCoAnticipo").removeAttr("disabled");
        });
    },
};
procesoRemesas.init();