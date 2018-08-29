var MiexpedienteIndex2 = {
	init : function() {

		$("#modalMensaje").css("display", "none");
        $("#bodyGastoList").css("height", "250px");

        MiexpedienteIndex2.renderGrid();
        var url = baseUrl + '/catalogos/miexpediente/getallusers';
        $("#usName").focus();

        $.ajax({
			url: url,
			type: 'POST',
			data: '',
			dataType: 'html',
			success: function(data) {
				data = $.parseJSON(data);
				globaldata = data;
				globalArrIndex = [];
				arrdata = [];
				counter = 0;

				$.each(data, function( index, value ) {
					if(value.NOMBRE != null && value.NOMBRE != ''){
						arrdata[counter] = value.NOMBRE;
						globalArrIndex[counter] = value.IDU;
						counter ++;
					}
				});

				var typeahead = $('#usName').data('typeahead');
				if (typeahead) typeahead.source = arrdata;
				else $('#usName').typeahead({source: arrdata,minLength: 1});
			}
        });

        $.ajax({
			url: baseUrl + '/catalogos/miexpediente/getallprovee',
			type: 'POST',
			data: '',
			dataType: 'html',
			success: function(data) {
				data = $.parseJSON(data);
				globaldata = data;
				globalArrIndex2 = [];
				arrdata2 = [];
				counter = 0;

				$.each(data, function( index, value ) {
					if(value.NOMBRE != null && value.NOMBRE != ''){
						arrdata2[counter] = value.NOMBRE;
						globalArrIndex2[value.NOMBRE] = value.IDU;
						counter ++;
					}
				});
				console.info(globalArrIndex2);
				var typeahead2 = $('#usProveedor').data('typeahead');
				if (typeahead2) typeahead2.source = arrdata2;
				else $('#usProveedor').typeahead({source: arrdata2,minLength: 1,
					updater: function(item){ 
          		  $("#usProveedorId").val( globalArrIndex2[item] );return item;
        	  }});
			}
        });
        
        
        $("#btnBuscarConsultaGralByParameters").click(function(e){

        	var gasto = $("#numGasto").val();
        	var user = $("#usName").val();
        	var credito = $("#numCredit").val();
        	var proveedor = $("#usProveedor").val();
	
        	if(gasto == "" && user == "" && credito == "" && proveedor == ""){
        		$('#modalMensaje').find('.modal-body')
        					.html("Debe Seleccionar al Menos un Campo");
        		$('#modalMensaje').modal('show');
        	}else{
        		MiexpedienteIndex2.gridReload();
		        $("#modalGasto").css("width","985px");
				$("#modalGasto").css("left","40%");
				$('#modalGasto').modal('show');
        	}
        });

		$(".getReport").unbind( "click" );
				
		$(document).on({
			click: function(e){
				e.preventDefault();
				var elem = $(this).attr("id-rel")
	            $('#modalGasto').modal('hide');
				$("#resultadoConsultaGeneral").html("Buscando...");

				var gastoid = elem;
				var etapa = "ETAP1";
				var appid = '';
				var delindex = '';
				var userid = $("#userid").html();

				Layout.showLoading();
				$.ajax({
					type: "POST",
					dataType: 'html',
					url: baseUrl + '/catalogos/miexpediente/getdetalle',
					data: {
						gastoid: 	gastoid,
						etapa: 		etapa,
						appid: 		appid,
						delindex:	delindex,
						userid: 	userid
					},
					success: function (data) {
						Layout.hideLoading();
						$("#resultadoConsultaGeneral").html(data);
				        return false;
					}
				});  
			}
		},".getReport");

		$(".grid-title").html("Consulta general");
                
	},// End Init() 
	cargarReporte : function() { }, // End Init()
	gridReload: function(){ 
                
		var gasto = $("#numGasto").val();
        var user = $("#usName").val();
        var credito = $("#numCredit").val();
        var proveedor = $("#usProveedorId").val();
   
        jQuery("#consulta-GastoList-grid").jqGrid('setGridParam',{
        	url: baseUrl + '/catalogos/miexpediente/getgastolist',
        	postData: { gasto: gasto,user:user, credito: credito, proveedor: proveedor},
        	mtype: 'POST',
        	datatype: 'json',
        	page:1
        }).trigger("reloadGrid");
	},
	renderGrid : function() {			
		var gasto = $("#numGasto").val();
		var user = $("#usName").val();
		var credito = $("#numCredit").val();
		var proveedor = $("#usProveedorId").val();
		var alto = $(document).height();
		var ancho = $(document).width();
		var status = $('#status').val();
		var userId = $('#userid').val();
		var categoria = $('#categoria').val();

		var grid = $('#consulta-GastoList-grid').jqGrid({
			url: baseUrl + '/catalogos/miexpediente/getgastolist',
			datatype: 'json',
			postData: { gasto: gasto, user:user, credito: credito, proveedor: proveedor},
			autowidth: true,
			height: '100%',
			ondblClickRow: function (rowId) {},
			colNames:[
			          'N&uacute;mero de gasto',
			          'Fecha de registro',
			          'N&uacute;mero de cuenta',
			          'Importe comprobado',
			          'Tipo de movimiento',
			          'N&uacute;mero de cartera',
			          'Nombre del usuario',
			          'Estatus comprobaci&oacute;n'
			],
			colModel:[{
				name: 'FM.IDGASTOMAIN',
				index: 'FM.IDGASTOMAIN',
				sortype: false,
				search: false,
				resizable: false,
				align: 'left',
				width: 50
			},
			{
				name: 'FM.FDFECREGISTRO',
				index: 'FM.FDFECREGISTRO',
				sortype: 'string',
				searchoptions: {sopt: ['cn', 'eq']},
				resizable: false,
				align: 'left',
				width: 70,
			},
			{
				name: 'FM.FCCUENTACONTABLE',
				index: 'FM.FCCUENTACONTABLE',
				sortype: 'string',
				searchoptions: {sopt: ['cn', 'eq']},
				resizable: false,
				align: 'left',
				width: 90,
			},
			{
				name: 'FM.FNIMPORTECOMPROBADO',
				index: 'FM.FNIMPORTECOMPROBADO',
				sortype: 'string',
				searchoptions: {sopt: ['cn', 'eq']},
				resizable: false,
				align: 'left',
				width: 100,
			},
			{
				name: 'FM.TPOMOVIMIENTO',
				index: 'FM.TPOMOVIMIENTO',
				sortype: 'string',
				searchoptions: {sopt: ['cn', 'eq']},
				resizable: false,
				align: 'left',
				width: 100,
			},
			{
				name: 'FA.FCCREDITOCARTERA',
				index: 'FA.FCCREDITOCARTERA',
				sortype: 'string',
				searchoptions: {sopt: ['cn', 'eq']},
				resizable: false,
				align: 'left',
				width: 130,
			},
			{
				name: 'CU.NMNOMBRE',
				index: 'CU.NMNOMBRE',
				sortype: 'string',
				searchoptions: {sopt: ['cn', 'eq']},
				resizable: false,
				align: 'left',
				width: 250,
			},
			{
				name: 'FM.FCSTATUS',
				index: 'FM.FCSTATUS',
				sortype: 'string',
				search: false,
				searchoptions: {sopt: ['cn', 'eq']},
				resizable: false,
				align: 'left',
				width: 100,
			}
			],
			rowNum: -1,
			mtype: 'POST',
			sortname: 'FM.FDFECREGISTRO',
			viewrecords: true,
			sortorder: 'desc',
			caption:'',
			loadtext: 'Cargando informaci&oacute;n....',
			loadonce: false,
		});
		$('#consulta-GastoList-grid').jqGrid('filterToolbar',{
				searchOperators: true, 
				stringResult: true
		});

	}
};
MiexpedienteIndex2.init();