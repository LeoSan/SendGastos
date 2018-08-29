var ReporteDiario = {
		init : function() {
			$(".grid-title").html("Reporte diario transferencias electrónicas");
			$( "#fechaReporte" ).datepicker({"dateFormat": "dd/mm/yy"});
			
			$( "#fechaReporte" ).change(function() {
//				  console.log( $(this).val() );

				  ReporteDiario.checkAllFields();
				  
			});
			
			$( "#id_empresa" ).change(function() {
//				  console.log( $(this).val() );

				  ReporteDiario.checkAllFields();
				  
			});
			
			$("#btnGenerarReporteDiario").click(function(e){
				e.preventDefault();

				if($( "#fechaReporte" ).val() == "" || $( "#fechaReporte" ).val() == undefined){
					$('#modalMensaje').find('.modal-body').html("Debe seleccionar una fecha");
					$('#modalMensaje').modal('show');
				}else{
					if($( "#id_empresa" ).val() == "" || $( "#id_empresa" ).val() == undefined){
						$('#modalMensaje').find('.modal-body').html("Debe seleccionar una empresa");
						$('#modalMensaje').modal('show');
					}else{
						if($( "#idLote" ).val() == "" || $( "#idLote" ).val() == undefined){
							$('#modalMensaje').find('.modal-body').html("Debe seleccionar un lote");
							$('#modalMensaje').modal('show');
						}else{
							console.log("Has Value Complete");
//							$("#tablaFechas").children().first().children().first().children().first().html("Hello World");
//							console.log($("#tablaFechas").children().first().children().first().children().first().html());
							
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
						        url: baseUrl + '/catalogos/tesoreria/getreportediario',
						        data: {
									fecha: $("#fechaReporte").val(),
									empleadoid: $("#noEmpleado").html(),
									empresaid: $("#id_empresa").val(),
									empresanm: $("#id_empresa option:selected").text(),
									lote: $( "#idLote" ).val()
								},
						        success: function (data) {
						        	//console.log(data);
					            	Layout.hideLoading();
					            	$("#resReporteDiario").html(data);
					            	return false;
						        }
						    });
						}
					}
				}
			});

			$("#printReporteDiario").click(function(e){
				e.preventDefault();
				$("div#resReporteDiario").printArea();
			});
		},// End Init() 
		resetearCampos : function() {
			$("#fechaReporte").val("");
		},// End Init() 
		checkAllFields : function() {
			console.log("checking");
			if($( "#fechaReporte" ).val() != "" &&
					$( "#fechaReporte" ).val() != undefined &&
					$( "#id_empresa" ).val() != "" &&
					$( "#id_empresa" ).val() != undefined){
				$( "#idLote" ).attr("disabled", false);
				
				$.ajax({
			        type: "POST",
			        dataType: 'html',
			        url: baseUrl + '/catalogos/tesoreria/getfoltesodia',
			        data: {
						fecha: $("#fechaReporte").val(),
						id_empresa: $("#id_empresa").val()
					},
			        success: function (data) {
			        	data = jQuery.parseJSON(data);
		            	Layout.hideLoading();
		            	console.log(data);
		            	
		            	if(data.lotes != undefined){

		            		$('#idLote').empty();
							  
			            	var elements = [$("<option>", {value: "", html: "-Lote-"})];
							  
			            	$.each(data.lotes, function( index, values ) {
		
			            			elements[elements.length] = $("<option>", {value: values.FNNUMARCHCONTROL, html: values.FNNUMARCHCONTROL});
									
			            	});
			            	
			            	$.each(elements, function( indx, opt ) {

								  opt.appendTo($('#idLote'));
								  
			            	});
		            		
		            	}else{
		            		$( "#idLote" ).attr("disabled", true);
		            		$('#modalMensaje').find('.modal-body').html("No se encontraron datos, intente con otra fecha o empresa");
							$('#modalMensaje').modal('show');
		            	}
		            	
		            	
		            	
			        }
			    });
				
			}else{
				$( "#idLote" ).attr("disabled", true);
			}
			
		}
};
ReporteDiario.init();

//@ sourceURL=tesoreria-reportediario.js
