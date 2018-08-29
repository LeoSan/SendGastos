var ComprobacionPantalla = {
		 
		init : function() {
			// ComboBox para Seleccionar Tipo de Comprobante
			$("#tipoComprobante").change(function( e ) {
				e.preventDefault();
				$("#tipoaccion").val(1);
				$("option.tpocomp,option.optcto,.opcionalinput,#oldnamePdf").hide();
				$("option.tpocomp_"+$(this).val()).show();
				$(".inputTpo"+$(this).val()).show();
				$("#frmAsignacion")[0].reset();
				$("#frmAsignacion2")[0].reset();

				if($(this).val() === '1')
				{
					$(".examinar").show("slow");
					$(".sinxml").hide();
				} else if( $(this).val() === '0') 
				{
					$(".examinar").hide("slow");
					$(".sinxml").hide("slow");

				} else {
					$(".examinar").hide("slow");
					$(".sinxml").show("slow");
					$("#btnAgregarComprobante").text("Agregar");
				}
			});

			// ComboBox para Seleccionar Tipo de Gasto
			$("#tpogasto").change(function(){
				$("option.optcto").hide();
				$(".cto_0,.cto_"+$(this).val()).show();
				$("#conceptogasto").val(0);
			});

			// Inicializa el calendario
			$("#fechaFactura").datepicker({"dateFormat": "dd/mm/yy",minDate:inidate,maxDate:findate});

			
			$(".validDoc").on('click',function() {
				console.info( $(this).is(':checked') );
				
				$.ajax({
					type: "POST",
					url: baseUrl + '/gastos/comprobacion/valida-docs-viaje',
					data: { idc: $(this).val(), idgasto: $('#solicitudid').val(), nval: $(this).is(':checked') },
					dataType: 'json',
					success: function(data) {
						if( data.success ){
							
						} else {
							alert( "Ocurrio un error: " + data.message );
						}
					}
				});
			});
			
			/*
			$( document ).on({
				click : function( e ) {
					console.info('');
				}
			}, ".validDoc");
			*/
			// Inicializa uploadify para los archivos XML
			$('#file_xml').uploadify({
				'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
				'uploader' : baseUrl + '/gastos/comprobacion/uploadfileplanviaje',
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
				'onUploadComplete' : function(file) {
					console.log('onUploadComplete el archivo ' + file.name + ' finalizó exitosamente.');
				},
				'onSelect' : function(file){
					if( file.name.length > 40 ){ 
						alert("El nombre del archivo es demasiado largo, favor de renombrar.");
						$('#file_xml').uploadify('cancel');
					}
				},
				'onUploadSuccess' : function(file, data, response) {
					$("#msjErrorUploadSuccess").hide();
					$("#msjErrorUploadError").hide();
					$('#modalResXml .modal-body').html(data);
					$('#modalResXml').modal('show');
					$("body").css("overflow","hidden");
					$("#xmlFecha").datepicker({"dateFormat": "dd/mm/yy",minDate:inidate,maxDate:findate});
					if( data.search("alert-error") > -1 ) {
						$("#btnGetValXml").hide();return false;
					}
					$("#btnGetValXml").show();
				},
				'onUploadStart' : function(file) {
					$("#file_xml").uploadify("settings", 'formData', {'tipoComprobante' : $("#tipoComprobante").val()});
				}
			});
		
			$("#importe,#otrosImpuestos").focus(function(e){
				if( $(this).val() == 0 ){
					$(this).val("");
				}
			}).blur(function(e){
				if( $(this).val() == 0 || $(this).val() == "" ){
					$(this).val(0);
				}
			}).keypress(function(e){
				// Allow: backspace, delete, tab, escape, enter and .
			        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			             // Allow: Ctrl+A, Command+A
			            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
			             // Allow: home, end, left, right, down, up
			            (e.keyCode >= 35 && e.keyCode <= 40)) {
					// let it happen, don't do anything
                 			return;
        			}
			        // Ensure that it is a number and stop the keypress
			        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 100)) {
			            e.preventDefault();
        			}
			});

			// Inicializa uploadify para los archivos PDF
			$('#uploadfile_pdf').uploadify({
				'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
				'uploader' : baseUrl + '/gastos/comprobacion/uploadfilepdfplanviaje',
				'buttonText' : 'Seleccionar PDF',
				'buttonClass' : 'buttonPDF',
				'fileTypeExts' : '*.pdf',
				'removeCompleted' : true,
				'onSelect' : function(file){
					if( file.name.length > 42 ){ 
						alert("El nombre del archivo es demasiado largo");
						$('#uploadfile_pdf').uploadify('cancel');
					}
				},
				'formData': {
					'comprobacionId' : $("#comprobacionId").val(),
					'solicitudId' : $("#solicitudid").val()
				},
				'onUploadComplete' : function(file) { },
				'onUploadSuccess' : function(file, data, response) {
					data = $.parseJSON(data);
					if(response){
						if( data.success == 'false' ) {
							alert(data.msg);
						} else {
						$("#archivoPdf").val(data.target);
						$("#newnamePdf").val(data.newName);
						$("#oldnamePdf").val(data.oldName).show();
						}
					}

		        	},
				'onUploadStart' : function(file) { }
			});

			// Inicializa uploadify para los archivos PDF
			//
			$('#uploadfile_tiket').uploadify({
				'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
				'uploader' : baseUrl + '/gastos/comprobacion/uploadfilepdfplanviaje',
				'buttonText' : 'Seleccionar ticket',
				'buttonClass' : 'buttonPDF',
				'fileTypeExts' : '*.pdf',
				'removeCompleted' : true,
				'onSelect' : function(file){
					if( file.name.length > 42 ){ 
						alert("El nombre del archivo es demasiado largo");
						$('#uploadfile_tiket').uploadify('cancel');
					}
				},
				'formData': {
					'solicitudId' : $("#solicitudid").val(),
					'comprobanteId' : $("#idcomtik").val(),
					'tipo' : 'tk'
				},
				'onUploadComplete' : function(file) { },
				'onUploadSuccess' : function(file, data, response) {
					location.reload();
		        },
				'onUploadStart' : function(file) {
					$("#uploadfile_tiket").uploadify("settings", 'formData', {'comprobanteId' : $("#idcomtik").val(),'solicitudId' : $("#solicitudid").val(),'tipo' : 'tk'});
				}
			});
			
			$('.uploadtk').off('click').on('click',function(e){
				e.preventDefault();
				var idComp  = $(this).parents('tr').find(".dataForm").attr("data-id");
				$('#idcomtik').val(idComp);				
				$('#modalUpload').modal('show');
				
				
			});
			

			$( document ).on({
				blur : function( e ) {
					var error = false;
					var cadenaRfc = $(this).val();
					var objRegExp  = /[A-Z]{3,4}[0-9]{6}[A-Z0-9]{3}{#&}/;
					
					if(cadenaRfc.length == 0){
						return false;
					}
					
					if(!objRegExp.test(cadenaRfc)){
						var revisa = false;
						//persona moral
						if(cadenaRfc.length == 13){
							var nombre = cadenaRfc.substring(0, 4);
							var fecha = cadenaRfc.substring(4, 10);
							revisa = true;
						} else if(cadenaRfc.length == 12) {
							var nombre = cadenaRfc.substring(0, 3);
							var fecha = cadenaRfc.substring(3, 9);
							revisa = true;
						} else {
							alert("La longitud del RFC no es la correcta.");
							error = true;
						}
						
						if(revisa == true){
							var objRegExp  = /^[a-zA-Z#&]+$/;
							if(!objRegExp.test(nombre)) {
								alert("La sección correspondiente al nombre en el RFC tiene caracteres invalidos: " + nombre);
								error = true;
							}
							objRegExp  = /^[0-9]+$/;
							if(!objRegExp.test(fecha)) {
								alert("La sección correspondiente a la fecha en el RFC tiene caracteres invalidos: " + fecha);
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
			    /*
			     * 8  -> BS(Back Space)
			     * 32 -> ESPACE
			     * 37 -> %
			     * 38 -> &
			     * 39 -> '
			     * 46 -> .
			     */
			    
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
			    /*
			     * 8  -> BS(Back Space)
			     * 32 -> ESPACE
			     * 37 -> %
			     * 38 -> &
			     * 39 -> '
			     * 46 -> .
			     */
			    
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
			    /*
			     * 8  -> BS(Back Space)
			     * 32 -> ESPACE
			     * 37 -> %
			     * 38 -> &
			     * 39 -> '
			     * 46 -> .
			     */
			    
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
			
			// Validacion de Caracteres para No Factura			
			$( "#seriefolio" ).keypress(function( e ) {
				key = e.keyCode || e.which;
				tecla = String.fromCharCode(key).toUpperCase();

				//if(tecla === ' '){
				//	return false;
				//}

				letras = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			    
				/*
				 * 8  -> BS(Back Space)
				 * 32 -> ESPACE
				 * 37 -> %
				 * 38 -> &
				 * 39 -> '
				 * 46 -> .
				 */

				especiales = [];

				tecla_especial = false;
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
			
			$("#btnGetValXml_").click(function(e){
				console.log("Agregando XML a campos");
				var tipoComprobante = '';
				var importe = 0;
				var iva = 0;
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
				console.log("importeIva:" + importeIva);
				if( importeIva != ''){
					$("#iva").val("16");
				} else {
					$("#iva").val("0");
				}
				
				rfcEmisor = $.trim( $("#xmlRfcEmisor").val() );
				nombreEmisor = $.trim( $("#xmlNombreEmisor").val() );
				
				rfc = $.trim( $("#xmlRfcReceptor").val() );
				nombreReceptor = $.trim( $("#xmlNombreReceptor").val() );
				
				$("#seriefolio").val(noFactura);
				$("#proveedor").val(nombreEmisor);
				$("#rfc").val(rfcEmisor);
				$("#fechaFactura").val(fechaFactura);
				$("#concepto").val(concepto);
				$("#uuid").val(uuid);
				$("#nombreArchivo").val(nombreArchivo);

				$("#importe").val(importe);
				$("#importeIva").val(importeIva);
				$("#total").val(importeTotal);
				$("#ivaRetenido").val(ivaRetenido);
				$("#isr").val(isr);
				$("#otrosImpuestos").val("");
				console.log("Finalizando carga XML a campos");
				$('#modalResXml').modal('hide');
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
				var importeTotal = 0;
				
				var noFactura = "";
				var idComp = "";
				var nombreEmisor = "";
				var rfcEmisor = "";
				var fechaFactura = "";
				var concepto = "";
				var tpogasto = "";
				
				gastoId = $("#solicitudid").val();
				idComp = $("#comprobacionId").val();
				oldNamePdf = $("#oldnamePdf").val();
				newNamePdf = $("#newnamePdf").val();
				urlArchivo = $("#archivoPdf").val();
				
				tipoComprobante = $("#tipoComprobante").val();
				noFactura = $.trim($("#seriefolio").val());
				nombreEmisor = $.trim($("#proveedor").val());
				rfcEmisor = $.trim($("#rfc").val());
				fechaFactura = $.trim($("#fechaFactura").val());
				concepto =  $.trim($("#conceptogasto").val());
				tpogasto = $("#tpogasto").val();
				idempleado = $("#idempleado").val();
				importe = $("#importe").val();
				iva = $("#iva").val();
				importeIva = $("#importeIva").val();
				importeTotal = $("#total").val();
				ivaRetenido = $("#ivaRetenido").val();
				isr = $("#isr").val();
				otrosImpuestos = $("#otrosImpuestos").val();
				
				/** VALIDACIONES**/
				if(tipoComprobante=== "0"){
					alert("Debe seleccionar un tipo de comprobante");
					$("#tipoComprobante").focus();
					return false;
				}
				
				if(fechaFactura === ""){
					alert("Debe agregar la fecha de emisión del comprobante");
					$("#fechaFactura").focus();
					return false;
				}
				if(tpogasto==="0") {
					alert("Debe seleccionar el Tipo de Gasto");
					$("#tpogasto").focus();
					return false;
				}
				if(concepto === "0"){
					alert("Debe agregar el concepto del comprobante");
					$("#conceptogasto").focus();
					return false;
				}

				if(tipoComprobante == "3"){
					if(nombreEmisor === ""){
						alert("Debe agregar el nombre del proveedor del comprobante");
						$("#proveedor").focus();
						return false;
					}
				}
				
				if(importe == "0"){
					alert("Debe agregar el importe del comprobante");
					$("#importe").focus();
					return false;
				}
				if(oldNamePdf===""){
					alert("Favor de anexar el archivo para comprobación comprobante");
					$("#importe").focus();
					return false;
				}
				if(importeTotal == "0"){
					alert("Debe agregar el importe total comprobante");
					importeTotal = $("#total").focus();
					return false;
				}

				if( $("#tipoaccion").val() === "1" ) {
					var url = baseUrl + "/gastos/comprobacion/agregacomprobante-viaticos";
					var data = {
						gastoId: gastoId,
						nombreArchivo: urlArchivo,
						oldName: oldNamePdf,
						newName: newNamePdf,
						tipoComprobante: tipoComprobante,
						noFactura: noFactura,
						nombreEmisor: nombreEmisor,
						rfcEmisor: rfcEmisor,
						fechaFactura: fechaFactura,
						concepto: concepto,
						tpogasto: tpogasto,
						importe: importe,
						iva: iva,
						importeIva: importeIva,
						importeTotal: importeTotal,
						ivaRetenido: ivaRetenido,
						isr: isr,
						idempleado: idempleado,
						otrosImpuestos: otrosImpuestos
					};
				}else if ($("#tipoaccion").val() === "2"){
					var url = baseUrl + "/gastos/comprobacion/editarcomprobante-viaticos";
					var data = {
						gastoId: gastoId,
						idComp: idComp,
						oldName: oldNamePdf,
						newName: newNamePdf,
						tipoComprobante:tipoComprobante,
						noFactura: noFactura,
						nombreEmisor: nombreEmisor,
						rfcEmisor: rfcEmisor,
						fechaFactura: fechaFactura,
						concepto: concepto,
						importe: importe,
						iva: iva,
						tpogasto: tpogasto,
						importeIva: importeIva,
						importeTotal: importeTotal,
						ivaRetenido: ivaRetenido,
						isr: isr,
						idempleado: idempleado,
						otrosImpuestos: otrosImpuestos
					};
				} else {
					alert("No se definio ninguna accion a aplicar");
					return false;
				} 

				$.ajax({
					type: "POST",
					url: url,
					data: data,
					dataType: 'json',
					success: function(data) {
						if( data.success == true ){
							alert( data.message );
							location.reload();
							return false;
						} else {
							alert( "Ocurrio un error: " + data.message );

						}
					}
				});
			});
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var idComproba = $(this).attr('idrel');
					
					$.ajax({
						url: baseUrl + '/gastos/comprobacion/borracomprobante',
						type: 'POST',
						data: "idcomprobante=" + idComproba,
						dataType: 'json',
						complete: function() {
							//Modal.close();
						},
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
			}, ".delcomproba");

			$(".openPoliticas").click(function( e ) {
					e.preventDefault();
					$('#modalPoliticas').modal('show');
			});

		

	$(".editRow").click(function(e){
		e.preventDefault();

		var tipo = $(this).find(".dataForm").attr("data-tpocomp");
		var fechaComp = $(this).find(".dataForm").attr("data-fdcomp");
		var tpogasto = $(this).find(".dataForm").attr("data-idtpogasto");
		var idconcep = $(this).find(".dataForm").attr("data-idconcepto");
		var factura = $(this).find(".dataForm").attr("data-factura");
		var proveedor = $(this).find(".dataForm").attr("data-proveedor");
		var rfc = $(this).find(".dataForm").attr("data-rfc");
		var importe = $(this).find(".dataForm").attr("data-importe");
		var porciva = $(this).find(".dataForm").attr("data-porciva");
		var importeiva = $(this).find(".dataForm").attr("data-importeiva");
		var otrosimp = $(this).find(".dataForm").attr("data-otrosimp");
		var total = $(this).find(".dataForm").attr("data-total");
		var idComp = $(this).find(".dataForm").attr("data-id");
		var rutaPDF = $(this).find(".dataForm").attr("data-urlpdf");
		var oldName = $(this).find(".dataForm").attr("data-oldname");

		$("option.tpocomp,option.optcto,.opcionalinput").hide();
		$("option.tpocomp_"+tipo).show();
		$(".tpocomp"+tipo).show();
		$(".inputTpo"+tipo).show();

		$( window ).scrollTop( 0 );
		$(".sinxml").show("slow");
		$(".examinar").hide();

		$("#tipoComprobante").val(tipo);
		$("#fechaFactura").val(fechaComp);
		$("#tpogasto").val(tipo+'_'+tpogasto);
		$("#conceptogasto").val(tipo+'_'+tpogasto+'_'+idconcep);
		$("#seriefolio").val(factura);
		$("#proveedor").val(proveedor);
		$("#rfc").val(rfc);
		$("#importe").val(importe);
		$("#iva").val(porciva);
		$("#importeIva").val(otrosimp);
		$("#importeIva").val(importeiva);
		$("#total").val(total);
		$("#comprobacionId").val(idComp);
		$("#archivoPdf").val(rutaPDF);
		$("#tipoaccion").val(2);
		$("#oldnamePdf").val(oldName);
		$("#newnamePdf").val(rutaPDF);
		$("#btnAgregarComprobante").text("Editar");

	});

	$(".deleteRow").click(function(e){
		e.preventDefault();

		if (confirm('¿Esta seguro de eliminar este registro?')) {
			var tpogasto = $(this).find(".dataForm").attr("data-idtpogasto");
			var idconcep = $(this).find(".dataForm").attr("data-idconcepto");
			var idComp   = $(this).find(".dataForm").attr("data-id");
			var tipo     = $(this).find(".dataForm").attr("data-tpocomp");
			var gastoId  = $(this).find(".dataForm").attr("data-idcaso");

			var url = baseUrl + "/gastos/comprobacion/eliminacomprobanteplandeviaje";

			$.ajax({
				type: "GET",
				url: url,
				data: {
					gastoId: gastoId,
					idComp: idComp,
					tpogasto: tpogasto,
					idconcep: idconcep,
					tipo : tipo
				},
					dataType: 'json',
					success: function(data) {
						console.log(data);
						if( data.success ){
							alert( data.message );
							location.reload();
							return false;
						} else {
							alert( "Ocurrio un error: " + data.message );
							return false;
						}
					}
				});

		}
	});




			$(".colapsar").click(function(){
				$("."+this.id).fadeOut("slow");
				$(this).addClass('hide');
				$(this).next().removeClass('hide');
			});
			$(".mostrar").on("click",function(){ 
				$("."+this.id).fadeIn("slow");
				$(this).addClass('hide');
				$(this).prev().removeClass('hide');
			});
			$('#modalResXml').on('hidden', function () {
				$("body").css("overflow","visible");
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
				complete: function() {
					//Modal.close();
				},
				success: function(data) {
					console.log(data);
					return false;

					$("#show-save-loading").hide();
					if( data.respuesta == 'success' ){
						//$('#modalAltaIndividual').modal('hide');
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
			console.log("importe:" + importe);
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
			
			console.log("ivaRetenido:" + importeTotal);
			console.log("isr:" + importeTotal);
			console.log("otrosImpuestos:" + importeTotal);
			
			
			console.log("iva:" + iva);
			importeIva = importe * (iva / 100);
			console.log("importeIva:" + importeIva);
			
			if(tipoComprobante === 'Recibo de honorarios'){
				importe = parseFloat(importe) + parseFloat(importeIva);
				console.log("importe:" + importe);
				console.log("otrosImpuestos:" + otrosImpuestos);
				importeTotal = importe - (ivaRetenido + isr) + otrosImpuestos;
				console.log("importeTotal Hon:" + importeTotal);
			} else {
				importeTotal = parseFloat(importe) + parseFloat(importeIva) + parseFloat(otrosImpuestos);
				console.log("importeTotal:" + importeTotal);
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
			
			
			
			console.log("importe:" + importe);
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
		},
		initPantallaXML : function() {
			$("#tipogastof").off('change').on('change',function(){
				var tipoGasto = $(this).val();

				$("#conceptof").val(0);
				$("#conceptof .tpogto").hide();
				$("#conceptof .tpogto_"+tipoGasto).show();
			});

			// Inicializa uploadify para los archivos PDF en el formulario de carga XML
			$('#uploadfacturapdf').uploadify({
				'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
				'uploader' : baseUrl + '/gastos/comprobacion/uploadfilepdfplanviaje',
				'buttonText' : 'Seleccionar PDF',
				'buttonClass' : 'buttonPDF',
				'fileTypeExts' : '*.pdf',
				'removeCompleted' : true,
				'formData': {
					'comprobacionId' : $("#comprobacionId").val(),
					'solicitudId' : $("#solicitudid").val()
				},
				'onUploadComplete' : function(file) { },
				'onUploadSuccess' : function(file, data, response) {
					data = $.parseJSON(data);
					if(response){
						$("#pdffactura").val(data.target);
						$("#newnamepdffactura").val(data.newName);
						$("#oldnamepdffactura").val(data.oldName);
					}
		        	},
				'onUploadStart' : function(file) { }
			});

			$("#btnGetValXml").off('click').click(function(e){
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
				
				if( $("#tipogastof").val() == 0 ) {
					alert("Seleccione un Tipo de Gasto.");
					$("#tipogastof").focus();
					return false;
				}

				if( $("#conceptof").val() == 0 ) {
					alert("Seleccione un CONCEPTO.");
					$("#conceptof").focus();
					return false;
				}

				if( $("#oldnamepdffactura").val() == "" ) {
					alert("Favor de anexar el comprobante PDF.");
					$("#conceptof").focus();
					return false;
				}

				var dataserial = $("#formfactura").serialize();				
				var gastoId = $("#solicitudid").val();
				var idempleado = $("#empleadoid").val();
				var tipoComprobante = $("#tipoComprobante").val();

				var url = baseUrl + "/gastos/comprobacion/agregacomprobante-viaticos";
				$.ajax({
					type: "POST",
					url: url,
					data: dataserial+"&gastoId="+gastoId+"&factura=1"+"&idempleado="+idempleado+"&tipoComprobante="+tipoComprobante,
					dataType: 'json',
					success: function(data) {
						console.log(data);
						if( data.success ){
							alert( data.message );
							location.reload();
							return false;
						} else {
							alert( "Ocurrio un error: " + data.message );
							if(data.tpoDoc == 1) {
								$("#xmlSubtotal").val(data.data.subtotalMax);
								$("#xmlTotal").val(data.data.montoMax);
								$("#xmlIva").val(data.data.xmlIva);
								$("#xmlPorcIva").val(data.data.xmlPorcIva);
								$(".alert.alert-warning").show();
							}
							return false;
						}
					}
				});
			});

		}
};

$(function(){
	ComprobacionPantalla.init();
});