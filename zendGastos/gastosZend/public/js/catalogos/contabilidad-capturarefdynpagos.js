var ContabilidadCapturarefdynpagos = {
		init : function() {
			$(".grid-title").html("Captura de referencia Dynamics pagos");
			ContabilidadCapturarefdynpagos.contarSeleccionados();
			
			$("#id_lote").change(function(e){
				e.preventDefault();
				
				if( $(this).val() == "" ){
					$('#resArchivosAnticipos').html("");
					return false;
				}
				
				var userid = $("#noEmpleado").html();
				var id_lote = $(this).val();

				$('#resArchivosAnticipos').html("Cargando...");
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/catalogos/contabilidad/capturarefdynpagos',
					  type: 'POST',
					  data: {userid: userid, pantalla : 'capturarefdynamis', lote:id_lote, search : 'true'},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#resArchivosAnticipos').html(data);
					  } 
				});
			});
			/*
			$( "#checkAll__" ).click(function(e){
				$("#tablaArchivosAnticipos input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $("#checkAll").is(':checked') == true ){
							$(this).prop( "checked", true);
						}else{
							$(this).prop( "checked",false );
						}
					}
				});
				ContabilidadCapturarefdynpagos.contarSeleccionados();
			});
			*/
			$( document ).off('click','#checkAll').on({
				click : function( e ) {
					//e.preventDefault();
					$("#tablaArchivosAnticipos input[type=checkbox]").each(function(e){
						if( $(this).attr('id') != 'checkAll' ){
							var checado = $("#checkAll").is(':checked');
							
							if( $("#checkAll").is(':checked') == true ){
								$(this).prop( "checked", true);
							}else{
								$(this).prop( "checked",false );
							}
						}
					});
					ContabilidadCapturarefdynpagos.contarSeleccionados();
				}
			}, "#checkAll");

			
			$( document ).off('click','#tablaArchivosAnticipos .checkbox').on({
				click : function( e ) {
					if( $(this).is(":checked") == false ){
						$("#checkAll").prop( "checked",false );
					}
					ContabilidadCapturarefdynpagos.contarSeleccionados();
				}
			}, "#tablaArchivosAnticipos .checkbox");
						
			$("#btnGenerarArchivo").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var folio = $("#noFolio").val();
				//var folio = $("#noFolio").val();
				var url = baseUrl + "/planesdeviaje/contabilidad/generararchivosanticipos?userid=" + userid + "&folio=" + folio;
				window.open( url ,'_blank');
			});
			/*
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
			*/
			$( document ).off('click','#btnFinalizar').on({
				click : function( e ) {
					Layout.showLoading();
					Menu.loadModuleMenu('planesdeviaje', 'contabilidad', 'capturarefdynamis', '#');
	        		Layout.hideLoading();
				}
			}, "#btnFinalizar");
			
			$( document ).off('click','#btnGuardar').on({
				click : function( e ) {
					e.preventDefault();
					var idsGastos = '';
					var anticipo = '';
					var referencia = '';
					var userid = $("#noEmpleado").html();
					var pantalla = 'setCapturaRefDyn';
					var id_lote = $("#id_lote").val();
					var hayCamposVacios = false;
					var campoVacio = "";
					$("#tablaArchivosAnticipos p.info").each(function(e){
						
						idsGastos += $(this).attr( "planviaje" ) + "|";
						anticipo += $(this).attr( "importe" ) + "|";
						
						if( $("#planviajeText-" + $(this).attr( "planviaje" )).val() == '' ){
							//alert("Debe ingresar las referencias correspondientes.");
							//$("#planviajeText-" + $(this).attr( "planviaje" )).focus();
							hayCamposVacios = true;
							if(campoVacio == ""){
								campoVacio = "planviajeText-" + $(this).attr( "planviaje" );
							}
							return false;
						}
						referencia += $("#planviajeText-" + $(this).attr( "planviaje" )).val() + "|";
					});
					
					if(hayCamposVacios == true){
						alert("Debe ingresar las referencias correspondientes.");
						$("#" + campoVacio).focus();
						return false;
					}
					
					Layout.showLoading();
					//Aplicamos a conntabilidad
					$.ajax({
	    		        type: "POST",
	    		        dataType: 'json',
	    		        url: baseUrl + '/catalogos/contabilidad/setcapturarefdynpagos',
	    		        data: {
	    					idGasto	: idsGastos,
	    					anticipo: anticipo,
	    					referencia: referencia,
	    					id_lote: id_lote,
	    					userid	: userid,
	    					pantalla: pantalla
	    				},
	    		        success: function (data) {
	    		        	console.log(data);
			            	Layout.hideLoading();
	    		        	if (data.success == true) {
	    		        		alert("Datos procesados correctamente.");
	    		        		$("#btnVistaPreliminar").show();
	    						$("#btnFinalizar").show();
	    						$("#btnGuardar").hide();
	    		            } else {
	    		            	alert("Ocurrio un error: " + data.msg);
	    		            }
	    		        }
	    		    });
					return false;
				}
			}, "#btnGuardar");
			
			$( document ).off('click','#btnVistaPreliminar').on({
				click : function( e ) {
					e.preventDefault();
					var userid = $("#noEmpleado").html();
					var id_lote = $("#id_lote").val();
					var url = baseUrl + "/catalogos/contabilidad/getreportediario?empleadoid=" + userid+"&lote="+id_lote;
					window.open( url ,'_blank');
				}
			}, "#btnVistaPreliminar");
			/*
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
			*/
			
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
				if( $(this).attr("name") != "checkAll" ){
					if( $(this).is(':checked') ) {
						//cada elemento seleccionado
						seleccionados += 1;
						anticipo = $(this).attr('importe');
						anticipo = anticipo.substring(1);
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
   ContabilidadCapturarefdynpagos.contarSeleccionados();
}
ContabilidadCapturarefdynpagos.init();
