var ReportePropuestaSemPagos = {
		init : function() {
			$(".grid-title").html("Propuesta de pago semanal pagos");
			$( "#fechaReporte" ).datepicker({"dateFormat": "dd/mm/yy"});
			
			$("#btnGenerarReporte").click(function(e){
				e.preventDefault();

				if( $.trim( $( "#id_lote" ).val() ) == "" ){
					$( "#id_lote" ).focus();
					return false;
				}


				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
			        type: "POST",
			        dataType: 'html',
			        url: baseUrl + '/catalogos/contabilidad/propuestasempagos',
			        data: {
			        	getreporte: 'si',
			        	id_lote: $("#id_lote").val(),
						empleadoid: $("#noEmpleado").html()
					},
			        success: function (data) {
			        	//console.log(data);
		            	Layout.hideLoading();
		            	$("#resReportePropuestaSemPagos").html(data);
		            	return false;
			        }
			    });
			});

			$("#printReportePropuestaSemPagos").click(function(e){
				e.preventDefault();
				$("div#resReportePropuestaSemPagos").printArea();
			});
		},// End Init() 
		resetearCampos : function() {
			$("#fechaReporte").val("");
		}// End Init() 
		
};
ReportePropuestaSemPagos.init();
