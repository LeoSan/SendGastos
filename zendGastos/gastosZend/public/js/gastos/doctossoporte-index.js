var DoctossoporteIndex = {
		init : function() {
			//$(".grid-title").html("Comprobaciones");
			/*
			$("#selStatus").change(function( e ) {
				e.preventDefault();
				DoctossoporteIndex.ChangeFilter();
			});
			*/
			DoctossoporteIndex.cargarGrid();
			
			$('#file_upload_soporte').uploadify({
		        'swf'      : baseUrl + '/lib/uploadify/uploadify.swf',
		        'uploader' : baseUrl + '/gastos/doctossoporte/uploadfile',
		        'buttonText' : 'Examinar...',
		        'removeCompleted' : true,
		        'formData': {'solicitudid' : $("#solicitudid").val()},
		        'onUploadStart' : function(file) {
                    $("#file_upload_soporte").uploadify('settings','formData' ,{'consecutivo' : $("#consecutivo").val(), 'indice' : $("#indice").val()});
		        },
		        'onUploadComplete' : function(file) {
		            //$("#archivo").val(file.name);
		        	console.log('onUploadComplete el archivo ' + file.name + ' finalizó exitosamente.');
		        },
		        'onUploadSuccess' : function(file, data, response) {
		        	/*console.log(file);
		        	console.log(data);
		        	console.log(response);*/
		        	var cadena = JSON.parse(data);
		        	if(cadena.success == 'true'){
			        	$("#archivo_soporte").val(cadena['file']);
			        	$("#msjSuccessUpload").html('El archivo ' + file.name + ' se cargo correctamente');
			        	$("#msjSuccessUpload").show();
			            console.log('onUploadSuccess el archivo ' + file.name + ' se cargo progresivamente con respuesta ' + response + ':' + data);
		        	} else {
		        		$("#msjErrorUpload").html('Error al cargar el archivo ' + file.name + '.');
		        		$("#msjErrorUpload").show();
		        	}
		        }
		        // Put your options here
		    });
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var credito = $(this).attr("credito");
					var concepto = $(this).attr("concepto");
					var nmdocumento = $(this).attr("nmdocumento");
					var consecutivo = $(this).attr("consecutivo");
					var indice = $(this).attr("indice");
					//console.log(consecutivo);return false;
					//DoctossoporteIndex.showLwDigital(credito);
					$.ajax({
						  url: baseUrl + '/gastos/doctossoporte/getdetdocsoparchs',
						  type: 'POST',
						  data: {solicitudid: $("#solicitudid").val(), credito:credito, concepto:concepto, nmdocumento:nmdocumento, consecutivo:consecutivo, indice:indice},
						  dataType: 'html',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  //console.log(data);
							  //return false;
							  $("#consecutivo").val( consecutivo );
							  $("#nmdocumento").val( nmdocumento );
							  $("#indice").val( indice );
							  $("#modalAsignar #listaCreditosdocumentossoporte").html(data);
							  $('#modalAsignar').modal('show');
							  /*
							  if( data.respuesta == "success" ){
								  DoctossoporteIndex.cargarGrid();
								  alert("Datos guardados correctamente.");
							  } else {
								  alert("Ocurrio un error: " + msj);
							  }
							  */
						} 
					});
				}
			}, "#lista-doctossoporte .agregar");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var credito = $(this).attr("credito");
					var consecutivo = $(this).attr("consecutivo");
					var nmdocumento = $(this).attr("nmdocumento");
					
					$.ajax({
						  url: baseUrl + '/gastos/doctossoporte/getlwdigital',
						  type: 'POST',
						  data: {solicitudid: $("#solicitudid").val(), credito:credito},
						  dataType: 'html',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  //console.log(data);
							  //return false;
							  $("#consecutivoLw").val( consecutivo );
							  $("#nmdocumentoLw").val( nmdocumento );
							  $("#modalAsignarLw #listaCreditosLw").html(data);
							  $('#modalAsignarLw').modal('show');
						}
					});
				}
			}, "#lista-doctossoporte .lw");

			$( document ).on({
				click : function( event ) {
					$("#creditosdocumentossoporte input[type=checkbox]").each(function(e){
						$(this).prop( "checked", $("#creditosdocumentossoporte #checkAll").is(':checked') );
						/*
						if( $(this).is(':checked') ) {
							//cada elemento seleccionado
							$( this ).removeAttr('checked');
						}
						*/
					});
				}
			}, "#creditosdocumentossoporte #checkAll");
			
			$( document ).on({
				click : function( event ) {
					var checkActual = $(this).attr('name');
					var checked = $(this).is(':checked');
					$("#creditosdocumentoslw input[type=checkbox]").each(function(e){
						if( $(this).attr('name') != checkActual ){
							$(this).prop("checked", false );
						}
						//$(this).prop( "checked", $("#creditosdocumentossoporte #checkAll").is(':checked') );
						/*
						if( $(this).is(':checked') ) {
							//cada elemento seleccionado
							$( this ).removeAttr('checked');
						}
						*/
					});
				}
			}, "#creditosdocumentoslw input[type=checkbox]");
			
			$("#btnAgregarCreditosSop").click(function(e){
				var archivo_soporte = $("#archivo_soporte").val();
				if( archivo_soporte == "" ){
					alert("Debe subir el archivo a agregar.");
					return false;
				}
				
				var seleccionados = false;
				var consecutivos = "";
				$("#creditosdocumentossoporte input[type=checkbox]").each(function(e){
					if( $(this).is(':checked') ) {
						seleccionados = true;
						if( $(this).attr('name') != 'checkAll' ){
							consecutivos += $(this).val() + "|";
						}
					}
				});
				
				if( !seleccionados ){
					alert("Debe seleccionar los créditos a agregar.");
					return false;
				}
				
				$.ajax({
					  url: baseUrl + '/gastos/doctossoporte/setadddoctosoporte',
					  type: 'POST',
					  data: $("#frmDoctosSoporte").serialize() + '&solicitudid=' + $("#solicitudid").val() + '&consecutivos=' + consecutivos + '&userid=' + $("#empleadoid").val(),
					  dataType: 'json',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  console.log(data);
						  //return false;
						  
						  if( data.respuesta == "success" ){
							  DoctossoporteIndex.cargarGrid();
							  $('#modalAsignar').modal('hide');
						  } else {
							  alert("Ocurrio un error: " + msj);
							  return false;
						  }
					} 
				});
				
				//console.log(seleccionados);
				//console.log(consecutivo);
			});
			
			$("#btnAsignarCreditosLwSop").click(function(e){
				var iddocto = "";
				var ruta = "";
				var seleccionado = false;
				$("#creditosdocumentoslw input[type=checkbox]").each(function(e){
					if( $(this).is(':checked') ) {
						seleccionado = true;
						iddocto += $(this).attr('iddocto');
						ruta += $(this).val();
					}
				});
				
				if( !seleccionado ){
					alert("Debe seleccionar un archivo a asignar.");
					return false;
				}
				
				$.ajax({
					  url: baseUrl + '/gastos/doctossoporte/setadddoctosoporte',
					  type: 'POST',
					  data: $("#frmDoctosLw").serialize() + '&solicitudid=' + $("#solicitudid").val() + '&iddocto=' + iddocto + '&ruta=' + ruta + '&userid=' + $("#empleadoid").val(),
					  dataType: 'json',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  console.log(data);
						  //return false;
						  
						  if( data.respuesta == "success" ){
							  DoctossoporteIndex.cargarGrid();
							  $('#modalAsignarLw').modal('hide');
						  } else {
							  alert("Ocurrio un error: " + msj);
							  return false;
						  }
					} 
				});
				
				//console.log(seleccionados);
				//console.log(consecutivo);
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
				url: baseUrl + '/gastos/doctossoporte/getdetalledoctossoporte',
				type: 'POST',
				data: {solicitudid : $("#solicitudid").val(), tipocaptura : $("#tipocaptura").val()},
				dataType: 'html',
				complete: function() {
					//Modal.close();
				},
				success: function(data) {
					//$('#modalAltaIndividual').modal('hide');
					$('#lista-doctossoporte').html(data);
				} 
			});
		}
};

DoctossoporteIndex.init();