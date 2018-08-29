var ProrrateoIndex = {
		init : function() {
			console.log("Esta es el JS para actualizar el prorrateo"+ baseUrl + '/gastos/prorrateogasto/uploadfile');
			ProrrateoIndex.cargarGrid();

			$('#file_upload_prorrateo').uploadify({
		        'swf'      : '/gastosfact/public/lib/uploadify/uploadify.swf',
		        'uploader' : '/gastosfact/public/gastos/prorrateogasto/uploadfile',
		        'buttonText' : 'Examinar...',
				'removeCompleted' : true,
		        'formData': {'empleadoid' : $("#empleadoid").val(),'solicitudid' : $("#solicitudid").val()},
		        'onUploadComplete' : function(file) {
		            //$("#archivo").val(file.name);
		        	console.log('onUploadComplete el archivo ' + file.name + ' finalizó exitosamente.');
		        },
		        'onUploadSuccess' : function(file, data, response) {
		        	$("#msjErrorUploadSuccess").hide();
		        	$("#msjErrorUploadError").hide();
		        	var cadena = JSON.parse(data);
		        	if(cadena.success == 'true'){
			        	$("#archivo").val(cadena['file']);
			        	$("#msjErrorUploadSuccess").html('EL archivo ' + file.name + ' se cargo progresivamente');
			        	$("#msjErrorUploadSuccess").show();
			        	ProrrateoIndex.cargarGrid();
			        	console.log('onUploadSuccess el archivo ' + file.name + ' se cargo progresivamente con respuesta ' + response + ':' + data);
		        	} else {
		        		$("#msjErrorUploadError").html(cadena.msg);
		        		$("#msjErrorUploadError").show();
		        		//ProrrateoIndex.cargarGrid();
		        	}
		        },
		        'onUploadStart' : function(file) {
					console.log("empiezo a subir r10");
		        	$("#msjErrorUploadSuccess").hide();
		        	$("#msjErrorUploadError").hide();
					$('#lista-creditos-prorrateo').html("");
		        }, 'onUploadError' : function(file, errorCode, errorMsg, errorString) {
					console.log('The file ' + file.name + ' could not be uploaded: ' + errorString);
				},
		        // Put your options here
		    });
		},
		cargarGrid : function() {
			//data: {solicitudid : $("#solicitudid").val(), tipocaptura : $("#tipocaptura").val()},
			$.ajax({
				url: baseUrl + '/gastos/prorrateogasto/getprorrateodetalle',
				type: 'POST',
				data: {solicitudid : $("#solicitudid").val(), nombrearchivo : $("#archivo").val()},
				dataType: 'html',
				complete: function() {
					//Modal.close();
				},
				success: function(data) {
					//$('#modalAltaIndividual').modal('hide');
					$('#lista-creditos-prorrateo').html(data);
				} 
			});
		}
};

ProrrateoIndex.init();