var SucursalesAdd = {
		init : function() {
			//alert("Hola como estas?");
			//var baseUrl = '/cuentas/public';
			
			$(".grid-title").html("Agregar Sucursal");
			
			$('#titular').typeahead({
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
				    selectedState = map[item].id;
				    //console.log(selectedState);
				    //$("#idUsuarioEntrega").val(selectedState);
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
				    selectedState = map[item].id;
				    //console.log(selectedState);
				    //$("#idUsuarioEntrega").val(selectedState);
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
				    selectedState = map[item].id;
				    //console.log(selectedState);
				    //$("#idUsuarioEntrega").val(selectedState);
				    //console.log(selectedState);
				    return item;
				}
			});
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					
					alert("Guardamos la nueva sucursal"); return false;
					
					var confirmar = confirm("¿Eliminar Usuario Entrega?");
					
					if (confirmar) {
						$('#idUsuarioEntrega').val("");
						$('#txt-quien-entrega').val("");
					}
				}
			}, "#btnGuardar");
			
		}// End Init()
};

SucursalesAdd.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/