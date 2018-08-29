var CatcentrocostosIndex = {
		init : function() {
			
			$(".grid-title").html("Categoría centro de costos");
			
                        CatcentrocostosIndex.renderGrid();
			$("#selStatus").change(function( e ) {
				e.preventDefault();
				CatcentrocostosIndex.ChangeFilter();
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
                        
                        $(document).on({
                            click : function(e) {
                            	e.preventDefault();
				$('#lblFormModalSuc').html($(this).attr("title"));
				$('#idCosto').val( $(this).attr("id-rel") );
				$('#userid').val( $('#userid').html() );
				var userid = $('#userid').html();
				$.ajax({
					  url: baseUrl + '/catalogos/catcentrocostos/getcosto',
					  type: 'POST',
					  data: {id: $(this).attr("id-rel"), userid: userid},
					  dataType: 'json',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  //console.log(data);

						  $('#costoNombre').val( data.categoria[0].NMCATEGORIA );
						  $('#idCosto').val( data.categoria[0].IDCATEGORIA );
						  
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
				$("#frmCentroCostos").submit();
				return false;
				var confirmar = confirm("¿Desea guardar?");
				
				if (confirmar) {
					$('#frmAddModal').modal('hide');
                                        //CatcentrocostosIndex.renderGrid();
                                        
				}
			});
			
			$('#frmAddModal').on('hidden', function () {
				CatcentrocostosIndex.resetearCampos();
			});
			$("#frmCentroCostos").validate({
				rules: {
					costoNombre: "required"
				},
				messages: {
					costoNombre: "Ingrese el nombre del costo"
				},
				submitHandler: function(form) {
				    //alert("Todo esta validado: " + $("#frmCategoria").serialize()); return false;
				    var userid = $('#userid').html();
					$.ajax({
						  url: baseUrl + '/catalogos/catcentrocostos/setcosto',
						  type: 'POST',
						  data: $("#frmCentroCostos").serialize(),
						  dataType: 'json',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  console.log(data);
							  //return false;
							  if ( data.success == '0' ){
								  $('#frmAddModal').modal('hide');
								  
								  Menu.loadModuleMenu('catalogos', 'catcentrocostos', 'index', '#');
								  return false;
							  } else {
								  alert( data.success );
							  }
							  
						} 
					});
					//form.submit();
				}
			});
			
		},// End Init() 
		resetearCampos : function() {
			$("#idCosto").val("0");
			$("#costoNombre").val("");
			$("#divStatus").hide();
			$("#status").val("A");
			$('#lblFormModalSuc').html("Agregar costo");
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
		},
		ChangeFilter : function() {
			var userid = $('#userid').html();
			$.ajax({
				  url: baseUrl + '/catalogos/categorias/index/',
				  type: 'POST',
				  data: {status: $("#selStatus").val(), userid: userid},
				  dataType: 'html',
				  complete: function() {
						//Modal.close();
				  },
				  success: function(data) {
						$('#catalogo-content').html(data);

						//Gestion.resizeElements();
					} 
			});
		},
                gridReload: function(){ 
                var cat = $("#categoria").val(); 
                var status = $('#status').val();
                var userId =  $('#userid').val();
                jQuery("#consulta-catcentrocostos-grid").jqGrid('setGridParam',{
                    url: baseUrl + '/catalogos/centrocostosget-catcentrocostos',
                    postData: { userId: userId,status:status, categoria: cat},
                    mtype: 'POST',
                    datatype: 'json',
                    page:1
                }).trigger("reloadGrid");
                },

                renderGrid : function() {
		var alto = $(document).height();
		var ancho = $(document).width();
                var status = $('#status').val();
                var userId = $('#userid').val();
                var categoria = $('#categoria').val();

		var grid = $('#consulta-catcentrocostos-grid').jqGrid({
		   	url: baseUrl + '/catalogos/catcentrocostos/get-catcentrocostos',
			datatype: 'json',
                    postData: { userQuasar: '',status:status,userid: userId, categoria: categoria},
			autowidth: true,
			height: '100%',
                    ondblClickRow: function (rowId) {
			},
		   	colNames:[
		   	          'No. Costos',
		   	          'Costos',
                                  'Estatus',
                                  'Fecha actualizada',
		   	          'Acción'
		   	],
		   	colModel:[{
		   			name: 'IDCATEGORIA',
		   			index: 'IDCATEGORIA',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'right',
		   			width: 50
		   		},
		   		{
		   			name: 'NMCATEGORIA',
		   			index: 'UPPER(NMCATEGORIA)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 130,
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
		   			name: 'FDFECREGISTRO',
		   			index: 'FDFECREGISTRO',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 100,
		   		},
		   		{
		   			name: 'ACCION',
                                        search: false,
                                        sortable:false,
		   			align: 'center',
                                        width: 100,
                                        editable:true
                                       },
		   	],
		   	rowNum: -1,
			mtype: 'POST',
		   	sortname: 'FDFECREGISTRO',
                        viewrecords: true,
                        sortorder: 'desc',
                        rownumbers: true,
                        caption:'',
                        loadtext: 'Cargando informaci&oacute;n....',
                        loadonce: false,
		});
		$('#consulta-catcentrocostos-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true});
	},
};

CatcentrocostosIndex.init();
/*
*/