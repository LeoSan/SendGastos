var Catcredproveedores = {
		init : function() {
			//alert("Hola como estas?");
			//var baseUrl = '/cuentas/public';
			
			$(".grid-title").html("Catálogo cuenta proveedores");
                        
                        Catcredproveedores.renderGrid();
			$('#noEmpleado').val( $('#noEmpleado').html() );
			$("#selStatus").change(function( e ) {
				e.preventDefault();
				Catcredproveedores.ChangeFilter();
			});
			
			$("#nombreProv").click(function(e){
				console.log("Hola Mike" + $(this).val());
			});
			
			$("#btnBuscar").click(function( e ) {
				e.preventDefault();
				
				if ( $.trim( $( "#txtBuscar" ).val() ) == "" ) {
					alert("Ingrese el nombre del proveedor.");
					$( "#txtBuscar" ).focus();
					return false;
				}
				
				Catcredproveedores.buscarProvedores( $("#txtBuscar").val(), 'NM' );
			});
			
			$(".letras").click(function( e ) {
				e.preventDefault();
				var letra = $(this).html();
				Catcredproveedores.buscarProvedores( letra, 'LT' );
			});
			
			$( document ).on({
				keypress : function( event ) {
					if ( event.which == 13 && $.trim( $(this).val() ) != "" ) {
						event.preventDefault();
						
						if ( $.trim( $( this ).val() ) == "" ) {
							alert("Ingrese el nombre del proveedor."); return false;
						}
						Catcredproveedores.buscarProvedores( $( this ).val(), 'NM' );
					 }
				}
			}, "#txtBuscar");
			
			$('#nombreProvBusqueda').typeahead({
				items: 10,
				source: function (query, process) {
					//console.log( "Palabra: " + baseUrl + query);
				    states = [];
				    map = {};
				    
				    $.ajax({
						type: "POST",
						url: baseUrl + '/catalogos/catcredproveedores/getproveedores',
						data: { texto: query },
						dataType: 'json',
						success: function(data) {
							console.log(data);//return false;
							$.each(data.cuentas, function (i, state) {
								//alert(state.NMNOMBRE);return false;
								//console.log(state);
						        map[state.nombre] = state;
						        states.push(state.nombre);
						    });
						 
						    process(states);
						}
					});
				},
				updater: function (item) {
					//console.log(item);
				    selectedState = map[item].id;
				    nombreProvedor = map[item].nombre;
				    //console.log(selectedState);
				    //$("#idTitular").val(selectedState);
				    //console.log(selectedState);
				    
				    /*
				    Catcredproveedores.buscarProvedorDetalle(selectedState, 'add');
				    return item;
				    */
				    var userid = $('#noEmpleado').html();
					$.ajax({
						  url: baseUrl + '/catalogos/catcredproveedores/buscarclaveproveedor',
						  type: 'POST',
						  data: { clave: selectedState, userid: userid},
						  dataType: 'json',
						  success: function(data) {
							  console.log(data);
							  //return false;
							  
							  if(data.respuesta == 'success'){
								  alert("El proveedor: " + nombreProvedor + "  ya ha sido agregado al catalogo");
								  $("#nombreProvBusqueda").val("");
								  $("#nombreProvBusqueda").focus();
							  } else{
								  Catcredproveedores.buscarProvedorDetalle(selectedState, 'add');
								  return item;
							  }
							} 
					});
				    
				}
			});
			
			$( document ).on({
				keypress : function( event ) {
					if ( event.which == 13 && $.trim( $(this).val() ) != "" ) {
						event.preventDefault();
						Catcredproveedores.resetearCampos();
						if ( $.trim( $( this ).val() ) == "" ) {
							alert("Debe ingresar la clave del proveedor a buscar."); 
							return false;
						}
						Catcredproveedores.buscarClaveProveedor( $( this ).val() );
					 }
				}
			}, "#xClaveBusqueda");
			
			$("#btnBuscarProveedorAdd").click(function( e ) {
				e.preventDefault();
				Catcredproveedores.resetearCampos();
				if( $.trim( $("#xClaveBusqueda").val() ) == "" ){
					alert("Debe ingresar la clave del proveedor a buscar.");
					return false;
				}
				
				var xClave = $.trim( $("#xClaveBusqueda").val() );
				//Catcredproveedores.buscarClaveProveedor( xClave );
				//return false;
				
				var userid = $('#noEmpleado').html();
				$.ajax({
					  url: baseUrl + '/catalogos/catcredproveedores/buscarclaveproveedor',
					  type: 'POST',
					  data: { clave: xClave, userid: userid},
					  dataType: 'json',
					  success: function(data) {
						  console.log(data);
						  //return false;
						  
						  if( data.respuesta == 'success' ){
							  alert("El proveedor: " + xClave + "  ya ha sido agregado al catálogo");
							  $("#txtBuscar").val("");
							  $("#txtBuscar").focus();
						  } else{
							  Catcredproveedores.buscarClaveProveedor( xClave );
						  }
						} 
				});
			});
			
			$("#btnAddSucursal").click(function( e ) {
				e.preventDefault();
				$('#catalogo-content').html("");
				var userid = $('#noEmpleado').html();
				$.ajax({
					  url: $(this).attr('href'),
					  type: 'POST',
					  data: {test: 'test', userid: userid},
					  dataType: 'html',
					  complete: function() {
							//Modal.close();
					  },
					  success: function(data) {
						  	$('#catalogo-content').html(data);
						} 
				});
			});
			
			$( document ).on({
				click : function( e ) {
					e.preventDefault();
					
					var clave = $( this ).attr("id-rel");
					console.log(clave);
					//Catcredproveedores.buscarClaveProveedor( clave );
					Catcredproveedores.buscarProvedorDetalle(clave, 'edit');
					$("#lblFormModalSuc").html("Consultar proveedor");
					$("#barraBusqueda").hide();
					$("#parteEditar").show();
					$("#tipomovto").val("EDI");
					$('#frmAddModal').modal('show');
				}
			}, ".editarCat");
			
			$("#status-activo").click(function(e){
				$('#status').val("A");
			});
			
			$("#status-inactivo").click(function(e){
				$('#status').val("I");
			});
			
			$("#btnModalAceptar").click(function(e){
				e.preventDefault();
				//$("#frmCentroCostos").submit();
				//alert("Guardamos la nueva sucursal"); return false;
				
				if( $.trim( $("#clave").val() ) == ""){
					$( "#clave" ).parent().addClass("control-group error");
					$( "#clave" ).parent().append( '<span class="help-inline">Debe buscar el proveedor</span>' );
					$( "#clave" ).focus();
					return false;
				}
				
				if( $.trim( $("#montoCredito").val() ) == "" || parseInt ( $.trim( $("#montoCredito").val() ) ) <= 0){
					$( "#montoCredito" ).parent().addClass("control-group error");
					$( "#montoCredito" ).parent().append( '<span class="help-inline">Ingrese el monto del crédito. Sebe ser mayor que cero.</span>' );
					$( "#montoCredito" ).focus();
					return false;
				}
				var userid = $('#noEmpleado').html();
				/**/
				//return false;
				var confirmar = confirm("¿Desea guardar?");
				
				if (confirmar) {
					$.ajax({
						  url: baseUrl + '/catalogos/catcredproveedores/setaddproveedor',
						  type: 'POST',
						  data: $("#frmNuevoProveedor").serialize() + '&userid=' + userid,
						  dataType: 'json',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  console.log(data);
							  //return false;
							  if( data.success == '0'){
								  Catcredproveedores.buscarProvedores( $.trim( $( nombre ).val() ), 'NM' );
								  $('#frmAddModal').modal('hide');
							  }else {
								  alert("Ocurrio un error. " + data.success);
							  }
							  
							} 
					});
				}
			});
			
			$('#frmAddModal').on('hidden', function () {
				$("#barraBusqueda").show();
				$("#parteEditar").hide();
				$("#tipomovto").val("INS");
				$("#lblFormModalSuc").html("Agregar proveedor");
				Catcredproveedores.resetearCampos();
			});
			
			$('#frmAddModal').on('show', function () {
				//$('#lblFormModalSuc').html("Agregar sucursal");
			});
			/**/
			// validate signup form on keyup and submit
			$("#frmCentroCostos").validate({
				rules: {
					costoNombre: "required"
				},
				messages: {
					costoNombre: "Ingrese el nombre del costo"
				},
				submitHandler: function(form) {
				    //alert("Todo esta validado: " + $("#frmCategoria").serialize()); return false;
				    var userid = $('#noEmpleado').html();
					$.ajax({
						  url: baseUrl + '/catalogos/centrocostos/setcosto',
						  type: 'POST',
						  data: $("#frmCentroCostos").serialize(),
						  dataType: 'json',
						  complete: function() {
								//Modal.close();
						  },
						  success: function(data) {
							  console.log(data);
							  //return false;
							  $('#frmAddModal').modal('hide');
							  
							  Menu.loadModuleMenu('catalogos', 'centrocostos', 'index');
							  return false;
							} 
					});
					//form.submit();
				}
			});
			
			//Botón sincronizar con Dynamics
			$("#btnSincronizarDynamics").click(function(e){
				e.preventDefault();
				//alert("¿Esta seguro que desea sincronizar la info?");
				//window.location.href = baseUrl + '/catalogos/catcredproveedores/sincronizarproveedores';
				window.open(baseUrl + '/catalogos/catcredproveedores/sincronizarproveedores');
			});
			
		},// End Init() 
		resetearCampos : function() {
			$('#clave').val( "" );
			  $('#nombreProv').val( "" );
			  $('#remitentePago').val( "" );
			  $('#atencion').val( "" );
			  $('#direccion').val( "" );
			  $('#rfc').val( "" );
			  $('#emailProv').val( "" );
			  
			  $('#desImpuesto1').val( "" );
			  $('#desImpuesto2').val( "" );
			  $('#desImpuesto3').val( "" );
			  $('#desImpuesto4').val( "" );
			  $('#impuesto1').val( "" );
			  $('#impuesto2').val( "" );
			  $('#impuesto3').val( "" );
			  $('#impuesto4').val( "" );
			  $('#uFechActualiza').val( "" );
			  
			  $('#montoCredito').val( "" );
			  $('#tipoCuenta').val( "fiscal" );
			  $('#status').val( "A" );
		},
		showLoadingSearch : function() {
			$('#loading-search').css( "display", "block" );
		},
		hideLoadingSearch : function() {
			$('#loading-search').css( "display", "none" );
		},
		buscarClaveProveedor : function( clave ) {
			console.log(clave);
			var userid = $('#noEmpleado').html();
			$.ajax({
				  url: baseUrl + '/catalogos/catcredproveedores/buscarclaveproveedor',
				  type: 'POST',
				  data: { clave: clave, userid: userid},
				  dataType: 'json',
				  complete: function() {
						//Modal.close();
				  },
				  success: function(data) {
					  console.log(data);
					  //return false;
					  
					  if(data.respuesta == 'success'){
						  Catcredproveedores.buscarProvedorDetalle(clave, 'add');
					  } else{
						  alert("Clave: " + clave + "  no existe");
						  $("#xClaveBusqueda").val("");
						  $("#xClaveBusqueda").focus();
					  }
					} 
			});
		},
		buscarProvedores : function( texto, tipo ) {
			console.log(texto);
			console.log(tipo);
			Layout.showLoading();
			$.ajax({
				type: "POST",
				url: baseUrl + '/catalogos/catcredproveedores/getlistprovgasto',
				data: { texto: texto, tipo: tipo },
				dataType: 'html',
				success: function(data) {
					//console.log(data); return false;
					Layout.hideLoading();
					$("#contentListaProvGasto").html(data);
				}
			});
		},
		buscarProvedorDetalle : function( idProveedor, accion ) {
			console.log(idProveedor);
			var userid = $('#noEmpleado').html();
			Catcredproveedores.showLoadingSearch();
			
			var url = baseUrl + '/catalogos/catcredproveedores/getdetprovgasto';
			
			if(accion == "edit"){
				var url = baseUrl + '/catalogos/catcredproveedores/getproveedordetalle';
			}
			console.log(url);
			$.ajax({
				  url: url,
				  type: 'POST',
				  data: {proveedorid: idProveedor, userid: userid},
				  dataType: 'json',
				  complete: function() {
						//Modal.close();
				  },
				  success: function(data) {
					  console.log(data);
					  //return false;
					  Catcredproveedores.hideLoadingSearch();
					  console.log(data.proveedor[0].NOMBRE);
					  $('#clave').val( data.proveedor[0].IDDYN );
					  $('#nombreProv').val( data.proveedor[0].NOMBRE );
					  $('#remitentePago').val( data.proveedor[0].REMITENTE );
					  $('#atencion').val( data.proveedor[0].ATENCION );
					  $('#direccion').val( data.proveedor[0].DIRECCION );
					  $('#rfc').val( data.proveedor[0].RFC );
					  $('#emailProv').val( data.proveedor[0].EMAIL );
					  
					  $('#desImpuesto1').val( data.proveedor[0].DTAX01);
					  $('#desImpuesto2').val( data.proveedor[0].DTAX02);
					  $('#desImpuesto3').val( data.proveedor[0].DTAX03);
					  $('#desImpuesto4').val( data.proveedor[0].DTAX04);
					  $('#impuesto1').val( data.proveedor[0].TAX01);
					  $('#impuesto2').val( data.proveedor[0].TAX02);
					  $('#impuesto3').val( data.proveedor[0].TAX03);
					  $('#impuesto4').val( data.proveedor[0].TAX04);
					  
					  $('#montoCredito').val( "$" + Catcredproveedores.formatoNumero(data.proveedor[0].IMPORTECREDITO));
					  $('#totalAnticipos').val( "$" + Catcredproveedores.formatoNumero(data.proveedor[0].IMPORTEANTICIPO ));
					  $('#totalReembolso').val( "$" + Catcredproveedores.formatoNumero(data.proveedor[0].IMPORTEREEMBOLSO ));
					  $('#totalGastos').val( "$" + Catcredproveedores.formatoNumero(data.proveedor[0].TOTGASTOS ));
					  $('#totalAcumulado').val( "$" + Catcredproveedores.formatoNumero(data.proveedor[0].IMPORTECONSUMIDO ));
					  $('#status').val( data.proveedor[0].STATUS );
					  $('#tipoCuenta').val( data.proveedor[0].TIPOCUENTA );
					  $('#numTarjetas').val( data.proveedor[0].TARJETA );
					  var today = new Date();
					  var dd = today.getDate(); //January es 0! 
					  var mm = today.getMonth() + 1;
					  var yyyy = today.getFullYear().toString().substr(2,2);
					  if( dd < 10){
						  dd = '0' + dd;
					  } 
					  if( mm < 10 ){
						  mm='0' + mm;
					  } 
					var today = dd + '-' + Catcredproveedores.replaceMont(mm) + '-' + yyyy;
                                          //var today = dd + '-' + mm + '-' + yyyy;
					  $('#uFechActualiza').val( today );
					  
					  $("#xClaveBusqueda").val("");
					  $("#nombreProvBusqueda").val("");
					  $("#nombreProvBusqueda").focus();
					  return false;
					} 
			});
		},
		ChangeFilter : function() {
			var userid = $('#noEmpleado').html();
			$.ajax({
				  url: baseUrl + '/catalogos/categorias/index/',
				  type: 'POST',
				  data: {status: $("#selStatus").val(), userid: userid},
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
		},
                renderGrid : function() {
		var alto = $(document).height();
		var ancho = $(document).width();
                var status = $('#status').val();
                var userId = $('#userid').val();
                var categoria = $('#categoria').val();

		var grid = $('#consulta-catcredproveedores-grid').jqGrid({
		   	url: baseUrl + '/catalogos/catcredproveedores/getlistprovgasto',
			datatype: 'json',
                    postData: { userQuasar: '',status:status,userid: userId, categoria: categoria},
			autowidth: true,
			height: '100%',
                    ondblClickRow: function (rowId) {
			},
		   	colNames:[
		   	          'No.',
		   	          'Nombre',
                                  'RFC',
                                  'Estatus',
                                  'Importe restante',
                                  'Importe cuenta',
		   	          'Acción'
		   	],
		   	colModel:[{
		   			name: 'IDPROVEEDORGTO',
		   			index: 'IDPROVEEDORGTO',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 50
		   		},
		   		{
		   			name: 'NMPROVEEDOR',
		   			index: 'UPPER(NMPROVEEDOR)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 200,
		   		},
		   		{
		   			name: 'FCRFC',
		   			index: 'FCRFC',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
                                        width: 80
		   		},
                               {
		   			name: 'FCSTATUS',
		   			index: 'FCSTATUS',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 80,
		   		},
                                {
		   			name: 'FNIMPORTECONSUMIDO',
		   			index: 'FNIMPORTECONSUMIDO',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'right',
		   			width: 50,
		   		},
                                {
		   			name: 'FNIMPORTECREDITO',
		   			index: 'FNIMPORTECREDITO',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'right',
		   			width: 50,
		   		},
		   		{
		   			name: 'ACCION',
                                        search: false,
                                        sortable:false,
		   			align: 'center',
                                        width: 50,
                                        editable:true
                                       },
		   	],
		   	rowNum: -1,
			mtype: 'POST',
		   	sortname: 'NMPROVEEDOR',
                        viewrecords: true,
                        sortorder: 'asc',
						rownumbers: true,
                        caption:'',
                        loadtext: 'Cargando informaci&oacute;n....',
                        loadonce: false,
		});
		$('#consulta-catcredproveedores-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true});
	},
        
    number_format: function(amount, decimals) {

        amount += ''; // por si pasan un numero en vez de un string
        amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

        decimals = decimals || 0; // por si la variable no fue fue pasada

        // si no es un numero o es igual a cero retorno el mismo cero
        if (isNaN(amount) || amount === 0) 
            return parseFloat(0).toFixed(decimals);

        // si es mayor o menor que cero retorno el valor formateado como numero
        amount = '' + amount.toFixed(decimals);

        var amount_parts = amount.split('.'),
            regexp = /(\d+)(\d{3})/;

        while (regexp.test(amount_parts[0]))
            amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

        return amount_parts.join('.');
    },
    
     formatoNumero: function(numero, decimales, separadorDecimal, separadorMiles) {     
            var partes, array;     
        if ( !isFinite(numero) || isNaN(numero = parseFloat(numero)) ) 
        {         return "";     
        }     
        if (typeof separadorDecimal==="undefined") {
         separadorDecimal = ".";     
		 }     
		 if (typeof separadorMiles==="undefined") {
         separadorMiles = ",";     
		 }     // Redondeamos     
		 if ( !isNaN(parseInt(decimales)) ) {
                if (decimales >= 0) { 
                        numero = numero.toFixed(decimales);        
                        } else {
                        numero = ( Math.round(numero / Math.pow(10, Math.abs(decimales))) * Math.pow(10, Math.abs(decimales))             ).toFixed();       
                        }     
                 } else {     
		 numero = numero.toString();    
		 }     // Damos formato    
		 partes = numero.split(".", 2);    
		 array = partes[0].split("");    
		 for (var i=array.length-3; i>0 && array[i-1]!=="-"; i-=3) {
                    array.splice(i, 0, separadorMiles);     
		 }     
                 numero = array.join("");    
		 if (partes.length>1) {      
		 numero += separadorDecimal + partes[1];   
		 } 
                 return numero;
},
 replaceMont: function(fecha){
     var mes = '';
     switch(fecha) {
         case '01':
             mes = 'Ene';
             break;
         case '02':
             mes = 'Feb';
             break;
         case '03':
             mes = 'Marz';
             break;
         case '04':
             mes = 'Abr';
             break;
         case '05':
             mes = 'May';
             break;
         case '06':
             mes = 'Jun';
             break;
         case '07':
             mes = 'Jul';
             break;
         case '08':
             mes = 'Ago';
             break;
          case '09':
             mes = 'Sep';
             break;
         case '10':
             mes = 'Oct';
             break;
         case '11':
             mes = 'Nov';
             break;
         case '12':
             mes = 'Dic';
             break;
         default:
             '';
         
     }
     
     return mes;
 },
};

Catcredproveedores.init();
/*
$item['IDPROVEEDORGTO']; 
$item['NMPROVEEDOR']);
$item['FCRFC']); 
$item['FCSTATUS'] 
$item['FNIMPORTECONSUMIDO'],2); 
$item['FNIMPORTECREDITO'],2);
      <td><i id-rel="<?php //echo $item['IDPROVEEDORGTO']; ?>" class="icon-edit editarCat" title="Editar <?php //echo utf8_encode($item['NMPROVEEDOR']); ?>" style="cursor:pointer;">
      </i></td>

*/