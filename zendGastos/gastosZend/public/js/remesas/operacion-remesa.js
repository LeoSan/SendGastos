var operacionRemesas = {
    idLoadingMain:"#pendulum-loader",
    idLoadingModalToSave:"#pendulum-loader-modalToSave",
    filtroSelectOptionsConceptos:conceptosOptions,
    filtroSelectOptionsEstatus:estatusOptions,
    filtroSelectOptionsRegional:regionalOptions,
    flagFitroRemesa:false,
    flagFitrosRegCon:false,
    importeValidadoActual:parseFloat(0),
    importeDisponibleSeleccionado:parseFloat(0),
    arrayLayout:[],
    parametrosAjax:{
        type:'',
        url:'',
        dataType:'',
        data:'',
        before:'',
        success:''
    },
    arrayToSend:new Array(),
    arrayToSendJson:'',
    getCvtraEmpleado: function(){
        return  $("#cvtraEmpleado").text()
    },
    getRemesaSelect:  function(){
        return $("#selectRemesa").val();
    },
    getRegionalSelect:  function(){
        return  $("#gs_REGIONAL").val();
    },
    getConceptoSelect:  function(){
        return $("#gs_CONCEPTOREMESA").val();
    },
    getGastoToSearch:  function(){
        return $("#findIdGastoMain").val();
    },
    getCuentaToSearch:  function(){
        return $("#findNroCuenta").val();
    },
    getRemesaSelect:  function(){
        return $("#selectRemesa").val();
    },
    getAttrRemesaSelect: function(attr){
        return $("#selectRemesa option:selected").attr(attr);
    },
    getEstatusRow:function(id){//obtengo el nombre del estatus
        return $("#"+id+" td:eq(12)").text();
    },
    getCOEstatusRow:function(id){//obtengo el codigo del estatus
        return $("#"+id+" td:eq(43)").text();
    },
    getCOEstatusRowHtml:function(id){//obtengo el codigo del estatus
        return $("#"+id+" td:eq(43)").html();
    },
    getImportparseToFloat:function(id){//obtengo el monto comprobado en tipo float
        return parseFloat($("#"+id+" td:eq(14)").text().replace("$ ","").replace(",",""));
    },
    getParseToFloat:function(id){//obtengo el monto comprobado en tipo float
        return parseFloat($("#"+id).text().replace("$ ","").replace(",",""));
    },
    getEditParameters: function(id){
        //http://www.trirand.com/jqgridwiki/doku.php?id=wiki:inline_editing
        parameters = {//para la edicion
            keys : true,
            oneditfunc : function() {
                //
            },
            successfunc : function(data){
                data.responseText=JSON.parse(data.responseText);

                if(data.responseText[0]['ERROR']=="1"){
                    operacionRemesas.modalMensaje('Mensaje', data.responseText[0]['MSG'], 'type-danger', 'Ok','btn-info');
                }

                $("#jqGridRemesaOperacion").jqGrid('saveRow',id,operacionRemesas.getSaveParameters());

            },
            // successfunc :null,
            url : baseUrl+"/remesas/index/update-operacion-remesa/cvtraEmpleado",
            extraparam : {
                cvtraEmpleado:operacionRemesas.getCvtraEmpleado(),
                regionalSelect:operacionRemesas.getAttrRemesaSelect("data-regional"),
                conceptoSelect:operacionRemesas.getAttrRemesaSelect("data-concepto"),
                remesaSelect:operacionRemesas.getRemesaSelect(),
                importeToAdd:operacionRemesas.getImportparseToFloat(id)
            },
            aftersavefunc : null,
            // errorfunc: null,
            // afterrestorefunc : null,
            // restoreAfterError : false,
            // mtype : "POST"
        };

        return parameters;
    },
    getSaveParameters: function(){
        parameters = {
            successfunc: null,
            url : null,
            extraparam : {},
            aftersavefunc: function( idRow ) {
                if((operacionRemesas.getEstatusRow(idRow) == "VALIDADO" || operacionRemesas.getEstatusRow(idRow) == "Validado")
                    &&
                    (operacionRemesas.getCOEstatusRow(idRow) =="R" || operacionRemesas.getCOEstatusRow(idRow)=="ER" || operacionRemesas.getCOEstatusRowHtml(idRow)=="&nbsp;")){
                    //Actualizo el monto validado actual
                    operacionRemesas.importeValidadoActual += operacionRemesas.getImportparseToFloat(idRow);
                    operacionRemesas.updateMontoValidado(  operacionRemesas.getParseToFloat("validadoSpan"),operacionRemesas.getImportparseToFloat(idRow),1);
                    // operacionRemesas.updateMontoUsado();
                    operacionRemesas.setCOEstatusRow(idRow,'V');

                }else if((operacionRemesas.getEstatusRow(idRow) == "RECHAZADO" ||
                        operacionRemesas.getEstatusRow(idRow) == "Rechazado") && operacionRemesas.getCOEstatusRow(idRow) =="V"){
                    operacionRemesas.updateMontoValidado(operacionRemesas.getParseToFloat("validadoSpan"), operacionRemesas.getImportparseToFloat(idRow),0);
                    operacionRemesas.importeValidadoActual -= operacionRemesas.getImportparseToFloat(idRow);
                    // operacionRemesas.updateMontoUsado();
                    operacionRemesas.setCOEstatusRow(idRow,'R');
                }else if((operacionRemesas.getEstatusRow(idRow) == "EN REVISION" ||
                        operacionRemesas.getEstatusRow(idRow) == "En revision") && operacionRemesas.getCOEstatusRow(idRow) =="V"){
                    operacionRemesas.updateMontoValidado(operacionRemesas.getParseToFloat("validadoSpan"), operacionRemesas.getImportparseToFloat(idRow),0);
                    operacionRemesas.importeValidadoActual -= operacionRemesas.getImportparseToFloat(idRow);
                    // operacionRemesas.updateMontoUsado();
                    operacionRemesas.setCOEstatusRow(idRow,'R');
                }
                //oculto el boton de zip para los estatus en revision
                if(operacionRemesas.getCOEstatusRow(idRow)=="ER"){
                    operacionRemesas.disableButtonZip(idRow);
                }else if(operacionRemesas.getEstatusRow(idRow) == "EN REVISION" || operacionRemesas.getEstatusRow(idRow) == "En revision"){
                    operacionRemesas.enableButtonZip(idRow);
                }

                return true;
            },
            errorfunc: null,
            afterrestorefunc : null,
            restoreAfterError : true,
            mtype : "POST"
        }

        return parameters;
    },
    getEditParameters: function(id){
        //http://www.trirand.com/jqgridwiki/doku.php?id=wiki:inline_editing
        parameters = {//para la edicion
            keys : true,
            oneditfunc : function() {
                //
            },
            successfunc : function(data){
                data.responseText=JSON.parse(data.responseText);

                if(data.responseText[0]['ERROR']=="1"){
                    operacionRemesas.modalMensaje('Mensaje', data.responseText[0]['MSG'], 'type-danger', 'Ok','btn-info');
                }

                $("#jqGridRemesaOperacion").jqGrid('saveRow',id,operacionRemesas.getSaveParameters());

            },
            // successfunc :null,
            url : baseUrl+"/remesas/index/update-operacion-remesa/cvtraEmpleado",
            extraparam : {
                cvtraEmpleado:operacionRemesas.getCvtraEmpleado(),
                regionalSelect:operacionRemesas.getAttrRemesaSelect("data-regional"),
                conceptoSelect:operacionRemesas.getAttrRemesaSelect("data-concepto"),
                remesaSelect:operacionRemesas.getRemesaSelect(),
                importeToAdd:operacionRemesas.getImportparseToFloat(id)
            },
            aftersavefunc : null,
            // errorfunc: null,
            // afterrestorefunc : null,
            // restoreAfterError : false,
            // mtype : "POST"
        };

        return parameters;
    },
    setCOEstatusRow:function(id,coEstatus){//obtengo el codigo del estatus
        return $("#"+id+" td:eq(43)").text(coEstatus);
    },
    setAttrRemesaSelect: function(attr,val){
        return $("#selectRemesa option:selected").attr(attr,val);
    },
    setCuentaToSearch:  function(val){
        return $("#findNroCuenta").val(val);
    },
    setGastoToSearch:  function(val){
        return $("#findIdGastoMain").val(val);
    },
    disableButtonZip:function(idRow){
        $("#zip_"+idRow).prop("disabled",true).parent('a').addClass("hide");
    },
    enableButtonZip:function(idRow){
        $("#zip_"+idRow).prop("disabled",false).parent('a').removeClass("hide");
    },
    disableGenerarLayout:function(){
        $("#generateLayout").attr("disabled","disabled");
    },
    enableGenerarLayout:function(){
        $("#generateLayout").prop("disabled", false);
    },
    disableGenerarLayoutRevision:function(){
        $("#generateLayoutRevision").prop("disabled",true);
    },
    enableGenerarLayoutRevision:function(){
        $("#generateLayoutRevision").prop("disabled", false);
    },
    disableSelectRemesa:function(){
        $('#selectRemesa').attr("disabled","disabled");
    },
    enableSelectRemesa:function(){
        $('#selectRemesa').prop("disabled", false);
    },
    disableBoxRemesa:function(){
        $("#idRemesasBox").addClass('hide');
    },
    enableBoxRemesa:function(){
        $("#idRemesasBox").removeClass('hide');
    },
    disableTableToSave:function(){
        $("#tableToSave").addClass('hide');
    },
    enableTableToSave:function(){
        $("#tableToSave").removeClass('hide');
    },
    disableResponseSearch:function(){
        $("#responseSearch").addClass('hide');
    },
    enableResponseSearch:function(){
        $("#responseSearch").removeClass('hide');
    },
    enableSaveSelected:function(){
        $("#saveSelected").prop("disabled", false);
    },
    disableSaveSelected:function(){
        $('#saveSelected').prop("disabled",true);
    },
    /****************** /js/loading-actions ******************/
        disableConatinerLoading:function(){
            loadingActions.disableLoading(operacionRemesas.idLoadingMain);
        },
        enableConatinerLoading:function(){
            loadingActions.enableLoading(operacionRemesas.idLoadingMain);
        },
        customAniamtionLoader:function(timeDelay){
            loadingActions.customAniamtionLoader(timeDelay,operacionRemesas.idLoadingMain);
        },disableConatinerLoadingModal:function(){
        loadingActions.disableLoading(operacionRemesas.idLoadingModalToSave);
        },
        enableConatinerLoadingModal:function(){
            loadingActions.enableLoading(operacionRemesas.idLoadingModalToSave);
        },
    /*********************************************************/
    updateMontoValidado: function(impValidado,impCurrent,operacion){

        if(operacion == 1){
            var reloadMontoValidado = impValidado + impCurrent;
            // var reloadMontoValidado = impCurrent;
            //calculo disponible
            var disponibleReload = operacionRemesas.getParseToFloat("disponibleSpan") - impCurrent;
        }else{
            var reloadMontoValidado = impValidado - impCurrent;
            //calculo disponible
            var disponibleReload = operacionRemesas.getParseToFloat("disponibleSpan") + impCurrent;
        }



        var reloadMontoValidadoFormat = '$ '+reloadMontoValidado.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var reloadMontoDisponibleFormat = '$ '+disponibleReload.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        $("#validadoSpan").text(reloadMontoValidadoFormat);
        $("#disponibleSpan").text(reloadMontoDisponibleFormat);

        operacionRemesas.setAttrRemesaSelect('data-validado',reloadMontoValidadoFormat);
        operacionRemesas.setAttrRemesaSelect('data-disponible',reloadMontoDisponibleFormat);

        //actualizo la clase del box remesa si es necesario
        var porcentajeDisponible = (operacionRemesas.getParseToFloat("disponibleSpan")/operacionRemesas.getParseToFloat("montoremesaSpan"))*100;

        if(porcentajeDisponible>=50){
            operacionRemesas.changeclassRemesasBox('label-success');
        }else if(porcentajeDisponible>=20){
            operacionRemesas.changeclassRemesasBox('label-warning');
        }else if(porcentajeDisponible>=0){
            operacionRemesas.changeclassRemesasBox('label-danger');
        }else if(porcentajeDisponible< 0){
            operacionRemesas.changeclassRemesasBox('label-danger');
        }else{
            operacionRemesas.changeclassRemesasBox('label-info');
        }

        return reloadMontoValidadoFormat;
    },
    updateMontoUsado: function(){

        var reloadMontoUsado = operacionRemesas.getParseToFloat("montoremesaSpan") - operacionRemesas.getParseToFloat("disponibleSpan");
        var reloadMontoUsadoFormat = '$ '+reloadMontoUsado.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $("#usadoSpan").text(reloadMontoUsadoFormat);

        operacionRemesas.setAttrRemesaSelect('data-usado',reloadMontoUsadoFormat);

        return reloadMontoUsadoFormat;
    },
    resetMontoValidado: function(){

        var reloadMontoValidado = 0;
        var reloadMontoValidadoFormat = '$ '+reloadMontoValidado.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $("#validadoSpan").text(reloadMontoValidadoFormat);
        operacionRemesas.setAttrRemesaSelect('data-validado',reloadMontoValidadoFormat);
        return reloadMontoValidadoFormat;
    },
    renameTitle:function(name){
        $(".grid-title").text(name)
    },
    //Metodo Inicial
    init: function () {
        operacionRemesas.getCvtraEmpleado();
        operacionRemesas.renameTitle('Anticipos');
        operacionRemesas.renderGrid(jsondata);
        operacionRemesas.generateLayout();
        operacionRemesas.generateLayoutRevision();
        operacionRemesas.onChangeFilterConcepto();
        operacionRemesas.onChangeFilterRegional();
        operacionRemesas.onClickDetail();
        // operacionRemesas.onClickZip();
        operacionRemesas.disableGenerarLayout();
        operacionRemesas.onChageRemesa();
        $("#conatinerLoading").hide();
        operacionRemesas.inputTypeNumber();
        operacionRemesas.inputTypeAlphanumber();
        operacionRemesas.checkAllToSend();
        operacionRemesas.findGastos();
        operacionRemesas.onPlusClick();
        operacionRemesas.onClickcheckToSave();
        operacionRemesas.onClickSaveSelected();


    },// fin init
    renderGrid: function (data) {

        // var jsondata = $("#jsondata").val();
        // jsondata = $.parseJSON(jsondata);
        var lastsel2;
        var lastStatus = "";
        var alto = $(document).height();
        var alto = $(document).height();
        var ancho = $(document).width();
        var grid = $('#jqGridRemesaOperacion').jqGrid({
            datatype: "local",
            data: jsondata,
            autowidth: true,
            shrinkToFit: false,
            height: 245,
            colNames:[
                'ID',
                'Núm. Caso',
                'Núm. Inventario',
                'Regional',
                'No. Lote',
                'Folio (consecutivo)',
                'Fecha recepción',
                'Anticipo',
                'Remesas',
                '',
                'Concepto',
                'Estatus',
                'Comentarios',
                'Importe',
                'Recargos',
                'Importe IVA',
                'Otros',
                'Total pagado',
                'Fecha de pago',
                'Periodo inicio de pago',
                'Periodo fin de pago',
                'RFC dependencia',
                'Nombre del deudor',
                'Calificación',
                'No. Comprobante o factura',
                'No. GPS',
                'Nombre dependencia',
                'UIDD/ Folio fiscal',
                'Responsable',
                'Gestor o broker',
                'No. Cuenta',
                'No. GPS 2',
                'Tipo de alta',
                'Tipo de pago',
                'Origen',
                'Empresa',
                'Cuenta contable',
                'Estatus propiedad',
                'venta_fec_consumada_contable',
                'Tipo de documento',
                'Consecutivo',
                'Renombrar documento',
                'ESTATUSLAYOUT',
                'Documentos',
            ],
            colModel: [
                {label: 'IDREMESAPGOSERVCARTERA', name: 'IDREMESAPGOSERVCARTERA',editable: false,key:true, hidden:true  },
                {label: 'IDGASTOMAIN', name: 'IDGASTOMAIN',editable: false,width:'60px',align:"right",searchoptions:{sopt: ['cn']}},
                {label: 'FCCREDITOCARTERA', name: 'FCCREDITOCARTERA',editable: false,width:'60px'},
                {label: 'REGIONAL', name: 'REGIONAL',editable: false,width:'90px', stype: 'select',searchoptions:{ sopt:['eq'], value: operacionRemesas.filtroSelectOptionsRegional }},
                {label: 'NO_LOTE', name: 'NO_LOTE',editable: false ,width:'40px',align:"right" },
                {label: 'CONSECUTIVO', name: 'CONSECUTIVO',editable: false ,width:'70px',align:"right" },
                {label: 'FECHARECEPCION', name: 'FECHARECEPCION',editable: false,width:'60px',align:"center"  },
                {label: 'ANTICIPO', name: 'ANTICIPO',editable: false,width:'60px'  },
                {label: 'NOM_REMESA', name: 'NOM_REMESA',editable: false,width:'100px'},
                {label: 'DETALLE', name: 'DETALLE',editable: false,width:'70px',align:"center",hidden:true},
                {label: 'CONCEPTOREMESA', name: 'CONCEPTOREMESA',editable: false,width:'80px', stype: 'select',searchoptions:{ sopt:['eq'], value: operacionRemesas.filtroSelectOptionsConceptos }},
                {label: 'ESTATUS', name: 'ESTATUS',editable: true,width:'90px', edittype:"select",editoptions:{value:"ER:En revision;V:Validado;R:Rechazado"}, stype: 'select',searchoptions:{ sopt:['eq'], value: operacionRemesas.filtroSelectOptionsEstatus }  },
                {label: 'COMENTARIO', name: 'COMENTARIO', editable: true/*,edittype:"textarea", editoptions:{rows:"2",cols:"10"}*/},
                {label: 'FNIMPORTECOMPROBA', name: 'FNIMPORTECOMPROBA', editable: false,width:'60px',align:"right",align:"right",sorttype: 'integer'},
                {label: 'RECARGOS', name: 'RECARGOS',editable: false,width:'60px',align:"right",sorttype: 'integer'},
                {label: 'FNIMPIVA', name: 'FNIMPIVA',editable: false,width:'60px',align:"right",sorttype: 'integer'},
                {label: 'FNOTROSIMPUEST', name: 'FNOTROSIMPUEST',editable: false,width:'60px',align:"right",sorttype: 'integer'},
                {label: 'FNTOTAL', name: 'FNTOTAL',editable: false,width:'60px',align:"right",sorttype: 'integer'},
                {label: 'FDFECREALPAGO', name: 'FDFECREALPAGO',editable: false,width:'60px',sorttype: 'date',align:"center"},
                {label: 'FDFECSERVPAGADODEL', name: 'FDFECSERVPAGADODEL',editable: false,width:'60px',align:"center"},
                {label: 'FDFECSERVPAGADOAL', name: 'FDFECSERVPAGADOAL',editable: false,width:'60px',align:"center"},
                {label: 'FCRFC', name: 'FCRFC',editable: false},
                {label: 'NOMBREDEUDOR', name: 'NOMBREDEUDOR',editable: true  },
                {label: 'CALIFICACION', name: 'CALIFICACION',editable: true  },
                {label: 'NOFACTURA', name: 'NOFACTURA',editable: true},
                {label: 'NOGPS', name: 'NOGPS',editable: true},
                {label: 'NOMBREDEPENDENCIA', name: 'NOMBREDEPENDENCIA',editable: true},
                {label: 'UUID', name: 'UUID',editable: false},
                {label: 'RESPONSABLE', name: 'RESPONSABLE',editable: true},
                {label: 'GESTOR', name: 'GESTOR',editable: true},
                {label: 'NOCUENTA', name: 'NOCUENTA',editable: true},
                {label: 'NOGPS2', name: 'NOGPS2',editable: true},
                {label: 'TIPOALTA', name: 'TIPOALTA',editable: true},
                {label: 'TIPOPAGO', name: 'TIPOPAGO',editable: true},
                {label: 'ORIGEN', name: 'ORIGEN',editable: true},
                {label: 'EMPRESA', name: 'EMPRESA',editable: true},
                {label: 'CTACONTABLE', name: 'CTACONTABLE',editable: true},
                {label: 'STATUSPROPIEDAD', name: 'STATUSPROPIEDAD',editable: true},
                {label: 'VENTACONSUMADA', name: 'VENTACONSUMADA',editable: true},
                {label: 'TIPODOCUMENTO', name: 'TIPODOCUMENTO',editable: true},
                {label: 'CONSECUTIVOBANCO', name: 'CONSECUTIVOBANCO',editable: true},
                {label: 'RENOMBRARDOCUMENTO', name: 'RENOMBRARDOCUMENTO',editable: true},
                {label: 'ESTATUSLAYOUT', name: 'ESTATUSLAYOUT',editable: false, hidden:true  },
                {label: 'ZIP', name: 'ZIP',editable: false,align:"center"  },
            ],
            subGrid: true,
            subGridOptions: {
                "plusicon"  : "ui-icon-triangle-1-e",
                "minusicon" : "ui-icon-triangle-1-s",
                "openicon"  : "ui-icon-arrowreturn-1-e"
            },
            subGridRowExpanded: function(subgrid_id, row_id) {
                var subgrid_table_id = subgrid_id+"_t";
                var pager_id = "p_"+subgrid_table_id;
                $("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
                $("#"+subgrid_table_id).jqGrid({
                    datatype: "local",
                    data: jsondataDetail[row_id],
                    colNames: ['Fecha movimiento','No. Lote','Remesa','Estatus','Co. Estatus','Comentario','Empleado','IDREMESALAYOUT','IDREMESAPGOSERVCARTERA'],
                    colModel: [
                        {name:"FECHAMOVIMIENTO",index:"FECHAMOVIMIENTO",align:"center"},
                        {name:"NO_LOTE",index:"NO_LOTE",align:"right"},
                        {name:"NOM_REMESA",index:"NOM_REMESA",align:"left"},
                        {name:"ESTATUS",index:"ESTATUS",align:"left"},
                        {name:"COESTATUS",index:"COESTATUS",hidden:true},
                        {name:"COMENTARIO",index:"COMENTARIO"},
                        {name:"EMPLEADOMOVIMIENTO",index:"EMPLEADOMOVIMIENTO"},
                        {name:"IDREMESALAYOUT",index:"IDREMESALAYOUT",key:true,align:"right",sortable:false,hidden:true},
                        {name:"IDREMESAPGOSERVCARTERA",index:"IDREMESAPGOSERVCARTERA",align:"right",sortable:false,hidden:true}
                    ],
                    rowNum:20,
                    pager: pager_id,
                    sortname: 'num',
                    sortorder: "asc",
                    height: '100%'
                });
                $("#"+subgrid_table_id).setGridParam({ data: jsondataDetail[row_id] });
                $("#"+subgrid_table_id).trigger("reloadGrid");
                $("#"+subgrid_table_id).setGridParam({ data: jsondataDetail[row_id] });
                $("#"+subgrid_table_id).trigger("reloadGrid");

            },
            onSelectRow: function(id,data){

                // var rowData = $("#jqGridRemesaOperacion").getRowData(id);

                if(operacionRemesas.getCOEstatusRow(id)!= 'LG'){
                    if(operacionRemesas.isAnyRemesaSelected()){//solo si tienen una remesa seleccionada podra evaluar
                        $('#jqGridRemesaOperacion').jqGrid('restoreRow',lastsel2);
                        $('#jqGridRemesaOperacion').jqGrid('editRow',id,operacionRemesas.getEditParameters(id));
                        // $('#jqGridRemesaOperacion').jqGrid('editRow',id,true);
                        $(".editable").css("width","90%");
                        lastsel2=id;
                    }else{
                        operacionRemesas.modalMensaje('Alerta!', 'Si desea evaluar deberá seleccionar una remesa o deberá especificar una regional y un concepto.', 'type-warning', 'Ok','btn-info');
                    }
                }


            },
            loadComplete: function(data) {
                operacionRemesas.calculateSizeTableJQGridAuto(this);//this el el objeto de la tabla
            },
            viewrecords: true,
            rowNum: 500,
            pager: "#jqGridjqGridRemesaOperacion",
            sortorder: "asc"
        });

        $('#jqGridRemesaOperacion').jqGrid('filterToolbar', {searchOperators: false, stringResult: true, searchOnEnter: false, defaultSearch: "cn"});

        $("#jqGridRemesaOperacion").jqGrid('bindKeys');

        //centra la tabla en Mi pendulum
        $("#gbox_jqGridRemesaOperacion").css("margin-left","-8px");
        //*****/
        // $("#jqGridRemesaOperacion").setGridParam({ data: data });
        // $("#jqGridRemesaOperacion").trigger("reloadGrid");


    },
    getSelectedRows:function (){

        operacionRemesas.idsSelected = $("#jqGridRemesaOperacion").getGridParam('selarrrow');
        operacionRemesas.arrayLayout = [];
        var flag = false;
        var flagRequired = false;
        var msjAlert = "";
        var msjAlertRequeried = "";
        if($('.cbox').is(':checked')){
            $.each(operacionRemesas.idsSelected,function(i,item){
                $('#jqGridRemesaOperacion').jqGrid('restoreRow',operacionRemesas.idsSelected[i]);
                var rowData = $("#jqGridRemesaOperacion").getRowData(operacionRemesas.idsSelected[i]);

                if($('#selectRemesa_'+operacionRemesas.idsSelected[i]).val() != 0){
                    rowData['REMESA'] = $('#selectRemesa_'+operacionRemesas.idsSelected[i]).val();
                    operacionRemesas.arrayLayout.push( rowData );
                }else{
                    flag = true;
                    msjAlert += '-'+rowData['FCCREDITOCARTERA']+'\n';
                }

                if(($("#"+operacionRemesas.idsSelected[i]+"_NOMBREDEUDOR").val() == "" || rowData['NOMBREDEUDOR'] == "")){
                    flagRequired = true;
                    msjAlertRequeried += '-'+rowData['FCCREDITOCARTERA']+'\n';
                }
            });

            if(flag){
                operacionRemesas.modalMensaje('Alerta!', 'Seleccione una remesa para la(s) cuenta(s): \n'+msjAlert, 'type-danger', 'Ok','btn-info');
                return false;
            }else if(flagRequired){
                operacionRemesas.modalMensaje('Alerta!', 'Debe completar los campos obligatorios para la(s) cuenta(s): \n'+msjAlertRequeried, 'type-danger', 'Ok','btn-info');
                return false;
            }
        }else{
            operacionRemesas.modalMensaje('Alerta!', 'Seleccione una cuenta.', 'type-danger', 'Ok','btn-info');
            return false;
        }

        return operacionRemesas.arrayLayout;

    },
    ajaxMethod:function (parametros) {
        //Envio Post
        $.ajax({
            type: parametros.type,
            url: parametros.url,
            dataType: parametros.dataType,
            // async : false,
            data: { data:parametros.data,
                    cvtraEmpleado:operacionRemesas.getCvtraEmpleado() ,
                    remesaSelect:operacionRemesas.getRemesaSelect(),
                    regionalSelect:operacionRemesas.getAttrRemesaSelect("data-regional"),
                    conceptoSelect:operacionRemesas.getAttrRemesaSelect("data-concepto")
            }  ,
            beforeSend: function () {
                parametros.before(parametros);
            },
            success: function(json) {
                parametros.success(json,parametros);
            },
            fail:function (e) {
                console.log("-Error: "+e);
            }
        });
    },
    generateLayout: function(){
        $("#generateLayout").on('click', function () {
                if($("#selectRemesa").val() != 0){
                    if(operacionRemesas.getParseToFloat("disponibleSpan") >= 0){
                        operacionRemesas.closeAllDetail();
                        var canGenerate = operacionRemesas.validateStatusV();
                            if(canGenerate){
                                var result = operacionRemesas.getDataCurrentPage();
                                if (Array.isArray(result)){
                                    var resultJson = JSON.stringify(result);
                                    operacionRemesas.parametrosAjax.type='POST';
                                    operacionRemesas.parametrosAjax.url=baseUrl+'/remesas/index/generar-layout';
                                    operacionRemesas.parametrosAjax.dataType='json';
                                    operacionRemesas.parametrosAjax.data=resultJson;
                                    operacionRemesas.parametrosAjax.before = function(datos){
                                        operacionRemesas.enableConatinerLoading();
                                    }
                                    operacionRemesas.parametrosAjax.success = function(json,datos){
                                        window.location = baseUrl+'/remesas/index/generar-archivo-layout/NO_LOTE/'+json.no_lote;
                                        $('#jqGridRemesaOperacion').jqGrid('setGridParam', {data: json.information}).trigger('reloadGrid', [{page: 1}]);
                                        jsondataDetail = json.informationDetail;
                                        operacionRemesas.disableConatinerLoading();
                                        /*actualizo valores en el cuadro informativo*/
                                        operacionRemesas.updateMontoUsado();
                                        operacionRemesas.resetMontoValidado();
                                        operacionRemesas.modalMensaje('Mensaje', 'Se genero el layout correctamente', 'type-success', 'Ok','btn-info');
                                    }
                                    operacionRemesas.ajaxMethod(operacionRemesas.parametrosAjax);
                                }
                        }else{
                            operacionRemesas.modalMensaje('Alerta!', 'Debe validar al menos un registro.', 'type-warning', 'Ok','btn-info');
                        }

                    }else{
                        operacionRemesas.modalMensaje('Alerta!', 'El monto que desea comprobar es mayor a lo disponible en la remesa.', 'type-warning', 'Ok','btn-info');
                    }
                }else{
                    operacionRemesas.modalMensaje('Alerta!', 'Debe seleccionar una remesa.', 'type-warning', 'Ok','btn-info');
                }

        });

    },
    validateLayout: function(){
        $("#validateLayout").on('click', function () {
                var result = operacionRemesas.getSelectedRows();
                if (Array.isArray(result)){
                    var resultJson = JSON.stringify(result);
                    operacionRemesas.parametrosAjax.type='POST'
                    operacionRemesas.parametrosAjax.url=baseUrl+'/remesas/index/validar-layout',
                    operacionRemesas.parametrosAjax.dataType='json'
                    operacionRemesas.parametrosAjax.data=resultJson
                    operacionRemesas.parametrosAjax.before = function(datos){
                        operacionRemesas.enableConatinerLoading();
                    }
                    operacionRemesas.parametrosAjax.success = function(json,datos){
                        $('#jqGridRemesaOperacion').jqGrid('setGridParam', {data: json.information}).trigger('reloadGrid', [{page: 1}]);
                        jsondataDetail = json.informationDetail;
                        operacionRemesas.disableConatinerLoading();
                        operacionRemesas.modalMensaje('Mensaje', 'Se valido la información correctamente', 'type-success', 'Ok','btn-info');
                    }
                    operacionRemesas.ajaxMethod(operacionRemesas.parametrosAjax);
                }


        });

    },
    rejectLayout: function(){
        $("#rejectLayout").on('click', function () {
                var result = operacionRemesas.getSelectedRows();
                if (Array.isArray(result)){
                    var resultJson = JSON.stringify(result);
                    operacionRemesas.parametrosAjax.type='POST'
                    operacionRemesas.parametrosAjax.url=baseUrl+'/remesas/index/rechazar-layout',
                    operacionRemesas.parametrosAjax.dataType='json'
                    operacionRemesas.parametrosAjax.data=resultJson
                    operacionRemesas.parametrosAjax.before = function(datos){
                        operacionRemesas.enableConatinerLoading();
                    }
                    operacionRemesas.parametrosAjax.success = function(json,datos){
                        $('#jqGridRemesaOperacion').jqGrid('setGridParam', {data: json.information}).trigger('reloadGrid', [{page: 1}]);
                        jsondataDetail = json.informationDetail;
                        operacionRemesas.disableConatinerLoading();
                        operacionRemesas.modalMensaje('Mensaje', 'Se rechazó la información correctamente', 'type-success', 'Ok','btn-info');
                    }
                    operacionRemesas.ajaxMethod(operacionRemesas.parametrosAjax);
                }


        });

    },
    modalMensaje: function (titulo1, mensaje, type, labelBtn,classBtn) {

        BootstrapDialog.show({
            title: titulo1,
            message: mensaje,
            cssClass: '',
            type: type,
            size: 'size-normal',
            closable: true,
            spinicon: 'glyphicon glyphicon-eur',
            buttons: [
                        {
                            id: 'btn-ok',
                            icon: 'glyphicon glyphicon-check',
                            label: labelBtn,
                            cssClass: classBtn,
                            autospin: false,
                            action: function (dialog) {
                                        dialog.close();
                                    }
                        }
                      ]
        });

    },
    getDataCurrentPage:function(){
        operacionRemesas.arrayLayout = [];
        var ind = 1;
        $("#jqGridRemesaOperacion tbody>tr.ui-widget-content").each(function(){
             var idTr = $(this).attr('id');
            if(operacionRemesas.getEstatusRow(idTr) == "VALIDADO" ||
               operacionRemesas.getEstatusRow(idTr) == "Validado"
            ){
                $("#jqGridRemesaOperacion").getRowData(idTr);
                operacionRemesas.arrayLayout.push($("#jqGridRemesaOperacion").getRowData(idTr));
            }
            ind++

        });
        return operacionRemesas.arrayLayout;
    },
    validateStatusV:function(){

        var ind = 1;
        var flag = false;
        $("#jqGridRemesaOperacion tbody>tr.ui-widget-content").each(function(){
            var idTr = $(this).attr('id');

            if(operacionRemesas.getEstatusRow(idTr) == "VALIDADO" ||
               operacionRemesas.getEstatusRow(idTr) == "Validado"
            ){
                flag = true
            }
            ind++;
        });

        return flag;
    },
    validateStatusER:function(){

        var ind = 1;
        var flag = false;
        $("#jqGridRemesaOperacion tbody>tr.ui-widget-content").each(function(){
            var idTr = $(this).attr('id');

            if(operacionRemesas.getEstatusRow(idTr) == "EN REVISION" ||
               operacionRemesas.getEstatusRow(idTr) == "En revision"
            ){
                flag = true
            }
            ind++;
        });

        return flag;
    },
    onChangeFilterRegional:function(){
        $("#gs_REGIONAL").on("change",function(){
            if(!operacionRemesas.flagFitroRemesa){
                var flag = 0;
                var regionalRemesa = $("#gs_REGIONAL").val();
                var conceptoRemesa = $("#gs_CONCEPTOREMESA").val();
                if(regionalRemesa=="" && conceptoRemesa==""){
                    operacionRemesas.resetSelectRemesa();
                    operacionRemesas.disableGenerarLayout();
                    operacionRemesas.disableGenerarLayoutRevision();
                    operacionRemesas.enableSelectRemesa();
                    operacionRemesas.disableBoxRemesa();
                    operacionRemesas.flagFitrosRegCon=false;
                }else{
                    $("#selectRemesa option").each(
                        function(){
                            if($(this).attr("data-regional")== regionalRemesa && (conceptoRemesa =="" || $(this).attr("data-concepto") == conceptoRemesa)){

                                if($(this).attr("data-regional")== regionalRemesa && $(this).attr("data-concepto") == conceptoRemesa){
                                    $(this).removeClass('hide');
                                    if(flag == 0){
                                        $(this).attr('selected', 'selected');
                                        flag++;
                                    }
                                    operacionRemesas.enableGenerarLayout();
                                    operacionRemesas.enableGenerarLayoutRevision();
                                    operacionRemesas.enableSelectRemesa();
                                }else if(conceptoRemesa == ""){
                                    operacionRemesas.disableGenerarLayout();
                                    operacionRemesas.disableGenerarLayoutRevision();
                                    operacionRemesas.resetSelectRemesa();
                                    operacionRemesas.disableSelectRemesa();
                                    operacionRemesas.disableBoxRemesa();
                                }

                            }else{
                                if(flag == 0) {
                                    $('option:selected', this).remove();
                                }
                                $(this).addClass('hide');

                            };
                        });
                    //si no coincide con ninguno reinicio el select
                    if(flag==0){
                        operacionRemesas.disableBoxRemesa();
                        operacionRemesas.disableGenerarLayout();
                        operacionRemesas.disableGenerarLayoutRevision();
                        operacionRemesas.resetSelectRemesa();
                        operacionRemesas.disableSelectRemesa();
                    }

                    if(flag == 0 & (conceptoRemesa!="" && regionalRemesa!="")){
                        operacionRemesas.modalMensaje('Alerta!', 'No existe una remesa con la combinacion de región y concepto que seleccionó.', 'type-warning', 'Ok','btn-info');
                    }

                    operacionRemesas.flagFitrosRegCon=true;
                }

                operacionRemesas.reloadRemesaBox();
            }

        });


    },
    onChangeFilterConcepto:function(){
        $("#gs_CONCEPTOREMESA").on("change",function(){
            if(!operacionRemesas.flagFitroRemesa){
                var flag = 0;
                var conceptoRemesa = $("#gs_CONCEPTOREMESA").val();
                var regionalRemesa = $("#gs_REGIONAL").val();
                if(conceptoRemesa=="" && regionalRemesa==""){
                    operacionRemesas.resetSelectRemesa();
                    operacionRemesas.disableGenerarLayout();
                    operacionRemesas.disableGenerarLayoutRevision();
                    operacionRemesas.enableSelectRemesa();
                    operacionRemesas.disableBoxRemesa();
                    operacionRemesas.flagFitrosRegCon=false;
                }else{
                    $("#selectRemesa option").each(
                        function(){
                            if($(this).attr("data-concepto")== conceptoRemesa && (regionalRemesa =="" ||$(this).attr("data-regional") == regionalRemesa) ){

                                if($(this).attr("data-concepto")== conceptoRemesa && $(this).attr("data-regional") == regionalRemesa){
                                    $(this).removeClass('hide');
                                    if(flag == 0){
                                        $(this).attr('selected', 'selected');
                                        flag++;
                                    }
                                    operacionRemesas.enableGenerarLayout();
                                    operacionRemesas.enableGenerarLayoutRevision();
                                    operacionRemesas.enableSelectRemesa();
                                }else if(regionalRemesa == ""){
                                    operacionRemesas.disableGenerarLayout();
                                    operacionRemesas.disableGenerarLayoutRevision();
                                    operacionRemesas.resetSelectRemesa();
                                    operacionRemesas.disableSelectRemesa();
                                    operacionRemesas.disableBoxRemesa();
                                }

                            }else{

                                $('option:selected', this).remove();
                                $(this).addClass('hide');

                            };
                        });
                    //si no coincide con ninguno reinicio el select
                    if(flag==0){
                        operacionRemesas.disableBoxRemesa();
                        operacionRemesas.disableGenerarLayout();
                        operacionRemesas.disableGenerarLayoutRevision();
                        operacionRemesas.resetSelectRemesa();
                        operacionRemesas.disableSelectRemesa();
                    }

                    if(flag == 0 & (conceptoRemesa!="" && regionalRemesa!="")){
                        operacionRemesas.modalMensaje('Alerta!', 'No existe una remesa con la combinacion de región y concepto que seleccionó.', 'type-warning', 'Ok','btn-info');
                    }

                    operacionRemesas.flagFitrosRegCon=true;
                }

                operacionRemesas.reloadRemesaBox();
            }
        });


    },
    calculateSizeTableJQGridAuto: function (obj) {
        var rows = operacionRemesas.doHeightAutoTableJQGrid(obj,330);
        // var parent = $(obj).parent().parent().parent().parent().parent();

        // $(obj).find(".jqgrow:odd").css("background", "#D7D7D7");

        $('.ui-jqgrid, .ui-jqgrid-view, .ui-jqgrid-hdiv, .ui-jqgrid-bdiv, .ui-jqgrid-pager').css('width', '');

        $('.ui-jqgrid-htable').css('width', '100%');
        $('.ui-jqgrid-hbox').css('padding-right', '0');
        $('.ui-jqgrid-btable').css('width', '100%');

        // Agregar overflow scroll para que las columnas del header y los datos no se desfasen en la vista
        $('.ui-jqgrid-hdiv, .ui-jqgrid-bdiv, .ui-jqgrid-sdiv').css('overflow-y', 'scroll');
    },
    doHeightAutoTableJQGrid: function (obj,valueToMinus) {

        var windowHeight = $(window).height();
        var heightJqgrid = windowHeight - valueToMinus;

        $(obj).parent().parent().css('height', heightJqgrid+'px');

        $(window).resize(function(){
            var windowHeight = $(this).height();
            var heightJqgrid = windowHeight - valueToMinus;
            $(obj).parent().parent().css('height', heightJqgrid+'px');
        });
    },
    refreshDataDetail:function(id){
        operacionRemesas.parametrosAjax.type='POST';
        operacionRemesas.parametrosAjax.url=baseUrl+'/remesas/index/get-all-detail';
        operacionRemesas.parametrosAjax.dataType='json';
        operacionRemesas.parametrosAjax.data=jsondataDetail;
        operacionRemesas.parametrosAjax.before = function(datos){
            // operacionRemesas.enableConatinerLoading();
        };
        operacionRemesas.parametrosAjax.success = function(json,datos){
            jsondataDetail = json.informationDetail;
            // operacionRemesas.disableConatinerLoading();
        };
        operacionRemesas.ajaxMethod(operacionRemesas.parametrosAjax);
    },
    onClickDetail:function(){
        $(".sgcollapsed").on("click",function(){
            var detailId= "jqGridRemesaOperacion_"+$(this).parent().attr('id')+"_t";
            operacionRemesas.refreshDataDetail($(this).parent().attr('id'));
            $("#"+detailId).setGridParam({ data: jsondataDetail[$(this).parent().attr('id')] });
            $("#"+detailId).trigger("reloadGrid");
        });
    },
    refreshGrid: function(id,data) {
        setTimeout(function(){
            $("#"+id).jqGrid("clearGridData");
            if(data!=false){
                $("#"+id).setGridParam({ data: data });
                $("#"+id).trigger("reloadGrid");
            }
        }, 500);
    },
    onChageRemesa: function(){
        $("#selectRemesa").on("change",function(){
            if($("#selectRemesa").val() != 0){

                var optionSelected = $("#selectRemesa option:selected");
                var data = new Object();
                data.regional=optionSelected.attr("data-regional");
                data.concepto=optionSelected.attr("data-concepto");
                var dataJson = JSON.stringify(data);

                operacionRemesas.parametrosAjax.type='POST';
                operacionRemesas.parametrosAjax.url=baseUrl+'/remesas/index/get-information-by-regcon';
                operacionRemesas.parametrosAjax.dataType='json';
                operacionRemesas.parametrosAjax.data=dataJson;
                operacionRemesas.parametrosAjax.before = function(datos){
                    operacionRemesas.enableConatinerLoading();
                };
                operacionRemesas.parametrosAjax.success = function(json,datos){
                    if(operacionRemesas.flagFitrosRegCon==false) {//si estan activos los filtros de regional o conceptos no pasa al grid la informacion encontrada en la bd
                        $("#jqGridRemesaOperacion").jqGrid("clearGridData");
                        if(json.data!=false){
                                jsondataFilterRemesa[operacionRemesas.getRemesaSelect()] = json.data;
                                $("#jqGridRemesaOperacion").setGridParam({data: json.data});
                                operacionRemesas.enableGenerarLayout();
                                operacionRemesas.enableGenerarLayoutRevision();
                        }
                        operacionRemesas.flagFitroRemesa = true;
                    }
                    $("#jqGridRemesaOperacion").trigger("reloadGrid");
                    operacionRemesas.doHeightAutoTableJQGrid($("#jqGridRemesaOperacion"), 330);
                    // operacionRemesas.refreshGrid('jqGridRemesaOperacion',json.data);
                    jsondataDetail = json.dataDetail;
                    operacionRemesas.setAttrRemesaSelect('data-disponible',json.dataDisponible);
                    operacionRemesas.setAttrRemesaSelect('data-usado',json.dataUsado);
                    operacionRemesas.setAttrRemesaSelect('data-validado',json.dataValidado);
                    operacionRemesas.setAttrRemesaSelect('data-porcentaje',json.dataPorcentaje);
                    operacionRemesas.setAttrRemesaSelect('data-labelporcentaje',json.dataLabelporcentaje);
                    operacionRemesas.reloadRemesaBox();
                    operacionRemesas.importeValidadoActual = operacionRemesas.getParseToFloat("validadoSpan");
                    operacionRemesas.disableConatinerLoading();
                };
                operacionRemesas.ajaxMethod(operacionRemesas.parametrosAjax);

            }else{
                operacionRemesas.customAniamtionLoader(3);//3 egundoss
                // $("#conatinerLoading").fadeIn().delay(5000).fadeOut();
                operacionRemesas.disableBoxRemesa();
                operacionRemesas.flagFitroRemesa = false;
                operacionRemesas.disableGenerarLayout();
                operacionRemesas.disableGenerarLayoutRevision();
                //refresco grid con la informacion inicial
                operacionRemesas.refreshGrid('jqGridRemesaOperacion',jsondata);
            }



        });
    },
    reloadRemesaBox:function(){

        if($("#selectRemesa").val()!=0){
            operacionRemesas.enableBoxRemesa();
            var option = $("#selectRemesa option:selected");
            $("#montoremesaSpan").text(option.attr("data-montoremesa"));
            $("#disponibleSpan").text(option.attr("data-disponible"));
            $("#validadoSpan").text(option.attr("data-validado"));
            $("#usadoSpan").text(option.attr("data-usado"));
            $("#conceptoSpan").text(option.attr("data-concepto"));
            $("#tASpan").text(option.attr("data-tipoanticipo"));
            $("#vigenciaSpan").text(option.attr("data-vigencia"));
            operacionRemesas.changeclassRemesasBox(option.attr("data-labelporcentaje"));
        }else{
            operacionRemesas.disableBoxRemesa();
        }

    },
    changeclassRemesasBox: function (clasToChange){
        $("#idRemesasBox").removeClass('label-success');
        $("#idRemesasBox").removeClass('label-warning');
        $("#idRemesasBox").removeClass('label-danger');
        $("#idRemesasBox").addClass(clasToChange);
    },
    closeAllDetail: function(){
        $(".sgexpanded").trigger("click");
    },
    isAnyRemesaSelected:function(){
        if($("#selectRemesa").val() !=0 && $("#selectRemesa").is(':enabled')){
            return true;
        }else{
            return false;
        }
    },
    showMessageWarning: function (msg){
        $("#messageWarnig").html(msg).fadeIn(2000).delay(5000).fadeOut(2000);
    },
    resetSelectRemesa: function (){
        $("#selectRemesa option").each(
            function(){
                $(this).removeClass('hide');
            });
        $("#selectRemesa option:eq(0)").removeClass('hide');
        $("#selectRemesa option:eq(0)").prop("selected",true);
    },
    forceNumeric: function(){
        var $input = $(this);
        $input.val($input.val().replace(/[^\d]+/g,''));
    },
    forceAlphanumeric: function(){
        var $input = $(this);
        $input.val($input.val().replace(/[^a-zA-Z0-9]/g, ''));
    },
    inputTypeNumber: function(){
        $(document).on('propertychange input', '.onlyNumbers', operacionRemesas.forceNumeric);
    },
    inputTypeAlphanumber: function(){
        $(document).on('propertychange input', '.onlyAlphanumerics', operacionRemesas.forceAlphanumeric);
    },
    checkAllToSend:function(){
        $(document).on('click','#checkAllToSave',function(){
            var classToSend = $(this).attr('data-classtarget');
            if($(this).is(':checked')){
                $(classToSend).prop("checked",true);
                operacionRemesas.enableSaveSelected();
            }else{
                $(classToSend).prop("checked",false);
                operacionRemesas.disableSaveSelected();
            }

        });
    },
    onClickcheckToSave: function (){
        $(document).on("click",".checkToSave",function(){
            var flag = 0;
            $(".checkToSave").each(function(){
                if($(this).is(":checked")){
                    flag = 1;
                }
            });
            if(flag > 0){
                operacionRemesas.enableSaveSelected();
            }else{
                operacionRemesas.disableSaveSelected();
            }
        });
    },
    findGastos: function(){
        $("#btnFind").off('click').on('click', function () {
            if(operacionRemesas.getGastoToSearch() || operacionRemesas.getCuentaToSearch() != ""){
                var data = new Object();

                data.gasto=operacionRemesas.getGastoToSearch();
                data.cuenta=operacionRemesas.getCuentaToSearch();
                var dataJson = JSON.stringify(data);

                operacionRemesas.parametrosAjax.type='POST';
                operacionRemesas.parametrosAjax.url=baseUrl+'/remesas/index/find-gasto-to-save';
                operacionRemesas.parametrosAjax.dataType='json';
                operacionRemesas.parametrosAjax.data=dataJson;
                operacionRemesas.parametrosAjax.before = function(datos){
                    operacionRemesas.enableConatinerLoadingModal();
                };
                operacionRemesas.parametrosAjax.success = function(json,datos){
                    if(json.htmlToAdd !=""){
                        $("#tableToSave tbody tr").remove();
                        $("#tableToSave tbody").append(json.htmlToAdd);
                        operacionRemesas.enableTableToSave();
                        operacionRemesas.disableResponseSearch();
                    }else{
                        operacionRemesas.enableResponseSearch();
                        $("#responseSearch").text(json.msj);
                        operacionRemesas.disableTableToSave();
                    }

                    operacionRemesas.disableConatinerLoadingModal();
                    operacionRemesas.disableSaveSelected();
                };
                operacionRemesas.ajaxMethod(operacionRemesas.parametrosAjax);

            }else{
                $("#rulesToSend").addClass("parpadea");
                setTimeout(function(){
                    $("#rulesToSend").removeClass("parpadea");
                }, 3000);
            }

        });

    },
    onPlusClick:function () {
        $(document).on("click","#createSpend",function(){
            operacionRemesas.setGastoToSearch("");
            operacionRemesas.setCuentaToSearch("");
            operacionRemesas.disableTableToSave();
            operacionRemesas.disableResponseSearch();
            operacionRemesas.disableSaveSelected();
        });
    },
    onClickSaveSelected: function(){
        $("#saveSelected").off('click').on("click",function(){
            var flag = false;
            var nuevo = new Object;
                nuevo.gastoToSearch = operacionRemesas.getGastoToSearch();
                nuevo.cuentaToSearch = operacionRemesas.getCuentaToSearch();
                nuevo.gastos = new Array;

            $(".checkToSave").each(function(){
                if($(this).is(":checked")){
                    nuevo.gastos.push($(this).val());
                    flag =true;
                }
            });
            var dataJson = JSON.stringify(nuevo);

            if(flag){
                operacionRemesas.parametrosAjax.type='POST';
                operacionRemesas.parametrosAjax.url=baseUrl+'/remesas/index/refresh-data-anticipos-by-gasto';
                operacionRemesas.parametrosAjax.dataType='json';
                operacionRemesas.parametrosAjax.data=dataJson;
                operacionRemesas.parametrosAjax.before = function(datos){
                    operacionRemesas.enableConatinerLoadingModal();
                    operacionRemesas.disableSaveSelected();
                };
                operacionRemesas.parametrosAjax.success = function(json,datos){
                    $(".checkToSave").each(function(){
                        if($(this).is(":checked")){
                            //actualizo el json principal jsondata
                            json.response[$(this).val()].forEach(function(element) {
                                jsondata.push(element)
                            });
                            nuevo.gastos.push($(this).val());
                        }
                        //si estoy trabajando con los filtros de manera local
                        if(!operacionRemesas.flagFitroRemesa){
                            //refresco grid con la informacion inicial
                            operacionRemesas.disableTableToSave();
                            //muestro mensaje de exito
                            $("#responseSearch").removeClass('hide').removeClass('alert-primary').addClass('alert-success').text(json.msg);
                            //espero 3 segundos para cerrar el modal y refrescar el grid
                            setTimeout(function(){
                                $(".btnCerrar").trigger("click");
                                $("#responseSearch").removeClass('alert-success').addClass('alert-primary').addClass('hide');

                            },3000);
                            operacionRemesas.refreshGrid('jqGridRemesaOperacion',jsondata);

                        }else{
                            //refresco grid con la informacion inicial
                            if($(this).is(":checked")){
                                //recorro los gastos seleccionados para ver si coinciden en su combinacion de Regional-Concepto y de ser asi
                                //ingresar la informacion al grid
                                console.log($(this).attr('data-regional'));
                                console.log($(this).attr('data-concepto'));
                                if($(this).attr('data-regional')== operacionRemesas.getAttrRemesaSelect('data-regional') &&
                                   $(this).attr('data-concepto')== operacionRemesas.getAttrRemesaSelect('data-concepto')
                                ){
                                    //agrego a la tabla con addRow
                                    json.response[$(this).val()].forEach(function(element) {
                                        jsondataFilterRemesa[operacionRemesas.getRemesaSelect()].push(element)
                                    });
                                }
                            }
                            operacionRemesas.disableTableToSave();
                            //muestro mensaje de exito
                            $("#responseSearch").removeClass('hide').removeClass('alert-primary').addClass('alert-success').text(json.msg);
                            setTimeout(function(){
                                $(".btnCerrar").trigger("click");
                                $("#responseSearch").removeClass('alert-success').addClass('alert-primary').addClass('hide');
                            },3000);
                            setTimeout(function(){
                                operacionRemesas.refreshGrid('jqGridRemesaOperacion',jsondataFilterRemesa[operacionRemesas.getRemesaSelect()]);
                            },500);

                        }

                    });
                    console.log(json);
                    /*if(json.htmlToAdd !=""){
                        $("#tableToSave tbody tr").remove();
                        $("#tableToSave tbody").append(json.htmlToAdd);
                        operacionRemesas.enableTableToSave();
                        operacionRemesas.disableResponseSearch();
                    }else{
                        operacionRemesas.enableResponseSearch();
                        $("#responseSearch").text(json.msj);
                        operacionRemesas.disableTableToSave();
                    }*/

                    operacionRemesas.disableConatinerLoadingModal();
                };
                operacionRemesas.ajaxMethod(operacionRemesas.parametrosAjax);
            }

        });
    },
    generateLayoutRevision: function(){
        $("#generateLayoutRevision").on('click', function () {
            if($("#selectRemesa").val() != 0){
                operacionRemesas.closeAllDetail();
                var canGenerate = operacionRemesas.validateStatusER();
                if(canGenerate){
                    var result = operacionRemesas.getDataCurrentPage();
                    if (Array.isArray(result)){
                        window.location = baseUrl+'/remesas/index/generar-archivo-layout-revision/regionalSelect/'+operacionRemesas.getAttrRemesaSelect("data-regional")+'/conceptoSelect/'+operacionRemesas.getAttrRemesaSelect("data-concepto");
                    }
                }else{
                    operacionRemesas.modalMensaje('Alerta!', 'Debe cambiar al menos un registro a estatus "En revision".', 'type-warning', 'Ok','btn-info');
                }
            }else{
                operacionRemesas.modalMensaje('Alerta!', 'Debe seleccionar una remesa.', 'type-warning', 'Ok','btn-info');
            }


        });

    }


};
operacionRemesas.init();
//
