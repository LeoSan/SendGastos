var ReporteProvisionCartera = {
		init : function() {
			$(".grid-title").html("Propuesta de pago semanal anticipos");
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
			        url: baseUrl + '/catalogos/contabilidad/propuestapago',
			        data: {
			        	getreporte: 'si',
			        	id_lote: $("#id_lote").val(),
						empleadoid: $("#noEmpleado").html()
					},
			        success: function (data) {
			        	//console.log(data);
		            	Layout.hideLoading();
		            	$("#resReporteProvisionCartera").html(data);
		            	return false;
			        }
			    });
			});

			$("#printReporteProvisionCartera").click(function(e){
				e.preventDefault();
				$("div#resReporteProvisionCartera").printArea();
			});
		},// End Init() 
		resetearCampos : function() {
			$("#fechaReporte").val("");
		}// End Init() 
		
};
ReporteProvisionCartera.init();
