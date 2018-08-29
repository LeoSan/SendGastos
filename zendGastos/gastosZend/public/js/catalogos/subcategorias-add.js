var SubcategoriasAdd = {
		init : function() {
			//alert("Hola como estas?");
			//var baseUrl = '/cuentas/public';
			
			$(".grid-title").html("Agregar Subcategoria");

			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					Menu.loadModuleMenu('catalogos', 'subcategorias', 'index', '#');
					return false;
				}
			}, "#btnCancelar");
			// validate signup form on keyup and submit
			
			$("#btnAddSubcategoria").click(function(e){
				e.preventDefault();
				$("#frmAddSubcategoria").submit();
			});
			
			$("#subcategoria___").blur(function(){
				if( $.trim( $(this).val() ) == "" ){
					return true;
				}
					
				var valida = SubcategoriasAdd.comprobarCurp( $(this).val() );
				if(!valida){
					alert("Curp incorrecto");
					$(this).focus();
				}
				console.log(valida);
			});
			
			
			$("#frmAddSubcategoria").validate({
				rules: {
					idCategoria : "required",
					subcategoria: "required"
				},
				messages: {
					idCategoria : "Seleccione una categoria",
					subcategoria: "Ingrese el nombre de la subcategoria"
				},
				submitHandler: function(form) {
				    //alert("Todo esta validado: " + $("#frmAddSubcategoria").serialize()); return false;
				    var userid = $('#userid').html();
					$.ajax({
						  url: baseUrl + '/catalogos/subcategorias/setsubcategoria',
						  type: 'POST',
						  data: $("#frmAddSubcategoria").serialize(),
						  dataType: 'json',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  console.log(data);
							  if (data.success == '0'){
								//return false;
								  //$('#frmAddModal').modal('hide');
								  
								  Menu.loadModuleMenu('catalogos', 'subcategorias', 'index', '#');
								  return false;
							  } else{
								  alert("Ocurrio un error: " + data.success);
								  return false;
							  }
							  
							} 
					});
					//form.submit();
				}
			});
			
		},// End Init() 
		resetearCampos : function() {
			$("#idCategoria").val("");
			$("#idSubcategoria").val("0");
			$("#subcategoria").val("");
			$("#divStatus").hide();
			$("#status").val("A");
			$('#lblFormModalSuc').html("Agregar sucursal");
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
		},
		ChangeFilter : function() {
			var userid = 'admin';
			$.ajax({
				  url: baseUrl + '/catalogos/subcategorias/index/',
				  type: 'POST',
				  data: {idcategoria: $("#selIdCategoria").val(), status: $("#selStatus").val(), userid: userid},
				  dataType: 'html',
				  complete: function() {
						//Modal.close();
				  },
				  success: function(data) {
					  	//$('ul#sidebar-main-menu li a').removeClass('current');
					  	//$('ul#sidebar-main-menu li#sidebar-' + controller + ' a').addClass('current');
						$('#catalogo-content').html(data);

						//Gestion.resizeElements();
					} 
			});
		}, comprobarCurp: function(txt){
			if ( ! txt.match(/[a-zA-Z]{4,4}[0-9]{6}[a-zA-Z]{6,6}[0-9]{2}/) ) 
			{ 
				return false;
			} else {
				return true;
			}
		}
};

SubcategoriasAdd.init();
/*
$(document).ready(function() {
	Archivo.init();
});
*/