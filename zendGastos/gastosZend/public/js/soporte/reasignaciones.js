var SoportesReasignaciones = {
		init : function() {
			$(".grid-title").html("Reasignaciones");
			
			$("#idfoliobuscar").keypress(function (e) {
				if (e.which == 13) {
					e.preventDefault();
					SoportesReasignaciones.searchData();
				}
			});
			$("#iduserbuscar").keypress(function (e) {
				if (e.which == 13) {
					e.preventDefault();
					SoportesReasignaciones.searchData();
				}
			});
			$("#btnBuscarGasto").click(function(e){
				e.preventDefault();
				SoportesReasignaciones.searchData();
			});

			SoportesReasignaciones.getDataUser();
			
		},// End Init()
		
		initTabla : function() {
			$("#btnAsignarFolio").off().on("click", function(e){
				e.preventDefault();
				SoportesReasignaciones.asignaFolio();
			});
			$("a.getdetalle").off().on("click", function(e){
				e.preventDefault();
				SoportesReasignaciones.showModalDetalle( this );
			});
			$(".reasignar").off().on("click", function(e){
				e.preventDefault();
				SoportesReasignaciones.showModalReasignacion( this );
			});
			$("#btnGuardarReasignacion").off().on("click", function(e){
				e.preventDefault();
				SoportesReasignaciones.updateReasignacionModal( this );
			});
			$(".btnSelect").off('click').on("click", function(e){
				e.preventDefault();
				$("#tablaDepositoAnticipos input").prop('checked', true);
			});
			$(".btnUnselect").off('click').on("click", function(e){
				$("#tablaDepositoAnticipos input").prop('checked', false);
			});
		},

		// Busca el Usuario
		searchData : function() {
			
			$("#resultadoListaGastos").html( "" );
			Layout.showLoading();
			
			$.ajax({
		        type: "POST",
		        dataType: 'html',
		        url: baseUrl + '/soporte/reasignaciones/search',
		        data: {
		        	user: 	$.trim( $("#frmBuscarGasto select").val() ),
		        	folio: 	$.trim( $("#idfoliobuscar").val() ),
		        	prouid: $("#PROid").attr("data-pro"),
		        	idUser: $("#noEmpleado").html()
				},
		        success: function (data) {
		        	Layout.hideLoading();
		        	$("#resultadoListaGastos").html( data );
		        }
		    });
			
			
		}, // End findFolio

		asignaFolio : function() {
			var data = $("form#frmSelFolios").serialize();
			if (data == "") {
				alert("No ha seleccionado ningun Registro");
				return false;
			}
			var folios = data.split('&'),
				cadFolios = '', cadFoliosTemp, appuid='', apptas='';

			$.each( folios, function(i, items){
				cadFoliosTemp = items.split('-')[0];
				appuid += items.split('-')[1] + '_';
				apptas += items.split('-')[2] + '_';
				cadFolios += cadFoliosTemp.split('=')[1] + ', ';
			});

			cadFolios = cadFolios.substring(0, cadFolios.length-2 );
			appuid = appuid.substring(0, appuid.length-1 );
			apptas = apptas.substring(0, apptas.length-1 );
			
			$("#frmReasignacionUpdate #frmReasignacionLabel").html("Reasignar solicitud #" + cadFolios );
			$('#frmReasignacionUpdate').modal('show');

			$("#frmReasignacionUpdate #responsable").hide();

			$("#frmReasignacionUpdate #appuid").val( appuid );
		    $("#frmReasignacionUpdate #tasuid").val( apptas );
		    $('#frmReasignacionUpdate').modal('show');

		    $(".inputSeleccionado").html( $("#frmReasignaFolio select").html() );
			
		},

		showModalDetalle : function( ithis ) {

			var userid = $("#noEmpleado").html();
		  	  
			$("#myModal #myModalLabel").html("Reasignación #" + $(ithis).attr("app-number"));

			Layout.showLoading();
			$.ajax({
		        type: "POST",
		        dataType: 'html',
		        url: baseUrl + '/soporte/reasignaciones/getdetalle',
		        data: {
		        	apnumber: $.trim( $(ithis).attr("app-number") ),
		        	tasnumber: $.trim( $(ithis).attr("tas-uid") ),
		        	userid: userid,
		        	json: false
				},
		        success: function (data) {
		        	Layout.hideLoading();

		        	$("#myModal .modal-body").html(data);
		        	$('#myModal').modal('show');

		        }
		    });
		        
		    
		},

		showModalReasignacion : function( ithis ) {

			var userid = $("#noEmpleado").html();
		  	  
			$("#frmReasignacionUpdate #frmReasignacionLabel").html("Reasignar solicitud #" + $(ithis).parent().find("a").attr("app-number"));

			Layout.showLoading();
			$.ajax({
		        type: "POST",
		        dataType: 'json',
		        url: baseUrl + '/soporte/reasignaciones/getdetalle',
		        data: {
		        	apnumber: $.trim( $(ithis).parent().find("a").attr("app-number") ),
		        	tasnumber: $.trim( $(ithis).attr("tas-uid") ),
		        	userid: userid,
		        	json: true
				},
		        success: function (data) {
		        	Layout.hideLoading();
		        	$("#frmReasignacionUpdate #responsable").val(data.NOMBRE);
		        	$("#frmReasignacionUpdate #appuid").val(data.APP_UID);
		        	$("#frmReasignacionUpdate #tasuid").val(data.TAS_UID);
		        	$('#frmReasignacionUpdate').modal('show');

		        	$(".inputSeleccionado").html( $("#frmReasignaFolio select").html() );

		        }
		    });
		},

		updateReasignacionModal : function(ithis){
			
			if( $(".inputSeleccionado").val() == "false"  ) {
				alert("Seleccione un usuario");
				return false;
			}
			if( $("#comentarios").val() === "") {
				alert("El campo COMENTARIOS es Obligatorio");
				return false;
			}
			Layout.showLoading();
			var userid = $("#noEmpleado").html();

			$.ajax({
		        type: "POST",
		        dataType: 'html',
		        url: baseUrl + '/soporte/reasignaciones/updatereasignacion',
		        data: {
		        	userid: userid,
		        	newuser: $(".inputSeleccionado").val(),
		        	tasuid: $.trim( $(ithis).attr("tas-uid") ),
		        	data: $("#frmReasignacionUpdate .form-horizontal").serialize()
				},
		        success: function (data) {
		        	Layout.hideLoading();
		        	$("#btnBuscarGasto").trigger("click");
					$('#frmReasignacionUpdate').modal('hide');
		        }
		    });

		},

		getDataUser : function() {
			var userid = $("#noEmpleado").html();

			$.ajax({
		        type: "POST",
		        dataType: 'json',
		        url: baseUrl + '/soporte/reasignaciones/getdatauser',
		        data: {
		        	userid: userid
				},
		        success: function (data) {
		        	var html = '<option value=0>Seleccione un Empleado</option>';

		        	$.each( data, function(i, items){
		        		html += '<option value="'+items.NUMEMPLEADO+'">'+items.NUMEMPLEADO+' '+items.NOMBRE+'</option>';
		        	});

		        	$("#frmBuscarGasto select").html(html);

		        }
		    });

		}
};

SoportesReasignaciones.init();