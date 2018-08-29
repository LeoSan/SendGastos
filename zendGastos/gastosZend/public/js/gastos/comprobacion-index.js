var ComprobacionIndex = {
		init : function() {
			
			ComprobacionIndex.cargarGrid();
			
			$( document ).on({
				change : function( e ) {
					ComprobacionIndex.setMismoImporteAtodos();
					ComprobacionIndex.guardarComprobacion(0);
				}
			}, "#chkSetValAll");
			
			$( document ).on({
				change : function( e ) {
					ComprobacionIndex.setMismoFacturaAtodos();
					ComprobacionIndex.guardarComprobacion(0);
				}
			}, "#chkSetFacAll");
			
			$( document ).on({
				change : function( e ) {
					var tipo = $(this).attr('data-tipo');
					ComprobacionIndex.setMismoDatoServicioAtodos(tipo);
					ComprobacionIndex.guardarPagosServicios(0,tipo,1);
				}
			}, ".chkServicioAll");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					var total = 0;
					var ethis = this;
					var totalFormat = 0;
					$("#lista-comprobaciones input[type=text].importereal").each(function(e){
						var elemento = this;
						total += parseFloat( $(this).val() );
					});
					totalFormat = parseFloat(total).toFixed(2);
					$("#totalImporteReal").html( "$ " + totalFormat.toString() );
					ComprobacionIndex.guardarComprobacion(ethis);
				}
			}, "#lista-comprobaciones .importereal");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					ComprobacionIndex.guardarPagosServicios(this, 'fecharealpago',0);
				}
			}, "#lista-comprobaciones .fecharealpago");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					ComprobacionIndex.guardarPagosServicios(this, 'remesa',0);
				}
			}, "#lista-comprobaciones .remesa");

			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					ComprobacionIndex.guardarFechaEjecucion(this, 'feejecucion',0);
				}
			}, "#lista-comprobaciones .feejecucion");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					ComprobacionIndex.guardarPagosServicios(this, 'serviciodel',0);
				}
			}, "#lista-comprobaciones .serviciodel");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					ComprobacionIndex.guardarPagosServicios(this, 'servicioal',0);
				}
			}, "#lista-comprobaciones .servicioal");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					ComprobacionIndex.guardarPagosServicios(this, 'pagadoanteriormente',0);
				}
			}, "#lista-comprobaciones .pagadoanteriormente");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					ComprobacionIndex.guardarPagosServicios(this, 'fpagoanterior',0);
				}
			}, "#lista-comprobaciones .fpagoanterior");
			
			$( document ).on({
				change : function( e ) {
					e.preventDefault();
					ComprobacionIndex.guardarPagosServicios(this, 'comentario',0);
				}
			}, "#lista-comprobaciones .comentario");
			

			$('body').on('focus',"#lista-comprobaciones .campodatepicker", function(){
			    $(this).datepicker({"dateFormat": "dd/mm/yy"});
			});
			/*
			$("#bntGuardarDummy").click(function( e ) {
				e.preventDefault();
				$(".loading-search").show();
				setTimeout(function(){ 
					$("#modalAlert").modal("show");
					$(".loading-search").hide();
				},1000);
			});
			*/
			$("#btnGetValXml").click(function( e ) {
				e.preventDefault();
					$("#modalAlert").modal("hide");
			});
			
			$("#bntGuardarComprobacion").click(function( e ) {
				e.preventDefault();
				ComprobacionIndex.guardarComprobacion(0);
			});
		}, 
		resetearCampos : function() {
			$("#idCosto").val("0");
			$("#costoNombre").val("");
			$("#divStatus").hide();
			$("#status").val("A");
			$('#lblFormModalSuc').html("Agregar costo");
			$("#status-activo").addClass("active");
			$("#status-inactivo").removeClass("active");
		}, 
		cargarGrid : function() {
			$.ajax({
				url: baseUrl + '/gastos/comprobacion/getdetallecomprobacion',
				type: 'POST',
				data: {solicitudid : $("#solicitudid").val(), tipocaptura:$("#tipocaptura").val()},
				dataType: 'html',
				success: function(data) {
					$('#lista-comprobaciones').html(data);
				} 
			});
		},
		setMismoImporteAtodos : function() {
			var valor = '';
			// console.log('Comenzamos a setear todos los valores por igual');
			$("#lista-comprobaciones input[type=text].importereal").each(function(e){
				var elemento = this;
				// console.log('Checked:' + $('#chkSetValAll').prop('checked'));
				if( $(this).is(':disabled') ) {
				} else {
					if( $('#chkSetValAll').prop('checked') ){
						if( valor === '' ){
							valor = $(this).val();
						} else {
							$(this).val(valor);
						}
					} else {
						$(this).val('0');
					}
				}
				
			});
		},
		setMismoFacturaAtodos : function() {
			var valorSelected = '';
			//console.log('Comenzamos a setear todos los valores por igual');
			$("#lista-comprobaciones select.importereal").each(function(e){
				var elemento = this;
				if( $(this).is(':disabled') ) {
				} else {
					if( $('#chkSetFacAll').prop('checked') ){
						if( valorSelected === ''){
							valorSelected = $(this).val();
						} else {
							$(this).val(valorSelected);
						}
					} else {
						$(this).val('0');
					}
				}
			});
		},
		setMismoDatoServicioAtodos : function(tipo) {
			var valor = '';
			$("#lista-comprobaciones input[type=text]."+tipo).each(function(e){
				var elemento = this;
				//console.log('Checked:' + $('.chkServicioAll.'+tipo).prop('checked'));
				if( $(this).is(':disabled') ) {
				} else {
					if( $('.chkServicioAll.'+tipo).prop('checked') ){
						if( valor === '' ){
							valor = $(this).val();
						} else {
							$(this).val(valor);
						}
					} else {
						$(this).val('');
					}
				}
			});
		},
		guardarComprobacion : function(id) {
			var cadenaIds = "";
			
			var indexthis = "";
			var idthis = "";
			if(id!==0){
				indexthis = "[index="+$(id).attr('index')+"]";
				idthis = "#"+id.id;
			}

			var hayReg = $("#lista-comprobaciones input[type=text]").length;

			if(hayReg <= 0 ){
				alert("No hay registros a guardar");
				return false;
			}
			var creditos = "";
			var importes = "";
			var conceptos = "";
			var comprobantes = "";
			var creditoAct = "";
			var conceptoAct = "";
			var index = "";
			var fechacomproba = "";
			var fechapago = "";

			$("#lista-comprobaciones input[type=text]").each(function(e){
				console.info($(this).attr('class'));
				if( $(this).hasClass('importereal') ){
					var elemento = this;
					index = $(this).attr("index");
					conceptoAct += $(this).attr("idconcepto");
					creditos += $(this).attr("credito") +  "|";
					
					importes += $(this).val() +  "|";
					conceptos += $(this).attr("idconcepto") +  "|";
					fechacomproba += $(this).attr("fechacomproba") +  "|";
					
					comprobantes += $("#impoAsigSel" + '-' + index).val() +  "|";
				}
			});

			$.ajax({
				  url: baseUrl + '/gastos/comprobacion/setcomprobacion',
				  type: 'POST',
				  async: false,
				  data: {gastoid: $("#solicitudid").val(), creditos:creditos, importes:importes, conceptos:conceptos, comprobantes:comprobantes, fechacomproba:fechacomproba, fechapago:fechapago},
				  dataType: 'json',
				  success: function(data) {
					  if( data.respuesta == "success" ){
						  parent.masterValor('se actualizo corretamente');
						  return true;
					  } else {
						  alert("Ocurrio un error: " + msj);
						  return false;
					  }
				} 
			});
		},
		guardarPagosServicios : function(elemento, tipo,all) {
			var creditos = "";
			var importes = "";
			var conceptos = "";
			var comprobantes = "";
			var creditoAct = "";
			var conceptoAct = "";
			var index = "";
			if( elemento != 0 ) {
				index = $(elemento).attr("index");
				conceptoAct = $(elemento).attr("idconcepto");
				creditos = $(elemento).attr("credito");
				if ( $( elemento ).is( "input[type=checkbox]" ) ) {
					if($( elemento ).is(':checked')) {  
						valor = 'S';  
		        	} else {  
		        		valor = 'N';
		        	}
				} else { valor = $(elemento).val(); }
				conceptos = $(elemento).attr("idconcepto");
				fechacomproba = $(elemento).attr("fechacomproba");
			} else {
				valor = $('input.input-mini.'+tipo).val();
				fechacomproba = $('input.input-mini.'+tipo).attr("fechacomproba");
			}
			
			$.ajax({
				  url: baseUrl + '/gastos/comprobacion/setpagosservicios',
				  type: 'POST',
				  async: false,
				  data: {
					  gastoid: $("#solicitudid").val(), 
					  creditos:creditos, 
					  valor:valor, 
					  conceptos:conceptos, 
					  fechacomproba:fechacomproba, 
					  tipo:tipo,
					  all : all
				 },
				  dataType: 'json',
				  success: function(data) {
					  if( data.respuesta == "success" ){
						  return true;
					  } else {
						  alert("Ocurrio un error: " + msj);
						  return false;
					  }
				} 
			});
		},
    	guardarFechaEjecucion : function(elemento, tipo,all) {
			console.log('cambiare la fecha de ejecucion');
			//return false;
        var creditos = "";
        var importes = "";
        var conceptos = "";
        var comprobantes = "";
        var creditoAct = "";
        var conceptoAct = "";
        var index = "";
        if( elemento != 0 ) {
            index = $(elemento).attr("index");
            conceptoAct = $(elemento).attr("idconcepto");
            creditos = $(elemento).attr("credito");
            if ( $( elemento ).is( "input[type=checkbox]" ) ) {
                if($( elemento ).is(':checked')) {
                    valor = 'S';
                } else {
                    valor = 'N';
                }
            } else { valor = $(elemento).val(); }
            conceptos = $(elemento).attr("idconcepto");
            fechacomproba = $(elemento).attr("fechacomproba");
        } else {
            valor = $('input.input-mini.'+tipo).val();
            fechacomproba = $('input.input-mini.'+tipo).attr("fechacomproba");
        }

        $.ajax({
            url: baseUrl + '/gastos/comprobacion/set-fecha-ejecucion',
            type: 'POST',
            async: false,
            data: {
                gastoid: $("#solicitudid").val(),
                creditos:creditos,
                valor:valor,
                conceptos:conceptos,
                fechacomproba:fechacomproba,
                tipo:tipo,
                all : all
            },
            dataType: 'json',
            success: function(data) {
                if( data.respuesta == "success" ){
                    return true;
                } else {
                    alert("Ocurrio un error: " + msj);
                    return false;
                }
            }
        });
    }
};

ComprobacionIndex.init();