var SucursalesIndex = {
		init : function() {
			//alert("Hola como estas?");
			//var baseUrl = '/cuentas/public';
			
			$(".grid-title").html("Catálogo de Sucursales");
			
			$("#btnAddSucursal").click(function(e){
				e.preventDefault();
				$('#catalogo-content').html("");
				var userid = $('#userid').html();
				$.ajax({
					  url: $(this).attr('href'),
					  type: 'POST',
					  data: {test: 'test', userid: userid},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  	$('#catalogo-content').html(data);
						} 
				});
			});
			
			$('#titular').typeahead({
				source: function (query, process) {
				    states = [];
				    map = {};
				    
				    if( $("#ubicacion").val()==null || $("#ubicacion").val() == "" ) {
				    	$("#titular").val("");
				    	alert("Selecciona primero la UBICACIÓN");
				    	return false;
				    }
				    
				    $.ajax({
						type: "POST",
						url: baseUrl + '/catalogos/sucursales/gettitulares',
						data: { empleado: query, ubicacion: $("#ubicacion").val() },
						dataType: 'json',
						success: function(data) {
							console.log(data.query);
							$.each(data.empleados, function (i, state) {
								//alert(state.NMNOMBRE);return false;
								console.log(state);
						        map[state.nombre] = state;
						        states.push(state.nombre);
						    });
						 
						    process(states);
						}
					});
				},
				updater: function (item) {
					//console.log(item);
				    selectedState = map[item].email;
				    //console.log(selectedState);
				    $("#idTitular").val(selectedState+';');
				    //console.log(selectedState);
				    return item;
				}
			});
			
			$('#suplente1').typeahead({
				source: function (query, process) {
				    states = [];
				    map = {};
				    
				    $.ajax({
						type: "POST",
						url: baseUrl + '/catalogos/sucursales/gettitulares',
						data: { empleado: query, ubicacion: $("#ubicacion").val() },
						dataType: 'json',
						success: function(data) {
							console.log(data.query);
							$.each(data.empleados, function (i, state) {
								//alert(state.NMNOMBRE);return false;
								console.log(state);
						        map[state.nombre] = state;
						        states.push(state.nombre);
						    });
						 
						    process(states);
						}
					});
				},
				updater: function (item) {
					//console.log(item);
				    selectedState = map[item].email;
				    //console.log(selectedState);
				    $("#idSuplente1").val(selectedState);
				    //console.log(selectedState);
				    return item;
				}
			});
			$('#suplente2').typeahead({
				source: function (query, process) {
				    states = [];
				    map = {};
				    
				    $.ajax({
						type: "POST",
						url: baseUrl + '/catalogos/sucursales/gettitulares',
						data: { empleado: query, ubicacion: $("#ubicacion").val() },
						dataType: 'json',
						success: function(data) {
							console.log(data.query);
							$.each(data.empleados, function (i, state) {
								//alert(state.NMNOMBRE);return false;
								console.log(state);
						        map[state.nombre] = state;
						        states.push(state.nombre);
						    });
						 
						    process(states);
						}
					});
				},
				updater: function (item) {
					//console.log(item);
				    selectedState = map[item].email;
				    //console.log(selectedState);
				    $("#idSuplente2").val(selectedState);
				    //console.log(selectedState);
				    return item;
				}
			});
			
			$(".editarSuc").click(function(e){
				e.preventDefault();
				$('#lblFormModalSuc').html($(this).attr("title"));
				$('#idSucursal').val( $(this).attr("id-rel") );
				
				var userid = $('#userid').html();
				$.ajax({
					  url: baseUrl + '/catalogos/sucursales/getsucursal',
					  type: 'POST',
					  data: {id: $(this).attr("id-rel"), userid: userid},
					  dataType: 'json',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  console.log(data);
						  
						  $('#sucursal').val( data.sucursal[0].NMSUCURSAL );
						  $('#estado').val( data.sucursal[0].IDESTADO );
						  $('#ubicacion').val( data.sucursal[0].CVEUBICACION );
						  $('#direccion').val( data.sucursal[0].FCDIRECCION );
						  
						  $('#titular').val( data.sucursal[0].TITULAR );
						  $('#idTitular').val( data.sucursal[0].FCTITULARSUC );
						  $('#idSuplente1').val( data.sucursal[0].FCSUPLENTE01 );
						  $('#idSuplente2').val( data.sucursal[0].FCSUPLENTE02 );
						  $('#coordenadas').val( data.sucursal[0].FCGEOREFERENCIA );
						  
						  /*
						  $('#titular').val( data.sucursal[0].FCTITULARSUC );
						  $('#suplente1').val( data.sucursal[0].FCSUPLENTE01 );
						  $('#suplente2').val( data.sucursal[0].FCSUPLENTE02 );
						  */
						  /*
						  if(data.sucursal[0].FCTITULARSUC != ''){
							  $.ajax({
									type: "POST",
									url: baseUrl + '/catalogos/sucursales/gettitulares',
									data: { email: data.sucursal[0].FCTITULARSUC },
									dataType: 'json',
									success: function(data1) {
										//console.log(data);
										$('#titular').val( data1.empleados[0].nombre );
									}
								});
						  }
						  /*
						  if(data.sucursal[0].FCSUPLENTE01 != ''){
							  $.ajax({
									type: "POST",
									url: baseUrl + '/catalogos/sucursales/gettitulares',
									data: { email: data.sucursal[0].FCSUPLENTE01 },
									dataType: 'json',
									success: function(data2) {
										//console.log(data);
										$('#suplente1').val( data2.empleados[0].nombre );
									}
								});
						  }
						  
						  if(data.sucursal[0].FCSUPLENTE02 != ''){
							  $.ajax({
									type: "POST",
									url: baseUrl + '/catalogos/sucursales/gettitulares',
									data: { email: data.sucursal[0].FCSUPLENTE02 },
									dataType: 'json',
									success: function(data3) {
										//console.log(data);
										$('#suplente2').val( data3.empleados[0].nombre );
									}
								});
						  }
						  */
						  $('#frmAddModal').modal();
						} 
				});
			});
			
			$("#btnModalAceptar").click(function(e){
				e.preventDefault();
				$("#frmSucursal").submit();
				//alert("Guardamos la nueva sucursal"); return false;
				/*
				if( $.trim( $("#sucursal").val() ) == ""){
					$( "#sucursal" ).parent().addClass("control-group error");
					$( "#sucursal" ).parent().append( '<span class="help-inline">Nombre de sucursal requerido</span>' );
					$( "#sucursal" ).focus();
				}
				*/
				return false;
				var confirmar = confirm("¿Desea guardar?");
				
				if (confirmar) {
					$('#frmAddModal').modal('hide');
				}
			});
			
			$('#frmAddModal').on('hidden', function () {
				SucursalesIndex.resetearCampos();
			});
			/*
			$('#frmAddModal').on('show', function () {
				$('#lblFormModalSuc').html("Agregar sucursal");
			});
			*/
			// validate signup form on keyup and submit
			$("#frmSucursal").validate({
				rules: {
					sucursal: "required",
					titular: "required",
					estado: "required",
					ubicacion: "required",
					email: {
						required: true,
						email: true
					}
				},
				messages: {
					sucursal: "Ingrese el nombre de la sucursal",
					titular: "Ingrese del administrativo",
					estado: "Seleccione el estado",
					ubicacion: "Seleccione la ubicación",
					email: "Ingrese un correo electrónico válido"
				},
				submitHandler: function(form) {
				    //alert("Todo esta validado: " + $("#frmSucursal").serialize()); return false;
				    var userid = $('#userid').html();
					$.ajax({
						  url: baseUrl + '/catalogos/sucursales/setsucursal',
						  type: 'POST',
						  data: $("#frmSucursal").serialize(),
						  dataType: 'json',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  console.log(data);
							  //return false;
							  $('#frmAddModal').modal('hide');
							  
							  Menu.loadModuleMenu('catalogos', 'sucursales', 'index', '#');
							  return false;
							} 
					});
					//form.submit();
				}
			});
			
		},// End Init() 
		resetearCampos : function() {
			$("#idSucursal").val("");
			$("#sucursal").val("");
			$("#titular").val("");
			$("#idTitular").val("");
			$("#estado").val("");
			$("#suplente1").val("");
			$("#idSuplente1").val("");
			$("#ubicacion").val("");
			$("#suplente2").val("");
			$("#idSuplente2").val("");
			$("#email").val("");
			$("#coordenadas").val("");
			$("#direccion").val("");
			$('#lblFormModalSuc').html("Agregar sucursal");
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
		}
};

SucursalesIndex.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/