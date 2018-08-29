var AjusteDatos = {
		init : function() {
			$(".grid-title").html("Ajuste de datos editar/cancelar");
                        
                        //$("#id_gasto").validarCampo();
                        
                        
                        
//                        $("#id_gasto").on('keypress',function(e){
//                            console.log(e.charCode + ' ');
//                            if(validateElement.isValid(this,e) == false){
//                                //$(this).val('');
//                                var confir = 
//                            } 
////                            if(validateElement.isValid(this) === false) {
////                                //e.preventDefault();
////                                return false;
////                            } else {
////                                return true;
////                            }
//                        });
                        
                        //$('input#comentarios').bind('keypress', function (event) {
//    var regex = new RegExp("^[a-zA-Z0-9ñÑ _, _. _]+$");
//    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
//    if (!regex.test(key)) {
//        event.preventDefault();
//        return false;
//    }
//});
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					var idcategoria = $(this).val();
					
					if(!idcategoria){
						$( "#id_subcategoria" ).find('option').remove().end();
						$( "#id_subcategoria" ).append('<option value="">- Seleccione -</option>');
					}
					
					AjusteDatos.listarSubcategorias(idcategoria);
				}
			}, "#id_categoria");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					var idsubcategoria = $(this).val();
					var url = baseUrl + "/catalogos/tesoreriaajustes/getbuscaconceptos";
					
					if(!idsubcategoria){
						$( "#id_categoria" ).focus();
					}
					
					$( "#id_concepto" ).find('option').remove().end();
					$( "#id_concepto" ).append('<option value=""> Cargando ... </option>');
					
					$.ajax({
						type: "POST",
						url: url,
						data: { categoriaid: $("#id_categoria").val(), subcategoriaid: idsubcategoria,tiposolicitud:$("#tiposolicitud").val(), queasigna:$("#tipocaptura").val(), puesto:$("#puestoid").val() },
						dataType: 'json',
						success: function(data) {
							$( "#id_concepto" ).find('option').remove().end();
							$( "#id_concepto" ).append('<option value="">- Seleccione -</option>');
							$.each(data.conceptos, function (i, item) {
								$( "#id_concepto" ).append('<option value="' + item.IDCONCEPTO + '">' + item.NMCONCEPTO + '</option>');
								//console.log(item.NMDESCRIP);
						    });
						}
					});
				}
			}, "#id_subcategoria");
			
			$("#btnBorrarDatos").click(function(e){
				$("#id_gasto").val("");
				$("#id_solicitante").val("");
				$("#id_concepto").val("");
				$("#id_tipodeposito").val("");
				
				$("#resGastos").html("");
				$("#id_gasto").focus();
			});
			
