var SoportesComprobantes = {
		init : function() {
			$(".grid-title").html("Duplicar comprobantes");
			
			$("#idFolioSearchAdmin").keypress(function (e) {
				if (e.which == 13) {
					e.preventDefault();
					SoportesComprobantes.searchData();
				}
			});
			$("#idUserSearchAdmin").keypress(function (e) {
				if (e.which == 13) {
					e.preventDefault();
					SoportesComprobantes.searchData();
				}
			});
			$("#btnSearchAdmin").click(function(e){
				e.preventDefault();
				SoportesComprobantes.searchData();
			});

			
			
		},// End Init()
		
		initTabla : function() {
			$("#btnAsignarFolio").off().on("click", function(e){
				e.preventDefault();
				SoportesComprobantes.asignaFolio();
			});
			$("a.getdetalle").off().on("click", function(e){
				e.preventDefault();
				SoportesComprobantes.showModalDetalle( this );
			});
			$(".ajustar").off().on("click", function(e){
				e.preventDefault();
				SoportesComprobantes.showModalReasignacion( this );
			});
			$(".reasignar").off().on("click", function(e){
				e.preventDefault();
				SoportesComprobantes.duplicarGastoConcepto( this );
			});
			$("#btnGuardarReasignacion").off().on("click", function(e){
				e.preventDefault();
				SoportesComprobantes.updateReasignacionModal( this );
			});
			/*$("#newuser").off('keypress').on("keypress", function(e){
				if (e.which == 13 ) {
					e.preventDefault();
				}
				SoportesComprobantes.findUserAdmin();
			});*/
			$(".btnSelect").off('click').on("click", function(e){
				e.preventDefault();
				$("#tablaDepositoAnticipos input").prop('checked', true);
			});
			$(".btnUnselect").off('click').on("click", function(e){
				$("#tablaDepositoAnticipos input").prop('checked', false);
			});
			/*
			$('#newuser').typeahead({
				items: 15,
				source: function (query, process) {
					states = [];
				    map = {};

				    var url = baseUrl + '/soporte/reasignaciones/getniveles';
				    
				    $.ajax({
						type: "POST",
						url: url,
						data: { empleado: query, puesto: query },
						dataType: 'json',
						success: function(data) {
							$.each(data.empleados, function (i, state) {
								map[state.NOMBRE] = state;
						        states.push(state.NOMBRE);
						    });
							process(states);
						}
					});
				},
				updater: function (item) {
					console.log(map[item]);
					console.log(map[item].UID);
					selectedState = map[item].UID;
				    $("#mailhidden").val(selectedState);
				    return item;
				}
			});
			*/
		},

		// Busca el Usuario
		searchData : function() {
			
                        if(validateElement.isValid($("#idFolioSearchAdmin"),$("#frmBuscarGasto"),121 ) == false) {
                            return false;
                        }
//                        
//                                                if(validateElement.isValid($("#idFolioSearchAdmin"), $("#frmBuscarGasto"), 432 ) == false){
//                                //e.preventDefault();
//                                return false;
//                        }
                        
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
		        url: baseUrl + '/soporte/comprobaciones/searchadmin',
		        data: {
		        	user: 	$.trim( $("#idUserSearchAdmin").val() ),
		        	prouid: $("#PROid").attr("data-pro"),
		        	folio: 	$.trim( $("#idFolioSearchAdmin").val() ),
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
                        console.log(folios);

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
			$('#myModal').modal('show');
			/*
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
		    */    
		    
		},
		duplicarGastoConcepto : function( ithis ) {
			var gastoId = $.trim( $(ithis).attr("gasto") );
			var concepto = $.trim( $(ithis).attr("concepto") );
			var credito = $.trim( $(ithis).attr("credito") );
			var registros = $.trim( $(ithis).attr("registros") );
			
			Layout.showLoading();
			$.ajax({
		        type: "POST",
		        dataType: 'json',
		        url: baseUrl + '/soporte/comprobaciones/setvarioscomprobantes',
		        data: {
		        	gasto: gastoId,
		        	concepto: gastoId,
		        	credito: gastoId,
		        	registros: gastoId
				},
		        success: function (data) {
		        	console.log(data);
		        	Layout.hideLoading();
		        	alert('Cambios realizados');
		        }
		    });
		},
		showModalReasignacion : function( ithis ) {

			var userid = $("#noEmpleado").html();
		  	  
			$("#frmReasignacionUpdate #frmReasignacionLabel").html("Ajustar solicitud #" + $(ithis).attr("gasto"));
			
			
			$("#frmReasignacionUpdate #conceptoid").val( $(ithis).attr('concepto') );
			$("#frmReasignacionUpdate #credito").val( $(ithis).attr('credito') );
			$("#frmReasignacionUpdate #concepto").val( $(ithis).attr('nmconcepto') );
			$("#frmReasignacionUpdate #idGasto").val( $(ithis).attr('gasto') );
			
			//Layout.showLoading();
			$('#frmReasignacionUpdate').modal('show');
			/*
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
					//data = jQuery.parseJSON(data);
		        	$("#frmReasignacionUpdate #responsable").val(data.NOMBRE);
		        	$("#frmReasignacionUpdate #responsablename").val(data.NOMBRE);
		        	$("#frmReasignacionUpdate #appuid").val(data.APP_UID);
		        	$("#frmReasignacionUpdate #tasuid").val(data.TAS_UID);

		        	$('#frmReasignacionUpdate').modal('show');

		        	$(".inputSeleccionado").html( $("#frmReasignaFolio select").html() );
		       		//$("#myModal .modal-body").html(data);
		        	
		        }
		    });
		    */
		},

		updateReasignacionModal : function(ithis){
			if( $("#noregistros").val() === "" || $("#noregistros").val() === "0" ) {
				alert("El campo COMENTARIOS es Obligatorio");
				return false;
			}

			Layout.showLoading();
			var userid = $("#noEmpleado").html();
			
			var conceptoid = $("#frmReasignacionUpdate #conceptoid").val();
			var credito  = $("#frmReasignacionUpdate #credito").val();
			var idGasto = $("#frmReasignacionUpdate #idGasto").val();
			var noregistros = $("#frmReasignacionUpdate #noregistros").val();
			$.ajax({
		        type: "POST",
		        dataType: 'html',
		        url: baseUrl + '/soporte/comprobaciones/setvarioscomprobantes',
		        data: {
		        	idGasto: idGasto,
		        	conceptoid: conceptoid,
		        	credito: credito,
		        	noregistros:noregistros,
		        	data: $("#frmReasignacionUpdate .form-horizontal").serialize()
				},
		        success: function (data) {
		        	console.log(data); //return false;
		        	Layout.hideLoading();
		        	$("#btnSearchAdmin").trigger("click");
					$('#frmReasignacionUpdate').modal('hide');
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

		}
};

SoportesComprobantes.init();