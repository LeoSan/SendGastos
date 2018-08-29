var MontosolicitudIndex = {
		init : function() {
			//$(".grid-title").html("Comprobaciones");
			/*
			$("#selStatus").change(function( e ) {
				e.preventDefault();
				MontosolicitudIndex.ChangeFilter();
			});
			*/
			MontosolicitudIndex.cargarGrid();

			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					var total = 0;
					var totalFormat = 0;
					$("#lista-montosolicitud input[type=text]").each(function(e){
						var elemento = this;
						total += parseFloat( $(this).val() );
					});
					
					totalFormat = parseFloat(total).toFixed(2);
					$("#totalImporteReal").html( "$ " + totalFormat.toString() );
				}
			}, "#lista-montosolicitud .importereal");
			
			
			$("#bntGuardarComprobacion").click(function( e ) {
				e.preventDefault();
				//$('#catalogo-content').html("");
				var cadenaIds = "";
				
				var hayReg = $("#lista-montosolicitud input[type=text]").length;
				
				if(hayReg <= 0 ){
					alert("No hay registros a guardar");
					return false;
				}
				var creditos = "";
				var importes = "";
				var conceptos = "";
				$("#lista-montosolicitud input[type=text]").each(function(e){
					var elemento = this;
					creditos += $(this).attr("credito") +  "|";
					importes += $(this).val() +  "|";
					conceptos += $(this).attr("idconcepto") +  "|";
				});
				/*
				console.log("Creditos:");
				console.log(creditos);
				console.log(importes);
				*/
				$.ajax({
					  url: baseUrl + '/gastos/comprobacion/setcomprobacion',
					  type: 'POST',
					  data: {gastoid: $("#solicitudid").val(), creditos:creditos, importes:importes, conceptos:conceptos},
					  dataType: 'json',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  console.log(data);
						  return false;
						  
						  if( data.respuesta == "success" ){
							  MontosolicitudIndex.cargarGrid();
							  alert("Datos guardados correctamente.");
						  } else {
							  alert("Ocurrio un error: " + msj);
						  }
					} 
				});
			});
			
		},// End Init()
		resetearCampos : function() {
			$("#idCosto").val("0");
			$("#costoNombre").val("");
			$("#divStatus").hide();
			$("#status").val("A");
			$('#lblFormModalSuc').html("Agregar costo");
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
		},// resetearCampos()
		cargarGrid : function() {
			$.ajax({
				url: baseUrl + '/gastos/montosolicitud/getdetallecomprobacion',
				type: 'POST',
				data: {solicitudid : $("#solicitudid").val()},
				dataType: 'html',
				complete: function() {
					//Modal.close();
				},
				success: function(data) {
					//$('#modalAltaIndividual').modal('hide');
					$('#lista-montosolicitud').html(data);
				} 
			});
		}
};

MontosolicitudIndex.init();