//			$("#btnBuscarGasto").click(function(e){
//                            
//                            if(validateElement.isValid(this) == false){
//                                //$(this).val('');
//                                alert('el campo solo debe de ser numero');
//                                e.preventDefault();
//                               // return false;
//                            } 
//                           $(".info-warning").on('mouseover',function(){
//                               
//                           });
                           //$(".info-warning").tooltip();
                            
                        $("#btnBuscarGasto").on('click',function(e){
                            
                            var hayFiltro = false;
                            
                            // var valida = true;
                            
                            if(validateElement.isValid($( "#id_gasto" ),$("#valida_idGasto"),182) == false){
                                //e.preventDefault();
                                hayFiltro =  true;
                                console.log('id_gasto');
                            } else  {
//                                $("#info-validacion").remove()
//                                $("#" +id ).removeAttr('style');
                            }
                            if( validateElement.isValid($("#id_solicitante"), $("#valida_idSolicitante"),182) == false) {
                                 //e.preventDefault();
                                 hayFiltro =  true;
                                 console.log('id_solicitante');
                            } else {
                                
                            }
                            
                            if(($.trim( $( "#id_gasto" ).val() ) == "")) {
                                hayFiltro =  true;
                                //alert("El campo 'Número de gasto' es obligatorio");
                            }
                                
                            
//				var hayFiltro = false;
//				
//				if( $.trim( $( "#id_gasto" ).val() ) != "" ){
//					hayFiltro = true;
//				}
//				
//				if( $.trim( $( "#id_solicitante" ).val() ) != "" ){
//					hayFiltro = true;
//				}
				
				if( $.trim( $( "#id_concepto" ).val() ) == "" ){
					hayFiltro = true;
				}
				
				if( $.trim( $( "#id_tipocheque" ).val() ) == "" ){
					hayFiltro = true;
				}
				
				if( hayFiltro == true) {
					$( "#id_gasto" ).focus();
					console.log(' Hay Filtros true' + hayFiltro);
                                        
				} else {  
                                    console.log("NO hay filtros");
                               
				
				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
			        type: "POST",
			        dataType: 'html',
			        url: baseUrl + '/catalogos/tesoreriaajustes/getajustededatos',
			        data: $("#frmBuscarGasto").serialize(),
			        success: function (data) {
			        	//console.log(data);
		            	Layout.hideLoading();
		            	$("#resGastos").html(data);
		            	return false;
			        }
			    });
			 }	
			});
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					
					var gasto = $(this).attr('idgasto');
					var appuid = $(this).attr('appuid');
					var delindex = $(this).attr('delindex');
					
					Layout.showLoading();
					//Aplicamos tesoreria
					$.ajax({
				        type: "POST",
				        dataType: 'json',
				        url: baseUrl + '/catalogos/tesoreriaajustes/getdetallecheque',
				        data: {id_cheque: gasto},
				        success: function (data) {
				        	console.log(data); //return false;
			            	Layout.hideLoading();
			            	if(data.respuesta == 'success'){
			            		$("#cheque_actual_canc").val(data.cheque['NUMEROCHEQUE']);
			            		$("#importe_cheque_canc").val(data.cheque['IMPORTE']);
			            		$("#comision_cheque_canc").val(data.cheque['COMISION']);
			            		$("#fecha_emision_canc").val(data.cheque['FECHAEMISION']);
			            		$("#tipo_cheque_canc").val(data.cheque['TIPOCHEQUE']);
			            		$("#cheque_nombre_canc").val(data.cheque['ANOMBREDE']);
			            		
			            		$("#appuid_canc").val( appuid );
			            		$("#userid_canc").val( $("#userid").html() );
			            		$("#gastoid_canc").val( gasto );
			            		$("#delindex_canc").val( delindex );
			            		
			            		$("#modalCancelacionCheque").modal('show');
			            	} else {
			            		alert("No hay información para este Gasto")
			            	}
			            	
			            	//$("#resGastos").html(data);
			            	return false;
				        }
				    });
				}
			}, ".cancelar");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					
					var gasto = $(this).attr('idgasto');
					var appuid = $(this).attr('appuid');
					
					Layout.showLoading();
					//Aplicamos tesoreria
					$.ajax({
				        type: "POST",
				        dataType: 'json',
				        url: baseUrl + '/catalogos/tesoreriaajustes/getdetallecheque',
				        data: {id_cheque: gasto},
				        success: function (data) {
				        	console.log(data); //return false;
			            	Layout.hideLoading();
			            	if(data.respuesta == 'success'){
			            		$("#noGastoEdita").val(gasto);
			            		$("#no_cheque_actual").val(data.cheque['NUMEROCHEQUE']);
			            		$("#fecha_emision_edita").val(data.cheque['FECHAEMISION']);
			            		$("#empresa_actual").val(data.cheque['EMPRESAFACT']);
			            		$("#modalEditarDatos").modal('show');
			            	} else {
			            		alert("No hay información para este Gasto")
			            	}
			            	
			            	//$("#resGastos").html(data);
			            	return false;
				        }
				    });
				}
			}, ".editar");
			
			
			$("#btnGuardarModificacion").click(function(e){
				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreriaajustes/setmodificadatos',
    		        data: $("#frmEditarDatos").serialize() + "&userid=" + $("#noEmpleado").html() + "&gastoid=" + $("#noGastoEdita").val(),
    		        success: function (data) {
    		        	console.log(data);
		            	Layout.hideLoading();
    		        	if (data.success == true) {
    						$("#btnGuardar").hide();
    						console.log( data.num_bloque );
    		            } else {
    		            	alert("Ocurrio un error: " + data.msg);
    		            }
    		        }
    		    });
				return false;
			});
			$("#btnGuardarCancelacion").click(function(e){
				//alert("Guardamos Cancelacion, esto es una prueba");
				
				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreriaajustes/setcanceladatos',
    		        data: $("#frmCancelacionCheque").serialize() + "&userid=" + $("#noEmpleado").html() + "&email=" + $("#email").html(),
    		        success: function (data) {
    		        	console.log(data);
		            	Layout.hideLoading();
    		        	if (data.success == true) {
    		        		alert("Gasto cancelado exitosamente.");
    		            } else {
    		            	alert("Ocurrio un error: " + data.msg);
    		            }
    		        }
    		    });
				return false;
			});
			
			$( "#fecha_emision" ).datepicker();
			
			$("#iconCalendar").click(function(){
				$( "#fecha_emision" ).focus();
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
		},
		listarSubcategorias : function(id_categoria) {
			var url = baseUrl + "/catalogos/subcategorias/getsubcategorias";
			$.ajax({
				type: "POST",
				url: url,
				data: { id: id_categoria },
				dataType: 'json',
				success: function(data) {
					$( "#id_subcategoria" ).find('option').remove().end();
					$( "#id_subcategoria" ).append('<option value="">- Seleccione -</option>');
					$.each(data.categoria, function (i, item) {
						$( "#id_subcategoria" ).append('<option value="' + item.IDCUENTACAT + '">' + item.NMDESCRIP + '</option>');
						//console.log(item.NMDESCRIP);
				    });
				}
			});
		},
                validarCampo: function(event){
                    var regex = '/^\d{9}$/';
                    
                    if(regex.text() == false) {
                        
                    } else {
                        
                    }
                    
                  ///
                  
                  
                },
};
AjusteDatos.init();