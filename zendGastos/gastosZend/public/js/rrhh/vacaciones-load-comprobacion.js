var VacacionesLoad = {
	init : function() {

		var solicitud = $("#solicitudid").val();

		$('#file_upload').uploadify({
			'swf'      : '/gastosfact/public/lib/uploadify/uploadify.swf',
			'uploader' : '/gastosfact/public/recursosh/index/uploadfile',
			//'uploader' : '/gastosfact/public/gastos/prorrateogasto/uploadfile',
			'buttonText' : 'Examinar...',
			'removeCompleted' : true,
			'formData': {'solicitudid' : solicitud},
			'onUploadComplete' : function(file) {

			},
			'onUploadSuccess' : function(file, data, response) {
				var cadena = JSON.parse(data);
				if(cadena.success == 'true'){
					$("#archivoCargado").val(cadena.file);
					$("#fileComprobante").val(cadena.file);
					//fileComprobante
					$("#msjErrorUploadSuccess").html(cadena.msg).show().delay(15000).hide('slow');
				} else {
					$("#msjErrorUploadError").html(cadena.msg).show().delay(15000).hide('slow');
				}
			},
			'onUploadStart' : function(file) {

			},
			'onUploadError' : function(file, errorCode, errorMsg, errorString) {
				console.log('El archivo ' + file.name + ' no puede ser cargado: ' + errorString);
			},
			// Put your options here
		});

		// "width: 609px; left: 48%;"
//        }
//    
//    },"#btnCargaComprobante"); // btnCargaComprobante




	},// End Init()




};
VacacionesLoad.init();
