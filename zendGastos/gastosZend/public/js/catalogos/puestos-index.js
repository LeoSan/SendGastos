var PuestosIndex = {
		puestosAgregados : [],
		init : function() {
			//alert("Hola como estas?");
			//var baseUrl = '/cuentas/public';
			
			$(".grid-title").html("Puestos / Catálogos");
			
                        PuestosIndex.renderGrid();
			$("#btnShowAgregarPuesto").click(function(e){
				$("#lblModalAgregarPuesto").html("Agregar puesto");
				$('#modalAgregarPuesto').modal();
			});
			
//			$(".editarPuesto").click(function(e){
//				var idPuesto = $(this).attr('id-rel');
//				var puestoDesc = $(this).attr('rel-desc');
//				$("#frmAgregarPuesto #id_puesto").val(idPuesto);
//				$("#frmAgregarPuesto #descripcion_puesto").val(puestoDesc);
//				$("#frmAgregarPuesto #tipo_puesto").val("MOD");
//				$("#lblModalAgregarPuesto").html("Editar puesto: " + puestoDesc);
//				$('#modalAgregarPuesto').modal('show');
//			});
                        
                        $(document).on({
                            click : function(e){
                                e.preventDefault();
                                var idPuesto = $(this).attr('id-rel');
				var puestoDesc = $(this).attr('rel-desc');
				$("#frmAgregarPuesto #id_puesto").val(idPuesto);
				$("#frmAgregarPuesto #descripcion_puesto").val(puestoDesc);
				$("#frmAgregarPuesto #tipo_puesto").val("MOD");
				$("#lblModalAgregarPuesto").html("Editar puesto: " + puestoDesc);
				$('#modalAgregarPuesto').modal('show');       
                                
                            }
                        },".editarPuesto");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					/*
					var selected = $(this).find(':selected').val();
					
					if( $(this).val() == 'DEL' ){
						var res = confirm("¿Esta seguro que desea eliminar el registro?");
						if( !res ){
							$(this).val(selected);
							return false;
						}
					}
					*/
					var tipo = "";
					var status = $(this).val();
					if( $(this).val() == 'DEL' ){
						tipo = "DEL";
					} else {
						tipo = "MOD";
					}
					
					
					//$("#frmAgregarEmpleado").serialize() + '&userid=' + $("#noEmpleado").html()
					var idEmpleado = $(this).attr("id-rel");
					var idpuesto = $(this).attr("idpuesto");
					var url = baseUrl + "/catalogos/puestos/setpuestoempleado";
					$.ajax({
						type: "POST",
						url: url,
						data: {tipo: tipo, id_puesto: idpuesto, id_empleado: idEmpleado, status: status, userid: $("#noEmpleado").html()},
						dataType: 'json',
						success: function(data) {
							console.log(data); //return false;
							if( $(this).val() == 'DEL' ){
								PuestosIndex.listarEmpleadosPorPuesto(idpuesto);
							} else {
								alert("Ocurrio un error: " + data.msg);
								return false;
							}
							
						}
					});
				}
			}, ".statusEmPue");
			/*
			$(".statusEmPue").change(function(e){
				e.preventDefault();
				alert("Opcion seleccionado: " + $(this).val());
			});
			*/
			$("#btnGuardarPuesto").click(function(e){
				e.preventDefault();
				
				if( $.trim( $("#frmAgregarPuesto #descripcion_puesto").val() ) == "" ) {  
		            alert("Ingrese la descripción puesto.");
		            $("#frmAgregarPuesto #descripcion_puesto").focus();
		            return false;
		        }
				var url = baseUrl + "/catalogos/puestos/setpuesto";
				$.ajax({
					type: "POST",
					url: url,
					data: $("#frmAgregarPuesto").serialize(),
					dataType: 'json',
					success: function(data) {
						//console.log(data); return false;
						if( data.success == "0"){
							$('#modalAgregarPuesto').modal('hide');
							Menu.loadModuleMenu('catalogos', 'puestos', 'index', '#');
						} else {
							alert("Ocurrio un error: " + data.msg);
							return false;
						}
						
					}
				});
			});
			
