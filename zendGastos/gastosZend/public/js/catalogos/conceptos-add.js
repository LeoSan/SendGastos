var ConceptosAdd = {
	carterasAsignadas : [],
	documentos : [],
	guiasRevision : [],
	documentosAnexo: [],
	guiasRevisionDoctosAnexo: [],
	puestos : [],
	cadenaEtapaCerryVer: [],
	cadenaEtapaObjetivoVer: [],
	cadenaEtapaInmediataVer: [],
	cadenaEtapaAbierta: [],
	unidadesNegocio : [],
	empresas : [],
	formaspago : [],
	tipoSolucionTramite : [],
	cadenaEtapaCierreGasto : [],
	statusCredito : [],
	colas : [],

	arrgEtapasTareas: [],//leonard
	arrgEtapasTareasId: [],//leonard
	arrgEtapasTareasTemp: [],//leonard

	arrgEstadoTarea: [],//leonard
	arrgEstadoTareaId: [],//leonard
	arrgEstadoTareaTemp: [],//leonard

	init : function() {
		//Procesos y Eventos
		ConceptosAdd.eventoAgregarEtapas();
		ConceptosAdd.eventoAgregarEstatusTareas();
		ConceptosAdd.eventoEliminarAutorizadorEstatusTareas();
		ConceptosAdd.eventoQuitarStatusEtapas();
		ConceptosAdd.eventoQuitarEstatusTareas();

		// Evento Front

		$('#cuentaContable').typeahead({
			items: 10,
			source: function (query, process) {
				//console.log( "Palabra: " + baseUrl + query);
				states = [];
				map = {};

				$.ajax({
					type: "POST",
					url: baseUrl + '/catalogos/conceptos/getcuentas',
					data: { cuenta: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);//return false;
						$.each(data.cuentas, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				//$("#idTitular").val(selectedState);
				//console.log(selectedState);
				return item;
			}
		});

		$('#cuentaIngresos').typeahead({
			items: 10,
			source: function (query, process) {
				//console.log( "Palabra: " + baseUrl + query);
				states = [];
				map = {};

				$.ajax({
					type: "POST",
					url: baseUrl + '/catalogos/conceptos/getcuentas',
					data: { cuenta: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);//return false;
						$.each(data.cuentas, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				//$("#idTitular").val(selectedState);
				//console.log(selectedState);
				return item;
			}
		});

		$('#areaConcetradora').typeahead({
			items: 10,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';

				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAreaConcetradora").val(selectedState);
				//console.log(selectedState);
				$('#areaConcetradora').attr("readonly", true);
				return item;
			}
		});

		$('#nombreJefeInmediato').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selTipoJefeInmediato").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selTipoJefeInmediato").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
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
				$("#idJefeInmediato").val(selectedState);
				$("#validaNombreJefeInmediato").remove();
				//console.log(selectedState);
				return item;
			}
		});

		$('#nombreNoFact1').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selTipoNoFact1").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selTipoNoFact1").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
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
				$("#idNoFact1").val(selectedState);
				//$("#validaNombreJefeInmediato").remove();
				//console.log(selectedState);
				return item;
			}
		});

		$('#nombreNoFact2').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selTipoNoFact2").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selTipoNoFact2").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
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
				$("#idNoFact2").val(selectedState);
				//$("#validaNombreJefeInmediato").remove();
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorEtapaCerrada1').typeahead({
			items: 15,
			source: function (query, process) {
				if( $.trim($("#cadenaEtapaCerryVer").val() ) == "" && $.trim($("#cadenaEtapaAbierta").val() ) == "" ){
					alert("Debe agregar las estapas cerradas y verificadas");
					$('#autorizadorEtapaCerrada1').val("");
					$('#idAautorizadorEtapaCerrada1').val("");
					$("#cadenaEtapaCerryVer").focus();
					return false;
				}

				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selAutorizaEtapaCerrada1").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selAutorizaEtapaCerrada1").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorEtapaCerrada1").val(selectedState);
				$('#autorizadorEtapaCerrada1').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorExcedenteGasto1').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selExcedenteGasto1").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selExcedenteGasto1").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorExcedenteGasto1").val(selectedState);
				$('#autorizadorExcedenteGasto1').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorExcedenteGasto2').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selExcedenteGasto2").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selExcedenteGasto2").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorExcedenteGasto2").val(selectedState);
				$('#autorizadorExcedenteGasto2').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorTipoUmbralMonto1').typeahead({
			items: 15,
			source: function (query, process) {
				console.log(query);
				if( $.trim($("#montoUmbral1").val() ) == "" && $.trim($("#porCentajeUmbralDel1").val() ) == "" ){
					$('#autorizadorTipoUmbralMonto1').val("");
					$('#idAutorizadorTipoUmbralMonto1').val("");
					if( $("#selTipoUmbral").val() == "1" ){
						alert("Debe agregar el monto 01");
						$("#montoUmbral1").focus();
					}else{
						alert("Debe agregar el porcentaje 01");
						$("#porCentajeUmbralDel1").focus();
					}
					return false;
				}

				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selTipoUmbralMonto1").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selTipoUmbralMonto1").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
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
				$("#idAutorizadorTipoUmbralMonto1").val(selectedState);
				$('#autorizadorTipoUmbralMonto1').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorTipoUmbralMonto2').typeahead({
			items: 15,
			source: function (query, process) {
				if( $.trim($("#montoUmbral2").val() ) == "" && $.trim($("#porCentajeUmbralDel2").val() ) == "" ){
					$('#autorizadorTipoUmbralMonto2').val("");
					$('#idAutorizadorTipoUmbralMonto2').val("");
					if( $("#selTipoUmbral").val() == "1" ){
						alert("Debe agregar el monto 02");
						$("#montoUmbral2").focus();
					}else{
						alert("Debe agregar el porcentaje 02");
						$("#porCentajeUmbralDel2").focus();
					}
					return false;
				}

				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selTipoUmbralMonto2").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selTipoUmbralMonto2").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorTipoUmbralMonto2").val(selectedState);
				$('#autorizadorTipoUmbralMonto2').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorTipoUmbralMonto3').typeahead({
			items: 15,
			source: function (query, process) {
				if( $.trim($("#montoUmbral3").val() ) == "" && $.trim($("#porCentajeUmbralDel3").val() ) == "" ){
					$('#autorizadorTipoUmbralMonto3').val("");
					$('#idAutorizadorTipoUmbralMonto3').val("");
					if( $("#selTipoUmbral").val() == "1" ){
						alert("Debe agregar el monto 03");
						$("#montoUmbral3").focus();
					}else{
						alert("Debe agregar el porcentaje 03");
						$("#porCentajeUmbralDel3").focus();
					}
					return false;
				}

				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selTipoUmbralMonto3").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selTipoUmbralMonto3").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorTipoUmbralMonto3").val(selectedState);
				$('#autorizadorTipoUmbralMonto3').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorTipoUmbralMonto3a').typeahead({
			items: 15,
			source: function (query, process) {
				if( $.trim($("#montoUmbral3").val() ) == "" && $.trim($("#porCentajeUmbralDel3").val() ) == "" ){
					$('#autorizadorTipoUmbralMonto3a').val("");
					$('#idAutorizadorTipoUmbralMonto3a').val("");
					if( $("#selTipoUmbral").val() == "1" ){
						alert("Debe agregar el monto 03");
						$("#montoUmbral3").focus();
					}else{
						alert("Debe agregar el porcentaje 03");
						$("#porCentajeUmbralDel3").focus();
					}
					return false;
				}

				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selTipoUmbralMonto3a").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selTipoUmbralMonto3a").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorTipoUmbralMonto3a").val(selectedState);
				$('#autorizadorTipoUmbralMonto3a').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorTipoUmbralMonto3b').typeahead({
			items: 15,
			source: function (query, process) {
				if( $.trim($("#montoUmbral3").val() ) == "" && $.trim($("#porCentajeUmbralDel3").val() ) == "" ){
					$('#autorizadorTipoUmbralMonto3b').val("");
					$('#idAutorizadorTipoUmbralMonto3b').val("");
					if( $("#selTipoUmbral").val() == "1" ){
						alert("Debe agregar el monto 03");
						$("#montoUmbral3").focus();
					}else{
						alert("Debe agregar el porcentaje 03");
						$("#porCentajeUmbralDel3").focus();
					}
					return false;
				}

				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selTipoUmbralMonto3b").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selTipoUmbralMonto3b").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorTipoUmbralMonto3b").val(selectedState);
				$('#autorizadorTipoUmbralMonto3b').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizaVerificadorFinal1').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selAutorizaVerificadorFinal1").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selAutorizaVerificadorFinal1").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizaVerificadorFinal1").val(selectedState);
				$('#autorizaVerificadorFinal1').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorPagosDobles2').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selAutorizaPagosDobles2").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selAutorizaPagosDobles2").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorPagosDobles2").val(selectedState);
				$('#autorizadorPagosDobles2').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorCredLiquidados2').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selAutorizaCredLiquidados2").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selAutorizaCredLiquidados1").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorCredLiquidados2").val(selectedState);
				$('#autorizadorCredLiquidados2').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorCredLiquidados1').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selAutorizaCredLiquidados1").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selAutorizaCredLiquidados1").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorCredLiquidados1").val(selectedState);
				$('#autorizadorCredLiquidados1').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorEtapaAbierta2').typeahead({
			items: 15,
			source: function (query, process) {
				if( $.trim($("#cadenaEtapaAbierta").val() ) == "" &&  $.trim($("#cadenaEtapaCerryVer").val() ) == "" ){
					alert("Debe agregar las estapas abiertas");
					$('#autorizadorEtapaAbierta2').val("");
					$('#idAutorizadorEtapaAbierta2').val("");
					$("#cadenaEtapaAbierta").focus();
					return false;
				}

				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selAutorizaEtapaAbierta2").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selAutorizaEtapaAbierta2").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorEtapaAbierta2").val(selectedState);
				$('#autorizadorEtapaAbierta2').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizadorPagosDobles1').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selAutorizaPagosDobles1").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selAutorizaPagosDobles1").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizadorPagosDobles1").val(selectedState);
				$('#autorizadorPagosDobles1').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizaVerificadorFinal3').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selAutorizaVerificadorFinal3").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selAutorizaVerificadorFinal3").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizaVerificadorFinal3").val(selectedState);
				$('#autorizaVerificadorFinal3').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$('#autorizaVerificadorFinal2').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selAutorizaVerificadorFinal2").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selAutorizaVerificadorFinal2").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						//console.log(data);
						$.each(data.empleados, function (i, state) {
							//alert(state.NMNOMBRE);return false;
							//console.log(state);
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
				$("#idAutorizaVerificadorFinal2").val(selectedState);
				$('#autorizaVerificadorFinal2').attr("readonly", true);
				//console.log(selectedState);
				return item;
			}
		});

		$(".grid-title").html("Agregar nuevo concepto");

		$("#frmAddConceptos #userid").val( $.trim( $("#noEmpleado").html()) );

		//Desabilitamos el copy paste
		$(document).keydown(function(event) {
			if (event.ctrlKey==true && (event.which == '118' || event.which == '86')) {
				event.preventDefault();
			}
		});
		$(document).bind("contextmenu", function(e){
			e.preventDefault();
		});

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				var idcategoria = $(this).val();
				var url = baseUrl + "/catalogos/subcategorias/getsubcategorias";

				if(!idcategoria){
					$( "#subcategoria" ).find('option').remove().end();
					$( "#subcategoria" ).append('<option value="">- Seleccione -</option>');
				}

				$.ajax({
					type: "POST",
					url: url,
					data: { id: idcategoria },
					dataType: 'json',
					success: function(data) {
						$( "#subcategoria" ).find('option').remove().end();
						$( "#subcategoria" ).append('<option value="">- Seleccione -</option>');
						$.each(data.categoria, function (i, item) {
							$( "#subcategoria" ).append('<option value="' + item.IDCUENTACAT + '">' + item.NMDESCRIP + '</option>');
							//console.log(item.NMDESCRIP);
						});
					}
				});
			}
		}, "#categoria");

		$( document ).on({
			click : function( e ) {
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
			}
		}, "#btnAddConcepto");

		$( document ).on({
			click : function( e ) {
				//e.preventDefault();

				if( $(this).is(':checked') ){

					$.validator.addClassRules("areaConcetradora", {
						required: true
					});

					$("#areaConcetradora").removeAttr("disabled");
					$("#areaConcetradora").focus();
				} else {
					$.validator.addClassRules("areaConcetradora", {
						required: false
					});

					$("#areaConcetradora").attr("disabled", "disabled");
					$("#idAreaConcetradora").val("");
					$("#areaConcetradora").val("");
				}
			}
		}, "#fOperativo");

		$("#removeAreaConcetradora").click( function( e ){
			var res = confirm("¿Eliminar Área concentradora?");
			if(res){
				$("#areaConcetradora").val("");
				$("#idAreaConcetradora").val("");
				$("#areaConcetradora").removeAttr("readonly");
				$("#areaConcetradora").focus();
			}
		});

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				if( $(this).is(':checked') ) {
					$('#valMaxAnticipo').removeAttr("readonly");
					$('#valMaxAnticipo').attr("placeholder", "Valor máximo anticipo");
					$('#valMaxAnticipo').val("100");
					$('#valMaxAnticipo').focus();
				} else {
					$('#valMaxAnticipo').val("0");
					$('#valMaxAnticipo').attr("readonly", "readonly");
					$('#valMaxAnticipo').attr("placeholder", "Valor máximo anticipo");
				}
			}
		}, "#foAnticipo");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				if( $(this).is(':checked') ) {
					$('#areaConcetradora').removeAttr("disabled");
					$('#areaConcetradora').attr("placeholder", "Titular o área concentradora");
					$('#areaConcetradora').focus();
					$("#divReqImporteFacturacion").show();
					$("#tplTipoSolucionTramiteTitle").show();
					$("#tplTipoSolucionTramite").show();
				} else {
					$('#areaConcetradora').val("");
					$('#idAreaConcetradora').val("");
					$('#areaConcetradora').attr("disabled", "disabled");
					$('#areaConcetradora').attr("placeholder", "Titular o área concentradora");
					$("#divReqImporteFacturacion").hide();
					$("input[name=reqImporteFacturacion]").attr('checked', false);
					$("#tplTipoSolucionTramiteTitle").hide();
					$("#tplTipoSolucionTramite").hide();

					$("#detalleSolucionTramite option").each(function(){
						$("<option value='" + $(this).val() + "'>" + $(this).text() + "</option>").appendTo("#tipoSolucionTramite");
						ConceptosAdd.tipoSolucionTramite[$(this).val()] = null;
					});
					$("#detalleSolucionTramite option").remove();
				}

			}
		}, "#foTramite");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				$('#nombreJefeInmediato').val("");
				$('#idJefeInmediato').val("");
				if( $(this).val() == 'S' || $(this).val() == 'N' ) {
					$('#nombreJefeInmediato').attr("readonly", "readonly");
					$('#selTipoJefeInmediato').prop("disabled", true);
					$('#nombreJefeInmediato').attr("placeholder", "Jefe inmediato");
					$("#validaNombreJefeInmediato").remove();
				} else {
					$('#nombreJefeInmediato').removeAttr("readonly");
					$('#selTipoJefeInmediato').prop("disabled", false);
					$('#nombreJefeInmediato').attr("placeholder", "Buscar persona que autorize");
					$('#nombreJefeInmediato').focus();
				}

			}
		}, "#selReqAutoriza");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				if( $(this).val() == 'N' ) {
					$('#nombreNoFact1').attr("readonly", "readonly");
					$('#selTipoNoFact1').prop("disabled", true);
					$('#nombreNoFact1').attr("placeholder", "Sin autorizador");
					$('#nombreNoFact1').val("");
					$('#selTipoNoFact1').val("");
					$('#idNoFact1').val("");
					//$("#validaNombreJefeInmediato").remove();

					$('#nombreNoFact2').attr("readonly", "readonly");
					$('#selTipoNoFact2').prop("disabled", true);
					$('#nombreNoFact2').attr("placeholder", "Sin autorizador");
					$('#nombreNoFact2').val("");
					$('#selTipoNoFact2').val("");
					$('#idNoFact2').val("");
				} else {
					$('#nombreNoFact1').removeAttr("readonly");
					$('#selTipoNoFact1').prop("disabled", false);
					$('#nombreNoFact1').attr("placeholder", "Buscar persona que autorize");
					$('#nombreNoFact1').focus();

					$('#nombreNoFact2').removeAttr("readonly");
					$('#selTipoNoFact2').prop("disabled", false);
					$('#nombreNoFact2').attr("placeholder", "Buscar persona que autorize");
				}

			}
		}, "#selReqAutorizaNoFact");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				if( $(this).val() == 'PM' ) {
					$('#nombreNoFact1').attr("readonly", "readonly");
					$('#nombreNoFact1').attr("placeholder", "El Project Manager");
					$('#nombreNoFact1').val("");
					$('#idNoFact1').val("");
				} else {
					$('#nombreNoFact1').removeAttr("readonly");
					$('#nombreNoFact1').attr("placeholder", "Buscar persona que autorize");
					$('#nombreNoFact1').val("");
					$('#idNoFact1').val("");
					$('#nombreNoFact1').focus();
				}
			}
		}, "#selTipoNoFact1");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				if( $(this).val() == '' ) {
					$('#nombreNoFact2').attr("readonly", "readonly");
					$('#nombreNoFact2').attr("placeholder", "Sin autorizador");
					$('#nombreNoFact2').val("");
					$('#idNoFact2').val("");
				} else {
					$('#nombreNoFact2').removeAttr("readonly");
					$('#nombreNoFact2').attr("placeholder", "Buscar persona que autorize");
					$('#nombreNoFact2').val("");
					$('#idNoFact2').val("");
					$('#nombreNoFact2').focus();
				}
			}
		}, "#selTipoNoFact2");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				if( $(this).val() == '1' ) {
					$('#montoUmbral1').removeAttr("disabled");
					$('#montoUmbral2').removeAttr("disabled");
					$('#montoUmbral3').removeAttr("disabled");

					$('#porCentajeUmbralDel1').attr("disabled", "disabled");
					$('#porCentajeUmbralAl1').attr("disabled", "disabled");
					$('#porCentajeUmbralDel2').attr("disabled", "disabled");
					$('#porCentajeUmbralAl2').attr("disabled", "disabled");
					$('#porCentajeUmbralDel3').attr("disabled", "disabled");
					$('#porCentajeUmbralAl3').attr("disabled", "disabled");

					$('#porCentajeUmbralDel1').val("");
					$('#porCentajeUmbralAl1').val("");
					$('#porCentajeUmbralDel2').val("");
					$('#porCentajeUmbralAl2').val("");
					$('#porCentajeUmbralDel3').val("");
					$('#porCentajeUmbralAl3').val("");

					$('#descripcionUmbral1').attr("disabled", "disabled");
					$('#descripcionUmbral2').attr("disabled", "disabled");
					$('#descripcionUmbral3').attr("disabled", "disabled");
					$('#descripcionUmbral1').val("");
					$('#descripcionUmbral2').val("");
					$('#descripcionUmbral3').val("");

					$('#montoUmbral1').focus();
				} else {
					$('#porCentajeUmbralDel1').removeAttr("disabled");
					$('#descripcionUmbral1').removeAttr("disabled");
					$('#porCentajeUmbralDel2').removeAttr("disabled");
					$('#descripcionUmbral2').removeAttr("disabled");
					$('#porCentajeUmbralDel3').removeAttr("disabled");
					$('#descripcionUmbral3').removeAttr("disabled");

					$('#montoUmbral1').attr("disabled", "disabled");
					$('#montoUmbral2').attr("disabled", "disabled");
					$('#montoUmbral3').attr("disabled", "disabled");

					$('#montoUmbral1').val("");
					$('#montoUmbral2').val("");
					$('#montoUmbral3').val("");

					$('#porCentajeUmbralDel1').focus();
				}
				$("#autorizadorTipoUmbralMonto1").val("");
				$("#autorizadorTipoUmbralMonto2").val("");
				$("#autorizadorTipoUmbralMonto3").val("");
				$("#autorizadorTipoUmbralMonto3b").val("");
				$("#autorizadorTipoUmbralMonto3c").val("");
				$("#idAutorizadorTipoUmbralMonto1").val("");
				$("#idAutorizadorTipoUmbralMonto2").val("");
				$("#idAutorizadorTipoUmbralMonto3").val("");
				$("#idAutorizadorTipoUmbralMonto3b").val("");
				$("#idAutorizadorTipoUmbralMonto3c").val("");
			}
		}, "#selTipoUmbral");

		$( document ).on({
			change : function( e ) {
				$('#porCentajeUmbralAl1').val( $('#porCentajeUmbralDel1').val() );
			}
		}, "#porCentajeUmbralDel1");

		$( document ).on({
			change : function( e ) {
				$('#porCentajeUmbralAl2').val( $('#porCentajeUmbralDel2').val() );
			}
		}, "#porCentajeUmbralDel2");

		$( document ).on({
			change : function( e ) {
				$('#porCentajeUmbralAl3').val( $('#porCentajeUmbralDel3').val() );
			}
		}, "#porCentajeUmbralDel3");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#nombreJefeInmediato').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#nombreJefeInmediato').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#nombreJefeInmediato').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#nombreJefeInmediato').removeAttr("readonly");
				$('#nombreJefeInmediato').val("");
				$('#nombreJefeInmediato').focus();
			}
		}, "#selTipoJefeInmediato");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorTipoUmbralMonto1').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorTipoUmbralMonto1').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorTipoUmbralMonto1').attr('placeholder' , "Buscar por Puesto..." );
				}
				$('#autorizadorTipoUmbralMonto1').removeAttr("readonly");
				$('#autorizadorTipoUmbralMonto1').val("");
				$('#autorizadorTipoUmbralMonto1').focus();
			}
		}, "#selTipoUmbralMonto1");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorTipoUmbralMonto2').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorTipoUmbralMonto2').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorTipoUmbralMonto2').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorTipoUmbralMonto2').removeAttr("readonly");
				$('#autorizadorTipoUmbralMonto2').val("");
				$('#autorizadorTipoUmbralMonto2').focus();
			}
		}, "#selTipoUmbralMonto2");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorTipoUmbralMonto3').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorTipoUmbralMonto3').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorTipoUmbralMonto3').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorTipoUmbralMonto3').removeAttr("readonly");
				$('#autorizadorTipoUmbralMonto3').val("");
				$('#autorizadorTipoUmbralMonto3').focus();
			}
		}, "#selTipoUmbralMonto3");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorTipoUmbralMonto3a').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorTipoUmbralMonto3a').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorTipoUmbralMonto3a').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorTipoUmbralMonto3a').removeAttr("readonly");
				$('#autorizadorTipoUmbralMonto3a').val("");
				$('#autorizadorTipoUmbralMonto3a').focus();
			}
		}, "#selTipoUmbralMonto3a");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorTipoUmbralMonto3b').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorTipoUmbralMonto3b').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorTipoUmbralMonto3b').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorTipoUmbralMonto3b').removeAttr("readonly");
				$('#autorizadorTipoUmbralMonto3b').val("");
				$('#autorizadorTipoUmbralMonto3b').focus();
			}
		}, "#selTipoUmbralMonto3b");

		//Autorizaciones Excedentes del gasto
		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorExcedenteGasto1').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorExcedenteGasto1').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorExcedenteGasto1').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorExcedenteGasto1').val("");
				$('#idAutorizadorExcedenteGasto1').val("");
				$('#autorizadorExcedenteGasto1').removeAttr("readonly");
				$('#autorizadorExcedenteGasto1').focus();
			}
		}, "#selExcedenteGasto1");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorExcedenteGasto2').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorExcedenteGasto2').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorExcedenteGasto2').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorExcedenteGasto2').val("");
				$('#idAutorizadorExcedenteGasto2').val("");
				$('#autorizadorExcedenteGasto2').removeAttr("readonly");
				$('#autorizadorExcedenteGasto2').focus();
			}
		}, "#selExcedenteGasto2");

		$("#removeAutorizadorExcedenteGasto1").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 1?");
			if(res){
				$("#autorizadorExcedenteGasto1").val("");
				$("#idAutorizadorExcedenteGasto1").val("");
				$("#autorizadorExcedenteGasto1").removeAttr("readonly");
				$("#autorizadorExcedenteGasto1").focus();
			}
		});

		$("#removeAutorizadorExcedenteGasto2").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 2?");
			if(res){
				$("#autorizadorExcedenteGasto2").val("");
				$("#idAutorizadorExcedenteGasto2").val("");
				$("#autorizadorExcedenteGasto2").removeAttr("readonly");
				$("#autorizadorExcedenteGasto2").focus();
			}
		});

		//Etapa cerrada y certificada
		$("#addEtapaCerrada").click( function(e){
			e.preventDefault();
			if( $('#etapaCerryVer').val() == "-1" ){
				$('#etapaCerryVer').focus();
				return false;
			}

			ConceptosAdd.cadenaEtapaCerryVer[$('#etapaCerryVer').val()] = $('#etapaCerryVer').val();
			var cadena = '';
			for (x in ConceptosAdd.cadenaEtapaCerryVer) {
				if (ConceptosAdd.cadenaEtapaCerryVer[x]) {
					if(cadena == ''){
						cadena = ConceptosAdd.cadenaEtapaCerryVer[x];
					} else {
						cadena += '|' + ConceptosAdd.cadenaEtapaCerryVer[x];
					}
				}
			}
			//console.log(cadena);
			//console.log($('#cadenaEtapaCerryVer').val());
			$('#cadenaEtapaCerryVer').val( cadena );

			if ( $('#cadenaEtapaCerryVer') != "" ){
				if( $("#autorizadorEtapaCerrada1").attr("disabled") == "disabled" ){
					$("#autorizadorEtapaCerrada1").attr("disabled", false);
				}

			} else {
				$( "#autorizadorEtapaCerrada1" ).rules( "remove", "required" );
			}

			$('#etapaCerryVer').val("");
			$('#etapaCerryVer').focus();
			return false;
		});

		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				ConceptosAdd.cadenaEtapaCerryVer = [];
				$('#cadenaEtapaCerryVer').val( "" );

				if( $("#cadenaEtapaCerryVer").val() == "" &&
					$("#cadenaEtapaAbierta").val() == "" &&
					$("#codigoAccionGE").val() == "" &&
					$("#codigoResultadoGE").val() == ""){
					$("#autorizadorEtapaCerrada1").attr("disabled", "disabled");
				}

			}
		}, "#deleteEtapaCerrada");

		//Etapa Objetivo
		$("#addEtapaObjetivo").click( function(e){
			e.preventDefault();
			if( $('#etapaObjetivoVer').val() == "-1" ){
				$('#etapaObjetivoVer').focus();
				return false;
			}
			ConceptosAdd.cadenaEtapaObjetivoVer[$('#etapaObjetivoVer').val()] = $('#etapaObjetivoVer').val();
			var cadena = '';
			for (x in ConceptosAdd.cadenaEtapaObjetivoVer) {
				if (ConceptosAdd.cadenaEtapaObjetivoVer[x]) {
					if(cadena == ''){
						cadena = ConceptosAdd.cadenaEtapaObjetivoVer[x];
					} else {
						cadena += '|' + ConceptosAdd.cadenaEtapaObjetivoVer[x];
					}
				}
			}
			//Asignación Valores
			$('#cadenaEtapaObjetivoVer').val( cadena );
			$('#etapaObjetivoVer').val("");
			$('#etapaObjetivoVer').focus();
			return false;
		});

		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				ConceptosAdd.cadenaEtapaObjetivoVer = [];
				$('#cadenaEtapaObjetivoVer').val( "" );
			}
		}, "#deleteEtapaObjetivo");

		//Etapa Inmediata
		$("#addEtapaInmediata").click( function(e){
			e.preventDefault();
			if( $('#etapaInmediataVer').val() == "-1" ){
				$('#etapaInmediataVer').focus();
				return false;
			}
			ConceptosAdd.cadenaEtapaInmediataVer[$('#etapaInmediataVer').val()] = $('#etapaInmediataVer').val();
			var cadena = '';
			for (x in ConceptosAdd.cadenaEtapaInmediataVer) {
				if (ConceptosAdd.cadenaEtapaInmediataVer[x]) {
					if(cadena == ''){
						cadena = ConceptosAdd.cadenaEtapaInmediataVer[x];
					} else {
						cadena += '|' + ConceptosAdd.cadenaEtapaInmediataVer[x];
					}
				}
			}
			//Asignación Valores
			$('#cadenaEtapaInmediataVer').val( cadena );
			$('#etapaInmediataVer').val("");
			$('#etapaInmediataVer').focus();
			return false;
		});

		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				ConceptosAdd.cadenaEtapaInmediataVer = [];
				$('#cadenaEtapaInmediataVer').val( "" );
			}
		}, "#deleteEtapaInmediata");

		//Etapa Cierre Gasto
		$("#addEtapaCierreGasto").click( function(e){
			e.preventDefault();
			if( $('#etapaCierreGasto').val() == "-1" ){
				$('#etapaCierreGasto').focus();
				return false;
			}

			ConceptosAdd.cadenaEtapaCierreGasto[$('#etapaCierreGasto').val()] = $('#etapaCierreGasto').val();
			var cadena = '';
			for (x in ConceptosAdd.cadenaEtapaCierreGasto) {
				if (ConceptosAdd.cadenaEtapaCierreGasto[x]) {
					if(cadena == ''){
						cadena = ConceptosAdd.cadenaEtapaCierreGasto[x];
					} else {
						cadena += '|' + ConceptosAdd.cadenaEtapaCierreGasto[x];
					}
				}
			}
			//console.log(cadena);
			//console.log($('#cadenaEtapaCerryVer').val());
			$('#cadenaEtapaCierreGasto').val( cadena );

			$('#etapaCierreGasto').val("");
			$('#etapaCierreGasto').focus();
			return false;
		});

		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				ConceptosAdd.cadenaEtapaCierreGasto = [];
				$('#cadenaEtapaCierreGasto').val( "" );
			}
		}, "#deleteEtapaCierreGasto");

		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				if( $(this).val() == "S" ){
					$("#selAutorizaCredLiquidados1").removeAttr("disabled");
					$("#autorizadorCredLiquidados1").removeAttr("readonly");
					$("#selAutorizaCredLiquidados2").removeAttr("disabled");
					$("#autorizadorCredLiquidados2").removeAttr("readonly");
				} else {
					$("#selAutorizaCredLiquidados1").attr("disabled", "disabled");
					$("#autorizadorCredLiquidados1").attr("readonly", "readonly");
					$("#selAutorizaCredLiquidados2").attr("disabled", "disabled");
					$("#autorizadorCredLiquidados2").attr("readonly", "readonly");

					$("#autorizadorCredLiquidados1").val("");
					$("#autorizadorCredLiquidados2").val("");
					$("#idAutorizadorCredLiquidados1").val("");
					$("#idAutorizadorCredLiquidados2").val("");
				}
			}
		}, "#selCredLiquidados");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorEtapaCerrada1').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorEtapaCerrada1').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorEtapaCerrada1').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorEtapaCerrada1').val("");
				$('#idAutorizadorEtapaCerrada1').val("");
				$('#autorizadorEtapaCerrada1').removeAttr("disabled");
				$('#autorizadorEtapaCerrada1').removeAttr("readonly");
				$('#autorizadorEtapaCerrada1').focus();
			}
		}, "#selAutorizaEtapaCerrada1");

		//Etapa abierta
		$("#addEtapaAbierta").click(function(e){
			e.preventDefault();
			if( $('#etapaAbierta').val() == "-1" ){
				$('#etapaAbierta').focus();
				return false;
			}

			ConceptosAdd.cadenaEtapaAbierta[$('#etapaAbierta').val()] = $('#etapaAbierta').val();

			var cadena = '';
			for (x in ConceptosAdd.cadenaEtapaAbierta) {
				if (ConceptosAdd.cadenaEtapaAbierta[x]) {
					if(cadena == ''){
						cadena = ConceptosAdd.cadenaEtapaAbierta[x];
					} else {
						cadena += '|' + ConceptosAdd.cadenaEtapaAbierta[x];
					}
				}
			}

			$('#cadenaEtapaAbierta').val(cadena);

			if ( $('#cadenaEtapaAbierta') != "" ){
				if( $("#autorizadorEtapaCerrada1").attr("disabled") == "disabled" ){
					$("#autorizadorEtapaCerrada1").attr("disabled", false);
				}
			} else {
				$( "#autorizadorEtapaCerrada1" ).rules( "remove", "required" );
			}

			$('#etapaAbierta').val("");
			$('#etapaAbierta').focus();
			return false;
		});

		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				ConceptosAdd.cadenaEtapaAbierta = [];
				$('#cadenaEtapaAbierta').val( "" );

				if( $("#cadenaEtapaCerryVer").val() == "" &&
					$("#cadenaEtapaAbierta").val() == "" &&
					$("#codigoAccionGE").val() == "" &&
					$("#codigoResultadoGE").val() == ""){
					$("#autorizadorEtapaCerrada1").attr("disabled", "disabled");
				}
			}
		}, "#deleteEtapaAbierta");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				$('#autorizadorEtapaAbierta1').val("");
			}
		}, "#selAutorizaEtapaAbierta1");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorEtapaAbierta2').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorEtapaAbierta2').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorEtapaAbierta2').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorEtapaAbierta2').val("");
				$('#idAutorizadorEtapaAbierta2').val("");
				$('#autorizadorEtapaAbierta2').removeAttr("readonly");
				$('#autorizadorEtapaAbierta2').focus();
			}
		}, "#selAutorizaEtapaAbierta2");

		$( document ).on({
			change : function( e ) {
				if( $("#cadenaEtapaCerryVer").val() == "" &&
					$("#cadenaEtapaAbierta").val() == "" &&
					$("#codigoAccionGE").val() == "" &&
					$("#codigoResultadoGE").val() == ""){
					$("#autorizadorEtapaCerrada1").attr("disabled", "disabled");
				} else {
					$("#autorizadorEtapaCerrada1").removeAttr("disabled");
				}
			}
		}, "#codigoAccionGE");

		$( document ).on({
			change : function( e ) {
				if( $("#cadenaEtapaCerryVer").val() == "" &&
					$("#cadenaEtapaAbierta").val() == "" &&
					$("#codigoAccionGE").val() == "" &&
					$("#codigoResultadoGE").val() == ""){
					$("#autorizadorEtapaCerrada1").attr("disabled", "disabled");
				} else {
					$("#autorizadorEtapaCerrada1").removeAttr("disabled");
				}
			}
		}, "#codigoResultadoGE");

		//Creditos Liquidados
		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorCredLiquidados1').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorCredLiquidados1').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorCredLiquidados1').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorCredLiquidados1').val("");
				$('#idAutorizadorCredLiquidados1').val("");
				$('#autorizadorCredLiquidados1').removeAttr("readonly");
				$('#autorizadorCredLiquidados1').focus();
			}
		}, "#selAutorizaCredLiquidados1");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorCredLiquidados2').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorCredLiquidados2').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorCredLiquidados2').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorCredLiquidados2').val("");
				$('#idAutorizadorCredLiquidados2').val("");
				$('#autorizadorCredLiquidados2').removeAttr("readonly");
				$('#autorizadorCredLiquidados2').focus();
			}
		}, "#selAutorizaCredLiquidados2");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				$('#autorizadorPagosDobles1').val("");
			}
		}, "#selAutorizaPagosDobles1");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				$('#autorizadorPagosDobles1').val("");
			}
		}, "#selAutorizaPagosDobles1");

		//Pagos dobles
		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorPagosDobles1').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorPagosDobles1').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorPagosDobles1').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorPagosDobles1').val("");
				$('#idAutorizadorPagosDobles1').val("");
				$('#autorizadorPagosDobles1').removeAttr("readonly");
				$('#autorizadorPagosDobles1').focus();
			}
		}, "#selAutorizaPagosDobles1");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorPagosDobles2').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorPagosDobles2').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizadorPagosDobles2').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorPagosDobles2').val("");
				$('#idAutorizadorPagosDobles2').val("");
				$('#autorizadorPagosDobles2').removeAttr("readonly");
				$('#autorizadorPagosDobles2').focus();
			}
		}, "#selAutorizaPagosDobles2");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizaVerificadorFinal1').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizaVerificadorFinal1').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizaVerificadorFinal1').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizaVerificadorFinal1').val("");
				$('#idAutorizaVerificadorFinal1').val("");
				$('#autorizaVerificadorFinal1').removeAttr("readonly");
				$('#autorizaVerificadorFinal1').focus();
			}
		}, "#selAutorizaVerificadorFinal1");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizaVerificadorFinal2').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizaVerificadorFinal2').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizaVerificadorFinal2').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizaVerificadorFinal2').val("");
				$('#idAutorizaVerificadorFinal2').val("");
				$('#autorizaVerificadorFinal2').removeAttr("readonly");
				$('#autorizaVerificadorFinal2').focus();
			}
		}, "#selAutorizaVerificadorFinal2");

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizaVerificadorFinal3').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizaVerificadorFinal3').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#autorizaVerificadorFinal3').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizaVerificadorFinal3').val("");
				$('#idAutorizaVerificadorFinal3').val("");
				$('#autorizaVerificadorFinal3').removeAttr("readonly");
				$('#autorizaVerificadorFinal3').focus();
			}
		}, "#selAutorizaVerificadorFinal3");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				$('#autorizadorPagosDobles1').val("");
			}
		}, "#selAutorizaPagosDobles1");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				$('#autorizadorPagosDobles2').val("");
			}
		}, "#selAutorizaPagosDobles2");

		//Verificador final

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				$('#autorizaVerificadorFinal1').val("");
			}
		}, "#selAutorizaVerificadorFinal1");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				$('#autorizaVerificadorFinal2').val("");
			}
		}, "#selAutorizaVerificadorFinal2");

		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				$('#autorizaVerificadorFinal3').val("");
			}
		}, "#selAutorizaVerificadorFinal3");

		$("#btnAgregarStatusCredito").click(function( e ){
			e.preventDefault();
			if( $('#statusCredito option').is(':selected') == false ){
				alert("Seleccione el status del Crédito.");
				$('#statusCredito').focus();
				return false;
			}

			$("#statusCredito option:selected").each(function(){
				ConceptosAdd.statusCredito[$(this).val()] = $(this).text();
			});

			$("#statusCredito option:selected").remove();

			$('#detalleStatusCredito').empty();
			for (var elemento in ConceptosAdd.statusCredito){
				if(ConceptosAdd.statusCredito[elemento]){
					$('#detalleStatusCredito').append($('<option>', {
						value: elemento,
						text: ConceptosAdd.statusCredito[elemento]
					}));
				}
			}
			ConceptosAdd.validarStatusCredito();
			return false;
		});

		$("#btnAgregarColas").click(function( e ){
			e.preventDefault();
			if( $('#colas option').is(':selected') == false ){
				alert("Seleccione la cola de la lista.");
				$('#colas').focus();
				return false;
			}

			$("#colas option:selected").each(function(){
				ConceptosAdd.colas[$(this).val()] = $(this).text();
			});

			$("#colas option:selected").remove();

			$('#detalleColas').empty();
			for (var elemento in ConceptosAdd.colas){
				if(ConceptosAdd.colas[elemento]){
					$('#detalleColas').append($('<option>', {
						value: elemento,
						text: ConceptosAdd.colas[elemento]
					}));
				}
			}
			ConceptosAdd.validarStatusCredito();
			return false;
		});

		$("#btnQuitarStatusCredito").click(function( e ){
			e.preventDefault();

			var haySeleccionados = false;
			$('#detalleStatusCredito option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar el Status a eliminar.");
				return false;
			}

			$("#detalleStatusCredito option:selected").each(function(){
				//ConceptosAdd.colas[$(this).val()] = $(this).text();
				$("<option value='" + ConceptosAdd.statusCredito[$(this).val()] + "'>" + $(this).text() + "</option>").appendTo("#statusCredito");
				ConceptosAdd.statusCredito[$(this).val()] = null;
			});
			ConceptosAdd.validarStatusCredito();
			$("#detalleStatusCredito option:selected").remove();
		});

		$("#btnQuitarColas").click(function( e ){
			e.preventDefault();

			var haySeleccionados = false;
			$('#detalleColas option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar la cola a eliminar.");
				return false;
			}

			$("#detalleColas option:selected").each(function(){
				//ConceptosAdd.colas[$(this).val()] = $(this).text();
				$("<option value='" + ConceptosAdd.colas[$(this).val()] + "'>" + $(this).text() + "</option>").appendTo("#colas");
				ConceptosAdd.colas[$(this).val()] = null;
			});
			ConceptosAdd.validarStatusCredito();
			$("#detalleColas option:selected").remove();
		});

		//Boton Carteras Asignadas Al Gasto
		$("#btnAgregarCarterasAsignadasAlGasto").click(function( e ){
			e.preventDefault();
			if( $('#cartera option').is(':selected') == false ){
				alert("Seleccione la cartera a agregar.");
				$('#cartera').focus();
				return false;
			}

			if( $("#tipoAsigGasto").val() == "" ){
				alert("Seleccione el tipo");
				$("#tipoAsigGasto").focus();
				return false;
			}

			$("#cartera option:selected").each(function(){
				ConceptosAdd.carterasAsignadas[$(this).val() + '-' + $("#tipoAsigGasto").val()] = $(this).val() + ' - ' + $("#tipoAsigGasto").val();
			});

			$("#cartera option:selected").remove();

			$('#detalleCarterasAsignadasAlGasto').empty();
			for (var elemento in ConceptosAdd.carterasAsignadas){
				if(ConceptosAdd.carterasAsignadas[elemento]){
					$('#detalleCarterasAsignadasAlGasto').append($('<option>', {
						value: elemento,
						title: ConceptosAdd.carterasAsignadas[elemento],
						text: ConceptosAdd.carterasAsignadas[elemento]
					}));
				}
			}
			return false;
		});

		$("#btnQuitarCarterasAsignadasAlGasto").click(function( e ){
			e.preventDefault();

			var haySeleccionados = false;
			$('#detalleCarterasAsignadasAlGasto option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar la cartera a eliminar.");
				return false;
			}

			$("<option value='" + ConceptosAdd.carterasAsignadas[$('#detalleCarterasAsignadasAlGasto').val()] + "'>" + ConceptosAdd.carterasAsignadas[$('#detalleCarterasAsignadasAlGasto').val()] + "</option>").appendTo("#cartera");

			/*
			 $('#cartera').append($('<option>', {
			 value: ConceptosAdd.carterasAsignadas[$('#detalleCarterasAsignadasAlGasto').val()],
			 text: ConceptosAdd.carterasAsignadas[$('#detalleCarterasAsignadasAlGasto').val()]
			 }));
			 */
			ConceptosAdd.carterasAsignadas[$('#detalleCarterasAsignadasAlGasto').val()] = null;
			$("#detalleCarterasAsignadasAlGasto option:selected").remove();
		});

		$( document ).on({
			keypress : function( event ) {
				if ( event.which == 13 && $.trim( $(this).val() ) != "" ) {
					event.preventDefault();
					for (x in ConceptosAdd.documentos) {
						if (ConceptosAdd.documentos[x] == $('#documentos').val()) {
							alert("El documento ya ha sido agregado"); return false;
						}
					}

					$('#detalleDocumentos').append($('<option>', {
						value: $('#documentos').val(),
						text: $('#documentos').val()
					}));

					ConceptosAdd.documentos[$('#documentos').val()] = $('#documentos').val();
					$('#documentos').val("");
				}
			}
		}, "#documentos");

		$( document ).on({
			keypress : function( event ) {
				if ( event.which == 13 && $.trim( $(this).val() ) != "" ) {
					event.preventDefault();
					for (x in ConceptosAdd.documentosAnexo) {
						if (ConceptosAdd.documentosAnexo[x] == $('#doctosAnexo').val()) {
							alert("El documento ya ha sido agregado"); return false;
						}
					}

					$('#detalleDoctosAnexo').append($('<option>', {
						value: $('#doctosAnexo').val(),
						text: $('#doctosAnexo').val()
					}));

					ConceptosAdd.documentosAnexo[$('#doctosAnexo').val()] = $('#doctosAnexo').val();
					$('#doctosAnexo').val("");
				}
			}
		}, "#doctosAnexo");

		$("#btnAgregarDocumento").click(function( e ){
			e.preventDefault();

			if(!$('#documentos').val()){
				alert("Ingrese el nombre del documento");
				$('#documentos').focus();
				return false;
			}

			if(!$('#guiaRevision').val()){
				alert("Ingrese la Guía de revisión");
				$('#guiaRevision').focus();
				return false;
			}

			if( $('#opcionalDocSop').val() == "0" ){
				alert("Seleccione si es Requerido u Opcional");
				$('#opcionalDocSop').focus();
				return false;
			}

			for (x in ConceptosAdd.documentos) {
				//if (ConceptosAdd.documentos[x] == $('#documentos').val()) {
				if (x == $('#documentos').val()) {
					alert("El documento ya ha sido agregado");
					return false;
				}
			}

			$('#detalleDocumentos').append($('<option>', {
				value: $('#documentos').val(),
				title: $('#documentos').val() + '[' + $('#opcionalDocSop').val() + ']' + ' * ' + $('#guiaRevision').val(),
				text: $('#documentos').val() + '[' + $('#opcionalDocSop').val() + ']' + ' * ' + $('#guiaRevision').val()
			}));
			ConceptosAdd.documentos[$('#documentos').val()] = $('#documentos').val() + '[' + $('#opcionalDocSop').val() + ']';
			ConceptosAdd.guiasRevision[$('#documentos').val()] = ('#documentos').val() + '[' + $('#opcionalDocSop').val() + ']' + ' * ' + $('#guiaRevision').val();

			$('#documentos').val("");
			$('#guiaRevision').val("");
			$('#opcionalDocSop').val("0");
			$('#documentos').focus();
			return false;
		});

		$( "#btnQuitarDocumento").click(function(e){
			e.preventDefault();

			var haySeleccionados = false;
			$('#detalleDocumentos option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar el documento a eliminar.");
				return false;
			}
			ConceptosAdd.documentos[$('#detalleDocumentos').val()] = null;
			ConceptosAdd.guiasRevision[$('#detalleDocumentos').val()] = null;
			$("#detalleDocumentos option:selected").remove();
			return false;
		});

		$("#btnAgregarDoctosAnexo").click(function( e ){
			e.preventDefault();

			if(!$('#doctosAnexo').val()){
				alert("Ingrese el nombre del documento");
				$('#doctosAnexo').focus(); return false;
			}

			if(!$('#guiaRevisionDocIni').val()){
				alert("Ingrese la Guía de revisión");
				$('#guiaRevisionDocIni').focus();
				return false;
			}

			if( $('#opcionalDocIni').val() == "0" ){
				alert("Seleccione si es Requerido u Opcional");
				$('#opcionalDocIni').focus();
				return false;
			}

			for (x in ConceptosAdd.documentosAnexo) {
				//if (ConceptosAdd.documentosAnexo[x] == $('#doctosAnexo').val()) {
				if (x == $('#doctosAnexo').val()) {
					alert("El documento ya ha sido agregado"); return false;
				}
			}

			$('#detalleDoctosAnexo').append($('<option>', {
				value: $('#doctosAnexo').val(),
				title: $('#doctosAnexo').val() + ' [' + $('#opcionalDocIni').val() + ']' + ' * ' + $('#guiaRevisionDocIni').val(),
				text: $('#doctosAnexo').val() + ' [' + $('#opcionalDocIni').val() + ']' + ' * ' + $('#guiaRevisionDocIni').val()
			}));
			ConceptosAdd.documentosAnexo[$('#doctosAnexo').val()] = $('#doctosAnexo').val() + '[' + $('#opcionalDocIni').val() + ']';
			ConceptosAdd.guiasRevisionDoctosAnexo[$('#doctosAnexo').val()] = $('#doctosAnexo').val() + '[' + $('#opcionalDocIni').val() + ']' + ' * ' +  $('#guiaRevisionDocIni').val();

			$('#guiaRevisionDocIni').val("");
			$('#doctosAnexo').val("");
			$('#opcionalDocIni').val("0");
			$('#doctosAnexo').focus();
			return false;
		});

		$( "#btnQuitarDoctosAnexo").click(function(e){
			e.preventDefault();
			var haySeleccionados = false;
			$('#detalleDoctosAnexo option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar el documento a eliminar.");
				return false;
			}
			ConceptosAdd.documentosAnexo[$('#detalleDoctosAnexo option:selected').val()] = null;
			$("#detalleDoctosAnexo option:selected").remove();
			return false;
		});

		$("#btnAgregarPuesto").click(function(e){
			e.preventDefault();

			var haySeleccionados = false;
			$('#puestos option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar el puesto a agregar.");
				$('#puestos').focus();
				return false;
			}

			for (x in ConceptosAdd.puestos) {
				if (ConceptosAdd.puestos[x] == $("#puestos option:selected").val() ) {
					alert("El puesto ya ha sido agregado");
					return false;
				}
			}

			$("#puestos option:selected").each(function(){
				ConceptosAdd.puestos[$(this).val()] = $(this).text();
			});

			$("#puestos option:selected").remove();

			$('#detallePuesto').empty();
			for (var elemento in ConceptosAdd.puestos){
				if(ConceptosAdd.puestos[elemento]){
					$('#detallePuesto').append($('<option>', {
						value: elemento,
						title: ConceptosAdd.puestos[elemento],
						text: ConceptosAdd.puestos[elemento]
					}));
				}
			}
			return false;
		});

		$("#btnQuitarPuesto").click(function( e ){
			e.preventDefault();

			var haySeleccionados = false;
			$('#detallePuesto option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar un puesto a eliminar.");
				return false;
			}


			$("#detallePuesto option:selected").each(function(){
				$("<option value='" + $(this).val() + "'>" + $(this).text() + "</option>").appendTo("#puestos");
				ConceptosAdd.puestos[$(this).val()] = null;
			});

			$("#detallePuesto option:selected").remove();
			return false;
		});

		$("#btnAgregarUnidadNegocio").click(function( e ){
			e.preventDefault();

			if( $("#unidadesNegocio").val() == "" ){
				$("#unidadesNegocio").focus();
				return false;
			}

			var haySeleccionados = false;
			$('#unidadesNegocio option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar la unida de negocio a agregar.");
				$('#unidadesNegocio').focus();
				return false;
			}

			//console.log(ConceptosAdd.unidadesNegocio.length);

			for (x in ConceptosAdd.unidadesNegocio) {
				//Solo permite una sola unidad de negocio
				if (ConceptosAdd.unidadesNegocio[x]){
					alert("Ya existe un puesto agregado. Elimine y agregue de nuevo.");
					$('#unidadesNegocio').focus();
					return false;
				}

				//Valida que la unidad de negocio ya haya sido agregada
				if (ConceptosAdd.unidadesNegocio[x] == $("#unidadesNegocio option:selected").val() ) {
					alert("El puesto ya ha sido agregado");
					return false;
				}
			}
			$('#detalleUnidadesNegocio').append($('<option>', {
				value: $("#unidadesNegocio option:selected").val(),
				title: $("#unidadesNegocio option:selected").text(),
				text: $("#unidadesNegocio option:selected").text()
			}));
			ConceptosAdd.unidadesNegocio[$("#unidadesNegocio option:selected").val()] = $("#unidadesNegocio option:selected").val();
			//console.log(ConceptosAdd.unidadesNegocio.length);

			$("#unidadesNegocio option:selected").remove();

			$('#unidadesNegocio').val("");
			$('#unidadesNegocio').focus();
			return false;
		});

		$("#btnQuitarUnidadNegocio").click(function( e ){
			e.preventDefault();

			var haySeleccionados = false;
			$('#detalleUnidadesNegocio option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar la unidad de negocio a eliminar.");
				return false;
			}

			$("<option value='" + ConceptosAdd.unidadesNegocio[$('#detalleUnidadesNegocio').val()] + "'>" + $("#detalleUnidadesNegocio option:selected").text() + "</option>").appendTo("#unidadesNegocio");

			ConceptosAdd.unidadesNegocio[$('#detalleUnidadesNegocio').val()] = null;
			$("#detalleUnidadesNegocio option:selected").remove();
		});

		$("#btnAgregarEmpresa").click(function(e){
			e.preventDefault();

			var haySeleccionados = false;
			$('#empresas option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar el puesto a agregar.");
				$('#empresas').focus();
				return false;
			}

			for (x in ConceptosAdd.empresas) {
				if (ConceptosAdd.empresas[x] == $("#empresas option:selected").val() ) {
					alert("La empresa ya ha sido agregado");
					return false;
				}
			}

			$("#empresas option:selected").each(function(){
				ConceptosAdd.empresas[$(this).val()] = $(this).text();
			});

			$("#empresas option:selected").remove();

			$('#detalleEmpresa').empty();
			for (var elemento in ConceptosAdd.empresas){
				if(ConceptosAdd.empresas[elemento]){
					$('#detalleEmpresa').append($('<option>', {
						value: elemento,
						title: ConceptosAdd.empresas[elemento],
						text: ConceptosAdd.empresas[elemento]
					}));
				}
			}
			return false;
		});

		$("#btnQuitarEmpresa").click(function( e ){
			e.preventDefault();

			var haySeleccionados = false;
			$('#detalleEmpresa option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar una empresa a eliminar.");
				return false;
			}

			$("#detalleEmpresa option:selected").each(function(){
				$("<option value='" + $(this).val() + "'>" + $(this).text() + "</option>").appendTo("#empresas");
				ConceptosAdd.empresas[$(this).val()] = null;
			});

			$("#detalleEmpresa option:selected").remove();
			return false;
		});

		$("#btnAgregarFormaPago").click(function(e){
			e.preventDefault();
			var haySeleccionados = false;
			$('#formaspago option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar el puesto a agregar.");
				$('#formaspago').focus();
				return false;
			}

			for (x in ConceptosAdd.formaspago) {
				if (ConceptosAdd.formaspago[x] == $("#formaspago option:selected").val() ) {
					alert("La forma de pago ya ha sido agregado");
					return false;
				}
			}

			$("#formaspago option:selected").each(function(){
				ConceptosAdd.formaspago[$(this).val()] = $(this).text();
			});

			$("#formaspago option:selected").remove();

			$('#detalleFormaspago').empty();
			for (var elemento in ConceptosAdd.formaspago){
				if(ConceptosAdd.formaspago[elemento]){
					$('#detalleFormaspago').append($('<option>', {
						value: elemento,
						title: ConceptosAdd.formaspago[elemento],
						text: ConceptosAdd.formaspago[elemento]
					}));
				}
			}
			return false;
		});

		$("#btnQuitarFormaPago").click(function( e ){
			e.preventDefault();

			var haySeleccionados = false;
			$('#detalleFormaspago option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar la forma de pago a eliminar.");
				return false;
			}

			$("#detalleFormaspago option:selected").each(function(){
				$("<option value='" + $(this).val() + "'>" + $(this).text() + "</option>").appendTo("#formaspago");
				ConceptosAdd.formaspago[$(this).val()] = null;
			});

			$("#detalleFormaspago option:selected").remove();
			return false;
		});

		$("#btnAgregarSolucionTramite").click(function(e){
			e.preventDefault();
			var haySeleccionados = false;
			$('#tipoSolucionTramite option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar el tipo de solución a agregar.");
				$('#tipoSolucionTramite').focus();
				return false;
			}

			for (x in ConceptosAdd.tipoSolucionTramite) {
				if (ConceptosAdd.tipoSolucionTramite[x] == $("#tipoSolucionTramite option:selected").val() ) {
					alert("El tipo de solución ya ha sido agregado");
					return false;
				}
			}

			$("#tipoSolucionTramite option:selected").each(function(){
				ConceptosAdd.tipoSolucionTramite[$(this).val()] = $(this).text();
			});

			$("#tipoSolucionTramite option:selected").remove();

			$('#detalleSolucionTramite').empty();
			for (var elemento in ConceptosAdd.tipoSolucionTramite){
				if(ConceptosAdd.tipoSolucionTramite[elemento]){
					$('#detalleSolucionTramite').append($('<option>', {
						value: elemento,
						text: ConceptosAdd.tipoSolucionTramite[elemento]
					}));
				}
			}
			return false;
		});

		$("#btnQuitarSolucionTramite").click(function( e ){
			e.preventDefault();

			var haySeleccionados = false;
			$('#detalleSolucionTramite option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar el tipo de solución a eliminar.");
				return false;
			}

			$("#detalleSolucionTramite option:selected").each(function(){
				$("<option value='" + $(this).val() + "'>" + $(this).text() + "</option>").appendTo("#tipoSolucionTramite");
				ConceptosAdd.tipoSolucionTramite[$(this).val()] = null;
			});

			$("#detalleSolucionTramite option:selected").remove();
			return false;
		});

		$("#btnGuardarNuevoConcepto").click(function(e){
			e.preventDefault();
			$("#frmAddConceptos").submit();
			return false;
		});

		$("#btnCancelarConcepto").click(function(e){
			e.preventDefault();
			e.preventDefault();
			var userid = $('#userid').html();
			Layout.showLoading();
			$.ajax({
				url: baseUrl + '/catalogos/conceptos/index',
				type: 'GET',
				data: {userid: userid, categoria:$('#categoria').val(), subcategoria:$('#subcategoria').val()},
				dataType: 'html',
				complete: function() {
					//Modal.close();
				},
				success: function(data) {
					//console.log(data);
					$('#catalogo-content').html(data);
					Layout.hideLoading();
				}
			});
			//Menu.loadModuleMenu('catalogos', 'conceptos', 'index');
		});

		//Agregando reglas/rules a los campos obligatorios
		$("#foTramite").click( function( e ){
			if( $(this).is(":checked") ){
				$("input[name='reqImporteFacturacion']").rules("add", {
					required: true,
					messages: {
						required: "Elija una opción"
					}
				});
			} else {
				$( "input[name='reqImporteFacturacion']" ).rules( "remove", "required" );
			}
		});

		//Evento para eliminar los autorizadores
		$("#removeAutorizadorTipoUmbralMonto1").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 1?");
			if(res){
				$("#autorizadorTipoUmbralMonto1").val("");
				$("#idAutorizadorTipoUmbralMonto1").val("");
				$("#autorizadorTipoUmbralMonto1").removeAttr("readonly");
			}
		});
		$("#removeAutorizadorTipoUmbralMonto2").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 2?");
			if(res){
				$("#autorizadorTipoUmbralMonto2").val("");
				$("#idAutorizadorTipoUmbralMonto2").val("");
				$("#autorizadorTipoUmbralMonto2").removeAttr("readonly");
			}
		});
		$("#removeAutorizadorTipoUmbralMonto3").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 3?");
			if(res){
				$("#autorizadorTipoUmbralMonto3").val("");
				$("#idAutorizadorTipoUmbralMonto3").val("");
				$("#autorizadorTipoUmbralMonto3").removeAttr("readonly");
			}
		});
		$("#removeAutorizadorTipoUmbralMonto3a").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 3 A?");
			if(res){
				$("#autorizadorTipoUmbralMonto3a").val("");
				$("#idAutorizadorTipoUmbralMonto3a").val("");
				$("#autorizadorTipoUmbralMonto3a").removeAttr("readonly");
			}
		});
		$("#removeAutorizadorTipoUmbralMonto3b").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 3 B?");
			if(res){
				$("#autorizadorTipoUmbralMonto3b").val("");
				$("#idAutorizadorTipoUmbralMonto3b").val("");
				$("#autorizadorTipoUmbralMonto3b").removeAttr("readonly");
			}
		});
		$("#removeAutorizadorEtapaCerrada1").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 1?");
			if(res){
				$("#autorizadorEtapaCerrada1").val("");
				$("#idAutorizadorEtapaCerrada1").val("");
				$("#autorizadorEtapaCerrada1").removeAttr("readonly");
			}
		});
		$("#removeAutorizadorEtapaCerrada2").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 2?");
			if(res){
				$("#autorizadorEtapaAbierta2").val("");
				$("#idAutorizadorEtapaAbierta2").val("");
				$("#autorizadorEtapaAbierta2").removeAttr("readonly");
			}
		});
		$("#removeAutorizadorCredLiquidados1").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 1?");
			if(res){
				$("#autorizadorCredLiquidados1").val("");
				$("#idAutorizadorCredLiquidados1").val("");
				$("#autorizadorCredLiquidados1").removeAttr("readonly");
			}
		});
		$("#removeAutorizadorCredLiquidados2").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 1?");
			if(res){
				$("#autorizadorCredLiquidados2").val("");
				$("#idAutorizadorCredLiquidados2").val("");
				$("#autorizadorCredLiquidados2").removeAttr("readonly");
			}
		});
		$("#removeAutorizadorPagosDobles1").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 1?");
			if(res){
				$("#autorizadorPagosDobles1").val("");
				$("#idAutorizadorPagosDobles1").val("");
				$("#autorizadorPagosDobles1").removeAttr("readonly");
			}
		});
		$("#removeAutorizadorPagosDobles2").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 2?");
			if(res){
				$("#autorizadorPagosDobles2").val("");
				$("#idAutorizadorPagosDobles2").val("");
				$("#autorizadorPagosDobles2").removeAttr("readonly");
			}
		});
		$("#removeAutorizaVerificadorFinal1").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 1?");
			if(res){
				$("#autorizaVerificadorFinal1").val("");
				$("#idAutorizaVerificadorFinal1").val("");
				$("#autorizaVerificadorFinal1").removeAttr("readonly");
			}
		});
		$("#removeAutorizaVerificadorFinal2").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 2?");
			if(res){
				$("#autorizaVerificadorFinal2").val("");
				$("#idAutorizaVerificadorFinal2").val("");
				$("#autorizaVerificadorFinal2").removeAttr("readonly");
			}
		});
		$("#removeAutorizaVerificadorFinal3").click( function( e ){
			var res = confirm("¿Eliminar Autorizador 3?");
			if(res){
				$("#autorizaVerificadorFinal3").val("");
				$("#idAutorizaVerificadorFinal3").val("");
				$("#autorizaVerificadorFinal3").removeAttr("readonly");
			}
		});

		//Validar los montos de los umbrales
		$("#montoUmbral1").change(function(){
			if( $("#montoUmbral1").val() == "" || $("#montoUmbral1").val() == "0" ){
				return false;
			}

			if( parseInt($("#montoUmbral3").val()) != 0 && parseInt($(this).val()) > parseInt($("#montoUmbral3").val()) ){
				alert("Monto 1 no debe ser mayoy que monto 3.");
				$("#montoUmbral1").val("");
				$("#montoUmbral1").focus();
				//$( "#montoUmbral1" ).after( '<label for="autorizadorTipoUmbralMonto1" class="error">Monto 1 no debe ser mayoy que monto 3.</label>' );
				return false;
			}
			if( parseInt($("#montoUmbral2").val()) != 0 && parseInt($(this).val()) > parseInt($("#montoUmbral2").val()) ){
				alert("Monto 1 no debe ser mayor que monto 2.");
				$("#montoUmbral1").val("");
				$("#montoUmbral1").focus();
				//$( "#montoUmbral1" ).after( '<label for="autorizadorTipoUmbralMonto1" class="error">Monto 1 no debe ser mayor que monto 2.</label>' );
				return false;
			}
		});

		$("#montoUmbral2").change(function(){
			if( $("#montoUmbral2").val() == "" || $("#montoUmbral2").val() == "0" ){
				return false;
			}

			if( parseInt($("#montoUmbral1").val()) != 0 && parseInt($(this).val()) < parseInt($("#montoUmbral1").val()) ){
				alert("Monto 2 no debe ser menor que monto 1.");
				$("#montoUmbral2").val("");
				$("#montoUmbral2").focus();
				//$( "#montoUmbral2" ).after( '<label for="autorizadorTipoUmbralMonto1" class="error">Monto 2 no debe ser menor que monto 1.</label>' );
				return false;
			}
			if( parseInt($("#montoUmbral3").val()) != 0 && parseInt($(this).val()) > parseInt($("#montoUmbral3").val()) ){
				alert("Monto 2 no debe ser mayor que monto 3.");
				$("#montoUmbral2").val("");
				$("#montoUmbral2").focus();
				//$( "#montoUmbral2" ).after( '<label for="autorizadorTipoUmbralMonto1" class="error">Monto 2 no debe ser mayor que monto 3.</label>' );
				return false;
			}
		});

		$("#montoUmbral3").change(function(){
			if( $("#montoUmbral3").val() == "" || $("#montoUmbral3").val() == "0" ){
				return false;
			}

			if( parseInt($("#montoUmbral1").val()) != 0 && parseInt($(this).val()) < parseInt($("#montoUmbral1").val()) ){
				alert("Monto 3 no debe ser menor que monto 1.");
				$("#montoUmbral3").val("");
				$("#montoUmbral3").focus();
				//$( "#montoUmbral3" ).after( '<label for="autorizadorTipoUmbralMonto3" class="error">Monto 3 no debe ser menor que monto 1.</label>' );
				return false;
			}
			if( parseInt($("#montoUmbral2").val()) != 0 && parseInt($(this).val()) < parseInt($("#montoUmbral2").val()) ){
				alert("Monto 3 no debe ser menor que monto 2.");
				$("#montoUmbral3").val("");
				$("#montoUmbral3").focus();
				//$( "#montoUmbral3" ).after( '<label for="autorizadorTipoUmbralMonto3" class="error">Monto 3 no debe ser menor que monto 2.</label>' );
				return false;
			}
		});

		$("#frmAddConceptos").validate({
			rules: {
				categoria: 			"required",
				subcategoria: 		"required",
				descripcionConcepto:"required",
				//cuentaContable: 	"required",
				//cuentaIngresos: 	"required",
				numeroCotizaciones: "required",
				costoInterno: 		"required",
				areaConcetradora:   "required",
				valMaxAnticipo: {
					required: true,
					range: [0, 100]
				}
			},
			messages: {
				categoria: "Ingrese el nombre de la categoria",
				subcategoria: "Ingrese el nombre de la subcategoria",
				descripcionConcepto: "Ingrese el nombre del concepto",
				//cuentaContable: "Ingrese la cuenta contable",
				//cuentaIngresos: "Ingrese la cuenta de ingresos",
				valMaxAnticipo: "El porcentaje debe ser de 0 a 100"
			},
			submitHandler: function(form) {
				if( $.trim($("#selReqAutoriza").val()) == "O" ){
					if(  $.trim($("#idJefeInmediato").val()) == "" || $.trim($("#nombreJefeInmediato").val()) == ""){
						$( "#nombreJefeInmediato" ).after( '<label id="validaNombreJefeInmediato" class="error">Ingrese el jefe inmediato.</label>' );
						$( "#nombreJefeInmediato" ).focus();
						return false;
					}
				}

				if( ( $("#FCCLASIFICACIONTAREA").val().length > 1 || $("#FCESTATUSTAREA").val().length > 1 ) && ( $("#FCTIPOAUTOTAREA").val().length == 0 ) && ( $("#FCAUTOALERTATAREA").val().length == 0 )  ){
					$( "#msjReglasTarea" ).after( '<label class="error">Ingrese el tipo de autorizador para la reglas.</label>' );
					$( "#selAutorizaTipoEtapasTareas" ).focus();
					return false;
				} else {
					$("#msjReglasTarea").remove();
				}

				console.log('llamando a frmConceptos 2');
				$("#frmConceptos2").submit();
				return false;
			}
		});

		$("#frmConceptos2").validate({
			rules: {
//						autorizadorEtapaCerrada1: 			"required",
//						porCentajeUmbralDel1: 		"required",
//						porCentajeUmbralAl1:"required",
//						montoUmbral2: 	"required",
//						porCentajeUmbralDel2: 	"required",
//						porCentajeUmbralAl2: "required"
			},
			messages: {
				categoria: "Ingrese el nombre de la categoria"
			},
			submitHandler: function(form) {
				console.log('llamando a frmConceptos 3');
				if( $.trim($("#montoUmbral1").val()) != "" && $.trim($("#montoUmbral1").val()) != "0"){
					if( $("#autorizadorTipoUmbralMonto1").val() == "" ){
						$( "#removeAutorizadorTipoUmbralMonto1" ).after( '<label for="autorizadorTipoUmbralMonto1" class="error">Ingrese el autorizador 1.</label>' );
						return false;
					}
				}

				if( $.trim($("#montoUmbral2").val()) != "" && $.trim($("#montoUmbral2").val()) != "0" ){
					if( $("#autorizadorTipoUmbralMonto2").val() == "" ){
						$( "#removeAutorizadorTipoUmbralMonto2" ).after( '<label for="autorizadorTipoUmbralMonto2" class="error">Ingrese el autorizador 2.</label>' );
						return false;
					}
				}

				if( $.trim($("#montoUmbral3").val()) != "" && $.trim($("#montoUmbral3").val()) != "0"){
					if( $("#autorizadorTipoUmbralMonto3").val() == "" ){
						$( "#removeAutorizadorTipoUmbralMonto3" ).after( '<label for="autorizadorTipoUmbralMonto3" class="error">Ingrese el autorizador 3 A.</label>' );
						return false;
					}
					/*
					 if( $("#autorizadorTipoUmbralMonto3a").val() == "" ){
					 $( "#removeAutorizadorTipoUmbralMonto3a" ).after( '<label for="autorizadorTipoUmbralMonto3a" class="error">Ingrese el autorizador 3 A.</label>' );
					 return false;
					 }

					 if( $("#autorizadorTipoUmbralMonto3b").val() == "" ){
					 $( "#removeAutorizadorTipoUmbralMonto3b" ).after( '<label for="autorizadorTipoUmbralMonto3b" class="error">Ingrese el autorizador 3 B.</label>' );
					 return false;
					 }
					 */
				}

				/*
				 if( $("#idAutorizadorExcedenteGasto1").val() == "" || $.trim($("#autorizadorExcedenteGasto1").val()) == "" ){
				 $( "#removeAutorizadorExcedenteGasto1" ).after( '<label for="autorizadorExcedenteGasto1" class="error">Ingrese el autorizador 1.</label>' );
				 return false;
				 }

				 if( $("#idAutorizadorExcedenteGasto2").val() == "" || $.trim($("#autorizadorExcedenteGasto2").val()) == "" ){
				 $( "#removeAutorizadorExcedenteGasto2" ).after( '<label for="autorizadorExcedenteGasto2" class="error">Ingrese el autorizador 2.</label>' );
				 return false;
				 }
				 */
				//alert("Pasamos al frmConceptos3");
				$("#frmConceptos3").submit();
				return false;
			}
		});

		$("#frmConceptos3").validate({
			rules: {
				autorizadorEtapaCerrada1: "required",
				tipoDemanda: "required"
			},
			messages: {
				autorizadorEtapaCerrada1: "Ingrese el autorizador 01",
				tipoDemanda: "Seleccione un tipo de demanda"
			},
			submitHandler: function(form) {
				console.log('llamando a frmConceptos 4');
				$("#frmConceptos4").submit();
				return false;
			}
		});

		$("#frmConceptos4").validate({
			rules: {
				//selPagosDobles: "required"
			},
			messages: {
				categoria: "Ingrese el nombre de la categoria"
			},
			submitHandler: function(form) {
				if( $("#selCredLiquidados").val() === "S" && $("#idAutorizadorCredLiquidados1").val() == "" && $("#idAutorizadorCredLiquidados1").val() == ""){
					$( "#autorizadorCredLiquidados1" ).after( '<label for="detalleSolucionTramite" class="error">Ingrese un autorizador.</label>' );
					$( "#autorizadorCredLiquidados1" ).focus();
					return false;
				}
				console.log('llamando a frmConceptos 5');
				$("#frmConceptos5").submit();
				return false;
			}
		});

		$("#frmConceptos5").validate({
			rules: {

			},
			messages: {
				categoria: "Ingrese el nombre de la categoria"
			},
			submitHandler: function(form) {
				var hayTipoSolucion = "";

				if( $("#foTramite").is(":checked") ){
					for (x in ConceptosAdd.tipoSolucionTramite) {
						if ( ConceptosAdd.tipoSolucionTramite[x] ) {
							hayTipoSolucion += x + '|';
						}
					}

					if( hayTipoSolucion == "" ){
						$( "#detalleSolucionTramite" ).after( '<label for="detalleSolucionTramite" class="error">Agregue los tipos de solución de trámite.</label>' );
						$( "#detalleSolucionTramite" ).focus();
						return false;
					}
				}

				console.log('llamando a frmConceptos 6');
				$("#frmConceptos6").submit();
				return false;
			}
		});

		$("#frmConceptos6").validate({
			rules: {

			},
			messages: {
				categoria: "Ingrese el nombre de la categoria"
			},
			submitHandler: function(form) {
				var carterasAsignadas = '';
				var documentos = '';
				var guiasRevision = '';
				var documentosAnexo = '';
				var puestos = '';
				var unidadesNegocio = '';
				var empresasFacturar = '';
				var formasPago = '';
				var tipoSolucionTramite = '';
				var cadenaCredLiquidados = "";
				var cadenaCredColas = "";

				//Cadena de carteras Asignadas
				for (x in ConceptosAdd.carterasAsignadas) {
					if ( ConceptosAdd.carterasAsignadas[x] ) {
						carterasAsignadas += x + '|';
					}
				}
				//Cadena de documentos
				for (x in ConceptosAdd.documentos) {
					if ( ConceptosAdd.documentos[x] ) {
						documentos += ConceptosAdd.documentos[x] + '*' + ConceptosAdd.guiasRevision[x] + '|';
					}
				}
				//Cadena de documentos Anexos
				for (x in ConceptosAdd.documentosAnexo) {
					if ( ConceptosAdd.documentosAnexo[x] ) {
						documentosAnexo += ConceptosAdd.documentosAnexo[x] + '*' + ConceptosAdd.guiasRevisionDoctosAnexo[x] + '|';
					}
				}
				//Cadena de puestos
				for (x in ConceptosAdd.puestos) {
					if ( ConceptosAdd.puestos[x] ) {
						puestos += x + '|';
					}
				}
				//Cadena de unidades Negocio
				for (x in ConceptosAdd.unidadesNegocio) {
					if ( ConceptosAdd.unidadesNegocio[x] ) {
						unidadesNegocio += ConceptosAdd.unidadesNegocio[x] + '|';
					}
				}
				//Cadena de Empresas a facturar
				for (x in ConceptosAdd.empresas) {
					if ( ConceptosAdd.empresas[x] ) {
						empresasFacturar += x + '|';
					}
				}

				//Cadena de Formas de pago
				for (x in ConceptosAdd.formaspago) {
					if ( ConceptosAdd.formaspago[x] ) {
						formasPago += x + '|';
					}
				}

				//Cadena de Tipo de solucion Tramite
				for (x in ConceptosAdd.tipoSolucionTramite) {
					if ( ConceptosAdd.tipoSolucionTramite[x] ) {
						tipoSolucionTramite += x + '|';
					}
				}

				//Cadena de Guias de revisión
				for (x in ConceptosAdd.guiasRevision) {
					if ( ConceptosAdd.guiasRevision[x] ) {
						guiasRevision += ConceptosAdd.guiasRevision[x] + '|';
					}
				}

				//Cadena Creditos Liquidados
				for (x in ConceptosAdd.statusCredito) {
					if ( ConceptosAdd.statusCredito[x] ) {
						cadenaCredLiquidados += x + '|';
					}
				}
				//Cadena Creditos Colas
				for (x in ConceptosAdd.colas) {
					if ( ConceptosAdd.colas[x] ) {
						cadenaCredColas += ConceptosAdd.colas[x] + '|';
					}
				}
				//console.log( tipoSolucionTramite );
				//return false;
				Layout.showLoading();
				$.ajax({
					url: baseUrl + '/catalogos/conceptos/setconcepto',
					type: 'POST',
					data: $("#frmAddConceptos").serialize() +
					'&' + $("#frmConceptos2").serialize() +
					'&' + $("#frmConceptos3").serialize() +
					'&' + $("#frmConceptos4").serialize() +
					'&' + $("#frmConceptos5").serialize() +
					'&' + $("#frmConceptos6").serialize() +
					'&carterasAsignadas=' + carterasAsignadas +
					'&documentos=' + documentos +
					'&documentosAnexo=' + documentosAnexo +
					'&puestos=' + puestos +
					'&unidadesNegocio=' + unidadesNegocio +
					'&empresasFacturar=' + empresasFacturar +
					'&formasPago=' + formasPago +
					'&tipoSolucionTramite=' + tipoSolucionTramite +
					'&guiasRevision=' + guiasRevision +
					'&cadenaCredLiquidados=' + cadenaCredLiquidados +
					'&cadenaCredColas=' + cadenaCredColas,
					dataType: 'json',
					complete: function() {
						//Modal.close();
					},
					success: function(data) {
						Layout.hideLoading();
						console.log(data);
						//return false;
						if( data.success == '0'){
							var userid = $('#userid').html();
							Layout.showLoading();
							$.ajax({
								url: baseUrl + '/catalogos/conceptos/index',
								type: 'GET',
								data: {userid: userid, categoria:$('#categoria').val(), subcategoria:$('#subcategoria').val()},
								dataType: 'html',
								complete: function() {
									//Modal.close();
								},
								success: function(data) {
									//console.log(data);
									$('#catalogo-content').html(data);
									Layout.hideLoading();
								}
							});
							//Menu.loadModuleMenu('catalogos', 'conceptos', 'index');
						}

						return false;
					}
				});
				return false;
				alert("frmConceptos2 validado: " + $("#frmConceptos").serialize()); return false;

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
	},// End resetearCampos()
	validarStatusCredito : function() {
		var tamStatusCred = 0;
		for (var elemento in ConceptosAdd.statusCredito){
			if(ConceptosAdd.statusCredito[elemento]){
				tamStatusCred++;
			}
		}
		var tamColas = 0;
		for (var elemento in ConceptosAdd.colas){
			if(ConceptosAdd.colas[elemento]){
				tamColas++;
			}
		}
		console.log( tamStatusCred );
		console.log( tamColas );
		if( tamStatusCred > 0 || tamColas > 0 ){
			$("#selAutorizaCredLiquidados1").removeAttr("disabled");
			$("#selAutorizaCredLiquidados2").removeAttr("disabled");
			$("#autorizadorCredLiquidados1").removeAttr("readonly");
			$("#autorizadorCredLiquidados2").removeAttr("readonly");
		} else {
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
			$("#selAutorizaCredLiquidados1").attr("disabled", "disabled");
			$("#selAutorizaCredLiquidados2").attr("disabled", "disabled");
			$("#autorizadorCredLiquidados1").attr("readonly", "readonly");
			$("#autorizadorCredLiquidados2").attr("readonly", "readonly");
			$("#selAutorizaCredLiquidados1").val("");
			$("#selAutorizaCredLiquidados2").val("");
			$("#autorizadorCredLiquidados1").val("");
			$("#autorizadorCredLiquidados2").val("");
		}
	},// End validarStatusCredito()
	validaRango : function(evt) {
		if( ConceptosAdd.isNumberKey(evt) == false ){
			return false;
		}

		if( evt.value < 0 || evt.value > 10 ){
			alert("El porcentaje debe ser de 0 a 100");
			return false;
		}
		return true;
	},// End validaRango()
	isNumberKey : function(evt) {
		var charCode = (evt.which) ? evt.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57))
			return false;
		return true;
	},// End isNumberKey()
	validaPorcentaje : function(valor) {
		if( parseInt (valor) > 100 ){
			alert("El porcentaje debe ser de 0 a 100");
			$("#valMaxAnticipo").focus();
			return false;
		}
	},
	eventoAgregarEtapas: function(){
		$( "#btnAddStatusEtapas" ).off().on( "click", function() {

			if( $('#selStatusEstapas option').is(':selected') == false ){
				alert("Seleccione algo.");
				$('#selStatusEstapas').focus();
				return false;
			}
			$("#selStatusEstapas option:selected").each(function(){
				ConceptosAdd.arrgEtapasTareas[$(this).val()] = $(this).text();
			});

			$("#detalleStatusEstapas option:selected").remove();
			$('#detalleStatusEstapas').empty();

			ConceptosAdd.arrgEtapasTareasId = [];
			for (var elemento in ConceptosAdd.arrgEtapasTareas){
				if(ConceptosAdd.arrgEtapasTareas[elemento]){
					ConceptosAdd.arrgEtapasTareasId.push(elemento);
					$('#detalleStatusEstapas').append($('<option>', {
						value: elemento,
						text: ConceptosAdd.arrgEtapasTareas[elemento],
					}));
				}
			}
			//Almaceno valores en el campo para la BD
			$("#FCCLASIFICACIONTAREA").val(ConceptosAdd.arrgEtapasTareasId.toString());
			$('#selStatusEstapas').focus();
			return false;
		});
	},
	eventoAgregarEstatusTareas: function(){
		$( "#btnAddEstadoTarea" ).off().on( "click", function() {

			if( $('#selEstadoTarea option').is(':selected') == false ){
				alert("Seleccione algo.");
				$('#selEstadoTarea').focus();
				return false;
			}
			$("#selEstadoTarea option:selected").each(function(){
				ConceptosAdd.arrgEstadoTarea[$(this).val()] = $(this).text();
			});

			$("#detalleEstadoTarea option:selected").remove();
			$('#detalleEstadoTarea').empty();

			ConceptosAdd.arrgEstadoTareaId = [];
			for (var elemento in ConceptosAdd.arrgEstadoTarea){
				if(ConceptosAdd.arrgEstadoTarea[elemento]){

					ConceptosAdd.arrgEstadoTareaId.push(elemento);

					$('#detalleEstadoTarea').append($('<option>', {
						value: elemento,
						text: ConceptosAdd.arrgEstadoTarea[elemento],
					}));
				}
			}
			//Almaceno valores en el campo para la BD
			$("#FCESTATUSTAREA").val(ConceptosAdd.arrgEstadoTareaId.toString());
			$('#selEstadoTarea').focus();
			return false;
		});
	},
	eventoEliminarAutorizadorEstatusTareas: function(){
		$( "#btnRemoveAutorizadorEstadoEtapa" ).off().on( "click", function() {
			var res = confirm("¿Eliminar Autorizador 1?");
			if(res){
				$("#FCTIPOAUTOTAREA").val("");
				$("#FCAUTOALERTATAREA").val("");
				$("#inpAutorizadorEtapasTareas").val("");
				$("#hiddenIdAutorizadorEtapasTareas").val("");
				$("#inpAutorizadorEtapasTareas").removeAttr("readonly");
			}
		});
	},
	eventoQuitarStatusEtapas: function(){
		$( document ).ready(function() {
			console.log( "document loaded" );
			$(document).on("click", "#btnQuitarStatusEtapas", function (e) {
				e.preventDefault();
				var haySeleccionados = false;
				$('#detalleStatusEstapas option').each(function() {
					if (this.selected)
						haySeleccionados = true;
				});

				if( !haySeleccionados ) {
					alert("Debe seleccionar algo.");
					return false;
				}

				console.log(ConceptosAdd.arrgEtapasTareas);
				var i = 0;
				$("#detalleStatusEstapas option:selected").each(function(){
					ConceptosAdd.arrgEtapasTareas[$(this).val()] = null;
				});
				$("#detalleStatusCredito option:selected").remove();

				ConceptosAdd.arrgEtapasTareasTemp = [];
				ConceptosAdd.arrgEtapasTareas.forEach(function (elemento, indice, array) {
					if (ConceptosAdd.arrgEtapasTareas[indice] != null){
						ConceptosAdd.arrgEtapasTareasTemp.push(indice);
					}
				});
				//Almaceno valores en el campo para la BD
				$("#FCCLASIFICACIONTAREA").val(ConceptosAdd.arrgEtapasTareasTemp.toString());
				$("#detalleStatusEstapas option:selected").remove();

			});

		});
	},
	eventoQuitarEstatusTareas: function(){
		$(document).on("click", "#btnQuitarEstadoTarea", function (e) {
			e.preventDefault();
			var hay = false;
			$('#detalleEstadoTarea option').each(function() {
				if (this.selected)
					hay = true;
			});

			if( !hay ) {
				alert("Debe seleccionar algo.");
				return false;
			}
			var i = 0;
			$("#detalleEstadoTarea option:selected").each(function(){
				ConceptosAdd.arrgEstadoTarea[$(this).val()] = null;
			});
			$("#detalleEstadoTarea option:selected").remove();

			ConceptosAdd.arrgEstadoTareaTemp = [];
			ConceptosAdd.arrgEstadoTarea.forEach(function (elemento, indice, array) {
				if (ConceptosAdd.arrgEstadoTarea[indice] != null){
					ConceptosAdd.arrgEstadoTareaTemp.push(indice);
				}
			});
			//Almaceno valores en el campo para la BD
			$("#FCESTATUSTAREA").val(ConceptosAdd.arrgEstadoTareaTemp.toString());
			$("#detalleEstadoTarea option:selected").remove();


		});

	},


};

ConceptosAdd.init();