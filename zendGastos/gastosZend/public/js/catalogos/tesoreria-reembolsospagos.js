var TesoreriaDepositoanticipos = {
		init : function() {
			$(".grid-title").html("Reembolsos / Pagos transferencia electrónica");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					alert("Diste click en Tipo de Cheque");
					return false;
				}
			}, "#tipoCheque");
			
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
			
			$("#btnGuardar").click(function(e){
				var idsPuestos = '';
				var appUid = '';
				var tasUid = '';
				var delIndex = '';
				var cuentas = '';
				console.log("Inicio de guardado");
				$("#tablaDepositoAnticipos input[type=checkbox]").each(function(e){
					if( $(this).attr('id') != 'checkAll' ){
						var checado = $("#checkAll").is(':checked');
						
						if( $(this).is(':checked') == true ){
							idsPuestos += $(this).attr( "gastoid" ) + '|';
							appUid += $(this).attr( "appuid" ) + '|';
							tasUid += $(this).attr( "tasuid" ) + '|';
							delIndex += $(this).attr( "delindex" ) + '|';
							cuentas += $("#cuenta-" + $(this).attr( "gastoid" )).val() + '|';
						}
					}
				});
				
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
			$("#tablaDepositoAnticipos input[type=checkbox]").each(function(e){
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