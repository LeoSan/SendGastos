var VacacionesLoad = {
	init : function() {

		// var url = baseUrl + '/recursosh/index/uploadfile';

//    $(document).on({
//        click: function(e){
		//alert("carga comprobante");
		var solicitud = $("#solicitudid").val();
		//console.log();

		$('#file_upload').uploadify({
			'swf'      : '/gastosfact/public/lib/uploadify/uploadify.swf',
			// 'uploader' : '/gastosfact/public/recursosh/index/uploadfile',
			'uploader' : '/gastosfact/public/gastos/verificacionsat/uploadfile',
			'buttonText' : 'Examinar...',
			'removeCompleted' : true,
			'fileTypeExts'     : '*.xml',
			'fileTypeDesc'    : 'XML Files',
			'formData': {'solicitudid' : solicitud},
			'onUploadComplete' : function(file) {

				//console.log('onUploadComplete el archivo ' + file.name + ' finalizó exitosamente.');
			},
			'onUploadSuccess' : function(file, data, response) {

				var cadena = JSON.parse(data);
				console.log(data);

				if(cadena.success == 'true'){
					$("#archivoCargado").val(cadena.file);
					$("#fileComprobante").val(cadena.file);
					//fileComprobante
					$("#msjErrorUploadSuccess").html(cadena.msg);
					$("#msjErrorUploadSuccess").show();
				} else {
					$("#msjErrorUploadError").html(cadena.msg);
					$("#msjErrorUploadError").show();
					console.log('El archivo ' + file.name + ' se cargo progresivamente con respuesta ' + response + ':' + data);
					console.log('La extension es: ' + cadena.ext);
					console.log('cadena.msg ' + cadena.msg);
				}
			},
			'onUploadStart' : function(file) {

			},
			'onUploadError' : function(file, errorCode, errorMsg, errorString) {
				console.log('The file ' + file.name + ' could not be uploaded: ' + errorString);
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
