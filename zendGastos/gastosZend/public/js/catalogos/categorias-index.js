var CategoriasIndex = {
		init : function() {
			//alert("Hola como estas?");
			//var baseUrl = '/cuentas/public';
			
			$(".grid-title").html("Catálogo de categorías");
                        
                        CategoriasIndex.renderGrid();
			
			$("#selStatus").change(function( e ) {
				e.preventDefault();
				CategoriasIndex.ChangeFilter();
			});
			
			$("#addNuevaCategoria").click(function( e ) {
				e.preventDefault();
				Menu.loadModuleMenu('catalogos', 'categorias', 'add', '#');
				  return false;
			});
			
			$("#btnAddSucursal").click(function( e ) {
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
			
//			$(".editarCat").click(function(e){
//                            alert('click');
//			});

                        $(document).on({
                        click : function(e) {
				e.preventDefault();
				$('#lblFormModalSuc').html($(this).attr("title"));
				$('#idCategoria').val( $(this).attr("id-rel") );
				
				var userid = $('#userid').html();
				$.ajax({
					  url: baseUrl + '/catalogos/categorias/getcategoria',
					  type: 'POST',
					  data: {id: $(this).attr("id-rel"), userid: userid},
					  dataType: 'json',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  console.log(data);
						  
						  $('#categoria').val( data.categoria[0].NMDESCRIP );
						  $('#idCategoria').val( data.categoria[0].IDCUENTACAT );
						  
						  if(  data.categoria[0].FCSTATUS == "A" ){
							  $("#status-activo").addClass("active");
							  $("#status-inactivo").removeClass("active");
						  } else {
							  $("#status-activo").removeClass("active");
							  $("#status-inactivo").addClass("active");
						  }
						  
						  $("#divStatus").show();
						  $('#frmAddModal').modal(); 
						} 
				});
		} 
             },".editarCat");
			
			$("#status-activo").click(function(e){
				$('#status').val("A");
			});
			
			$("#status-inactivo").click(function(e){
				$('#status').val("I");
			});
			
			$("#btnModalAceptar").click(function(e){
				e.preventDefault();
				$("#frmCategoria").submit();
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
				CategoriasIndex.resetearCampos();
			});
			/*
			$('#frmAddModal').on('show', function () {
				$('#lblFormModalSuc').html("Agregar sucursal");
			});
			*/
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
		ChangeFilter : function() {
			var userid = 'admin';
			$.ajax({
				  url: baseUrl + '/catalogos/categorias/index/',
				  type: 'POST',
				  data: {status: $("#selStatus").val(), userid: userid},
				  dataType: 'html',
				  complete: function() {
						//Modal.close();
				  },
				  success: function(data) {
					  	//$('ul#sidebar-main-menu li a').removeClass('current');
					  	//$('ul#sidebar-main-menu li#sidebar-' + controller + ' a').addClass('current');
						$('#catalogo-content').html(data);

						//Gestion.resizeElements();
					} 
			});
		},
                renderGrid : function() {
		var alto = $(document).height();
		var ancho = $(document).width();
                var status = $('#status').val();
                var userId = $('#userid').val();
		var grid = $('#consulta-categoria-grid').jqGrid({
		   	url: baseUrl + '/catalogos/categorias/get-categorias',
			datatype: 'json',
            postData: { userQuasar: '',status:status,userid: userId },
			autowidth: true,
			height: '100%',
                        shrinkToFit: true,
                        ignoreCase: true,
                      ondblClickRow: function (rowId) {
                          var rowData = $(this).getRowData(rowId);
                          //CategoriasIndex.editRow(rowData['IDCUENTACAT']);
			},
		   	colNames:[
		   	          'No. Categorías',
		   	          'Categorías', 
		   	          'Estatus',
		   	          'Usuario',
		   	          'Fecha actualizada',
		   	          'Acción'
		   	],
		   	colModel:[{
		   			name: 'IDCUENTACAT',
		   			index: 'IDCUENTACAT',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'right',
		   			width: 55
		   		},
		   		{
		   			name: 'NMDESCRIP',
		   			index: 'NMDESCRIP',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 160,
		   		},
		   		{
		   			name: 'FCSTATUS',
		   			index: 'FCSTATUS',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   		},
		   		{
		   			name: 'IDUSUARIO',
		   			index: 'UPPER(IDUSUARIO)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   		},
		   		{
		   			name: 'FDFECULTMOVTO',
		   			index: 'FDFECULTMOVTO',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'center',
		   			width: 100,
		   		},
		   		{
		   			name: 'ACCION',                                     
		   			align: 'center',
                                        width: 100,
                                        sortable:false,
                                        sortype: false,
		   			search: false,
                                       },
		   	],
		   	rowNum: 15,
			mtype: 'POST',
		   	pager: '#consulta-categoria-pager',
                        sortname: 'FDFECULTMOVTO',
                        viewrecords: true,
                        rownumbers: true,
                        sortorder: 'desc',
                        caption:'',
                        loadtext: 'Cargando informaci&oacute;n....',
                        loadonce: false,
                         //width: ancho,
		});
		$('#consulta-categoria-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true});
	}
};

CategoriasIndex.init();