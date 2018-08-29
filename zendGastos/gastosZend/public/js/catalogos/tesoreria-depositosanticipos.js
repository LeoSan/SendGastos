var TesoreriaDepositoanticipos = {
		init : function() {
			$(".grid-title").html("Depósitos de anticipos transferencia electrónica");
			TesoreriaDepositoanticipos.contarSeleccionados();
			
			$("#id_empresa").change(function(e){
				e.preventDefault();
				var module = "catalogos";
				var controller = "tesoreria";
				var action = "depositosanticipos";
				var userid = $('#noEmpleado').html();
				$('#catalogo-content').html('');
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/' + module + '/' + controller + '/' + action+ '/',
					  type: 'GET',
					  data: {test: 'prueba', userid: userid, id_empresa:$(this).val()},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  Layout.hideLoading();
						  $('#catalogo-content').html(data);
					  } 
				});
			});
			
			$( "#checkAll" ).click(function(e){
				$("#tablaDepositoAnticipos input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $("#checkAll").is(':checked') == true ){
							$(this).prop( "checked", true);
						}else{
							$(this).prop( "checked",false );
						}
					}
				});
				TesoreriaDepositoanticipos.contarSeleccionados();
			});

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					
					if( $(this).is(":checked") == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					TesoreriaDepositoanticipos.contarSeleccionados();
				}
			}, "#tablaDepositoAnticipos .checkbox");
						
			$("#btnGenerarArchivo").click(function(e){
				e.preventDefault();
				var userid = $("#noEmpleado").html();
				var url = baseUrl + "/catalogos/tesoreria/getarchivospei?userid=" + userid;
				window.open( url ,'_blank');
			});
			
			$("#btnFinalizar").click(function(e){
				Layout.showLoading();
				Menu.loadModuleMenu('catalogos', 'tesoreria', 'depositosanticipos', '#');
        		Layout.hideLoading();
			});
			
			$("#btnGuardar").click(function(e){
				e.preventDefault();

				var res = confirm("¿Confirma las transferencias electrónicas seleccionadas?");
				
				if(!res){
					console.log("El usuario no quiere hacer esta operacion");
					return false;
				}
				
				$(this).val("Enviando transferencia electrónica...");
				$(this).html("Enviando transferencia electrónica...");
				$(this).attr("disabled", "disabled"); //Desabilitamos el boton

				var idsPuestos = '';
				var appUid = '';
				var tasUid = '';
				var delIndex = '';
				var empresaFact = '';
				var banco = '';
				var cuentas = '';
				var cheques = '';
				var dynid = '';
				var importe = '';
				var etapa = '';
				var nombre = '';
				var rfc = '';
				var cuentaDep = '';
				var userid = $("#noEmpleado").html();
				var pantalla = 'pagosChequesViaAnticipos';
				
				if( $("#id_empresa").val() == "" ){
					alert("Seleccione una empresa a procesar.");
					$("#id_empresa").focus();
					return false;
				}
				
				if( $("#id_cuenta").val() == "" ){
					alert("Seleccione una empresa a procesar.");
					$("#id_cuenta").focus();
					return false;
				}
				
				//Numero de seleccionados
				var nsel = 0;
				nsel = $("#tablaDepositoAnticipos").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gastos a procesar.");
					return false;
				}
				
				if( nsel == 1 && $("#checkAll").is(':checked') == true){
					alert("Seleccione los gastos a procesar.");
					return false;
				}

				var faltaCuenta = false;
				$("#tablaDepositoAnticipos input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsPuestos += $(this).attr( "gastoid" ) + "|";
							appUid += $(this).attr( "appuid" ) + "|";
							tasUid += $(this).attr( "tasuid" ) + "|";
							delIndex += $(this).attr( "delindex" ) + "|";
							dynid += $(this).attr( "dynid" ) + "|";
							importe += $(this).attr( "importe" ) + "|";
							//banco += "0012";
							banco += $("#cuenta-" + $(this).attr( "gastoid" )).val() + "|";
							//cuentas += $("#cuenta-" + $(this).attr( "gastoid" ) + " option:selected").text() + "|";
							cuentaDep += $("#cuenta-" + $(this).attr( "gastoid" ) + " option:selected").text() + "|";
							cuentas += $("#id_cuenta").val() + "|";
							//empresaFact += $("#cuenta-" + $(this).attr( "gastoid" )).val();
							//empresaFact += $(this).attr( "facturarA" );
							empresaFact += $("#id_empresa").val() + "|"; // Banco de salida PCI
							cheques += ''+ "|";
							nombre += $(this).attr( "nombre" ) + "|";
							rfc += $(this).attr( "rfc" ) + "|";
							etapa += $(this).attr( "tipomovto" ) + "|";
							if( $("#cuenta-" + $(this).attr( "gastoid" ) + " option:selected").text() == "- Seleccione una opción -" ){
								faltaCuenta = true;
								alert("Seleccione un cuenta del gasto.");
								$("#cuenta-" + $(this).attr( "gastoid" ) ).focus();
								return false;
							}
						}
					}
				});
				
				if(faltaCuenta){
					return false;
				}

				Layout.showLoading();
				//Aplicamos tesoreria
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreria/setaplicatransferenciaelectronica',
    		        data: {
    					idGasto: idsPuestos,
    					appUid: appUid,
    					tasUid: tasUid,
    					delIndex: delIndex,
    					dynid: dynid,
    					importe: importe,
    					banco: banco,
    					cuentas: cuentas,
    					empresaFact: empresaFact,
    					cheques: cheques,
    					etapa: etapa,
    					tipoPago: '36',
    					nombre: nombre,
    					rfc: rfc,
    					cuentaDep:cuentaDep,
    					userid: userid,
    					pantalla: pantalla
    				},
    		        success: function (data) {
    		        	console.log(data);
		            	Layout.hideLoading();
    		        	if (data.success == true) {
    		        		$("#btnGenerarArchivo").show();
    						$("#btnFinalizar").show();
    						$("#btnGuardar").hide();
    						console.log( data.num_bloque );
    		            } else {
    		            	alert("Ocurrio un error: " + data.msg);
    		            }
    		        }
    		    });
				//end aplicamos tesoreria
				return false;
				//end aplicamos tesoreria
				console.log(idsPuestos);
				console.log(appUid);
				console.log(tasUid);
				console.log(delIndex);
				console.log(cuentas);
			});
			
		},// End Init() 
		resetearCampos : function() {
			$("#idCategoria").val("0");
			$("#categoria").val("");
			$("#divStatus").hide();
			$("#status").val("A");
			$('#lblFormModalSuc').html("Agregar sucursal");
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
		},// End Init() 
		contarSeleccionados : function() {
			var seleccionados = 0;
			var importe = 0;
			var cadena = '';
			var cadenaArray = '';
			var anticipo = '';
			$("#tablaDepositoAnticipos input[type=checkbox]").each(function(e){
				//console.log( $(this).attr("checked") );
				if( $(this).attr("name") != "checkAll" ){
					if( $(this).is(':checked') ) {
						//cada elemento seleccionado
						seleccionados += 1;
						cadena = $(this).attr('name');
						cadenaArray = cadena.split("-");
						//console.log(cadenaArray);
						anticipo = $("#importe-" + cadenaArray[1] ).html();
                        anticipo = anticipo.substring(1);
                        //console.log(anticipo);
                        anticipo = anticipo.replace( ",", "");
                        anticipo = anticipo.replace( ",", "");
						importe += parseFloat( anticipo.replace( ",", "") );
					}
				}
			});
			
			$("#anticipoSeleccionados").html(seleccionados);
			$("#importeADepositar").html("$" +   TesoreriaDepositoanticipos.format(parseFloat(importe).toFixed(2)) );
		},
        format: function(num){
            var n = num.toString(), 
            p = n.indexOf('.');
            return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
                return p<0 || i<p ? ($0+',') : $0;
            });
        }
};
function checkBox(e)
{
   e = e||event;/* get IE event ( not passed ) */
   e.stopPropagation? e.stopPropagation() : e.cancelBubble = true;
   //Selecciona y deselecciona todos los checks
   $("#tablaDepositoAnticipos input[type=checkbox]").each(function(e){
	   $(this).attr( "checked", $("#checkAll").is(':checked') );
	});
   console.log("Hol aqui ando");
   TesoreriaDepositoanticipos.contarSeleccionados();
}



TesoreriaDepositoanticipos.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/