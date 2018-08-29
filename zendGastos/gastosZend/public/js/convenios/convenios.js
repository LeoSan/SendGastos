function addDocument(){
	var options = $("select#documentos").find('option:selected');
	
	$.each( options, function( i, val ) {
		$("select#documentosActuales").append(val);
	});
}

function addSubtype(){
	var options = $("select#subtipos").find('option:selected');
	
	$.each( options, function( i, val ) {
		$("select#subtiposActuales").append(val);
	});
}

function addSubdocument(){
	var options = $("select#subdocumentos").find('option:selected');
	
	$.each( options, function( i, val ) {
		$("select#subdocumentosActuales").append(val);
	});
}

function addParagraph(){
	var options = $("select#parrafos").find('option:selected');
	
	$.each( options, function( i, val ) {
		$("select#parrafosActuales").append(val);
	});
}

function delDocument(){
	$("select#documentosActuales").find('option:selected').remove();
}

function delSubtype(){
	$("select#subtiposActuales").find('option:selected').remove();
}

function delSubdocument(){
	$("select#subdocumentosActuales").find('option:selected').remove();
}

function delParagraph(){
	$("select#parrafosActuales").find('option:selected').remove();
}

function setParagraphOption(){
	$("select#parrafosActuales").value = 'edit';
}