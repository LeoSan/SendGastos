var SubcategoriasIndex = {
		init : function() {
			//alert("Hola como estas?");
			//var baseUrl = '/cuentas/public';
			
			$(".grid-title").html("Catálogo de subcategorías");
			
                        SubcategoriasIndex.renderGrid();
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
			
			$("#addNuevaSubcategoria").click(function(e){
				e.preventDefault();
				Menu.loadModuleMenu('catalogos', 'subcategorias', 'add', '#');
				return false;
			});
			
			$("#selIdCategoria").change(function(e){
				e.preventDefault();
				SubcategoriasIndex.ChangeFilter();
			});
			
			$("#selStatus").change(function(e){
				e.preventDefault();
				SubcategoriasIndex.ChangeFilter();
			});
			
			
			
			$("#status-activo").click(function(e){
				$('#status').val("A");
			});
			
			$("#status-inactivo").click(function(e){
				$('#status').val("I");
			});
			
			$("#btnModalAceptar").click(function(e){
				e.preventDefault();
				$("#frmSubcategoria").submit();
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
			
			$('#frmAddModal').on('show', function () {
				$("#idCategoria").val( $("#selIdCategoria").val() );
			});
			
			$('#frmAddModal').on('hidden', function () {
				SubcategoriasIndex.resetearCampos();
			});
			/*
			$('#frmAddModal').on('show', function () {
				$('#lblFormModalSuc').html("Agregar sucursal");
			});
			*/
			// validate signup form on keyup and submit
			$("#frmSubcategoria").validate({
				rules: {
					idCategoria : "required",
					subcategoria: "required"
				},
				messages: {
					idCategoria : "Seleccione una categoria",
					subcategoria: "Ingrese el nombre de la subcategoria"
				},
				submitHandler: function(form) {
				    //alert("Todo esta validado: " + $("#frmSubcategoria").serialize()); return false;
				    var userid = $('#userid').html();
					$.ajax({
						  url: baseUrl + '/catalogos/subcategorias/setsubcategoria',
						  type: 'POST',
						  data: $("#frmSubcategoria").serialize(),
						  dataType: 'json',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  console.log(data);
							  if (data.success == '0'){
								//return false;
								  $('#frmAddModal').modal('hide');
								  
								  Menu.loadModuleMenu('catalogos', 'subcategorias', 'index', '#');
								  return false;
							  } else{
								  alert("Ocurrio un error: " + data.success);
								  return false;
							  }
							  
							} 
					});
					//form.submit();
				}
			});
			
		},// End Init() 
		resetearCampos : function() {
			$("#idCategoria").val("");
			$("#idSubcategoria").val("0");
			$("#subcategoria").val("");
			$("#divStatus").hide();
			$("#status").val("A");
			$('#lblFormModalSuc').html("Agregar sucursal");
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
		},
		ChangeFilter : function() {
			var userid = 'admin';
			$.ajax({
				  url: baseUrl + '/catalogos/subcategorias/index/',
				  type: 'POST',
				  data: {idcategoria: $("#selIdCategoria").val(), status: $("#selStatus").val(), userid: userid},
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
                editRow : function(id) {
				$('#lblFormModalSuc').html($(this).attr("title"));
				$('#idSubcategoria').html( $(this).attr("id-rel") );
				var idCategoria = id;
				var userid = 'admin'; // $('#userid').html();
				$.ajax({
					  url: baseUrl + '/catalogos/subcategorias/getsubcategoria',
					  type: 'POST',
					  data: {id: idCategoria, userid: userid},
					  dataType: 'json',
					  success: function(data) {
						  //console.log(data);
						  if( data.respuesta == 'success'){

							  $('#subcategoria').val( data.categoria[0].NMDESCRIP );
							  $('#idSubcategoria').val( data.categoria[0].IDCUENTACAT );
							  $('#idCategoria').val( data.categoria[0].IDHIJO );

							  if(  data.categoria[0].FCSTATUS == "A" ){
								  $("#status-activo").addClass("active");
								  $("#status-inactivo").removeClass("active");
							  } else {
								  $("#status-activo").removeClass("active");
								  $("#status-inactivo").addClass("active");
							  }
							  $("#divStatus").show();
							  $('#frmAddModal').modal(); 
						  }else{
							  
						  }
					} 
				});
		},
                renderGrid : function() {
		var alto = $(document).height();
		var ancho = $(document).width();
                var status = $('#status').val();
                var userId = $('#userid').val();
                var idcategoria = $('#idCategoria').val();
                //status
		var grid = $('#consulta-subcategoria-grid').jqGrid({
		   	url: baseUrl + '/catalogos/subcategorias/get-subcategoriass', //getSubcategoriass
			datatype: 'json',
            postData: { userQuasar: '',status:status,userid: userId, idCategoria: idcategoria },
			autowidth: true,
			height: '100%',
                      ondblClickRow: function (rowId) {
                          var rowData = $(this).getRowData(rowId);
                          SubcategoriasIndex.editRow(rowData['IDCUENTACAT']);
			},
		   	colNames:[
		   	          'No. Subcategorías ',
		   	          'Categoría',
                                  'Subcategoría',
		   	          'Estatus',
                                  'Fecha actualizada',
		   	          'Usuario actualiza',
		   	          'Acción'
		   	],
		   	colModel:[{
		   			name: 'IDCUENTACAT',
		   			index: 'IDCUENTACAT',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'right',
		   			width: 50
		   		},
		   		{
		   			name: 'CATEGORIA',
		   			index: 'CATEGORIA',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 200,
		   		},
                                {
		   			name: 'SUBNMDESCRIP',
		   			index: 'SUBNMDESCRIP',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 200,
		   		},
		   		{
		   			name: 'FCSTATUS',
		   			index: 'FCSTATUS',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
					width: 70,
		   		},
                               {
		   			name: 'FDFECULTMOVTOS',
		   			index: 'FDFECULTMOVTOS',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'center',
		   			width: 70,
		   		},
		   		{
		   			name: 'IDUSUARIO',
		   			index: 'UPPER(IDUSUARIO)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
					width: 70,
		   		},
		   		{
		   			name: 'ACCION',                                     
		   			align: 'center',
                                        sortable:false,
					sortype: false,
		   			search: false,
					width: 70,
			   },
		   	],
		   	rowNum: -1,
			mtype: 'POST',
		   	sortname: 'FDFECULTMOVTO',
		   	viewrecords: true,
		   	rownumbers: true,
		   	sortorder: 'desc',
		   	caption:'',
		   	loadtext: 'Cargando informaci&oacute;n....',
		   	loadonce: false,
            loadComplete: function(data) {

            	$(".editarCat").off('click').on('click',function(e){
                    		e.preventDefault();
                    		
                    		$('#lblFormModalSuc').html($(this).attr("title"));
                    		$('#idSubcategoria').html( $(this).attr("id-rel") );

                    		//var userid = 'admin'; // 
                    		var userid = $('#userid').html();
        				
                    		$('#idCategoria option').removeAttr('selected');
        				
                    		$.ajax({
                    			url: baseUrl + '/catalogos/subcategorias/getsubcategoria',
                    			type: 'POST',
                    			data: {id: $(this).attr("id-rel"), userid: userid},
                    			dataType: 'json',
                    			success: function(data) {
                    				if( data.respuesta == 'success'){
                    					//return false;
                    					$('#subcategoria').val( data.categoria[0].NMDESCRIP );
                    					$('#idSubcategoria').val( data.categoria[0].IDCUENTACAT );
//        								$('#idCategoria').val( data.categoria[0].IDHIJO );

                    					$('select#idCategoria option').each(function(i,item){
                    						if( $(item).val() == data.categoria[0].IDHIJO ) {
                    							$('#idCategoria option:eq('+i+')').prop('selected', true);
                    							//$('#idCategoria option').eq(i).attr('selected','selected');
                    						}
                    					});
                    					if(  data.categoria[0].FCSTATUS == "A" ){
                    						$("#status-activo").addClass("active");
                    						$("#status-inactivo").removeClass("active");
                    					} else {
                    						$("#status-activo").removeClass("active");
                    						$("#status-inactivo").addClass("active");
                    					}
                    					$("#divStatus").show();
                    					$('#frmAddModal').modal(); 
                    				}else{
        							  
                    				}
                    			} 
                    		});
                    //	}
                    });
            	
            }
		});
		$('#consulta-subcategoria-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true});
	}
};

SubcategoriasIndex.init();
