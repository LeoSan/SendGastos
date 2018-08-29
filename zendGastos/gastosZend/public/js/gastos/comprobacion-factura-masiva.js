var ComprobacionPantallaFactura = {

    init : function() {

        ComprobacionPantallaFactura.renderGrid();
        ComprobacionPantallaFactura.renderGridPV();
        ComprobacionPantallaFactura.msjActivador();
        ComprobacionPantallaFactura.activamodal();
        ComprobacionPantallaFactura.respBusqueda();
        ComprobacionPantallaFactura.respBusquedaPV();
        ComprobacionPantallaFactura.mostrarFiltros();
        $("#btnCargarXML").click(function(e){
            var numEmpleado = $("#noEmpleado").html();
            var emailEmpleado = $("#email").html();
            var formData = new FormData();
            formData.append('file_xml', $('#file_xml')[0].files[0]);
            var url = baseUrl + '/gastos/comprobacionfactura/uploadfile?numEmpleado='+numEmpleado+"&emailEmpleado="+emailEmpleado;
            $.ajax({
                url: url,
                type: 'POST',
                data: formData, //el data es tu objeto formData
                processData: false, //indicas a jQuery que no procese la información
                contentType: false //indicas a jQuery que no configure el contentType del request
            }).done(function(data) {
                    data = $.parseJSON(data);
                if ( data.success == 'false' ) {
                    alert(data.msg);
                    $("#divMsjXML").show();
                    $("#msj_xml").html(data.msg);
                }
                if ( data.success == 'true' ) {
                    $(".sr-only").html('Exito:')
                    $("#divMsjXML").addClass('alert-success');
                    $("#divMsjXML").show();
                    $("#msj_xml").html(data.msg);
                }

            }).fail(function() {
                console.log("error");
            })

        });
    },
    renderGrid : function() {
        console.log('baseUrl :' + baseUrl);
        var pantalla = 'reporteplanviaje';
        var idUser = $("#idsolicitante").html();
        var detalle = '0';
        var grid = $('#jqGridList').jqGrid({
            url: baseUrl + '/gastos/comprobacionfactura/lista-carga-masiva',
            datatype: 'json',
            postData: {
                pantalla     : pantalla,
                idSol        : idUser,
                detalle      : detalle
            },
            autowidth: true,
            height: 200,
            ignoreCase: true,
            ondblClickRow: function (rowId) {
                // Archivo.showLoading();
//				var rowData = $(this).getRowData(rowId);
//				ConsultaInventario.renderElementDetail(rowData['IDDOCTO'],rowData['CREDITO']);
            },
            colNames:[
                'Caso',
                'Cuenta',
                'Concepto',
                'Fecha de registro',
                'Proveedor',
                'Comprobante',
                'Fact. Comprobantes',
                'Reporte'
            ],
            colModel: [
                { index: 'CASO',          name: 'CASO',          width: 30, searchoptions: { sopt: ["cn","eq"] }, align: "right", sorttype: "number" },
                { index: 'CUENTA',        name: 'CUENTA',       width: 70, searchoptions: { sopt: ["cn","eq"] } },
                { index: 'CONCEPTO',      name: 'CONCEPTO',      searchoptions: { sopt: ["cn","eq"] } },
                { index: 'FECHA_REGISTRO', name: 'FECHA_REGISTRO', width: 60, searchoptions: { sopt: ["cn","eq"] } },
                { index: 'NMPROVEEDOR', name: 'NMPROVEEDOR', searchoptions: { sopt: ["cn","eq"] } },
                { index: 'XML_INDI', name: 'XML_INDI', width: 60, searchoptions: { sopt: ["cn","eq"] } },
                { index: 'XML_MASIVO', name: 'XML_MASIVO', width: 60, searchoptions: { sopt: ["cn","eq"] } },
                { index: 'REPORTE',  name: 'REPORTE',  width: 70, searchoptions: { sopt: ["cn","eq"] } }
            ],
            rowNum: 200,
            loadonce: false,
            altRows: true,
            mtype: 'POST',
            gridview: false,
            pager: '#jqGridPagerList',
            sortname: 'CASO',
            sortorder: 'desc',
            viewrecords: true,
            rownumbers: true,
            caption:'',
            loadtext: 'Cargando informaci&oacute;n....',
            loadBeforeSend: function(xhr, settings){
                // Archivo.showLoading();
            },
            loadComplete: function(data) { // inicio loadComplete
                Archivo.hideLoading();
            } // fin loadComplete
        });
        $('#jqGridList').jqGrid('filterToolbar',{searchOperators: true, stringResult: true, searchOnEnter: false});
        $(".grid-title").html("Complemento Facturación");

    },
    renderGridPV : function() {
        console.log('baseUrl :' + baseUrl);
        var pantalla = 'reporteplanviaje';
        var idUser = $("#idsolicitante").html();
        var detalle = '0';
        var grid = $('#jqGridListPv').jqGrid({
            url: baseUrl + '/gastos/comprobacionfactura/lista-carga-masivapv',
            datatype: 'json',
            postData: {
                pantalla     : pantalla,
                idSol        : idUser,
                detalle      : detalle
            },
            autowidth: true,
            height: 200,
            ignoreCase: true,
            ondblClickRow: function (rowId) {
//              Archivo.showLoading();
//				var rowData = $(this).getRowData(rowId);
//				ConsultaInventario.renderElementDetail(rowData['IDDOCTO'],rowData['CREDITO']);
            },
            colNames:[
                'Caso',
                'Nombre Solicitante',
                'Comprobante',
                'Fact. Comprobantes',
                'Reporte'
            ],
            colModel: [

                { index: 'CASO',          name: 'CASO',          width: 30, searchoptions: { sopt: ["cn","eq"] }, align: "right", sorttype: "number" },
                { index: 'NOMBRE_SOLICITANTE', name: 'NOMBRE_SOLICITANTE', searchoptions: { sopt: ["cn","eq"] } },
                { index: 'XML_INDI', name: 'XML_INDI', width: 60, searchoptions: { sopt: ["cn","eq"] } },
                { index: 'XML_MASIVO', name: 'XML_MASIVO', width: 60, searchoptions: { sopt: ["cn","eq"] } },
                { index: 'REPORTE',  name: 'REPORTE',  width: 70, searchoptions: { sopt: ["cn","eq"] } }
            ],
            rowNum: 200,
            loadonce: false,
            altRows: true,
            mtype: 'POST',
            gridview: false,
            pager: '#jqGridPagerListPv',
            sortname: 'CASO',
            sortorder: 'desc',
            viewrecords: true,
            rownumbers: true,
            caption:'',
            loadtext: 'Cargando informaci&oacute;n....',
            loadBeforeSend: function(xhr, settings){
                // Archivo.showLoading();
            },
            loadComplete: function(data) { // inicio loadComplete
                Archivo.hideLoading();
            } // fin loadComplete
        });
        $('#jqGridListPv').jqGrid('filterToolbar',{searchOperators: true, stringResult: true, searchOnEnter: false});
        $(".grid-title").html("Complemento Facturación");
    },
    msjActivador:function(){
            $("#divMsjXML").hide();
    },
    activamodal:function () {
        $("#btnSearch").click(function(e){
            e.preventDefault();
            $("#modalBusqueda").modal('show');
        });
    },
    respBusqueda:function () {
        $("#btnBuscarConsultaFacturaMasiva").click(function(e){
            $('#divBusqueda').show();
            $('#divGrid').hide();
            var numGasto  = $("#numGasto").val();
            var NomUsuario = $("#nmuser").val();
            var Proveedor = $("#idProveedor").val();
            var numCredito = $("#numCredit").val();
            var url = baseUrl + '/gastos/comprobacionfactura/busquedavanzada';

            if (numGasto == '' && NomUsuario == '' && Proveedor == '' && numCredito == '' ){
                alert("Disculpe, debe colocar al menos un criterio de busqueda ");
            }else{
                $.ajax({
                    url: url,
                    beforeSend: function( xhr ) {
                        $('#divBusqueda').html('<div class="modal-body text-center"><img src="http://quantum2.pendulum.com.mx/gastosfact/public/images/loading-gears.gif"></div>');
                    },
                    type: 'POST',
                   // dataType: 'json',
                    data: 'numGasto='+numGasto+'&NomUsuario='+NomUsuario+'&Proveedor='+Proveedor+'&numCredito='+numCredito, //el data es tu objeto formData
                }).done(function(data) {
                    $('#divBusqueda').html(data);
                }).fail(function() {
                    console.log("error");
                })
                $('#modalBusqueda').modal('toggle');
            }

        });
    },
    respBusquedaPV:function () {
        $("#btnBuscarConsultaFacturaMasivaPV").click(function(e){
            $('#divBusqueda').show();
            $('#divGrid').hide();
            var numGasto  = $("#numGasto").val();
            var NomUsuario = $("#nmuser").val();
            var Proveedor = $("#idProveedor").val();
            var numCredito = $("#numCredit").val();
            var url = baseUrl + '/gastos/comprobacionfactura/busquedavanzadapv';

            if (numGasto == '' && NomUsuario == '' && Proveedor == '' && numCredito == '' ){
                alert("Disculpe, debe colocar al menos un criterio de busqueda ");
            }else{
                $.ajax({
                    url: url,
                    beforeSend: function( xhr ) {
                        $('#divBusqueda').html('<div class="modal-body text-center"><img src="http://quantum2.pendulum.com.mx/gastosfact/public/images/loading-gears.gif"></div>');
                    },
                    type: 'POST',
                   // dataType: 'json',
                    data: 'numGasto='+numGasto+'&NomUsuario='+NomUsuario+'&Proveedor='+Proveedor+'&numCredito='+numCredito, //el data es tu objeto formData
                }).done(function(data) {
                    $('#divBusqueda').html(data);
                }).fail(function() {
                    console.log("error");
                })
                $('#modalBusqueda').modal('toggle');
            }

        });
    },
    mostrarFiltros:function () {
        $("#btnMostrarFiltro").click(function(e){
            e.preventDefault();
            $('#divBusqueda').hide();
            $('#divGrid').show();
        });



    }

};
ComprobacionPantallaFactura.init();