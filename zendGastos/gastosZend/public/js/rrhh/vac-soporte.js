var procesoSoporteVac = {
    //Declaracion Variables
    msjEspere:"<div id='msjEspere' class='alert alert-warning' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Mensaje : </span> Por favor espere.</div>",
    msjAlerta01:"<div id='msjAlerta01' class='alert alert-warning'  role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Mensaje : </span> Este caso no existe.</div>",
    msjsuccess01:"<div id='msjsuccess01' class='alert alert-success'  role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Mensaje : </span> Cambio Correcto.</div>",
    //Metodo Inicial
    init: function () {
        procesoSoporteVac.BuscarNumeroCaso();
        procesoSoporteVac.procesoChange();
        procesoSoporteVac.validaTeclado();


    },// fin init
    BuscarNumeroCaso:function(){
        $("#btnNumCaso").click(function(e){
            e.preventDefault();
            var NumCaso = $("#inpIdCaso").val();
            if (  parseInt(NumCaso) > 0 ){
                $.ajax({
                    url: baseUrl + '/recursosh/soporte/buscar-caso',
                    type: 'POST',
                    data: {NumCaso : NumCaso},
                    dataType: 'html',
                    beforeSend: function () {
                        $('#inpTableLisResultado').html(procesoSoporteVac.msjEspere);
                    },

                    success: function(data) {

                        if (data == false){
                            $('#inpTableLisResultado').html(procesoSoporteVac.msjAlerta01);
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
    procesoChange: function () {

        $(document).on({
            change: function(){
                var periodo = $(this).val();
                var idVacaciones = $(this).attr("id");
                var NumCaso = $("#inpIdCaso").val();

                $.ajax({
                    type: "POST",
                    url: baseUrl + '/recursosh/soporte/change-periodo',
                    processData: true,
                    data: {periodo: periodo, idVacaciones: idVacaciones, NumCaso: NumCaso},
                    dataType: 'html',
                    success: function (data) {
                        $("#inpTableLisResultado").html(data);
                        $("#mensajeVac").html(procesoSoporteVac.msjsuccess01);
                        $("#msjsuccess01").hide(2000);

                    }
                });

            }
        },".cambioPeriodo");

    },
    validaTeclado: function () {

        var validaCamposTeclado = $(function () {
            $(".soloNumeros").keypress(function (e) {
                procesoSoporteVac.metodoTeclado(e, "num", this);
            });
        });

    },
    metodoTeclado: function (e, permitidos, fieldObj, upperCase) {

        if (fieldObj.readOnly) return false;
        upperCase = typeof(upperCase) != 'undefined' ? upperCase : true;
        e = e || event;

        charCode = e.keyCode; // || e.keyCode;

        if ((procesoSoporteVac.is_nonChar(charCode)) && e.shiftKey == 0)
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
        selectArray['nombre'] = caracteres;


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
                    procesoSoporteVac.procesoDeshabilitar(valor);
                    dialog.close();
                    procesoSoporteVac.funtCerrarReload();
                }
            }]
        });

    },

};

procesoSoporteVac.init();


