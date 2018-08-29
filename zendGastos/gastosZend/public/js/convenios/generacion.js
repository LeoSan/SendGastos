var generacionConvenios = {
    
    init: function(){
        $(".grid-title").html("Recuperaci&oacute;n de convenios");
        
        generacionConvenios.renderGrid();
    },
    
       	renderGrid : function() {
		var alto = $(document).height();
		var ancho = $(document).width();
		var userQuasar = $('#archivo-userQuasar').html();
		var pantalla = $('#pantalla').html();
		var userid = $('#userdbid').html();
                var nodoPerfil = $("#nodo-perfil").val();
                var emailUser = $("#emailUser").val();
                // baseUrlControlActivos
		var grid = $('#recuperacion-convenios-grid').jqGrid({
		   	url: baseUrl + '/convenios/generacion/getconvenio',
			datatype: 'json',
            postData: { 
            	userQuasar   : userQuasar, 
            	pantalla    : pantalla, 
            	userid      : userid, 
            	isadmin     : $('#isadmin').text(),
                perfil      : nodoPerfil,
                tipoMod     : 0,
                email       : emailUser
            },
			autowidth: true,
            shrinkToFit: true,
			height: 500,
			// height: alto - 240,
			ignoreCase: true,
			ondblClickRow: function (rowId) {
				Archivo.showLoading();
//				var rowData = $(this).getRowData(rowId);
//				ConsultaInventario.renderElementDetail(rowData['IDDOCTO'],rowData['CREDITO']);
			},
		   	colNames:[
		   	          'Id',
                                  'Cartera',
		   	          'Documento',
		   	          'Cuenta',
		   	          'Fecha registro',
                                  'Acción'
                                  
// Id 	Cartera 	Documento 	Cuenta 	Fecha registro 	Acción
		   	],
		   	colModel:[{
		   			name: 'ID',
		   			index: 'ID',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 90
		   		},{
		   			name: 'UPPER(CARTERA)',
		   			index: 'UPPER(CARTERA)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
                                        width: 100
		   		},{
		   			name: 'UPPER(DOCUMENTO)',
		   			index: 'UPPER(DOCUMENTO)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
                                        width: 150
		   		},{
		   			name: 'UPPER(CREDITO)',
		   			index: 'UPPER(CREDITO)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
		   			width: 80
		   		},{
		   			name: 'UPPER(FECHA)',
		   			index: 'UPPER(FECHA)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
                                        width: 80
		   		},{
		   			name: 'UPPER(HAYCONTENIDO)',
		   			index: 'UPPER(HAYCONTENIDO)',
		   			sortype: 'string',
		   			searchoptions: {sopt: ['cn', 'eq']},
				   	resizable: false,
		   			align: 'left',
                                        width: 70
		   		},{
		   			name: 'ACCION',
		   			index: '',
                                        sortable:false,
		   			sortype: false,
		   			search: false,
				   	resizable: false,
		   			align: 'center',
                                        width: 50
		   		}
		   	],
                    rowNum: 30,
		    loadonce: false,
		    altRows: true,
                    mtype: 'POST',
                    gridview: false,
		    pager: '#consulta-inventario-pager',
                    sortname: 'FDFECULTMOVTO',
                    sortorder: 'desc',
		    viewrecords: true,
                    rownumbers: true,
		    caption:'',
		    loadtext: 'Cargando informaci&oacute;n....',
		    loadBeforeSend: function(xhr, settings){
		    	Archivo.showLoading();
		    },
		    loadComplete: function(data) {
        
                
		}
		});
		$('#recuperacion-convenios-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true, searchOnEnter: false});
	},
};



function getConvenio( convenio ){
    var url = baseUrl + '/convenios/generacion/getconvenio';

    var request = $.ajax({
        url: url,
        method: "GET",
        data: { id : convenio },
        dataType: "html"
    });

    request.done(function( res ) {
        console.log( res );
        var win = window.open('', 'Contrato', 'toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
        win.document.body.innerHTML = res;
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed documentos: " + textStatus );
    });
}

function getPdf( id ){
    var url = baseUrl + '/convenios/generacion/getpdf';

    var request = $.ajax({
        url: url,
        method: "GET",
        data: { id : id },
        dataType: "text"
    });

    request.done(function( res ) {
        console.log( res );
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed documentos: " + textStatus );
    });
}

$( "#fecha" ).datepicker({"dateFormat": "dd/mm/yy"});

$("#btnClear").click(function(e){
    $( "#carteras" ).val(0);
    $( "#documentos" ).val(0);
    $( "#credito" ).val("");
    $( "#fecha" ).val("");
});

$("#btnSearch").click(function(e){
    e.preventDefault();

    if( $( "#carteras" ).val() == 0 ){
        alert( "Seleccione cartera" );
        $( "#carteras" ).focus();
        return false;
    }

    if( $( "#documentos" ).val() == 0 ){
        alert( "Seleccione documento" );
        $( "#documentos" ).focus();
        return false;
    }
    /*
    if( $.trim( $( "#credito" ).val() ) == "" || $.trim( $( "#fecha" ).val() ) == "" ){
        alert( "Agregue un credito o fecha" );
        $( "#credito" ).focus();
        return false;
    }
    */
    var url = baseUrl + '/convenios/generacion/getconveniossearch';

    var request = $.ajax({
        url: url,
        method: "GET",
        data: {
            cartera: $( "#carteras" ).val(),
            documento: $( "#documentos" ).val(),
            credito: $( "#credito" ).val(),
            fecha: $( "#fecha" ).val()
        },
        dataType: "json"
    });

    request.done(function( res ) {
        console.log( res );
        addConveniosResult( res );
    });

    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed documentos: " + textStatus );
    });
});

function addConveniosResult( data ){
    var openConvenioHtml = "";
    var openConveniopdf = "";

    $("#catalogo-content table tbody tr").remove();
    $.each(data, function(idx, conv) {
        if( conv.HAYCONTENIDO > 0 ){
            openConvenioHtml = '<td style="width: 15%"><a href="#" onclick="javascript:getConvenio(' + conv.ID + ');">Abrir</a></td>';
            openConvenioPdf  = '<td style="width: 15%"><a href="' + baseUrl + '/convenios/generacion/getpdf/id/' + conv.ID + '">PDF</a></td>';
        }

        $("#catalogo-content table tbody")
            .append($('<tr>')
                .append('<td style="width: 7%">' + conv.ID + '</td><td style="width: 8%">' + conv.CARTERA + '</td><td style="width: 30%">' + conv.DOCUMENTO + '</td><td style="width: 17%">' + conv.CREDITO + '</td><td style="width: 5%">' + conv.FECHA + '</td>' + openConvenioHtml + openConvenioPdf ));
    });
}