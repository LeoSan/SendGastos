var TesoreriaArchivosanticipos = {
		init : function() {
			$(".grid-title").html("Archivos depósitos anticipos");
			TesoreriaArchivosanticipos.contarSeleccionados();
			
			$( "#fecha" ).datepicker({"dateFormat": "dd/mm/yy"});
			
			$("#id_empresa").change(function(e){
				e.preventDefault();
				var userid = $('#noEmpleado').html();
				$('#catalogo-content').html('');
				Layout.showLoading();
				$.ajax({
					url: baseUrl + '/catalogos/tesoreria/archivosanticipos',
					  type: 'POST',
					  data: {userid: userid, id_empresa:$(this).val(), pantalla:'get'},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#catalogo-content').html(data);
					  } 
				});
				//Busqueda de las cuentas de banco de la empresa seleccionada
				
				/*
				 * 
				var id_empresa = $(this).val();
				var url = baseUrl + "/catalogos/tesoreria/getcuentas";
				
				if(id_empresa != ""){
					$.ajax({
						type: "POST",
						url: url,
						data: { id: idcategoria },
						dataType: 'json',
						success: function(data) {
							console.log(data);
							$( "#id_cuenta" ).find('option').remove().end();
							$( "#id_cuenta" ).append('<option value="">- Seleccione -</option>');
							$.each(data.cuentas, function (i, item) {
								$( "#id_cuenta" ).append('<option value="' + item.IDCUENTACAT + '">' + item.NMDESCRIP + '</option>');
								//console.log(item.NMDESCRIP);
						    });
						}
					});
				}
				*/
			});
			
			$("#btnBuscar").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var fecha = $("#fecha").val();
				
				if (!fecha){
					$("#fecha").focus();
				}
				$('#tablaArchivosAnticipos').html("Cargando...");
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/catalogos/tesoreria/archivosanticipos',
					  type: 'POST',
					  data: {userid: userid, fecha : fecha, pantalla : 'get'},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#tablaArchivosAnticipos').html(data);
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
				TesoreriaArchivosanticipos.contarSeleccionados();
			});

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					
					if( $(this).is(":checked") == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					TesoreriaArchivosanticipos.contarSeleccionados();
				}
			}, "#tablaArchivosAnticipos .checkbox");
						
			$("#btnGenerarArchivo").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				//var folio = $("#noFolio").val();
				var url = baseUrl + "/catalogos/tesoreria/generararchivosanticipos?userid=" + userid;
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
				Menu.loadModuleMenu('catalogos', 'tesoreria', 'archivosanticipos', '#');
        		Layout.hideLoading();
			});
			
			$("#btnGuardar").click(function(e){
				e.preventDefault();

				var idsGastos = '';
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
							idsGastos += $(this).attr( "gastoid" ) + "|";
						}
					}
				});
				
				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreria/setarchivosanticipos',
    		        data: {
    					idGasto	: idsGastos,
    					userid	: userid,
    					pantalla: pantalla
    				},
    		        success: function (data) {
    		        	console.log(data);
		            	Layout.hideLoading();
    		        	if (data.success == true) {
    		        		//$("#noFolio").val(data.folio);
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
			
			$("#btnGuardar__").click(function(e){
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
				var pantalla = 'pagosChequesViaAnticipos';
				
				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaArchivosAnticipos").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gastos a procesar.");
					return false;
				}
				
				if( nsel == 1 && $("#checkAll").is(':checked') == true){
					alert("Seleccione los gastos a procesar.");
					return false;
				}

				var faltaCuenta = false;
				$("#tablaArchivosAnticipos input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsPuestos += $(this).attr( "gastoid" ) + "|";
							appUid += $(this).attr( "appuid" ) + "|";
							tasUid += $(this).attr( "tasuid" ) + "|";
							delIndex += $(this).attr( "delindex" ) + "|";
							dynid += $(this).attr( "dynid" ) + "|";
							importe += $(this).attr( "importe" ) + "|";
							//banco += "0012";
							banco += $("#cuenta-" + $(this).attr( "gastoid" )).val() + "|";
							cuentas += $("#cuenta-" + $(this).attr( "gastoid" ) + " option:selected").text() + "|";
							//empresaFact += $("#cuenta-" + $(this).attr( "gastoid" )).val();
							//empresaFact += $(this).attr( "facturarA" );
							empresaFact += $("#id_empresa").val() + "|"; // Banco de salida PCI
							cheques += ''+ "|";
							nombre += $(this).attr( "nombre" ) + "|";
							rfc += $(this).attr( "rfc" ) + "|";
							etapa += $(this).attr( "tipomovto" ) + "|";
							if( $("#cuenta-" + $(this).attr( "gastoid" ) + " option:selected").text() == "- Seleccione una opción -" ){
								faltaCuenta = true;
								alert("Seleccione un cuenta del gasto.");
								$("#cuenta-" + $(this).attr( "gastoid" ) ).focus();
								return false;
							}
						}
					}
				});
				
				if(faltaCuenta){
					return false;
				}

				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreria/setaplicatransferenciaelectronica',
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
    					tipoPago: '36',
    					nombre: nombre,
    					rfc: rfc,
    					userid: userid,
    					pantalla: pantalla
    				},
    		        success: function (data) {
    		        	console.log(data);
		            	Layout.hideLoading();
    		        	if (data.success == true) {
    		        		$("#btnGenerarArchivo").show();
    						$("#btnFinalizar").show();
    						$("#btnGuardar").hide();
    						console.log( data.num_bloque );
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
   TesoreriaArchivosanticipos.contarSeleccionados();
}
TesoreriaArchivosanticipos.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/