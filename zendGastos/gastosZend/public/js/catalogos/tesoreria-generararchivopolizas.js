var TesoreriaGenerararchivopolizas = {
		init : function() {
			$(".grid-title").html("Provisión de anticipos");
			TesoreriaGenerararchivopolizas.contarSeleccionados();
			
			$("#btnBuscar").click(function(e){
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/catalogos/tesoreria/generararchivopolizas',
					  type: 'GET',
					  data: {id_empresa:$("#empresaChequesCuenta").val()},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#catalogo-content').html(data);
					  } 
				});
			});
			
			$("#id_empresa").change(function(e){
				e.preventDefault();
				var module = "catalogos";
				var controller = "tesoreria";
				var action = "generararchivopolizas";
				var userid = $('#noEmpleado').html();
				var tipoCheque = $("#formSearch #tipoCheque").val();
				$('#catalogo-content').html('');
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/' + module + '/' + controller + '/' + action+ '/',
					  type: 'GET',
					  data: {userid: userid, id_empresa:$(this).val()},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#catalogo-content').html(data);
					  } 
				});
			});
			
			$( "#checkAll" ).click(function(e){
				$("#tablaArchivoPoliza input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $("#checkAll").is(':checked') == true ){
							$(this).prop( "checked", true);
						}else{
							$(this).prop( "checked",false );
						}
					}
				});
				TesoreriaGenerararchivopolizas.contarSeleccionados();
			});

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					
					if( $(this).is(":checked") == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					TesoreriaGenerararchivopolizas.contarSeleccionados();
				}
			}, "#tablaArchivoPoliza .checkbox");
			
			$("#btnGuardar").click(function(e){
				e.preventDefault();

				var idsPuestos = '';
				var userid = $("#noEmpleado").html();
				var pantalla = 'generarArchivosPolizas';

				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaArchivoPoliza").find("input[type=checkbox]:checked").length;
				
				if( nsel == 0 || (nsel == 1 && $("#checkAll").is(':checked') == true) ){
					alert("Seleccione los gastos a procesar.");
					return false;
				}

				$("#tablaArchivoPoliza input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsPuestos += $(this).attr( "gastoid" ) + "|";
						}
					}
				});
				Layout.showLoading();
				//Aplicamos la generación de archivos polizas
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreria/setgenerararchivospolizas',
    		        data: {
    					idGasto: idsPuestos,
    					userid: userid,
    					pantalla: pantalla
    				},
    		        success: function (data) {
    		        	console.log(data);
    		        	//return false;
    		        	if (data.success == true) {
    		        		$("#btnGenerarArchivo").show();
    						$("#btnFinalizar").show();
    						$("#btnGuardar").hide();
    						
    						Layout.hideLoading();
    						return false;
    		            } else {
    		            	alert("Ocurrios un error: " + data.msg);
    		            	Layout.hideLoading();
    		            }
    		        }
    		    });
				return false;
				//end aplicamos tesoreria
			});
			
			$("#btnGenerarArchivo").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var url = baseUrl + "/catalogos/tesoreria/getarchivopolizadyn?userid=" + userid;
				window.open( url ,'_blank');
			});
			
			$("#btnFinalizar").click(function(e){
				Layout.showLoading();
				Menu.loadModuleMenu('catalogos', 'tesoreria', 'generararchivopolizas', '#');
        		Layout.hideLoading();
			});
			
			$("#btnGuardar________________").click(function(e){
				e.preventDefault();

				var idsPuestos = '';
				var userid = $("#userid").html();
				var pantalla = 'generarArchivoPolizas';

				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaArchivoPoliza").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gatos a procesar.");
					return false;
				}
				//console.log(userid);return false;

				$("#tablaArchivoPoliza input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsPuestos += $(this).attr( "gastoid" ) + "|";
							//console.log(idsPuestos + userid);return false;
							//Aplicamos tesoreria
							$.ajax({
			    		        type: "POST",
			    		        dataType: 'json',
			    		        url: baseUrl + '/catalogos/tesoreria/setconfirmadepositotransferencia',
			    		        data: {
			    					idGasto: idsPuestos,
			    					userid: userid,
			    					pantalla: pantalla
			    				},
			    		        success: function (data) {
			    		        	console.log(data);
			    		        	//return false;
			    		        	if (data.success == true) {
			    		        		Menu.loadModuleMenu('catalogos', 'tesoreria', 'confirmaciondepositotransferencia', '#');
			    		        		Layout.hideLoading();
			    		            } else {
			    		            	alert("Ocurrios un error: " + data.msg);
			    		            	Layout.hideLoading();
			    		            }
			    		        }
			    		    });
							return false;
							//end aplicamos tesoreria
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
		},// resetearCampos() 
		contarSeleccionados : function() {
			var seleccionados = 0;
			var importe = 0;
			var cadena = '';
			var cadenaArray = '';
			var anticipo = '';
			$("#tablaArchivoPoliza input[type=checkbox]").each(function(e){
				//console.log( $(this).attr("checked") );
				if( $(this).attr("name") != "checkAll" ){
					if( $(this).is(':checked') ) {
						//cada elemento seleccionado
						seleccionados += 1;
						cadena = $(this).attr('name');
						cadenaArray = cadena.split("-");
						//console.log(cadenaArray);
						anticipo = $("#importe-" + cadenaArray[1] ).html();
						importe += parseFloat( anticipo.replace( ",", "") );
					}
				}
			});
			
			$("#anticipoSeleccionados").html(seleccionados);
			var importeSeleccionado = parseFloat(importe).toFixed(2);
			$("#importeADepositar").html( Layout.numberFormat(importeSeleccionado, 2, '.', ',') );
			//$("#importeADepositar").html( parseFloat(importe).toFixed(2) );
		}
};
function checkBox(e)
{
   e = e||event;/* get IE event ( not passed ) */
   e.stopPropagation? e.stopPropagation() : e.cancelBubble = true;
   //Selecciona y deselecciona todos los checks
   $("#tablaArchivoPoliza input[type=checkbox]").each(function(e){
	   $(this).attr( "checked", $("#checkAll").is(':checked') );
	});
   console.log("Hola aqui ando");
   TesoreriaGenerararchivopolizas.contarSeleccionados();
}
TesoreriaGenerararchivopolizas.init();