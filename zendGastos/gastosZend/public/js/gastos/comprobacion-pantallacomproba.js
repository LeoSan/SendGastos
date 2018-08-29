var ComprobacionPantalla = {
		
		init : function() {
			
			ComprobacionPantalla.cargarComprobantesDetalle();
			
			$("#tipoComprobante").change(function( e ) {
				e.preventDefault();
				if($(this).val() === 'Factura' || $(this).val() === 'Recibo de honorarios'){
					$(".examinar").show("slow");
					$(".sinxml").hide("slow");
				} else {
					$(".examinar").hide("slow");
					$(".sinxml").show("slow");
				}
				if( $(this).val() === 'Recibo de honorarios' ){
					$(".eshonorarios").show("slow");
				} else{
					$(".eshonorarios").hide("slow");
					$("#ivaRetenido").val("");
					$("#isr").val("");
				}
			});

			$(".justificacionAlerta").focusout(function(){
				var url = baseUrl + "/gastos/comprobacion/update-justificacion-alerta";
				var gastoId = $(this).data('idcaso');
				var concepto = $(this).data('concepto');
				var etapa = $(this).data('etapa');
				var justificacion = $(this).val();
				var credito = $(this).data('credito');
				var spantargetgood = $(this).data('spantarget');
				var spantargeterror = $(this).data('spantargeterror');

				$.ajax({
					type: "POST",
					url: url,
					data: {
						IDGASTOMAIN: gastoId,
						IDCONCEPTO	: concepto,
						ETAPA	: etapa,
						FCJUSTIFICACIONALERTA	: justificacion,
						FCCREDITOCARTERA: credito
					},
					dataType: 'json',
					success: function(data) {
						if( data.status == 'OK' ){
							$(spantargetgood).html(data.msg);
							$(spantargetgood).fadeIn('slow').delay(3000).fadeOut('slow');
							return false;
						} else {
							$(spantargeterror).html(data.msg);
							$(spantargeterror).fadeIn('slow').delay(3000).fadeOut('slow');
							return false;
						}
					}
				});
			});
			
			$("#fechaFactura").datepicker({"dateFormat": "dd/mm/yy"});

			$('#file_xml').uploadify({
		        'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
		        'uploader' : baseUrl + '/gastos/comprobacion/uploadfile',
		        'buttonText' : 'Seleccionar XML',
		        'fileTypeExts' : '*.xml',
		        'removeCompleted' : true,
		        'formData': {
		        	'solicitudid' : $("#solicitudid").val(),
		        	'idEmpresa' : $("#idEmpresa").val(),
		        	'rfcEmpresa' : $("#rfcEmpresa").val(),
		        	'nombreEmpresa' : $("#nombreEmpresa").val(),
		        	'idProveedor' : $("#idProveedor").val(),
		        	'rfcProveedor' : $("#rfcProveedor").val(),
		        	'nombreProveedor' : $("#nombreProveedor").val()
		        },
		        'onUploadComplete' : function(file) {},
		        'onUploadSuccess' : function(file, data, response) {
		        	$("#msjErrorUploadSuccess").hide();
		        	$("#msjErrorUploadError").hide();
		        	$('#modalResXml .modal-body').html(data);
		        	$('#modalResXml').modal('show');
		        },
		        'onUploadStart' : function(file) {
		        	$("#file_xml").uploadify("settings", 'formData', {'tipoComprobante' : $("#tipoComprobante").val()});
		        }
		    });
			
console.info('LLego1');
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();	
					console.info(this);
					var athis = $( this ).is( ":checked" );
					$.ajax({
						url: baseUrl + '/gastos/comprobacion/valida-docs',
						type: 'POST',
						data: {
							name: $(this).attr('name'),
							idcomproba: $(this).attr('data-comproba'),
							idgasto: $("#solicitudid").val(),
							newval: athis
						},
						dataType: 'json',
						success: function(data) {}
					});
				}
			}, 'input.cbxDocs');
			
			$('#file_pdf').uploadify({
		        'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
		        'uploader' : baseUrl + '/gastos/comprobacion/uploadfilepdf',
		        'buttonText' : 'Examinar...',
		        'fileTypeExts' : '*.pdf;*.xml',
		        'removeCompleted' : true,
		        'formData': {
		        	'comprobacionId' : $("#comprobacionId").val(),
		        	'solicitudId' : $("#solicitudid").val(),
		        	'pdfcomp' : 0
		        },
		        'onUploadComplete' : function(file) {},
		        'onUploadSuccess' : function(file, data, response) {
		        	ComprobacionPantalla.cargarComprobantesDetalle();
		        	$('#modalSubirPdf').modal('hide');
		        },
		        'onUploadStart' : function(file) {
		        	$("#file_pdf").uploadify("settings", 'formData', {'comprobanteId' : $("#comprobacionId").val(),'solicitudId' : $("#solicitudid").val(), 'pdfcomp' : 0 });
		        }
		    });
			
			$('#file_pdfc').uploadify({
		        'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
		        'uploader' : baseUrl + '/gastos/comprobacion/uploadfilepdf',
		        'buttonText' : 'Examinar...',
		        'fileTypeExts' : '*.pdf;',
		        'removeCompleted' : true,
		        'formData': {
		        	'comprobacionId' : $("#comprobacionIdC").val(),
		        	'solicitudId' : $("#solicitudid").val(),
		        	'pdfcomp' : 1
		        },
		        'onUploadComplete' : function(file) {},
		        'onUploadSuccess' : function(file, data, response) {
		        	ComprobacionPantalla.cargarComprobantesDetalle();
		        	$('#modalSubirPdfC').modal('hide');
		        },
		        'onUploadStart' : function(file) {
		        	$("#file_pdfc").uploadify("settings", 'formData', {'comprobanteId' : $("#comprobacionIdC").val(),'solicitudId' : $("#solicitudid").val(), 'pdfcomp' : 1 });
		        }
		    });

			$('#file_xmlup').uploadify({
		        'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
		        'uploader' : baseUrl + '/gastos/comprobacion/uploadfileupdate',
		        'buttonText' : 'Seleccionar XML',
		        'fileTypeExts' : '*.xml',
		        'removeCompleted' : true,
		        'formData': {
		        	'solicitudid' : $("#solicitudid").val(),
		        	'comprobacionId' : $("#comprobacionIdXU").val(),
		        	'userid' : $.trim( $('#empleadoid').val() )
		        },
		        'onUploadComplete' : function(file) {},
		        'onUploadSuccess' : function(file, data, response) {
		        	data = $.parseJSON(data);
		        	if ( data.success == 'false' ) {
		        		$("#msjErrorUploadSuccess").hide();
			        	$("#msjErrorUploadError").hide();
			        	$('#modalResXml .modal-body').html('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">x</button><strong>'+data.msg+'</div>');
			        	$('#modalResXml').modal('show');
		        	} else {
			        	ComprobacionPantalla.cargarComprobantesDetalle();
			        	$('#modalSubirXmlUpdate').modal('hide');
		        	}
		        },
		        'onUploadStart' : function(file) {
		        	$("#file_xmlup").uploadify("settings", 'formData', {'comprobacionId' : $("#comprobacionIdXU").val()});
		        }
		    });

			$('#file_XmlSeg').uploadify({
		        'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
		        'uploader' : baseUrl + '/gastos/comprobacion/uploadfile-segunda',
		        'buttonText' : 'Seleccionar XML',
		        'fileTypeExts' : '*.xml',
		        'removeCompleted' : true,
		        'formData': {
		        	'solicitudid' : $("#solicitudid").val(),
		        	'comprobanteId' : $("#comprobacionIdXmlSeg").val(),
		        	'idEmpresa' : $("#idEmpresa").val(),
		        	'rfcEmpresa' : $("#rfcEmpresa").val(),
		        	'nombreEmpresa' : $("#nombreEmpresa").val(),
		        	'idProveedor' : $("#idProveedor").val(),
		        	'rfcProveedor' : $("#rfcProveedor").val(),
		        	'nombreProveedor' : $("#nombreProveedor").val()
		        },
		        'onUploadComplete' : function(file) {},
		        'onUploadSuccess' : function(file, data, response) {
		        	data = $.parseJSON(data);
		        	$('#alertUpd').addClass('hide');
		        	if( data.success ) {
		        		$('#modalSubirXmlSeg').modal('hide');
		        		ComprobacionPantalla.cargarComprobantesDetalle();
		        	} else {
		        		$('#alertUpd').removeClass('hide');
		        		$('#msgAlert').text(data.msg); 
		        	}
		        	
		        	
		        },
		        'onUploadStart' : function(file) {
		        	$("#file_XmlSeg").uploadify("settings", 'formData', {
		        			'comprobanteId' : $("#comprobacionIdXmlSeg").val(),
		        			'tipoComprobante' : $("#tipoComprobante").val()
		        	});
		        }
		    });
			
			$('.btnconti').off('click').on('click',function(){
				$('.advertensy').addClass('hide');
				$('.fieldup').removeClass('hide');
			});
			
			$( document ).off('blur','#rfc').on({
				blur : function( e ) {
					var error = false;
					var cadenaRfc = $(this).val();
					var objRegExp  = /[A-Z]{3,4}[0-9]{6}[A-Z0-9]{3}{#&}/;
					
					if(cadenaRfc.length == 0){
						$('.alert-warning').addClass('hide');
						return false;
					}
					
					if(!objRegExp.test(cadenaRfc)){
						var revisa = false;
						
						//persona moral
						if(cadenaRfc.length == 13){
							var nombre = cadenaRfc.substring(0, 4);
							var fecha = cadenaRfc.substring(4, 10);
							$('.alert-warning').addClass('hide');
							revisa = true;
						} else if(cadenaRfc.length == 12) {
							var nombre = cadenaRfc.substring(0, 3);
							var fecha = cadenaRfc.substring(3, 9);
							$('.alert-warning').addClass('hide');
							revisa = true;
						} else {
							$('.alert-warning').removeClass('hide');
							$('#txtmsg').text('La longitud del RFC no es la correcta.');
							error = true;
						}
						
						if(revisa == true){
							var objRegExp  = /^[a-zA-Z#&]+$/;
							if(!objRegExp.test(nombre)) {
								$('#txtmsg').text('La sección correspondiente al nombre en el RFC tiene caracteres invalidos: ' + nombre);
								$('.alert-warning').removeClass('hide');
								error = true;
							}
							objRegExp  = /^[0-9]+$/;
							if(!objRegExp.test(fecha)) {
								$('#txtmsg').text('La sección correspondiente a la fecha en el RFC tiene caracteres invalidos: ' + fecha);
								$('.alert-warning').removeClass('hide');
								error = true;
							}
						}
						if(error){
							$("#rfc").focus();
						}
					}
				}
			}, "#rfc");
			
			$( "#proveedor" ).change(function( e ) {
				$( this ).val( $( this ).val().toUpperCase() );
			});
			
			$( "#concepto" ).change(function( e ) {
				$( this ).val( $( this ).val().toUpperCase() );
			});
			
			$( "#rfc" ).keypress(function( e ) {
				key = e.keyCode || e.which;
			    tecla = String.fromCharCode(key).toUpperCase();

			    letras = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			    especiales = [8];

			    tecla_especial = false
			    for(var i in especiales) {
			        if(key == especiales[i]) {
			            tecla_especial = true;
			            break;
			        }
			    }

			    if(letras.indexOf(tecla) == -1 && !tecla_especial)
			        return false;
				
			});
			
			$( "#concepto" ).keypress(function( e ) {
				key = e.keyCode || e.which;
			    tecla = String.fromCharCode(key).toUpperCase();

			    letras = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			    especiales = [8];

			    tecla_especial = false
			    for(var i in especiales) {
			        if(key == especiales[i]) {
			            tecla_especial = true;
			            break;
			        }
			    }

			    if(letras.indexOf(tecla) == -1 && !tecla_especial)
			        return false;
				
			});
			
			$( "#proveedor" ).keypress(function( e ) {
				key = e.keyCode || e.which;
			    tecla = String.fromCharCode(key).toUpperCase();

			    letras = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			    especiales = [8,38];

			    tecla_especial = false
			    for(var i in especiales) {
			        if(key == especiales[i]) {
			            tecla_especial = true;
			            break;
			        }
			    }

			    if(letras.indexOf(tecla) == -1 && !tecla_especial)
			        return false;
				
			});
			
			$( "#seriefolio" ).keypress(function( e ) {
				key = e.keyCode || e.which;
			    tecla = String.fromCharCode(key).toUpperCase();
			    
				if(tecla === ' '){
					return false;
				}
			    letras = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			    especiales = [];

			    tecla_especial = false
			    for(var i in especiales) {
			        if(key == especiales[i]) {
			            tecla_especial = true;
			            break;
			        }
			    }

			    if(letras.indexOf(tecla) == -1 && !tecla_especial)
			        return false;
				
			});
			
			$( document ).on({
				change : function( e ) {
					ComprobacionPantalla.calcularTotales();
				}
			}, "#importe");
			
			$( document ).on({
				change : function( e ) {
					ComprobacionPantalla.calcularTotales();
				}
			}, "#iva");
			
			$( document ).on({
				change : function( e ) {
					ComprobacionPantalla.calcularTotalesAdicional();
				}
			}, "#importeIva");
			
			$( document ).on({
				change : function( e ) {
					ComprobacionPantalla.calcularTotalesAdicional();
				}
			}, "#ivaRetenido");
			
			$( document ).on({
				change : function( e ) {
					ComprobacionPantalla.calcularTotalesAdicional();
				}
			}, "#isr");
			
			$( document ).on({
				change : function( e ) {
					ComprobacionPantalla.calcularTotalesAdicional();
				}
			}, "#otrosImpuestos");
			
			$("#btnGetValXml").click(function(e){
				console.log("Agregando XML a campos");
				var tipoComprobante = '';
				var importe = 0;
				var iva = 0;
				var ivaPorcentaje = 0;
				var ivaRetenido = 0;
				var isr = 0;
				var otrosImpuestos = 0;
				var importeIva = 0;
				var importeTotal = 0;
				var uuid = '';
				var nombreArchivo = '';
				
				var validacion = '';
				
				validacion = $.trim( $("#xmlValidacion").val() );
				
				if(validacion == "1"){
					alert("El archivo xml no es valido para realizar la comprobación. Revisa los mensajes de error.");
					return false;
				}
				
				tipoComprobante = $.trim( $("#tipoComprobante").val() );
				fechaFactura = $.trim( $("#xmlFecha").val() );
				
				concepto = $.trim( $("#xmlConcepto").val() );
				importe = $.trim( $("#xmlSubtotal").val() );
				noFactura = $.trim( $("#xmlFolio").val() );
				importeTotal = $.trim( $("#xmlTotal").val() );
				importeIva = $.trim( $("#xmlIva").val() );
				isr = $.trim( $("#xmlIsr").val() );
				ivaRetenido = $.trim( $("#xmlIvaRetenido").val() );
				uuid = $.trim( $("#xmlUuid").val() );
				nombreArchivo = $.trim( $("#xmlNombreArchivo").val() );
				if( importeIva != ''){
					$("#iva").val("16");
					ivaPorcentaje = 16;
				} else {
					$("#iva").val("0");
					ivaPorcentaje = 0;
				}
				
				rfcEmisor = $.trim( $("#xmlRfcEmisor").val() );
				nombreEmisor = $.trim( $("#xmlNombreEmisor").val() );
				
				rfc = $.trim( $("#xmlRfcReceptor").val() );
				nombreReceptor = $.trim( $("#xmlNombreReceptor").val() );
				
				var gastoId = $("#solicitudid").val();
				
				var url = baseUrl + "/gastos/comprobacion/agregacomprobante";
				$.ajax({
					type: "POST",
					url: url,
					data: {
						gastoId: gastoId,
						uuid: uuid,
						nombreArchivo: nombreArchivo,
						tipoComprobante:tipoComprobante,
						noFactura: noFactura,
						nombreEmisor: nombreEmisor,
						rfcEmisor: rfcEmisor,
						fechaFactura: fechaFactura,
						concepto: concepto,
						importe: importe,
						iva: ivaPorcentaje,
						importeIva: importeIva,
						importeTotal: importeTotal,
						ivaRetenido: ivaRetenido,
						isr: isr,
						otrosImpuestos: otrosImpuestos
						},
					dataType: 'json',
					success: function(data) {
						console.log(data);
						if( data.success == 'true' ){
							ComprobacionPantalla.cargarComprobantesDetalle();
							$('#modalResXml').modal('hide');
							return false;
						} else {
							alert( "Ocurrio un error: " + data.info );
							ComprobacionPantalla.cargarComprobantesDetalle();
							return false;
						}
					}
				});
			});
			
			$("#btnAgregarComprobante").click(function(e){
				var gastoId = ""; 
				var uuid = '';
				var nombreArchivo = '';
				var tipoComprobante = '';
				var importe = 0;
				var iva = 0;
				var ivaRetenido = 0;
				var isr = 0;
				var otrosImpuestos = 0;
				var importeIva = 0;
				var descuento = 0;
				var importeTotal = 0;
				var userid = '';

				var noFactura = "";
				var nombreEmisor = "";
				var rfcEmisor = "";
				var fechaFactura = "";
				var concepto = "";
				
				gastoId = $("#solicitudid").val();
				uuid = $("#uuid").val();
				nombreArchivo = $("#nombreArchivo").val();
				tipoComprobante = $("#tipoComprobante").val();
				noFactura = $.trim($("#seriefolio").val());
				nombreEmisor = $.trim($("#proveedor").val());
				rfcEmisor = $.trim($("#rfc").val());
				fechaFactura = $.trim($("#fechaFactura").val());
				concepto =  $.trim($("#concepto").val());
				userid = $.trim( $('#empleadoid').val() );

				importe = $("#importe").val();
				iva = $("#iva").val();
				importeIva = $("#importeIva").val();
				importeTotal = $("#total").val();
				ivaRetenido = $("#ivaRetenido").val();
				isr = $("#isr").val();
				otrosImpuestos = $("#otrosImpuestos").val();
				descuento = $("#descuento").val();
				
				if(tipoComprobante === "0"){
					alert("Debe seleccionar un tipo de comprobante");
					$("#tipoComprobante").focus();
					return false;
				}
				
				if(fechaFactura === ""){
					alert("Debe agregar la fecha de emisión del comprobante");
					$("#fechaFactura").focus();
					return false;
				}
				
				if(concepto === ""){
					alert("Debe agregar el concepto del comprobante");
					$("#concepto").focus();
					return false;
				}
				
				if(    tipoComprobante != "Ficha de Deposito"  ){
					if(nombreEmisor === ""){
						alert("Debe agregar el nombre del proveedor del comprobante");
						$("#proveedor").focus();
						return false;
					}
					
					if(rfcEmisor === ""){
						alert("Debe agregar el rfc de proveedor del comprobante");
						$("#rfc").focus();
						return false;
					}
				}
				
				if(importe === ""){
					alert("Debe agregar el importe del comprobante");
					$("#importe").focus();
					return false;
				}
				
				if(importeTotal === ""){
					alert("Debe agregar el importe total comprobante");
					importeTotal = $("#total").focus();
					return false;
				}

				if(importeTotal === "0"){
					alert("El importe total debe ser mayor a CERO");
					importeTotal = $("#total").focus();
					return false;
				}

				var url = baseUrl + "/gastos/comprobacion/agregacomprobante";
				$.ajax({
					type: "POST",
					url: url,
					data: {
						gastoId: gastoId,
						empleadoid: userid,
						uuid: uuid,
						nombreArchivo: nombreArchivo,
						tipoComprobante:tipoComprobante,
						noFactura: noFactura,
						nombreEmisor: nombreEmisor,
						rfcEmisor: rfcEmisor,
						fechaFactura: fechaFactura,
						concepto: concepto,
						importe: importe,
						iva: iva,
						importeIva: importeIva,
						importeTotal: importeTotal,
						ivaRetenido: ivaRetenido,
						isr: isr,
						descuento: descuento,
						otrosImpuestos: otrosImpuestos
						},
					dataType: 'json',
					success: function(data) {
						if( data.success == 'true' ){
							ComprobacionPantalla.cargarComprobantesDetalle();
							ComprobacionPantalla.limpiarCamposPantalla();
							return false;
						} else {
							alert( "Ocurrio un error: " + data.info );
							ComprobacionPantalla.cargarComprobantesDetalle();
							return false;
						}
					}
				});
			});
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var idComproba = $(this).attr('idrel');
					
					var r = confirm("Desea eliminar todo el registro relacionado a la Fatura XML?");
					if (r == true) {
					$.ajax({
						url: baseUrl + '/gastos/comprobacion/borracomprobante',
						type: 'POST',
						data: "idcomprobante=" + idComproba,
						dataType: 'json',
						complete: function() {},
						success: function(data) {
							console.log(data);
							if( data.success == 'true' ){
								ComprobacionPantalla.cargarComprobantesDetalle();
							} else {
								alert( "Ocurrio un error: " + data.info );
								return false;
							}
						} 
					});
					}
					
				}
			}, ".delcomproba");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var idComprobacion = $(this).attr("idrel"); 
					$('#comprobacionId').val(idComprobacion);
					$('#modalSubirPdf').modal('show');
				}
			}, ".uploadpdf");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var idComprobacion = $(this).attr("idrel"); 
					$('#comprobacionIdXU').val(idComprobacion);
					$('#modalSubirXmlUpdate').modal('show');
					
					$('.advertensy').removeClass('hide');
					$('.fieldup').addClass('hide');
				}
			}, ".uploadxmlup");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var idComprobacion = $(this).attr("idrel"); 
					$('#comprobacionIdXmlSeg').val(idComprobacion);
					$('#modalSubirXmlSeg').modal('show');
					
					//$('.advertensy').removeClass('hide');
					//$('.fieldup').addClass('hide');
				}
			}, ".uploadxmlc");  
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var idComprobacion = $(this).attr("idrel"); 
					$('#comprobacionIdC').val(idComprobacion);
					$('#modalSubirPdfC').modal('show');
				}
			}, ".uploadpdfc");
			
			$( document ).on({
				click : function ( e ) {
					$("#show-save-loading").show();
					var r = confirm("Esta seguro de eliminar el archivo?");

					if (r == true) {
						$.ajax({
							url: baseUrl + '/gastos/comprobacion/removefile',
							type: 'POST',
							data: {
								idc: $(this).attr('idrel'),
								tipo: $(this).attr('data-tipo'),
								idgasto: $("#solicitudid").val()
							},
							dataType: 'json',
							success: function(data) {
								$("#show-save-loading").hide();
								if( data.success ){
									ComprobacionPantalla.cargarComprobantesDetalle();
									return false;
								} else {
									alert( "Ocurrio un error: " + data.msj );
									return false;
								}
							}
						});
					}

				}
			}, ".btndeletefile");
			
			console.info('LLego');
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();	
					console.info(this);
					var athis = $( this ).is( ":checked" );
					$.ajax({
						url: baseUrl + '/gastos/comprobacion/valida-docs',
						type: 'POST',
						data: {
							name: $(this).attr('name'),
							idcomproba: $(this).attr('data-comproba'),
							idgasto: $("#solicitudid").val(),
							newval: athis
						},
						dataType: 'json',
						success: function(data) {}
					});
				}
			}, 'input.cbxDocs');
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();					
					var athis = $( this ).is( ":checked" );
					e.preventDefault();

					var clsTipo = $(this).attr('data-tipo');
					
					if( $(this).hasClass('allCheckPdfc') ) {
						classCheck = 'cbxDocsPdfc';
					} else if( $(this).hasClass('allCheckXml') ){
						classCheck = 'cbxDocsXml';
					} else if( $(this).hasClass('allCheckPdf') ){
						classCheck = 'cbxDocsPdf';
					}
					
					
					if( athis ){
						$("."+classCheck+"."+clsTipo).prop('checked', true);
					} else {
						$("."+classCheck+"."+clsTipo).prop('checked', false);
					}
					
					$("."+classCheck).each(function( i, item ){
						ComprobacionPantalla.saveAllCheckbox( item );
					});

				}
			}, 'input.allCheck');
			
		},
		saveAllCheckbox : function( etim ) {
			var athis = $( etim ).is( ":checked" );
			$.ajax({
				url: baseUrl + '/gastos/comprobacion/valida-docs',
				type: 'POST',
				data: {
					name: $(etim).attr('name'),
					idcomproba: $(etim).attr('data-comproba'),
					idgasto: $("#solicitudid").val(),
					newval: athis
				},
				dataType: 'json',
				success: function(data) {}
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
				url: baseUrl + '/gastos/asignacion/addaimporteasigna',
				type: 'POST',
				data: $("#frmAsignacion").serialize() + "&" + $("#frmAsignacion2").serialize() + "&userid=" + userid + "&solicitudid=" + solicitudid + "&tipoAsignacion=" + tipoAsignacion + "&tiposolicitud=" + tiposolicitud + "&empleadoid=" + empleadoid + "&usuariopm=" + usuariopm + "&appuid=" + appuid + "&gccosto=" + gccosto,
				dataType: 'json',
				complete: function() {},
				success: function(data) {
					console.log(data);
					$("#show-save-loading").hide();
					if( data.respuesta == 'success' ){
						$("#importe").val("");
						$("#gccosto").val("");
						$("#ccosto").val("");
						ComprobacionPantalla.cargarGrid();
						$("#importe").focus();
					} else {
						alert( "Ocurrio un error: " + data.msj );
						return false;
					}
				} 
			});
		},
		
		calcularTotales : function() {
			var tipoComprobante = '';
			var importe = 0;
			var iva = 0;
			var ivaRetenido = 0;
			var isr = 0;
			var otrosImpuestos = 0;
			var importeIva = 0;
			var importeTotal = 0;
			tipoComprobante = $.trim( $("#tipoComprobante").val() );
			importe = $.trim( $("#importe").val() );
			ivaRetenido = $.trim( $("#ivaRetenido").val() );
			isr = $.trim( $("#isr").val() );
			otrosImpuestos = $.trim( $("#otrosImpuestos").val() );
			iva = $.trim( $("#iva").val() );
			
			if(iva != ""){
				iva = parseInt(iva);
			}
			
			ivaRetenido = parseFloat(ivaRetenido);
			isr = parseFloat(isr);
			otrosImpuestos = parseFloat(otrosImpuestos);
			
			if (isNaN(ivaRetenido)) {
				ivaRetenido = 0;
			}
			
			if (isNaN(isr)) {
				isr = 0;
			}
			
			if (isNaN(otrosImpuestos)) {
				otrosImpuestos = 0;
			}
			
			importeIva = importe * (iva / 100);

			if(tipoComprobante === 'Recibo de honorarios'){
				importe = parseFloat(importe) + parseFloat(importeIva);
				importeTotal = importe - (ivaRetenido + isr) + otrosImpuestos;
			} else {
				importeTotal = parseFloat(importe) + parseFloat(importeIva) + parseFloat(otrosImpuestos);
			}
			
			$("#importeIva").val(importeIva);
			$("#total").val(importeTotal);
		},
		
		calcularTotalesAdicional : function() {
			var tipoComprobante = '';
			
			var importe = 0;
			var importeIva = 0;
			var ivaRetenido = 0;
			var isr = 0;
			var otrosImpuestos = 0;
			
			var importeTotal = 0;
			tipoComprobante = $.trim( $("#tipoComprobante").val() );

			importe = $.trim( $("#importe").val() );
			importeIva = $.trim( $("#importeIva").val() );
			ivaRetenido = $.trim( $("#ivaRetenido").val() );
			isr = $.trim( $("#isr").val() );
			otrosImpuestos = $.trim( $("#otrosImpuestos").val() );
			
			iva = $.trim( $("#iva").val() );
			
			if(iva != ""){
				iva = parseInt(iva);
			}
			
			importe = parseFloat(importe);
			importeIva = parseFloat(importeIva);
			ivaRetenido = parseFloat(ivaRetenido);
			isr = parseFloat(isr);
			otrosImpuestos = parseFloat(otrosImpuestos);
			
			if (isNaN(importeIva)) {
				importeIva = 0;
			}
			
			if (isNaN(importeIva)) {
				importeIva = 0;
			}
			
			if (isNaN(ivaRetenido)) {
				ivaRetenido = 0;
			}
			
			if (isNaN(isr)) {
				isr = 0;
			}
			
			if (isNaN(otrosImpuestos)) {
				otrosImpuestos = 0;
			}
			
			if(tipoComprobante === 'Recibo de honorarios'){
				importe = parseFloat(importe) + parseFloat(importeIva);
				importeTotal = importe - (ivaRetenido + isr) + otrosImpuestos;
			} else {
				importeTotal = parseFloat(importe) + parseFloat(importeIva) + parseFloat(otrosImpuestos);
			}
			$("#total").val(importeTotal);
		},
		
		cargarComprobantesDetalle : function() {
			var casoId = $("#solicitudid").val();
			$.ajax({
				url: baseUrl + '/gastos/comprobacion/getcomprobantesdetalle',
				type: 'POST',
				data: {
					casoId: casoId,
					numCompro: $("#numcompro").val()
				},
				dataType: 'html',
				complete: function() {},
				success: function(data) {
					console.log(data);
					$("#datos-factura").html(data);
				} 
			});
		},
		
		limpiarCamposPantalla : function() {
			$("#seriefolio").val("");
			$("#proveedor").val("");
			$("#rfc").val("");
			$("#fechaFactura").val("");
			$("#concepto").val("");

			$("#importe").val("0");
			$("#importeIva").val("0");
			$("#total").val("0");
			$("#iva").val("0");
			$("#ivaRetenido").val("0");
			$("#isr").val("0");
			$("#otrosImpuestos").val("0");
		}
};
ComprobacionPantalla.init();