//			$(".agregarEmpleado").click(function(e){
//
//			});
                        
                        $(document).on({
                            click : function(e){
                            e.preventDefault();
                            				var id_puesto = $(this).attr('id-rel');
				var puestoDesc = $(this).attr('rel-desc');
				$("#lblPuestoDescripcion").html("Puesto: " + puestoDesc);
				$("#frmAgregarEmpleado #id_puesto").val(id_puesto);
				PuestosIndex.listarEmpleadosPorPuesto(id_puesto);
				$('#modalAgregarEmpleado').modal();
				return false;
				//Llenamos los puestos disponibles
				var idPuesto = $(this).attr('id-rel');
				var nivelDesc = $(this).attr('rel-desc');
				var url = baseUrl + "/catalogos/niveles/getpuestosdisponibles";
				var baseUrlPuestosAgredos = baseUrl + "/catalogos/niveles/getpuestosagregados";
				
				if(!idPuesto){
					$( "#idPuestoDisponible" ).find('option').remove().end();
					$( "#idPuestoDisponible" ).append('<option value="">- Seleccione -</option>');
				}
				
				Layout.showLoading();
				
				$("#lblNivelDescripcion").html("Nivel: " + nivelDesc);
				
				$("#descNivel").val(nivelDesc);
				$("#idNivel").val(idPuesto);
				
				$.ajax({
					type: "POST",
					url: baseUrlPuestosAgredos,
					data: { id: idPuesto },
					dataType: 'json',
					success: function(data) {
						//console.log(data); return false;
						$( "#idPuestoAgregado" ).find('option').remove().end();
						//$( "#idPuestoDisponible" ).append('<option value="">- Seleccione -</option>');
						$.each(data.puestos, function (i, item) {
							PuestosIndex.puestosAgregados[item.IDVALOR] = item.DESCRIP;
							$( "#idPuestoAgregado" ).append('<option value="' + item.IDVALOR + '">' + item.DESCRIP + '</option>');
							//console.log(item.NMDESCRIP);
					    });
						
						//$('#modalAsociarPuesto').modal();
					}
				});
				
				$.ajax({
					type: "POST",
					url: url,
					data: { id: idPuesto },
					dataType: 'json',
					success: function(data) {
						//console.log(data); return false;
						$( "#idPuestoDisponible" ).find('option').remove().end();
						//$( "#idPuestoDisponible" ).append('<option value="">- Seleccione -</option>');
						$.each(data.puestos, function (i, item) {
							$( "#idPuestoDisponible" ).append('<option value="' + item.CVEPUESTO + '">' + item.DESCRIP + '</option>');
							//console.log(item.NMDESCRIP);
					    });
						//console.log(PuestosIndex.puestosAgregados);
						Layout.hideLoading();
						$('#modalAsociarPuesto').modal();
					}
				});
                                
                            }
                        },".agregarEmpleado");
			
			$('#nombre_empleado').typeahead({
				items: 15,
				source: function (query, process) {
					states = [];
				    map = {};
				    
				    var url = baseUrl + '/catalogos/puestos/gettitulares';
				    
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
				    selectedState = map[item].id;
				    $("#id_empleado").val(selectedState);
				    //$('#nombre_empleado').attr("readonly", true);
				    return item;
				}
			});
			
			
			$("#btnAgregarEmpleadoPuesto").click(function(e){
				e.preventDefault();
				if( $.trim( $("#frmAgregarEmpleado #id_empleado").val() ) == ""
					|| $.trim( $("#frmAgregarEmpleado #id_empleado").val() ) == "0" ) {  
		            alert("Ingrese el empleado a agregar.");
		            $("#frmAgregarEmpleado #nombre_empleado").focus();
		            return false;
		        }
				var url = baseUrl + "/catalogos/puestos/setpuestoempleado";
				$.ajax({
					type: "POST",
					url: url,
					data: $("#frmAgregarEmpleado").serialize() + '&userid=' + $("#noEmpleado").html(),
					dataType: 'json',
					success: function(data) {
						//console.log(data); return false;
						if( data.success == "0"){
							//$('#modalAgregarEmpleado').modal('hide');
							//Menu.loadModuleMenu('catalogos', 'puestos', 'index');
							var id_puesto = $("#frmAgregarEmpleado #id_puesto").val();
							$("#frmAgregarEmpleado #id_empleado").val("0");
							$("#frmAgregarEmpleado #tipo").val("ALTA");
							$("#frmAgregarEmpleado #status").val("A");
							//$("#frmAgregarEmpleado #id_puesto").val("0");
							$("#frmAgregarEmpleado #nombre_empleado").val("");
							$("#frmAgregarEmpleado #nombre_empleado").focus();
							PuestosIndex.listarEmpleadosPorPuesto(id_puesto);
						} else {
							alert("Ocurrio un error: " + data.msg);
							return false;
						}
						
					}
				});
			});
			
			
			$('#modalAgregarPuesto').on('shown', function () {
				$("#frmAgregarPuesto #descripcion_puesto").focus();
			});
			
			$('#modalAgregarEmpleado').on('hidden', function () {
				Menu.loadModuleMenu('catalogos', 'puestos', 'index', '#');
				//PuestosIndex.resetearCampos();
			});
			
			$('#modalAgregarPuesto').on('hidden', function () {
				$("#descripcion_puesto").val("");
				$("#id_puesto").val("0");
				$("#tipo_puesto").val("ALTA");
			});
			/*
			$('#frmAddModal').on('show', function () {
				$('#lblFormModalSuc').html("Agregar sucursal");
			});
			*/
			
		},// End Init() 
		resetearCampos : function() {
			$("#id_empleado").val("");
			$("#nombre_empleado").val("");
		},// resetearCampos() 
		listarEmpleadosPorPuesto : function( id_puesto ) {
			var url = baseUrl + "/catalogos/puestos/getempleadospuestos";
			
			if(!id_puesto){
				alert("No hay puesto seleccionado.");
			}
			
			//Layout.showLoading();
			$("#listaEmpleadosAgregados").html("Cargando información...");
			$.ajax({
				type: "POST",
				url: url,
				data: { id_puesto: id_puesto },
				dataType: 'html',
				success: function(data) {
					//console.log(data); return false;
					$("#listaEmpleadosAgregados").html(data);
				}
			});
		},
                renderGrid : function() {
		var alto = $(document).height();
		var ancho = $(document).width();
                var status = $('#status').val();
                var userId = $('#userid').val();
                var categoria = $('#categoria').val();

		var grid = $('#consulta-puestos-grid').jqGrid({
		   	url: baseUrl + '/catalogos/puestos/get-lista-puestos', // get-lista-puestos
			datatype: 'json',
                    postData: { userQuasar: '',status:status,userid: userId, categoria: categoria},
			autowidth: true,
			height: '100%',
                    ondblClickRow: function (rowId) {
			},
		   	colNames:[
		   	          'No. Puesto',
		   	          'Puesto',
                                  'Numero de empleados',
		   	          'Acción'
		   	],
		   	colModel:[{
		   			name: 'IDPUESTOASIGNA',
		   			index: 'IDPUESTOASIGNA',
                                        sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'right',
		   			width: 50
		   		},
		   		{
		   			name: 'NMPUESTO',
		   			index: 'UPPER(NMPUESTO)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 130,
		   		},
		   		{
		   			name: 'TOTEMPLEADOS',
                                        index: 'TOTEMPLEADOS',
                                        search: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'right',
		   		},
                                
		   		{
		   			name: 'ACCION',
                                        search: false,
                                        sortable:false,
		   			align: 'center',
                                        width: 100,
                                        editable:true
                                       }
		   	],
		   	rowNum: -1,
			mtype: 'POST',
		   	sortname: 'NMPUESTO',
                        viewrecords: true,
                        sortorder: 'asc',
						rownumbers: true,
                        caption:'',
                        loadtext: 'Cargando informaci&oacute;n....',
                        loadonce: false,
		});
		$('#consulta-puestos-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true});
	}
};

PuestosIndex.init();
/*

*/