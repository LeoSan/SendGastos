var facturaciongasolina = {
    
    
    init : function() {
        
    $(".grid-title").html("Facturación de gasolina");

    facturaciongasolina.renderGrid();
    },
    
    renderGrid : function() {
            var alto = $(document).height();
            var ancho = $(document).width();
            var grid = $('#consulta-facturaciongasolina-grid').jqGrid({
                    url: baseUrl + '/planesdeviaje/contabilidad/get-facturacion-gasolina',
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
                            facturaciongasolina.renderElementDetail(rowData['IDDOCTO'],rowData['CREDITO']);
                    },
                    colNames:[
                              'Plan de viaje',
                              'Nombre',
                              'Num empleado',
                              'Estatus',
                              'Monto',
                              'Fecha inicio',
                              'Fecha fin',
                              'Urgente'
                            ],

                    colModel:[{
                                    name: 'IDGASTO',
                                    index: 'IDGASTO',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'left',
                                    width: 90
                            },
                            {
                                    name: 'EMPLEADO',
                                    index: 'EMPLEADO',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'left',
                                    width: 250
                            }, {
                                    name: 'FNEMPNOMINA',
                                    index: 'FNEMPNOMINA',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'right'
             
                            },{
                                    name: 'FCSTATUS',
                                    index: 'FCSTATUS',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'left',
                                    width: 90
//SELECT FCSTATUS, FNEMPNOMINA, FNEMPNOMINA NUM_EMPLEADO, IDGASTO PLAN_DE_VIAJE, FNMONTOGASTO MONTO, FDFECINI, FDFECFIN, FCURGENTE URGENTE
                            },{
                                    name: 'FNMONTOGASTO',
                                    index: 'FNMONTOGASTO',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'right'
                            },{
                                    name: 'FDFECINI',
                                    index: 'FDFECINI',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    sortable: true,
                                    resizable: false,
                                    align: 'center'
                            },{
                                    name: 'FDFECFIN',
                                    index: 'FDFECFIN',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    resizable: false,
                                    align: 'center'
                            },{
                                    name: 'FCURGENTE',
                                    index: 'FCURGENTE',
                                    sortype: 'string',
                                    searchoptions: {sopt: ['cn', 'eq']},
                                    align: 'left'
                                    
                                    // 'OPERACION'
                            }
                    ],
                    rowNum: 15,
                    mtype: 'POST',
                    gridview: false,
                    //pager: '#consulta-inventario-pager',
                    sortname: 'FDFECINI',
                    sortorder: 'desc',
                    rownumbers: true,
                    viewrecords: true,
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
            $('#consulta-facturaciongasolina-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true, searchOnEnter: false});
    },
    
};

facturaciongasolina.init();