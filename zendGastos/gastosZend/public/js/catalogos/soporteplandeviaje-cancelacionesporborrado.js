var SoporteCancelacionesBorrado = {
		init : function() {
			$(".grid-title").html("Cancelación");
			
			$("#idgastobuscar").keypress(function (e) {
				if (e.which == 13) {
					e.preventDefault();
					if( $.trim( $("#idgastobuscar").val() ) == "" ){
						alert("Ingrese el número de gasto a buscar");
						$("#idgastobuscar").focus();
						return false;
					}
					
					var userid = $("#noEmpleado").html();
					$("#resultadoListaGastos").html( "" );
					Layout.showLoading();
					$.ajax({
				        type: "POST",
				        dataType: 'html',
				        url: baseUrl + '/catalogos/soporteplandeviaje/getcancelacionesporborrado',
				        data: {
				        	gastoid: 	$.trim( $("#idgastobuscar").val() ),
							userid: 	userid
						},
				        success: function (data) {
				        	console.log( data );
				        	Layout.hideLoading();
				        	
				        	$("#resultadoListaGastos").html( data );
				        }
				    });
				}
			});
			
			$("#btnBuscarGasto").click(function(e){
                            
                            if(validateElement.isValid($("#idgastobuscar"), $("#frmBuscarGasto"), 93 ) == false){
                                return false;
                            }    
				if( $.trim( $("#idgastobuscar").val() ) == "" ){
					alert("Ingrese el número de gasto a buscar");
					$("#idgastobuscar").focus();
					return false;
				}
				
				var userid = $("#noEmpleado").html();
				$("#resultadoListaGastos").html( "" );
				Layout.showLoading();
				$.ajax({
			        type: "POST",
			        dataType: 'html',
			        url: baseUrl + '/catalogos/soporteplandeviaje/getcancelacionesporborrado',
			        data: {
			        	gastoid: 	$.trim( $("#idgastobuscar").val() ),
						userid: 	userid
					},
			        success: function (data) {
			        	console.log( data );
			        	Layout.hideLoading();
			        	
			        	$("#resultadoListaGastos").html( data );
			        }
			    });
			});
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var gastoid = $(this).attr('gastoid');
					var etapa = "1";
					var appid = "1";
					var delindex = "1";
					var userid = $("#noEmpleado").html();

					Layout.showLoading();
					$.ajax({
				        type: "POST",
				        dataType: 'json',
				        url: baseUrl + '/catalogos/miexpediente/getdetalle',
				        data: {
				        	gastoid: 	gastoid,
				        	etapa: 		etapa,
				        	appid: 		appid,
				        	delindex:	delindex,
							userid: 	userid
						},
				        success: function (data) {
				        	console.log( data );
				        	Layout.hideLoading();
				        	$("#myModal #myModalLabel").html("Detalle del gasto " + gastoid);
				        	$("#myModal .modal-body").html(data.body);
				        	$('#myModal').modal('show');
				        	return false;
				        	if (data.success == true) {
				        		Menu.loadModuleMenu('catalogos', 'tesoreria', 'pagosviacie');
				        		Layout.hideLoading();
				        		console.log( data.num_bloque );
				            } else {
				            	alert("Ocurrios un error: " + data.msg);
				            	Layout.hideLoading();
				            }
				        }
				    });
				}
			}, ".verdetalle");
			
			$(".verdetalle_").click(function(e){
				
				
			});
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					var idGasto = $(this).attr('gastoid');
					//var delindex = $(this).attr('delindex');
					$("#idGasto").val( idGasto );
					//$("#delindex").val( delindex );
					$("#responsable").val( $(this).attr('responsable') );
					//$("#responsableid").val( $(this).attr('responsableid') );
					//$("#appuid").val( $(this).attr('appuid') );
					$("#modalCancelacionLabel").html("Reasignar el gasto " + idGasto);
					$('#modalCancelacion').modal('show');
				}
			}, ".reasignar");
					
			$('#asignara').typeahead({
				source: function (query, process) {
				    states = [];
				    map = {};
				    
				    $.ajax({
						type: "POST",
						url: baseUrl + '/catalogos/soporte/getresponsable',
						data: { texto: query },
						dataType: 'json',
						success: function(data) {
							console.log(data);
							$.each(data.empleados, function (i, state) {
								//alert(state.NMNOMBRE);return false;
								//console.log(state);
						        map[state.NOMBRE] = state;
						        states.push(state.NOMBRE);
						    });
						 
						    process(states);
						}
					});
				},
				updater: function (item) {
					//console.log(item);
				    selectedState = map[item].EMAIL;
				    selectedUsrUid = map[item].UID;
				    $("#idAsignara").val(selectedState);
				    $("#usruid").val(selectedUsrUid);
				    //console.log(selectedState);
				    return item;
				}
			});
			/*
			$("#noticket").keypress(function(tecla) {
				if((tecla.charCode < 97 || tecla.charCode > 122) && (tecla.charCode < 65 || tecla.charCode > 90) && (tecla.charCode != 45)) return false;
		    });
*/
			$(".reasignar_").click(function(e){
				e.preventDefault();
				var idGasto = $(this).attr('gastoid');
				var delindex = $(this).attr('delindex');
				$("#idGasto").val( idGasto );
				$("#delindex").val( delindex );
				$("#responsable").val( $(this).attr('responsable') );
				$("#responsableid").val( $(this).attr('responsableid') );
				$("#appuid").val( $(this).attr('appuid') );
				$("#frmReasignacionLabel").html("Cancelar el gasto " + idGasto);
				$('#frmReasignacion').modal('show');
			});
			
			$('#modalCancelacion').on('hidden', function () {
				$("#idGasto").val( "" );
				$("#delindex").val( "" );
				$("#responsable").val( "" );
				$("#asignara").val( "" );
				$("#idAsignara").val( "0" );
				$("#noticket").val( "" );
				$("#comentarios").val( "" );
				$("#appuid").val( "" );
			});

			$("#btnGuardarCancelacion").click(function(e){
				e.preventDefault();
				var responsable = $("#responsable").val();
				var responsableid = $("#responsableid").val();
				var reasignara = $("#idAsignara").val();
				var reasignaraNombre = $("#asignara").val();
				var noticket = $("#noticket").val();
				var comentarios = $("#comentarios").val();
				var gastoid = $("#idGasto").val();
				var userid = $("#noEmpleado").html();
				var delindex = $("#delindex").val();
				var appuid = $("#appuid").val();

				if( reasignara == "0" ){
					alert("Seleccione el nuevo responsable.");
					$("#asignara").focus();
					return false;
				}
				
				if( noticket == "" ){
					alert("Ingrese el número de Ticket asociado.");
					$("#noticket").focus();
					return false;
				}
				
				if( comentarios == "" ){
					alert("Ingrese los comentarios.");
					$("#comentarios").focus();
					return false;
				}
				
				
				//console.log(gastoid);
				//console.log(comentarios);
				/*
				alert("Guardamos todo");
				return false;
				*/
				$.ajax({
			        type: "POST",
			        dataType: 'json',
			        url: baseUrl + '/catalogos/soporteplandeviaje/cancelar',
			        data: {
			        	gastoid: 			gastoid,
			        	reasignara: 		reasignara,
			        	reasignaranombre:	reasignaraNombre,
			        	comentarios:		comentarios,
						userid: 			userid,
						delindex: 			delindex,
						appuid: 			appuid,
						noticket:			noticket,
						responsable:		responsable,
						responsableid:		responsableid
					},
			        success: function (data) {
			        	
			        	if (data.ORA.success == true) {
			        		$('#modalCancelacion').modal('hide');
			        		Layout.hideLoading();
			        		Menu.loadModuleMenu('catalogos', 'soporteplandeviaje', 'cancelacionesporborrado', '#');
			        	} else {
			        		msgError = "";
			        		if(data.ORA.success == false){
			        			msgError += "ORA - No se elimino registro \n";
			        		}
			        		if(data.PM.success == false){
			        			msgError += "PM - No se elimino registro";
			        		}

			            	alert("ERROR: " + msgError );
			            	Layout.hideLoading();
			        	
			        	}
			        	
			        	
			        	
			        }
			    });
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
		}
};

SoporteCancelacionesBorrado.init();