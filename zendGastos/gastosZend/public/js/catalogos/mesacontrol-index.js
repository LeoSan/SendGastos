var MesacontrolIndex = {
		init : function() {
			//alert("Hola como estas?");
			//var baseUrl = '/cuentas/public';
			
			$(".grid-title").html("Catálogo de etapas");
			
			$(".deleteEtapa").click(function(e){
				e.preventDefault();
				
				var respuesta = confirm("¿Estás seguro que deseas eliminar esta etapa?");
				var id_etapa = $(this).attr('id-rel');
				
				if( $.trim(id_etapa) == "" ){
					alert("No se puede eliminar, no ha seleccionado el Id de la etapa.");
					return false;
				}
				
				if(respuesta){
					$.ajax({
						  url: baseUrl + '/catalogos/mesacontrol/deletapa',
						  type: 'POST',
						  data: {num_etapa: id_etapa},
						  dataType: 'json',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  console.log(data);
							  if(data.success == false){
								  alert(data.msg);
								  return false;
							  }
							  
							  alert(data.msg);
							  Menu.loadModuleMenu('catalogos', 'mesacontrol', 'index', '#');
							  return false;
							} 
					});
				}
			});
			
			$("#status-activo").click(function(e){
				$('#status').val("A");
			});
			
			$("#status-inactivo").click(function(e){
				$('#status').val("I");
			});
			
			$("#btnModalAceptar").click(function(e){
				e.preventDefault();
				
				if( $.trim( $('#numero_etapa').val() ) == "" ){
					alert("Debe de ingresar un número de etapa para continuar.");
					$('#numero_etapa').focus();
					return false;
				}
				
				$("#frmEtapa").submit();
				return false;
			});
			
			$('#frmAddModal').on('hidden', function () {
				MesacontrolIndex.resetearCampos();
			});
			/*
			$('#frmAddModal').on('show', function () {
				$('#lblFormModalSuc').html("Agregar sucursal");
			});
			*/
			// validate signup form on keyup and submit
		    $("#frmEtapa").validate({
				rules: {
					numero_etapa: "required"
				},
				messages: {
					//categoria: "Ingrese el nombre de la categoria"
				},
				submitHandler: function(form) {
					var userid = $('#noEmpleado').html();
					var num_etapa = $('#numero_etapa').val();
					$.ajax({
						  url: baseUrl + '/catalogos/mesacontrol/setetapa',
						  type: 'POST',
						  data: {num_etapa:num_etapa, userid:userid},
						  dataType: 'json',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  console.log(data);
							  
							  if(data.success == false){
								  alert(data.msg);
								  $("#numero_etapa").focus();
								  return false;
							  }
							  
							  alert(data.msg);
							  
							  $('#frmAddModal').modal('hide');
							  Menu.loadModuleMenu('catalogos', 'mesacontrol', 'index', '#');
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

MesacontrolIndex.init();