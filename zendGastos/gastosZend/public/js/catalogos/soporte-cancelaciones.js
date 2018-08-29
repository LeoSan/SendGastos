var SoporteCancelaciones = {
		init : function() {
			$(".grid-title").html("Cancelaciones");
			
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
				        url: baseUrl + '/catalogos/soporte/getcancelaciones',
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
                            console.log("btnBuscarGasto");
                            if(validateElement.isValid($("#idgastobuscar"), $("#frmBuscarGasto"), 93 ) === false){
                                console.log("false");
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
			        url: baseUrl + '/catalogos/soporte/getcancelaciones',
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
//					console.log(gastoid);
//					console.log(etapa);
//					console.log(appid);
//					console.log(delindex);
//					console.log(userid);
					Layout.showLoading();
					$.ajax({
				        type: "POST",
				        dataType: 'html',
				        url: baseUrl + '/catalogos/miexpediente/getdetalle',
				        data: {
				        	gastoid: 	gastoid,
				        	etapa: 		etapa,
				        	appid: 		appid,
				        	delindex:	delindex,
							userid: 	userid
						},
						success: function (data) {
//				        	console.log( data );
				        	Layout.hideLoading();
				        	$("#myModal #myModalLabel").html("Detalle del gasto " + gastoid);
//				        	$("#myModal .modal-body").html(data.body);
				        	$("#myModal .modal-body").html(data);
				        	$('#myModal').modal('show');
				        }
				    });
				}
			}, ".verdetalle");
			
//			$(".verdetalle_").click(function(e){
//				
//				
//			});
			
			$( document ).on({
				click : function( e ) {
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
			
			$('#frmReasignacion').on('hidden', function () {
				$("#idGasto").val( "" );
				$("#delindex").val( "" );
				$("#responsable").val( "" );
				$("#asignara").val( "" );
				$("#idAsignara").val( "0" );
				$("#noticket").val( "" );
				$("#comentarios").val( "" );
				$("#appuid").val( "" );
			});

			$("#btnGuardarReasignacion").click(function(e){
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
				
				
				console.log(gastoid);
				console.log(comentarios);
				/*
				alert("Guardamos todo");
				return false;
				*/
				$.ajax({
			        type: "POST",
			        dataType: 'json',
			        url: baseUrl + '/catalogos/soporte/cancelar',
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
			        	console.log( data );
			        	//return false;
			        	/*
			        	Layout.hideLoading();
			        	$("#myModal #myModalLabel").html("Detalle del gasto " + gastoid);
			        	$("#myModal .modal-body").html(data.body);
			        	$('#myModal').modal('show');
			        	return false;
			        	*/
			        	if (data.success == true) {
			        		$.ajax({
						        type: "POST",
						        dataType: 'json',
						        url: baseUrl + '/catalogos/soporte/actualizacancelacion',
						        data: {
						        	userid: 	$("#usruid").val(),
						        	appuid: 	$("#appuid").val(),
						        	delindex: 	$("#delindex").val(),
						        	comentarios: $("#comentarios").val()
								},
						        success: function (data) {
						        	console.log( data );
						        	Layout.hideLoading();
						        	if (data.success == true) {
						        		$('#frmReasignacion').modal('hide');
						        		Layout.hideLoading();
						        		Menu.loadModuleMenu('catalogos', 'soporte', 'cancelaciones', '#');
						        		
						            } else {
						            	Layout.hideLoading();
						            	alert("Ocurrios un error: " + data.msg);
						            	
						            }
						        }
						    });
			            } else {
			            	alert("Ocurrios un error: " + data.msg);
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
		},// End Init() 
		contarSeleccionados : function() {
			var seleccionados = 0;
			var importe = 0;
			var cadena = '';
			var cadenaArray = '';
			$("#tablaSoporteCancelaciones input[type=checkbox]").each(function(e){
				//console.log( $(this).attr("checked") );
				if( $(this).attr("name") != "checkAll" ){
					if( $(this).is(':checked') ) {
						//cada elemento seleccionado
						seleccionados += 1;
						cadena = $(this).attr('name');
						cadenaArray = cadena.split("-");
						//console.log(cadenaArray);
						importe += parseFloat( $("#importe-" + cadenaArray[1] ).html() );
					}
				}
			});
			
			$("#anticipoSeleccionados").html(seleccionados);
			$("#importeADepositar").html( parseFloat(importe).toFixed(2) );
		}
};

//$( document ).ready(function() {
	SoporteCancelaciones.init();
//});

