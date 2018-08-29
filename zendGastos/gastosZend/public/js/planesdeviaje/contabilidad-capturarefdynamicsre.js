var ContabilidadCapturarefdynamics = {
		init : function() {
			$(".grid-title").html("Captura de referencia Dynamics");
			ContabilidadCapturarefdynamics.contarSeleccionados();
                        
                        console.log("Entrando a ContabilidadCapturarefdynamics");
			
			$("#id_lote").change(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var id_lote = $(this).val();

				$('#resArchivosAnticipos').html("Cargando...");
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/planesdeviaje/contabilidad/capturarefdynamis',
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
				ContabilidadCapturarefdynamics.contarSeleccionados();
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
					ContabilidadCapturarefdynamics.contarSeleccionados();
				}
			}, "#checkAll");

			
			$( document ).off('click','#tablaArchivosAnticipos .checkbox').on({
				click : function( e ) {
					//e.preventDefault();
					
					if( $(this).is(":checked") == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					ContabilidadCapturarefdynamics.contarSeleccionados();
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
					var userref = '';
					var userid = $("#noEmpleado").html();
					var pantalla = 'setCapturaRefDyn';
					var id_lote = $("#id_lote").val();
					var hayCamposVacios = false;
					
					$("#tablaArchivosAnticipos p.info").each(function(e){
						if( $("#planviajeText-" + $(this).attr( "planviaje" )).val() == '' ){
//							alert("Debe ingresar las referencias correspondientes.");
//							$("#planviajeText-" + $(this).attr( "planviaje" )).focus();
//							hayCamposVacios = true;
						} else {
							idsGastos += $(this).attr( "planviaje" ) + "|";
							anticipo += $(this).attr( "importe" ) + "|";
							userref += $(this).attr( "empleado" ) + "|";
							referencia += $("#planviajeText-" + $(this).attr( "planviaje" )).val() + "|";
						}
					});
					
//					if(hayCamposVacios == true){
//						return false;
//					}
					
					Layout.showLoading();

					//Aplicamos a conntabilidad
					$.ajax({
	    		        type: "POST",
	    		        dataType: 'json',
	    		        url: baseUrl + '/planesdeviaje/contabilidad/setcapturarefdynamisre',
	    		        data: {
	    					idGasto	: idsGastos,
	    					anticipo: anticipo,
	    					referencia: referencia,
	    					id_lote : id_lote,
	    					userid	: userid,
	    					pantalla: pantalla,
						userref : userref
	    				},
	    		        success: function (data) {
	    		        	console.log(data);
			            	Layout.hideLoading();
	    		        	if (data.success == true) {
	    		        		alert("Datos procesados correctamente.");
	    		        		$("#btnVistaPreliminar").show();
						$("#id_lote").val(data.lote);
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
			
			$("#btnVistaPreliminar").off("click").on({
				click : function( e ) {
					e.preventDefault();
					var userid = $("#noEmpleado").html();
					var id_lote = $("#id_lote").val();
					var fecha = $("#id_fecha_lote").val();
					var url = baseUrl + "/planesdeviaje/contabilidad/getreportereembolso/empleadoid/" + userid+"/lote/"+id_lote+"/fecha/"+fecha;
					window.open( url ,'_blank');
				}
			});
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
                    console.log("Entrando a contarSeleccionados");
			var seleccionados = 0;
			var importe = 0;
			var cadena = '';
			var cadenaArray = '';
			var anticipo = '';
                        //  tablaArchivosAnticipos
			$("#tablaArchivosAnticipos input[type=checkbox]").each(function(e){
				console.log( 'checked' + $(this).attr("checked") );
				if( $(this).attr("name") != "checkAll" ){
					if( $(this).is(':checked') ) {
						//cada elemento seleccionado
						seleccionados += 1;
						anticipo = $(this).attr('importe');
						importe += parseFloat( anticipo.replace( ",", "") );
					}
				}
			});
			
			$("#anticipoSeleccionados").html(seleccionados);
			$("#importeADepositar").html( "$ " +  ContabilidadCapturarefdynamics.format(parseFloat(importe).toFixed(2)) );
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
   $("#tablaDepositoAnticipos input[type=checkbox]").each(function(e){
	   $(this).attr( "checked", $("#checkAll").is(':checked') );
	});
   console.log("Hol aqui ando");
   ContabilidadCapturarefdynamics.contarSeleccionados();
}
ContabilidadCapturarefdynamics.init();