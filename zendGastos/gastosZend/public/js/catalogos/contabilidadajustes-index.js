var IndexIndex = {
		creditos: [],
		init : function() {
			$(".grid-title").html("Actualización de pagos dobles");
			
			$("#btnBorrarDatos").click(function( e ) {
				e.preventDefault();
				$("#cuentaContable").val("");
				$("#numCredito").val("");
				$("#poliza").val("");
				$("#factura").val("");
				$("#resBuscarGastos").html("");
				$("#cuentaContable").focus();
			});
			
			$("#btnBuscarGastos").click(function( e ) {
				e.preventDefault();
				var hayDatoBuscar = false;
				if( $.trim( $("#cuentaContable").val()) != "" ){
					//hayDatoBuscar = true;
				}
				
				if( $.trim( $("#numCredito").val()) != "" ){
					hayDatoBuscar = true;
				}
				
				if( $.trim( $("#poliza").val()) != "" ){
					hayDatoBuscar = true;
				}
				
				if( $.trim( $("#factura").val()) != "" ){
					hayDatoBuscar = true;
				}
				
				if(hayDatoBuscar == false) {
					alert("Ingrese un parametro de búsqueda");
					$("#cuentaContable").focus();
					return false;
				}
				
				var url = baseUrl + "/catalogos/contabilidadajustes/getgastos";
				$("#resBuscarGastos").html('<div class="progress progress-striped active"><div class="bar" style="width: 40%;"></div></div>');
				$.ajax({
					type: "POST",
					url: url,
					data: $("#frmBuscarGastos").serialize(),
					dataType: 'html',
					success: function(data) {
//						$( "#conceptoid" ).find('option').remove().end();
//						$( "#conceptoid" ).append('<option value="">- Seleccione -</option>');
//						$.each(data.conceptos, function (i, item) {
//							$( "#conceptoid" ).append('<option value="' + item.IDCONCEPTO + '">' + item.NMCONCEPTO + '</option>');
//					    });
						$("#resBuscarGastos").html(data);
					}
				});
			});
			
			$( document ).on({
				click: function(e){
					e.preventDefault();
					var idGasto = $(this).attr('idgasto');
					$("#lblIdGastoModifica").html("Modificar Gasto: " + idGasto);
					
					$.ajax({
						dataType: "json",
						url: baseUrl + '/catalogos/contabilidadajustes/getgastodetalle',
						data: {id_gasto:idGasto},
						success: function(data){
							console.log(data);
							$("#id_gasto_edit").val(data.id_gasto);
							$("#cuenta_contable_edit").val(data.cuenta_contable);
							$("#numero_credito_edit").val(data.numero_credito);
						}
					});
					$('#mdlEditarGasto').modal('show');
				}
			}, ".editgasto");
			
			$("#btnGuardarModifGasto").click(function( e ) {
				e.preventDefault();
				
				if( $.trim( $("#id_gasto_edit").val()) == "" ){
					alert("No es posible modificar el gasto.");
					return false;
				}

				if( $.trim( $("#cuenta_contable_edit").val()) == "" ){
					alert("Ingrese una cuenta contable.");
					$("#cuenta_contable_edit").focus();
					return false;
				}
				
				if( $.trim( $("#numero_credito_edit").val()) == "" ){
					alert("Ingrese un número de crédito.");
					$("#numero_credito_edit").focus();
					return false;
				}
				
				var url = baseUrl + "/catalogos/contabilidadajustes/setgastomodif";
				//$("#resBuscarGastos").html('<div class="progress progress-striped active"><div class="bar" style="width: 40%;"></div></div>');
				$.ajax({
					type: "POST",
					url: url,
					data: $("#frmEditarGasto").serialize(),
					dataType: 'json',
					success: function(data) {
						if(data.success == true){
							alert(data.msg);
							$('#mdlEditarGasto').modal('hide');
						} else {
							alert("Datos no guardados, intentelo de nuevo.");
						}
					}
				});
			});
			
			$( document ).on({
				click: function(e){
					e.preventDefault();
					var idGasto = $(this).attr('idgasto');
					$("#IdGastoADispersar").attr('idgasto', $(this).attr('idgasto'));
					$("#IdGastoADispersar").attr('cc', $(this).attr('cc'));
					$("#IdGastoADispersar").attr('nc', $(this).attr('nc'));
					$("#IdGastoADispersar").attr('mc', $(this).attr('mc'));
					
					$("#lblDisIdGasto").html($(this).attr('idgasto'));
					$("#lblDisCC").html($(this).attr('cc'));
					$("#lblDisNC").html($(this).attr('nc'));
					$("#lblDisMC").html($(this).attr('mc'));
					
					$("#lblIdDispersarGasto").html("Modificar Gasto: " + idGasto);
					$('#mdlDispersarGasto').modal('show');
				}
			}, ".dispersargasto");
			
			$("#iconMostrarAddGasto").click(function(e){
				$("#dispCredito").val( $("#IdGastoADispersar").attr('nc') );
				$("#dispMonto").val( $("#IdGastoADispersar").attr('mc') );
				$("#frmInsertarGasto").show();
			});
			
			$('#dispMonto').keyup(function (){
	            this.value = (this.value + '').replace(/[^0-9.]/g, '');
	        });
			
			$("#btnDelFormGasto").click(function(e){
				//$("#dispCuentaContable").val("");
				$("#dispCredito").val("");
				$("#dispMonto").val("");
				$("#frmInsertarGasto").hide();
			});
			
			$("#btnAddGastoDispersa").click(function(e){
				var montoTotal = $("#IdGastoADispersar").attr('mc');
				var cuentaDispersa = $("#IdGastoADispersar").attr('cc');
				var creditoDispersa = $("#dispCredito").val();
				var montoDispersa = $("#dispMonto").val();
				
				montoTotal = parseFloat(montoTotal);
				montoDispersa = parseFloat(montoDispersa);
				
				if(montoDispersa <= 0){
					alert("El monto a dispersar debe ser mayor que cero.");
					$("#dispMonto").focus();
					return false;
				}
				
				console.log(montoTotal);
				console.log(montoDispersa);
				if(montoDispersa > montoTotal){
					alert("El monto a dispersar es mayor que el monto total.");
					$("#dispMonto").focus();
					return false;
				}
				
				var identificacion = 0;
				var montoActual = 0;
				//Recorremos los documentos ingresados por codigo de barras
				var misCreditos = '';
				for (x in IndexIndex.creditos) {
					if (IndexIndex.creditos[x]) {
						//SolicitudRegistro.documents[x]['IDDOCTO'] = count;
						identificacion = IndexIndex.creditos[x]['ID'];
						montoActual += IndexIndex.creditos[x]['MONTO'];
					}
				}
				//creditos = misCreditos;
				montoActual = parseFloat(montoActual);
				if( (montoDispersa + montoActual) > montoTotal){
					alert("La suma de los montos a dispersar revasa al monto total.");
					$("#dispMonto").focus();
					return false;
				}
				
				var row = new Array();
				row['ID'] 				= identificacion + 1;
				//row['ID_GASTO'] 		= item.IDENTIFICA;
				row['CUENTA_CONTABLE']	= cuentaDispersa;
				row['CREDITO'] 			= creditoDispersa;
				row['MONTO'] 			= montoDispersa;
				IndexIndex.creditos[identificacion] = row;
				
				console.log(IndexIndex.creditos);				
				var fila = "";
				fila = '<tr><td>' + (identificacion + 1) +'</td><td>' + cuentaDispersa + '</td><td>' + creditoDispersa + '</td><td>' + montoDispersa + '</td><td></td></tr>';
				$("#tblDispersarGasto tbody").append(fila);
		
				$("#dispCredito").val("");
				$("#dispMonto").val("");
				$("#frmInsertarGasto").hide();
				return false;
			});
			
			$('#mdlDispersarGasto').on('hidden', function () {
				IndexIndex.creditos = [];
				$("#tblDispersarGasto tbody").find("tr:gt(0)").remove();
				$("#frmInsertarGasto").hide();
			});
			
			$("#btnGuardarDispersarGasto").click(function( e ) {
				e.preventDefault();
				
				var id_gasto = $("#IdGastoADispersar").attr('idgasto');
				
				var identidicadores = '';
				var cuentas_contables = '';
				var creditos = '';
				var montos = '';

				for (x in IndexIndex.creditos) {
					if (IndexIndex.creditos[x]) {
						//SolicitudRegistro.documents[x]['IDDOCTO'] = count;
						identidicadores += IndexIndex.creditos[x]['ID'] + '|';
						cuentas_contables += IndexIndex.creditos[x]['CUENTA_CONTABLE']  + '|';
						creditos += IndexIndex.creditos[x]['CREDITO']  + '|';
						montos += IndexIndex.creditos[x]['MONTO']  + '|';
					}
				}
				
				if( identidicadores == '' && cuentas_contables == '' && creditos == '' && montos == '' ) {
					alert("Debe ingresar los créditos dispersar.");
					return false;
				}
				
				console.log(identidicadores);
				console.log(cuentas_contables);
				console.log(creditos);
				console.log(montos);
				//alert("Vamos dispersar los créditos.");return false;				
				var url = baseUrl + "/catalogos/contabilidadajustes/setdispersargasto";
				//$("#resBuscarGastos").html('<div class="progress progress-striped active"><div class="bar" style="width: 40%;"></div></div>');
				$.ajax({
					type: "POST",
					url: url,
					data: {
						idgasto:			id_gasto,
						identidicadores: 	identidicadores,
						cuentas_contables:	cuentas_contables,
						creditos: 			creditos,
						montos: 			montos
					},
					dataType: 'json',
					success: function(data) {
						if(data.success == true){
							alert("El gasto se ha dispersado correctamente.");
							$('#mdlDispersarGasto').modal('hide');
						} else {
							alert("Datos no guardados, intentelo de nuevo.");
						}
					}
				});
			});
		},// End Init() 
		resetearCampos : function() {
			$("#idCosto").val("0");
			$("#costoNombre").val("");
			$("#divStatus").hide();
			$("#status").val("A");
			$('#lblFormModalSuc').html("Agregar costo");
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
		}// resetearCampos() 
};

IndexIndex.init();