var AsignacionIndex = {
		init : function() {

			this.basicTypehead();
			// this.typeheadSearch();
			// this.typeHeadSearchNew();

            /*$('#conceptoBuscarTypehead').typeahead({
                matchOn: ["id", "name"],
                source: {teams:{data:[
                    { id: 1, name: 'Toronto' },
                    { id: 2, name: 'Montreal' },
                    { id: 3, name: 'New York' },
                    { id: 4, name: 'Buffalo' },
                    { id: 5, name: 'Boston' },
                    { id: 6, name: 'Columbus' },
                    { id: 7, name: 'Dallas' },
                    { id: 8, name: 'Vancouver' },
                    { id: 9, name: 'Seattle' },
                    { id: 10, name: 'Los Angeles' }
                ]}},
                debug: true
            });*/

			var dateFormat = "dd/mm/yy";
			$("#fpagoini").datepicker({"dateFormat": "dd/mm/yy"}).on("change", function() {
				$("#fpagofin").datepicker( "option", "minDate", getDate( this ) );
			});
			$("#fpagofin").datepicker({"dateFormat": "dd/mm/yy"}).on("change", function() {
				$("#fpagoini").datepicker( "option", "maxDate", getDate( this ) );
			});

			$("#fechaejec").datepicker({"dateFormat": "dd/mm/yy"});
			
			function getDate( element ) {
				var date;
				try {
					date = $.datepicker.parseDate( dateFormat, element.value );
				} catch( error ) {
					date = null;
				}
				return date;
			}
			
			if( $("#frmAsignacion #tipocaptura").val() == "3" ){
				$('#modalAltaMasiva').modal('show');
			}

			AsignacionIndex.cargarGrid();
			
			$('#file_upload').uploadify({
		        'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
		        'uploader' : baseUrl + '/gastos/asignacion/uploadfile',
		        'buttonText' : 'Examinar...',
		        'removeCompleted' : true,
		        'formData': {'solicitudid' : $("#solicitudid").val()},
		        'onUploadComplete' : function(file) {
		            //$("#archivo").val(file.name);
		        	console.log('onUploadComplete el archivo ' + file.name + ' finalizó exitosamente.');
		        },
		        'onUploadSuccess' : function(file, data, response) {
		        	$("#msjErrorUploadSuccess").hide();
		        	$("#msjErrorUploadError").hide();
		        	var cadena = JSON.parse(data);
		        	if(cadena.success == 'true'){
			        	$("#archivo").val(cadena['file']);
			        	$("#msjErrorUploadSuccess").html('EL archivo ' + file.name + ' se cargo progresivamente');
			        	$("#msjErrorUploadSuccess").show();
			        	console.log('onUploadSuccess el archivo ' + file.name + ' se cargo progresivamente con respuesta ' + response + ':' + data);
		        	} else {
		        		$("#msjErrorUploadError").html(cadena.msg);
		        		$("#msjErrorUploadError").show();
		        		//alert(cadena.msg);
		        	}
		        },
		        'onUploadStart' : function(file) {
		        	$("#msjErrorUploadSuccess").hide();
		        	$("#msjErrorUploadError").hide();
		        }
		        // Put your options here
		    });
			/*
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					var idcategoria = $(this).val();
					var url = baseUrl + "/gastos/asignacion/getsbcatconceptoasig";
					
					if(!idcategoria){
						$( "#categoria" ).find('option').remove().end();
						$( "#categoria" ).append('<option value="">- Seleccione -</option>');
					}
					
					$( "#subcategoria, #conceptoid" ).find('option').remove().end();
					$( "#subcategoria" ).append('<option value=""> Cargando ... </option>');
					$( "#conceptoid" ).append('<option value="">- Seleccione -</option>');
					
					$.ajax({
						type: "POST",
						url: url,
						data: { categoriaid: idcategoria, tiposolicitud:$("#tiposolicitud").val(), queasigna:$("#tipocaptura").val(), puesto:$("#puestoid").val() },
						dataType: 'json',
						success: function(data) {
							$( "#subcategoria" ).find('option').remove().end();
							$( "#subcategoria" ).append('<option value="">- Seleccione -</option>');
							$.each(data.subcategorias, function (i, item) {
								$( "#subcategoria" ).append('<option value="' + item.IDVALOR + '">' + item.NMVALOR + '</option>');
								//console.log(item.NMDESCRIP);
						    });
						}
					});
				}
			}, "#categoria");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					var idsubcategoria = $(this).val();
					var url = baseUrl + "/gastos/asignacion/getqueconceptoasig";
					
					if(!idsubcategoria){
						$( "#categoriaid" ).focus();
					}
					
					$( "#conceptoid" ).find('option').remove().end();
					$( "#conceptoid" ).append('<option value=""> Cargando ... </option>');
					
					$.ajax({
						type: "POST",
						url: url,
						data: { categoriaid: $("#categoria").val(), subcategoriaid: idsubcategoria,tiposolicitud:$("#tiposolicitud").val(), queasigna:$("#tipocaptura").val(), puesto:$("#puestoid").val() },
						dataType: 'json',
						success: function(data) {
							$( "#conceptoid" ).find('option').remove().end();
							$( "#conceptoid" ).append('<option value="">- Seleccione -</option>');
							$.each(data.conceptos, function (i, item) {
								$( "#conceptoid" ).append('<option value="' + item.IDCONCEPTO + '">' + item.NMCONCEPTO + '</option>');
								//console.log(item.NMDESCRIP);
						    });
						}
					});
				}
			}, "#subcategoria");*/
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					var conceptoid = $(this).val();
					var solicitudid = $("#solicitudid").val();
					var url = baseUrl + "/gastos/asignacion/getcarteraconcepto";
					
					$("#idplanviaje").val( '' );
					$("#linkmsg").html( '' );
					$("#linkmsg").removeClass( 'error' );
					$("#isvalidPlan").val( 0 );

					if(!conceptoid){
						alert("Seleccione un concepto");
						return false;
					}
					
					$( "#cartera" ).find('option').remove().end();
					$( "#cartera" ).append('<option value=""> Cargando ... </option>');
					
					$.ajax({
						type: "POST",
						url: url,
						data: { conceptoid: conceptoid },
						dataType: 'json',
						success: function(data) {
							console.log(data);
							if( data.respuesta != 'fail' ) {
								$( "#cartera" ).find('option').remove().end();
								$( "#cartera" ).append('<option value="">- Seleccione -</option>');
								$.each(data.carteras, function (i, item) {
									$( "#cartera" ).append('<option value="' + item.IDVALOR + '">' + item.NMVALOR + '</option>');
									//console.log(item.NMDESCRIP);
						    	});
							}
						}
					});
					
					//Validamos si el gasto es Pago de Conceptos
					url = baseUrl + "/gastos/asignacion/espagodeservicios";
					$.ajax({
						type: "POST",
						url: url,
						data: { conceptoid: conceptoid, solicitudid: solicitudid },
						dataType: 'json',
						success: function(data) {
							if( data.pagoservicio ){
								$(".pagoserv").show();
								$("#esPagoServicio").val("S");
							} else {
								$(".pagoserv").hide();
								$("#esPagoServicio").val("N");
							}
							if( data.planviaje ){
								$(".planviaje").show();
								$("#idconceptopv").val( data.planviajeidc );
								$("#perfilconcepto").val( data.perfilconcepto );
								$("#idplanviaje").val( data.planviajeid );
								if( data.planviajeid != '' ) { $("#idplanviaje").attr('readonly','readonly'); }
							} else {
								$(".planviaje").hide();
								$("#idconceptopv").val( data.planviajeidc );
							}

							if( data.fecha_ejec ){
								$(".fechaejecuta").show();
								$("#isFechaejec").val('S');
							} else {
								$(".fechaejecuta").hide();
								$("#isFechaejec").val('N');
							}
						}
					});	
				}
			}, "#conceptoid");
			
			$( document ).on({
				blur : function( e ) {
					var idgasto = $(this).val().trim();
					var idconcepto = $("#idconceptopv").val(); 
						
					if( idgasto == '' ) {
						$("#linkmsg").html( '' );
						$("#linkmsg").removeClass( 'error' );
						$("#isvalidPlan").val( 0 );
						return false;
					}
					$.ajax({
						type: "POST",
						url: baseUrl + "/gastos/asignacion/valida-planviaje/",
						data: { idgasto: idgasto, idconcepto: idconcepto },
						dataType: 'json',
						success: function(data) {
							if( data.success ){
								$("#linkmsg").html( data.message );
								$("#linkmsg").removeClass( 'error' );
								$("#isvalidPlan").val( 1 );
							} else {
								$("#linkmsg").html( data.message );
								$("#linkmsg").addClass( 'error' );
								$("#isvalidPlan").val( 0 );
							}
						}
					});
					
				}
			}, "#idplanviaje");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					var conceptoid = $("#conceptoid").val();
					var credito = $(this).val();
					
					//Validamos si el gasto es Pago de Conceptos
					url = baseUrl + "/gastos/asignacion/espagodeservicios-date";
					$.ajax({
						type: "POST",
						url: url,
						data: { conceptoid: conceptoid, credito: credito },
						dataType: 'json',
						success: function(data) {
							if(data.pagoservicio == 'SI'){
								$("#fpagoini").val( data.dates.daydel );
								$("#fpagofin").val( data.dates.dayal );
							} else {
							}
						}
					});
				}
			}, "#credito");
			
			$("#btnBuscarConcepto").click(function( e ) {
				e.preventDefault();
				if( $("#categoria").val() == "0" || $("#categoria").val() == "" ){
					alert("Seleccione una categoria");
					$("#categoria").focus();
					return false;
				}
				
				if( $("#subcategoria").val() == "0" || $("#subcategoria").val() == "" ){
					alert("Seleccione una subcategoria");
					$("#subcategoria").focus();
					return false;
				}
				
				if( $.trim( $("#conceptoBuscar").val() ) == "" ){
					$("#conceptoBuscar").focus();
					return false;
				}
				
				$( "#conceptoid" ).find('option').remove().end();
				$( "#conceptoid" ).append('<option value=""> Cargando ... </option>');

				var url = baseUrl + "/gastos/asignacion/getqueconceptonmasig";
				
				$.ajax({
					type: "POST",
					url: url,
					data: { categoriaid: $("#categoria").val(), subcategoriaid: $("#subcategoria").val(),tiposolicitud:$("#tiposolicitud").val(), queasigna:$("#tipocaptura").val(), puesto:$("#puestoid").val(), texto:$("#conceptoBuscar").val() },
					dataType: 'json',
					success: function(data) {
						$( "#conceptoid" ).find('option').remove().end();
						$( "#conceptoid" ).append('<option value="">- Seleccione -</option>');
						$.each(data.conceptos, function (i, item) {
							$( "#conceptoid" ).append('<option value="' + item.IDCONCEPTO + '">' + item.NMCONCEPTO + '</option>');
							//console.log(item.NMDESCRIP);
					    });
					}
				});
			});
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					var idcategoria = $(this).val();
					var url = baseUrl + "/gastos/asignacion/getccsolicitud";
					
					if(!idcategoria){
						$( "#gccosto" ).focus();
						return false;
					}
					
					$( "#ccosto" ).find('option').remove().end();
					$( "#ccosto" ).append('<option value=""> Cargando ... </option>');
					
					$.ajax({
						type: "POST",
						url: url,
						data: { categoriaid: idcategoria },
						dataType: 'json',
						success: function(data) {
							$( "#ccosto" ).find('option').remove().end();
							$( "#ccosto" ).append('<option value="">- Seleccione -</option>');
							$.each(data.centroscosto, function (i, item) {
								$( "#ccosto" ).append('<option value="' + item.IDCENTROCOSTO + '">' + item.NMCENTROCOSTO + '</option>');
								//console.log(item.NMDESCRIP);
						    });
						}
					});
				}
			}, "#gccosto");
			
			$("#btnConceptosValidos").click(function(e){
				if( $('#muestaConceptosValidos').css('display') == 'none' ){
					$('#muestaConceptosValidos').show();
				} else {
					$('#muestaConceptosValidos').hide();
				}
			});
			
			$("#btnAgregarAsignacion").click(function(e){
				if( $("#tipocaptura").val() == "3" ){
					/* MULTICREDITOS O ALTA MASIVA DE CREDITOS */
					/*
					if( $("#conceptoid").val() == "0" || $("#conceptoid").val() == "" ){
						alert("Debe seleccionar un concepto");
						$("#conceptoid").focus();
						return false;
					}
					
					$("#concepetoSeleccionadoLabel").html( "Concepto: " +  $("#conceptoid option:selected").text() );
					*/
					$('#modalAltaMasiva').modal('show');
				}
				//End if captura masiva
				if( $("#tipocaptura").val() == "2" ){
					AsignacionIndex.guardarAltaIndividual(e);
				}
				
				if( $("#tipocaptura").val() == "4" ){
					AsignacionIndex.guardarCapturaCartera(e);
				}
				
				if( $("#tipocaptura").val() == "42" ){
					AsignacionIndex.guardarImporteGeneral(e);
				}
				
			});
			
			$("#verificacionAltMas").click(function( e ) {
				e.preventDefault();
				//$('#catalogo-content').html("");
				
				if( $("#conceptoid").val() == "" ){
					alert("Seleccione un concepto.");
					$("#conceptoid").focus();
					return false;
				}
				
				if( $("#archivo").val() == "" ){
					alert("Seleccione un archivo a validar.");
					$("#archivo").focus();
					return false;
				}
				
				var userid = $('#noEmpleado').html();
				var solicitudid = $("#solicitudid").val();
				var tipoAsignacion = $("#tipocaptura").val();
				var tiposolicitud = $("#tiposolicitud").val();
				var empleadoid = $("#empleadoid").val();
				var usuariopm = $("#usuariopm").val();
				var appuid = $("#appuid").val();
				var conceptoid = $("#conceptoid").val();
				
				$(".loading-search").show();
				$.ajax({
					url: baseUrl + '/gastos/asignacion/validaarchivoasigna',
					type: 'POST',
					data: "archivo=" + $("#archivo").val() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion + "&tiposolicitud=" + tiposolicitud + "&conceptoid=" + conceptoid + "&empleadoid=" + empleadoid + "&usuariopm=" + usuariopm + "&appuid=" + appuid,
					dataType: 'json',
					complete: function() {
						//Modal.close();
					},
					success: function(data) {
						console.log(data);
						$(".loading-search").hide();
						if( data.respuesta == 'success' ){
							$('#verificado').val("S");
							$('#msjErrorValidaSuccess').html("Los datos presentados son correctos. Total de registros: " + data.total);
							$('#msjErrorValidaSuccess').show();
							$('#msjErrorValidaError').hide();
							$("#verificacionAltMas").hide();
						} else {
							$('#msjErrorValidaError').html(data.msj);
							$('#msjErrorValidaError').show();
							$('#msjErrorValidaSuccess').hide();
							return false;
						}
					} 
				});
			});
			
			$("#procesamientoAltMas").click(function( e ) {
				e.preventDefault();
				//$('#catalogo-content').html("");
				
				if( $("#conceptoid").val() == "" ){
					alert("Seleccione un concepto.");
					$("#conceptoid").focus();
					return false;
				}
				/*
				$("#archivo").val("GTO12PASO.csv")
				$("#verificado").val("S")
				*/
				if( $("#archivo").val() == "" ){
					alert("Seleccione un archivo a validar.");
					$("#archivo").focus();
					return false;
				}
				
				if( $("#verificado").val() == "N" ){
					alert("Debe verificar el archivo antes de continuar.");
					//$("#conceptoid").focus();
					return false;
				}
				
				var userid = $('#noEmpleado').html();
				var solicitudid = $("#solicitudid").val();
				var tipoAsignacion = $("#tipocaptura").val();
				$(".loading-search").show();
				$.ajax({
					url: baseUrl + '/gastos/asignacion/validamasivacreditoasigna',
					type: 'POST',
					data: "archivo=" + $("#archivo").val() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion,
					dataType: 'json',
					complete: function() {
						//Modal.close();
					},
					success: function(data) {
						console.log(data);
						$(".loading-search").hide();
						if( data.respuesta == 'success' ){
							$('#procesado').val("S");
							$('#msjErrorProcesaSuccess').html("Los datos se procesaron correctamente.");
							$('#msjErrorProcesaSuccess').show();
							$('#msjErrorProcesaError').hide();
							$("#procesamientoAltMas").hide();
							AsignacionIndex.cargarGrid();
						} else {
							$('#msjErrorProcesaError').html(data.msj);
							$('#msjErrorProcesaError').show();
							$('#msjErrorProcesaSuccess').hide();
							return false;
						}
					} 
				});
			});
			
			$("#btnFinalizarAltaMasiva").click(function( e ) {
				e.preventDefault();
				//$('#catalogo-content').html("");
				
				if( $("#verificado").val() == "N" ){
					alert("Es necesario verifivar el archivo correctamente.");
					$("#conceptoAltMas").focus();
					return false;
				}
				
				if( $("#procesado").val() == "N" ){
					alert("Es necesario procesar el archivo correctamente.");
					$("#conceptoAltMas").focus();
					return false;
				}
				
				$('#verificado').val("N");
				$('#procesado').val("N");
				
				$('#modalAltaMasiva').modal('hide');
			});
			
			$('#modalAltaMasiva').on('hidden', function () {
				$("conceptoAltMas").val("");
				$("#verificado").val("N");
				$("#procesado").val("N");
				$("#msjErrorValidaError").hide();
				$("#msjErrorValidaSuccess").hide();
				$("#msjErrorUploadError").hide();
				$("#msjErrorUploadSuccess").hide();
				$("#msjErrorProcesaError").hide();
				$("#msjErrorProcesaSuccess").hide();
			});
			
			$('#myModal').on('show', function () {
				$("#verificacionAltMas").show();
				$("#procesamientoAltMas").show();
			});
			
			$( document ).on({
				click : function( event ) {
					var credito = $(this).attr("rel");
					// var url = "http://quasar.pendulum.com.mx:59001/cobranza/aplicacion/credito/?dmacct=" + credito + "&user=" + $("#clavecyber").val();
					var url = "http://quasar.pendulum.com.mx:59001/cas/aplicacion/url/aplicacionExterna/?dmacct=" + credito + "&user=" + $("#usuariopm").val()+ "&procedencia=COB";
					window.open(url, "X1", "height=600,width=800");
					return false;
				}
			}, "#lista-asignaciones .linkX1");
			
			$( document ).on({
				click : function( event ) {
					var credito = $(this).attr("rel");
					// var url = "http://quasar.pendulum.com.mx:59001/el/aplicacion/creditos/credito?dmacct=" + credito + "&user=" + $("#clavecyber").val();
					var url = "http://quasar.pendulum.com.mx:59001/cas/aplicacion/url/aplicacionExterna/?dmacct=" + credito + "&user=" + $("#usuariopm").val()+ "|COB|1&procedencia=EL1";
					window.open(url, "X5", "height=600,width=800");
					return false;
				}
			}, "#lista-asignaciones .linkX5");
			
			$( document ).on({
				click : function( event ) {
					var solicitudid = $("#solicitudid").val();
					var conceptoid = $(this).attr("concepto");
					var conceptonombre = $(this).attr("nmconcepto");
					var credito = $(this).attr("credito");
					
					var res = confirm("¿Seguro que desea eliminar el concepto " + conceptonombre + "?");
					
					if (!res) {
						return false;
					}
					
					$.ajax({
						url: baseUrl + '/gastos/asignacion/delasignacionsolicitud',
						type: 'POST',
						data: {solicitudid: solicitudid, concepto: conceptoid, credito:credito},
						dataType: 'json',
						complete: function() {
							//Modal.close();
						},
						success: function(data) {
							console.log(data);
							if(data.respuesta == "success"){
								AsignacionIndex.cargarGrid();
							} else {
								alert(data.msj);
								return false;
							}
						} 
					});
				}
			}, "#lista-asignaciones .removeAsigna");

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
				url: baseUrl + '/gastos/asignacion/getdetalleasignacion',
				type: 'POST',
				data: {solicitudid : $("#solicitudid").val(), tipocaptura : $("#tipocaptura").val()},
				dataType: 'html',
				success: function(data) {
					$('#lista-asignaciones').html(data);
					if( data.trim() == '<p>No hay registros</p>' ) {
						$("#idplanviaje").removeAttr('readonly');
					}
				} 
			});
		},
		ChangeFilter : function() {
			var userid = $('#noEmpleado').html();
			$.ajax({
				  url: baseUrl + '/catalogos/categorias/index/',
				  type: 'POST',
				  data: {status: $("#selStatus").val(), userid: userid},
				  dataType: 'html',
				  complete: function() {
						//Modal.close();
				  },
				  success: function(data) {
					  	//$('ul#sidebar-main-menu li a').removeClass('current');
					  	//$('ul#sidebar-main-menu li#sidebar-' + controller + ' a').addClass('current');
						$('#catalogo-content').html(data);

						//Gestion.resizeElements();
					} 
			});
		},
		guardarAltaIndividual : function(e) {
			e.preventDefault();
			
			if( $("#conceptoid").val() == "0" || $("#conceptoid").val() == "" ){
				alert("Seleccione un concepto.");
				$("#conceptoid").focus();
				return false;
			}
			
			if( $("#credito").val() == "" ){
				alert("Ingrese un crédito.");
				$("#credito").focus();
				return false;
			}
			
			if( $("#importe").val() == "" ){
				alert("Ingrese un importe.");
				$("#importe").focus();
				return false;
			}
			
			if( $("#esPagoServicio").val() == "S" && $("#fpagoini").val() == "" ){
				alert("Ingrese la fecha pago inicio.");
				$("#fpagoini").focus();
				return false;
			}

			if( $("#isFechaejec").val() == "S" &&  $("#fechaejecuta").val() == "" ){
				alert("Ingrese la fecha de ejecucion.");
				$("#fechaejecuta").focus();
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
			var fpagoini = $("#fpagoini").val();
			var fpagofin = $("#fpagofin").val();
			$("#show-save-loading").show();
			$.ajax({
				url: baseUrl + '/gastos/asignacion/addcreditoasigna',
				type: 'POST',
				data: $("#frmAsignacion").serialize() + "&" + $("#frmAsignacion2").serialize() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion + "&tiposolicitud=" + tiposolicitud + "&empleadoid=" + empleadoid + "&usuariopm=" + usuariopm + "&appuid=" + appuid,
				dataType: 'json',
				complete: function() {
					//Modal.close();
				},
				success: function(data) {
					console.log(data);
					$("#show-save-loading").hide();
					if( data.respuesta == 'success' ){
						//$('#modalAltaIndividual').modal('hide');
						$("#credito").val("");
						$("#importe").val("");
						$("#credito").focus();
						AsignacionIndex.cargarGrid();
					} else {
						alert( "Ocurrio un error: " + data.msj );
						return false;
					}
				} 
			});
		},
		guardarCapturaCartera : function(e) {
			e.preventDefault();
			
			if( $("#conceptoid").val() == "0" || $("#conceptoid").val() == "" ){
				alert("Seleccione un concepto.");
				$("#conceptoid").focus();
				return false;
			}
			
			if( $("#cartera").val() == "0" || $("#cartera").val() == "" ){
				alert("Seleccione una cartera.");
				$("#cartera").focus();
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
			if( $("#isFechaejec").val() == "S" &&  $("#fechaejecuta").val() == "" ){
				alert("Ingrese la fecha de ejecucion.");
				$("#fechaejecuta").focus();
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
				url: baseUrl + '/gastos/asignacion/addcarteraasigna',
				type: 'POST',
				data: $("#frmAsignacion").serialize() + "&" + $("#frmAsignacion2").serialize() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion + "&tiposolicitud=" + tiposolicitud + "&empleadoid=" + empleadoid + "&usuariopm=" + usuariopm + "&appuid=" + appuid + "&ccosto=" + ccosto,
				dataType: 'json',
				complete: function() {
					//Modal.close();
				},
				success: function(data) {
					console.log(data);
					$("#show-save-loading").hide();
					if( data.respuesta == 'success' ){
						//$('#modalAltaIndividual').modal('hide');
						$("#cartera").val("");
						$("#importe").val("");
						$("#gccosto").val("");
						$("#ccosto").val("");
						AsignacionIndex.cargarGrid();
						$("#importe").focus();
					} else {
						alert( "Ocurrio un error: " + data.msj );
						return false;
					}
				} 
			});
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
			
			if( $("#idplanviaje" ).is(':visible') && $("#idplanviaje" ).val() == '' ) {
				$("#idplanviaje").focus();
				$("#linkmsg").addClass('error');
				$("#linkmsg").html('Valor no valido');
				return false;
			}
			
			if( $("#perfilconcepto").val() != ''  ) {
				if( $("#idconceptopv").val() != $("#conceptoid").val()  ) {
					alert( "Para el concepto no es posible combinar con otros conceptos" );
					return false;
				}
			}
			
			if ( $("#idplanviaje" ).is(':visible') && $("#linkmsg").hasClass( 'error' ) ) {
				alert( "El plan de viaje no es valido." );
				return false;
			}
			
			if( $("#isFechaejec").val() == "S" &&  $("#fechaejec").val() == "" ){
				alert("Ingrese la fecha de ejecucion.");
				$("#fechaejec").focus();
				return false;
			}
			
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
				success: function(data) {
					$("#show-save-loading").hide();
					if( data.respuesta == 'success' ){
						$("#importe").val("");
						$("#gccosto").val("");
						$("#ccosto").val("");
						$("#idplanviaje").attr('readonly','readonly');
						AsignacionIndex.cargarGrid();
						$("#importe").focus();
					} else {
						alert( "Ocurrio un error: " + data.msj );
						return false;
					}
				} 
			});
		},
    	basicTypehead: function () {
			var substringMatcher = function substringMatcher(strs) {
				return function findMatches(q, cb) {
					// an array that will be populated with substring matches
					var matches = [];
					// regex used to determine if a string contains the substring `q`
					var substrRegex = new RegExp(q, 'i');
					// iterate through the pool of strings and for any string that
					// contains the substring `q`, add it to the `matches` array
					$.each(strs, function (i, str) {
						if (substrRegex.test(str.label)) {
							matches.push(str);
                            console.log(str.id)
						}
					});
					cb(matches);
				};
			};
			var states = this.getconceptosByPuestoTC();

			$('#conceptoBuscarTypehead').typeahead({
				hint: true,
				highlight: true,
				minLength: 1
			}, {
				source: substringMatcher(states),
                display: 'label',
                val: 'id',
                autoSelect: true,
                displayText: function(item){ $("#conceptoBuscarHidden").val(item.id); return item.label;},
                templates: {
                    empty: ['<div class="noitems">','No se encontraron coincidencias','</div>'].join('\n')
                }
			});

            $('#conceptoBuscarTypehead').on('typeahead:selected', function(evt, item) {
                // do what you want with the item here
                $("#conceptoBuscarHidden").val(item.id);

                $("#categoria option").each(
                    function(){
                        if($(this).val()==item.idcategoria){//json categoria
                            $(this).prop('selected',true);
                        }else{
                            $(this).prop('selected',false);
                            //$(this).hide();
                        }
                    }
                );

                $("#subcategoria option").each(
                    function(){
                        if($(this).attr("data-categoria")==item.idcategoria){//json categoria
                            $(this).fadeIn()
							if($(this).val()==item.idsubcategoria){
                                $(this).prop('selected',true);
							}
                        }else{
                            $(this).prop('selected',false);
                            $(this).fadeOut()
                            //$(this).hide();
                        }
                    }
                );

                $("#conceptoid option").each(
                    function(){
                        if($(this).attr("data-subcategoria")==item.idsubcategoria){//json categoria
                            $(this).fadeIn()
							if($(this).val()==item.id){
                                $(this).prop('selected',true);
							}
                        }else{
                            $(this).prop('selected',false);
                            $(this).fadeOut()
                            //$(this).hide();
                        }
                    }
                );

				console.log(item);
				console.log(evt);
            })
		},
		getconceptosByPuestoTC: function getPuestos() {
    		return conceptosByPuestoTC;//index.phtml
		},

};
setTimeout(function () {
    AsignacionIndex.init();
},2000);
