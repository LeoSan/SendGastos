/**
 * 
 */

var AsignacionExterno = {
		externo : $("#capaExternosGastos"),
		init : function() {
			
			if( AsignacionExterno.externo.find("#frmAsignacion #tipocaptura").val() == "3" ){
				AsignacionExterno.externo.find('#modalAltaMasiva').modal('show');
			}

			AsignacionExterno.cargarGrid();

			
			
			AsignacionExterno.externo.find('#file_upload').uploadify({
		        'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
		        'uploader' : baseUrl + '/gastos/asignacion/uploadfile',
		        'buttonText' : 'Examinar...',
		        'removeCompleted' : true,
		        'formData': {'solicitudid' : $("#solicitudid").val()},
		        'onUploadComplete' : function(file) {
		            //$("#archivo").val(file.name);

		        },
		        'onUploadSuccess' : function(file, data, response) {
		        	$("#msjErrorUploadSuccess").hide();
		        	$("#msjErrorUploadError").hide();
		        	var cadena = JSON.parse(data);
		        	if(cadena.success == 'true'){
			        	$("#archivo").val(cadena['file']);
			        	$("#msjErrorUploadSuccess").html('EL archivo ' + file.name + ' se cargo progresivamente');
			        	$("#msjErrorUploadSuccess").show();

		        	} else {
		        		$("#msjErrorUploadError").html(cadena.msg);
		        		$("#msjErrorUploadError").show();
		        	}
		        },
		        'onUploadStart' : function(file) {
		        	$("#msjErrorUploadSuccess").hide();
		        	$("#msjErrorUploadError").hide();
		        }
		        // Put your options here
		    });
			
		AsignacionExterno.externo.find( "#categoria" ).on({
				change : function( e ) {
					e.preventDefault();
					var idcategoria = $(this).val();
					var url = baseUrl + "/gastos/asignacionextranet/getsbcatconceptoasig";
					
					if(!idcategoria){
						$( "#categoria" ).find('option').remove().end();
						$( "#categoria" ).append('<option value="">- Seleccione -</option>');
					}
					
					$( "#subcategoria" ).find('option').remove().end();
					$( "#subcategoria" ).append('<option value=""> Cargando ... </option>');
					
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

						    });
						}
					});
				}
			});
			
			AsignacionExterno.externo.find( "#subcategoria" ).on({
				change : function( e ) {
					e.preventDefault();
					var idsubcategoria = $(this).val();
					var url = baseUrl + "/gastos/asignacionextranet/getqueconceptoasig";

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

						    });
						}
					});
				}
			});
			
			AsignacionExterno.externo.find( "#conceptoid" ).on({
				change : function( e ) {
					e.preventDefault();
					var conceptoid = $(this).val();
					var url = baseUrl + "/gastos/asignacionextranet/getcarteraconcepto";
					
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

							$( "#cartera" ).find('option').remove().end();
							$( "#cartera" ).append('<option value="">- Seleccione -</option>');
							$.each(data.carteras, function (i, item) {
								$( "#cartera" ).append('<option value="' + item.IDVALOR + '">' + item.NMVALOR + '</option>');
						    });
						}
					});
				}
			});
			
			AsignacionExterno.externo.find( "#cbjuicio" ).on({
				change : function( e ) {
					e.preventDefault();
					var idjuicio = $("#cbjuicio").val();
					var url = baseUrl + "/gastos/asignacionextranet/get-info-juicio";
					$.ajax({
						type: "POST",
						url: url,
						data: { 
							idjuicio: idjuicio
						},
						dataType: 'json',
						success: function(data) {
							$("#txtjuicio").val(data[0].CREDITO);
							$("#hidecredito").val(data[0].CREDITO);
							$("#superv").val(data[0].NOMBRE_SUPERVISOR);
							$("#nom_acredi").val(data[0].ACREDITADO);
							$("#hidesupercve").val(data[0].CVE_SUPERVISOR);
							$("#hidesupernum").val(data[0].NUM_EMP_SUPERVISOR);
							$("#hidesupermail").val(data[0].MAIL_SUPERVISOR);
						}
					});
				}
			});
			
			AsignacionExterno.externo.find("#btnBuscarConcepto").click(function( e ) {
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

				var url = baseUrl + "/gastos/asignacionextranet/getqueconceptonmasig";
				
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
					    });
					}
				});
			});
			
			$( "#gccosto" ).on({
				change : function( e ) {
					e.preventDefault();
					var idcategoria = $(this).val();
					var url = baseUrl + "/gastos/asignacionextranet/getccsolicitud";
					
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
						    });
						}
					});
				}
			});
			
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
					AsignacionExterno.guardarAltaIndividual(e,false);
				}
				
				if( $("#tipocaptura").val() == "4" ){
					AsignacionExterno.guardarCapturaCartera(e);
				}
				
				if( AsignacionExterno.externo.find("#tipocaptura").val() == "42" ){
					AsignacionExterno.guardarImporteGeneral(e);
				}
				
				if( AsignacionExterno.externo.find("#tipocaptura").val() == "50" ){
					AsignacionExterno.guardarAltaIndividual(e,true);
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
					url: baseUrl + '/gastos/asignacionextranet/validaarchivoasigna',
					type: 'POST',
					data: "archivo=" + $("#archivo").val() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion + "&tiposolicitud=" + tiposolicitud + "&conceptoid=" + conceptoid + "&empleadoid=" + empleadoid + "&usuariopm=" + usuariopm + "&appuid=" + appuid,
					dataType: 'json',
					complete: function() {
						//Modal.close();
					},
					success: function(data) {

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
					url: baseUrl + '/gastos/asignacionextranet/validamasivacreditoasigna',
					type: 'POST',
					data: "archivo=" + $("#archivo").val() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion,
					dataType: 'json',
					success: function(data) {
						$(".loading-search").hide();
						if( data.respuesta == 'success' ){
							$('#procesado').val("S");
							$('#msjErrorProcesaSuccess').html("Los datos se procesaron correctamente.");
							$('#msjErrorProcesaSuccess').show();
							$('#msjErrorProcesaError').hide();
							$("#procesamientoAltMas").hide();
							AsignacionExterno.cargarGrid();
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
			
			$( "#lista-asignaciones .linkX1" ).on({
				click : function( event ) {
					var credito = $(this).attr("rel");
					var url = "http://quasar.pendulum.com.mx:59001/cobranza/aplicacion/credito/?dmacct=" + credito + "&user=" + $("#usuariopm").val();
					// var url = "http://quasar.pendulum.com.mx:59001/cas/aplicacion/url/aplicacionExterna/?dmacct=" + credito + "&user=" + $("#usuariopm").val()+ "&procedencia=COB";
					window.open(url, "X1", "height=600,width=800");
					return false;
				}
			});
			
			$( "#lista-asignaciones .linkX5" ).on({
				click : function( event ) {
					var credito = $(this).attr("rel");
					var url = "http://quasar.pendulum.com.mx:59001/el/aplicacion/creditos/credito?dmacct=" + credito + "&user=" + $("#usuariopm").val();
					// var url = "http://quasar.pendulum.com.mx:59001/cas/aplicacion/url/aplicacionExterna/?dmacct=" + credito + "&user=" + $("#usuariopm").val()+ "|COB|1&procedencia=EL1";
					window.open(url, "X5", "height=600,width=800");
					return false;
				}
			});

			AsignacionExterno.externo.find( "#lista-asignaciones .removeAsigna" ).on({
				click : function( event ) {
					event.preventDefault();
					var solicitudid = $("#solicitudid").val();
					var conceptoid = $(this).attr("concepto");
					var conceptonombre = $(this).attr("nmconcepto");
					var credito = $(this).attr("credito");

					var res = confirm("�Seguro que desea eliminar el concepto " + conceptonombre + "?");
					
					if (!res) {
						return false;
					}
					
					$.ajax({
						url: baseUrl + '/gastos/asignacionextranet/delasignacionsolicitud',
						type: 'POST',
						data: {solicitudid: solicitudid, concepto: conceptoid, credito:credito},
						dataType: 'json',
						complete: function() {
							//Modal.close();
						},
						success: function(data) {

							if(data.respuesta == "success"){
								AsignacionExterno.cargarGrid();
							} else {
								alert(data.msj);
								return false;
							}
						} 
					});
				}
			});

			$("#btnBuscarCredito").on('click',function(e){
				e.preventDefault();
				var credito = $("#findcredito").val();
				var acredit = $("#findAcreditado").val();
				var empleadoid = $("#empleadoid").val();
				var usuariopm = $("#usuariopm").val();

				$.ajax({
					url: baseUrl + '/gastos/asignacionextranet/find-credito',
					type: 'POST',
					data: { acreditado:acredit,empleadoid:empleadoid,usuariopm:usuariopm,credito:credito},
					dataType: 'json',
					success: function(data) {

						var html = "<option value='0'>Seleccione un juicio</option>";
						$.each(data.data,function(i, item){
							html += "<option value='"+item.JUICIO+"' >"+item["CREDITO_JUICIO"]+"</option>";
						});
						$("#cbjuicio").html(html);
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
				url: baseUrl + '/gastos/asignacionextranet/getdetalleasignacion',
				type: 'POST',
				data: {solicitudid : $("#solicitudid").val(), tipocaptura : $("#tipocaptura").val()},
				dataType: 'html',
				complete: function() {
					//Modal.close();
				},
				success: function(data) {

					//$('#modalAltaIndividual').modal('hide');
					$('#lista-asignaciones').html(data);
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
		guardarAltaIndividual : function(e, externo) {
			e.preventDefault();
			
			if( $("#conceptoid").val() == "0" || $("#conceptoid").val() == "" ){
				alert("Seleccione un concepto.");
				$("#conceptoid").focus();
				return false;
			}
			
			if( $("#credito").val() == "" ){
				alert("Ingrese un cr�dito.");
				$("#credito").focus();
				return false;
			}
			
			if( $("#importe").val() == "" ){
				alert("Ingrese un importe.");
				$("#importe").focus();
				return false;
			}
			
			var userid = $('#noEmpleado').html();
			var solicitudid = $("#solicitudid").val();
			var tipoAsignacion = $("#tipocaptura").val();
			var tiposolicitud = $("#tiposolicitud").val();
			var empleadoid = $("#empleadoid").val();
			var usuariopm = $("#usuariopm").val();
			var appuid = $("#appuid").val();
			var mailSupervisor = $("#hidesupermail").val();
			
			if( $(".emailSuperHidden").length > 0 ) {
				if( mailSupervisor != $(".emailSuperHidden").eq(0).val() ) {
					alert("El Supervisor de este Juicio es diferente a los agregados");
					return false; 
				}
			}

			$("#show-save-loading").show();

			var urlAjax = baseUrl + '/gastos/asignacionextranet/addcreditoasigna';
			if (externo) {
				var urlAjax = baseUrl + '/gastos/asignacionextranet/addcreditoasigna-externo';
			}			

			$.ajax({
				url: urlAjax,
				type: 'POST',
				data: $("#frmAsignacion").serialize() + "&" + $("#frmAsignacion2").serialize() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion + "&tiposolicitud=" + tiposolicitud + "&empleadoid=" + empleadoid + "&usuariopm=" + usuariopm + "&appuid=" + appuid + "&externo="+externo,
				dataType: 'json',
				success: function(data) {

					$("#show-save-loading").hide();
					if( data.respuesta == 'success' ){
						//$('#modalAltaIndividual').modal('hide');
						$("#credito").val("");
						$("#importe").val("");
						$("#credito").focus();
						AsignacionExterno.cargarGrid();
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
				url: baseUrl + '/gastos/asignacionextranet/addcarteraasigna',
				type: 'POST',
				data: $("#frmAsignacion").serialize() + "&" + $("#frmAsignacion2").serialize() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion + "&tiposolicitud=" + tiposolicitud + "&empleadoid=" + empleadoid + "&usuariopm=" + usuariopm + "&appuid=" + appuid + "&ccosto=" + ccosto,
				dataType: 'json',
				complete: function() {
					//Modal.close();
				},
				success: function(data) {

					$("#show-save-loading").hide();
					if( data.respuesta == 'success' ){
						//$('#modalAltaIndividual').modal('hide');
						$("#cartera").val("");
						$("#importe").val("");
						$("#gccosto").val("");
						$("#ccosto").val("");
						AsignacionExterno.cargarGrid();
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
				url: baseUrl + '/gastos/asignacionextranet/addaimporteasigna',
				type: 'POST',
				data: $("#frmAsignacion").serialize() + "&" + $("#frmAsignacion2").serialize() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion + "&tiposolicitud=" + tiposolicitud + "&empleadoid=" + empleadoid + "&usuariopm=" + usuariopm + "&appuid=" + appuid + "&gccosto=" + gccosto,
				dataType: 'json',
				success: function(data) {
					$("#show-save-loading").hide();
					if( data.respuesta == 'success' ){
						$("#importe").val("");
						$("#gccosto").val("");
						$("#ccosto").val("");
						AsignacionExterno.cargarGrid();
						$("#importe").focus();
					} else {
						alert( "Ocurrio un error: " + data.msj );
						return false;
					}
				} 
			});
		},

		fnTableAsignacion : function() {

			AsignacionExterno.externo.find( "#lista-asignaciones .removeAsigna" ).off("click").on({
				click : function( event ) {
					event.preventDefault();
					var solicitudid = $("#solicitudid").val();
					var conceptoid = $(this).attr("concepto");
					var conceptonombre = $(this).attr("nmconcepto");
					var credito = $(this).attr("credito");

					var res = confirm("\u00bfSeguro que desea eliminar el concepto " + conceptonombre + "?");
					
					if (!res) {
						return false;
					}
					
					$.ajax({
						url: baseUrl + '/gastos/asignacionextranet/delasignacionsolicitud',
						type: 'POST',
						data: {solicitudid: solicitudid, concepto: conceptoid, credito:credito},
						dataType: 'json',
						complete: function() {
							//Modal.close();
						},
						success: function(data) {

							if(data.respuesta == "success"){
								AsignacionExterno.cargarGrid();
							} else {
								alert(data.msj);
								return false;
							}
						} 
					});
				}
			});

		}

};

AsignacionExterno.init();