  var cancelarDiasSolicitud = {
        init : function() {
        $(".grid-title").html("Vacaciones");
        //var numEmpleado = $("#noEmpleado").html();
        
    /*$(document).on('click',function(){
        if($("#ui-datepicker-div").css("display") == "none" ) {
        $(".multidates").css('display','none');
        } else if($("#ui-datepicker-div").css("display") == "block" ) {
            
            $(".multidates").css('display','block');
        }       
    }); */
    
    
    $("#setFecha").multiDatesPicker('destroy');
    //$("#setFecha").multiDatesPicker();
    // $('#simpliest-usage').multiDatesPicker();
                //$("#setFecha").multiDatesPicker('resetDates', 'disabled');
                $("input[name='cancelar-vacaciones'][value='cancelarTodo']").attr('checked', true);
                $('.hasDatepicker').val("");
                $('.comentario').val("");
                $('.numero').html('');
                $("#setFecha").val("");
               // var idVacaciones = $('idVacaciones').val();
                //var idVacaciones = '24069';
                var diasDisponibles = $(this).attr('id');
                // obtener fecha para la cancelacion  
                $.ajax({
                    url: baseUrl + '/recursosh/index/get-dias-por-cancelar',
                    type: 'POST',
                    dataType:'JSON',
                    data: {numEmpleado:numEmpleado, periodo: periodo},
                    success: function(data){
                    var newArray = data.split(",");
                    console.log(newArray);
                    var arrDates =  formatearFecha(newArray);
                    console.log('formatearFecha');
                    console.log(arrDates);
                   $("#setFecha").multiDatesPicker({                       
                    dateFormat: "dd-mm-yy",
                    beforeShowDay: function(date){                        
                          dmy = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
                            if ($.inArray(dmy, arrDates) !== -1) {
                              return [true, "","Available"];
                            } else {
                              return [false,"","unAvailable"];
                            }
  
                    },
                    });  

                    $("#setFecha").focus();
                    },
                    error: function(e){
                        console.log(e.responseText);
                    },
                });
                
                 //$("#idCancelacion").val(idVacaciones);
                 //$("#diasDisponibles").val(diasDisponibles);

                
                
//                VacacionesRhh.listarFechas();  

          $(".cerrar").multiDatesPicker('destroy');
          
          
          $(document).on({
        click: function(e){
            $("#setFecha").multiDatesPicker('resetDates');            
        },
    },'.resetDates');
    
    $(".sendDiasAcancelar").click(function(e){
        
        
            e.preventDefault();
           // alert("Cancelado");
           var r = confirm("Se cancelaran los dias seleccionados!");
            if(r == true) {
                //console.log("Ok");
            
              //var idvacaciones = $("#idCancelacion").val(); // motivoCancelacion
            var idvacaciones = $("#idVacaciones").val(); // motivoCancelacion

            var arrayFechas = $("#setFecha").val();
            var numEmpleado = $("#numEmpleado").val();
            var nombreCancela = $("#nombreCancela").val();
            var idMotivoCancelacion = $("#idMotivoCancelacion").val();
            var motivoCancelacion = $("#motivoCancelacion").val();
            var casoSol = $("#casoSolCancelacion").val();
            var periodo = $("#periodo").val();
            
            $.ajax({
                url: baseUrl + '/recursosh/index/cancelar-dias-solicitados',
                type:'POST',
                dataType: 'JSON',
                data: {periodo: periodo,arrayFechas:arrayFechas,numEmpleado:numEmpleado,nombreCancela:nombreCancela,idMotivoCancelacion:idMotivoCancelacion,motivoCancelacion:motivoCancelacion,idCasoCancelacion:casoSol},
                success: function(data){
                    console.log("success");
                    console.log(data);
                    //Object {success: "true", cancelar: "1"}
                    
                    if(data.success == 'true') {
                        window.top.close();
                    } else {
                        alert('Error: ' + data.success + '' + data.cancelar);
                    }
                    
                    
                    //window.top.close();
                    
                },
                error : function(e) {
                    console.log(e);
                    alert("Error al cancelar los dIas, favor de validar!");
                    
                }
            });              
            
        } else {            
            console.log("Cancelar");
            
    }

        
    });
    
    $(".closeWindow").click(function(){
       //myWindow.close();   // Closes the new window
       window.top.close();
    });
    
    /*$("#setFecha").focus(function() {
        console.log('onblur');
        $(".multidates").css('display','block');
    });*/
    
            
//    datepicker({


        }
    };
        
cancelarDiasSolicitud.init();
        
/*   
var availableDates = ["9-5-2017","14-5-2017","15-5-2017"];

function available(date) {
  dmy = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
  if ($.inArray(dmy, availableDates) != -1) {
    return [true, "","Available"];
  } else {
    return [false,"","unAvailable"];
  }
}

$('#date').datepicker({ beforeShowDay: available });

*/

 $.datepicker.regional['es'] = {
 closeText: 'Cerrar',
 prevText: '< Ant',
 nextText: 'Sig >',
 currentText: 'Hoy',
 monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
 monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
 dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
 dayNamesShort: ['Dom','Lun','Mar','Mie','Juv','Vie','Sab'],
 dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
 weekHeader: 'Sm',
 dateFormat: 'dd-mm-yy',
 firstDay: 1,
 //isRTL: false,
 showMonthAfterYear: false,
 yearSuffix: ''
 };
 $.datepicker.setDefaults($.datepicker.regional['es']);
 
 function formatearFecha(fecha) {

     var mes = '';
     var dia = '';
     var arrFechas = new Array();
     for(var i in fecha) {
      var newFecha = fecha[i].split("-");
      var fecha2 = newFecha[1];
      var fecha2 = Math.round(newFecha[1]);
      var formatDia = Math.round(newFecha[0]);
        if(fecha2.length === 2) {
             mes = fecha2.substr(1,1);
         } else {
             mes = fecha2;
         }     
         
        if(formatDia.length === 2) {
             dia = formatDia.substr(1,1);
             dia2 = formatDia.substr(1,1);
             console.log(' format: ' + dia);
         } else {
             dia = formatDia;
         }  
         
      arrFechas[i] = dia + '-' + mes + '-' +  newFecha[2];
     }
     
     return arrFechas;

 }