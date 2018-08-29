var ContabilidadLibAnticipoCeroSinViatico = {
		init : function() {
			$(".grid-title").html("Liberación anticipo Cero/Sin viático");
			ContabilidadLibAnticipoCeroSinViatico.contarSeleccionados();

						
			$("#btnGenerarArchivo").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var folio = $("#noFolio").val();
				//var folio = $("#noFolio").val();
				var url = baseUrl + "/planesdeviaje/contabilidad/generararchivosanticipos?userid=" + userid + "&folio=" + folio;
				window.open( url ,'_blank');
			});
			
			$("#btnGenerarArchivo______").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var url = baseUrl + "/catalogos/tesoreria/getarchivospei?userid=" + userid;
				window.open( url ,'_blank');
			});
			
			$("#btnFinalizar____").click(function(e){
				Layout.showLoading();
				Menu.loadModuleMenu('planesdeviaje', 'contabilidad', 'capturarefdynamis', '#');
        		Layout.hideLoading();
			});
			
			$( document ).on({
				click : function( e ) {
					Layout.showLoading();
					Menu.loadModuleMenu('planesdeviaje', 'contabilidad', 'libanticipocerosinviatico', '#');
	        		Layout.hideLoading();
				}
			}, "#btnFinalizar");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					
					var idsGastos = '';
					var appUid = '';
					var delIndex = '';
					var userid = $("#noEmpleado").html();
					var pantalla = 'setLiberaAnticipoCeroSinViatico';
					
					$("#tablaArchivosAnticipos p.info").each(function(e){
						appUid += $(this).attr( "app_uid" ) + "|";
						delIndex += $(this).attr( "del_index" ) + "|";
						idsGastos += $(this).attr( "id_gasto" ) + "|";
					});
					
					console.log(appUid);
					console.log(delIndex);
					console.log(idsGastos);//return false;
					
					Layout.showLoading();
					//Aplicamos a conntabilidad
					$.ajax({
	    		        type: "POST",
	    		        dataType: 'json',
	    		        url: baseUrl + '/planesdeviaje/contabilidad/liberaranticipocerosinviaticos',
	    		        data: {
	    					idGasto	: idsGastos,
	    					delIndex: delIndex,
	    					appUid: appUid,
	    					userid	: userid,
	    					pantalla: pantalla
	    				},
	    		        success: function (data) {
	    		        	console.log(data);
			            	Layout.hideLoading();
	    		        	if (data.success == true) {
	    		        		alert("Datos procesados correctamente.");
	    		        		$("#btnVistaPreliminar").show();
	    		        		//$("#noFolio").val(data.folio);
	    		        		//$("#btnGenerarArchivo").show();
	    						$("#btnFinalizar").show();
	    						//$("#btnGuardar").hide();
	    		            } else {
	    		            	alert("Ocurrio un error: " + data.msg);
	    		            }
	    		        }
	    		    });
					return false;
				}
			}, "#btnGuardar");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var userid = $("#noEmpleado").html();
					var id_lote = 1;//$("#id_lote").val();
					var url = baseUrl + "/planesdeviaje/contabilidad/getreportediario?empleadoid=" + userid+"&lote="+id_lote;
					window.open( url ,'_blank');
				}
			}, "#btnVistaPreliminar");
			
			$("#btnGuardar_______").click(function(e){
				e.preventDefault();
				var idsGastos = '';
				var anticipo = '';
				var referencia = '';
				var userid = $("#noEmpleado").html();
				var pantalla = 'setCapturaRefDyn';
				
				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaArchivosAnticipos").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gatos a procesar.");
					return false;
				}
				
				$("#tablaArchivosAnticipos input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsGastos += $(this).attr( "planviaje" ) + "|";
							anticipo += $(this).attr( "importe" ) + "|";
						}
					}
				});
				Layout.showLoading();
				//Aplicamos a conntabilidad
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/planesdeviaje/contabilidad/setcapturarefdynamis',
    		        data: {
    					idGasto	: idsGastos,
    					anticipo: anticipo,
    					referencia: referencia,
    					userid	: userid,
    					pantalla: pantalla
    				},
    		        success: function (data) {
    		        	console.log(data);
		            	Layout.hideLoading();
    		        	if (data.success == true) {
    		        		alert("Datos procesados correctamente.");
    		        		//$("#noFolio").val(data.folio);
    		        		//$("#btnGenerarArchivo").show();
    						//$("#btnFinalizar").show();
    						//$("#btnGuardar").hide();
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
			$("#tablaArchivosAnticipos input[type=checkbox]").each(function(e){
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
   console.log("Hol aqui ando");
   ContabilidadLibAnticipoCeroSinViatico.contarSeleccionados();
}
ContabilidadLibAnticipoCeroSinViatico.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/