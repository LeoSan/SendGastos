var GenArchAnticipos = {
		init : function() {
			$(".grid-title").html("Generación archivos anticipos");

			GenArchAnticipos.contarSeleccionados();
			
			$("#empresaChequesCuenta").change(function(e){
				e.preventDefault();
				var module = "catalogos";
				var controller = "contabilidad";
				var action = "archivosanticiposdetalles";
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
						  GenArchAnticipos.contarSeleccionados();
					  } 
				});
			});
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					$("#tablaGenArchAnticipos input[type=checkbox]").each(function(e){
						if( $(this).attr('id') != 'checkAll' ){
							var checado = $("#checkAll").is(':checked');
							
							if( $("#checkAll").is(':checked') == true ){
								$(this).prop( "checked", true);
							}else{
								$(this).prop( "checked",false );
							}
						}
					});
					GenArchAnticipos.contarSeleccionados();
				}
			}, "#checkAll");

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					//$("#cuenta-" + $(this).attr("gastoid") ).focus();
					
					if( $( this ).is(':checked') == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					GenArchAnticipos.contarSeleccionados();
				}
			}, "#tablaGenArchAnticipos .checkbox");
			
			$("#btnGenerarArchivo").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var folio = $("#noFolio").val();
				//var folio = $("#noFolio").val();
				var url = baseUrl + "/catalogos/contabilidad/generararchivoanticipos?userid=" + userid + "&folio=" + folio;
				window.open( url ,'_blank');
			});
			
			$("#btnFinalizar").click(function(e){
				Layout.showLoading();
				Menu.loadModuleMenu('catalogos', 'contabilidad', 'genarchivosanticipos', '#');
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
				nsel = $("#tablaGenArchAnticipos").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gatos a procesar.");
					return false;
				}
				
				$("#tablaGenArchAnticipos input[type=checkbox]").each(function(e){
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
    		        url: baseUrl + '/catalogos/contabilidad/setgeneraarchivosanticipos',
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
			var action = "GenArchAnticiposdetalles";
			var userid = $('#noEmpleado').html();
			var empresaChequesCuenta = $("#formSearch #empresaChequesCuenta").val();
			var tipoCheque = $("#tipoCheque").val();
			$('#resultGenArchAnticipos').html('');
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
					  $('#resultGenArchAnticipos').html(data);
					  GenArchAnticipos.contarSeleccionados();
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
			$("#tablaGenArchAnticipos input[type=checkbox]").each(function(e){
				//console.log( $(this).attr("checked") );
				if( $(this).attr("name") != "checkAll" ){
					if( $(this).is(':checked') ) {
						//cada elemento seleccionado
						seleccionados += 1;
						anticipo = $(this).attr('importe');
						if(!anticipo) anticipo = 0;
						//cadenaArray = cadena.split("-");
						//anticipo = $("#importe-" + cadenaArray[1] ).html();
						importe += parseFloat( anticipo.replace( ",", "") );
					}
				}
			});
			
			$("#anticipoSeleccionados").html(seleccionados);
			//$("#importeADepositar").html( "$ " + GenArchAnticipos.format( parseFloat(importe).toFixed(2)) );
                        $("#importeADepositar").html( "$ " + GenArchAnticipos.format(parseFloat(importe).toFixed(2)));
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
   $("#tablaGenArchAnticipos input[type=checkbox]").each(function(e){
	   $(this).attr( "checked", $("#checkAll").is(':checked') );
	});
   console.log("Hol aqui ando");
   GenArchAnticipos.contarSeleccionados();
}
GenArchAnticipos.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/