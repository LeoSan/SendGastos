var ConceptosIndex = {
	init : function() {
		//llamado Metodos
		ConceptosIndex.renderGrid();

		//Eventos Front
		$(".grid-title").html("Catálogo de conceptos");
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
				selectedState = map[item].email;
				$("#idTitular").val(selectedState);
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

		$("#categoria").off('click').on({
			change : function( e ) {
				e.preventDefault();
				var idcategoria = $(this).val();

				if(!idcategoria){
					$( "#subcategoria" ).find('option').remove().end();
					$( "#subcategoria" ).append('<option value="">- Seleccione -</option>');
					ConceptosIndex.gridReload();
				}

				ConceptosIndex.listarSubcategorias(idcategoria);
			}
		});
		$("#btnAddConcepto" ).click( function( e ) {
			e.preventDefault();
			var userid = $('#userid').html();
			Layout.showLoading();
			$.ajax({
				url: $(this).attr('href'),
				type: 'POST',
				data: {test: 'test', userid: userid},
				dataType: 'html',
				success: function(data) {
					$('#catalogo-content').html("");
					$('#catalogo-content').html(data);
					Layout.hideLoading();
				}
			});
		});

		$( document ).off('click').on({
			click : function( e ) {
				e.preventDefault();
				$('#idCategoria').html( $(this).attr("id-rel") );
				console.log("Aqui estoy muy contento");
				var userid = $('#userid').html();


				Layout.showLoading();
				$.ajax({
					url: baseUrl + '/catalogos/conceptos/gethistorico',
					type: 'POST',
					data: {id: $(this).attr("id-rel"), userid: userid},
					dataType: 'html',
					complete: function() {
						//Modal.close();
					},
					success: function(data) {
						//console.log(data);
						$('#frmModalHistorico .modal-body').html(data);
						$("#frmModalHistorico").modal('show');
						Layout.hideLoading();
					}
				});
				/**/
			}
		},  ".historico");
		$( document ).off('click').on({
			click : function( e ) {
				e.preventDefault();
				$('#lblFormModalSuc').html($(this).attr("title"));
				$('#idSucursal').html( $(this).attr("id-rel") );

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
						$('#frmAddModal').modal();
					}
				});
			}
		},  ".editarSuc");
		$( document ).off('click').on({
			click : function( e ) {
				e.preventDefault();
				$("#frmSucursal").submit();
				return false;
				var confirmar = confirm("¿Desea guardar?");

				if (confirmar) {
					$('#frmAddModal').modal('hide');
				}
			}
		},  "#btnModalAceptar");
		$( document ).off('change').on({
			change : function() {
				ConceptosIndex.gridReload();

				//alert(cat + ' ' + sub);
			}
		}, "#subcategoria");

		$('#frmAddModal').off('hidden').on('hidden', function () {
			SucursalesIndex.resetearCampos();
		});
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
				titular: "Ingrese el titular",
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
					},
					success: function(data) {
						console.log(data);
						return false;
						$('#frmAddModal').modal('hide');
						Menu.loadModuleMenu('catalogos', 'sucursales', 'index', '#');
						return false;
					}
				});
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
	listarSubcategorias : function(id_categoria) {
		var url = baseUrl + "/catalogos/subcategorias/getsubcategorias";
		$.ajax({
			type: "POST",
			url: url,
			data: { id: id_categoria },
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
	},
	interfazEditarConceptos: function(){
		$( document ).ready(function() {
			$( ".btnEditarConcepto" ).on( "click", function() {
				$('#lblFormModalSuc').html($(this).attr("title"));
				$('#idCategoria').html( $(this).attr("id-rel") );
				var userid = $('#userid').html();
				Layout.showLoading();
				$.ajax({
					url: baseUrl + '/catalogos/conceptos/edit',
					type: 'POST',
					data: {id: $(this).attr("id-rel"), userid: userid, categoriaid:'', subcategoriaid:''},
					dataType: 'html',
					complete: function() {
						//Modal.close();
					},
					success: function(data) {
						$('#catalogo-content').html(data);
						Layout.hideLoading();
					}
				});

			});
		});
	},
	interfazDuplicarConceptos: function(){
		$( document ).ready(function() {
			$(".duplicarConcepto").off('click').on({
				click : function(e){
					e.preventDefault();
					var url = baseUrl + "/catalogos/conceptos/duplicarconcepto";
					var idConcepto = $( this ).attr("id-rel");
					var title = $( this ).attr("title");
					var concepto = title.substring(9);
					var res = confirm("¿Está seguro que desea duplicar el concepto " + idConcepto + " - " + concepto + "?");

					if (res == true){
						$.ajax({
							type: "POST",
							url: url,
							data: { id: idConcepto },
							dataType: 'json',
							success: function(data) {
								if( data.success == '0'){
									Menu.loadModuleMenu('catalogos', 'conceptos', 'index', '#');
								}
							}
						});
					}

				}
			});
		});
	},
	renderGrid : function() {
		var alto = $(document).height();
		var ancho = $(document).width();
		var userId = $('#userid').text();
		var idcategoria = $('#idCategoria').val();
		var cat = $("#categoria").val();
		var sub = $("#subcategoria").val();
		var bySelect = false;

		var grid =	$("#consulta-conceptos-grid").jqGrid({
			datatype: "local",
			data: jsonConcepto,
			height: 400,
			colNames:['No. Concepto', 'Categoría','Sub Categoría','Concepto','Cuenta de ingresos','Estatus','Fecha actualizada','Usuario actualiza','Total de casos','Acción'],
			colModel:[
				{ name: 'IDCONCEPTO',index: 'IDCONCEPTO',sortype: 'string', searchoptions: {sopt: ['cn', 'eq']},resizable: false, align: 'left', width: 20 },
				{ name: 'NOM_CATEGORIA',index: 'NOM_CATEGORIA',sortype: 'string', searchoptions: {sopt: ['cn', 'eq']},align: 'justify',width: 100},
				{ name: 'NOM_SUBCATEGORIA',index: 'NOM_SUBCATEGORIA',sortype: 'string', searchoptions: {sopt: ['cn', 'eq']},align: 'justify',width: 150},
				{ name: 'NMCONCEPTO',index: 'NMCONCEPTO',sortype: 'string', searchoptions: {sopt: ['cn', 'eq']},align: 'justify',width: 220},
				{ name: 'FCCUENTACONTABLE', index: 'FCCUENTACONTABLE',sortype: 'string',searchoptions: {sopt: ['cn', 'eq']},resizable: false,align: 'right',width: 50},
				{ name: 'FCSTATUS', index: 'FCSTATUS',sortype: 'string',searchoptions: {sopt: ['cn', 'eq']},resizable: false,align: 'left',width: 50},
				{ name: 'FDFECULTMOVTO',index: 'FDFECULTMOVTO',sortype: 'string',searchoptions: {sopt: ['cn', 'eq']},resizable: false,align: 'center',width: 80},
				{ name: 'USUARIO', index: 'USUARIO', sortype: 'string',searchoptions: {sopt: ['cn', 'eq']},resizable: false, align: 'left',width: 150},
				{ name: 'TOTCASOS', index: 'TOTCASOS', sortype: 'string', searchoptions: {sopt: ['cn', 'eq']},resizable: false,align: 'right',width: 50},
				{ name: 'ACCION', align: 'center', width: 50, sortable: false, editable:true, sortype: false,search: false},
			],
			autowidth: true,
			styleUI : 'Bootstrap',
			shrinkToFit: true,
			rowNum: 1000,
			//multiselect: true,
			ignoreCase: true,
			jsonReader : { repeatitems: false },
			pager: '#tableCuentasPager',
			viewrecords: true,
			loadComplete: function(data) {
				ConceptosIndex.interfazDuplicarConceptos();
				ConceptosIndex.interfazEditarConceptos();
			},

		});

		$('#consulta-conceptos-grid').jqGrid('filterToolbar',{
			stringResult: true,
			searchOperators: true,
			searchOnEnter:false
		});
	},

};
ConceptosIndex.init();
