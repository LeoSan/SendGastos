var AutorizacionIndex = {
		init : function() {
			$(".grid-title").html("Autorizaciones");
			$("#lista-autorizaciones input:radio").click(function(){
				//alert("Has hecho click en: " + $(this).val());
				$("#show-save-loading").show();
				$.ajax({
					url: baseUrl + '/gastos/autorizaciones/setautorizacion',
					type: 'POST',
					data: {nombre:$(this).attr('name'), valor:$(this).val()},
					dataType: 'json',
					complete: function() {
						//Modal.close();
					},
					success: function(data) {
						console.log(data);return false;
						$("#show-save-loading").hide();
						if( data.respuesta == 'success' ){
							//Los datos se guardaron correctamente
						} else {
							alert( "Ocurrio un error: " + data.msj );
							return false;
						}
					} 
				});
			});
			
			$("#lista-autorizaciones textarea").blur(function(){
				//alert("Cambios realizados en: " + $(this).val());
				$("#show-save-loading").show();
				$.ajax({
					url: baseUrl + '/gastos/autorizaciones/setcomentario',
					type: 'POST',
					data: {nombre:$(this).attr('name'), valor:$(this).val()},
					dataType: 'json',
					complete: function() {
						//Modal.close();
					},
					success: function(data) {
						console.log(data);return false;
						$("#show-save-loading").hide();
						if( data.respuesta == 'success' ){
							//Los datos se guardaron correctamente
						} else {
							alert( "Ocurrio un error: " + data.msj );
							return false;
						}
					} 
				});
			});

			$( document ).on({
				click : function( event ) {
					var credito = $(this).attr("rel");
//					var url = "http://quasar.pendulum.com.mx:59001/cobranza/aplicacion/credito/?dmacct=" + credito + "&user=" + $("#usuariopm").val();
					 var url = "http://quasar.pendulum.com.mx:59001/cas/aplicacion/url/aplicacionExterna/?dmacct=" + credito + "&user=" + $("#usuariopm").val()+ "&procedencia=COB";
					window.open(url, "X1", "height=600,width=800");
					return false;
				}
			}, "#lista-autorizaciones .linkX1");
			
			$( document ).on({
				click : function( event ) {
					var credito = $(this).attr("rel"); 
//					var url = "http://quasar.pendulum.com.mx:59001/el/aplicacion/creditos/credito?dmacct=" + credito + "&user=" + $("#usuariopm").val();
					 var url = "http://quasar.pendulum.com.mx:59001/cas/aplicacion/url/aplicacionExterna/?dmacct=" + credito + "&user=" + $("#usuariopm").val()+ "|COB|1&procedencia=EL1";
					window.open(url, "X5", "height=600,width=800");
					return false;
				}
			}, "#lista-autorizaciones .linkX5");
		},
		guardarImporteGeneral : function(e) {
			e.preventDefault();
			
			if( $("#conceptoid").val() == "0" || $("#conceptoid").val() == "" ){
				alert("Seleccione un concepto.");
				$("#conceptoid").focus();
				return false;
			}
			
			if( $("#importe").val() == "" ){
				alert("Ingrese un importe.");
				$("#importe").focus();
				return false;
			}
			
			if( $("#gccosto").val() == "0" || $("#gccosto").val() == "" ){
				alert("Seleccione un grupo de centro de costo.");
				$("#gccosto").focus();
				return false;
			}
			
			if( $("#ccosto").val() == "0" || $("#ccosto").val() == "" ){
				alert("Seleccione un centro de costo.");
				$("#ccosto").focus();
				return false;
			}
			//console.log("Guardamos la informacion del credito individual.");return false;
			
			var userid = $('#noEmpleado').html();
			var solicitudid = $("#solicitudid").val();
			var tipoAsignacion = $("#tipocaptura").val();
			var tiposolicitud = $("#tiposolicitud").val();
			var empleadoid = $("#empleadoid").val();
			var usuariopm = $("#usuariopm").val();
			var appuid = $("#appuid").val();
			var ccosto = $("#ccosto").val();
			$("#show-save-loading").show();
			$.ajax({
				url: baseUrl + '/gastos/asignacion/addaimporteasigna',
				type: 'POST',
				data: $("#frmAsignacion").serialize() + "&" + $("#frmAsignacion2").serialize() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion + "&tiposolicitud=" + tiposolicitud + "&empleadoid=" + empleadoid + "&usuariopm=" + usuariopm + "&appuid=" + appuid + "&gccosto=" + gccosto,
				dataType: 'json',
				complete: function() {
					//Modal.close();
				},
				success: function(data) {
					console.log(data);
					$("#show-save-loading").hide();
					if( data.respuesta == 'success' ){
						//$('#modalAltaIndividual').modal('hide');
						$("#importe").val("");
						$("#gccosto").val("");
						$("#ccosto").val("");
						AutorizacionIndex.cargarGrid();
						$("#importe").focus();
					} else {
						alert( "Ocurrio un error: " + data.msj );
						return false;
					}
				} 
			});
		}
};

AutorizacionIndex.init();