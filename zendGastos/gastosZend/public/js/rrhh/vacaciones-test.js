
var Vacaciones = {
    nombre: '',
    getNombre: function(){
        this.pensar("Entrego mii nombre es<br/>");
        return this.nombre;
    },
    setNombre: function(nombre){
        this.pensar("Cambio mi nombre?<br/>");
        this.nombre=nombre;
    },
    pensar: function(pensamiento){
        document.write(pensamiento);
    },
listarFechas: function(f1,f2,auxDiasCancelados){
    //'01/08/2016','05/08/2016'
    //var FECHA_INICIO = '01/08/2016';
    //var FECHA_FIN = '05/08/2016';
    
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
                    console.log("Son iguales: ");
                    setFechas.splice(n,1);
                } 
            }

        }    
        
    }

    console.log("listarFechas->Imprimo el arreglo de fechas"); // setFechaAux
    console.log(" setFechas " + setFechas);
    console.log(" setFechaAux " + setFechaAux);
    
    return setFechas;
},
///// Validar fechas para puntualidad

diasPuntualidad: function( f1, f2) {
    // valida dias maximos de  vacaciones
//    var fechaInicio = getField("fechaInicio").value;
//   var fechaFin = getField("fechaFin").value;
   
   // 12 dias
       var fechaInicio = f1;
   var fechaFin = f2;
    
    var sumFeriados = 0;
    
       //Valida fecha ya seleccionada
//        var rutaActualPm =  getField('cualEslaRutaWeb').value;  
//        var numEmpleado = getField('numEmpleado').value;
//        var inicio = true;
//        sys_workspace = 'workflow';
//        ajax=new XMLHttpRequest();
//
//        ajax.open('GET', 'http://'+ rutaActualPm +'/pendulum/ajaxBuscaRangoFechas.php?bd='+sys_workspace+'&fechaUser='+fechaFin+'&numEmpleado='+    numEmpleado,true);
//
//      ajax.onreadystatechange=function(){
//             if(ajax.readyState==4 && ajax.status==200){                 
//                  if(ajax.responseText == '1')
//                  {
//                   //document.getElementById('form[cboProveedorPago]').innerHTML = ajax.responseText;
//                   console.log("success");
//                    
//                    getField("fechaFin").value="";
//                    alert("La fecha ya la tienes seleccionada")
//                  }
//             }
//            };
//        ajax.send(null);
    //var dFeriados = eval(getValueById("saveDiasFeriados"));

    //var dFeriados = new Array('19-08-2016','20-08-2016','23-08-2016');
    var dFeriados = new Array('16-09-2016');
    //var dFeriados = new Array('');
    
    // Sabado feriado 20-agosto-2016
    // domingo feriado 21-agosto-2016
    
    var campoNumDias = 0;                
    //var laboraSabado = getField('jornadaSabado').value;
    //var laboraDomingo = getField('jornadaDomingo').value;
    
    var laboraSabado = 1;
    var laboraDomingo = 0;
    
          var aFecha1 = fechaInicio.split('-');
          var aFecha2 = fechaFin.split('-');
    
          var fecha1= new Date(aFecha1[2],aFecha1[1]-1,aFecha1[0]);                
          var fecha2= new Date(aFecha2[2],aFecha2[1]-1,aFecha2[0]);   
    
         
         if(fecha1 > fecha2)
         {
           //getField("fechaFin").value ="";
           //getField("numDias").value ="";
           
             alert("La fecha Fin tiene que ser mayor a la fecha de Inicio");
         } else {  
                var dif = fecha2 - fecha1;
                var campoNumDias = Math.floor(dif / (1000 * 60 * 60 * 24));
                var contarSabados = 0;
                var contarDomingos = 0;
                
                var sabado = 6;
                var domingo = 0;
                var i = 0;
                var contarFeriados = 0;
                var omitirFinSemanasFeriados = 0;
                var sabadosFeriados = 0;
                var domingoFeriados = 0;
                
                var rangoDeDias = Array();
                var diasACancelar = Array();
                var StringDiasACancelar = '';
                var sumDiass = 0;
                while(fecha1 <= fecha2)
                {
                    
                  if(fecha1.getDay() === domingo )
                  {
                       contarDomingos++;
                  }
                  if(fecha1.getDay() === sabado )
                  {
                      contarSabados++;
                  }
                  
                  //validar dias Inhabiles
                  
                     if(dFeriados.length > 0 ) {
                       if (typeof(dFeriados) == 'object' && dFeriados.length) {     //if an array
                         for (var j=0; j < dFeriados.length; j++) {
                          var fechasFeriadas = dFeriados[j].split('-');  
                          //var aFecha1 = fechaInicio.split('-');
                          var feriado = new Date(fechasFeriadas[2],fechasFeriadas[1]-1,fechasFeriadas[0]);
                           
                          //console.log('Dia Feriado: ' + feriado + ' Rango Fecha: ' + fecha1);
                          
                           if((feriado.getTime() === fecha1.getTime()) && (feriado.getDay() != sabado) && (feriado.getDay() != domingo) ) {
                           console.log('Rango Fecha: ' + fecha1 + '->Dia Feriado: ' + feriado + ' TRUE');
                          //if(feriado.getTime() === fecha1.getTime() ) {
                          StringDiasACancelar += fecha1.getDate() + '-' + (fecha1.getMonth() + 1 )+ '-' + fecha1.getFullYear() + ',';
                          contarFeriados = contarFeriados + 1;
                          
                          } else {
                              //console.log('Rango Fecha: ' + fecha1 + '->Dia Feriado: ' + feriado + ' FALSE');
                          }
                           
                           if((feriado.getTime() === fecha1.getTime()) && (feriado.getDay() === sabado)) {
                                 StringDiasACancelar += fecha1.getDate() + '-' + (fecha1.getMonth() + 1) + '-' + fecha1.getFullYear() + ','; 
                                 sabadosFeriados = sabadosFeriados + 1;
                           }
                           
                            if((feriado.getTime() === fecha1.getTime()) && (feriado.getDay() === domingo)) {                             
                                 StringDiasACancelar += fecha1.getDate() + '-' + (fecha1.getMonth() + 1) + '-' + fecha1.getFullYear() + ','; 
                                 domingoFeriados = domingoFeriados + 1;
                           }
                           

                        } // fin for feriados
                         
                       }   
                     } // fin If
                     
                    if((fecha1.getDay() === sabado && laboraSabado != 1)) {
                           console.log("Agregar Sabado");
                           StringDiasACancelar += fecha1.getDate() + '-' + (fecha1.getMonth() + 1) + '-' + fecha1.getFullYear() + ',';  
                    }  
                    if((fecha1.getDay() === domingo && laboraDomingo != 1)) {
                           console.log("Agregar Domingo");
                           StringDiasACancelar += fecha1.getDate() + '-' + (fecha1.getMonth() + 1) + '-' + fecha1.getFullYear() + ',';  
                    }  
                     
                  //console.log('Rango Fecha: ' + fecha1 );
                     // setFechas[i] =fechaIni.getDate() + '-' + (fechaIni.getMonth() + 1) + '-' + fechaIni.getFullYear(); 
                  rangoDeDias[i] = fecha1.getDate() + '-' + (fecha1.getMonth() + 1) + '-' + fecha1.getFullYear();
                  //fin
                  
                  fecha1.setDate(fecha1.getDate()+parseInt(1));
                  i++;
                  sumDiass++;
                  
                } // fin while
                
                var dias = 0;
                var totalDias  = 0;
                var aux = 0;
                if(laboraSabado != 1)
                {
                    totalDias = contarSabados;
                }
                if(laboraDomingo != 1)
                {
                    dias = contarDomingos;
                }
           
               if(laboraSabado == 1) {
                  aux =  sabadosFeriados;
                 console.log("Labora los sabados");
               }
           
               if(laboraDomingo == 1) {
                  aux =  sabadosFeriados;
                 console.log("Labora los Domingos");
               }
               
               console.log('contarSabados: ' + contarSabados);
               console.log('contarDomingos ' + contarDomingos);
                console.log('sabadosFeriados ' + sabadosFeriados);
                console.log('DomigosFeriados ' + domingoFeriados);
                console.log('sumDiass: ' + sumDiass + ' totalDias: ' + totalDias + ' dias: ' + dias + ' aux: ' + aux);
                //console.log('DomigosFeriados ' + domingoFeriados);
           
                var sumDias = totalDias + dias + contarFeriados + aux;
                //var sumDias = totalDias + dias + sumFeriados;
             //   console.log('sumFeriados ' + sumFeriados);
           
                var sum = campoNumDias - sumDias;
                var diasTotales = sum + 1;
           
                //console.log(sum);
           //console.log('contarFeriados: '+ contarFeriados);
           //console.log('omitirFinSemanasFeriados ' + omitirFinSemanasFeriados);
           
           //getField("numDias").value = sum + 1;
           console.log('Imprimo fechaInicio: ' + f1 + ' fechaFin: ' + f2);
           console.log('Imprimo dias Feriados: ');
           console.log(dFeriados);
           console.log('Total de Dias -> ' + diasTotales);
           console.log("Imprimo el rago de los dias ");
           console.log(rangoDeDias);
           console.log('Count rangoDeDias ' + rangoDeDias.length);
           
//           console.log("Imprimo dias a limpiar: ");
//           console.log(StringDiasACancelar);
           var stringDias =StringDiasACancelar.substring(0,StringDiasACancelar.length-1);
           console.log("Quito Coma final: ");
           console.log(stringDias);
//           console.log("Dias a quitar de arreglo:");
           var StringDiasArr = stringDias.split(',');
//           console.log("StringDiasArr ");
//           console.log(StringDiasArr);
             
           //var diaVacaciones = getField("totalDiasVacaciones").value;
           var diaVacaciones = 13;
           
           if(diasTotales > diaVacaciones)
           {
             console.log( "ExcedenDias");
             alert("Los dias seleccionados exceden a tus dias disponibles");    
           } else {
             //sconsole.log( "excepcionDiasOtorgados");
            }
            
            if(StringDiasArr.length > 0) {
                for(var j = 0; j < StringDiasArr.length; j++){
                    for(var k = 0; k < rangoDeDias.length; k++){
                        if(StringDiasArr[j] == rangoDeDias[k]){
                            //console.log("Iguales: " + StringDiasArr[j] + '='  + rangoDeDias[k]);
                            rangoDeDias.splice(k,1);
                        }
                    }
                }
            }
            
            console.log("Nuevo rango de dias: ");
            console.log(rangoDeDias);
            console.log("Total: " + rangoDeDias.length);
//            var f = '10-08-2016';
//            var fc = f.split('-');
            var diasFinales = rangoDeDias.toString();
            console.log("toString");
            console.log(diasFinales);
            
            //var fecha1= new Date(aFecha1[2],aFecha1[1]-1,aFecha1[0]); 
//            console.log(fc);
            //var date = new Date(fc[2],fc[1]-1,fc[0]);
//            var date = new Date('2016','7','16');
//            console.log('date.getDate() ' +  date.getDate());
//            console.log('date.getMonth() ' +  date.getMonth());
            
        }
           
  },

//// fin validacion puentualidad


};

Vacaciones.setNombre("Gustavo");
document.write("Mi nombre es: " + Vacaciones.getNombre());
var arrayDates = new Array("02-08-2016","03-08-2016","04-08-2016");
//var arrayDates = new Array("");
//Vacaciones.listarFechas('01-08-2016','05-08-2016', arrayDates );
//Vacaciones.listarFechas("Gustavo");
//Vacaciones.listarFechas("Gustavo");

Vacaciones.diasPuntualidad('12-09-2016','19-09-2016');
