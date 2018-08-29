var arrdata;
var jsondataDetail='';
var jsondataBinnacle='';
var CategoriasIndex = {
	init : function() {

		$(".grid-title").html("Catálogo de niveles");
		CategoriasIndex.renderGrid();

		$(document).on('click',".editarNivel",function(){
			var idpuesto = $(this).parents('tr').find("td").eq(1).html();
			var puesto = $(this).parents('tr').find("td").eq(2).html();
			var peso = $(this).parents('tr').find("td").eq(3).html();
			var estatus = $(this).parents('tr').find("td").eq(4).html();
			$("#lblFormModalSucEdit span").html("")
			$("#lblFormModalSucEdit span").html(puesto)
			$("#idcatalogonivelEdit").val('');
			$("#idcatalogonivelEdit").val($(this).attr("id-rel"));
			$("#pesoEdit").val('');
			$("#pesoEdit").val(peso);
			$("#idpuestoEdit").val('');
			$("#idpuestoEdit").val(idpuesto);

			if(estatus=='Activo'){
				$("a#status-activo").addClass("active");
				$("a#status-inactivo").removeClass("active");
				$("#estatus-activo").attr("checked","checked");
			}else{
				$("a#status-activo").removeClass("active");
				$("a#status-inactivo").addClass("active");
				$("#estatus-inactivo").attr("checked","checked");
			}
		});

		$(document).on('click',".detailNivel",function(){
			var cvepue = $(this).attr("id-rel");
			$("#frmModalDetail .modal-title").html("Empleados en: "+$(this).attr("title-rel"));
			$("#tableDetail").jqGrid("clearGridData");
			$.ajax({
				url: baseUrl + '/catalogos/catniveles/get-user-nivel-by-puesto',
				type: 'POST',
				data: { cvepue: cvepue},
				dataType: 'json',
				async: false,
				complete: function() {
					// console.log('COMPLETE');
				},
				success: function(data) {
					// $("#tableCADetail tbody").html(data.html);
					jsondataDetail =data;
					// jsondataDetail = $.parseJSON(jsondataDetail);
					$('#tableDetail').jqGrid('setGridParam', {data: jsondataDetail,rowNum: jsondataDetail.length});
					$('#tableDetail').trigger('reloadGrid');
					$('#frmModalDetail').modal('show');
				}
			});
			// $("#idcatalogonivelDelete").val('');
			// $("#idcatalogonivelDelete").val($(this).attr("id-rel"));
		});

		$(document).on('click',".binnacleNivel",function(){
			var cvepue = $(this).attr("id-rel");
			$("#lblFormModalSucBinnacle span").html("");
			$("#lblFormModalSucBinnacle span").html($(this).attr("title-rel"));
			$("#tableBinnacle").jqGrid("clearGridData");
			$.ajax({
				url: baseUrl + '/catalogos/catniveles/get-bitacora-by-puesto',
				type: 'POST',
				data: { CVEPUE: cvepue},
				dataType: 'json',
				async: false,
				complete: function() {
					// console.log('COMPLETE');
				},
				success: function(data) {
					// $("#tableCADetail tbody").html(data.html);
					console.log(data);
					jsondataBinnacle =data;
					// jsondataDetail = $.parseJSON(jsondataDetail);
					$('#tableBinnacle').jqGrid('setGridParam', {data: jsondataBinnacle,rowNum: jsondataBinnacle.length});
					$('#tableBinnacle').trigger('reloadGrid');
					$('#frmModalBinnacle').modal('show');
				}
			});
			// $("#idcatalogonivelDelete").val('');
			// $("#idcatalogonivelDelete").val($(this).attr("id-rel"));
		});

		$(document).on('click',".eliminarNivel",function(){
			$("#idcatalogonivelDelete").val('');
			$("#idcatalogonivelDelete").val($(this).attr("id-rel"));
		});

		$(document).on('click','#status-activo',function(){
			$("#estatus-activo").prop("checked", true);
			$("#estatus-inactivo").prop("checked", false);
		});

		$(document).on('click','#status-inactivo',function(){
			$("#estatus-activo").prop("checked", false);
			$("#estatus-inactivo").prop("checked", true);
		});

		$("#searchByUserPuesto").keydown(function(tecla){
			if (tecla.keyCode == 8) {
				$(this).val('');
				$('#idpuestoNew').val('');
			}
		});

		$('#pesoNew, #pesoEdit').bind('keypress', function (event) {
			// var regex = new RegExp("[^\'\"!,]+$");
			var regex = new RegExp("^[0-9]+$");
			var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
			if (!regex.test(key)) {
				event.preventDefault();
				return false;
			}
		});

		$("#searchByUserPuesto").on("change paste keyup", function() {
			if($(this).val() == ''){
				$('#idpuestoNew').val('');
			}
		});

		$("#searchByUserPuesto").focusout(function(){
			if($(this).val() == ''){
				$('#idpuestoNew').val('');
			}
		});

		$("#btnNewNivel").click(function( e ) {
			e.preventDefault();
			var CVEPUE = $('#idpuestoNew').val();
			var PUESTO = $('#namepuestoNew').val();
			var IDEMPLEADO = $('#noEmpleado').html();
			var PESO = $('#pesoNew').val();
			if(CVEPUE != "" && PESO !=""){
				$.ajax({
					url: baseUrl+'/catalogos/catniveles/insert-new-nivel',
					type: 'POST',
					data: {CVEPUE: CVEPUE,PUESTO: PUESTO, IDEMPLEADO: IDEMPLEADO,PESO: PESO},
					dataType: 'html',
					complete: function() {
						// Modal.close();
					},
					success: function(data) {
						if(data){
							$('#frmAddModal').modal('toggle');
							Menu.loadModuleMenu('catalogos', 'catniveles', 'index', '#');
							// $('body').find('a[rel-controller=catniveles][rel-action=index]').trigger('click');
						}else{
							alert('Error con al editar el nivel');
						}
					}
				});
			}else{
				alert("favor de completar el formulario correctamente");
			}

		});

		$("#btEditarNivel").click(function( e ) {
			e.preventDefault();
			var IDCATALOGONIVEL = $('#idcatalogonivelEdit').val();
			var CVEPUE = $('#idpuestoEdit').val();
			var IDEMPLEADO = $('#noEmpleado').html();
			var PESO = $('#pesoEdit').val();
			var CTNIVELSTATUS = $('[name="estatus"]:checked').val();

			if(CVEPUE != "" && PESO !="") {
				$.ajax({
					url: baseUrl + '/catalogos/catniveles/update-nivel',
					type: 'POST',
					data: {
						IDCATALOGONIVEL: IDCATALOGONIVEL,
						CVEPUE: CVEPUE,
						IDEMPLEADO: IDEMPLEADO,
						PESO: PESO,
						CTNIVELSTATUS: CTNIVELSTATUS
					},
					dataType: 'html',
					complete: function () {
						// Modal.close();
					},
					success: function (data) {
						if (data) {
							$('#frmAddModalEdit').modal('toggle');
							Menu.loadModuleMenu('catalogos', 'catniveles', 'index', '#');
							// $('body').find('a[rel-controller=catniveles][rel-action=index]').trigger('click');
						} else {
							alert('Error con al editar el nivel');
						}
					}
				});
			}else{
				alert("favor de completar el formulario correctamente");
			}
		});

		$('#frmAddModal').on('hidden', function () {
			CategoriasIndex.resetearCampos();
		});
		// validate signup form on keyup and submit
		$("#frmCategoria").validate({
			rules: {
				categoria: "required"
			},
			messages: {
				//categoria: "Ingrese el nombre de la categoria"
			},
			submitHandler: function(form) {
				//alert("Todo esta validado: " + $("#frmCategoria").serialize()); return false;
				var userid = $('#userid').html();
				$.ajax({
					url: baseUrl + '/catalogos/categorias/setcategoria',
					type: 'POST',
					data: $("#frmCategoria").serialize(),
					dataType: 'json',
					complete: function() {
						//Modal.close();
					},
					success: function(data) {
						console.log(data);
						//return false;
						$('#frmAddModal').modal('hide');

						Menu.loadModuleMenu('catalogos', 'categorias', 'index', '#');
						return false;
					}
				});
				//form.submit();
			}
		});


		$.ajax({
			url: baseUrl + '/catalogos/catniveles/get-all-user-nivel',
			type: 'POST',
			// data: $("#frmCategoria").serialize(),
			dataType: 'html',
			complete: function() {
				//Modal.close();
			},
			success: function(data) {
				data = jQuery.parseJSON(data);
				globaldata = data;
				globalArrIndex = [];
				globalArrIndexName = [];
				arrdata = [];
				counter = 0;
				$.each(data, function( index, value ) {
					// console.log(value);
					if(value.BUSQUEDA != null && value.BUSQUEDA != ''){
						arrdata[counter] = value.BUSQUEDA;
						globalArrIndex[value.BUSQUEDA] = value.cvepue;
						globalArrIndexName[value.BUSQUEDA] = value.despue;
						counter ++;
					}
				});

				var typeahead = $('#idUserSearchAdmin').data('typeahead');
				if (typeahead) {
					typeahead.source = arrdata;
				} else {
					$('#searchByUserPuesto').typeahead({
						source: arrdata,
						minLength: 2,
						updater: function(item){
							console.log(item);
							$("#idpuestoNew").val( globalArrIndex[item] );
							$("#namepuestoNew").val( globalArrIndexName[item] );
							return item;
						}
					});
				}
			}
		});



	},// End Init()
	resetearCampos : function() {
		$("#searchByUserPuesto").val("");
		$("#pesoNew").val("");
		$("#idpuestoNew").val("");
	},
	renderGrid : function() {
		var alto = $(document).height();
		var ancho = $(document).width();
		var status = $('#status').val();
		var userId = $('#userid').val();
		console.log(baseUrl + '/catalogos/catniveles/get-niveles');
		var grid = $('#consulta-niveles-grid').jqGrid({
			/*url: baseUrl + '/catalogos/catniveles/get-niveles',*/
			datatype: 'local',
			data:datanivelesjson,
			rowNum: datanivelesjson.length,
			autowidth: true,
			height: '100%',
			//width: '1535',
			shrinkToFit: true,
			ignoreCase: true,
			colNames:[
				'No.',
				'Cod. puesto',
				'Puesto',
				'Peso',
				'Estatus',
				'Acción'
			],
			colModel:[
				{
					name: 'IDCUENTANIV',
					index: 'IDCUENTANIV',
					sorttype: 'number',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'right',
					width: 12
				},
				{
					name: 'CVEPUE',
					index: 'CVEPUE',
					sorttype: 'number',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'right',
					width: 12,
				},
				{
					name: 'DPTO',
					index: 'DPTO',
					sortype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					width: 50,
				},
				{
					name: 'PESO',
					index: 'PESO',
					sorttype: 'number',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'right',
					width: 12,
				},
				{
					name: 'ESTATUS',
					index: 'ESTATUS',
					sorttype: 'string',
					searchoptions: {sopt: [ 'eq']},
					resizable: false,
					align: 'center',
					width: 12,
				},
				{
					name: 'ACCION',
					align: 'center',
					width: 12,
					sortable:false,
					sorttype: false,
					search: false,
				}
			],
			ondblClickRow: function (rowId) {

				console.log('hi');
				var rowData = $(this).getRowData(rowId);
				alert(rowData);
			},
			rowNum: 2000,
			// mtype: 'POST',
			pager: '#consulta-niveles-pager',
			sortname: 'IDCUENTANIV',
			viewrecords: true,
                        rownumbers: true,
			sortorder: 'asc',
			caption:'',
			loadtext: 'Cargando informaci&oacute;n....',
			loadonce: true,
			//width: ancho,
			ondblClickRow: function (rowId) {
				var rowData = $(this).getRowData(rowId);
				//CategoriasIndex.editRow(rowData['IDCUENTACAT']);
			},
			loadBeforeSend: function(xhr, settings){
				//alert('O_O');
			},
			loadComplete: function(data) {
				//alert('O_O');
			}
		});

		$('#consulta-niveles-grid').jqGrid('filterToolbar',{searchOnEnter: false, searchOperators: true, stringResult: true});

		var gridDetail = $("#tableDetail").jqGrid({
			datatype: 'local',
			data: jsondataDetail,
			rowNum: jsondataDetail.length,
			colNames:[
				'No.',
				'Nombre',
				'Ubicación',
				'Área',
				'Departamento',
				'Email',
				'Estatus'
			],
			colModel:[
				{
					name: 'NRO',
					index: 'NRO',
					sorttype: 'number',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 30,
				},
				{
					name: 'nombreCompleto',
					index: 'nombreCompleto',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 160,
				},
				{
					name: 'ubicacion',
					index: 'ubicacion',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 60,
				},
				{
					name: 'Area',
					index: 'Area',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 100,
				},
				{
					name: 'Departamento',
					index: 'Departamento',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 100,
				},
				{
					name: 'email',
					index: 'email',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 160,
				},
				{
					name: 'ESTATUS',
					index: 'ESTATUS',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 50,
				}
			],
			rowList:[10,20,30,100000000],
			mtype: 'POST',
			// autowidth: true,
			width: 100+'px',
			gridview: false,
			altRows: true,
			pager: '#consulta-inventario-pager-detail',
			sortname: 'NMNOMBRE',
			viewrecords: true,
			sortorder: 'asc',
			caption:'',
			loadtext: 'Cargando informaci&oacute;n....',
			ignoreCase: true,
			shrinkToFit: false,
			height: 280,
			loadBeforeSend: function(xhr, settings){
				// Archivo.showLoading();
			},
			loadComplete: function(data) {
				console.log(data);
				$("option[value=100000000]").text('All');
				// Archivo.hideLoading();
				if( $("#perfil").html() != "despachoext" ){

				}
				//End si no es despachoext
			}
		});
		$('#tableDetail').jqGrid('filterToolbar',{searchOnEnter: false, stringResult: true});

		var gridBinnacle = $("#tableBinnacle").jqGrid({
			datatype: 'local',
			data: jsondataBinnacle,
			rowNum: jsondataBinnacle.length,
			colNames:[
				'No.',
				'Administrador',
				'Correo',
				'Tipo de moviemiento',
				'Información previa',
				'Información actualizada',
				'Fecha de modificación'
			],
			colModel:[
				{
					name: 'NRO',
					index: 'NRO',
					sorttype: 'number',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 30,
				},
				{
					name: 'WHOCHANGE',
					index: 'WHOCHANGE',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 150,
				},
				{
					name: 'WHOCHANGEEMAIL',
					index: 'WHOCHANGEEMAIL',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 150,
				},
				{
					name: 'TIPOMOVIMIENTOFORMAT',
					index: 'TIPOMOVIMIENTOFORMAT',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 80,
				},
				{
					name: 'SPECIFICCHANGESOLD',
					index: 'SPECIFICCHANGESOLD',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 100,
				},
				{
					name: 'SPECIFICCHANGESNEW',
					index: 'SPECIFICCHANGESNEW',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 100,
				},
				{
					name: 'FECHAMOVIMIENTOFORMAT',
					index: 'FECHAMOVIMIENTOFORMAT',
					sorttype: 'string',
					searchoptions: {sopt: ['cn', 'eq']},
					resizable: false,
					align: 'left',
					fixed: true,
					width: 100,
				}
			],
			rowList:[10,20,30,100000000],
			mtype: 'POST',
			autowidth: true,
			gridview: false,
			altRows: true,
			pager: '#consulta-inventario-pager-detail',
			sortname: 'NMNOMBRE',
			viewrecords: true,
                        rownumbers: true,
			sortorder: 'asc',
			caption:'',
			loadtext: 'Cargando informaci&oacute;n....',
			ignoreCase: true,
			shrinkToFit: true,
			height: 280,
			loadBeforeSend: function(xhr, settings){
				// Archivo.showLoading();
			},
			loadComplete: function(data) {
				console.log(data);
				$("option[value=100000000]").text('All');
				// Archivo.hideLoading();
				if( $("#perfil").html() != "despachoext" ){

				}
				//End si no es despachoext
			}
		});
		$('#tableBinnacle').jqGrid('filterToolbar',{searchOnEnter: false, stringResult: true});
	}
};

CategoriasIndex.init();