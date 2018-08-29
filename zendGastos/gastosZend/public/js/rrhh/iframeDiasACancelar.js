var iframeDiasACancelar = {
    numEmpleado : $("#numEmpleado").val(),
    nombreCancela : $("#nombreCancela").val(),
    idMotivoCancelacion : $("#idMotivoCancelacion").val(),
    motivoCancelacion : $("#motivoCancelacion").val(),
    idCasoCancelacion : $("#idCasoCancelacion").val(),
    init : function() {

        $(document).on('click','.btn-cancelar-dia',function(){
            var idVacaciones = $(this).attr('data-id-vacaciones');
            var idStatus = $(this).attr('data-id-status');
            var diaSolicitado = $(this).attr('data-dia-solicitado');
            var idPeriodo = $(this).attr('data-id-periodo');
            var periodo = $(this).attr('data-periodo');
            var idButton =  '#'+$(this).attr("id");
            var idStatusToChange;
            var msg;
            if(idStatus == 'A'){
                idStatusToChange ='PSC';
            }else{
                idStatusToChange ='A';
            }
            // var confirm = window.confirm(msg);

            // console.log(baseUrl);

                $.ajax({
                    url: baseUrl + '/recursosh/index/generar-previa-cancelacion',
                    type:'POST',
                    dataType: 'JSON',
                    data: {IDVACACIONES: idVacaciones,
                        idCasoCancelacion:iframeDiasACancelar.idCasoCancelacion,
                        numEmpleado:iframeDiasACancelar.numEmpleado,
                        nombreCancela:iframeDiasACancelar.nombreCancela,
                        idMotivoCancelacion:iframeDiasACancelar.idMotivoCancelacion,
                        motivoCancelacion:iframeDiasACancelar.motivoCancelacion,
                        idCasoCancelacion:iframeDiasACancelar.idCasoCancelacion,
                        idStatus:idStatusToChange
                    },
                    success: function(data){
                        if(data.success == '1') {
                            if(data.info[0]['IDSTATUS'] == 'PSC'){
                                $(idButton).removeClass('btn-info');
                                $(idButton).addClass('btn-danger');
                            }else{
                                $(idButton).addClass('btn-info');
                                $(idButton).removeClass('btn-danger');
                            }
                            $(idButton).attr('data-id-status',data.info[0]['IDSTATUS']);
                        } else {
                            alert('Error: ' + data.success + '' + data.info[0]['IDSTATUS']);
                        }

                    },
                    error : function(e) {
                        console.log(e);
                        alert("Error al cancelar los dIas, favor de validar!");

                    }
                });

                //console.log("Hola mama voy a cancelar mi dia de vacaciones");
                //$(idButton).removeClass('btn-info');
                //$(idButton).addClass('btn-danger');


        });

    }
};

iframeDiasACancelar.init();

