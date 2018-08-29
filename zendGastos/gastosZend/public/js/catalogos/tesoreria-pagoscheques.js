var PagosCheques = {
		init : function() {
			$(".grid-title").html("Pagos vía cheques");

			PagosCheques.contarSeleccionados();
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					var module = "catalogos";
					var controller = "tesoreria";
					var action = "pagoschequesdetalles";
					var userid = $('#noEmpleado').html();
					var empresaChequesCuenta = $("#formSearch #empresaChequesCuenta").val();
					$('#resultPagosCheques').html('');
					Layout.showLoading();
					$.ajax({
						  url: baseUrl + '/' + module + '/' + controller + '/' + action+ '/',
						  type: 'GET',
						  data: {test: 'prueba', userid: userid, tipoCheque: $(this).val(), empresaChequesCuenta : empresaChequesCuenta},
						  dataType: 'html',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  Layout.hideLoading();
							  $('#resultPagosCheques').html(data);
							  PagosCheques.contarSeleccionados();
							  //$('#catalogo-content').html(data);
						  } 
					});
				}
			}, "#tipoCheque");
			
			$("#tipoCheque___").change(function(e){
				e.preventDefault();
				console.log($(this).val());
				console.log($("#formSearch #empresaChequesCuenta").val());
				return false;
				$('#catalogo-content').html('');
				var module = "catalogos";
				var controller = "tesoreria";
				var action = "pagoscheques";
				var userid = $('#noEmpleado').html();
				$.ajax({
					  url: baseUrl + '/' + module + '/' + controller + '/' + action+ '/',
					  type: 'GET',
					  data: {test: 'prueba', userid: userid, tipoCheque: $(this).val(), empresaChequesCuenta:$("#formSearch #empresaChequesCuenta").val()},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  	$('#catalogo-content').html(data);
					  } 
				});
			});
			
			$("#empresaChequesCuenta").change(function(e){
				e.preventDefault();
				var module = "catalogos";
				var controller = "tesoreria";
				var action = "pagoschequesdetalles";
				var userid = $('#noEmpleado').html();
				var tipoCheque = $("#formSearch #tipoCheque").val();
				$('#resultPagosCheques').html('');
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/' + module + '/' + controller + '/' + action+ '/',
					  type: 'GET',
					  data: {test: 'prueba', userid: userid, tipoCheque: tipoCheque, empresaChequesCuenta:$(this).val()},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#resultPagosCheques').html(data);
						  PagosCheques.contarSeleccionados();
					  } 
				});
			});
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					$("#tablaPagosCheques input[type=checkbox]").each(function(e){
						if( $(this).attr('id') != 'checkAll' ){
							var checado = $("#checkAll").is(':checked');
							
							if( $("#checkAll").is(':checked') == true ){
								$(this).prop( "checked", true);
							}else{
								$(this).prop( "checked",false );
							}
						}
					});
					PagosCheques.contarSeleccionados();
				}
			}, "#checkAll");

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					$("#cuenta-" + $(this).attr("gastoid") ).focus();
					
					if( $( this ).is(':checked') == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					PagosCheques.contarSeleccionados();
				}
			}, "#tablaPagosCheques .checkbox");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					console.log("Hola Mike como estas?.");
					alert("Hola Mike como estas?."); return false;
				}
			}, "#btnGuardar_");
			
			$("#btnGuardar").click(function(e){
				e.preventDefault();

				var idsPuestos = '';
				var appUid = '';
				var tasUid = '';
				var delIndex = '';
				var empresaFact = '';
				var banco = '';
				var cuentas = '';
				var cheques = '';
				var dynid = '';
				var importe = '';
				var etapa = '';
				var nombre = '';
				var rfc = '';
				var userid = $("#noEmpleado").html();
				var pantalla = 'depositoAnticipoTransferenciaElectronica';
				console.log("Inicio de guardado");
				/*
				if( $("#tipoCheque").val() == "" ){
					alert("Seleccione el tipo de cheque.");
					$("#tipoCheque").focus();
					return false;
				}
				*/
				//Numero de seleccionados
				/*
				var nseleccionados = 0;
				$("#tablaPagosCheques input[type=checkbox]").each(function(e){
					if( $(this).is(':checked') == true ){
						nseleccionados++;
					}
				});
				
				*/
				//console.log(nseleccionados);return false;
				var nsel = 0;
				nsel = $("#tablaPagosCheques").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gastos a procesar.");
					return false;
				}
				
				if( nsel == 1 && $("#checkAll").is(':checked') == true){
					alert("Seleccione los gastos a procesar.");
					return false;
				}
				//console.log(nsel);return false;
				
				var errorFaltaUnaCuenta = false;
				var errorFaltaUnCheque = false;
				$("#tablaPagosCheques input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsPuestos += $(this).attr( "gastoid" ) + "|";
							appUid += $(this).attr( "appuid" ) + "|";
							tasUid += $(this).attr( "tasuid" ) + "|";
							delIndex += $(this).attr( "delindex" ) + "|";
							dynid += $(this).attr( "dynid" ) + "|";
							importe += $(this).attr( "importe" ) + "|";
							//banco += $("#cuenta-" + $(this).attr( "gastoid" )).val() + "|";
							banco += "044" + "|"; //***************Este datos es solo para CHEQUES
							//cuentas += $("#cuenta-" + $(this).attr( "gastoid" ) + " option:selected").text() + "|";
							//cuentas += $("#cuenta-" + $(this).attr( "gastoid" )).val() + "|";
							cuentas += $("#cuenta-" + $(this).attr( "gastoid" ) + " option:selected").attr("fccuenta") + "|";
							//empresaFact += $("#cuenta-" + $(this).attr( "gastoid" )).val() + "|";
							empresaFact += $("#empresaChequesCuenta").val() + "|";
							cheques += $("#ncheque-" + $(this).attr( "gastoid" )).val() + "|";
							nombre += $(this).attr( "nombre" ) + "|";
							rfc += $(this).attr( "rfc" ) + "|";
							etapa += $(this).attr( "tipomovto" ) + "|";	
							if( $("#cuenta-" + $(this).attr( "gastoid" ) + " option:selected").attr("fccuenta") == "" ){
								errorFaltaUnaCuenta = true;
								alert("Seleccione un cuenta del gasto.");
								$("#cuenta-" + $(this).attr( "gastoid" ) ).focus();
								return false;
							}
							
							if( $.trim( $("#ncheque-" + $(this).attr( "gastoid" )).val() ) == "" ){
								errorFaltaUnCheque = true;
								alert("Ingrese el número de cheque del gasto.");
								$("#ncheque-" + $(this).attr( "gastoid" ) ).focus();
								return false;
							}
							
						}
					}
				});
				if(errorFaltaUnaCuenta){
					console.log("Hay un error por falta de cuenta.");
					return false;
				}
				if(errorFaltaUnCheque){
					console.log("Hay un error por falta de cheque.");
					return false;
				}
				//console.log("Mandamos a guardar");return false;
				Layout.showLoading();
				
				//Aplicamos tesoreria
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreria/setaplicatesoreria',
    		        data: {
    					idGasto: idsPuestos,
    					appUid: appUid,
    					tasUid: tasUid,
    					delIndex: delIndex,
    					dynid: dynid,
    					importe: importe,
    					banco: banco,
    					cuentas: cuentas,
    					empresaFact: empresaFact,
    					cheques: cheques,
    					etapa: etapa,
    					tipoPago: $("#tipoCheque").val(),
    					nombre: nombre,
    					rfc: rfc,
    					userid: userid,
    					pantalla: pantalla
    				},
    		        success: function (data) {
    		        	console.log( data );
    		        	//return false;
    		        	if (data.success == true) {
    		        		//Menu.loadModuleMenu('catalogos', 'tesoreria', 'pagoscheques');
    		        		//Layout.hideLoading();
    		        		PagosCheques.loadData();
    		        		console.log( data.num_bloque );
    		            } else {
    		            	alert("Ocurrio un error: " + data.msg);
    		            	Layout.hideLoading();
    		            }
    		        }
    		    });
				return false;
				//end aplicamos tesoreria
				
				console.log(idsPuestos);
				console.log(appUid);
				console.log(tasUid);
				console.log(delIndex);
				console.log(cuentas);
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
		},// End resetearCampos() 
		loadData : function() {
			var module = "catalogos";
			var controller = "tesoreria";
			var action = "pagoschequesdetalles";
			var userid = $('#noEmpleado').html();
			var empresaChequesCuenta = $("#formSearch #empresaChequesCuenta").val();
			var tipoCheque = $("#tipoCheque").val();
			$('#resultPagosCheques').html('');
			Layout.showLoading();
			$.ajax({
				  url: baseUrl + '/' + module + '/' + controller + '/' + action+ '/',
				  type: 'GET',
				  data: {test: 'prueba', userid: userid, tipoCheque: tipoCheque, empresaChequesCuenta : empresaChequesCuenta},
				  dataType: 'html',
				  complete: function() {
						//Modal.close();
				  },
				  success: function(data) {
					  Layout.hideLoading();
					  $('#resultPagosCheques').html(data);
					  PagosCheques.contarSeleccionados();
					  //$('#catalogo-content').html(data);
				  } 
			});
		},// End loadData() 
		contarSeleccionados : function() {
			var seleccionados = 0;
			var importe = 0;
			var cadena = '';
			var cadenaArray = '';
			var anticipo = '';
			console.log("Estoy en contarSeleccionados");
			$("#tablaPagosCheques input[type=checkbox]").each(function(e){
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
                                                //console.log(anticipo);
						importe += parseFloat( anticipo.replace( ",", "") );
					}
				}
			});
			
			$("#anticipoSeleccionados").html(seleccionados);
			$("#importeADepositar").html( "$" + PagosCheques.format(parseFloat(importe).toFixed(2)) );
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
   $("#tablaPagosCheques input[type=checkbox]").each(function(e){
	   $(this).attr( "checked", $("#checkAll").is(':checked') );
	});
   console.log("Hol aqui ando");
   PagosCheques.contarSeleccionados();
}
PagosCheques.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/