var getsolicitudes = {
    
    init: function() {
        
        var usuario = $("#usuario").val();
        console.log(usuario);
        
        
        getsolicitudes.cargaHistorialVacaciones(usuario);
        
            $(document).on({
              click : function(e){
              e.preventDefault();

              //alert("detalles");

              var idVacaciones = $(this).attr("id-rel");
              //alert("idVacaciones" +  idVacaciones);
              var idEmpleado = $(".selectUser").val();
              var status = $(this).attr("id")

             $.ajax({
                 url: baseUrl + '/recursosh/index/get-detalles',
                 type: "POST",
                 dataType: 'json',
                 data: {idVacaciones:idVacaciones, idEmpleado:idEmpleado},
                 success: function(data){
                     if(data != '') {
                      if(status === 'CANCELADO') {  // STATUS
                        var html = '<table class="table table-hover" >\n\
                       <thead><tr><th>Id detalle</th><th>Solicitud procesada por</th><th>Estatus</th><th>Detalle</th><th>Comentario</th><th>Fecha cancelación </th></tr></thead>';  
                      } else {
                        var html = '<table class="table table-hover" >\n\
                       <thead><tr><th>Id detalle</th><th>Solicitud procesada por</th><th>Estatus</th><th>Detalle</th><th>Comentario</th><th>Fecha aprobación</th></tr></thead>';  
                      }
                      

                     $.each(data,function(i,items){
                                  html += '<tr class='+items.STATUS+'><td><p align="center">' + items.IDDETALLE+'</p></td><td><p align="center">' + items.QUIENPROCESA+'</p></td><td><p align="center">' + items.STATUS+'</p></td><td><p align="center">'+items.MOTIVO+'</p></td> <td><p align="center">'+items.COMENTARIO+'</p></td>\n\
                                  <td><p align="center">'+items.FECHA+'</p></td></tr>';    

                     });
                      html += '</table>';           

                   $("#consulta-detalles-vacaciones").html(html);

                     } else {
                         var html = '<table class="table table-hover" >\n\
                       <thead><tr><th>Id detalle</th><th>Cancelado por</th><th>Motivo</th><th>Comentario</th><th>Fecha cancelación</th></tr></thead>';
                         html += '<tr><td colspan="5">No existen detalles.</td></tr>'; 
                         
                         $("#consulta-detalles-vacaciones").html(html);
                         //alert('No existe vacaciones registrados en este periodo');
                     }


                 },
             });
                $("#modalDetallesVacaciones").css("left","32%"); // width: 602px; height: 214px;
                $('#modalDetallesVacaciones').modal("show"); 

              }
          },".verdetallesvacaciones");
    },
    
    cargaHistorialVacaciones: function(numEmpleado){

       $.ajax({
           url: baseUrl + '/recursosh/reportes/get-all-vacaciones',
           type: "POST",
           dataType: 'json',
           data: {numEmpleado:numEmpleado},
           success: function(data){
               if(data != '') {
               console.log(data);
                var html = '<table class="table table-hover">\n\
                <thead><tr><th>Fecha de solicitud</th><th>Fecha inicio</th><th>Fecha fin</th><th>Días vacaciones</th><th>Días solicitados</th><th>Días usados</th>\n\
               <th>Días cancelados</th><th>Días disponibles</th><th>Estatus</th><th>Acción</th></tr></thead>';
               var contador = 1;
               $.each(data,function(i,items){

                            html += '<tr class='+items.STATUS+'><td><p align="center">' + items.FREGISTRO+'</p></td><td><p align="center">'+items.FECHA_INICIO+'</p></td>\n\
                            <td><p align="center">'+items.FECHA_FIN+'</p></td><td><p align="center">'+items.NUMDIASVACACIONES+'</p></td><td><p align="center">'+items.NUMDIASSOLICITADOS+'</p></td><td><p align="center">' + items.NUMDIASUSADOS+'</p></td><td><p align="center">' + items.TOTALCANCELADOS+'</p></td><td><p align="center">' + items.NUMDIASDISPONIBLES+'</p></td>\n\
                            <td><p align="center">'+items.STATUS+'</p></td><td> \n\
<button id-rel='+items.IDVACACIONES+' id='+items.STATUS+' type="button" class="btn btn-info btn-xs verdetallesvacaciones"  style="margin-left:19px;">Detalles</button></td></tr>';    
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
};

getsolicitudes.init();