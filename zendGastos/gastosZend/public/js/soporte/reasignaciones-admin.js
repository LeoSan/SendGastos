var SoportesReasignaciones = {
	bnd : false,
	init : function() {
		$(".grid-title").html("Reasignaciones");

		$("#idFolioSearchAdmin").keypress(function (e) {
			if (e.which == 13) {
				e.preventDefault();
				SoportesReasignaciones.searchData();
			}
		});

		//funcion para buscar usuarios
		//var url = baseUrl + '/catalogos/miexpediente/getusers';
		var url = baseUrl + '/planesdeviaje/consulta/get-user-quantum/';
		$("#idUserSearchAdmin").focus();

		$.ajax({
			url: url,
			type: 'POST',
			data: '',
			dataType: 'html',
			success: function(data) {
				data = jQuery.parseJSON(data);
				globaldata = data;
				globalArrIndex = [];
				arrdata = [];
				counter = 0;
				$.each(data, function( index, value ) {
					if(value.NOMBRE != null && value.NOMBRE != ''){
						arrdata[counter] = value.NOMBRE;
						globalArrIndex[value.NOMBRE] = value.IDU;
						counter ++;
					}
				});

				var typeahead = $('#idUserSearchAdmin').data('typeahead');
				if (typeahead) {
					typeahead.source = arrdata;
				} else {
					$('#idUserSearchAdmin').typeahead({
						source: arrdata,
						minLength: 2,
						updater: function(item){
							$("#mailsearch").val( globalArrIndex[item] );
							return item;
						}
					});
				}
			}
		}); // fin en buscar usuario

		$("#btnSearchAdmin").click(function(e){
			e.preventDefault();
			SoportesReasignaciones.searchData();
		});

		$( "#finicio" ).datepicker({"dateFormat": "dd-mm-yy"});
		$( "#ffin" ).datepicker({"dateFormat": "dd-mm-yy"});

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
		$(".reasignarFecha").off().on("click", function(e){
			e.preventDefault();
			SoportesReasignaciones.showModalFecha( this );
		});
		$("#btnGuardarReasignacion").off().on("click", function(e){
			e.preventDefault();
			SoportesReasignaciones.updateReasignacionModal( this );
		});
		$("#btnGuardarReasignacionFecha").off().on("click", function(e){
			e.preventDefault();
			SoportesReasignaciones.updateReasignacionFechaModal( this );
		});
		$(".btnSelect").off('click').on("click", function(e){
			e.preventDefault();
			$("#tablaDepositoAnticipos input").prop('checked', true);
		});
		$(".btnUnselect").off('click').on("click", function(e){
			$("#tablaDepositoAnticipos input").prop('checked', false);
		});

		$('#newuser').typeahead({
			items: 15,
			source: function (query, process) {
				states = [];
				map = {};
				$('#newuser').attr("autocomplete", 'off');
				// var url = baseUrl + '/planesdeviaje/consulta/get-user-quantum/';  //04/09/2017
				var url = baseUrl + '/planesdeviaje/consulta/get-user-quantum-v2/';

				$.ajax({
					type: "POST",
					url: url,
					data: { cadena: query, puesto: query },
					dataType: 'json',
					success: function(data) {
						states = [];
						map = {};
						if(data.respuesta == "fail"){
							return false;
						}
						$.each(data, function (i, state) {
							if(state.NOMBRE) {
								map[state.NOMBRE] = state;
								states.push(state.NOMBRE);
							}
						});
						process(states);
					}
				});
			},
			updater: function (item) {
				selectedState = map[item].IDU;
				$("#mailhidden").val(selectedState);
				return item;
			}
		});

	},

	// Busca el Usuario
	searchData : function() {

		if(validateElement.isValid($("#idFolioSearchAdmin"), $("#frmBuscarGasto"), 432 ) == false){
			//e.preventDefault();
			return false;
		}

		if( $.trim( $("#idFolioSearchAdmin").val() ) == "" && $.trim( $("#idUserSearchAdmin").val() ) == "" ){
			alert("Ingrese el USUARIO o NÚMERO DE CASO a buscar");
			$("#idUserSearchAdmin").focus();
			return false;
		}

		$("#resultadoListaGastos").html( "" );
		Layout.showLoading();

		$.ajax({
			type: "POST",
			dataType: 'html',
			url: baseUrl + '/soporte/reasignaciones/searchadmin',
			data: {
				user  : $.trim( $("#idUserSearchAdmin").val() ),
				prouid: $("#PROid").attr("data-pro"),
				folio : $.trim( $("#idFolioSearchAdmin").val() ),
				idUser: $("#noEmpleado").html(),
				email  : $.trim( $("#mailsearch").val() )
			},
			success: function (data) {
				Layout.hideLoading();
				$("#resultadoListaGastos").html( data );
			},
			error: function (jqXHR, exception) {
				console.log("Error al realizar la busqueda: " + jqXHR.status + ' ' + exception);
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

	updateAsignaciones : function(data) {
		var userid = $("#noEmpleado").html();
		Layout.showLoading();
		$.ajax({
			type: "POST",
			dataType: 'html',
			url: baseUrl + '/soporte/reasignaciones/updateReasignados',
			data: {
				data: 	$.trim( data ),
				userid: userid
			},
			success: function (data) {
				Layout.hideLoading();
			}
		});
	},

	showModalDetalle : function( ithis ) {

		var userid = $("#noEmpleado").html();
		var url = '';
		var prouid = $.trim( $(ithis).attr("pro-uid") );
		$("#myModal #myModalLabel").html("Reasignación #" + $(ithis).attr("app-number"));

		if ( prouid == '110976071525c607ac73538012256307' ) {
			url = baseUrl + '/soporte/reasignaciones/getdetallegasto';
		} else if( prouid == '62298808750576cfc307717079255213' ) {
			url = baseUrl + '/soporte/reasignaciones/getdetalleviaje';
		}

		Layout.showLoading();
		$.ajax({
			type: "POST",
			dataType: 'html',
			url: url,
			data: {
				apnumber: $.trim( $(ithis).attr("app-number") ),
				tasnumber: $.trim( $(ithis).attr("tas-uid") ),
				pronumber: $.trim( $(ithis).attr("pro-uid") ),
				dataindex: $.trim( $(ithis).attr("data-index") ),
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
				apnumber: $.trim( $(ithis).attr("app-number") ),
				tasnumber: $.trim( $(ithis).attr("tas-uid") ),
				userid: userid,
				json: true
			},
			success: function (data) {
				Layout.hideLoading();
				//data = jQuery.parseJSON(data);
				$("#frmReasignacionUpdate #responsable").val(data.NOMBRE);
				$("#frmReasignacionUpdate #responsablename").val(data.NOMBRE);
				$("#frmReasignacionUpdate #appuid").val(data.APP_UID);
				$("#frmReasignacionUpdate #tasuid").val(data.TAS_UID);
				$("#frmReasignacionUpdate #delIndex").val(data.DEL_INDEX);
				$("#frmReasignacionUpdate #CorreoOld").val(data.USR_EMAIL);
				$('#frmReasignacionUpdate').modal('show');

				$(".inputSeleccionado").html( $("#frmReasignaFolio select").html() );
				//$("#myModal .modal-body").html(data);

			}
		});
	},

	showModalFecha : function( ithis ) {

		var userid = $("#noEmpleado").html();
		var appnumber = $(ithis).attr("app-number");
		var appuid = $(ithis).attr("appuid");

		$("#frmFechaUpdate #frmFechaLabel").html("Cambiar Fecha a solicitud #" + $(ithis).parent().find("a").attr("app-number"));

		Layout.showLoading();
		$.ajax({
			type: "POST",
			dataType: 'json',
			url: baseUrl + '/soporte/reasignaciones/getdetalleviaje',
			data: {
				apnumber: $.trim( $(ithis).attr("app-number") ),
				tasnumber: $.trim( $(ithis).attr("tas-uid") ),
				userid: userid,
				json: true
			},
			success: function (data) {
				Layout.hideLoading();
				//data = jQuery.parseJSON(data);
				console.log(data);
				$("#frmFechaUpdate #responsable").val(data.SOLICITANTE);
				$("#frmFechaUpdate #finicio").val(data.FDFECINI);
				$("#frmFechaUpdate #ffin").val(data.FDFECFIN);
				$("#frmFechaUpdate #finicioOLD").val(data.FDFECINI);
				$("#frmFechaUpdate #ffinOLD").val(data.FDFECFIN);
				$("#frmFechaUpdate #tasuid").val(data.TAS_UID);
				$("#frmFechaUpdate #appnumber").val(appnumber);
				$("#frmFechaUpdate #appuid_date").val(appuid);

				$('#frmFechaUpdate').modal('show');

				$(".inputSeleccionado").html( $("#frmReasignaFolio select").html() );
				//$("#myModal .modal-body").html(data);

			}
		});
	},

	updateReasignacionModal : function(ithis){

		var stringCaso =  $("#frmReasignacionLabel").html();
		stringCaso =  stringCaso.split("#");
		var caso = stringCaso[1];

		if( $("#mailhidden").val() == ""  ) {
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
				BitCasoID:caso,
				BitCorreoOld:$("#CorreoOld").val(),
				BitCorreoNew:$("#mailhidden").val(),
				Bitappuid: $("#appuid").val(),
				BitIdTask: $("#tasuid").val(),
				BitProUID: $("#prouid").val(),
				BitDelIndex: $("#delIndex").val(),
				userid: userid,
				newuser: $("#mailhidden").val(),
				usruidOld: $("#usruid").val(),
				data: $("#frmReasignacionUpdate .form-horizontal").serialize()
			},
			success: function (data) {
				Layout.hideLoading();
				$("#btnSearchAdmin").trigger("click");
				$('#frmReasignacionUpdate').modal('hide');
			}

		});

	},

	updateReasignacionFechaModal : function(ithis){

		var flag = true;


		// return false;
		if( $("#finicio").val() === "") {
			$("#span-message-error-0").fadeIn('slow').delay(3000).fadeOut('slow');
			flag = false;
		}
		if( $("#ffin").val() === "") {
			$("#span-message-error-1").fadeIn('slow').delay(3000).fadeOut('slow');
			flag = false;
		}
		if( $("#motivo").val() === "") {
			$("#span-message-error-2").fadeIn('slow').delay(3000).fadeOut('slow');
			flag = false;
		}

		valuesStart = $("#finicio").val().split("-");
		valuesEnd = $("#ffin").val().split("-");
		// Verificamos que la fecha no sea posterior a la actual
		var dateStart = new Date(valuesStart[2], (valuesStart[1] - 1), valuesStart[0]);
		var dateEnd = new Date(valuesEnd[2], (valuesEnd[1] - 1), valuesEnd[0]);

		if (dateStart > dateEnd) {
			$("#span-message-error-3").fadeIn('slow').delay(4000).fadeOut('slow');
			flag = false;
		}

		// var validateDate=SoportesReasignaciones.validate_fechaMayorQue($("#finicio").val(),$("#ffin").val())
		// console.log('-->'+ validateDate);

		/*if(!SoportesReasignaciones.validate_fechaMayorQue($("#finicio").val(),$("#ffin").val())){
		 $("#span-message-error-3").fadeIn('slow').delay(4000).fadeOut('slow');
		 flag = false;
		 }*/

		if(!flag){
			return flag;
		}

		Layout.showLoading();
		var userid = $("#userid").html();
		var appuid = $("#appuid_date").val();

		$.ajax({
			type: "POST",
			dataType: 'html',
			url: baseUrl + '/soporte/reasignaciones/updatereasignacionfecha',
			data: {
				userid: userid,
				FDFECINI: $("#finicio").val(),
				FDFECINIOLD: $("#finicioOLD").val(),
				FDFECFIN: $("#ffin").val(),
				FDFECFINOLD: $("#ffinOLD").val(),
				IDGASTO: $("#appnumber").val(),
				USR_UID: userid,
				APP_UID: appuid,
				NOTE_CONTENT: $("#motivo").val(),
				data: $("#frmFechaUpdate .form-horizontal").serialize()
			},
			success: function (data) {
				Layout.hideLoading();
				$("#btnSearchAdmin").trigger("click");
				$('#frmFechaUpdate').modal('hide');
				$("#motivo").val("")
			}

		});

	},

	findUserAdmin : function(ithis){

		$("#frmReasignacionUpdate .loading").show();
		$(".newuserdrop").html('<option>Buscando...</option>');

		$.ajax({
			type: "POST",
			dataType: 'json',
			url: baseUrl + '/soporte/reasignaciones/finduseradmin',
			data: {
				user: $("#newuser").val()
			},
			success: function (data) {

				var html='';
				$("#frmReasignacionUpdate .loading").hide();
				$.each(data, function(i, items){
					if ( items[1] == "null") {
						items[1] = "";
					}
					html+='<option value="'+items['USR_EMAIL']+'">'+items['NUM']+" "+items['USR_FIRSTNAME']+'</option>';
				});

				$(".newuserdrop").html(html);

			}
		});

	},
};

SoportesReasignaciones.init();