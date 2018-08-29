var CategoriasAdd = {
		init : function() {
			$(".grid-title").html("Agregar Categorias");
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					Menu.loadModuleMenu('catalogos', 'categorias', 'index', '#');
					return false;
				}
			}, "#btnCancelar");

			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					$('#status').val("A");
				}
			}, "#status-activo");
			
			$( document ).on({
				click : function( e ) {
					//e.preventDefault();
					$('#status').val("I");
				}
			}, "#status-inactivo");
			
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
			
			$('#frmAddModal').on('hidden', function () {
				CategoriasAdd.resetearCampos();
			});
			/*
			$('#frmAddModal').on('show', function () {
				$('#lblFormModalSuc').html("Agregar sucursal");
			});
			*/
			// validate signup form on keyup and submit
			$("#frmAddCategoria").validate({
				rules: {
					categoria: "required"
				},
				messages: {
					categoria: "Ingrese el nombre de la categoria"
				},
				submitHandler: function(form) {
				    //alert("Todo esta validado: " + $("#frmAddCategoria").serialize()); return false;
				    var userid = $('#userid').html();
					$.ajax({
						  url: baseUrl + '/catalogos/categorias/setcategoria',
						  type: 'POST',
						  data: $("#frmAddCategoria").serialize(),
						  dataType: 'json',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  console.log(data);
							  //return false;
							  //$('#frmAddModal').modal('hide');
							  
							  Menu.loadModuleMenu('catalogos', 'categorias', 'index', '#');
							  return false;
							} 
					});
					//form.submit();
				}
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
		}
};

CategoriasAdd.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/