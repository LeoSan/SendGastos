var MiexpedienteMisgestiones = {
	init : function() {
		var titulo = "Mis gestiones"; 
		$(".grid-title").html(titulo);
		MiexpedienteMisgestiones.cargarReporte();
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
		Layout.showLoading();
		$.ajax({
	        type: "POST",
	        dataType: 'html',
	        url: baseUrl + '/catalogos/miexpediente/misgestionesdetalle',
	        data: {
				userid: $("#noEmpleado").html()
			},
	        success: function (data) {
		        $("#resultMisGestiones").html(data);
	        	Layout.hideLoading();   
	        }
	    });
	}// End Init() 
};
MiexpedienteMisgestiones.init();
