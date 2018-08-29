var ReportePlandeViajeExistente = {
		init : function() {
			//$(".grid-title").html("Consulta de comprobaciones de plan de viajes");
			ReportePlandeViajeExistente.renderGrid();
                        
                        
			

		},// End Init() 
		resetearCampos : function() {
			$("#idCategoria").val("0");
			$("#categoria").val("");
			$("#divStatus").hide();
			$("#status").val("A");
			$('#lblFormModalSuc').html("Agregar sucursal");
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
		},// End resetearCampos
                
            renderGrid : function() {
	 console.log('baseUrl :' + baseUrl);
        var pantalla = 'reporteplanviaje';
        var idUser = $("#idsolicitante").html();
        var detalle = '0';
        var grid = $('#reporte-planviaje-grid').jqGrid({
                url: baseUrl + '/planesdeviaje/reportes/get-reporte-plan-viaje',
                datatype: 'json',
            postData: { 
                pantalla     : pantalla,
                idSol        : idUser,
                detalle      : detalle
            },
			autowidth: true,
            //shrinkToFit: true,
			height: 200,
			// height: alto - 240,
			ignoreCase: true,
			ondblClickRow: function (rowId) {
				// Archivo.showLoading();
//				var rowData = $(this).getRowData(rowId);
//				ConsultaInventario.renderElementDetail(rowData['IDDOCTO'],rowData['CREDITO']);
			},
		   	colNames:[
                                  'Caso',
                                  'Registro',
                                  'Termina', 
		   	          'Inicia',
                                  'Motivo',		   	          
                                  'Núm cuentas',
                                  'Comprobo'
		   	],	
		   	colModel:[
		   		{
		   			name: 'CASO',
		   			index: 'CASO',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'right',
                                        width: 100
		   		},{
		   			name: 'UPPER(REGISTRO)',
		   			index: 'UPPER(REGISTRO)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
                                        width: 100
		   		},{
		   			name: 'UPPER(INICIA)',
		   			index: 'UPPER(INICIA)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
                                        width: 100
		   		},{
		   			name: 'UPPER(TERMINA)',
		   			index: 'UPPER(TERMINA)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
                                        width: 100
		   		},{
		   			name: 'UPPER(MOTIVO)',
		   			index: 'UPPER(MOTIVO)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
                                        width: 200
		   		},{
		   			name: 'UPPER(NUMCREDITOS)',
		   			index: 'UPPER(NUMCREDITOS)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'right',
                                        width: 50
		   		},{
		   			name: 'UPPER(COMPROBO)',
		   			index: 'UPPER(COMPROBO)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
                                        width: 100
		   		}
		   	],
                    rowNum: 200,
		    loadonce: false,
		    altRows: true,
                    mtype: 'POST',
                    gridview: false,
		    pager: '#reporte-planviaje-page',
                    sortname: 'CASO',
                    sortorder: 'desc',
		    viewrecords: true,
                    rownumbers: true,
		    caption:'',
		    loadtext: 'Cargando informaci&oacute;n....',
		    loadBeforeSend: function(xhr, settings){
		    	// Archivo.showLoading();
		    },
		    loadComplete: function(data) { // inicio loadComplete
		    	Archivo.hideLoading();
                        

                    } // fin loadComplete
		});
		$('#reporte-planviaje-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true, searchOnEnter: false});
	},
                
};
ReportePlandeViajeExistente.init();