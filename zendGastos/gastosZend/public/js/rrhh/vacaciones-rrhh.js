var VacacionesRhh = {
    init : function() {
        $(".grid-title").html("Vacaciones");
        var numEmpleado = $("#noEmpleado").html();
        var nomEmpleado  = '';
        var FECHA_INICIO = '';
        var FECHA_FIN  = '';
        //DIAS_CANCELADOS
        var DIAS_TOMADOS = '';
        var DIAS_CANCELADOS = '';
        var DIAS_OMITIDOS = '';
        var auxDiasCancelados = new Array();

        $.ajax({
            url: baseUrl + '/recursosh/index/get-reporte-vacaciones',
            type: "POST",
            dataType: "json",
            data: {numEmpleado: numEmpleado,nomEmpleado: nomEmpleado },
            success: function(data){
                console.log(data);
                $("#pendu_nombre").html(data['nombre']);
                $("#pendu_noEmpleado").html(data['noEmpleado']);
                $("#pendu_email").html(data['email']);
                $("#pendu_area").html(data['area']);
                $("#pendu_departamento").html(data['departamento']);
                $("#pendu_jornada").html(data['jornada']);
                $("#pendu_sucursal").html(data['sucursal']);
                $("#pendu_fechaAlta").html(data['fechaAlta']);
                $("#pendu_nombreJefe").html(data['nombreJefe']);
                $("#pendu_diasVacaciones").html(data['misDias']);
                $("#pendu_fechaExpiracion").html(data['fechaExpiracion']);
                $("#pendu_empleados").html(data['empleados']);

            },
            error: function(r){

            },

        });

        $.ajax({
            url: baseUrl + '/recursosh/index/get-all-users',
            type: 'POST',
            data: '',
            dataType: 'json',
            success: function(data){
                globaldata = data;
                globalArrIndex = [];
                arrdata = [];
                counter = 0;

                $.each(data, function(index, value){

                    if(value.NOMBRE != null && value.NOMBRE != ''){
                        arrdata[counter] = value.NOMBRE;
                        globalArrIndex[counter] = value.cvetra;
                        counter ++;
                    }
                });
                var typeahead = $('#buscarPerfilUsuario').data('typeahead');
                if (typeahead) typeahead.source = arrdata;
                else $('#buscarPerfilUsuario').typeahead({	source: arrdata,minLength: 1});

                var typeaheadAdmin = $('#buscarUsuario').data('typeahead');
                if (typeaheadAdmin) typeahead.source = arrdata;
                else $('#buscarUsuario').typeahead({	source: arrdata,minLength: 1});


                console.log('SUCCESS');
            },
            complete: function(){
                console.log('COMPLETE');
            },
        });

        VacacionesRhh.cargaGridVacaciones(numEmpleado);
        VacacionesRhh.cargaHistorialVacaciones(numEmpleado);
        VacacionesRhh.getDataUser(numEmpleado);

        $(".panelDiasInhabiles").hide();
        $("#diasInhabiles").click(function(){
            $(".panelDiasInhabiles").toggle();
        });

        $('#buscarPerfilUsuario').on('input', function (e) {

            if (!/^[ a-z0-9áéíóúüñ]*$/i.test(this.value)) {
                this.value = this.value.replace(/[^ a-z0-9áéíóúüñ]+/ig,"");
            }
        });

        $(".selectUserAdmin").on("change",function(){

            var numEmpleado  = $(this).val();
            var nomEmpleado  = '';
            $.ajax({
                url: baseUrl + '/recursosh/index/get-reporte-vacaciones',
                type: "POST",
                dataType: "json",
                data: {numEmpleado: numEmpleado,nomEmpleado: nomEmpleado },
                beforeSend: function(){
                    Layout.showLoading();
                },
                success: function(data){
                    Layout.hideLoading();
                    $("#nombreAdmin").html(data['nombre']);
                    $("#nombre_user").val(data['nombre']);
                    $("#usuarioSolicitante").val(data['email']); // email
                    $("#sucursal").val(data['sucursal']);
                    VacacionesRhh.HistorialVacacionesAdmin(numEmpleado,nomEmpleado);
                },
                error: function(r){
                },
            });
        });

        $(".selectUser").on("change",function(){

            var numEmpleado  = $(this).val();
            var nomEmpleado  = '';

            $.ajax({
                url: baseUrl + '/recursosh/index/get-reporte-vacaciones',
                type: "POST",
                dataType: "json",
                data: {numEmpleado: numEmpleado, nomEmpleado: nomEmpleado },
                beforeSend: function(){
                    Layout.showLoading();
                },
                success: function(data){
                    Layout.hideLoading();
                    $("#pendu_nombre").html(data['nombre']);
                    $("#pendu_noEmpleado").html(data['noEmpleado']);
                    $("#pendu_email").html(data['email']);
                    $("#pendu_area").html(data['area']);
                    $("#pendu_departamento").html(data['departamento']);
                    $("#pendu_jornada").html(data['jornada']);
                    $("#pendu_sucursal").html(data['sucursal']);
                    $("#pendu_fechaAlta").html(data['fechaAlta']);
                    $("#pendu_nombreJefe").html(data['nombreJefe']);

                    $("#pendu_diasVacaciones").html(data['misDias']);
                    $("#pendu_fechaExpiracion").html(data['fechaExpiracion']);
                    $("#pendu_empleados").html(data['empleados']);

                    VacacionesRhh.cargaGridVacaciones(numEmpleado,nomEmpleado);
                    VacacionesRhh.cargaHistorialVacaciones(numEmpleado,nomEmpleado);
                    $(".selectUser").val(0);
                },
                error: function(r){
                },
            });
        });

        $("#btnBuscarPerfilUsuario").on("click",function(){
            var numEmpleado  = '';
            var nomEmpleado  = $("#buscarPerfilUsuario").val();

            $.ajax({
                url: baseUrl + '/recursosh/index/get-reporte-vacaciones',
                type: "POST",
                dataType: "json",
                data: {numEmpleado: numEmpleado, nomEmpleado: nomEmpleado },
                beforeSend: function(){
                    nomEmpleado = $.trim(nomEmpleado);
                    if(nomEmpleado!=""){
                        Layout.showLoading();
                    }

                },
                success: function(data){
                    Layout.hideLoading();
                    $("#pendu_nombre").html(data['nombre']);
                    $("#pendu_noEmpleado").html(data['noEmpleado']);
                    $("#pendu_email").html(data['email']);
                    $("#pendu_area").html(data['area']);
                    $("#pendu_departamento").html(data['departamento']);
                    $("#pendu_jornada").html(data['jornada']);
                    $("#pendu_sucursal").html(data['sucursal']);
                    $("#pendu_fechaAlta").html(data['fechaAlta']);
                    $("#pendu_nombreJefe").html(data['nombreJefe']);

                    $("#pendu_diasVacaciones").html(data['misDias']);
                    $("#pendu_fechaExpiracion").html(data['fechaExpiracion']);
                    $("#pendu_empleados").html(data['empleados']);

                    VacacionesRhh.cargaGridVacaciones(data['noEmpleado']);
                    VacacionesRhh.cargaHistorialVacaciones(data['noEmpleado']);
                },
                error: function(r){
                },
            });
        });

        $("#btnBuscarUsuario").on("click",function(){
            var numEmpleado  = '';
            var nomEmpleado  = $("#buscarUsuario").val();

            $.ajax({
                url: baseUrl + '/recursosh/index/get-reporte-vacaciones',
                type: "POST",
                dataType: "json",
                data: {numEmpleado: numEmpleado, nomEmpleado: nomEmpleado },
                beforeSend: function(){
                    Layout.showLoading();
                },
                success: function(data){
                    Layout.hideLoading();
                    //nombreAdmin

                    $("#nombreAdmin").html(data['nombre']);
                    $("#nombre_user").val(data['nombre']);
                    $("#usuarioSolicitante").val(data['email']); // email noEmpleado
                    $("#sucursal").val(data['sucursal']);
                    VacacionesRhh.HistorialVacacionesAdmin(data['noEmpleado']);
                },
                error: function(r){
                },
            });
        });

        $(document).on({
            click : function(e){
                e.preventDefault();

                //alert("detalles");

                var idVacaciones = $(this).attr("id-rel");
                //alert("idVacaciones" +  idVacaciones);
                // var idEmpleado = $(".selectUser").val();
                var status = $(this).attr("id")
                var periodo = $(this).attr("data-periodo")
                var idEmpleado = $(this).attr("data-idempleado")
                var contador = 1;
                $.ajax({
                    url: baseUrl + '/recursosh/index/get-bitacora',
                    type: "POST",
                    dataType: 'json',
                    data: {idVacaciones:idVacaciones, idEmpleado:idEmpleado, periodo:periodo},
                    success: function(data){
                        if(data != '') {
                            if(status === 'CANCELADO') {  // STATUS
                                var html = '<table class="table table-hover" >\n\
                       <thead><tr><th>No.</th><th>Motivo solicitud</th><th>Solicitud procesada por</th><th>Comentario</th><th>Fecha cancelación </th></tr></thead>';
                            } else {
                                var html = '<table class="table table-hover" >\n\
                       <thead><tr><th>No.</th><th>Motivo solicitud</th><th>Solicitud procesada por</th><th>Comentario</th><th>Fecha aprobación</th></tr></thead>';
                            }


                            $.each(data,function(i,items){
                                html += '<tr class='+items.STATUS+'><td><p align="center">' + contador +'</p></td><td><p align="center">' + items.MOVIMIENTO+'</p></td><td><p align="center">' + items.QUIENPROCESA+'</p></td> <td><p align="center">'+items.COMENTARIO+'</p></td>\n\
                                  <td><p align="center">'+items.FECHA+'</p></td></tr>';
                                contador++;
                            });
                            html += '</table>';

                            $("#consulta-detalles-vacaciones").html(html);

                        } else {
                            var html = '<table class="table table-hover" >\n\
                       <thead><tr><th>No.</th><th>Cancelado por</th><th>Motivo</th><th>Comentario</th><th>Fecha cancelación</th></tr></thead>';
                            html += '<tr><td colspan="5">No existen detalles.</td></tr>';

                            $("#consulta-detalles-vacaciones").html(html);
                            //alert('No existe vacaciones registrados en este periodo');
                        }


                    },
                });
                $("#modalDetallesVacaciones").css("left","38%"); // width: 602px; height: 214px;
                $('#modalDetallesVacaciones').modal("show");

            }
        },".verdetallesvacaciones");

        $(document).on({
            click: function(e){
                e.preventDefault();

                $("#setFecha").multiDatesPicker('destroy');
                //$("#setFecha").multiDatesPicker('resetDates', 'disabled');
                $("input[name='cancelar-vacaciones'][value='cancelarTodo']").attr('checked', true);
                $('.hasDatepicker').val("");
                $('.comentario').val("");
                $('.numero').html('');
                $("#setFecha").val("");
                var idVacaciones = $(this).attr('id-rel');
                var diasDisponibles = $(this).attr('id');
                $.ajax({
                    url: baseUrl + '/recursosh/index/get-motivos-cancelacion',
                    type: 'POST',
                    dataType:'JSON',
                    success: function(data){

                        var html = '<option value = 0>Seleccione una razon</option>';
                        $.each(data,function(i,items){
                            html += '<option value="'+ items.IDMOTIVORECHAZO +'">'+ items.NOMBREMOTIVO+'</option>';
                        });

                        $(".selectMotivoCancelacion").html(html);

                    },
                    error: function(e){

                    },
                });

                // obtener fecha para la cancelacion  
                $.ajax({
                    url: baseUrl + '/recursosh/index/get-fechas-vacaciones',
                    type: 'POST',
                    dataType:'JSON',
                    data: {idVacaciones:idVacaciones},
                    success: function(data){
                        //$("#nombreAdmin").html(data['nombre']);
                        FECHA_INICIO = data[0]['FECHA_INICIO'];
                        FECHA_FIN  = data[0]['FECHA_FIN'];
                        DIAS_CANCELADOS = data[0]['DIASCANCELADOS']; // 16-9-2016,18-9-2016
                        DIAS_OMITIDOS = data[0]['DIASOMITIDOS']
                        DIAS_TOMADOS = data[0]['DIASTOMADOS']
                        //DIAS_CANCELADOS = '17-9-2016,13-9-2016,18-9-2016'; // 16-9-2016,18-9-2016

                        if((DIAS_CANCELADOS == null || DIAS_CANCELADOS === '') && (DIAS_OMITIDOS === '' || DIAS_OMITIDOS == null)){
                            $("#setFecha").multiDatesPicker({
                                minDate: FECHA_INICIO,
                                maxDate: FECHA_FIN,
                                dateFormat: "dd-mm-yy"
                                //addDisabledDates: auxDiasCancelados,
                            });

                        } else {


                            if(DIAS_OMITIDOS !== null && DIAS_CANCELADOS !== null) {
                                var diasOmitidos = DIAS_OMITIDOS.split(',');
                                var diasCancelados = DIAS_CANCELADOS.split(",");
                                auxDiasCancelados = diasOmitidos.concat(diasCancelados);

                            } else if(DIAS_OMITIDOS !== null && DIAS_CANCELADOS === null) {
                                var diasOmitidos = DIAS_OMITIDOS.split(',');
                                auxDiasCancelados = diasOmitidos;
                            } else if(DIAS_CANCELADOS !== null && DIAS_OMITIDOS === null) {
                                var diasCancelados = DIAS_CANCELADOS.split(",");
                                auxDiasCancelados = diasCancelados;
                            }


//                      for( var i in diasCancelados) {
//                        auxDiasCancelados[i] = diasCancelados[i];
//                        }

                            $("#setFecha").multiDatesPicker({
                                minDate: FECHA_INICIO,
                                maxDate: FECHA_FIN,
                                dateFormat: "dd-mm-yy",
                                addDisabledDates: auxDiasCancelados,

                            });

                        }
                    },
                    error: function(e){

                    },
                });

                $("#idCancelacion").val(idVacaciones);
                $("#diasDisponibles").val(diasDisponibles);
                $("#modalPenduVacaciones").css("width","602px"); // height: 298px;
                $("#modalPenduVacaciones").css("height","450px"); // height: 298px;
                $("#modalPenduVacaciones").css("left","44%"); // width: 602px; height: 214px;
                $('#modalPenduVacaciones').modal("show");


//                VacacionesRhh.listarFechas();  
            }
        },'.cancelarVacaciones'); // modalDetallesVacaciones

        $(".cerrar").multiDatesPicker('destroy');

        $("#setFecha").multiDatesPicker('destroy');

        //fin modal

        $(document).on({
            click: function(e){
                e.preventDefault();
                // alert("Cancelado");
                var idMotivoCancelacion = $(".selectMotivoCancelacion").val();
                if(idMotivoCancelacion == 0 || idMotivoCancelacion == '') {
                    alert("Seleccione un motivo de cancelación");
                } else {
                    var idvacaciones = $("#idCancelacion").val(); // motivoCancelacion
                    var diasDisponibles = $("#diasDisponibles").val();

                    var motivoCancelacion = $("#motivoCancelacion").val(); // motivoCancelacion
                    var idUsuarioCancela = $("#noEmpleado").html();
                    var quienCancela = $("#nombre").html();
                    var emailCancela = $("#email").html();
                    var quienSolicita = $("#usuarioSolicitante").val();
                    var nombreSolicitante = $("#nombre_user").val();
                    var sucursal = $("#sucursal").val();
                    var arrayFechas = $("#setFecha").val();
                    var opcion = $("input[name='cancelar-vacaciones']:checked").val();

                    $.ajax({
                        url: baseUrl + '/recursosh/index/cancelar-vacaciones',
                        type:'POST',
                        dataType: 'JSON',
                        data: {idvacaciones: idvacaciones,motivoCancelacion: motivoCancelacion,idMotivoCancelacion: idMotivoCancelacion,
                            idUsuarioCancela: idUsuarioCancela, quienCancela: quienCancela,diasDisponibles: diasDisponibles,emailCancela: emailCancela,
                            quienSolicita:quienSolicita,sucursal:sucursal,nombreSolicitante:nombreSolicitante,arrayFechas:arrayFechas,opcion:opcion},
                        success: function(data){
                            console.log(data);
                            if(data == 1){
                                $("#setFecha").val("");
                                $('#modalPenduVacaciones').modal("hide");

                                $("#fila" + idvacaciones).css('display','none');
                                //$('#simpliest-usage').multiDatesPicker('resetDates', 'disabled');
                                $("#setFecha").multiDatesPicker('destroy');
                                //$("#setFecha")
                                //Menu.loadModuleMenu('recursosh', 'index', '', '#');
                                //alert("La solicitud se ha borrado correctamente");
                            } else {
                                alert("Error al borrar la solicitud: " + data);
                            }
                        },
                        error: function(e) {
                            console.log(e);
                        }
                    });
                }

            }
        },'#btn-cancelar-vacaciones');

        $(document).on({
            click : function(e){
                e.preventDefault();
                console.log("este archivo es vacaciones rrhh");
                var periodo = $(this).attr("id-rel");//id_periodo
                var p = $(this).attr("data-periodo");//periodo
                var idEmpleado = $("#pendu_noEmpleado").html();
                $.ajax({
                    url: baseUrl + '/recursosh/index/get-detallevacaciones',
                    type: "POST",
                    dataType: 'json',
                    data: {idPeriodo:periodo, idEmpleado:idEmpleado,periodo:p},
                    success: function(data){
                        if(data != '') {
                            console.log(data);

                            var htmldetalle = '<table class="detalleVacaciones" border="1">\n\
                            <thead><tr><th>No. solicitud</th><th>Fecha de solicitud</th><th>Motivo solicitud</th><th style="display: none">Procedencia</th><th style="display: none">Período</th><th width="65">Fecha inicio</th><th width="65">Fecha fin</th><th  style="display: none" >Días vacaciones</th><th >Días solicitados</th><th style="display: none" >Días usados</th>\n\
                           <th style="display: none" >Días disponibles</th><th>Estatus</th><th style="display: none" >Detalle</th></tr></thead>';
                            $.each(data,function(i,items){
                                htmldetalle += '<tr style="height: auto;" class='+items.STATUS+'><td><p align="center">' + items.IDCASO +'</p></td><td><p align="center">' + items.FREGISTRO+'</p></td><td><p align="center">' + items.MOTIVOV+'</p></td><td style="display: none"><p align="center">' + items.IDTAREA+'</p></td><td  style="display: none"><p align="center">'+items.PERIODO+'</p></td><td><p align="center">'+items.FECHA_INICIO+'</p></td>\n\
                            <td><p align="center">'+items.FECHA_FIN+'</p></td><td style="display: none" ><p align="center"  >'+items.NUMDIASVACACIONES+'</p></td><td style="display: none" ><p align="center" >' + items.NUMDIASSOLICITADOS+'</p></td><td ><p align="center">' + items.NUMDIASSOLICITADOS+'</p></td><td  style="display: none"><p align="center" >' + items.NUMDIASDISPONIBLES+'</p></td>\n\
                            <td><p align="center">'+items.STATUS+'</p></td><td style="display: none" ><p align="center"><button id-rel='+items.IDVACACIONES+' id='+items.STATUS+' data-periodo="' + items.PERIODO +'"  data-idempleado="' + items.IDEMPLEADO +'" type="button" class="btn btn-info btn-xs verdetallesvacaciones"  style="margin-left:19px;">Ver</button></p></td></tr>';

                            });
                            htmldetalle += '</table>';

                            $("#consulta-vacaciones").html(htmldetalle);
                            $("#myModalLabel1>span").html(p);
                            $("#modalVacaciones").css("width","964px");
                            $("#modalVacaciones").css("left","33%");
                            $('#modalVacaciones').modal("show");
                        } else {
                            alert('No existe vacaciones registrados en este período');
                        }

                    },
                });


            }
        },".detalleVacaciones");

        $(document).on({
            click : function(e){
                e.preventDefault();
                var periodo = $(this).attr("id-rel");//id_periodo
                var p = $(this).attr("data-periodo");//periodo
                var idEmpleado =  $("#pendu_noEmpleado").html();
                var contador = 1;
                $.ajax({
                    url: baseUrl + '/recursosh/index/get-bitacora',
                    type: "POST",
                    dataType: 'json',
                    data: {idPeriodo:periodo, idEmpleado:idEmpleado, periodo:p},
                    success: function(data){
                        if(data != '') {
                            var htmlbitacora = '<table class="table table-hover" >\n\
                       <thead><tr><th>No.</th><th>No. caso</th><th>Motivo solicitud</th><th>Solicitud procesada por</th><th>Puesto</th><th>Comentario</th>  <th>Fecha de movimiento</th> <th>Solicitud</th> </tr></thead>';
                            $.each(data,function(i,items){
                                htmlbitacora += '<tr class='+items.STATUS+'><td><p align="center">' + contador +'</p></td><td><p align="center">' + items.IDCASO +'</p></td> <td><p align="center">' + items.MOTIVO_SOLICITUD +'</p></td><td><p align="center">' + items.QUIENPROCESA+'</p></td> <td><p align="center">' + items.PUESTO +'</p></td> <td><p align="center">'+items.COMENTARIO+'</p></td>\n\
                                   <td><p align="center">'+items.FECHA+'</p></td><td><p align="center">'+items.ESTATUSOLICITUD+'</p></td></tr>';
                                contador++;
                            });
                            htmlbitacora += '</table>';

                            $("#consulta-bitacora-vacaciones").html(htmlbitacora);
                            $("#myModalLabel2>span").html(p);
                            $("#modalBitacoraVacaciones").css("width","964px");
                            $("#modalBitacoraVacaciones").css("left","33%");
                            $('#modalBitacoraVacaciones').modal("show");
                        } else {
                            alert('No existe vacaciones registrados en este período');
                        }
                    },
                });


            }
        },".bitacoraVacaciones");

        $('.comentario').keyup(function() {
            var total_letras = 190;
            var longitud = $(this).val().length;
            var resto = total_letras - longitud;
            $('.numero').html(resto);
            if(resto <= 0){
                console.log("Haz rebasado el tamaño de la longitud");
                //$('#comentarios').attr("maxlength", 190);
            }
        });

        $(document).on('click',function(){
            if($("#ui-datepicker-div").css("display") == "none" ) {
                $(".multidates").css('display','none');
            } else if($("#ui-datepicker-div").css("display") == "block" ) {

                $(".multidates").css('display','block');
            }
        });

        $(document).on({
            click: function(e){
                $("#setFecha").multiDatesPicker('resetDates');
            },
        },'.resetDates');

        $(document).on({
            click: function(e){
                //VacacionesRh.listarFechas(f1,f2);
                var fechas = VacacionesRhh.listarFechas(FECHA_INICIO, FECHA_FIN,auxDiasCancelados);

                for( var i in fechas){
                    $("#setFecha").multiDatesPicker({
                        addDates: [fechas[i]]
                    });
                }
                // añadir bandera cuando se elecci
            },
        },'.selectAll');

        $(document).on({ // cancelar-por-dia
            click : function(){
                $(".divSetFechas").css('display','block');
                var opcion = $("input[name='cancelar-vacaciones']").val();
                $("#setFecha").val("");
                //alert("Cancelar por dia: " + opcion);
            },
        },'#cancelar-por-dia');

        $(document).on({ // cancelar-por-dia
            click : function(){
                $(".divSetFechas").css('display','none');
                var opcion = $("input[name='cancelar-vacaciones']").val();
                //alert("Cancelar todo: " + opcion);
                $("#setFecha").val("");
            },
        },'#cancelar-todo');

    },// End Init()

    cargaGridVacaciones: function(numEmpleado){
        var x = 0;
        var diasVacaciones = new Array();
        var dias = 0;
        $.ajax({
            url: baseUrl + '/recursosh/index/get-vacaciones',
            type: "POST",
            dataType: "json",
            data: {numEmpleado: numEmpleado},
            success: function(data){

                var html = '<table class="table table-hover vacaciones" align="center"><thead><tr><th>Año</th><th>Período</th><th>Inicia</th><th>Finaliza</th><th>Disponible desde</th><th>Vence</th><th>Días totales</th><th>Días generados</th><th>Días disfrutados</th><th>Días vencidos</th><th>Días disponibles</th><th>Días en trámite</th><th>Acción</th></tr></thead>';
                var j = 1;
                // 10
                $.each( data, function(i, items){

                    if(items[10] == 1) {
                        var button ='<p align="center"><button  style="width: 100px" type="button" class="btn btn-info btn-xs detalleVacaciones" id-rel='+ items[11]+' data-periodo="'+items[8]+'" >Autorizados</button>' +
                            '<button style="width: 100px" type="button" class="btn btn-success btn-xs bitacoraVacaciones" id-rel='+ items[11]+' data-periodo="'+items[8]+'"  data-caso="'+items[8]+'" >Detalle</button></p>';
                    }else {
                        var button = '';
                    }
                    //notaMental: Esto es para Cumplir con la regla de negocio donde se debe ocultar los periodos inferiores al 2012
                    if (items[8] <= 2012){
                        var styleOculta ='none';
                    }else{
                        var styleOculta = '';
                    }

                    html += '<tr style="display:'+styleOculta+'" ><td><p align="center">' + items[11] +'</p></td><td ><p align="center">'+items[8]+'</p></td></td><td ><p align="center">'+items[0]+'</p></td><td><p align="center">'+items[14]+'</p></td><td ><p align="center">'+items[2]+'</p></td><td ><p align="center">'+items[3]+'</p></td><td ><p align="center">'+items[4]+'</p></td><td ><p align="center">'+items[5]+'</p></td><td><p align="center">'+items[6]+'</p></td><td ><p align="center">' + items[7]+'</p></td><td ><p align="center">' + items[9]+'</p></td> <td><p align="center"> ' + items[13] +' </p></td><td> ' + button + ' </td></tr>';


                    diasVacaciones[i] = data[i][10];
                    j++;
                });
                html += '</table>';

                //items[6] ->Periodo
                $(".miPendulumVacaciones").html(html);
                //$("#textFechaExpiracion").html(data[0][9]);
                dias = diasVacaciones.pop();
                $("#diasDisponibles").html(dias);
                $("#diasVacaciones").html(dias);
                // array =data[i][10];

                //console.log(data);
            },
            error: function(r){
                var html = '<table class="table table-hover vacaciones" align="center"><thead><tr><th>Año</th><th>Período</th><th>Inicia</th><th>Finaliza</th><th>Disponible desde</th><th>Vence</th><th>Días totales</th><th>Días generados</th><th>Días disfrutados</th><th>Días vencidos</th><th>Días disponibles</th><th>Acción</th></tr></thead>\n\
                      <tr><td colspan="12" style="text-align: center">Sin Datos.</td></tr>';


                html += '</table>';

                $(".miPendulumVacaciones").html(html);
            },

        });
    },

    HistorialVacacionesAdmin: function(numEmpleado){
        $.ajax({
            url: baseUrl + '/recursosh/index/get-all-admin-vacaciones',
            type: "POST",
            dataType: 'json',
            data: {numEmpleado:numEmpleado},
            success: function(data){
                if(data != '') {
                    console.log(data);
                    var html = '<table class="table table-hover">\n\
                <thead><tr><th>No solicitud</th><th>Fecha de solicitud</th><th>Motivo solicitud</th><th>Período</th><th>Fecha inicio</th><th>Fecha fin</th><th>Días vacaciones</th><th>Días solicitados</th><th>Días usados</th>\n\
               <th>Días cancelados</th><th>Días disponibles</th><th>Estatus</th><th>Acción</th></tr></thead>';
                    $.each(data,function(i,items){

                        html += '<tr id="fila'+items.IDVACACIONES+'" style="padding: 10px 0px"><td><p align="center">' + items.IDCASO+'</p></td><td><p align="center">' + items.FREGISTRO+'</p></td><td><p align="center">' + items.MOTIVOV+'</p></td><td ><p align="center">'+items.PERIODO+'</p></td><td id='+items.FECHA_INICIO+' id-rel='+items.FECHA_INICIO+'><p id="fechaInicio" align="center">'+items.FECHA_INICIO+'</p></td>\n\
                            <td><p align="center">'+items.FECHA_FIN+'</p></td><td><p align="center">'+items.NUMDIASVACACIONES+'</p></td><td><p align="center">'+items.NUMDIASSOLICITADOS+'</p></td><td><p align="center">'+items.NUMDIASUSADOS+'</p></td><td><p align="center">' + items.TOTALCANCELADOS+'</p></td><td><p align="center">' + items.NUMDIASDISPONIBLES+'</p></td>\n\
                            <td><p align="center">'+items.STATUS+'</p></td><td><button id='+items.NUMDIASVACACIONES+' id-rel='+items.IDVACACIONES+'  type="button" class="btn btn-danger btn-xs cancelarVacaciones" style="">Cancelar</button></td></tr>';

                    });
                    html += '</table>';

                    $(".historialVacacionesAdmin").html(html);
                } else {
                    var html = '<tr><td colspan="9"><p align="center">No existes vacaciones registradas</p></td></tr></table>';

                    $(".historialVacacionesAdmin").html(html);
                    //alert('No existe vacaciones registrados en este periodo');
                }

            },
        });
    },

    cargaHistorialVacaciones: function(numEmpleado){
        $.ajax({
            url: baseUrl + '/recursosh/index/get-all-vacaciones',
            type: "POST",
            dataType: 'json',
            data: {numEmpleado:numEmpleado},
            success: function(data){
                if(data != '') {
                    console.log(data);
                    var html = '<table class="table table-hover">\n\
                <thead><tr><th>No.</th><th>No. solicitud</th><th>Fecha de solicitud</th><th >Motivo solicitud</th><th>Período</th><th>Dia solicitado</th><th style="display: none">Fecha fin</th><th style="display: none">Días vacaciones</th><th style="display: none">Días solicitados</th><th style="display: none">Días usados</th>\n\
               <th style="display: none">Días cancelados</th><th style="display: none">Días disponibles</th><th>Estatus</th><th>Acción</th></tr></thead>';
                    var contador = 1;
                    $.each(data,function(i,items){

                        html += '<tr class='+items.STATUS+'><td><p align="center">' + contador+'</p></td><td><p align="center">' + items.IDCASO+'</p></td><td><p align="center">' + items.FREGISTRO+'</p></td><td><p align="center">' + items.MOTIVOV+'</p></td><td><p align="center">'+items.PERIODO+'</p></td><td><p align="center">'+items.FECHA_INICIO+'</p></td>\n\
                            <td style="display: none"><p align="center">'+items.FECHA_FIN+'</p></td><td style="display: none" ><p align="center">'+items.NUMDIASVACACIONES+'</p></td><td style="display: none"><p align="center">'+items.NUMDIASSOLICITADOS+'</p></td><td style="display: none"><p align="center">' + items.NUMDIASUSADOS+'</p></td><td style="display: none"><p align="center">' + items.TOTALCANCELADOS+'</p></td><td style="display: none"><p align="center">' + items.NUMDIASDISPONIBLES+'</p></td>\n\
                            <td><p align="center">'+items.STATUS+'</p></td><td> \n\
<button id-rel='+items.IDVACACIONES+' id='+items.STATUS+' type="button" class="btn btn-info btn-xs verdetallesvacaciones"  style="margin-left:19px;">Ver detalles</button></td></tr>';
                        contador++;
                    });
                    html += '</table>';

                    $(".historialVacaciones").html(html);
                } else {
                    var html = '<tr><td colspan="9"><p align="center">No existes vacaciones registradas</p></td></tr></table>';

                    $(".historialVacaciones").html(html);
                }

            },
        });
    },

    getDataUser : function(numEmpleado) {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: baseUrl + '/recursosh/index/getdatauser',
            data: {
                userid: numEmpleado
            },
            success: function (data) {
                var html = '<option value=0>Seleccione un empleado</option>';
                // CORREO
                $.each( data, function(i, items){
                    html += '<option value="'+items.NUMEMPLEADO+'">'+items.NUMEMPLEADO+' '+items.NOMBRE+'</option>';
                });

                $("#frmBuscarGasto select").html(html);
                $("#frmBuscarGasto_ select").html(html);

            }
        });
    },

    listarFechas: function(f1,f2,auxDiasCancelados){
        var FECHA_INICIO = f1;
        var FECHA_FIN = f2;

        var fIni = FECHA_INICIO.split("-");
        var fFin = FECHA_FIN.split("-");
        var fechaIni = new Date(fIni[2],fIni[1]-1,fIni[0]);
        var fechaFin = new Date(fFin[2],fFin[1]-1,fFin[0]);

        var setFechas = new Array();
        var setFechaAux = new Array();
        var i = 0;
        var x = 0;

        while( fechaIni <= fechaFin)
        {
            if(auxDiasCancelados.length > 0) {
                for(var j in auxDiasCancelados) {
                    var fechasFeriadas = auxDiasCancelados[j].split('-');
                    var diasCancelados = new Date(fechasFeriadas[2],fechasFeriadas[1]-1,fechasFeriadas[0]);

                    if(diasCancelados.getTime() === fechaIni.getTime()) {
                        setFechaAux[x]   = fechaIni.getDate() + '-' + (fechaIni.getMonth() + 1) + '-' + fechaIni.getFullYear();
                        x++;

                    } else if(diasCancelados.getTime() !== fechaIni.getTime()) {
                        setFechas[i] =fechaIni.getDate() + '-' + (fechaIni.getMonth() + 1) + '-' + fechaIni.getFullYear();

                    }
                }
            } else {
                setFechas[i] =fechaIni.getDate() + '-' + (fechaIni.getMonth() + 1) + '-' + fechaIni.getFullYear();
            }

            fechaIni.setDate(fechaIni.getDate()+parseInt(1));
            i++;
        }

        if(setFechaAux.length > 0) {
            for(var m = 0; m < setFechaAux.length; m++) {
                for(var n = 0; n < setFechas.length; n++){
                    if(setFechaAux[m]==setFechas[n] ){
                        setFechas.splice(n,1);
                    }
                }

            }
        } else {
        }

        return setFechas;
    },

    soloLetras: function (cadena){
        var patron = /^[a-zA-Z]*$/;
        // En caso de querer validar cadenas con espacios usar: /^[a-zA-Z\s]*$/
        if(!cadena.search(patron))
            return true;
        else
            return false;
    }

};
VacacionesRhh.init();
