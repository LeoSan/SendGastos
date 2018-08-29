var NivelesIndex = {
		puestosAgregados : [],
		init : function() {
			//alert("Hola como estas?");
			//var baseUrl = '/cuentas/public';
			
			$(".grid-title").html("Catálogo de Niveles / Puestos");
			
                        NivelesIndex.renderGrid();
			$(".asociarNiv").click(function(e){
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
							NivelesIndex.puestosAgregados[item.IDVALOR] = item.DESCRIP;
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
						//console.log(NivelesIndex.puestosAgregados);
						Layout.hideLoading();
						$('#modalAsociarPuesto').modal();
					}
				});
			});
			
			$("#btnAddPuesto").click(function(e){
				e.preventDefault();
				
				var haySeleccionados = false;
				$('#idPuestoDisponible option').each(function() {
				    if (this.selected)
				    	haySeleccionados = true;
				});
				
				if( !haySeleccionados ) {  
		            alert("Debe seleccionar un puesto a agregar.");
		            return false;
		        }
				
				$("#idPuestoDisponible option:selected").each(function(){
					NivelesIndex.puestosAgregados[$(this).val()] = $(this).text();
				});
				
				$("#idPuestoDisponible option:selected").remove();
				
				$('#idPuestoAgregado').empty();
				for (var elemento in NivelesIndex.puestosAgregados){
					if(NivelesIndex.puestosAgregados[elemento]){
						$('#idPuestoAgregado').append($('<option>', {
						    value: elemento,
						    text: NivelesIndex.puestosAgregados[elemento]
						}));
					}	
				}
			});
			
			$("#btnDelPuesto").click(function( e ){
				e.preventDefault();
				
				var haySeleccionados = false;
				$('#idPuestoAgregado option').each(function() {
				    if (this.selected)
				    	haySeleccionados = true;
				});
				
				if( !haySeleccionados ) {  
		            alert("Debe seleccionar el puesto a eliminar.");
		            $('#idPuestoAgregado').focus();
		            return false;
		        }
				
				//
				$("#idPuestoAgregado option:selected").each(function(){
					$("<option value='" + $(this).val() + "'>" + $(this).text() + "</option>").appendTo("#idPuestoDisponible");
					NivelesIndex.puestosAgregados[$(this).val()] = null;
				});
				
				$("#idPuestoAgregado option:selected").remove();

			});
			
			$("#btnGuardarNivelPuesto").click(function(e){
				if( $("#frmEditarNivel #descNivel").val() == "" ){
					alert("Ingrese la descripción");
					$("#frmEditarNivel #descNivel").focus();
					return false;
				}
				
				var puestos = '';
				//Cadena de Puestos
				for (x in NivelesIndex.puestosAgregados) {
					if ( NivelesIndex.puestosAgregados[x] ) {
						puestos += x + '|';	
					}
				}
				
				//alert("Hola miguqel como estas?");return false;
				var username = $("#noEmpleado").html();
				//Se guarda la informacion
				$.ajax({
					  url: baseUrl + '/catalogos/niveles/setnivelpuesto',
					  type: 'POST',
					  data: $("#frmEditarNivel").serialize() + 
					  		'&puestos=' + puestos +
					  		'&username=' + username,
					  dataType: 'json',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  console.log(data);
						  //return false;
						  if( data.success == '0'){
							  $('#modalAsociarPuesto').modal('hide');
							  Menu.loadModuleMenu('catalogos', 'niveles', 'index', '#');
						  }
						  
						  return false;
						} 
				});
				return false;
			});
			
			$('#frmAddModal').on('hidden', function () {
				NivelesIndex.resetearCampos();
			});
			/*
			$('#frmAddModal').on('show', function () {
				$('#lblFormModalSuc').html("Agregar sucursal");
			});
			*/
			
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
                renderGrid : function() {
		var alto = $(document).height();
		var ancho = $(document).width();
                var status = $('#status').val();
                var userId = $('#userid').val();
                var categoria = $('#categoria').val();

		var grid = $('#consulta-niveles-grid').jqGrid({
		   	url: baseUrl + '/catalogos/puestos/get-lista-puestos', // get-lista-puestos
			datatype: 'json',
                    postData: { userQuasar: '',status:status,userid: userId, categoria: categoria},
			autowidth: true,
			height: '100%',
                    ondblClickRow: function (rowId) {
			},
		   	colNames:[
		   	          '#',
		   	          'Nivel',
                                  'Descripción',
                                  'Fecha de actualización',
                                  'Número de puestos',
		   	          'Acción'
		   	],
		   	colModel:[{
		   			name: 'IDVALOR',
		   			index: 'IDVALOR',
		   			sortype: false,
		   			search: false,
				   	resizable: false,
		   			align: 'left',
		   			width: 50
		   		},
		   		{
		   			name: 'IDVALOR',
		   			index: 'IDVALOR',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 130,
		   		},
		   		{
		   			name: 'DESCRIP',
		   			index: 'DESCRIP',
                                        sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   		},
                                {
		   			name: 'FECACT',
		   			index: 'FECACT',
                                        sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   		},
                                                                {
		   			name: 'TOTAL',
		   			index: 'TOTAL',
                                        search: false,
                                        sortable:false,
		   			//searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   		},
                                
		   		{
		   			name: 'ACCION',
                                        search: false,
                                        sortable:false,
		   			align: 'left',
                                        width: 100,
                                        editable:true
                                       }
		   	],
		   	rowNum: -1,
			mtype: 'POST',
		   	sortname: 'IDVALOR',
                        viewrecords: true,
                        sortorder: 'asc',
                        caption:'',
                        loadtext: 'Cargando informaci&oacute;n....',
                        loadonce: false,
		});
		$('#consulta-niveles-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true});
	}
};

NivelesIndex.init();
