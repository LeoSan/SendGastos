var PagosViaCie = {
		init : function() {
			$(".grid-title").html("Pagos via cie");
			PagosViaCie.contarSeleccionados();
			
			$("#empresaChequesCuenta").change(function(e){
				e.preventDefault();
				var module = "catalogos";
				var controller = "tesoreria";
				var action = "pagosviacie";
				var userid = $('#noEmpleado').html();
				$('#catalogo-content').html('');
				Layout.showLoading();
				$.ajax({
					  url: baseUrl + '/' + module + '/' + controller + '/' + action+ '/',
					  type: 'GET',
					  data: {test: 'prueba', userid: userid, empresaChequesCuenta:$(this).val()},
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
				$("#tablaPagosViaCie input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $("#checkAll").is(':checked') == true ){
							$(this).prop( "checked", true);
						}else{
							$(this).prop( "checked",false );
						}
					}
				});
				PagosViaCie.contarSeleccionados();
			});

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					$("#cuenta-" + $(this).attr("gastoid") ).focus();
					
					if( $( this ).is(':checked') == false ){
						$("#checkAll").prop( "checked",false );
					}
					
					PagosViaCie.contarSeleccionados();
				}
			}, "#tablaPagosViaCie .checkbox");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					console.log("Hola Mike como estas?.");
					alert("Hola Mike como estas?."); return false;
				}
			}, "#btnGuardar_");
			
			$("#btnGuardar").click(function(e){
				e.preventDefault();

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
				var userid = $("#noEmpleado").html();
				var pantalla = 'depositoAnticipoTransferenciaElectronica';
				console.log("Inicio de guardado");
				/*
				if( $("#tipoCheque").val() == "" ){
					alert("Seleccione el tipo de cheque.");
					$("#tipoCheque").focus();
					return false;
				}
				*/
				//Numero de seleccionados
				/*
				var nseleccionados = 0;
				$("#tablaPagosViaCie input[type=checkbox]").each(function(e){
					if( $(this).is(':checked') == true ){
						nseleccionados++;
					}
				});
				
				*/
				//console.log(nseleccionados);return false;
				var nsel = 0;
				nsel = $("#tablaPagosViaCie").find("input[type=checkbox]:checked").length;
				if( nsel == 0 ){
					alert("Seleccione los gastos a procesar.");
					return false;
				}
				
				if( nsel == 1 && $("#checkAll").is(':checked') == true){
					alert("Seleccione los gastos a procesar.");
					return false;
				}
				$("#tablaPagosViaCie input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsPuestos += $(this).attr( "gastoid" ) + "|";
							appUid += $(this).attr( "appuid" ) + "|";
							tasUid += $(this).attr( "tasuid" ) + "|";
							delIndex += $(this).attr( "delindex" ) + "|";
							dynid += $(this).attr( "dynid" ) + "|";
							importe += $(this).attr( "importe" ) + "|";
							//banco += $("#cuenta-" + $(this).attr( "gastoid" )).val() + "|";
							banco += "|";
							//cuentas += $("#cuenta-" + $(this).attr( "gastoid" ) + " option:selected").attr("fccuenta") + "|";
							cuentas += "|";
							//empresaFact += $("#cuenta-" + $(this).attr( "gastoid" )).val() + "|";
							empresaFact += $("#empresaChequesCuenta").val() + "|";
							//cheques += $("#ncheque-" + $(this).attr( "gastoid" )).val() + "|";
							cheques += "|";
							nombre += $(this).attr( "nombre" ) + "|";
							//rfc += $(this).attr( "rfc" ) + "|";
							rfc += "|";
							etapa += $(this).attr( "tipomovto" ) + "|";
							if( cuentas == "- Seleccione una opción -" ){
								alert("Seleccione un cuenta del gasto.");
								$("#cuenta-" + $(this).attr( "gastoid" ) ).focus();
								return false;
							}
							
							if( $.trim(cheques) == "" ){
								alert("Ingrese el número de cheque del gasto.");
								$("#ncheque-" + $(this).attr( "gastoid" ) ).focus();
								return false;
							}
							
						}
					}
				});
				//Aplicamos tesoreria
				Layout.showLoading();
				$.ajax({
    		        type: "POST",
    		        dataType: 'json',
    		        url: baseUrl + '/catalogos/tesoreria/setaplicatesoreria',
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
    					tipoPago: '40',
    					nombre: nombre,
    					rfc: rfc,
    					userid: userid,
    					pantalla: pantalla
    				},
    		        success: function (data) {
    		        	console.log( data );
    		        	//return false;
    		        	if (data.success == true) {
    		        		Menu.loadModuleMenu('catalogos', 'tesoreria', 'pagosviacie', '#');
    		        		Layout.hideLoading();
    		        		console.log( data.num_bloque );
    		            } else {
    		            	alert("Ocurrios un error: " + data.msg);
    		            	Layout.hideLoading();
    		            }
    		        }
    		    });
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
			$("#tablaPagosViaCie input[type=checkbox]").each(function(e){
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
						importe += parseFloat( anticipo.replace( ",", "") );
					}
				}
			});
			
			$("#anticipoSeleccionados").html(seleccionados);
			$("#importeADepositar").html("$" + PagosViaCie.format(parseFloat(importe).toFixed(2)) );
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
   $("#tablaPagosViaCie input[type=checkbox]").each(function(e){
	   $(this).attr( "checked", $("#checkAll").is(':checked') );
	});
   console.log("Hol aqui ando");
   PagosViaCie.contarSeleccionados();
}
PagosViaCie.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/