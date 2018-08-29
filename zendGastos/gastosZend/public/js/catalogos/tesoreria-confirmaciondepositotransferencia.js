var TesoreriaConfirmaciondepositotransferencia = {
		init : function() {
			$(".grid-title").html("Conformación de tranferencia electrónica");
			TesoreriaConfirmaciondepositotransferencia.contarSeleccionados();
			
			$("#id_empresa").change(function(e){
				e.preventDefault();
				var module = "catalogos";
				var controller = "tesoreria";
				var action = "confirmaciondepositotransferencia";
				var userid = $('#noEmpleado').html();
				$('#catalogo-content #resConfirmacionesDepTrans').html('Cargando...');
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/' + module + '/' + controller + '/' + action+ '/',
					  type: 'GET',
					  data: {generar: 'si', userid: userid, id_empresa:$(this).val()},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#catalogo-content #resConfirmacionesDepTrans').html(data);
					  } 
				});
			});
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					alert("Diste click en Tipo de Cheque");
					return false;
				}
			}, "#tipoCheque_");
			
			$( "#checkAll" ).click(function(e){
				$("#tablaConfirmaciones input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $("#checkAll").is(':checked') == true ){
							$(this).prop( "checked", true);
						}else{
							$(this).prop( "checked",false );
						}
					}
				});
				TesoreriaConfirmaciondepositotransferencia.contarSeleccionados();
			});

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					
					if( $(this).is(":checked") == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					TesoreriaConfirmaciondepositotransferencia.contarSeleccionados();
				}
			}, "#tablaConfirmaciones .checkbox");
						
			$("#btnGuardar").click(function(e){
				e.preventDefault();
				
				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaConfirmaciones tbody").find("input[type=checkbox]:checked").length;
				
				if( nsel == 0 ){
					alert("Seleccione los gastos a procesar.");
					return false;
				}
				
				//console.log(userid);return false;

				$("#modalConfirmacion").modal('show');
				return false; 
			});
			
			$("#btnReagendarConfirm").click(function(e){
				e.preventDefault();
				
				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaConfirmaciones tbody").find("input[type=checkbox]:checked").length;
				
				if( nsel == 0 ){
					alert("Seleccione los gastos a procesar.");
					return false;
				}
				
				//console.log(userid);return false;

				$("#modalReagendarConf").modal('show');
				return false; 
			});

			$( "#fechaReagendarConf" ).datepicker({
				 dateFormat: "dd/mm/yy",
				 minDate: 1
			});
			
			$("#btnConfirmarDeposito").click(function(e){
				e.preventDefault();
				
				var res = confirm("¿Confirma los depositos de transferencias seleccionados?");
				
				if(!res){
					console.log("El usuario no quiere hacer esta operacion");
					return false;
				}
				
				$(this).val("Enviando confirmación de transferencia...");
				$(this).html("Enviando confirmación de transferencia...");
				$(this).attr("disabled", "disabled"); //Desabilitamos el boton

				var idsPuestos = '';
				var appUid = '';
				var tasUid = '';
				var delIndex = '';
				var dynid = '';
				var userid = $("#noEmpleado").html();
				var pantalla = 'pagosConfirmacionTransferencias';
				var folioControl = "";
				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaConfirmaciones tbody").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gastos a procesar.");
					return false;
				}
				
				folioControl = $("#folioControl").val();
				if(!folioControl){
					alert("Ingrese el Folio de Control para continuar.");
					$("#folioControl").focus();
					return false;
				}
				
				$("#tablaConfirmaciones input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsPuestos += $(this).attr( "gastoid" ) + "|";
							appUid += $(this).attr( "appuid" ) + "|";
							tasUid += $(this).attr( "tasuid" ) + "|";
							delIndex += $(this).attr( "delindex" ) + "|";
							dynid += $(this).attr( "dynid" ) + "|";
							//console.log(idsPuestos + userid);return false;
						}
					}
				});
				
				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreria/setconfirmadepositotransferencia',
    		        data: {
    					idGasto: 		idsPuestos,
    					appUid: 		appUid,
    					tasUid: 		tasUid,
    					delIndex: 		delIndex,
    					dynid: 			dynid,
    					userid: 		userid,
    					folioControl:	folioControl,
    					id_empresa:		$("#id_empresa").val(),
    					pantalla: 		pantalla
    				},
    		        success: function (data) {
    		        	console.log(data);
		        		Layout.hideLoading();
		        		$("#modalConfirmacion").modal('hide');
    		        	//return false;
    		        	if (data.success == true) {
    		        		Menu.loadModuleMenu('catalogos', 'tesoreria', 'confirmaciondepositotransferencia', '#');
    		            } else {
    		            	alert("Ocurrio un error: " + data.msg);
    		            }
    		        }
    		    });
				//end aplicamos tesoreria
				
				return false;
				//end aplicamos tesoreria
				console.log(idsPuestos);
				console.log(appUid);
				console.log(tasUid);
				console.log(delIndex);
				console.log(cuentas);
			});
			
			$("#btnConfirmarReagendarConf").click(function(e){
				e.preventDefault();

				if ( $("#fechaReagendarConf").val() == "" ){
					$("#fechaReagendarConf").focus();
					return false;
				}
				
				var idsGastos = '';
				var userid = $("#noEmpleado").html();
				var pantalla = 'reasignaConfirmacionTransferencias';
				var fecha = "";
				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaConfirmaciones tbody").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gastos a procesar.");
					return false;
				}
				
				fecha = $("#fechaReagendarConf").val();
				if(!fecha){
					alert("Seleccione una fecha para continuar.");
					$("#fechaReagendarConf").focus();
					return false;
				}
				
				$("#tablaConfirmaciones input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsGastos += $(this).attr( "gastoid" ) + "|";
						}
					}
				});
				
				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreria/setreagendaconfirmadepositotransferencia',
    		        data: {
    					idGasto: 	idsGastos,
    					userid: 	userid,
    					fecha:		fecha,
    					pantalla: 	pantalla,
    					id_empresa:		$("#id_empresa").val()
    				},
    		        success: function (data) {
    		        	console.log(data);//return false;
		        		Layout.hideLoading();
		        		$("#modalReagendarConf").modal('hide');
    		        	//return false;
    		        	if (data.success == true) {
    		        		Menu.loadModuleMenu('catalogos', 'tesoreria', 'confirmaciondepositotransferencia', '#');
    		            } else {
    		            	alert("Ocurrio un error: " + data.msg);
    		            }
    		        }
    		    });
				//end aplicamos tesoreria
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
			var cadena = '';
			var cadenaArray = '';
			var anticipo = '';
			$("#tablaConfirmaciones input[type=checkbox]").each(function(e){
				//console.log( $(this).attr("checked") );
				if( $(this).attr("name") != "checkAll" ){
					if( $(this).is(':checked') ) {
						//cada elemento seleccionado
						seleccionados += 1;
						cadena = $(this).attr('name');
						cadenaArray = cadena.split("-");
						//console.log(cadenaArray);
						anticipo = $("#importe-" + cadenaArray[1] ).html();
						anticipo = anticipo.substring(1);		

// Temporal
						anticipo = anticipo.replace( ",", "");
						anticipo = anticipo.replace( ",", "");
						importe += parseFloat( anticipo.replace( ",", "") );
					}
				}
			});
			
			$("#anticipoSeleccionados").html(seleccionados);

			$("#importeADepositar").html("$" + TesoreriaConfirmaciondepositotransferencia.format( parseFloat(importe).toFixed(2)) );
		},
        format: function(num){
            var n = num.toString(), 
            p = n.indexOf('.');
            return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
                return p<0 || i<p ? ($0+',') : $0;
            });
        }
};
function checkBox(e)
{
   e = e||event;/* get IE event ( not passed ) */
   e.stopPropagation? e.stopPropagation() : e.cancelBubble = true;
   //Selecciona y deselecciona todos los checks
   $("#tablaConfirmaciones input[type=checkbox]").each(function(e){
	   $(this).attr( "checked", $("#checkAll").is(':checked') );
	});
   console.log("Hol aqui ando");
   TesoreriaConfirmaciondepositotransferencia.contarSeleccionados();
}
TesoreriaConfirmaciondepositotransferencia.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/