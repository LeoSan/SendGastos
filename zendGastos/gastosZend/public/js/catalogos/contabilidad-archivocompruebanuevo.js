var ContabilidadGenarchivosanticipos = {
		init : function() {
			$(".grid-title").html("Archivo comprobación nuevo");
			
			ContabilidadGenarchivosanticipos.contarSeleccionados();
			
			$("#empresaChequesCuenta").change(function(e){
				e.preventDefault();
				var module = "catalogos";
				var controller = "contabilidad";
				var action = "archivocomprobanuevo";
				var userid = $('#noEmpleado').html();
				//var tipoCheque = $("#formSearch #tipoCheque").val();
				$('#resultArchCompronaNuevo').html('');
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/' + module + '/' + controller + '/' + action+ '/',
					  type: 'GET',
					  data: {search: 'true', userid: userid, id_empresa:$(this).val()},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#resultArchCompronaNuevo').html(data);
						  ContabilidadGenarchivosanticipos.contarSeleccionados();
					  } 
				});
			});
			
			$( "#checkAll" ).click(function(e){
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
				ContabilidadGenarchivosanticipos.contarSeleccionados();
			});

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
                                        console.log("Checked");
					
					if( $(this).is(":checked") == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					ContabilidadGenarchivosanticipos.contarSeleccionados();
				}
			}, "#tablaArchivosAnticipos .checkbox");
						
			$("#btnGenerarArchivo").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var folio = $("#noFolio").val();
				//var folio = $("#noFolio").val();
				var url = baseUrl + "/catalogos/contabilidad/generararchivocomproba?userid=" + userid + "&folio=" + folio;
				window.open( url ,'_blank');
			});
			
			$("#btnGenerarArchivo______").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var url = baseUrl + "/catalogos/tesoreria/getarchivospei?userid=" + userid;
				window.open( url ,'_blank');
			});
			
			$("#btnFinalizar").click(function(e){
				Layout.showLoading();
				Menu.loadModuleMenu('catalogos', 'contabilidad', 'archivocomprobanuevo', '#');
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
    		        url: baseUrl + '/catalogos/contabilidad/setgeneraarchivoscomproba',
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
                                                console.log(anticipo);
						//cadenaArray = cadena.split("-");
//						//anticipo = $("#importe-" + cadenaArray[1] ).html();
//						anticipo = anticipo.substring(1);
//                                                anticipo = anticipo.substring(1);
//                                                console.log(anticipo);
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
   ContabilidadGenarchivosanticipos.contarSeleccionados();
}
ContabilidadGenarchivosanticipos.init();