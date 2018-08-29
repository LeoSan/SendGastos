var Contabilidadcatalogorarjetas = {
    init : function() {

            $(".grid-title").html("Catálogos de tarjetas");

            Contabilidadcatalogorarjetas.renderGrid();
            
    $(document).on({
        click: function(e){
            
            var tarjeta = $(this).attr('id-rel');
            
           $('#tarjeta').val( tarjeta);
            //$('#lblFormModalTarjeta').html('Editar tarjeta');
            $("#divStatus").show();
            $('#frmEditModal').modal();
            //alert(tarjeta);
        },
    },'.editarCat')
    
    $("#status-activo").click(function(e){
            $('#statusTarjeta').val("A");
    });

    $("#status-inactivo").click(function(e){
            $('#statusTarjeta').val("I");
    });
    
    $("#btnModalAceptar").click(function(e){
            e.preventDefault();
            $("#frmCatTarjeta").submit();
            return false;
            var confirmar = confirm("¿Desea guardar?");

            if (confirmar) {
                    $('#frmEditModal').modal('hide');
            }
    });

    $('#frmEditModal').on('hidden', function () {
            Contabilidadcatalogorarjetas.resetearCampos();
    });
    
    // validate signup form on keyup and submit
    $("#frmCatTarjeta").validate({
            rules: {
                    categoria: "required"
            },
            messages: {
                    //categoria: "Ingrese el nombre de la categoria"
            },
            submitHandler: function(form) {
                //alert("Todo esta validado: " + $("#frmCategoria").serialize()); return false;
                var userid = $('#userid').html();
                    $.ajax({
                              url: baseUrl + '/planesdeviaje/contabilidad/set-catalogo-tarjetas',
                              type: 'POST',
                              data: $("#frmCatTarjeta").serialize(),
                              dataType: 'json',
                              complete: function() {
                                            //Modal.close();
                              },
                              success: function(data) {
                                      console.log(data);
                                      //return false;
                                      // {"success":true}
                                      if(data['success']) {
                                         $('#frmAddModal').modal('hide'); 
                                      } else {
                                          alert('Error al guardar los datos');
                                      }                                

                                      Menu.loadModuleMenu('planesdeviaje', 'contabilidad', 'catalogotarjetas', '#');
                                      return false;
                                    } 
                    });
                    //form.submit();
            }
    });

//// Actualizar 

    $("#btnEditModalAceptar").click(function(e){
            e.preventDefault();
            $("#frmEditCatTarjeta").submit();
            return false;
            var confirmar = confirm("¿Desea guardar?");

            if (confirmar) {
                    $('#frmAddModal').modal('hide');
            }
    });

    $('#frmEditCatTarjeta').on('hidden', function () {
            Contabilidadcatalogorarjetas.resetearCampos();
    });
    
    // validate signup form on keyup and submit
    $("#frmEditCatTarjeta").validate({
            rules: {
                    categoria: "required"
            },
            messages: {
                    //categoria: "Ingrese el nombre de la categoria"
            },
            submitHandler: function(form) {
                //alert("Todo esta validado: " + $("#frmCategoria").serialize()); return false;
//            var tarjeta = $('#tarjeta').val( tarjeta);
//            var status = $('#statusTarjeta').val();
                
                    $.ajax({
                              url: baseUrl + '/planesdeviaje/contabilidad/update-catalogo-tarjetas',
                              type: 'POST',
                              data: $("#frmEditCatTarjeta").serialize(),
                              dataType: 'json',
                              complete: function() {
                                            //Modal.close();
                              },
                              success: function(data) {
                                      console.log(data);
                                      //return false;
                                      // {"success":true}
                                      if(data['success']) {
                                         $('#frmEditModal').modal('hide'); 
                                      } else {
                                          alert('Error al guardar los datos');
                                      }                                

                                      Menu.loadModuleMenu('planesdeviaje', 'contabilidad', 'catalogotarjetas', '#');
                                      return false;
                                    } 
                    });
                    //form.submit();
            }
    });

    },// End Init() 
    
    resetearCampos : function(){
        $("#idejec").val("");
        $("#fcnocard").val("");
        $("#fctipo").val("");
        $("#fcreferenca").val("");
        $('#fcbanco').html("");  

    },
                
    renderGrid : function() {
            var alto = $(document).height();
            var ancho = $(document).width();
            var grid = $('#consulta-catalogotarjetas-grid').jqGrid({
                    url: baseUrl + '/planesdeviaje/contabilidad/get-catalogo-tarjetas',
                    datatype: 'json',
        postData: { },
                    autowidth: true,
        shrinkToFit: true,
                    //height: alto - 267,
                    height: '100%',
                    ignoreCase: true,
                    ondblClickRow: function (rowId) {
                            layout.showLoading();
                            var rowData = $(this).getRowData(rowId);
                            ConsultaInventario.renderElementDetail(rowData['IDDOCTO'],rowData['CREDITO']);
                    },
                    colNames:[
                              'Id empleado',
                              'Nombre',
                              'Tarjeta',
                              'Tipo',
                              'Referencia',
                              'Banco',
                              'Registro',
                              'Estatus',
                              'Operación',
                    ],

                    colModel:[{
                                    name: 'IDEJEC',
                                    index: 'IDEJEC',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'right',
                                    width: 90
                            },
                            {
                                    name: 'EMPLEADO',
                                    index: 'EMPLEADO',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'left',
                                    width: 180
                            }, {
                                    name: 'FCNOCARD',
                                    index: 'FCNOCARD',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'right',
                                    width: 100
             
                            },{
                                    name: 'FCTIPO',
                                    index: 'FCTIPO',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'left',
                                    width: 40
                            },{
                                    name: 'FCREFERENCIA',
                                    index: 'FCREFERENCIA',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'right',
                                    width: 60
                            },{
                                    name: 'FCBANCO ',
                                    index: 'FCBANCO ',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    sortable: true,
                                    resizable: false,
                                    align: 'left',
                                    width: 60
                            },{
                                    name: 'FDFECREGISTRO',
                                    index: 'FDFECREGISTRO',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'center',
                                    width: 90
                            },{
                                    name: 'FCSTATUS',
                                    index: 'FCSTATUS',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    align: 'left',
                                    width: 90
                                    
                                    // 'OPERACION'
                            },{
                                    name: 'OPERACION',
                                    index: 'OPERACION',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    align: 'center'
                                    
                                    // 'OPERACION'
                            }
                    ],
//SELECT IDEJEC , FCNOCARD , FCTIPO , FCREFERENCIA , FCBANCO , TO_CHAR(FDFECREGISTRO, FCSTATUS FROM CTCARDMAIN ORDER BY IDEJEC
                    rowNum: 15,
                    mtype: 'POST',
                    gridview: false,
                    //pager: '#consulta-inventario-pager',
                    sortname: 'FDFECREGISTRO',
                    sortorder: 'desc',
                    viewrecords: true,
                    rownumbers: true,
                    caption:'',
                    loadtext: 'Cargando informaci&oacute;n....',
                    loadonce: false,
                loadBeforeSend: function(xhr, settings){
                   
                },
                loadComplete: function(data) {
                    
                    //Begin si no es despachoext
                    if( $("#perfil").html() != "despachoext" ){
//                            $("tr.jqgrow", this).contextMenu('myMenu1', {
//                                bindings: {
//                                    'history': function(trigger) {
//                                           
//                                        var rowData = $('#consulta-inventario-grid').getRowData(trigger.id);
//                                        ConsultaInventario.renderElementDetail(rowData['IDDOCTO']);
//                                    }
//                                },
//                                onContextMenu: function(event) {
//                                    var rowId = $(event.target).closest("tr.jqgrow").attr("id");
//                                    return true;
//                                }
//                            });
                    }	
                        //End si no es despachoext
                }
            });
            $('#consulta-catalogotarjetas-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true, searchOnEnter: false});
    },

};

Contabilidadcatalogorarjetas.init();
/*
*/