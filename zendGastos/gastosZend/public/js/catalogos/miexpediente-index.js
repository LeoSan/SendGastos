var MiexpedienteIndex = {
	init : function() {

		$(".grid-title").html(titulo);
		MiexpedienteIndex.cargarReporte();
		$( document ).on({
			click : function( e ) {
				e.preventDefault();
				var gastoid = $(this).attr('gastoid');
				var etapa = '';
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
			        	$("#myModal #myModalLabel").html("Detalle del gasto " + gastoid);
			        	$("#myModal .modal-body").html(data);
			        	$('#myModal').modal('show');
			        	return false;
			        }
			    });
			}
		}, ".verdetalle");
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
	        	Layout.hideLoading();   
	        }
	    });
	}// End Init() 
};
MiexpedienteIndex.init();
