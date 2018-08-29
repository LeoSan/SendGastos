var PagosCheques = {
		init : function() {
			$(".grid-title").html("Depositos de anticipos transferencia electrónica");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					alert("Diste click en Tipo de Cheque");
					return false;
				}
			}, "#tipoCheque");
			
			$( "#checkAll" ).click(function(e){
				$("#tablaPagosCheques input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $("#checkAll").is(':checked') == true ){
							$(this).prop( "checked", true);
						}else{
							$(this).prop( "checked",false );
						}
					}
				});
				PagosCheques.contarSeleccionados();
			});

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					$("#cuenta-" + $(this).attr("gastoid") ).focus();
					PagosCheques.contarSeleccionados();
				}
			}, "#tablaPagosCheques .checkbox");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					$("#frmAddCategoria").submit();
					//alert("Guardamos la nueva sucursal"); return false;
					/*
					if( $.trim( $("#sucursal").val() ) == ""){
						$( "#sucursal" ).parent().addClass("control-group error");
						$( "#sucursal" ).parent().append( '<span class="help-inline">Nombre de sucursal requerido</span>' );
						$( "#sucursal" ).focus();
					}
					*/
					return false;
					var confirmar = confirm("¿Desea guardar?");
					
					if (confirmar) {
						$('#frmAddModal').modal('hide');
					}
				}
			}, "#btnModalAceptar");
			
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
			$("#tablaPagosCheques input[type=checkbox]").each(function(e){
				//console.log( $(this).attr("checked") );
				if( $(this).attr("name") != "checkAll" ){
					if( $(this).is(':checked') ) {
						//cada elemento seleccionado
						seleccionados += 1;
						cadena = $(this).attr('name');
						cadenaArray = cadena.split("-");
						//console.log(cadenaArray);
						importe += parseFloat( $("#importe-" + cadenaArray[1] ).html() );
					}
				}
			});
			
			$("#anticipoSeleccionados").html(seleccionados);
			$("#importeADepositar").html( parseFloat(importe).toFixed(2) );
		}
};
function checkBox(e)
{
   e = e||event;/* get IE event ( not passed ) */
   e.stopPropagation? e.stopPropagation() : e.cancelBubble = true;
   //Selecciona y deselecciona todos los checks
   $("#tablaPagosCheques input[type=checkbox]").each(function(e){
	   $(this).attr( "checked", $("#checkAll").is(':checked') );
	});
   console.log("Hol aqui ando");
   PagosCheques.contarSeleccionados();
}
PagosCheques.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/