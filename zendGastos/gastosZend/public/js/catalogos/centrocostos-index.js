var CentrocostosIndex = {
		init : function() {
			$(".grid-title").html("Centro de costos");
			
                        CentrocostosIndex.renderGrid();
                        
                         
                        
			$("#selStatus__").change(function( e ) {
				e.preventDefault();
				CentrocostosIndex.ChangeFilter();
			});
			
			$("#addNuevaCategoria_").click(function( e ) {
				e.preventDefault();
				Menu.loadModuleMenu('catalogos', 'categorias', 'add', '#');
				  return false;
			});

			$("#idCosto").keydown(function (e) {
				if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
					return;
				}

				if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
					e.preventDefault();
				}
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
                            click : function(e){
                            e.preventDefault();
                                $('#lblFormModalSuc').html($(this).attr("title"));
				$('#idCosto').val( $(this).attr("id-rel") );
                                var name = $(this).attr("id");
                                var categoriaId = $("#categoria").val(); 
				$('#userid').val( $('#userid').html() );
				var userid = $('#userid').html();
				$.ajax({
					  url: baseUrl + '/catalogos/centrocostos/getcosto',
					  type: 'POST',
					  data: {id: $(this).attr("id-rel"), userid: userid, name: name, categoriaId: categoriaId},
					  dataType: 'json',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  //return false;
						  $('#costoNombre').val( data.categoria[0].NMCENTROCOSTO );
						  $('#idCosto').val( data.categoria[0].IDCENTROCOSTO );
						  $('#tipomovto').val( "UPD" );
						  //$('#categoriaid select option:selected').val( data.categoria[0].IDCATEGORIA );
                                                  $('#categoriaid').val(data.categoria[0].IDCATEGORIA);
                                                  //$("#categoriaid option[value=" + data.categoria[0].IDCATEGORIA  + "]").attr("disabled", false);
						  console.log('IDCATEGORIA: ' + data.categoria[0].IDCATEGORIA );
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

		if( $("#tipomovto").val() !=  'UPD' ) {
				$.ajax({
					  url: baseUrl + '/catalogos/centrocostos/validanumcc',
					  type: 'POST',
					  data: {nuevoid: $("#idCosto").val(),categoria: $("#categoriaid").val()},
					  dataType: 'html',
					  success: function(data) {
						data = jQuery.parseJSON(data);
						if(data.success != 0){
							$("#idCosto").focus();
							alert(data.message);
							return false;
						}

						$("#frmCentroCostos").submit();

						return false;
						var confirmar = confirm("¿Desea guardar?");
				
						if (confirmar) {
							$('#frmAddModal').modal('hide');
						}


					  } 
				});
		} else {

			$("#frmCentroCostos").submit();

						return false;
						var confirmar = confirm("¿Desea guardar?");
				
						if (confirmar) {
							$('#frmAddModal').modal('hide');
						}

		
		}
			});
			
			$('#frmAddModal').on('hidden', function () {
				CentrocostosIndex.resetearCampos();
			});

			$("#frmCentroCostos").validate({
				rules: {
					idCosto: "required",
					costoNombre: "required",
					categoriaid: "required"
				},
				messages: {
					idCosto: "Ingrese el número del costo",
					costoNombre: "Ingrese el nombre del costo",
					categoriaid: "Seleccione una categoria"
				},
				submitHandler: function(form) {
				    //alert("Todo esta validado: " + $("#frmCategoria").serialize()); return false;
				    var userid = $('#userid').html();
					$.ajax({
						  url: baseUrl + '/catalogos/centrocostos/setcosto',
						  type: 'POST',
						  data: $("#frmCentroCostos").serialize(),
						  dataType: 'json',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  //console.log(data);
							  $('#frmAddModal').modal('hide');
							  CentrocostosIndex.ChangeFilter();
							  return false;

							} 
					});

				}
			});
                        
                        $(document).on({
                            change : function(e){
                                CentrocostosIndex.gridReload();
                            }
                        },"#categoria");
			
		},// End Init() 
		resetearCampos : function() {

			$("#divStatus").hide();
			$("#status").val("A");
			$('#lblFormModalSuc').html("Agregar costo");
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
		},
		ChangeFilter : function() {
			var userid = $('#userid').html();
			Layout.showLoading();
			$.ajax({
				  url: baseUrl + '/catalogos/centrocostos/index/',
				  type: 'POST',
				  data: {categoria: $("#categoria").val(), userid: userid},
				  dataType: 'html',
				  complete: function() {
						//Modal.close();
				  },
				  success: function(data) {
					  	Layout.hideLoading();
					  	$('#catalogo-content').html(data);
					} 
			});
		},
                                
                gridReload: function(){ 
                var cat = $("#categoria").val(); 
                var sub = $("#subcategoria").val();
                var status = $('#status').val();
                var userId =  $('#userid').val();
                var bySelect = true;
                //console.log(cat);
                jQuery("#consulta-costos-grid").jqGrid('setGridParam',{
                    url: baseUrl + '/catalogos/centrocostos/get-centrocostos',
                    postData: { userId: userId,status:status, categoria: cat, searchBySelect: bySelect },
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

		var grid = $('#consulta-costos-grid').jqGrid({
		   	url: baseUrl + '/catalogos/centrocostos/get-centrocostos',
			datatype: 'json',
                    postData: { userQuasar: '',status:status,userid: userId, categoria: categoria},
			autowidth: true,
			height: '100%',
                    ondblClickRow: function (rowId) {
                          //var rowData = $(this).getRowData(rowId);
                          //SubcategoriasIndex.editRow(rowData['IDCUENTACAT']);
			},
		   	colNames:[
		   	          'No. Costos',
		   	          'Costos',
                                  'Estatus',
                                  'Fecha actualizada',
		   	          'Acción'
		   	],
		   	colModel:[{
		   			name: 'IDCENTROCOSTO',
		   			index: 'IDCENTROCOSTO',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'right',
		   			width: 50
		   		},
		   		{
		   			name: 'NMCENTROCOSTO',
		   			index: 'UPPER(NMCENTROCOSTO)',
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
					width: 100,
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
		   			align: 'center',
					sortype: false,
		   			search: false,
                                        sortable:false,
					width: 100,
					editable:true,
				},
		   	],
		   	rowNum: -1,
			mtype: 'POST',
			rownumbers: true,
		   	sortname: 'FDFECREGISTRO',
                        viewrecords: true,
                        sortorder: 'desc',
                        caption:'',
                        loadtext: 'Cargando informaci&oacute;n....',
                        loadonce: false,
		});
		$('#consulta-costos-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true});
	},
};

CentrocostosIndex.init();
/*

*/