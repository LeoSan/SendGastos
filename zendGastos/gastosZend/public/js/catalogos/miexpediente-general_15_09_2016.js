var MiexpedienteIndex2 = {
	init : function() {
                
        $("#modalMensaje").css("display", "none");
        $("#bodyGastoList").css("height", "250px");
        
      MiexpedienteIndex2.renderGrid();

	var url = baseUrl + '/catalogos/miexpediente/getallusers';
	$("#usName").focus();

	$.ajax({
		  url: url,
		  type: 'POST',
		  data: '',
		  dataType: 'html',
		  complete: function() {
			  console.log('COMPLETE');
		  },
		  success: function(data) {
			  
//			  $('#loadingAsign').css('display','block');
			  
			  data = $.parseJSON(data);
			  
			  //console.log(data);
			  globaldata = data;
			  globalArrIndex = [];
			  arrdata = [];
			  counter = 0;
			  
			  $.each(data, function( index, value ) {
//				  console.log( index + ": " + value.NOMBRE );
				  if(value.NOMBRE != null && value.NOMBRE != ''){
					  arrdata[counter] = value.NOMBRE;
					  globalArrIndex[counter] = value.IDU;
					  counter ++;
				  }
				  
			  });
			  
			  var typeahead = $('#usName').data('typeahead');
			  if (typeahead) typeahead.source = arrdata;
			  else $('#usName').typeahead({	source: arrdata,minLength: 1});
			  
			  
			  console.log('SUCCESS');
		  }
	});
        
        $("#btnBuscarConsultaGralByParameters").click(function(e){
	//e.preventDefault();

	var gasto = $("#numGasto").val();
	var user = $("#usName").val();
	var credito = $("#numCredit").val();
	if(gasto == "" && user == "" && credito == ""){
		$('#modalMensaje').find('.modal-body').html("Debe Seleccionar al Menos un Campo");
		$('#modalMensaje').modal('show');
	}else{
            //alert("click en ver consulta");
		MiexpedienteIndex2.gridReload();
		        $("#modalGasto").css("width","950px");
				
				$("#modalGasto").css("left","40%");
				
				$('#modalGasto').modal('show');                       
            
	}
	
	
	
});

				$(".getReport").unbind( "click" );
				
				$(document).on({
                                    click: function(e){
                                        e.preventDefault();
                                        
                                       //var elem =  $('#idCosto').val( $(this).attr("id-rel"));
                                       var elem = $(this).attr("id-rel")
                                //var elem = $('#idGastomain').val();
					//console.log($("#"+elem));
                                        
                                        //alert(elem);
					//console.log(elem);
                                        

					$('#modalGasto').modal('hide');
					
					//Buscamos...}
					$("#resultadoConsultaGeneral").html("Buscando...");

					var gastoid = elem;
					var etapa = "ETAP1";
					var appid = '';
					var delindex = '';
					var userid = $("#userid").html();
					
					Layout.showLoading();
					$.ajax({
				        type: "POST",
				        dataType: 'html',
				        url: baseUrl + '/catalogos/miexpediente/getdetalle',
				        data: {
				        	gastoid: 	gastoid,
				        	etapa: 		etapa,
				        	appid: 		appid,
				        	delindex:	delindex,
							userid: 	userid
						},
				        success: function (data) {
					        Layout.hideLoading();
				        	$("#resultadoConsultaGeneral").html(data);
				        	
				        	return false;
				        }
				    });  
                                    }
                                },".getReport");

$(".grid-title").html("Consulta general");

                
                
	},// End Init() 
	cargarReporte : function() {
	}, // End Init()
        gridReload: function(){ 
                
        var gasto = $("#numGasto").val();
        var user = $("#usName").val();
                        //var user ="ALTAMIRANO LOZADA ISRAEL ADI";
        var credito = $("#numCredit").val();
   
                jQuery("#consulta-GastoList-grid").jqGrid('setGridParam',{
                    url: baseUrl + '/catalogos/miexpediente/getgastolist',
                    postData: { gasto: gasto,user:user, credito: credito},
                    mtype: 'POST',
                    datatype: 'json',
                    page:1
                }).trigger("reloadGrid");
                },
                
        renderGrid : function() {			
	var gasto = $("#numGasto").val();
		var user = $("#usName").val();
		var credito = $("#numCredit").val();
		var alto = $(document).height();
		var ancho = $(document).width();
                var status = $('#status').val();
                var userId = $('#userid').val();
                var categoria = $('#categoria').val();

		var grid = $('#consulta-GastoList-grid').jqGrid({
				url: baseUrl + '/catalogos/miexpediente/getgastolist', // get-lista-puestos
				datatype: 'json',
				postData: { gasto: gasto, user:user, credito: credito},
				autowidth: true,
				height: '100%',
				ondblClickRow: function (rowId) {
				},
				colNames:[
						  'N&uacute;mero de Gasto',
						  'Fecha de Registro',
						  'N&uacute;mero de Cuenta',
						  'Importe Comprobado',
						  'Tipo de Movimiento',
						  'N&uacute;mero de Cartera',
						  'Nombre del Usuario',
						  'Estatus'
				],
				colModel:[{
						name: 'FM.IDGASTOMAIN',
						index: 'FM.IDGASTOMAIN',
						sortype: false,
						search: false,
						resizable: false,
						align: 'left',
						width: 50
					},
					{
						name: 'FM.FDFECREGISTRO',
						index: 'FM.FDFECREGISTRO',
						sortype: 'string',
						searchoptions: {sopt: ['cn', 'eq']},
						resizable: false,
						align: 'left',
						width: 70,
					},
					{
						name: 'FM.FCCUENTACONTABLE',
						index: 'FM.FCCUENTACONTABLE',
                                                sortype: 'string',
						searchoptions: {sopt: ['cn', 'eq']},
						resizable: false,
						align: 'left',
                                                width: 90,
					},
									{
						name: 'FM.FNIMPORTECOMPROBADO',
						index: 'FM.FNIMPORTECOMPROBADO',
						sortype: 'string',
						searchoptions: {sopt: ['cn', 'eq']},
						resizable: false,
						align: 'left',
                                                width: 100,
					},
									{
						name: 'FM.TPOMOVIMIENTO',
						index: 'FM.TPOMOVIMIENTO',
                                                sortype: 'string',
						searchoptions: {sopt: ['cn', 'eq']},
						resizable: false,
						align: 'left',
                                                width: 100,
					},
									{
						name: 'FA.FCCREDITOCARTERA',
						index: 'FA.FCCREDITOCARTERA',
						sortype: 'string',
						searchoptions: {sopt: ['cn', 'eq']},
						resizable: false,
						align: 'left',
                                                width: 130,
					},
									{
						name: 'CU.NMNOMBRE',
						index: 'CU.NMNOMBRE',
						sortype: 'string',
						searchoptions: {sopt: ['cn', 'eq']},
						resizable: false,
						align: 'left',
                                                width: 250,
					},
								   {
						name: 'FM.STATUS',
						index: 'FM.STATUS',
						search: false,
						sortable:false,
						//searchoptions: {sopt: ['cn', 'eq']},
						resizable: false,
						align: 'left',
                                                width: 80,
					}
				],
				rowNum: -1,
				mtype: 'POST',
				sortname: 'FM.FDFECREGISTRO',
							viewrecords: true,
							sortorder: 'desc',
							caption:'',
							loadtext: 'Cargando informaci&oacute;n....',
							loadonce: false,
			});
			$('#consulta-GastoList-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true});
                        
	}
        
};
MiexpedienteIndex2.init();
