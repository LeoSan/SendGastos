var ConceptosEdit = {
	carterasAsignadas : [],
	carterasFactura : [],
	documentos : [],
	guiasRevision : [],
	documentosAnexo: [],
	guiasRevisionDoctosAnexo: [],
	puestos : [],
	cadenaEtapaCerryVer: [],
	cadenaEtapaAbierta: [],
	unidadesNegocio : [],
	empresas : [],
	formaspago: [],
	tipoSolucionTramite : [],
	cadenaEtapaCierreGasto : [],
	statusCredito : [],
	colas : [],
	cadenaEtapaObjetivoVer: [], //leonard
	cadenaEtapaInmediataVer: [],//leonard

	arrgEtapasTareas: [],//leonard
	arrgEtapasTareasId: [],//leonard
	arrgEtapasTareasTemp: [],//leonard

	arrgEstadoTarea: [],//leonard
	arrgEstadoTareaId: [],//leonard
	arrgEstadoTareaTemp: [],//leonard

	init : function() {
		//Procesos y Eventos
		ConceptosEdit.eventoAgregarEtapas();
		ConceptosEdit.eventoAgregarEstatusTareas();
		ConceptosEdit.eventoEliminarAutorizadorEstatusTareas();
		ConceptosEdit.eventoQuitarStatusEtapas();
		ConceptosEdit.eventoQuitarEstatusTareas();

		//FRont
		$('#autorizadorAlertAsignacion').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';

				if( $("#selAlertAsignacion").val() == 'P' ){
					//url = baseUrl + '/catalogos/niveles/getniveles';
					return false;
				}
				if( $("#selAlertAsignacion").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						$.each(data.empleados, function (i, state) {
							map[state.nombre] = state;
							states.push(state.nombre);
						});

						process(states);
					}
				});
			},
			updater: function (item) {
				selectedState = map[item].id;
				$("#idAutorizadorAlertAsignacion").val(selectedState);
				$('#autorizadorAlertAsignacion').attr("readonly", true);
				return item;
			}
		});

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

		$('#autorizadorTipoUmbralMonto1').typeahead({
			items: 15,
			source: function (query, process) {
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
							//console.log(state);
							map[state.nombre] = state;
							states.push(state.nombre);
						});

						process(states);
					}
				});
			},
			updater: function (item) {
				console.log(item);
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
					return false;
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

		$('#autorizadorFechaEjecucion').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';

				if( $("#selFechaEjecucion").val() == 'P' ){
					//url = baseUrl + '/catalogos/niveles/getniveles';
					return false;
				}
				if( $("#selFechaEjecucion").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						$.each(data.empleados, function (i, state) {
							map[state.nombre] = state;
							states.push(state.nombre);
						});

						process(states);
					}
				});
			},
			updater: function (item) {
				selectedState = map[item].id;
				$("#idAutorizadorFechaEjecucion").val(selectedState);
				$('#autorizadorFechaEjecucion').attr("readonly", true);
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

		$('#inpAutorizadorEtapasTareas').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};

				var url = baseUrl + '/catalogos/sucursales/gettitulares';
				if( $("#selAutorizaTipoEtapasTareas").val() == 'P' ){
					url = baseUrl + '/catalogos/niveles/getniveles';
				}
				if( $("#selAutorizaTipoEtapasTareas").val() == 'T' ){
					url = baseUrl + '/catalogos/puestos/getpuestos';
				}
				$.ajax({
					type: "POST",
					url: url,
					data: { empleado: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						$.each(data.empleados, function (i, state) {
							map[state.nombre] = state;
							states.push(state.nombre);
						});

						process(states);
					}
				});
			},
			updater: function (item) {
				selectedState = map[item].id;
				$("#hiddenIdAutorizadorEtapasTareas").val(selectedState);
				var tipo  = $("#selAutorizaTipoEtapasTareas option:selected").val();
				$("#FCTIPOAUTOTAREA").val(tipo);
				$("#FCAUTOALERTATAREA").val(selectedState);
				$('#hiddenIdAutorizadorEtapasTareas').attr("readonly", true);
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

		$(".focusoutnivel").keyup(function(){

			if($($(this).data("selnivel")).val()=='P'){
				$($(this).data("seltarget")).val($(this).val());
			}
		});

		$(".grid-title").html("Editar concepto");

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

		//Tipo de umbral
		if( $("#selTipoUmbral").val() == '1' ) {
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

			//$('#montoUmbral1').focus();
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

			//$('#porCentajeUmbralDel1').focus();
		}

		/**
		 * Cargamos la información en los arreglos
		 */
		var cadenaEtapaCerrada = $("#cadenaEtapaCerryVer").val();
		var arrayEtapaCerrada = '';
		if(cadenaEtapaCerrada != ""){
			arrayEtapaCerrada = cadenaEtapaCerrada.split("|");
			if( arrayEtapaCerrada.length > 0 ){
				for (i = 0; i < arrayEtapaCerrada.length; i++) {
					if( $.trim( arrayEtapaCerrada[i] ) != "" ){
						ConceptosEdit.cadenaEtapaCerryVer[arrayEtapaCerrada[i]] = arrayEtapaCerrada[i];
					}
				}
			}
		}

		var cadenaEtapaAbierta = $("#cadenaEtapaCerryVer").val();
		var arrayEtapaAbierta = '';
		if(cadenaEtapaAbierta != ""){
			arrayEtapaAbierta = cadenaEtapaAbierta.split("|");
			if( arrayEtapaAbierta.length > 0 ){
				for (i = 0; i < arrayEtapaAbierta.length; i++) {
					if( $.trim( arrayEtapaAbierta[i] ) != "" ){
						ConceptosEdit.cadenaEtapaAbierta[arrayEtapaAbierta[i]] = arrayEtapaAbierta[i];
					}
				}
			}
		}

		var cadenaEtapaCierreGasto = $("#cadenaEtapaCierreGasto").val();
		var arrayEtapaCierreGasto = '';
		if(cadenaEtapaCierreGasto != ""){
			arrayEtapaCierreGasto = cadenaEtapaCierreGasto.split("|");
			if( arrayEtapaCierreGasto.length > 0 ){
				for (i = 0; i < arrayEtapaCierreGasto.length; i++) {
					if( $.trim( arrayEtapaCierreGasto[i] ) != "" ){
						ConceptosEdit.cadenaEtapaCierreGasto[arrayEtapaCierreGasto[i]] = arrayEtapaCierreGasto[i];
					}
				}
			}
		}

		$("#detalleCarterasAsignadasAlGasto option").each(function(){
			var valores = $(this).attr('value');
			var res = valores.split("-");
			ConceptosEdit.carterasAsignadas[$("#detalleCarterasAsignadasAlGasto option[value='" + $(this).attr('value') + "']").val()] = res[0] + ' - ' + res[1];
		});

		$("#detalleCarterasAsignadasAlGasto option").remove();

		for (x in ConceptosEdit.carterasAsignadas) {
			if (ConceptosEdit.carterasAsignadas[x]) {
				$('#detalleCarterasAsignadasAlGasto').append($('<option>', {
					value: x,
					title: ConceptosEdit.carterasAsignadas[x],
					text: ConceptosEdit.carterasAsignadas[x]
				}));
				var cadena = x.split("-");
				$("#cartera option[value='" + cadena[0] + "']").remove();
			}
		}

		//---------------- DEV

		$("#detalleCarterasFacturableGasto option").each(function(){
			var valores = $(this).attr('value');
			var res = valores.split("-");
			ConceptosEdit.carterasFactura[$("#detalleCarterasFacturableGasto option[value='" + $(this).attr('value') + "']").val()] = res[0] + ' - ' + res[1];
		});

		$("#detalleCarterasFacturableGasto option").remove();
		for (x in ConceptosEdit.carterasFactura) {
			if (ConceptosEdit.carterasFactura[x]) {
				$('#detalleCarterasFacturableGasto').append($('<option>', {
					value: x,
					title: ConceptosEdit.carterasFactura[x],
					text: ConceptosEdit.carterasFactura[x]
				}));
				var cadena = x.split("-");
				$("#carterafac option[value='" + cadena[0] + "']").remove();
			}
		}

		//----------------

		$("#detalleDocumentos option").each(function(){
			ConceptosEdit.documentos[$("#detalleDocumentos option[value='" + $(this).attr('value') + "']").val()] = $("#detalleDocumentos option[value='" + $(this).attr('value') + "']").val();
			ConceptosEdit.guiasRevision[$("#detalleDocumentos option[value='" + $(this).attr('value') + "']").val()] = $("#detalleDocumentos option[value='" + $(this).attr('value') + "']").text();
		});

		$("#detalleDoctosAnexo option").each(function(){
			ConceptosEdit.documentosAnexo[$("#detalleDoctosAnexo option[value='" + $(this).attr('value') + "']").val()] = $("#detalleDoctosAnexo option[value='" + $(this).attr('value') + "']").val();
			ConceptosEdit.guiasRevisionDoctosAnexo[$("#detalleDoctosAnexo option[value='" + $(this).attr('value') + "']").val()] = $("#detalleDoctosAnexo option[value='" + $(this).attr('value') + "']").text();
		});

		$("#detallePuesto option").each(function(){
			ConceptosEdit.puestos[$("#puestos option[value='" + $(this).attr('value') + "']").val()] = $("#puestos option[value='" + $(this).attr('value') + "']").text();
		});

		$("#detallePuesto option").remove();

		for (x in ConceptosEdit.puestos) {
			if (ConceptosEdit.puestos[x]) {
				$('#detallePuesto').append($('<option>', {
					value: x,
					title: $("#puestos option[value='" + x + "']").text(),
					text: $("#puestos option[value='" + x + "']").text()
				}));
				$("#puestos option[value='" + x + "']").remove();
			}
		}

		$("#detalleStatusCredito option").each(function(){
			ConceptosEdit.statusCredito[$("#statusCredito option[value='" + $(this).attr('value') + "']").val()] = $("#statusCredito option[value='" + $(this).attr('value') + "']").text();
		});


		$("#detalleStatusCredito option").remove();

		for (x in ConceptosEdit.statusCredito) {
			if (ConceptosEdit.statusCredito[x]) {
				$('#detalleStatusCredito').append($('<option>', {
					value: x,
					text: $("#statusCredito option[value='" + x + "']").text()
				}));
				$("#statusCredito option[value='" + x + "']").remove();
			}
		}

		$("#detalleColas option").each(function(){
			ConceptosEdit.colas[$("#colas option[value='" + $(this).attr('value') + "']").val()] = $("#colas option[value='" + $(this).attr('value') + "']").text();
		});
		$("#detalleColas option").remove();
		for (x in ConceptosEdit.colas) {
			if (ConceptosEdit.colas[x]) {
				$('#detalleColas').append($('<option>', {
					value: x,
					text: $("#colas option[value='" + x + "']").text()
				}));
				$("#colas option[value='" + x + "']").remove();
			}
		}
		/**/

		$("#detalleUnidadesNegocio option").each(function(){
			ConceptosEdit.unidadesNegocio[$("#unidadesNegocio option[value='" + $(this).attr('value') + "']").val()] = $("#unidadesNegocio option[value='" + $(this).attr('value') + "']").val();
		});
		$("#detalleUnidadesNegocio option").remove();
		for (x in ConceptosEdit.unidadesNegocio) {
			if (ConceptosEdit.unidadesNegocio[x]) {
				$('#detalleUnidadesNegocio').append($('<option>', {
					value: x,
					text: $("#unidadesNegocio option[value='" + x + "']").text()
				}));
				$("#unidadesNegocio option[value='" + x + "']").remove();
			}
		}

		$("#detalleEmpresa option").each(function(){
			ConceptosEdit.empresas[$("#empresas option[value='" + $(this).attr('value') + "']").val()] = $("#empresas option[value='" + $(this).attr('value') + "']").text();
		});
		$("#detalleEmpresa option").remove();
		for (x in ConceptosEdit.empresas) {
			if (ConceptosEdit.empresas[x]) {
				$('#detalleEmpresa').append($('<option>', {
					value: x,
					title: $("#empresas option[value='" + x + "']").text(),
					text: $("#empresas option[value='" + x + "']").text()
				}));
				$("#empresas option[value='" + x + "']").remove();
			}
		}

		$("#detalleFormaspago option").each(function(){
			ConceptosEdit.formaspago[$("#formaspago option[value='" + $(this).attr('value') + "']").val()] = $("#formaspago option[value='" + $(this).attr('value') + "']").text();
		});
		$("#detalleFormaspago option").remove();
		for (x in ConceptosEdit.formaspago) {
			if (ConceptosEdit.formaspago[x]) {
				$('#detalleFormaspago').append($('<option>', {
					value: x,
					title: $("#formaspago option[value='" + x + "']").text(),
					text: $("#formaspago option[value='" + x + "']").text()
				}));
				$("#formaspago option[value='" + x + "']").remove();
			}
		}

		$("#detalleSolucionTramite option").each(function(){
			ConceptosEdit.tipoSolucionTramite[$(this).attr('value')] = $(this).attr('value');
		});
		$("#detalleSolucionTramite option").remove();
		for (x in ConceptosEdit.tipoSolucionTramite) {
			if (ConceptosEdit.tipoSolucionTramite[x]) {
				$('#detalleSolucionTramite').append($('<option>', {
					value: x,
					text: x
				}));
				$("#tipoSolucionTramite option[value='" + x + "']").remove();
			}
		}
		/**
		 * Cargamos los Empleados y puestos seleccionados...
		 */
		//console.log($("#idAutorizadorTipoUmbralMonto1").val());
		ConceptosEdit.buscarEmpleadoPuesto( $("#selTipoUmbralMonto1").val(), $("#idAutorizadorTipoUmbralMonto1").val(), 'autorizadorTipoUmbralMonto1' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selTipoUmbralMonto2").val(), $("#autorizadorTipoUmbralMonto2").val(), 'autorizadorTipoUmbralMonto2' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selTipoUmbralMonto3").val(), $("#autorizadorTipoUmbralMonto3").val(), 'autorizadorTipoUmbralMonto3' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selTipoUmbralMonto3a").val(), $("#autorizadorTipoUmbralMonto3a").val(), 'autorizadorTipoUmbralMonto3a' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selTipoUmbralMonto3b").val(), $("#autorizadorTipoUmbralMonto3b").val(), 'autorizadorTipoUmbralMonto3b' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selAutorizaEtapaCerrada1").val(), $("#idAutorizadorEtapaCerrada1").val(), 'autorizadorEtapaCerrada1' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selAutorizaEtapaAbierta2").val(), $("#idAutorizadorEtapaAbierta2").val(), 'autorizadorEtapaAbierta2' );

		ConceptosEdit.buscarEmpleadoPuesto( $("#selAutorizaCredLiquidados1").val(), $("#idAutorizadorCredLiquidados1").val(), 'autorizadorCredLiquidados1' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selAutorizaCredLiquidados2").val(), $("#idAutorizadorCredLiquidados2").val(), 'autorizadorCredLiquidados2' );

		ConceptosEdit.buscarEmpleadoPuesto( $("#selAutorizaPagosDobles1").val(), $("#idAutorizadorPagosDobles1").val(), 'autorizadorPagosDobles1' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selAutorizaPagosDobles2").val(), $("#idAutorizadorPagosDobles2").val(), 'autorizadorPagosDobles2' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selAutorizaVerificadorFinal1").val(), $("#idAutorizaVerificadorFinal1").val(), 'autorizaVerificadorFinal1' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selAutorizaVerificadorFinal2").val(), $("#idAutorizaVerificadorFinal2").val(), 'autorizaVerificadorFinal2' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selAutorizaVerificadorFinal3").val(), $("#idAutorizaVerificadorFinal3").val(), 'autorizaVerificadorFinal3' );

		ConceptosEdit.buscarEmpleadoPuesto( $("#selExcedenteGasto1").val(), $("#idAutorizadorExcedenteGasto1").val(), 'autorizadorExcedenteGasto1' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selExcedenteGasto2").val(), $("#idAutorizadorExcedenteGasto2").val(), 'autorizadorExcedenteGasto2' );

		//ConceptosEdit.buscarEmpleadoPuesto( $("#selTipoNoFact").val(), $("#idNoFact").val(), 'nombreNoFact' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selTipoNoFact1").val(), $("#idNoFact1").val(), 'nombreNoFact1' );
		ConceptosEdit.buscarEmpleadoPuesto( $("#selTipoNoFact2").val(), $("#idNoFact2").val(), 'nombreNoFact2' );

		/**
		 * ######################################################
		 */
		$( document ).on({
			change : function( e ) {
				e.preventDefault();
				var idcategoria = $(this).val();
				var url = baseUrl + "/catalogos/subcategorias/getsubcategoria";

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
			var res = confirm("¿Eliminar &Aacute:rea concentradora?");
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
					$('#areaConcetradora').removeAttr("readonly");
					$('#areaConcetradora').attr("placeholder", "Titular o área concentradora");
					$('#areaConcetradora').focus();
					$("#divReqImporteFacturacion").show();
					$("#tplTipoSolucionTramiteTitle").show();
					$("#tplTipoSolucionTramite").show();
				} else {
					$('#areaConcetradora').val("");
					$('#idAreaConcetradora').val("");
					$('#areaConcetradora').attr("readonly", "readonly");
					$('#areaConcetradora').attr("placeholder", "Titular o área concentradora");
					$("#divReqImporteFacturacion").hide();
					$("input[name=reqImporteFacturacion]").attr('checked', false);
					$("#tplTipoSolucionTramiteTitle").hide();
					$("#tplTipoSolucionTramite").hide();

					$("#detalleSolucionTramite option").each(function(){
						$("<option value='" + $(this).val() + "'>" + $(this).text() + "</option>").appendTo("#tipoSolucionTramite");
						ConceptosEdit.tipoSolucionTramite[$(this).val()] = null;
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
				if( $(this).val() == 'E' ){
					$('#nombreJefeInmediato').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#nombreJefeInmediato').attr('placeholder' , "Buscar por nivel..." );
				} else {
					$('#nombreJefeInmediato').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#nombreJefeInmediato').val("");
				$('#nombreJefeInmediato').removeAttr("readonly");
				$('#nombreJefeInmediato').focus();
			}
		}, "#selTipoJefeInmediato");

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
				$("#idAutorizadorTipoUmbralMonto1").val("");
				$("#idAutorizadorTipoUmbralMonto2").val("");
				$("#idAutorizadorTipoUmbralMonto3").val("");
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
				} if( $(this).val() == 'P' ){
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
				} else {
					$('#autorizadorExcedenteGasto2').attr('placeholder' , "Buscar por nivel..." );
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
		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				if( $('#etapaCerryVer').val() == "-1" ){
					$('#etapaCerryVer').focus();
					return false;
				}

				ConceptosEdit.cadenaEtapaCerryVer[$('#etapaCerryVer').val()] = $('#etapaCerryVer').val();
				var cadena = '';
				for (x in ConceptosEdit.cadenaEtapaCerryVer) {
					if (ConceptosEdit.cadenaEtapaCerryVer[x]) {
						if(cadena == ''){
							cadena = ConceptosEdit.cadenaEtapaCerryVer[x];
						} else {
							cadena += '|' + ConceptosEdit.cadenaEtapaCerryVer[x];
						}
					}
				}
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
			}
		}, "#addEtapaCerrada");

		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				ConceptosEdit.cadenaEtapaCerryVer = [];
				$( '#cadenaEtapaCerryVer' ).val( "" );

				if( $("#cadenaEtapaCerryVer").val() == "" &&
					$("#cadenaEtapaAbierta").val() == "" &&
					$("#codigoAccionGE").val() == "" &&
					$("#codigoResultadoGE").val() == ""){
					$("#autorizadorEtapaCerrada1").attr("disabled", "disabled");
				}
			}
		}, "#deleteEtapaCerrada");

		//Etapa Cierre Gasto
		$("#addEtapaCierreGasto").click( function(e){
			e.preventDefault();
			if( $('#etapaCierreGasto').val() == "-1" ){
				$('#etapaCierreGasto').focus();
				return false;
			}

			ConceptosEdit.cadenaEtapaCierreGasto[$('#etapaCierreGasto').val()] = $('#etapaCierreGasto').val();
			var cadena = '';
			for (x in ConceptosEdit.cadenaEtapaCierreGasto) {
				if (ConceptosEdit.cadenaEtapaCierreGasto[x]) {
					if(cadena == ''){
						cadena = ConceptosEdit.cadenaEtapaCierreGasto[x];
					} else {
						cadena += '|' + ConceptosEdit.cadenaEtapaCierreGasto[x];
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
				ConceptosEdit.cadenaEtapaCierreGasto = [];
				$('#cadenaEtapaCierreGasto').val( "" );
			}
		}, "#deleteEtapaCierreGasto");
		// end etapa cierre gasto

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

		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorEtapaCerrada1').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else {
					$('#autorizadorEtapaCerrada1').attr('placeholder' , "Buscar por nivel..." );
				}
				$('#autorizadorEtapaCerrada1').val("");
				$('#idAutorizadorEtapaCerrada1').val("");
				$('#autorizadorEtapaCerrada1').removeAttr("disabled");
				$('#autorizadorEtapaCerrada1').removeAttr("readonly");
				$('#autorizadorEtapaCerrada1').focus();
			}
		}, "#selAutorizaEtapaCerrada1");

		//Etapa abierta
		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				if( $('#etapaAbierta').val() == "-1" ){
					$('#etapaAbierta').focus();
					return false;
				}

				ConceptosEdit.cadenaEtapaAbierta[$('#etapaAbierta').val()] = $('#etapaAbierta').val();
				var cadena = '';
				for (x in ConceptosEdit.cadenaEtapaAbierta) {
					if (ConceptosEdit.cadenaEtapaAbierta[x]) {
						if(cadena == ''){
							cadena = ConceptosEdit.cadenaEtapaAbierta[x];
						} else {
							cadena += '|' + ConceptosEdit.cadenaEtapaAbierta[x];
						}
					}
				}
				$('#cadenaEtapaAbierta').val( cadena );
				$('#etapaAbierta').val("");
				$('#etapaAbierta').focus();

				if ( $('#cadenaEtapaAbierta') != "" ){
					if( $("#autorizadorEtapaCerrada1").attr("disabled") == "disabled" ){
						$("#autorizadorEtapaCerrada1").attr("disabled", false);
					}
				} else {
					$( "#autorizadorEtapaCerrada1" ).rules( "remove", "required" );
				}
			}
		}, "#addEtapaAbierta");

		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				ConceptosEdit.cadenaEtapaAbierta = [];
				$('#cadenaEtapaAbierta').val( "" );

				if( $("#cadenaEtapaCerryVer").val() == "" &&
					$("#cadenaEtapaAbierta").val() == "" &&
					$("#codigoAccionGE").val() == "" &&
					$("#codigoResultadoGE").val() == ""){
					$("#autorizadorEtapaCerrada1").attr("disabled", "disabled");
				}
			}
		}, "#deleteEtapaAbierta");

		//Etapa Objetivo leonard
		$("#addEtapaObjetivo").click( function(e){
			e.preventDefault();
			if( $('#etapaObjetivoVer').val() == "-1" ){
				$('#etapaObjetivoVer').focus();
				return false;
			}
			ConceptosEdit.cadenaEtapaObjetivoVer[$('#etapaObjetivoVer').val()] = $('#etapaObjetivoVer').val();
			var cadena = '';
			for (x in ConceptosEdit.cadenaEtapaObjetivoVer) {
				if (ConceptosEdit.cadenaEtapaObjetivoVer[x]) {
					if(cadena == ''){
						cadena = ConceptosEdit.cadenaEtapaObjetivoVer[x];
					} else {
						cadena += '|' + ConceptosEdit.cadenaEtapaObjetivoVer[x];
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
				ConceptosEdit.cadenaEtapaObjetivoVer = [];
				$('#cadenaEtapaObjetivoVer').val( "" );
			}
		}, "#deleteEtapaObjetivo");

		//Etapa Inmediata leonard

		$("#addEtapaInmediata").click( function(e){
			e.preventDefault();
			if( $('#etapaInmediataVer').val() == "-1" ){
				$('#etapaInmediataVer').focus();
				return false;
			}
			ConceptosEdit.cadenaEtapaInmediataVer[$('#etapaInmediataVer').val()] = $('#etapaInmediataVer').val();
			var cadena = '';
			for (x in ConceptosEdit.cadenaEtapaInmediataVer) {
				if (ConceptosEdit.cadenaEtapaInmediataVer[x]) {
					if(cadena == ''){
						cadena = ConceptosEdit.cadenaEtapaInmediataVer[x];
					} else {
						cadena += '|' + ConceptosEdit.cadenaEtapaInmediataVer[x];
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
				ConceptosEdit.cadenaEtapaInmediataVer = [];
				$('#cadenaEtapaInmediataVer').val( "" );
			}
		}, "#deleteEtapaInmediata");

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
				} else {
					$('#autorizadorEtapaAbierta2').attr('placeholder' , "Buscar por nivel..." );
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

		//Pagos dobles
		$( document ).on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorPagosDobles1').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} if( $(this).val() == 'P' ){
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
				} if( $(this).val() == 'P' ){
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
				} if( $(this).val() == 'P' ){
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
				} if( $(this).val() == 'P' ){
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
				} if( $(this).val() == 'P' ){
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

		//Boton Agregar Status Credito
		$("#btnAgregarStatusCredito").click(function( e ){
			e.preventDefault();
			if( $('#statusCredito option').is(':selected') == false ){
				alert("Seleccione el status del Crédito.");
				$('#statusCredito').focus();
				return false;
			}

			$("#statusCredito option:selected").each(function(){
				ConceptosEdit.statusCredito[$(this).val()] = $(this).text();
			});

			$("#statusCredito option:selected").remove();

			$('#detalleStatusCredito').empty();
			for (var elemento in ConceptosEdit.statusCredito){
				if(ConceptosEdit.statusCredito[elemento]){
					$('#detalleStatusCredito').append($('<option>', {
						value: elemento,
						text: ConceptosEdit.statusCredito[elemento]
					}));
				}
			}
			ConceptosEdit.validarStatusCredito();
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
				ConceptosEdit.colas[$(this).val()] = $(this).text();
			});

			$("#colas option:selected").remove();

			$('#detalleColas').empty();
			for (var elemento in ConceptosEdit.colas){
				if(ConceptosEdit.colas[elemento]){
					$('#detalleColas').append($('<option>', {
						value: elemento,
						text: ConceptosEdit.colas[elemento]
					}));
				}
			}
			ConceptosEdit.validarStatusCredito();
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
				//ConceptosEdit.colas[$(this).val()] = $(this).text();
				$("<option value='" + ConceptosEdit.statusCredito[$(this).val()] + "'>" + $(this).text() + "</option>").appendTo("#statusCredito");
				ConceptosEdit.statusCredito[$(this).val()] = null;
			});
			ConceptosEdit.validarStatusCredito();
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
				//ConceptosEdit.colas[$(this).val()] = $(this).text();
				$("<option value='" + ConceptosEdit.colas[$(this).val()] + "'>" + $(this).text() + "</option>").appendTo("#colas");
				ConceptosEdit.colas[$(this).val()] = null;
			});
			ConceptosEdit.validarStatusCredito();
			$("#detalleColas option:selected").remove();
		});

		//Boton Carteras Reembolsable Al Gasto
		$("#btnAddCarteraReembolsableGasto").click(function( e ){
			e.preventDefault();
			$("#msgCarteraReembolsa").addClass('hide');
			if( $('#cartera option').is(':selected') == false ){
				//alert("Seleccione la cartera a agregar.");
				$("#msgCarteraReembolsa").removeClass('hide')
					.html('<strong>Error!: </strong>Seleccione la cartera a agregar.');
				$('#cartera').focus();
				return false;
			}

			if( $("#tipoAsigGasto").val() == "" ){
				///alert("Seleccione el tipo");
				$("#msgCarteraReembolsa").removeClass('hide')
					.html('<strong>Error!: </strong>Seleccione el tipo.');
				$("#tipoAsigGasto").focus();
				return false;
			}

			//-----------------------------
			var carterasfacturabl = [];
			var carterasreembolsa = [];

			var data1 = [];
			$("#cartera option:selected").each(function(){
				if( $(this).val() ) {
					data1 = { 'cartera': $(this).val() , 'valor': $("#tipoAsigGasto").val() }
					carterasfacturabl.push( data1 );
				}
			});

			var data2 = [];
			$("#detalleCarterasFacturableGasto option").each(function(i,item){
				data2 = { 'cartera': $(this).val().split('-')[0] , 'valor': $(this).val().split('-')[1] }
				carterasreembolsa.push( data2 );
			});

			var bndUnable = false;
			var carterano = '';
			$.each(carterasfacturabl,function(i,item1){
				$.each(carterasreembolsa,function(j,item2){
					if( item1.cartera == item2.cartera ){
						if( item1.valor == 'SI' && item2.valor == 'SI' ) {
							bndUnable = true;
							carterano = item1.cartera;
						}
					}
				});
			});

			if( bndUnable ){
				$("#msgCarteraReembolsa").removeClass('hide').html('<strong>Error!: </strong> La cartera '+carterano+' NO puede ser reembolsable');
				return false;
			}
			//---------------------------

			$("#cartera option:selected").each(function(){
				ConceptosEdit.carterasAsignadas[$(this).val() + '-' + $("#tipoAsigGasto").val()] = $(this).val() + ' - ' + $("#tipoAsigGasto").val();
			});

			$("#cartera option:selected").remove();

			$('#detalleCarterasAsignadasAlGasto').empty();
			for (var elemento in ConceptosEdit.carterasAsignadas){
				if(ConceptosEdit.carterasAsignadas[elemento]){
					$('#detalleCarterasAsignadasAlGasto').append($('<option>', {
						value: elemento,
						title: ConceptosEdit.carterasAsignadas[elemento],
						text: ConceptosEdit.carterasAsignadas[elemento]
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

			$("#detalleCarterasAsignadasAlGasto option:selected").each(function(){
				var cadena = $(this).val();
				var res = cadena.split("-");
				$("<option value='" + res[0] + "' title='" + res[0] + "'>" + res[0] + "</option>").appendTo("#cartera");
				ConceptosEdit.carterasAsignadas[$(this).val()] = null;
			});

			$("#detalleCarterasAsignadasAlGasto option:selected").remove();
			return false;

		});


		//----------------------- DEV

		//Boton Carteras Facturable Al Gasto
		$("#btnAddCarteraFacturableGasto").click(function( e ){
			e.preventDefault();
			$("#msgCarteraFactura").addClass('hide');
			if( $('#carterafac option').is(':selected') == false ){
				$("#msgCarteraFactura").removeClass('hide').html('<strong>Error!: </strong>Seleccione la cartera a agregar.');
				$('#carterafac').focus();
				return false;
			}

			if( $("#tipoAsigGastoFac").val() == "" ){
				$("#msgCarteraFactura").removeClass('hide').html('<strong>Error!: </strong>Seleccione el tipo.');
				$("#tipoAsigGastoFac").focus();
				return false;
			}

			var carterasfacturabl = [];
			var carterasreembolsa = [];

			var data1 = [];
			$("#carterafac option:selected").each(function(){
				if( $(this).val() ) {
					//carterasfacturabl[$(this).val()] = $("#tipoAsigGastoFac").val();
					data1 = { 'cartera': $(this).val() , 'valor': $("#tipoAsigGastoFac").val() }
					carterasfacturabl.push( data1 );
				}
			});

			var data2 = [];
			$("#detalleCarterasAsignadasAlGasto option").each(function(i,item){
				data2 = { 'cartera': $(this).val().split('-')[0] , 'valor': $(this).val().split('-')[1] }
				carterasreembolsa.push( data2 );
			});

			var bndUnable = false;
			var carterano = '';
			$.each(carterasfacturabl,function(i,item1){
				$.each(carterasreembolsa,function(j,item2){
					if( item1.cartera == item2.cartera ){
						if( item1.valor == 'SI' && item2.valor == 'SI' ) {
							bndUnable = true;
							carterano = item1.cartera;
						}
					}
				});
			});

			if( bndUnable ){
				$("#msgCarteraFactura").removeClass('hide').html('<strong>Error!: </strong> La cartera '+carterano+' NO  puede ser facturable');
				return false;
			}

			$("#carterafac option:selected").each(function(){
				ConceptosEdit.carterasFactura[$(this).val() + '-' + $("#tipoAsigGastoFac").val()] = $(this).val() + ' - ' + $("#tipoAsigGastoFac").val();
			});

			$("#carterafac option:selected").remove();

			$('#detalleCarterasFacturableGasto').empty();
			for (var elemento in ConceptosEdit.carterasFactura){
				if(ConceptosEdit.carterasFactura[elemento]){
					$('#detalleCarterasFacturableGasto').append($('<option>', {
						value: elemento,
						title: ConceptosEdit.carterasFactura[elemento],
						text: ConceptosEdit.carterasFactura[elemento]
					}));
				}
			}
			return false;
		});

		$("#btnQuitCarteraFacturableGasto").click(function( e ){
			e.preventDefault();

			var haySeleccionados = false;
			$('#detalleCarterasFacturableGasto option').each(function() {
				if (this.selected)
					haySeleccionados = true;
			});

			if( !haySeleccionados ) {
				alert("Debe seleccionar la cartera a eliminar.");
				return false;
			}

			$("#detalleCarterasFacturableGasto option:selected").each(function(){
				var cadena = $(this).val();
				var res = cadena.split("-");
				$("<option value='" + res[0] + "' title='" + res[0] + "'>" + res[0] + "</option>").appendTo("#carterafac");
				ConceptosEdit.carterasFactura[$(this).val()] = null;
			});

			$("#detalleCarterasFacturableGasto option:selected").remove();
			return false;

		});


		//-----------------------

		$( document ).on({
			keypress : function( event ) {
				if ( event.which == 13 && $.trim( $(this).val() ) != "" ) {
					event.preventDefault();
					for (x in ConceptosEdit.documentos) {
						if (ConceptosEdit.documentos[x] == $('#documentos').val()) {
							alert("El documento ya ha sido agregado"); return false;
						}
					}

					$('#detalleDocumentos').append($('<option>', {
						value: $('#documentos').val(),
						text: $('#documentos').val()
					}));

					ConceptosEdit.documentos[$('#documentos').val()] = $('#documentos').val();
					$('#documentos').val("");
				}
			}
		}, "#documentos");

		$( document ).on({
			keypress : function( event ) {
				if ( event.which == 13 && $.trim( $(this).val() ) != "" ) {
					event.preventDefault();
					for (x in ConceptosEdit.documentosAnexo) {
						if (ConceptosEdit.documentosAnexo[x] == $('#doctosAnexo').val()) {
							alert("El documento ya ha sido agregado"); return false;
						}
					}

					$('#detalleDoctosAnexo').append($('<option>', {
						value: $('#doctosAnexo').val(),
						text: $('#doctosAnexo').val()
					}));

					ConceptosEdit.documentosAnexo[$('#doctosAnexo').val()] = $('#doctosAnexo').val();
					$('#doctosAnexo').val("");
				}
			}
		}, "#doctosAnexo");

		//Boton Documentos
		$("#btnAgregarDocumento").click(function( e ){
			e.preventDefault();

			if(!$('#documentos').val()){
				alert("Ingrese el nombre del documento");
				$('#documentos').focus(); return false;
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

			for (x in ConceptosEdit.documentos) {
				//if (ConceptosEdit.documentos[x] == $('#documentos').val()) {
				if (x == $('#documentos').val()) {
					alert("El documento ya ha sido agregado"); return false;
				}
			}

			$('#detalleDocumentos').append($('<option>', {
				value: $('#documentos').val(),
				title: $('#documentos').val() + '[' + $('#opcionalDocSop').val() + ']' + ' * ' + $('#guiaRevision').val(),
				text: $('#documentos').val() + '[' + $('#opcionalDocSop').val() + ']' + ' * ' + $('#guiaRevision').val()
			}));
			ConceptosEdit.documentos[$('#documentos').val()] = $('#documentos').val() + '[' + $('#opcionalDocSop').val() + ']';
			ConceptosEdit.guiasRevision[$('#documentos').val()] = $('#documentos').val() + '[' + $('#opcionalDocSop').val() + ']' + ' * ' + $('#guiaRevision').val();

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
			ConceptosEdit.documentos[$('#detalleDocumentos').val()] = null;
			ConceptosEdit.guiasRevision[$('#detalleDocumentos').val()] = null;
			$("#detalleDocumentos option:selected").remove();
			return false;
		});
		//Boton Documentos Anexos
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

			for (x in ConceptosEdit.documentosAnexo) {
				//if (ConceptosEdit.documentosAnexo[x] == $('#doctosAnexo').val()) {
				if (x == $('#doctosAnexo').val()) {
					alert("El documento ya ha sido agregado"); return false;
				}
			}

			$('#detalleDoctosAnexo').append($('<option>', {
				value: $('#doctosAnexo').val(),
				title: $('#doctosAnexo').val() + '[' + $('#opcionalDocIni').val() + ']' + ' * ' + $('#guiaRevisionDocIni').val(),
				text: $('#doctosAnexo').val() + '[' + $('#opcionalDocIni').val() + ']' + ' * ' + $('#guiaRevisionDocIni').val()
			}));

			ConceptosEdit.documentosAnexo[$('#doctosAnexo').val()] = $('#doctosAnexo').val() + '[' + $('#opcionalDocIni').val() + ']';
			ConceptosEdit.guiasRevisionDoctosAnexo[$('#doctosAnexo').val()] = $('#doctosAnexo').val() + '[' + $('#opcionalDocIni').val() + ']' + ' * ' +  $('#guiaRevisionDocIni').val();
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
			ConceptosEdit.documentosAnexo[$('#detalleDoctosAnexo').val()] = null;
			ConceptosEdit.guiasRevisionDoctosAnexo[$('#detalleDoctosAnexo').val()] = null;
			$("#detalleDoctosAnexo option:selected").remove();
			return false;
		});
		//Boton Puestos
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

			for (x in ConceptosEdit.puestos) {
				if (ConceptosEdit.puestos[x] == $("#puestos option:selected").val() ) {
					alert("El puesto ya ha sido agregado");
					return false;
				}
			}

			$("#puestos option:selected").each(function(){
				ConceptosEdit.puestos[$(this).val()] = $(this).text();
			});

			$("#puestos option:selected").remove();

			$('#detallePuesto').empty();
			for (var elemento in ConceptosEdit.puestos){
				if(ConceptosEdit.puestos[elemento]){
					$('#detallePuesto').append($('<option>', {
						value: elemento,
						title: ConceptosEdit.puestos[elemento],
						text: ConceptosEdit.puestos[elemento]
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
				$("#detallePuesto").focus();
				return false;
			}

			$("#detallePuesto option:selected").each(function(){
				$("<option value='" + $(this).val() + "' title='" + $(this).text() + "'>" + $(this).text() + "</option>").appendTo("#puestos");
				ConceptosEdit.puestos[$(this).val()] = null;
			});

			$("#detallePuesto option:selected").remove();
			return false;
		});


		//Boton Unidades de negocio
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

			for (x in ConceptosEdit.unidadesNegocio) {
				//Solo permite una sola unidade de negocio
				if (ConceptosEdit.unidadesNegocio[x]){
					alert("Ya existe un puesto agregado. Elimine y agregue de nuevo.");
					$('#unidadesNegocio').focus();
					return false;
				}
				//Valida que la unidad de negocio ya haya sido agregada
				if (ConceptosEdit.unidadesNegocio[x] == $("#unidadesNegocio option:selected").val() ) {
					alert("El puesto ya ha sido agregado");
					return false;
				}
			}
			$('#detalleUnidadesNegocio').append($('<option>', {
				value: $("#unidadesNegocio option:selected").val(),
				title: $("#unidadesNegocio option:selected").text(),
				text: $("#unidadesNegocio option:selected").text()
			}));
			ConceptosEdit.unidadesNegocio[$("#unidadesNegocio option:selected").val()] = $("#unidadesNegocio option:selected").val();
			console.log(ConceptosEdit.unidadesNegocio);

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

			$("<option value='" + ConceptosEdit.unidadesNegocio[$('#detalleUnidadesNegocio').val()] + "'>" + $("#detalleUnidadesNegocio option:selected").text() + "</option>").appendTo("#unidadesNegocio");

			ConceptosEdit.unidadesNegocio[$('#detalleUnidadesNegocio').val()] = null;
			$("#detalleUnidadesNegocio option:selected").remove();
		});

		//Boton Agregar Empresas a Facturar
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

			for (x in ConceptosEdit.empresas) {
				if (ConceptosEdit.empresas[x] == $("#empresas option:selected").val() ) {
					alert("El puesto ya ha sido agregado");
					return false;
				}
			}

			$("#empresas option:selected").each(function(){
				ConceptosEdit.empresas[$(this).val()] = $(this).text();
			});

			$("#empresas option:selected").remove();

			$('#detalleEmpresa').empty();
			for (var elemento in ConceptosEdit.empresas){
				if(ConceptosEdit.empresas[elemento]){
					$('#detalleEmpresa').append($('<option>', {
						value: elemento,
						title: ConceptosEdit.empresas[elemento],
						text: ConceptosEdit.empresas[elemento]
					}));
				}
			}










			/*
			 for (x in ConceptosEdit.empresas) {
			 if (ConceptosEdit.empresas[x] == $("#empresas option:selected").val() ) {
			 alert("La empresa ya ha sido agregada");
			 return false;
			 }
			 }

			 $('#detalleEmpresa').append($('<option>', {
			 value: $("#empresas option:selected").val(),
			 text: $("#empresas option:selected").text()
			 }));

			 ConceptosEdit.empresas[$("#empresas option:selected").val()] = $("#empresas option:selected").val();

			 $("#empresas option:selected").remove();

			 $('#empresas').val("");
			 */
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
				$("<option value='" + $(this).val() + "' title='" + $(this).text() + "'>" + $(this).text() + "</option>").appendTo("#empresas");
				ConceptosEdit.empresas[$(this).val()] = null;
			});

			$("#detalleEmpresa option:selected").remove();
			/*
			 $("<option value='" + ConceptosEdit.empresas[$('#detalleEmpresa').val()] + "'>" + $('#detalleEmpresa option:selected').text() + "</option>").appendTo("#empresas");

			 ConceptosEdit.empresas[$('#detalleEmpresas').val()] = null;
			 $("#detalleEmpresa option:selected").remove();
			 */
			return false;
		});

		//Boton Agregar Formas de Pago
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

			for (x in ConceptosEdit.formaspago) {
				if (ConceptosEdit.formaspago[x] == $("#formaspago option:selected").val() ) {
					alert("La forma de pago ya ha sido agregado");
					return false;
				}
			}
			$("#formaspago option:selected").each(function(){
				ConceptosEdit.formaspago[$(this).val()] = $(this).text();
			});

			$("#formaspago option:selected").remove();

			$('#detalleFormaspago').empty();
			for (var elemento in ConceptosEdit.formaspago){
				if(ConceptosEdit.formaspago[elemento]){
					$('#detalleFormaspago').append($('<option>', {
						value: elemento,
						title: ConceptosEdit.formaspago[elemento],
						text: ConceptosEdit.formaspago[elemento]
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
				$("<option value='" + $(this).val() + "' title='" + $(this).text() + "'>" + $(this).text() + "</option>").appendTo("#formaspago");
				ConceptosEdit.formaspago[$(this).val()] = null;
			});

			$("#detalleFormaspago option:selected").remove();
			return false;
		});
		//Boton Agregar Tipos de solución de Trámite
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

			for (x in ConceptosEdit.tipoSolucionTramite) {
				if (ConceptosEdit.tipoSolucionTramite[x] == $("#tipoSolucionTramite option:selected").val() ) {
					alert("El tipo de solución ya ha sido agregado");
					return false;
				}
			}

			$("#tipoSolucionTramite option:selected").each(function(){
				ConceptosEdit.tipoSolucionTramite[$(this).val()] = $(this).text();
			});

			$("#tipoSolucionTramite option:selected").remove();

			$('#detalleSolucionTramite').empty();
			for (var elemento in ConceptosEdit.tipoSolucionTramite){
				if(ConceptosEdit.tipoSolucionTramite[elemento]){
					$('#detalleSolucionTramite').append($('<option>', {
						value: elemento,
						text: ConceptosEdit.tipoSolucionTramite[elemento]
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
				ConceptosEdit.tipoSolucionTramite[$(this).val()] = null;
			});

			$("#detalleSolucionTramite option:selected").remove();
			return false;
		});
		/**
		 * Boton Guardar Concepto
		 */

		$("#btnActualizarConcepto").click(function(e){
			e.preventDefault();
			$("#frmAddConceptos").submit();
			return false;
		});

		$("#btnCancelarConcepto").click(function(e){
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


		//===================================================================
		// NUEVAS ALERTAS
		//
		$("#diFechaEjecucion").change(function(){
			if( this.checked ) {
				$('#selFechaEjecucion').removeAttr('disabled');
				$('#autorizadorFechaEjecucion').removeAttr('readonly');
			} else {
				$('#selFechaEjecucion').attr('disabled', true);
				$('#autorizadorFechaEjecucion').prop('readonly', true);
			}
		});

		$( "#selFechaEjecucion" ).off('change').on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorFechaEjecucion').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorFechaEjecucion').attr('placeholder' , "Define nivel..." );
				} else {
					$('#autorizadorFechaEjecucion').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorFechaEjecucion').removeAttr("readonly");
				$('#autorizadorFechaEjecucion').val("");
				$('#autorizadorFechaEjecucion').focus();
			}
		});

		$("#removeAutorizadorFechaEjecucion").click( function( e ){
			var res = confirm("¿Eliminar Autorizador?");
			if(res){
				$("#autorizadorFechaEjecucion").val("");
				$("#idAutorizadorFechaEjecucion").val("");
				$("#autorizadorFechaEjecucion").removeAttr("readonly");
			}
		});

		$("#diAlertAsignacion").change(function(){
			if( this.checked ) {
				$('#selAlertAsignacion').removeAttr('disabled');
				$('#autorizadorAlertAsignacion').removeAttr('readonly');
			} else {
				$('#selAlertAsignacion').attr('disabled', true);
				$('#autorizadorAlertAsignacion').prop('readonly', true);
			}
		});

		$( "#selAlertAsignacion" ).off('change').on({
			change : function( e ) {
				if( $(this).val() == 'E' ){
					$('#autorizadorAlertAsignacion').attr('placeholder' ,"Buscar por nombre del empleado..." );
				} else if( $(this).val() == 'P' ){
					$('#autorizadorAlertAsignacion').attr('placeholder' , "Define nivel..." );
				} else {
					$('#autorizadorAlertAsignacion').attr('placeholder' , "Buscar por puesto..." );
				}
				$('#autorizadorAlertAsignacion').removeAttr("readonly");
				$('#autorizadorAlertAsignacion').val("");
				$('#autorizadorAlertAsignacion').focus();
			}
		});

		$("#removeAutorizadorAlertAsignacion").click( function( e ){
			var res = confirm("¿Eliminar Autorizador?");
			if(res){
				$("#autorizadorAlertAsignacion").val("");
				$("#idAutorizadorAlertAsignacion").val("");
				$("#autorizadorAlertAsignacion").removeAttr("readonly");
			}
		});

		//===================================================================

		$("#frmAddConceptos").validate({
			rules: {
				categoria: 			"required",
				subcategoria: 		"required",
				descripcionConcepto:"required",
				cuentaContable: 	"required",
				cuentaIngresos: 	"required",
				numeroCotizaciones: "required",
				costoInterno: 		"required",
				//areaConcetradora:   "required",
				valMaxAnticipo: {
					required: true,
					range: [0, 100]
				}
			},
			messages: {
				categoria: "Ingrese el nombre de la categoria",
				subcategoria: "Ingrese el nombre de la subcategoria",
				descripcionConcepto: "Ingrese el nombre del concepto",
				cuentaContable: "Ingrese la cuenta contable",
				cuentaIngresos: "Ingrese la cuenta de ingresos",
				valMaxAnticipo: "El porcentaje debe ser de 0 a 100"
			},
			submitHandler: function(form) {
				if( $.trim($("#selReqAutoriza").val()) == "O" ){
					if(  $.trim($("#idJefeInmediato").val()) == "" || $.trim($("#nombreJefeInmediato").val()) == ""){
						$( "#nombreJefeInmediato" ).after( '<label id="validaNombreJefeInmediato" class="error">Ingrese el jefe inmediato.</label>' );
						$( "#nombreJefeInmediato" ).focus();
						return false;
					}
				} else {
					$("#validaNombreJefeInmediato").remove();
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
				montoUmbral1: 			"required",
				porCentajeUmbralDel1: 		"required",
				porCentajeUmbralAl1:"required",
				montoUmbral2: 	"required",
				porCentajeUmbralDel2: 	"required",
				porCentajeUmbralAl2: "required"
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
						$( "#removeAutorizadorTipoUmbralMonto3" ).after( '<label for="autorizadorTipoUmbralMonto3" class="error">Ingrese el autorizador 3.</label>' );
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
				/**
				 if( $("#idAutorizadorExcedenteGasto1").val() == "" || $.trim($("#autorizadorExcedenteGasto1").val()) == "" ){
							$( "#removeAutorizadorExcedenteGasto1" ).after( '<label for="autorizadorExcedenteGasto1" class="error">Ingrese el autorizador 1.</label>' );
							return false;
						}

				 if( $("#idAutorizadorExcedenteGasto2").val() == "" || $.trim($("#autorizadorExcedenteGasto2").val()) == "" ){
							$( "#removeAutorizadorExcedenteGasto2" ).after( '<label for="autorizadorExcedenteGasto2" class="error">Ingrese el autorizador 2.</label>' );
							return false;
						}
				 */
				$("#frmConceptos3").submit();
				return false;
			}
		});

		$("#frmConceptos3").validate({
			rules: {
				tipoDemanda: "required"
			},
			messages: {
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
					for (x in ConceptosEdit.tipoSolucionTramite) {
						if ( ConceptosEdit.tipoSolucionTramite[x] ) {
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
				var carterasFactura = '';
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

				//Cadena de carteras Reembolsables
				for (x in ConceptosEdit.carterasAsignadas) {
					if ( ConceptosEdit.carterasAsignadas[x] ) {
						carterasAsignadas += x + '|';
					}
				}

				//Cadena de carteras Facturables
				for (x in ConceptosEdit.carterasFactura) {
					if ( ConceptosEdit.carterasFactura[x] ) {
						carterasFactura += x + '|';
					}
				}

				//Cadena de documentos
				for (x in ConceptosEdit.documentos) {
					if ( ConceptosEdit.documentos[x] ) {
						documentos += ConceptosEdit.guiasRevision[x] + '|';
					}
				}
				//Cadena de documentos Anexos
				for (x in ConceptosEdit.documentosAnexo) {
					if ( ConceptosEdit.documentosAnexo[x] ) {
						documentosAnexo += ConceptosEdit.guiasRevisionDoctosAnexo[x] + '|';
					}
				}
				//Cadena de puestos
				for (x in ConceptosEdit.puestos) {
					if ( ConceptosEdit.puestos[x] ) {
						puestos += x + '|';
					}
				}
				//Cadena de unidades Negocio
				for (x in ConceptosEdit.unidadesNegocio) {
					if ( ConceptosEdit.unidadesNegocio[x] ) {
						unidadesNegocio += ConceptosEdit.unidadesNegocio[x] + '|';
					}
				}
				//Cadena de Empresas a facturar
				for (x in ConceptosEdit.empresas) {
					if ( ConceptosEdit.empresas[x] ) {
						empresasFacturar += x + '|';
					}
				}

				//Cadena de Formas de pago
				for (x in ConceptosEdit.formaspago) {
					if ( ConceptosEdit.formaspago[x] ) {
						formasPago += x + '|';
					}
				}
				//Cadena de Tipo de solucion Tramite
				for (x in ConceptosEdit.tipoSolucionTramite) {
					if ( ConceptosEdit.tipoSolucionTramite[x] ) {
						tipoSolucionTramite += x + '|';
					}
				}

				//Cadena de Guias de revisión
				for (x in ConceptosEdit.guiasRevision) {
					if ( ConceptosEdit.guiasRevision[x] ) {
						guiasRevision += ConceptosEdit.guiasRevision[x] + '|';
					}
				}

				//Cadena Creditos Liquidados
				for (x in ConceptosEdit.statusCredito) {
					if ( ConceptosEdit.statusCredito[x] ) {
						cadenaCredLiquidados += x + '|';
					}
				}
				//Cadena Creditos Colas
				for (x in ConceptosEdit.colas) {
					if ( ConceptosEdit.colas[x] ) {
						cadenaCredColas += ConceptosEdit.colas[x] + '|';
					}
				}

				var frmAddConceptos = $("#frmAddConceptos").serialize();
				var frmConceptos2 = $("#frmConceptos2").serialize();
				var frmConceptos3 = $("#frmConceptos3").serialize();
				var frmConceptos4 = $("#frmConceptos4").serialize();
				var frmConceptos5 = $("#frmConceptos5").serialize();
				var frmConceptos6 = $("#frmConceptos6").serialize();
				$.ajax({
					url: baseUrl + '/catalogos/conceptos/setconcepto',
					type: 'POST',
					dataType: 'json',
					data: $("#frmAddConceptos").serialize() +
					'&' + $("#frmConceptos2").serialize() +
					'&' + $("#frmConceptos3").serialize() +
					'&' + $("#frmConceptos4").serialize() +
					'&' + $("#frmConceptos5").serialize() +
					'&' + $("#frmConceptos6").serialize() +
					'&carterasAsignadas=' + carterasAsignadas +
					'&carterasFacturable=' + carterasFactura +
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

					success: function(data) {
						if( data.success == '0'){
							var userid = $('#userid').html();
							Layout.showLoading();
							$.ajax({
								url: baseUrl + '/catalogos/conceptos/index',
								type: 'GET',
								data: {userid: userid, categoria:$('#categoria').val(), subcategoria:$('#subcategoria').val()},
								dataType: 'html',
								success: function(data) {
									$('#catalogo-content').html(data);
									Layout.hideLoading();
									//$('#consulta-conceptos-grid').jqGrid('clearGridData').jqGrid('setGridParam', { data: results }).trigger('reloadGrid', [{ page: 1}]);
								}
							});
						}

						return false;
					}
				});
				return false;

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
	},
	buscarEmpleadoPuesto : function(tipo, id, input){
		var url = baseUrl + '/catalogos/sucursales/gettitular';
		if( tipo == 'P' ){
			url = baseUrl + '/catalogos/conceptos/getpuesto';
			return false;
		}
		if( tipo == 'T' ){
			url = baseUrl + '/catalogos/puestos/getpuesto';
		}

		if( !id || !tipo ){
			return false;
		}

		$.ajax({
			type: "POST",
			url: url,
			data: {id: id},
			dataType: 'json',
			success: function (data) {
				console.log('R10: '+data)
				if (data.respuesta == 'success') {
					$('#' + input).val(data.items[0]['nombre']);
				} else {
					$('#' + input).val('');
				}
			}
		});

	},// End buscarEmpleadoPuesto()
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
		for (var elemento in ConceptosEdit.statusCredito){
			if(ConceptosEdit.statusCredito[elemento]){
				tamStatusCred++;
			}
		}
		var tamColas = 0;
		for (var elemento in ConceptosEdit.colas){
			if(ConceptosEdit.colas[elemento]){
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
		if( ConceptosEdit.isNumberKey(evt) == false ){
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
				ConceptosEdit.arrgEtapasTareas[$(this).val()] = $(this).text();
			});

			$("#detalleStatusEstapas option:selected").remove();
			$('#detalleStatusEstapas').empty();

			ConceptosEdit.arrgEtapasTareasId = [];
			for (var elemento in ConceptosEdit.arrgEtapasTareas){
				if(ConceptosEdit.arrgEtapasTareas[elemento]){
					ConceptosEdit.arrgEtapasTareasId.push(elemento);
					$('#detalleStatusEstapas').append($('<option>', {
						value: elemento,
						text: ConceptosEdit.arrgEtapasTareas[elemento],
					}));
				}
			}
			//Almaceno valores en el campo para la BD
			$("#FCCLASIFICACIONTAREA").val(ConceptosEdit.arrgEtapasTareasId.toString());
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
				ConceptosEdit.arrgEstadoTarea[$(this).val()] = $(this).text();
			});

			$("#detalleEstadoTarea option:selected").remove();
			$('#detalleEstadoTarea').empty();

			ConceptosEdit.arrgEstadoTareaId = [];
			for (var elemento in ConceptosEdit.arrgEstadoTarea){
				if(ConceptosEdit.arrgEstadoTarea[elemento]){

					ConceptosEdit.arrgEstadoTareaId.push(elemento);

					$('#detalleEstadoTarea').append($('<option>', {
						value: elemento,
						text: ConceptosEdit.arrgEstadoTarea[elemento],
					}));
				}
			}
			//Almaceno valores en el campo para la BD
			$("#FCESTATUSTAREA").val(ConceptosEdit.arrgEstadoTareaId.toString());
			$('#selEstadoTarea').focus();
			return false;
		});
	},
	eventoEliminarAutorizadorEstatusTareas: function(){
		$( "#btnRemoveAutorizadorEstadoEtapa" ).off().on( "click", function() {
			var res = confirm("¿Desea eliminar este autorizador?");
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

				console.log(ConceptosEdit.arrgEtapasTareas);
				var i = 0;
				$("#detalleStatusEstapas option:selected").each(function(){
					ConceptosEdit.arrgEtapasTareas[$(this).val()] = null;
				});
				$("#detalleStatusCredito option:selected").remove();

				ConceptosEdit.arrgEtapasTareasTemp = [];
				ConceptosEdit.arrgEtapasTareas.forEach(function (elemento, indice, array) {
					if (ConceptosEdit.arrgEtapasTareas[indice] != null){
						ConceptosEdit.arrgEtapasTareasTemp.push(indice);
					}
				});
				//Almaceno valores en el campo para la BD
				$("#FCCLASIFICACIONTAREA").val(ConceptosEdit.arrgEtapasTareasTemp.toString());
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
				ConceptosEdit.arrgEstadoTarea[$(this).val()] = null;
			});
			$("#detalleEstadoTarea option:selected").remove();

			ConceptosEdit.arrgEstadoTareaTemp = [];
			ConceptosEdit.arrgEstadoTarea.forEach(function (elemento, indice, array) {
				if (ConceptosEdit.arrgEstadoTarea[indice] != null){
					ConceptosEdit.arrgEstadoTareaTemp.push(indice);
				}
			});
			//Almaceno valores en el campo para la BD
			$("#FCESTATUSTAREA").val(ConceptosEdit.arrgEstadoTareaTemp.toString());
			$("#detalleEstadoTarea option:selected").remove();


		});

	},
};

ConceptosEdit.init();