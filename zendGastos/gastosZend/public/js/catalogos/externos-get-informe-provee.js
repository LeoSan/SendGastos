var ExternosProveedor = {
	init : function() {

		$(".grid-title").html(titulo);

		$( ".verdetalle" ).on('click',function(e){
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
	},

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
	} 
};

ExternosProveedor.init();