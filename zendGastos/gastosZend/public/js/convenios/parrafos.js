var parrafos = {
    init: function() {
        $(".grid-title").html("Administraci&oacute;n de p&aacute;rrafos");         
        parrafos.renderGrid();
        
        $(document).on({
            click: function(e){
            e.preventDefault();
            //var elem = $(this).attr("id-rel")
            var idParrafo = $(this).attr("id-rel");
            var rand = Math.floor((Math.random() * 1000) + 1);
            window.open('http://quantum1.pendulum.com.mx/pendulum/contratos/version2/openParagraph.php?r=' + rand + '&bd=workflow&parrafo=' + idParrafo, 'Contrato', 'directories=no, titlebar=no, toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
            }
        },"#openParrafo");
        
        $(document).on({
            click: function(e){
            e.preventDefault();
            var idParrafo = $(this).attr("id-rel");
            window.open('http://quantum1.pendulum.com.mx/pendulum/contratos/version2/editParagraph.php?bd=workflow&parrafo=' + idParrafo, 'Contrato', 'directories=no, titlebar=no, toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
            },
        },"#editParrafo");
        
        $(document).on({
            click: function(e){
            e.preventDefault();
            var idParrafo = $(this).attr("id-rel");
            var url = baseUrl +'/convenios/parrafos/delete/parrafo/' + idParrafo;
            var request = $.ajax({
              url: url,
              method: "GET",
            });

            request.done(function( res ) {
                $("ul.dropdown-menu li a[rel-module='convenios'][rel-controller='parrafos']").click();
            });

            request.fail(function( jqXHR, textStatus ) {
                alert( "Request failed: " + textStatus );
            });
            
            }
        },"#deleteParrafo");
        
        $(document).on({
            
            click: function(e){
                // window.open('http://10.73.98.116/pendulum/contratos/version2/newParagraph.php', 'Contrato', 'directories=no, titlebar=no, toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
                window.open('http://MXVLSQL04P.pendulum.com.mx/pendulum/contratos/version2/newParagraph.php', 'Contrato', 'directories=no, titlebar=no, toolbar=no, menubar=no, location=no, status=no, scrollbars=yes, resizable=yes, height=700, width=1000');
            }
        },".newParrafo");
        
        
    
    },   
    deleteParrafo: function( url ){

    },
    renderGrid : function() {			
        var alto = $(document).height();
        var ancho = $(document).width();

        var grid = $('#inventario-parrafos-grid').jqGrid({ // /convenios/generacion/getpdf
            url: baseUrl + '/convenios/parrafos/get-parrafos', // + baseUrl + '/convenios/parrafos/delete/parrafo
            datatype: 'json',
            postData: { },
            autowidth: true,
            height: '100%',
            ondblClickRow: function (rowId) {
            },
            colNames:[
                              'Id',
                              'Descripción',
                              'Estatus',
                              'Acción'
            ],
            colModel:[{
                            name: 'IDPARRAFO',
                            index: 'IDPARRAFO',
                            sortype: 'string',
                            searchoptions: {sopt: ['cn', 'eq']},
                            resizable: false,
                            align: 'right',
                            width: 50
                    },
                    {
                            name: 'FCDESCRIPCION',
                            index: 'FCDESCRIPCION',
                            sortype: 'string',
                            searchoptions: {sopt: ['cn', 'eq']},
                            resizable: false,
                            align: 'left',
                            width: 90
                    }, 
                    
                    {
                            name: 'FCSTATUS',
                            index: 'FCSTATUS',
                            sortype: 'string',
                            searchoptions: {sopt: ['cn', 'eq']},
                            resizable: false,
                            align: 'left',
                            width: 90
                    },
                                                    {
                            name: 'ACCION',
                            index: 'ACCION',
                            sortype: false,
                            search: false,
                            sortable:false,
                            resizable: false,
                            title:false,
                            align: 'center',
                            width: 100
                    }
            ],
            rowNum: -1,
            mtype: 'POST',
            sortname: 'IDPARRAFO',
            viewrecords: true,
			rownumbers: true,
            sortorder: 'asc',
            caption:'',
            loadtext: 'Cargando informaci&oacute;n....',
            loadonce: false,
                });
                $('#inventario-parrafos-grid').jqGrid('filterToolbar',{searchOperators: true, stringResult: true});
                        
	}
    
};
parrafos.init();


