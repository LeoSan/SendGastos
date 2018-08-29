var GenArchPagos = {
		init : function() {
			$(".grid-title").html("Generación archivo pagos");

			GenArchPagos.contarSeleccionados();
			
			$("#empresaChequesCuenta").change(function(e){
				e.preventDefault();
				var module = "catalogos";
				var controller = "contabilidad";
				var action = "archivospagosdetalles";
				var userid = $('#noEmpleado').html();
				//var tipoCheque = $("#formSearch #tipoCheque").val();
				$('#resultPagosCheques').html('');
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/' + module + '/' + controller + '/' + action+ '/',
					  type: 'GET',
					  data: {test: 'prueba', userid: userid, empresaChequesCuenta:$(this).val()},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#resultPagosCheques').html(data);
						  GenArchPagos.contarSeleccionados();
					  } 
				});
			});
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					$("#tablaGenArchPagos input[type=checkbox]").each(function(e){
						if( $(this).attr('id') != 'checkAll' ){
							var checado = $("#checkAll").is(':checked');
							
							if( $("#checkAll").is(':checked') == true ){
								$(this).prop( "checked", true);
							}else{
								$(this).prop( "checked",false );
							}
						}
					});
					GenArchPagos.contarSeleccionados();
				}
			}, "#checkAll");

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					//$("#cuenta-" + $(this).attr("gastoid") ).focus();
					
					if( $( this ).is(':checked') == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					GenArchPagos.contarSeleccionados();
				}
			}, "#tablaGenArchPagos .checkbox");
			
			$("#btnGenerarArchivo").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var folio = $("#noFolio").val();
				//var folio = $("#noFolio").val();
				var url = baseUrl + "/catalogos/contabilidad/generararchivopagos?userid=" + userid + "&folio=" + folio;
				window.open( url ,'_blank');
			});
			
			$("#btnFinalizar").click(function(e){
				Layout.showLoading();
				Menu.loadModuleMenu('catalogos', 'contabilidad', 'genarchivospagos', '#');
        		Layout.hideLoading();
			});
			
			$("#btnGuardar").click(function(e){
				e.preventDefault();

				var idsGastos = '';
				var anticipo = '';
				var userid = $("#noEmpleado").html();
				var pantalla = 'setArchAnticipo';
				
				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaGenArchPagos").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gatos a procesar.");
					return false;
				}
				
				$("#tablaGenArchPagos input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsGastos += $(this).attr( "gastoid" ) + "|";
							anticipo += $(this).attr( "importe" ) + "|";
						}
					}
				});
				Layout.showLoading();
				//Aplicamos a conntabilidad
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/contabilidad/setgeneraarchivospagos',
    		        data: {
    					idGasto	: idsGastos,
    					anticipo: anticipo,
    					userid	: userid,
    					pantalla: pantalla
    				},
    		        success: function (data) {
    		        	console.log(data);
		            	Layout.hideLoading();
    		        	if (data.success == true) {
    		        		$("#noFolio").val(data.folio);
    		        		$("#btnGenerarArchivo").show();
    						$("#btnFinalizar").show();
    						$("#btnGuardar").hide();
    		            } else {
    		            	alert("Ocurrio un error: " + data.msg);
    		            }
    		        }
    		    });
				return false;
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
			var action = "GenArchPagosdetalles";
			var userid = $('#noEmpleado').html();
			var empresaChequesCuenta = $("#formSearch #empresaChequesCuenta").val();
			var tipoCheque = $("#tipoCheque").val();
			$('#resultGenArchPagos').html('');
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
					  $('#resultGenArchPagos').html(data);
					  GenArchPagos.contarSeleccionados();
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
			$("#tablaGenArchPagos input[type=checkbox]").each(function(e){
				//console.log( $(this).attr("checked") );
				if( $(this).attr("name") != "checkAll" ){
					if( $(this).is(':checked') ) {
						//cada elemento seleccionado
						seleccionados += 1;
						anticipo = $(this).attr('importe');
						if(!anticipo) anticipo = 0;
						//cadenaArray = cadena.split("-");
						//anticipo = $("#importe-" + cadenaArray[1] ).html();
                                                console.log(anticipo);
						importe += parseFloat( anticipo.replace( ",", "") );
					}
				}
			});
			
			$("#anticipoSeleccionados").html(seleccionados);
			$("#importeADepositar").html( "$ " +  parseFloat(importe).toFixed(2) );
		}
};
function checkBox(e)
{
   e = e||event;/* get IE event ( not passed ) */
   e.stopPropagation? e.stopPropagation() : e.cancelBubble = true;
   //Selecciona y deselecciona todos los checks
   $("#tablaGenArchPagos input[type=checkbox]").each(function(e){
	   $(this).attr( "checked", $("#checkAll").is(':checked') );
	});
   console.log("Hol aqui ando");
   GenArchPagos.contarSeleccionados();
}
GenArchPagos.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/