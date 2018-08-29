var TesoreriaArchivosreembolso = {
		init : function() {
			$(".grid-title").html("Archivos reembolso");
			TesoreriaArchivosreembolso.contarSeleccionados();
			
			$( "#fecha" ).datepicker({"dateFormat": "dd/mm/yy"});
			
			$("#btnBuscar").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var fecha = $("#fecha").val();
				
				if (!fecha){
					$("#fecha").focus();
				}
				$('#resultadoArchivosReembolso').html("Cargando...");
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/catalogos/tesoreria/archivosreembolso',
					  type: 'POST',
					  data: {userid: userid, fecha : fecha, pantalla : 'get'},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#resultadoArchivosReembolso').html(data);
					  } 
				});
			});
			
			$( "#checkAll" ).click(function(e){
				$("#tablaArchivoReembolso input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $("#checkAll").is(':checked') == true ){
							$(this).prop( "checked", true);
						}else{
							$(this).prop( "checked",false );
						}
					}
				});
				TesoreriaArchivosreembolso.contarSeleccionados();
			});

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					
					if( $(this).is(":checked") == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					TesoreriaArchivosreembolso.contarSeleccionados();
				}
			}, "#tablaArchivoReembolso .checkbox");
						
			$("#btnGenerarArchivo").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var folio = $("#noFolio").val();
				var url = baseUrl + "/catalogos/tesoreria/generararchivosreembolso?folio=" + folio + "&userid=" + userid;
				window.open( url ,'_blank');
			});
			
			$("#btnFinalizar").click(function(e){
				Layout.showLoading();
				Menu.loadModuleMenu('catalogos', 'tesoreria', 'archivosreembolso', '#');
        		Layout.hideLoading();
			});
			
			$("#btnGuardar").click(function(e){
				e.preventDefault();

				var idsGastos = '';
				var userid = $("#noEmpleado").html();
				var pantalla = 'setArchAnticipo';
				
				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaArchivoReembolso").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gatos a procesar.");
					return false;
				}
				
				$("#tablaArchivoReembolso input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsGastos += $(this).attr( "valor" ) + "|";
						}
					}
				});
				
				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreria/setarchivosreembolso',
    		        data: {
    					idGasto	: idsGastos,
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
		},// End Init() 
		contarSeleccionados : function() {
			var seleccionados = 0;
			var importe = 0;
			var cadena = '';
			var cadenaArray = '';
			var anticipo = '';
			$("#tablaArchivoReembolso input[type=checkbox]").each(function(e){
				//console.log( $(this).attr("checked") );
				if( $(this).attr("name") != "checkAll" ){
					if( $(this).is(':checked') ) {
						//cada elemento seleccionado
						seleccionados += 1;
						anticipo = $(this).attr('importe');
						//cadenaArray = cadena.split("-");
						//anticipo = $("#importe-" + cadenaArray[1] ).html();
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
   $("#tablaDepositoAnticipos input[type=checkbox]").each(function(e){
	   $(this).attr( "checked", $("#checkAll").is(':checked') );
	});
   TesoreriaArchivosreembolso.contarSeleccionados();
}
TesoreriaArchivosreembolso.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/