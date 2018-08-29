var ReporteDiarioCheques = {
		init : function() {
			$(".grid-title").html("Reportes diario cheques");
			$( "#fechaReporte" ).datepicker({"dateFormat": "dd/mm/yy"});
			
			$("#btnGenerarReporteDiarioCheques").click(function(e){
				e.preventDefault();

				if( $.trim( $( "#fechaReporte" ).val() ) == "" ){
					$( "#fechaReporte" ).focus();
					return false;
				}

				if( $.trim( $( "#id_empresa" ).val() ) == "" ){
					$( "#id_empresa" ).focus();
					return false;
				}
				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
			        type: "POST",
			        dataType: 'html',
			        url: baseUrl + '/catalogos/tesoreria/getreportediariocheques',
			        data: {
						fecha: $("#fechaReporte").val(),
						empleadoid: $("#noEmpleado").html(),
						empresaid: $("#id_empresa").val(),
						empresanm: $("#id_empresa option:selected").text()
					},
			        success: function (data) {
			        	//console.log(data);
		            	Layout.hideLoading();
		            	$("#resReporteDiarioCheques").html(data);
		            	return false;
			        }
			    });
			});

			$("#printReporteDiarioCheques").click(function(e){
				e.preventDefault();
				$("div#resReporteDiarioCheques").printArea();
			});
		},// End Init() 
		resetearCampos : function() {
			$("#fechaReporte").val("");
		}// End Init() 
		
};
ReporteDiarioCheques.init();
