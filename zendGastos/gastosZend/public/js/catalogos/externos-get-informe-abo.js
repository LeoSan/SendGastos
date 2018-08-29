var MiexpedienteIndex = {
	init : function() {

		$(".grid-title").html(titulo);

		$(".verdetalle").on('click', function( e ) {
			e.preventDefault();
			var gastoid = $(this).attr('gastoid');
			var etapa = '';
			var appid = '';
			var delindex = '';
			var userid = $("#userid").html();

			$("#loadingmodal").show();

			$.ajax({
		        type: "POST",
		        dataType: 'html',
		        url: baseUrl + '/catalogos/externos/getdetalle',
		        data: {
		        	gastoid: 	gastoid,
		        	etapa: 		etapa,
		        	appid: 		appid,
		        	delindex:	delindex,
					userid: 	userid
				},
		        success: function (data) {
			        $("#loadingmodal").hide();
		        	$("#myModal #myModalLabel").html("Detalle del gasto " + gastoid);
		        	$("#myModal .modal-body").html(data);
		        	$('#myModal').modal('show');
		        	return false;
		        }
		    });
		});


		miDataJson = jQuery.parseJSON(miDataJson);

		$("#tablaDepositoAnticipos").jqGrid({
        		data: miDataJson,
            		datatype: "local",
			colNames: ['Fecha de solicitud', 'No. Caso', 'Importe solicitado', 'Solicitante', 'Categoría', 'Cuenta', 'Acreditado', 'Estatus'],                        
            		colModel: [
                		{ index: 'FREGISTRO', name: 'FREGISTRO', width:60 },
                		{ index: 'GASTOS', name: 'GASTO', width:50, align: 'right', searchoptions: {
					sopt: ["cn","eq"] } },
				{ index: 'MONTO_SOLICITADO', name: 'MONTO_SOLICITADO', width:45, align: 'right' },
                		{ index: 'SOLICITANTE', name: 'SOLICITANTE',searchoptions: {
					sopt: ["cn","eq"] } },
                		{ index: 'CATEGORIA', name: 'CATEGORIA', sorttype:'number' },
                		{ index: 'CREDITO', name: 'CREDITO', width:70, searchoptions: {
					sopt: ["cn","eq"] } },
				{ index: 'ACREDITADO', name: 'ACREDITADO', sortype: 'string', searchoptions: {
					sopt: ["cn","eq"] }, resizable: true, align: 'left' },
                		{ index: 'ESTADO', name: 'ESTADO', searchoptions: {
					sopt: ["cn","eq"] } }
            		],
			viewrecords: true,
                	pager: "#jqGridPager",
	            	loadonce: true,
		    	autowidth:true,
            		height: 'auto',
        	    	rowNum: 100,
	    		viewrecords: true,
	            	caption: "Mis Gastos",
			ondblClickRow: function(id){ 

                                var gastoid = miDataJson[id-1]['GASTO'];
				var userid = $("#userid").html();

				$("#loadingmodal").show(); 

				$.ajax({
			        type: "POST",
			        dataType: 'html',
		        	url: baseUrl + '/catalogos/externos/getdetalle',
		        	data: {
		        		gastoid: 	gastoid,
		        		etapa: 		'',
		        		appid: 		'',
		        		delindex:	'',
					userid: 	userid
				},
			        success: function (data) {
				        $("#loadingmodal").hide();
		        		$("#myModal #myModalLabel").html("Detalle del gasto " + gastoid);
		        		$("#myModal .modal-body").html(data);
			        	$('#myModal').modal('show');
			        	return false;
			        }
		   	 });
   			}
        	});
		$('#tablaDepositoAnticipos').jqGrid('filterToolbar',{
			stringResult: true,
			searchOperators: true
		});


	},// End Init() 

	cargarReporte : function() {
		$.ajax({
	        type: "POST",
	        dataType: 'html',
	        url: baseUrl + '/catalogos/miexpediente/getreporte',
	        data: {
	        	i: $("#reporteid").html(),
				userid: $("#noEmpleado").html()
			},
	        success: function (data) {
		        $("#listaReporteMiExpediente").html(data);
	        	//Layout.hideLoading();   
	        }
	    });
	}// End Init() 
};
MiexpedienteIndex.init();
