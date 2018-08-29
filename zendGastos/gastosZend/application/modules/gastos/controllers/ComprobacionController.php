<?php

class Gastos_ComprobacionController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }
    
    public function pantallacomprobaAction()
    {
    	$this->_helper->layout->setLayout('gastos');
        $params = $this->getRequest()->getParams();

    	$empleadoid = isset($params['empleadoid'])?$params['empleadoid']:'1471';
        $solicitudid = isset($params['solicitudid'])?$params['solicitudid']:'113891';
		$numcompro = isset($params['tipocaptura'])?$params['tipocaptura']:'0';

        $this->view->solicitudid = $solicitudid;
        $userid = isset($empleadoid)?$empleadoid:'1471';
        $this->view->userid = $userid != "0" ? $userid : 'mamartinez';
        
        $Comproba = new Gastos_Model_Comprobacion();
    	$resDatosFactura = $Comproba->getDatosFactura( $solicitudid );
    	
    	$idEmpresa = "";
    	$rfcEmpresa = "";
    	$nombreEmpresa = "";
    	$idProveedor = "";
    	$rfcProveedor = "";
    	$nombreProveedor = "";
    	
    	foreach($resDatosFactura as $item):
    		$idEmpresa = $item['IDEMPRESA'];
	    	$rfcEmpresa = $item['RFCEMPRESA'];
	    	$nombreEmpresa = $item['NMEMPRESA'];
	    	$idProveedor = $item['IDPROVEEDOR'];
	    	$rfcProveedor = $item['RFCPROVEEDOR'];
	    	$nombreProveedor = $item['NMPROVEEDOR'];
    	endforeach;

        $array_alertas = Array();
        $juicio=$Comproba->getEtapaJucioByIdcaso( $solicitudid );

        if(count($juicio)>0){
            foreach ($juicio as $ind=>$j){
                if($j['ETAPAS']!=''){
                    $alerta=$Comproba->getAlertaFechaAprobacionFechaFinEtapa($solicitudid, $j['JUICIO'],$j['ETAPAS'] );

                    foreach ($alerta as $indB =>$a){

                        $array_alertas[$indB]['ETAPAS']=$j['ETAPAS'];
                        $array_alertas[$indB]['CREDITO']=$j['CREDITO'];
                        $array_alertas[$indB]['JUICIO']=$j['JUICIO'];
                        $array_alertas[$indB]['IDCONCEPTO']=$j['IDCONCEPTO'];
                        $array_alertas[$indB]['CATEGORIA']=$j['CATEGORIA'];
                        $array_alertas[$indB]['SUBCATEGORIA']=$j['SUBCATEGORIA'];
                        $array_alertas[$indB]['CONCEPTO']=$j['CONCEPTO'];
                        $array_alertas[$indB]['JUSTIFICACION']=$j['JUSTIFICACION'];
                        $array_alertas[$indB]['JUSTIFICACIONES']=$j['JUSTIFICACIONES'];
                        $array_alertas[$indB]['FECHA_AUTORIZACION']=$a['FECHA_AUTORIZACION'];
                        $array_alertas[$indB]['FECHA_TERMINO_ETAPA']=$a['FECHA_TERMINO_ETAPA'];
                        $array_alertas[$indB]['NUMERO_ETAPA']=$a['NUMERO_ETAPA'];
                        $array_alertas[$indB]['ALERTA']=$a['ALERTA'];
                    }
                }
            }
        }
    	
    	$this->view->numcompro = $numcompro;
    	$this->view->idEmpresa = $idEmpresa;
    	$this->view->rfcEmpresa = $rfcEmpresa;
    	$this->view->nombreEmpresa = $nombreEmpresa;
    	$this->view->idProveedor = $idProveedor;
    	$this->view->rfcProveedor = $rfcProveedor;
    	$this->view->nombreProveedor = $nombreProveedor;
        $this->view->array_alertas = $array_alertas;
    }
    
	public function ping( $host ) {
		
        $curlInit = curl_init('http://'.$host);

        curl_setopt($curlInit,CURLOPT_CONNECTTIMEOUT,10);
        curl_setopt($curlInit,CURLOPT_HEADER,true);
        curl_setopt($curlInit,CURLOPT_NOBODY,true);
        curl_setopt($curlInit,CURLOPT_RETURNTRANSFER,true);

       //get answer
       $response = curl_exec($curlInit);

       curl_close($curlInit);

       if (!$response){
		   return false;
          //echo json_encode(array("activo"=>0,"msj"=>"No esta activo","response"=>$response));
       }else{
		  return true;
          //echo json_encode(array("activo"=>1,"msj"=>"Si esta activo","response"=>$response));
       }
	}
    
	public function uploadfileAction()
    {
    	try{
    	$this->_helper->layout->disableLayout();	
    	
    	$host = 'doc.pendulum.com.mx';
    	$output = $this->ping($host);
    	if ($output === false) {
    		echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
	       		<strong>Error!</strong> Ha ocurrido un error al conectarse al servidor de documentos. Intente en otro momento. </div>';
			exit();
    	}
    	
    	// Define a destination
    	//$targetFolder = $_SERVER['DOCUMENT_ROOT'] . '/gastosfact/public/fileTmp/';
    	//$targetFolder = $_SERVER['DOCUMENT_ROOT'] . '/file_external/GASTOS/';
    	$targetFolder = "/opt/processmaker/shared/sites/workflow/files/gastos/comprobacion/";
    	
    	$params = $this->getRequest()->getParams();
		$solicitudid = $params['solicitudid'];
		
		$tipoComprobante = $this->getRequest()->getParam('tipoComprobante','');
		$idEmpresa = $this->getRequest()->getParam('idEmpresa','');
    	$rfcEmpresa = $this->getRequest()->getParam('rfcEmpresa','');
    	$nombreEmpresa = $this->getRequest()->getParam('nombreEmpresa','');
    	$idProveedor = $this->getRequest()->getParam('idProveedor','');
    	$rfcProveedor = $this->getRequest()->getParam('rfcProveedor','');
    	$nombreProveedor = $this->getRequest()->getParam('nombreProveedor','');
		
		$this->view->idEmpresa = $idEmpresa;
    	$this->view->rfcEmpresa = $rfcEmpresa;
    	$this->view->nombreEmpresa = $nombreEmpresa;
    	$this->view->idProveedor = $idProveedor;
    	$this->view->rfcProveedor = $rfcProveedor;
    	$this->view->nombreProveedor = $nombreProveedor;
		
    	$tipoComprobanteValidado = 'Factura';
    	$validacion = "0";
		$fechaFile = date("YmdHis");
		//echo $targetFolder;exit;
		if (!empty($_FILES)) {
			$tempFile = $_FILES['Filedata']['tmp_name'];
			$targetPath = $targetFolder; 
			// Validate the file type
			$fileTypes = array('xml', 'XML'); // File extensions
			//$fileTypes = array('pdf', 'csv', 'xls', 'xlsx', 'txt', 'doc');
			$fileParts = pathinfo($_FILES['Filedata']['name']);
			//$targetFile = rtrim($targetPath,'/') . '/' . $_FILES['Filedata']['name'];
			$nombreArchivo = "" . $solicitudid . "_" . $fechaFile . "." . $fileParts['extension'];
			//var_dump($nombreArchivo);exit;
			$targetFile = rtrim($targetPath,'/') . "/" . $solicitudid . "_" . $fechaFile . "." . $fileParts['extension'];
			$fileName = $_FILES['Filedata']['name'];
            if (in_array( strtolower($fileParts['extension']) ,$fileTypes)) {
				$up = move_uploaded_file($tempFile,$targetFile);
				if( !$up ){
					throw new Exception("No se pudo mover el archivo: " . $targetFile);
					$result['success'] = 'false';
					$result['msg'] = "No se pudo mover el archivo: " . $targetFile;
            		echo json_encode($result); die();
				}
				
				//chmod($targetFile, 0777); //Dar todos los permisos a los archivos
				
        		//Leer el archivo XML
        		$str = file_get_contents($targetFile);
        		//$str = str_replace('xmlns:schemaLocation', 'xsi:schemaLocation', $str);
        		
        		$pos_xml = strpos($str, '<?xml', 0);
        		$str_clob = substr($str, $pos_xml);
        		
        		error_reporting(E_ALL ^ E_WARNING); 
        		
        		$xml = new SimpleXMLElement($str);
        		//$comprobante = $xml->xpath('//cfdi:Comprobante');


        		$ns = $xml->getNamespaces(true);
        		$xml->registerXPathNamespace('c', $ns['cfdi']);
        		
				if(!isset($ns['tfd'])){//Se valida que el archivo sea valido para el SAT (que sea un CFDI)
					echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
	       	    			<strong>Archivo erroneo!</strong> El archivo XML no es un archivo de Comprobaci�n CFDI. El archivo NO cuenta con un Folio Fiscal certificado por el SAT. </div>';
					exit();
				}
        		
				$xml->registerXPathNamespace('t', $ns['tfd']);
				
				$implocal = 0;
				if( isset($ns['implocal']) ) {
				  $xml->registerXPathNamespace('l', $ns['implocal']);
				  $implocal = 1;
				}
				
				$total = '';
				
				// Leo la version
				foreach ($xml->xpath('//cfdi:Comprobante') as $cfdiComprobante)
				{ 
					$version = $cfdiComprobante['version'];
					if($version == ""){
						$version = $cfdiComprobante['Version'];
					}
				}
                //identifico el UUID de la factura
				foreach ($xml->xpath('//t:TimbreFiscalDigital') as $tfd) 
				{
					$uuid = (isset($tfd['UUID']))?$tfd['UUID']:''; 
				}
				
				if($uuid == ""){//Se valida que el archivo sea una factura
					echo '<div class="alert alert-error">
		              <button type="button" class="close" data-dismiss="alert">×</button>
		              <strong>Archivo no valido!</strong> El archivo XML cargado no corresponde a una factura.
		            </div>';exit;
				}
				
				$Comproba = new Gastos_Model_Comprobacion();
    			$comprobacion = $Comproba->getDetalleComprobante( $uuid );

    			if($comprobacion){//Se valida que el comprobante no haya sido cargado con anterioridad
    				$idGastoRepite = $comprobacion[0]['EXISTE'];
    				echo '<div class="alert alert-error">
		              <button type="button" class="close" data-dismiss="alert">×</button>
		              <strong>Archivo repetido!</strong> El archivo XML ya se ha cargado en el Gasto . ' . $idGastoRepite . '
		            </div>';exit;
    			}
    			
				foreach ($xml->xpath('//cfdi:Comprobante') as $cfdiComprobante)
				{
					if( $version == '3.3' ) {
						$fecha = $cfdiComprobante['Fecha'];
						$fecha = date('d/m/Y' ,strtotime($fecha)); 
						$folio = $cfdiComprobante['Folio']; 
						$total = $cfdiComprobante['Total'];
						$subTotal = $cfdiComprobante['SubTotal']; 
			        	$serie = $cfdiComprobante['Serie']; 
			        	$factura = $serie . $folio;
					} else { 
						$fecha = $cfdiComprobante['fecha'];
						$fecha = date('d/m/Y' ,strtotime($fecha)); 
						$folio = $cfdiComprobante['folio']; 
						$total = $cfdiComprobante['total'];
						$subTotal = $cfdiComprobante['subTotal']; 
			        	$serie = $cfdiComprobante['serie']; 
			        	$factura = $serie . $folio;
					}
				}
				
				/*if(!$bndVersion){
					echo '<div class="alert alert-error">
		              <button type="button" class="close" data-dismiss="alert">×</button>
		              <strong>Version no valida!</strong> '.$version.'
		            </div>';exit;
				}*/
				
				
				$concepto = "";
				foreach ($xml->xpath('//cfdi:Conceptos') as $cfdiComprobante)
				{
					foreach ($cfdiComprobante->xpath('//cfdi:Concepto') as $cfdiComprobante)
					{
						if( $version == '3.3' ) {
						$concepto = $cfdiComprobante['Descripcion'];
							$concepto = (strlen($concepto) > 100) ? substr($concepto,0,90).'...' : $concepto;
						} else { 
							$concepto = $cfdiComprobante['descripcion'];
							$concepto = (strlen($concepto) > 100) ? substr($concepto,0,90).'...' : $concepto;
						}
					} 
				}
				
				$isr = 0;
				$ivaRetenido = 0;
				$iva = 0;
				foreach ($xml->xpath('//cfdi:Impuestos') as $cfdiComprobante)
				{ 
					if( $version == '3.3' ) {
						$iva = $cfdiComprobante['TotalImpuestosTrasladados'];
					} else {
						$iva = $cfdiComprobante['totalImpuestosTrasladados'];
					}
				}
                //Si no devolvio ningun resultado declaro el iva en cero
                if($iva == NULL || empty($iva) || $iva == 0){
                    $iva=0.00;
                } 


                foreach ($cfdiComprobante->xpath('//cfdi:Retencion') as $cfdiRetencion)
				{
					if( isset($cfdiRetencion['impuesto']) && $cfdiRetencion['impuesto'] == "ISR" ){
						$isr = $cfdiRetencion['importe'];
						$isr = trim($isr);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}
					if( isset($cfdiRetencion['Impuesto']) && $cfdiRetencion['Impuesto'] == "001" ){
						$isr = $cfdiRetencion['Importe'];
						$isr = trim($isr);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}
					
					if( isset($cfdiRetencion['impuesto']) && $cfdiRetencion['impuesto'] == "IVA" ){
						$ivaRetenido = $cfdiRetencion['importe'];
						$ivaRetenido = trim($ivaRetenido);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}
					if( isset($cfdiRetencion['Impuesto']) && $cfdiRetencion['Impuesto'] == "002" ){
						$ivaRetenido = $cfdiRetencion['Importe'];
						$ivaRetenido = trim($ivaRetenido);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}

				}
				
				if ( $implocal == 1 ) {
				foreach ($xml->xpath('//l:RetencionesLocales') as $cfdiRetencion)
				{ 
					if( $cfdiRetencion['ImpLocRetenido'] == "ISR" ){
						$isr = $cfdiRetencion['Importe'];
						$isr = trim($isr);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}
					
					if( $cfdiRetencion['ImpLocRetenido'] == "IVA" ){
						$ivaRetenido = $cfdiRetencion['Importe'];
						$ivaRetenido = trim($ivaRetenido);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}
				}
				}
				if($tipoComprobante == "Factura" && $tipoComprobanteValidado !== "Factura"){
					echo '<div class="alert alert-error">
		              <button type="button" class="close" data-dismiss="alert">×</button>
		              <strong>Comprobante incorrecto!</strong>El comprobante seleccionado no del tipo Factura ya que contien un total del ISR de: ' . $isr . '
		            </div>';exit;
				}
				
				if($tipoComprobante == "Recibo de honorarios" && $tipoComprobanteValidado !== "Recibo de honorarios"){
					echo '<div class="alert alert-error">
		              <button type="button" class="close" data-dismiss="alert">×</button>
		              <strong>Comprobante incorrecto!</strong>El comprobante seleccionado no es un Recibo de honorarios. Verifique.</div>';exit;
				}
				
				//echo "Isr: " . $isr . " y, IivaRetenido: " . $ivaRetenido;exit;
				
				foreach ($xml->xpath('//cfdi:Emisor') as $cfdiComprobante)
				{ 
					if( $version == '3.3' ) {
						$rfcEmisor = utf8_encode($cfdiComprobante['Rfc']); 
         				$nombreEmisor = utf8_encode($cfdiComprobante['Nombre']);
					} else {
						$rfcEmisor = utf8_encode($cfdiComprobante['rfc']); 
         				$nombreEmisor = utf8_encode($cfdiComprobante['nombre']);
					}
				}
				
				foreach ($xml->xpath('//cfdi:Receptor') as $cfdiComprobante)
				{ 
					if( $version == '3.3' ) {
         				$rfcReceptor = utf8_encode($cfdiComprobante['Rfc']);
						$nombreReceptor = utf8_encode($cfdiComprobante['Nombre']);
					} else {
						$rfcReceptor = utf8_encode($cfdiComprobante['rfc']);
						$nombreReceptor = utf8_encode($cfdiComprobante['nombre']);
					}
				}
				
				$mensaje = "";
				if($rfcReceptor != $rfcEmpresa){
					$mensaje .= "<p>La empresa Receptor es incorrecto. Debe ser: " . $rfcEmpresa . " - " . $nombreEmpresa . "</p><br>";
					$validacion = "1";
				}

				$this->view->fecha = $fecha;
				$this->view->folio = $folio;
				$this->view->total = $total;
				$this->view->subTotal = $subTotal;
				$this->view->serie = $serie;
				$this->view->factura = $factura;
				$this->view->iva = $iva;
				$this->view->concepto = $concepto;
				$this->view->ivaRetenido = $ivaRetenido;
				$this->view->isr = $isr;
				$this->view->otrosImpuestos = 0;

				$nombreEmisor = str_replace("&",utf8_encode("&"),$nombreEmisor);
				$nombreEmisor = str_replace("amp;",utf8_encode(""),$nombreEmisor);
				$nombreEmisor = str_replace(",","",$nombreEmisor);
				$nombreEmisor = str_replace(".","",$nombreEmisor);
				
				$this->view->rfcEmisor = utf8_decode($rfcEmisor);
				$this->view->nombreEmisor = utf8_decode($nombreEmisor);
				
				$this->view->rfcReceptor = utf8_decode($rfcReceptor);
				$this->view->nombreReceptor = utf8_decode($nombreReceptor);
				
				$this->view->nombreArchivo = $nombreArchivo;
				$this->view->uuid = $uuid;
				
				$this->view->mensaje = $mensaje;
				$this->view->validacion = $validacion;
				
			} else {
				$result['success'] = 'false';
            	$result['msg'] = "Tipo de archivo no permitido.";
            	echo json_encode($result);
        		die();
			}
		} else {
			$result['success'] = 'false';
	        $result['msg'] = "Archivo no recibido. Intente de nuevo.";
	        echo json_encode($result);
	        die();
		}	
    	} catch( Exception $e) {
    		$result['success'] = 'false';
			$result['msg'] = "Excepción: " . $e->getMessage();
            echo json_encode($result); die();
    	}
    }
    
	public function uploadfileSegundaAction()
    {
    	try{
    	$this->_helper->layout->disableLayout();	
    	
    	$host = 'doc.pendulum.com.mx';
    	$output = $this->ping($host);
    	if ($output === false) {
			$result['success'] = 'false';
            $result['msg'] = "Ha ocurrido un error al conectarse al servidor de documentos. Intente en otro momento.";
            echo json_encode($result); die();
    	}
    	
    	// Define a destination
    	$targetFolder = "/opt/processmaker/shared/sites/workflow/files/gastos/comprobacion/";
    	$params = $this->getRequest()->getParams();
		$solicitudid = $params['solicitudid'];
		$comprobanteId = $params['comprobanteId'];
		
		$tipoComprobante = $this->getRequest()->getParam('tipoComprobante','');
		$idEmpresa = $this->getRequest()->getParam('idEmpresa','');
    	$rfcEmpresa = $this->getRequest()->getParam('rfcEmpresa','');
    	$nombreEmpresa = $this->getRequest()->getParam('nombreEmpresa','');
    	$idProveedor = $this->getRequest()->getParam('idProveedor','');
    	$rfcProveedor = $this->getRequest()->getParam('rfcProveedor','');
    	$nombreProveedor = $this->getRequest()->getParam('nombreProveedor','');
		
    	$tipoComprobanteValidado = 'Factura';
    	$validacion = "0";
		
		if (!empty($_FILES)) {
			$tempFile = $_FILES['Filedata']['tmp_name'];
			$targetPath = $targetFolder; 
			$fileTypes = array('xml', 'XML'); // File extensions
			$fileParts = pathinfo($_FILES['Filedata']['name']);
			$nombreArchivo = $solicitudid . "_" . $comprobanteId . "." . $fileParts['extension'];
			$targetFile = rtrim($targetPath,'/') . "/" . $solicitudid . "_" . $comprobanteId . "." . $fileParts['extension'];
			$fileName = $_FILES['Filedata']['name'];
            if (in_array( strtolower($fileParts['extension']) ,$fileTypes)) {
				$up = move_uploaded_file($tempFile,$targetFile);
				if( !$up ){
					throw new Exception("No se pudo mover el archivo: " . $targetFile);
					$result['success'] = 'false';
					$result['msg'] = "No se pudo mover el archivo: " . $targetFile;
            		echo json_encode($result); die();
				}
				
				$str = file_get_contents($targetFile);
        		$pos_xml = strpos($str, '<?xml', 0);
        		$str_clob = substr($str, $pos_xml);
        		
        		error_reporting(E_ALL ^ E_WARNING); 
        		
        		$xml = new SimpleXMLElement($str);
        		$ns = $xml->getNamespaces(true);
        		$xml->registerXPathNamespace('c', $ns['cfdi']);
        		
				if(!isset($ns['tfd'])){//Se valida que el archivo sea valido para el SAT (que sea un CFDI)

					$response = array(
    					'success'   => false,
						'msg' => utf8_decode( 'El archivo XML no es un archivo de Comprobaci&oacute;n CFDI. El archivo NO cuenta con un Folio Fiscal certificado por el SAT.' )
					);

					echo json_encode($response); die();
				}
        		
				$xml->registerXPathNamespace('t', $ns['tfd']);
				
				$implocal = 0;
				if( isset($ns['implocal']) ) {
				  $xml->registerXPathNamespace('l', $ns['implocal']);
				  $implocal = 1;
				}
				
				$total = '';
				
				// Leer la version
				foreach ($xml->xpath('//cfdi:Comprobante') as $cfdiComprobante)
				{ 
					$version = $cfdiComprobante['version'];
					if($version == ""){
						$version = $cfdiComprobante['Version'];
					}
				}
                // Identifico el UUID de la factura
				foreach ($xml->xpath('//t:TimbreFiscalDigital') as $tfd) 
				{
					$uuid = (isset($tfd['UUID']))?$tfd['UUID']:''; 
				}
				
				if($uuid == ""){//Se valida que el archivo sea una factura
					
					$response = array(
    					'success'   => false,
						'msg' => utf8_decode( 'El archivo XML cargado no corresponde a una factura.' )
					); 
				
					echo json_encode($response); die();
				}
				
				$Comproba = new Gastos_Model_Comprobacion();
    			$comprobacion = $Comproba->getDetalleComprobante( $uuid );

    			if($comprobacion && $comprobacion[0]['EXISTE'] != $solicitudid && $uuid != 'UUID' ){//Se valida que el comprobante no haya sido cargado con anterioridad
    				$idGastoRepite = $comprobacion[0]['EXISTE'];
    				
    				$response = array(
    					'success'   => false,
						'msg' => utf8_decode( 'El archivo XML ya se ha cargado en el Gasto '.$idGastoRepite )
					);
				
					echo json_encode($response); die();
					
    			}
    			
				foreach ($xml->xpath('//cfdi:Comprobante') as $cfdiComprobante)
				{
					if( $version == '3.3' ) {
						$fecha = $cfdiComprobante['Fecha'];
						$fecha = date('d/m/Y' ,strtotime($fecha)); 
						$folio = $cfdiComprobante['Folio']; 
						$total = $cfdiComprobante['Total'];
						$subTotal = $cfdiComprobante['SubTotal']; 
			        	$serie = $cfdiComprobante['Serie']; 
			        	$factura = $serie . $folio;
					} else { 
						$fecha = $cfdiComprobante['fecha'];
						$fecha = date('d/m/Y' ,strtotime($fecha)); 
						$folio = $cfdiComprobante['folio']; 
						$total = $cfdiComprobante['total'];
						$subTotal = $cfdiComprobante['subTotal']; 
			        	$serie = $cfdiComprobante['serie']; 
			        	$factura = $serie . $folio;
					}
				}
				
				$concepto = "";
				foreach ($xml->xpath('//cfdi:Conceptos') as $cfdiComprobante)
				{
					foreach ($cfdiComprobante->xpath('//cfdi:Concepto') as $cfdiComprobante)
					{
						if( $version == '3.3' ) {
						$concepto = $cfdiComprobante['Descripcion'];
							$concepto = (strlen($concepto) > 100) ? substr($concepto,0,90).'...' : $concepto;
						} else { 
							$concepto = $cfdiComprobante['descripcion'];
							$concepto = (strlen($concepto) > 100) ? substr($concepto,0,90).'...' : $concepto;
						}
					} 
				}
				
				$isr = 0;
				$iva = 0;
				$ivaRetenido = 0;
				foreach ($xml->xpath('//cfdi:Impuestos') as $cfdiComprobante)
				{ 
					if( $version == '3.3' ) {
						$iva = $cfdiComprobante['TotalImpuestosTrasladados'];
					} else {
						$iva = $cfdiComprobante['totalImpuestosTrasladados'];
					}
				}
                //Si no devolvio ningun resultado declaro el iva en cero
                if($iva == NULL || empty($iva) || $iva == 0){ 
                    $iva=0.00;  
                }

                foreach ($cfdiComprobante->xpath('//cfdi:Retencion') as $cfdiRetencion)
				{
					if( isset($cfdiRetencion['impuesto']) && $cfdiRetencion['impuesto'] == "ISR" ){
						$isr = $cfdiRetencion['importe'];
						$isr = trim($isr);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}
					if( isset($cfdiRetencion['Impuesto']) && $cfdiRetencion['Impuesto'] == "001" ){
						$isr = $cfdiRetencion['Importe'];
						$isr = trim($isr);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}
					
					if( isset($cfdiRetencion['impuesto']) && $cfdiRetencion['impuesto'] == "IVA" ){
						$ivaRetenido = $cfdiRetencion['importe'];
						$ivaRetenido = trim($ivaRetenido);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}
					if( isset($cfdiRetencion['Impuesto']) && $cfdiRetencion['Impuesto'] == "002" ){
						$ivaRetenido = $cfdiRetencion['Importe'];
						$ivaRetenido = trim($ivaRetenido);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}

				}
				
				if ( $implocal == 1 ) {
				foreach ($xml->xpath('//l:RetencionesLocales') as $cfdiRetencion)
				{ 
					if( $cfdiRetencion['ImpLocRetenido'] == "ISR" ){
						$isr = $cfdiRetencion['Importe'];
						$isr = trim($isr);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}
					
					if( $cfdiRetencion['ImpLocRetenido'] == "IVA" ){
						$ivaRetenido = $cfdiRetencion['Importe'];
						$ivaRetenido = trim($ivaRetenido);
						$tipoComprobanteValidado = 'Recibo de honorarios';
					}
				}
				}
				if($tipoComprobante == "Factura" && $tipoComprobanteValidado !== "Factura"){
					$response = array(
    					'success'   => false,
						'msg' => utf8_decode( 'El comprobante seleccionado es un <b>Recibo de Honorarios</b> ya que contien un total del ISR de: '.$isr )
					);
					echo json_encode($response); die();
				}
				
				if($tipoComprobante == "Recibo de honorarios" && $tipoComprobanteValidado !== "Recibo de honorarios"){
					echo '<div class="alert alert-error">
		              <button type="button" class="close" data-dismiss="alert">×</button>
		              <strong>Comprobante incorrecto!</strong>El comprobante seleccionado no es un Recibo de honorarios. Verifique.</div>';exit;
				}
				
				foreach ($xml->xpath('//cfdi:Emisor') as $cfdiComprobante)
				{ 
					if( $version == '3.3' ) {
						$rfcEmisor = utf8_encode($cfdiComprobante['Rfc']); 
         				$nombreEmisor = utf8_encode($cfdiComprobante['Nombre']);
					} else {
						$rfcEmisor = utf8_encode($cfdiComprobante['rfc']); 
         				$nombreEmisor = utf8_encode($cfdiComprobante['nombre']);
					}
				}
				
				foreach ($xml->xpath('//cfdi:Receptor') as $cfdiComprobante)
				{ 
					if( $version == '3.3' ) {
         				$rfcReceptor = utf8_encode($cfdiComprobante['Rfc']);
						$nombreReceptor = utf8_encode($cfdiComprobante['Nombre']);
					} else {
						$rfcReceptor = utf8_encode($cfdiComprobante['rfc']);
						$nombreReceptor = utf8_encode($cfdiComprobante['nombre']);
					}
				}
				
				$mensaje = "";
/*
				if($rfcReceptor != $rfcEmpresa && $rfcReceptor != 'BBA830831LJ2'){
					$response = array(
    					'success'   => false,
						'msg' => utf8_decode( 'La empresa Receptor es incorrecto. Debe ser: ' . $rfcEmpresa . ' - ' . $nombreEmpresa )
					);
					echo json_encode($response); die();
				} 
*/  
				$nombreEmisor = str_replace("&",utf8_encode("&"),$nombreEmisor);
				$nombreEmisor = str_replace("amp;",utf8_encode(""),$nombreEmisor);
				$nombreEmisor = str_replace(",","",$nombreEmisor);
				$nombreEmisor = str_replace(".","",$nombreEmisor);

				$path = 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' . $nombreArchivo;

				$Comproba = new Gastos_Model_Comprobacion();
				$resActualiza = $Comproba->setComprobanteXml($comprobanteId, $nombreArchivo, $path, $uuid);
				
				$response = array(
					'success'   => true,
					'ruta' => $path,
					'msg' => $resActualiza
				);

				echo json_encode($response); die();
			} else {
				$result['success'] = 'false';
            	$result['msg'] = "Tipo de archivo no permitido.";
            	echo json_encode($result); die();
			}
		} else {
			$result['success'] = 'false';
	        $result['msg'] = "Archivo no recibido. Intente de nuevo.";
	        echo json_encode($result); die();
		}	
    	} catch( Exception $e) {
    		$result['success'] = 'false';
			$result['msg'] = "Excepción: " . $e->getMessage();
            echo json_encode($result); die();
    	}
    }
    
    public function updateXmlAction() {
    	$this->_helper->layout->disableLayout();

    	$params = $this->getRequest()->getParams();
		$solicitudid = $this->getRequest()->getParam('solicitudid','');
    	$comprobanteId = $this->getRequest()->getParam('comprobanteId','');
    	$uuid = $this->getRequest()->getParam('uuid','');
    	$rfcemisor = $this->getRequest()->getParam('rfcemisor','');
    	
    	
    	$nombreArchivo = $solicitudid . "_" . $comprobanteId.'.xml';
		$path = 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' . $nombreArchivo;

    	$Comproba = new Gastos_Model_Comprobacion();
    	$result = $Comproba->updateUUIDxml( $solicitudid, $comprobanteId, $uuid, $rfcemisor, $path );
    	
    	echo json_encode($result); die();
    }
    
    public function uploadfilepdfAction()
    {
    	$this->_helper->layout->disableLayout();	
    	
   		$host = 'doc.pendulum.com.mx';
    	$output = $this->ping($host);
    	if ($output === false) {
    		echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
	       	    <strong>Error!</strong> Ha ocurrido un error al conectarse al servidor de documentos. Intente en otro momento. </div>';
			exit();
    	}
    	
    	// Define a destination
    	$targetFolder = "/opt/processmaker/shared/sites/workflow/files/gastos/comprobacion/";
    	
    	$ip = $_SERVER['SERVER_ADDR'];

            
    	if($ip == "quantum2.pendulum.com.mx"){
            $ip = "quantum1.pendulum.com.mx";
        }
       $ip = "quantum1.pendulum.com.mx";//Seteamos por default
    	$params = $this->getRequest()->getParams();
		//$solicitudid = $params['solicitudid'];
		$solicitudId = $this->getRequest()->getParam('solicitudId','');
    	$comprobanteId = $this->getRequest()->getParam('comprobanteId','');
    	$pdfcomp = $this->getRequest()->getParam('pdfcomp','');

    	//echo "solicitudId: " . $solicitudId . "-" . "comprobanteId: " . $comprobanteId;exit;
    	if (!empty($_FILES)) {
			$tempFile = $_FILES['Filedata']['tmp_name'];
			$targetPath = $targetFolder; //$_SERVER['DOCUMENT_ROOT'] . $targetFolder;
			// Validate the file type
			$fileTypes = array('pdf', 'PDF','xml', 'XML'); // File extensions
			//$fileTypes = array('pdf', 'csv', 'xls', 'xlsx', 'txt', 'doc');
			$fileParts = pathinfo($_FILES['Filedata']['name']);
			//$targetFile = rtrim($targetPath,'/') . '/' . $_FILES['Filedata']['name'];
			$nombreArchivo = "" . $solicitudId . "_" . $comprobanteId . "." . $fileParts['extension'];
    		if( $pdfcomp == 1 ) {
				$nombreArchivo = "" . $solicitudId . "_" . $comprobanteId . "_C." . $fileParts['extension'];
			}
			//var_dump($nombreArchivo);exit;
			$targetFileFis = rtrim($targetPath,'/') . "/" . $solicitudId . "_" . $comprobanteId . "." . $fileParts['extension'];
    		if( $pdfcomp == 1 ) {
				$targetFileFis = rtrim($targetPath,'/') . "/" . $solicitudId . "_" . $comprobanteId . "_C." . $fileParts['extension'];
			}
			$targetFile = 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' . $solicitudId . "_" . $comprobanteId . "." . $fileParts['extension'];
    		if( $pdfcomp == 1 ) {
				$targetFile = 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' . $solicitudId . "_" . $comprobanteId . "_C." . $fileParts['extension'];
			}	
			//var_dump($targetFile);exit;
                     $fileName = $_FILES['Filedata']['name'];
			if (in_array( strtolower($fileParts['extension']) ,$fileTypes)) {
				$up = move_uploaded_file($tempFile,$targetFileFis);
				if( !$up ){
					throw new Exception("No se pudo mover el archivo: " . $targetFile);
					$result['success'] = 'false';
					$result['msg'] = "No se pudo mover el archivo: " . $targetFile;
            		echo json_encode($result); die();
				}
				$tipo = $fileParts['extension'];
				$Comproba = new Gastos_Model_Comprobacion();
				if( $pdfcomp == 1 ) {
					$tipo = 'PDFC';
				}
		    	$resActualiza = $Comproba->setComprobantePdf( $comprobanteId, $nombreArchivo,$targetFile,$tipo);
		    	//var_dump($resGuardar);exit;
		    	
		    	$result['success'] = 'true';
			    $result['msg'] = "Comprobante guardado correctamente.";
			    $result['info'] = $resActualiza;
			    echo json_encode($result);
			    die();
			}
    	}
    }
    
    public function agregacomprobanteAction()
    {
    	$this->_helper->layout->disableLayout();
    	//$data = $this->getRequest()->getParam('gastoId', 0);
    	
    	$gastoId = $this->getRequest()->getParam('gastoId', 0);
    	$uuid = $this->getRequest()->getParam('uuid', 0);
    	$nombreArchivo = $this->getRequest()->getParam('nombreArchivo', "");
    	$tipoComprobante = $this->getRequest()->getParam('tipoComprobante', 0);
    	$noFactura = $this->getRequest()->getParam('noFactura', 0);
    	$nombreEmisor = $this->getRequest()->getParam('nombreEmisor', 0);
    	$rfcEmisor = $this->getRequest()->getParam('rfcEmisor', 0);
    	$fechaFactura = $this->getRequest()->getParam('fechaFactura', 0);
    	$concepto = $this->getRequest()->getParam('concepto', 0);
    	$importe = $this->getRequest()->getParam('importe', 0);
    	$iva = $this->getRequest()->getParam('iva', 0);
    	$importeIva = $this->getRequest()->getParam('importeIva', 0);
    	$importeTotal = $this->getRequest()->getParam('importeTotal', 0);
    	$ivaRetenido = $this->getRequest()->getParam('ivaRetenido', 0);
    	$isr = $this->getRequest()->getParam('isr', 0);
    	$descuentonoimporte = $this->getRequest()->getParam('descuentonoimporte', 0);
    	$descuentoimporte = $this->getRequest()->getParam('descuentoimporte', 0);
    	$otrosImpuestos = $this->getRequest()->getParam('otrosImpuestos', 0);
    	
    	$concepto = str_replace("'", '', $concepto);
    	
    	//$archivoXml = $_SERVER['DOCUMENT_ROOT'] . '/file_external/GASTOS/' . $nombreArchivo;
    	$archivoXml = '/opt/processmaker/shared/sites/workflow/files/gastos/comprobacion/' . $nombreArchivo;
    	$rutaComprobante = "";
    	
    	if( $descuentoimporte == '' ){ $descuentoimporte = 0; }
    		
    	if( $descuentonoimporte == '' ) {$descuentonoimporte = 0; }
    	
    	$campos = "IDGASTOMAIN,IDCOMPROBACION,IDUSUARIO,FDFECREGISTRO,FCTIPOCOMPROBANTE,FCRFC,FCNOFACTURA,FNIMPORTE,FNPRIMERIMPORTE,FNIVA,FNDESCSIAFECTA,FNDESCNOAFECTA";
    	$valores = "$gastoId,PENDUPM.SEQFACCOMPROBA.NEXTVAL,0,SYSDATE,'$tipoComprobante','$rfcEmisor','$noFactura',$importe,$importe,$iva,$descuentoimporte,$descuentonoimporte";
    	
    	if( $otrosImpuestos != 0 ){
    		$campos .= ",FNOTROSIMPUEST";
    		$valores .= ",$otrosImpuestos";  
    	} else{
    		$campos .= ",FNOTROSIMPUEST";
    		$valores .= ",0"; 
    	}
    	
    	if( $ivaRetenido != 0 ){
    		$campos .= ",FNIVARET";
    		$valores .= ",$ivaRetenido";  
    	} else{
    		$campos .= ",FNIVARET";
    		$valores .= ",0"; 
    	}
    	
    	if( $isr != 0 ){
    		$campos .= ",FNISR";
    		$valores .= ",$isr";  
    	} else {
    		$campos .= ",FNISR";
    		$valores .= ",0";
    	}
    	
    	if( $importeIva != 0 ){
    		$campos .= ",FNIMPIVA";
    		$valores .= ",$importeIva";  
    	} else {
    		$campos .= ",FNIMPIVA";
    		$valores .= ",0";
    	}

    	if( $uuid != 0 || $uuid != ""){
    		$campos .= ",UUID";
    		$valores .= ",'$uuid'";  
    	}
    	if( $nombreArchivo != 0 ){
    		$campos .= ",NMORIGXML";
    		$valores .= ",'$nombreArchivo'";  
    	}
    	
    	$campos .= ",FNTOTAL,FCCONCEPTO,FDCOMPROBACION,NMRFC";
    	$valores .= ",$importeTotal,'$concepto',TO_DATE('$fechaFactura', 'dd-mm-yyyy'),'$nombreEmisor'"; 
    	
    	if ( $nombreArchivo != "" && file_exists($archivoXml) ) {
		    $str = file_get_contents( $archivoXml );
			$pos_xml = strpos($str, '<?xml', 0);
			$str_clob = substr($str, $pos_xml);
			$str_clob = str_replace("&",utf8_encode("&"),$str_clob);
            $str_clob = str_replace("amp;",utf8_encode(""),$str_clob);
            $str_clob = str_replace("'",utf8_encode('"'),$str_clob);
            
            $ip = $_SERVER['SERVER_ADDR'];

            
    		if($ip == "quantum2.pendulum.com.mx"){
            	$ip = "quantum1.pendulum.com.mx";
            }
            $ip = "quantum1.pendulum.com.mx";//Seteamos por default
            $targetFile = 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' . $nombreArchivo;
            
            $declararVar = "DECLARE  paso CLOB := empty_clob;";
            
            $campos .= ",FCCONTENIDOXML,FDARCHIVOXML,FCARCHIVOXML";
    		$valores .= ",paso,SYSDATE,'$targetFile'";

    		$query = "DECLARE paso CLOB := empty_clob; BEGIN paso := '$str_clob'; INSERT INTO PENDUPM.FACTURACIONCOMPROBA ($campos) VALUES($valores); COMMIT; END;";
		} else{
			$query = "BEGIN INSERT INTO PENDUPM.FACTURACIONCOMPROBA ($campos) VALUES($valores); COMMIT; END;";
		}
		//if ($gastoId == 4060360) {
		//	die($query);
		//}
    	//
    	/*
    	$query = "INSERT INTO PENDUPM.FACTURACIONCOMPROBA (IDGASTOMAIN,
		FDFECREGISTRO,
		FCTIPOCOMPROBANTE,
		FCRFC,
		FCNOFACTURA,
		FNIMPORTE,
		FNIVA,
		FNOTROSIMPUEST,
		FNIVARET,
		FNISR,
		FNTOTAL,
		FCARCHIVOXML,
		FDARCHIVOXML,
		FCCONCEPTO,
		FDCOMPROBACION,
		NMRFC,
		UUID) VALUES(
		$gastoId,
		'$noFactura',
		SYSDATE,
		'$tipoComprobante',
		'$rfcEmisor',
		'$noFactura',
		$importe,
		$iva,
		$otrosImpuestos,
		$ivaRetenido,
		$isr,
		$importeTotal,
		$rutaComprobante,
		'$fechaFactura',
		'$concepto',
		'$fechaFactura',
		'$rfcEmisor'
		)";
		*/
		//echo $query;exit;
		$Comproba = new Gastos_Model_Comprobacion();
    	$resGuardar = $Comproba->setComprobanteGasto( $query );
    	//var_dump($resGuardar);exit;
    	
    	$result['success'] = 'true';
	    $result['msg'] = "Comprobante guardado correctamente.";
	    $result['info'] = $resGuardar;
	    echo json_encode($result);
	    die();
    }
    
    public function borracomprobanteAction()
    {
    	$this->_helper->layout->disableLayout();
    	//$data = $this->getRequest()->getParam('gastoId', 0);
    	
    	$comprobanteId = $this->getRequest()->getParam('idcomprobante', 0);
    	
    	$Comproba = new Gastos_Model_Comprobacion();
    	$resBorrar = $Comproba->delComprobanteGasto( $comprobanteId );
    	//var_dump($resGuardar);exit;
    	$result['success'] = 'true';
	    $result['msg'] = "Comprobante borrado correctamente.";
	    $result['info'] = $resBorrar;
	    echo json_encode($result);
	    die();
    }
    
	public function getcomprobantesdetalleAction()
    {
    	$this->_helper->layout->disableLayout();
    	
    	$gastoId = $this->getRequest()->getParam('casoId', 0);
    	$numCompro = $this->getRequest()->getParam('numCompro', 0);

    	$Comproba = new Gastos_Model_Comprobacion();
    	//$comprobaciones = $Comproba->getComprobantesPorGasto( $gastoId );
    	$encabezados = $Comproba->getComprobantesEncabezado( $gastoId );
    	//$comprobaciones = $Comproba->getComprobantesPorTipo( $gastoId );
    	
    	$this->view->encabezados = $encabezados;
    	//$this->view->comprobaciones = $comprobaciones;
    	
    	$ip = $_SERVER['SERVER_ADDR'];

    	if($ip == "quantum2.pendulum.com.mx"){
            $ip = "quantum1.pendulum.com.mx";
        } 
    	
    	$tableBody = "";
    	$granTotal = 0;
    	foreach($encabezados as $item):
    		$granTotal += $item['TOTAL'];
    		if($item['TOTAL'] > 0){
    			$clstpoComp = str_replace(' ', '_', $item['FCTIPOCOMPROBANTE'] );
    			$tableBody .= '<thead>
							    	<tr style="background-color: #343467;color: #FFF;">
							      		<th colspan="11">' . $item['FCTIPOCOMPROBANTE'] . '</th>
							      		<th colspan="8">$ ' . $item['TOTAL'] . '</th>
							    	</tr>
							    	<tr>
							      		<th>Fecha</th>
							      		<th>Concepto</th>
							      		<th>Serie/Folio</th>
							      		<th>Proveedor</th>
							      		<th>RFC</th>
							      		<th>Monto</th>
							      		<th>IVA</th>
							      		<th>ISR</th>
							      		<th>Otros</th>
							      		<th>Desc. al importe</th>
							      		<th>Desc.</th>
							      		<th>Total</th>';
							      		if( $item['FCTIPOCOMPROBANTE'] == 'Comprobante' ) {
											$tableBody .= '<th>PDF Comp</th>';
											if( $numCompro == '3' ) {
												$tableBody .= '<th><input type="checkbox" class="allCheck allCheckPdfc" data-tipo="'.$clstpoComp.'"><br>V</th>';
							      			}
							      		}else if( $item['FCTIPOCOMPROBANTE'] == 'Fecha ejecucion' ) {

											$tableBody .= '<th>'.$item['FCTIPOCOMPROBANTE'].'</th>';

							      		} else { $tableBody .= '<th></th>';
							      			if( $numCompro == '3' ) {
												$tableBody .= '<th></th>';
							      			} 
							      		}
					     		$tableBody .= '<th>XML</th>';
					     					if( $numCompro == '3' ) {
												$tableBody .= '<th><input type="checkbox" class="allCheck allCheckXml" data-tipo="'.$clstpoComp.'"><br>V</th>';
							      			}
						 		$tableBody .= '<th>PDF</th>';
    										if( $numCompro == '3' ) {
												$tableBody .= '<th><input type="checkbox" class="allCheck allCheckPdf" data-tipo="'.$clstpoComp.'"><br>V</th>';	      		
							      			}
							      		if( $numCompro == '0' || $numCompro == '2' ) {
											$tableBody .= '<th>Acción</th>';	      		
							      		} 
							      		
							    	$tableBody .= '</tr>
							  	</thead>';
    			$comprobaciones = $Comproba->getComprobantesPorTipo( $gastoId, $item['FCTIPOCOMPROBANTE'], $ip );
    			$tableBody .= '<tbody>';
    			foreach($comprobaciones as $comproba):
    				$btnRemovePdf = ''; $btnRemoveXml = ''; $btnRemovePdfc = '';

    				$tableBody .= '<tr>
							    <td>' . $comproba['FDFECREGISTRO'] . '</td>
							    <td>' . $comproba['FCCONCEPTO'] . '</td>
							    <td>' . $comproba['FCNOFACTURA'] . '</td>
							    <td>' . $comproba['NMRFC'] . '</td>
							    <td>' . $comproba['FCRFC'] . '</td>
							    <td style="text-align: right" >$' . $comproba['FNIMPORTE'] . '</td>
							    <td>' . $comproba['FNIVA'] . '%</td>
							    <td>$' . number_format($comproba['FNISR'],2) . '</td>
							    <td>$' . number_format($comproba['FNOTROSIMPUEST'],2) . '</td>
							    <td>$' . number_format($comproba['FNDESCSIAFECTA'],2) . '</td>
							    <td>$' . number_format($comproba['FNDESCNOAFECTA'],2) . '</td>
								<td style="text-align: right">$' . $comproba['FNTOTAL'] . '</td>';

    				$comproba['FCARCHIVOXML'] = str_replace('http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=', 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/', $comproba['FCARCHIVOXML']);
    				$comproba['FCARCHIVOPDF'] = str_replace('http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=', 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/', $comproba['FCARCHIVOPDF']);
    				$comproba['FCARCHIVOPDFC'] = str_replace('http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=', 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/', $comproba['FCARCHIVOPDFC']);
    				
    							if( $numCompro == '2' && $comproba['PDFV'] == 'S' ) {
									$btnRemovePdf  = '<span class="btndeletefile icon-trash" idrel="'.$comproba['IDCOMPROBACION'].'" data-tipo="pdf" title="Remover archivo" ></span>';
    							}
    							$classDelete = 'btndeletefile';
    							if ( $item['FCTIPOCOMPROBANTE'] == 'Factura' || $item['FCTIPOCOMPROBANTE'] == 'Recibo de honorarios' ) {
    								$classDelete = 'delcomproba';
    							}
    							if( $numCompro == '2' && $comproba['XMLV'] == 'S' ) {
									$btnRemoveXml  = '<span class="'.$classDelete.' icon-trash" idrel="'.$comproba['IDCOMPROBACION'].'" data-tipo="xml" title="Remover archivo" ></span>';
    							}
    							if( $numCompro == '2' && $comproba['PDFCV'] == 'S' ) {
									$btnRemovePdfc = '<span class="btndeletefile icon-trash" idrel="'.$comproba['IDCOMPROBACION'].'" data-tipo="pdfc" title="Remover archivo"></span>';
								}

							    if( $item['FCTIPOCOMPROBANTE'] == 'Comprobante' ) {
							      	if( $numCompro == '1' ) {
										$btnRemovePdf  = '<span class="btndeletefile icon-trash" idrel="'.$comproba['IDCOMPROBACION'].'" data-tipo="pdf" title="Remover archivo" ></span>';
										$btnRemoveXml  = '<span class="btndeletefile icon-trash" idrel="'.$comproba['IDCOMPROBACION'].'" data-tipo="xml" title="Remover archivo" ></span>';
										$btnRemovePdfc = '<span class="btndeletefile icon-trash" idrel="'.$comproba['IDCOMPROBACION'].'" data-tipo="pdfc" title="Remover archivo"></span>';
									}

							      	if( $numCompro == '3' ) { 
							      		if($comproba['FCARCHIVOPDFC'] != "") {
							      			$check = ''; if($comproba['FCVALPDFC']=='S') { $check = 'checked'; }
							      			$valPDFC = '<td><input class="cbxDocs cbxDocsPdfc '.$clstpoComp.'" '.$check.' name="cbxpdfc" data-comproba="'.$comproba['IDCOMPROBACION'].'" type="checkbox" ></td>';
							      			$docPDFC = '<td><a target="_blank" href="' . $comproba['FCARCHIVOPDFC'] . '">Ver</a></td>';
							      		} else {
							      			$valPDFC = '';
							      			$docPDFC = '<td><a target="_blank" href="' . $comproba['FCARCHIVOPDFC'] . '"></a></td>';
							   			}
							    	} else if ( $numCompro == '4' ) {
							      		$valPDFC = '';
							      		$docPDFC = '<td>' . ($comproba['FCARCHIVOPDFC'] != ""?'<a target="_blank" href="' . $comproba['FCARCHIVOPDFC'] . '">Ver</a>'.$btnRemovePdfc :'<a class="uploadpdfc" idrel="' . $comproba['IDCOMPROBACION'] . '" href="#"></a>') . '</td>';
							      	} else {
							      		$valPDFC = '';
							      		$docPDFC = '<td>' . ($comproba['FCARCHIVOPDFC'] != ""?'<a target="_blank" href="' . $comproba['FCARCHIVOPDFC'] . '">Ver</a>'.$btnRemovePdfc :'<a class="uploadpdfc" idrel="' . $comproba['IDCOMPROBACION'] . '" href="#">Subir</a>') . '</td>';
							      	}
							 		$tableBody .= $docPDFC.$valPDFC;
								} else {
							      	$tableBody .= '<td></td>';
							    }

							      if( $numCompro == '3' ) {
							      	$tableBody .= '<td></td>';
							      	if($comproba['FCARCHIVOXML'] != "") {
							      		$check = ''; if($comproba['FCVALXML']=='S') { $check = 'checked'; }
							      		$valXml = '<td><input class="cbxDocs cbxDocsXml '.$clstpoComp.'" '.$check.' name="cbxxml" data-comproba="'.$comproba['IDCOMPROBACION'].'" type="checkbox" ></td>';
							      		$docXml = '<td><a target="_blank" href="' . $comproba['FCARCHIVOXML'] . '">Ver</a></td>';
							      	} else {
							      		$valXml = '<td></td>';
							      		$docXml = '<td><a target="_blank" href="' . $comproba['FCARCHIVOXML'] . '"></a></td>';
							      	}
							      } else if ( $numCompro == '4' ) {
							      		$valXml = '';
							      		$docXml = '<td>' . ($comproba['FCARCHIVOXML'] != ""?'<a target="_blank" href="' . $comproba['FCARCHIVOXML'] . '">Ver</a>'.$btnRemoveXml :'<a class="uploadxmlc" idrel="' . $comproba['IDCOMPROBACION'] . '" href="#"></a>') . '</td>';
							      } else {
							      	$valXml = '';
							      	$docXml = '<td>' . ($comproba['FCARCHIVOXML'] != ""?'<a target="_blank" href="' . $comproba['FCARCHIVOXML'] . '">Ver</a>'.$btnRemoveXml :'<a class="uploadxmlc" idrel="' . $comproba['IDCOMPROBACION'] . '" href="#">Subir</a>') . '</td>';
							      }

							      $tableBody .= $docXml.$valXml;

    							  if( $numCompro == '3' ) {
							      	if($comproba['FCARCHIVOPDF'] != "") {
							      		$check = ''; if($comproba['FCVALPDF']=='S') { $check = 'checked'; }
							      		$valPdf = '<td><input class="cbxDocs cbxDocsPdf '.$clstpoComp.'" '.$check.'  name="cbxpdf" data-comproba="'.$comproba['IDCOMPROBACION'].'" type="checkbox" ></td>';
							      		$docPdf = '<td><a target="_blank" href="' . $comproba['FCARCHIVOPDF'] . '">Ver</a></td>';
							      	} else {
							      		$valPdf = '<td></td>';
							      		$docPdf = '<td><a target="_blank" href="' . $comproba['FCARCHIVOPDF'] . '"></a></td>';
							      	}
							      } else if ( $numCompro == '4' ) {
							      	$valPdf = '';
							      	$docPdf = '<td>' . ($comproba['FCARCHIVOPDF'] != ""?'<a target="_blank" href="' . $comproba['FCARCHIVOPDF'] . '">Ver</a>'.$btnRemovePdf :'<a class="uploadpdf" idrel="' . $comproba['IDCOMPROBACION'] . '" href="#"></a>') . '</td>';
							      } else {
							      	$valPdf = '';
							      	$docPdf = '<td>' . ($comproba['FCARCHIVOPDF'] != ""?'<a target="_blank" href="' . $comproba['FCARCHIVOPDF'] . '">Ver</a>'.$btnRemovePdf :'<a class="uploadpdf" idrel="' . $comproba['IDCOMPROBACION'] . '" href="#">Subir</a>') . '</td>';
							      }
							      $tableBody .= $docPdf.$valPdf;
//echo $comproba['FCVALPDF'];
							      if( $numCompro == '0' ) {
									$tableBody .= '<td><a href="#" class="delcomproba" idrel="' . $comproba['IDCOMPROBACION'] . '">Borrar</a></td>';
							      } else if($numCompro == '2' && $comproba['XMLV'] == 'S' && ( $item['FCTIPOCOMPROBANTE'] == 'Factura' || $item['FCTIPOCOMPROBANTE'] == 'Recibo de honorarios' ) ){
							      	$tableBody .= '<td><a href="#" class="delcomproba" idrel="' . $comproba['IDCOMPROBACION'] . '">Borrar</a></td>';
							      } else if ( $numCompro == '2' && $comproba['FCVALXML'] == 'S' || $comproba['FCVALPDF'] == 'S' || $comproba['FCVALPDFC'] == 'S' ) {
							      	$tableBody .= '<td></td>';
							      } else if ( $numCompro == '2' && ($comproba['FCVALXML'] != 'S' && $comproba['FCVALPDF'] != 'S' && $comproba['FCVALPDFC'] != 'S') ) {
							      	$tableBody .= '<td><a href="#" class="delcomproba" idrel="' . $comproba['IDCOMPROBACION'] . '">Borrar</a></td>';
							      } 
					     		  $tableBody .= '</tr>';
    			endforeach;
    			$tableBody .= '</tbody>';
    		}
    			
    	endforeach;
    	$tableBody .= '<tfoot><tr style="background-color: #CCC;"><th colspan="11">Total</th>
						<td colspan="8">$ ' . $granTotal . '</td></tr></tfoot>';

    	$this->view->tableBody = $tableBody;
    }

    public function indexAction()
    {
    	//$this->_helper->layout->disableLayout();
        $this->_helper->layout->setLayout('gastos');
        $params = $this->getRequest()->getParams();
    	//var_dump($params);exit;
    	$empleadoid = isset($params['empleadoid'])?$params['empleadoid']:'20066';
        $solicitudid = isset($params['solicitudid'])?$params['solicitudid']:'113891';
		$tipocaptura = isset($params['tipocaptura'])?$params['tipocaptura']:0;
        $this->view->solicitudid = $solicitudid;
        $userid = isset($empleadoid)?$empleadoid:'1471';
        $this->view->userid = $userid != "0" ? $userid : 'mmendoza';
        $this->view->tipocaptura = $tipocaptura != "0" ? $tipocaptura : '0';
    }
	
	public function getdetallecomprobacionAction()
	{
		$this->_helper->layout->disableLayout();
		
		$params = $this->getRequest()->getParams();
		$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
    	$Comproba = new Gastos_Model_Comprobacion();
    	$comprobaciones = $Comproba->getDetalleComprobacion( $solicitudid );
    	$hayPagoServ = $Comproba->getHayPagosServicios( $solicitudid );
    	//die('Jdsdsdsdsdsdsdsds');
    	//var_dump($hayPagoServ);exit;
    	$this->view->comprobaciones = $comprobaciones;
    	$this->view->haypagoserv = $hayPagoServ;
    	
    	$tipocaptura = isset($params['tipocaptura'])?$params['tipocaptura']:0;
    	$tipocapturaLabel = 'Cuenta / Cartera / Importe';
    	if( $tipocaptura == "2" || $tipocaptura == "3" ){
    		$tipocapturaLabel = 'Cuenta';
    	}
		if( $tipocaptura == "4"){
    		$tipocapturaLabel = 'Cartera';
    	}
		if( $tipocaptura == "42"){
    		$tipocapturaLabel = 'Importe';
    	}
    	
    	$comprobantes = $Comproba->getComprobantesPorGasto( $solicitudid );
    	$this->view->comprobantes = $comprobantes;
    	$this->view->tipocapturaLabel = $tipocapturaLabel;
    	$this->view->tipocaptura = $tipocaptura;
	}
	
	public function setcomprobacionAction()
	{
		$params = $this->getRequest()->getParams();
		//var_dump($params);exit;
    	$arrayCreditos = explode("|", $params['creditos']);
    	$arrayImportes = explode("|", $params['importes']);
    	$arrayConceptos = explode("|", $params['conceptos']);
    	$arrayComprobantes = explode("|", $params['comprobantes']);
       $arrayFechaComproba = explode("|", $params['fechacomproba']);
    	$gastoid = $params['gastoid'];

    	$sql="DECLARE ASIGNACONCEPTOS PENDUPM.PCKFACTURACIONGASTO.TABASIGNACOMP; BEGIN ";
    	$indicador = 1;
    	
    	if (is_array($arrayCreditos)) {
	    	 for($i = 0; $i <= count($arrayCreditos) - 2; $i++){
	    	 	$numeroDeComprobante = (int)$arrayComprobantes[$i];
	    	 	
	    	 	$sql.="ASIGNACONCEPTOS({$indicador}).rIdGasto := {$gastoid};";
				$sql.="ASIGNACONCEPTOS({$indicador}).rConcepto := {$arrayConceptos[$i]};";
				$sql.="ASIGNACONCEPTOS({$indicador}).rCredito := '{$arrayCreditos[$i]}';";
				$sql.="ASIGNACONCEPTOS({$indicador}).rImporteCom := {$arrayImportes[$i]};";
				$sql.="ASIGNACONCEPTOS({$indicador}).rComprobanteId := {$numeroDeComprobante};";
                            $sql.="ASIGNACONCEPTOS({$indicador}).rFechaComproba := '{$arrayFechaComproba[$i]}';";
	    	 	$indicador++;
	    	 }
    	 }
		$sql.="PENDUPM.PCKFACTURACIONGASTO.setAsignacomprobacion(ASIGNACONCEPTOS, :statAplica); END;";
//var_dump($sql);exit;
    	$Comproba = new Gastos_Model_Comprobacion();
    	$psError = $Comproba->setComprobacion($sql);
    	
    	//var_dump($psError);exit;
		if( $psError == "0") {
        	$response['respuesta'] = 'success';
        	$response['msj'] = $psError;
        } else {
        	$response['respuesta'] = 'fail';
        	$response['msj'] = $psError;
        }
        echo json_encode($response);
        die();
	}
	
	public function setpagosserviciosAction()
	{
		$params = $this->getRequest()->getParams();
		
		$gastoid = $this->getRequest()->getParam('gastoid','');
		$credito = $this->getRequest()->getParam('creditos','');
		$valor = $this->getRequest()->getParam('valor','');
		$concepto = $this->getRequest()->getParam('conceptos','');
		$fechacomproba = $this->getRequest()->getParam('fechacomproba','');
		$tipo = $this->getRequest()->getParam('tipo','');
		$all = $this->getRequest()->getParam('all',0);
		
		$campo = '';
		if ($tipo == 'fecharealpago'){
			$campo = 'FDFECREALPAGO';
			$valor = "TO_DATE('$valor', 'DD/MM/YYYY')";
		}
		if ($tipo == 'remesa'){
			$campo = 'FCREMESA';
			$valor = "'$valor'";
		}
		if ($tipo == 'serviciodel'){
			$campo = 'FDFECSERVPAGADODEL';
			$valor = "TO_DATE('$valor', 'DD/MM/YYYY')";
		}
		if ($tipo == 'servicioal'){
			$campo = 'FDFECSERVPAGADOAL';
			$valor = "TO_DATE('$valor', 'DD/MM/YYYY')";
		}
		if ($tipo == 'pagadoanteriormente'){
			$campo = 'FCPAGADOPREVIAMENTE';
			$valor = "'$valor'";
		}
		if ($tipo == 'fpagoanterior'){
			$campo = 'FDFECCUMBREPAGO';
			$valor = "TO_DATE('$valor', 'DD/MM/YYYY')";
		}
		if ($tipo == 'comentario'){
			$campo = 'FCCOMENTARIOPAGOSERV';
			$valor = "'$valor'";
		}
		
		if ( $all == 0 && $fechacomproba!= '') {
			$sql="BEGIN UPDATE PENDUPM.FACTURAASIGNACION SET $campo = $valor WHERE IDGASTOMAIN = $gastoid
                AND IDCONCEPTO = $concepto
                AND FCCREDITOCARTERA = '$credito'
                AND TO_CHAR(FDFECREGISTRO, 'DDMMYYYYHH24MISS') = '$fechacomproba'; COMMIT; END;";
		} else if ( $all == 1 && $fechacomproba!= '' ) {
			$sql="BEGIN UPDATE PENDUPM.FACTURAASIGNACION SET $campo = $valor WHERE IDGASTOMAIN = $gastoid; COMMIT; END;";
		} else {
			$response['respuesta'] = 'success';
        	$response['msj'] = 'Sin registros modificados';
        	echo json_encode($response);
        	exit;
		}
			
    	$Comproba = new Gastos_Model_Comprobacion();
    	$psError = $Comproba->setPagosServicios($sql);

		if( $psError ) {
        	$response['respuesta'] = 'success';
        	$response['msj'] = $psError;
        } else {
        	$response['respuesta'] = 'fail';
        	$response['msj'] = $psError;
        }
        echo json_encode($response);
        die();
	}

	public function rutearpendientesAction()
	{
		$Comprobacion = new Gastos_Model_Comprobacion();
		$gastos = $Comprobacion->getPendientesComprobacion();
		//var_dump($gastos);exit;
		if(count($gastos) > 0){
			$this->derivaCasos($gastos);
		} else{
			echo '<b>No hay gastos por derivar</b>';exit;
		}		
		
	}

	private function derivaCasos( $arr_planes )
	{
		ini_set('max_execution_time', 0); //300 seconds = 5 minutes
       //require_once 'Zend/Soap/Client.php';
       $wsdl="http://MXVLSQL04P.pendulum.com.mx/sysworkflow/en/green/services/wsdl2";
       $client = new Zend_Soap_Client($wsdl,array('soap_version' => SOAP_1_1));
       $client->setEncoding('ISO-8859-1');
       $params = array('userid'=>'entesoreria','password'=>'S1st3ma5');
       $respObj = $client->login($params);
	   
       $mensaje = "0";
       $salida = "";
       try{
       //var_dump($respObj->status_code);exit;
       if($respObj->status_code == 0){ // si el login es exitoso
       		$idSession = $respObj->message;
			
       		foreach($arr_planes as $item) {
       			//var_dump($item);exit;
            	$arr_caso = array('sessionId' => $idSession, 'caseId' => $item['APP_UID'], 'delIndex' => $item['DEL_INDEX']);
            	$idgasto = $item['IDGASTOMAIN'];
            	//Se ejecuta la derivación
            	$respDeriva = $client->routeCase($arr_caso);
            	//Fin de la derivacion
                $mensaje = $respDeriva->message;
                $status = $respDeriva->status_code;
                if($status == 0){
                	$salida .= "========> caso $idgasto -> Status : $status, $mensaje<br/>\n";
                }
				//$salida .= "<br/>\n----------------------------------------------------------<br/>\n";
				//exit;
           	}
       	} else {
       		echo "Error -> No se ha podido loguear a ProccessMaker<br/>\n";
       	}
       	$salida .= "Fin del enrutamiento....<br/>\n";
       	echo $salida;exit;
       }catch (Exception $e){echo $e->getMessage(); exit;}
	}

	public function setuuidcomprobantesAction()
	{
		$Comprobacion = new Gastos_Model_Comprobacion();
		$comprobantes = $Comprobacion->getComprobantesSinUuid();
		
		$idGasto = '0';
		$idComprobante = '0';
		$clob = null;
		$uuid = '';
		$gastoSinUuid = '';
		foreach($comprobantes as $row):
			$idGasto = $row['IDGASTOMAIN'];
			$idComprobante = $row['IDCOMPROBACION'];
//echo 'Gasto:' . $idGasto . ', idComprobante:' . $idComprobante . 'y Uuid:';exit;

			$clob = $row['FCCONTENIDOXML']->load();
			try{
			$xmlR = new SimpleXMLElement(utf8_encode($clob));
			}catch(Exception $e){ continue; //var_dump( $e );exit;
			}
                     if( is_object($xmlR) ){
			$repetido = $xmlR->xpath('//cfdi:Comprobante');
			$ns = $xmlR->getNamespaces(true);
			$cfdi = (isset($ns['cfdi'])?$ns['cfdi']:''); 
			$tfd = (isset($ns['tfd'])?$ns['tfd']:'');
			$xmlR->registerXPathNamespace('c', $cfdi);
			$xmlR->registerXPathNamespace('t', $tfd);
//echo 'Gasto:' . $idGasto . ', idComprobante:' . $idComprobante . 'y Uuid:**__';exit;
			foreach ($xmlR->xpath('//t:TimbreFiscalDigital') as $tfd) 
			{
				$uuid = (isset($tfd['UUID'])?$tfd['UUID']:'');// $tfd['UUID']; 
			}
			//echo 'Gasto:' . $idGasto . ', idComprobante:' . $idComprobante . 'y Uuid:'.$uuid;exit;
			if($uuid !== ''){
				$resActualiza = $Comprobacion->setUuidComprobante( $idGasto, $idComprobante,$uuid);
			} else {
				$gastoSinUuid .= $idGasto . '-' . $idComprobante . '</br>';
			}
		}

			//break;
		endforeach;
		//echo 'Gasto:' . $idGasto . ', idComprobante:' . $idComprobante . 'y Uuid:' . $uuid;exit;
		echo 'Gastos sin UUID:' . '</br>';
		echo $gastoSinUuid;
	}


// ================================================================================================================================================
// ===================================================  VIATICOS ==================================================================================
// ================================================================================================================================================

	// Pantalla de Inicio
	public function pantallacomprobaViaticosAction()
	{
		//$this->_helper->layout->disableLayout();
		$this->_helper->layout->setLayout('planviaje');
		$params = $this->getRequest()->getParams();

		$empleadoid = isset($params['empleadoid'])?$params['empleadoid']:'1471';
		$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:'113891';
		$this->view->tipo = isset($params['tipo'])?$params['tipo']:'0';
		
		$this->view->solicitudid = $solicitudid;
		$userid = isset($empleadoid)?$empleadoid:'1471';
		$this->view->userid = $userid != "0" ? $userid : 'mmendoza';

		$Comproba = new Gastos_Model_Comprobacion();

		$infoCaso          = $Comproba->getDatosPV($solicitudid);
		$resTiposGastos    = $Comproba->getTipoGastoPV($solicitudid);
		$resAllTiposGastos = $Comproba->getAllTiposGastoPV();
		$resConcepto       = $Comproba->getConceptoPV();
		$resTpoComprobante = $Comproba->getTpoComprobantePV();
		$datosComprobantes = $Comproba->getDatosComprobadosPV($solicitudid);
		$allPoliticas      = $Comproba->getAllPoliticasPV();

		$this->view->comprobantes    = $datosComprobantes;
		$this->view->conceptos       = $resConcepto;
		$this->view->tipogasto       = $resTiposGastos;
		$this->view->alltipogasto    = $resAllTiposGastos;
		$this->view->tipocomprobante = $resTpoComprobante;
		$this->view->appnumber       = $solicitudid;
		$this->view->infocaso        = (isset($infoCaso[0])) ? $infoCaso[0] : '' ;
		$this->view->allPoliticas    = $allPoliticas;
	}

	public function uploadfileplanviajeAction()
	{
		try{
			$this->_helper->layout->disableLayout();
			
			$host = 'doc.pendulum.com.mx';
    		$output = $this->ping($host);
    		if ($output === false) {
	    		echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
		       		<strong>Error!</strong> Ha ocurrido un error al conectarse al servidor de documentos. Intente en otro momento. </div>';
				exit();
    		}
			
			$targetFolder = "/opt/processmaker/shared/sites/workflow/files/facturas/";

			$params = $this->getRequest()->getParams();
			$solicitudid = $params['solicitudid'];

			$tipoComprobante = $this->getRequest()->getParam('tipoComprobante','');

			$tipoComprobanteValidado = 'Factura';
			$validacion = "0";
    	
			$fechaFile = date("YmdHis");

			if (!empty($_FILES)) {
				$tempFile = $_FILES['Filedata']['tmp_name'];
				$targetPath = $targetFolder; //$_SERVER['DOCUMENT_ROOT'] . $targetFolder;

				// Validate the file type
				$fileTypes = array('xml', 'XML'); // File extensions
				$fileParts = pathinfo($_FILES['Filedata']['name']);

				$nombreArchivo = "" . $solicitudid . "_" . $fechaFile . "." . $fileParts['extension'];
				$targetFile = rtrim($targetPath,'/') . "/" . $solicitudid . "_" . $fechaFile . "." . $fileParts['extension'];
				$fileName = $_FILES['Filedata']['name'];

				if( strlen($fileName) > 42 ) {
					echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
	       	      		 <strong>Archivo erroneo!</strong> El nombre del archivo es demasiado largo. Favor de renombrarlo.</div>';
						exit();
				}

				$fileParts['extension'] = strtolower($fileParts['extension']);
				if (in_array($fileParts['extension'],$fileTypes)) {
					$up = move_uploaded_file($tempFile,$targetFile);
					if( !$up ){
						throw new Exception("No se pudo mover el archivo: " . $targetFile);
						$result['success'] = 'false';
						$result['msg'] = "No se pudo mover el archivo: " . $targetFile;
            					echo json_encode($result); die();
					}

        			//Leer el archivo XML
        			$str = file_get_contents($targetFile);
        			error_reporting(E_ALL ^ E_WARNING); 
        			//$str = str_replace('xmlns:schemaLocation', 'xsi:schemaLocation', $str);
        			
        			$pos_xml = strpos($str, '<?xml', 0);
        			$str_clob = substr($str, $pos_xml);

        			$xml = new SimpleXMLElement($str);
       				//$comprobante = $xml->xpath('//cfdi:Comprobante');
					$ns = $xml->getNamespaces(true);

					if(!isset($ns['cfdi'])){
						echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
	       	      				<strong>Archivo erroneo!</strong> El archivo XML no es un archivo de Comprobaci�n CFDI.</div>';
						exit();
					}

       				$xml->registerXPathNamespace('c', $ns['cfdi']);
					if( isset( $ns['implocal'] ) ) {
						$xml->registerXPathNamespace('p', $ns['implocal']);
					}
					
					if(!isset($ns['tfd'])){
						echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
	       	      				<strong>Archivo erroneo!</strong> El archivo XML no es un archivo de Comprobaci�n CFDI. El archivo NO cuenta con un Folio Fiscal certificado por el SAT. </div>';
						exit();
					}
					
					$xml->registerXPathNamespace('t', $ns['tfd']);
					$total = '';

					// 	Leo la version
					foreach ($xml->xpath('//cfdi:Comprobante') as $cfdiComprobante)
					{	 
						$version = $cfdiComprobante['version'];
						if($version == ""){
							$version = $cfdiComprobante['Version'];
						}
					}
					
					foreach ($xml->xpath('//t:TimbreFiscalDigital') as $tfd) 
					{
						$uuid = (isset($tfd['UUID']))?$tfd['UUID']:''; 
					}
				
					if($uuid == ""){
						echo '<div class="alert alert-error">
						<button type="button" class="close" data-dismiss="alert">×</button>
						<strong>Archivo no valido!</strong> El archivo XML cargado no corresponde a una factura.
						</div>';exit;
					}
				
					$Comproba = new Gastos_Model_Comprobacion();
					$tipogastof = $Comproba->getAllTiposGastoPV( 1 );
					$conceptof = $Comproba->getConceptoPV( 1 );
					$comprobacion = $Comproba->getValidadUuid( $uuid );

					if($comprobacion){
    					$idGastoRepite = $comprobacion[0]['EXISTE'];
						echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
			        		<strong>Archivo repetido!</strong> El archivo XML ya se ha cargado en el Gasto . ' . $idGastoRepite . '</div>';
						exit();
    				}

					$arrComprobante = $xml->xpath('//cfdi:Comprobante');

					if( count($arrComprobante) == 0 ){
						echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
			        		<strong>Archivo repetido!</strong> El archivo XML NO es Valido para Comprobaci�n.</div>';
						exit();
					}
					$factura = "0";
					foreach ($arrComprobante as $cfdiComprobante)
					{ 
						if ( $version == '3.3') {
							$fecha = $cfdiComprobante['Fecha'];
							$fecha = date('d/m/Y' ,strtotime($fecha)); 
							$folio = $cfdiComprobante['Folio']; 
							$total = $cfdiComprobante['Total'];
							$subTotal = $cfdiComprobante['SubTotal']; 
				        	$serie = $cfdiComprobante['Serie']; 
				        	$factura = $serie . $folio;
						} else { 
							$fecha = $cfdiComprobante['fecha'];
							$fecha = date('d/m/Y' ,strtotime($fecha)); 
							$folio = $cfdiComprobante['folio']; 
							$total = $cfdiComprobante['total'];
							$subTotal = $cfdiComprobante['subTotal']; 
				        	$serie = $cfdiComprobante['serie']; 
				        	$factura = $serie . $folio;
						}
					}

					$concepto = "";
					foreach ($xml->xpath('//cfdi:Conceptos') as $cfdiComprobante)
					{
						foreach ($cfdiComprobante->xpath('//cfdi:Concepto') as $cfdiComprobante)
						{
							if ( $version == '3.3') {
								$concepto = $cfdiComprobante['Descripcion'];
								$concepto = (strlen($concepto) > 100) ? substr($concepto,0,90).'...' : $concepto;
							}else {
								$concepto = $cfdiComprobante['descripcion'];
								$concepto = (strlen($concepto) > 100) ? substr($concepto,0,90).'...' : $concepto;
							}
						}
					}

					$isr = 0;
					$ivaRetenido = 0;
					foreach ($xml->xpath('//cfdi:Impuestos') as $cfdiComprobante)
					{ 
						if ( $version == '3.3') {
							$iva = $cfdiComprobante['TotalImpuestosTrasladados'];
						}else {
							$iva = $cfdiComprobante['totalImpuestosTrasladados'];
						}
					}
					$ivaporc = 0;
                    //Si no devolvio ningun resultado declaro el iva en cero
                    if($iva == NULL || empty($iva) || $iva == 0){
                        $iva=0.00;
                    }

                    foreach ($xml->xpath('//cfdi:Traslado') as $ivap)
					{
						if( isset($ivap['impuesto']) && $ivap['impuesto'] == "IVA" ) {
							$ivaporc = (isset($ivap['tasa']))?$ivap['tasa']:''; 
						}
						if( isset($ivap['Impuesto']) && $ivap['Impuesto'] == "002" ) {
							$ivaporc = (isset($ivap['TasaOCuota']))?$ivap['TasaOCuota']:''; 
						}
					}
					foreach ($cfdiComprobante->xpath('//cfdi:Retencion') as $cfdiRetencion)
					{   
						if( isset($cfdiRetencion['impuesto']) && $cfdiRetencion['impuesto'] == "IVA" ){
							$ivaRetenido = $cfdiRetencion['importe'];
							$ivaRetenido = trim($ivaRetenido);
						}
						if( isset($cfdiRetencion['Impuesto']) && $cfdiRetencion['Impuesto'] == "002" ){
							$ivaRetenido = $cfdiRetencion['Importe'];
							$ivaRetenido = trim($ivaRetenido);
						}
						
						if( isset($cfdiRetencion['impuesto']) && $cfdiRetencion['impuesto'] == "ISR" ){
							$isr = $cfdiRetencion['importe'];
							$isr = trim($isr);
							$tipoComprobanteValidado = 'Recibo de honorarios';
						}
						if( isset($cfdiRetencion['Impuesto']) && $cfdiRetencion['Impuesto'] == "001" ){
							$isr = $cfdiRetencion['Importe'];
							$isr = trim($isr);
							$tipoComprobanteValidado = 'Recibo de honorarios';
						}
					}

					if($tipoComprobante == "Factura" && $tipoComprobanteValidado !== "Factura"){
						echo '<div class="alert alert-error">
			              		<button type="button" class="close" data-dismiss="alert">×</button>
					        <strong>Comprobante incorrecto!</strong>El comprobante seleccionado no del tipo Factura ya que contien un total del ISR de: ' . $isr . '
		            			</div>';exit;
					}

					if($tipoComprobante == "Recibo de honorarios" && $tipoComprobanteValidado !== "Recibo de honorarios"){
						
						echo '<div class="alert alert-error">
				    		<button type="button" class="close" data-dismiss="alert">×</button>
						<strong>Comprobante incorrecto!</strong>El comprobante seleccionado no es un Recibo de honorarios. Verifique.</div>';exit;
					}

					foreach ($xml->xpath('//cfdi:Emisor') as $cfdiComprobante)
					{ 
						if ( $version == '3.3') {
							$rfcEmisor = utf8_encode($cfdiComprobante['Rfc']); 
         					$nombreEmisor = utf8_encode($cfdiComprobante['Nombre']);
						}else {
							$rfcEmisor = utf8_encode($cfdiComprobante['rfc']); 
         					$nombreEmisor = utf8_encode($cfdiComprobante['nombre']);
						}
					}

					foreach ($xml->xpath('//cfdi:Receptor') as $cfdiComprobante)
					{ 
						if ( $version == '3.3') {
							$rfcReceptor = utf8_encode($cfdiComprobante['Rfc']);
							$nombreReceptor = utf8_encode($cfdiComprobante['Nombre']);
						}else {
							$rfcReceptor = utf8_encode($cfdiComprobante['rfc']);
							$nombreReceptor = utf8_encode($cfdiComprobante['nombre']);
						}
					}
					$otrosImpuestos = 0;
					if( isset( $ns['implocal'] ) ) {
					foreach ($xml->xpath('//p:ImpuestosLocales') as $implocal)
					{ 
						//if( isset($implocal['ImpLocTrasladado']) && $implocal['ImpLocTrasladado'] == "ISH" ) {
							$otrosImpuestos = (isset($implocal['TotaldeTraslados']))?$implocal['TotaldeTraslados']:'0'; 
						//}
					}
					}
									

					$mensaje = "";
					$rfcEmpresa = 'PSI070507IA5';
					$nombreEmpresa = 'PENDULUM SERVICIOS INTEGRALES SA DE CV';
					
					if($rfcReceptor != $rfcEmpresa){
						echo '<div class="alert alert-error">
				    		<button type="button" class="close" data-dismiss="alert">×</button>
						<strong>Empresa incorrecta!</strong>La empresa Receptor es incorrecto. Debe ser: ' . $rfcEmpresa . ' - ' . $nombreEmpresa . '</div>';exit;
					}

					$this->view->tipogastof = $tipogastof;
					$this->view->conceptof  = $conceptof;

					$this->view->fecha = $fecha;
					$this->view->folio = $folio;
					$this->view->total = $total;
					$this->view->subTotal = $subTotal;
					$this->view->serie = $serie;
					$this->view->factura = $factura;
					$this->view->iva = $iva;
					$this->view->porciva = $ivaporc;
					$this->view->concepto = $concepto;
					$this->view->ivaRetenido = $ivaRetenido;
					$this->view->isr = $isr;
					$this->view->otrosImpuestos = $otrosImpuestos;

					$nombreEmisor = str_replace("&",utf8_encode("&"),$nombreEmisor);
					$nombreEmisor = str_replace("amp;",utf8_encode(""),$nombreEmisor);
					$nombreEmisor = str_replace(",","",$nombreEmisor);
					$nombreEmisor = str_replace(".","",$nombreEmisor);

					$this->view->rfcEmisor = utf8_decode($rfcEmisor);
					$this->view->nombreEmisor = utf8_decode($nombreEmisor);

					$this->view->rfcReceptor = utf8_decode($rfcReceptor);
					$this->view->nombreReceptor = utf8_decode($nombreReceptor);

					$this->view->nombreArchivo = $nombreArchivo;
					$this->view->newnombrexml  = $nombreArchivo;
					$this->view->oldnombrexml  = $fileName;
					$this->view->uuid = $uuid;

					$this->view->mensaje = $mensaje;
					$this->view->validacion = $validacion;
/*
					echo '<p>' . 'Archivo ' . str_replace($targetFolder,'',$targetFile) . ' cargado correctamente.' . '</p>';
					echo '<p>' . 'Factura: ' . $factura . '</p>';
					echo '<p>' . 'Total ' . $total . '</p>';
					echo '<p>' . 'subTotal ' . $subTotal . '</p>';
					die(); 
*/
				} else {
					$result['success'] = 'false';
            				$result['msg'] = "Tipo de archivo no permitido.";
            				echo json_encode($result);
        				die();
				}
			} else {
				$result['success'] = 'false';
	        		$result['msg'] = "Archivo no recibido. Intente de nuevo.";
				echo json_encode($result);
				die();
			}	
		} catch( Exception $e) {
			$result['success'] = 'false';
			$result['msg'] = "Excepción: " . $e->getMessage();
			echo json_encode($result); die();
		}
	}

	public function uploadfilepdfplanviajeAction()
    {
    	$this->_helper->layout->disableLayout();
    	
    	$host = 'doc.pendulum.com.mx';
    	$output = $this->ping($host);
    	if ($output === false) {
    		$result['success'] = 'false';
			$result['msg'] = 'Ha ocurrido un error al conectarse al servidor de documentos. Intente en otro momento.';
            echo json_encode($result); die(); 
    	}
    	
    	$targetFolder = "/opt/processmaker/shared/sites/workflow/files/facturas/";

    	$ip = $_SERVER['SERVER_ADDR'];

    	if($ip == "quantum2.pendulum.com.mx"){ $ip = "quantum1.pendulum.com.mx"; }
       	$ip = "quantum1.pendulum.com.mx";//Seteamos por default
    	
		$params = $this->getRequest()->getParams();

		$solicitudId = $this->getRequest()->getParam('solicitudId','');
    	$comprobanteId = $this->getRequest()->getParam('comprobanteId','');
		$tipo          = $this->getRequest()->getParam('tipo','pdf');
		
		$seconName = date("YmdHis");

    	if( $tipo == 'tk' ){
			$seconName = $comprobanteId.'Tk';
		}
				
    		if (!empty($_FILES)) {
			$tempFile = $_FILES['Filedata']['tmp_name'];
			$targetPath = $targetFolder;

			$lenname = strlen($_FILES['Filedata']['name']);

			// Validate the file type
			$fileTypes = array('pdf', 'PDF'); // File extensions
			$fileParts = pathinfo($_FILES['Filedata']['name']);

			//$targetFile = rtrim($targetPath,'/') . '/' . $_FILES['Filedata']['name'];
			$nombreArchivo = "" . $solicitudId . "_" . $seconName. "." . $fileParts['extension'];

			$targetFileFis = rtrim($targetPath,'/') . "/" . $solicitudId . "_" . $seconName. "." . $fileParts['extension'];
			$targetFile = 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' . $solicitudId . "_" . $seconName . "." . $fileParts['extension'];	

                     	$fileName = $_FILES['Filedata']['name'];
            if (in_array( strtolower($fileParts['extension']) ,$fileTypes)) {
				$up = move_uploaded_file($tempFile,$targetFileFis);
				if( !$up ){
					throw new Exception("No se pudo mover el archivo: " . $targetFile);
					$result['success'] = 'false';
					$result['msg'] = "No se pudo mover el archivo: " . $targetFile;
            				echo json_encode($result); die();
				}
				
			if( $tipo == 'tk' ){
					$Comproba = new Gastos_Model_Comprobacion();
		    		$resActualiza = $Comproba->setComprobantePdf( $comprobanteId, $nombreArchivo,$targetFile,$tipo);
				}

		    		$result['success'] = 'true';
			    	$result['msg'] = "Comprobante guardado correctamente.";
				$result['target'] = $targetFileFis;
				$result['newName'] = $nombreArchivo;
				$result['oldName'] = $_FILES['Filedata']['name'];
			    	echo json_encode($result);
			    	die();
			}
    		}
    	}

	// Agrega Registro
	public function agregacomprobanteViaticosAction()
	{
		$this->_helper->layout->disableLayout();

		$factura         = $this->getRequest()->getParam('factura', 0);
		$gastoId         = $this->getRequest()->getParam('gastoId', 0);
		$idempleado      = $this->getRequest()->getParam('idempleado', "");
		$tipoComprobante = $this->getRequest()->getParam('tipoComprobante', 0);
		$uuid            = $this->getRequest()->getParam('xmlUuid', "");
		$oldNameXML      = $this->getRequest()->getParam('oldnamexmlfactura', 0);
		$newNameXML      = $this->getRequest()->getParam('newnamexmlfactura', 0);

		// Factura.
		if($factura != 0 )
		{
    		$tpogasto        = $this->getRequest()->getParam('tipogastof', "");
	    	$concepto        = $this->getRequest()->getParam('conceptof', 0);
			$fechaFactura    = $this->getRequest()->getParam('xmlFecha', 0);
			$noFactura       = $this->getRequest()->getParam('xmlFolio', 0);
    		$importe         = $this->getRequest()->getParam('xmlSubtotal', 0);
	    	$iva             = $this->getRequest()->getParam('xmlPorcIva', 0);
    		$importeIva      = $this->getRequest()->getParam('xmlIva', 0);
    		$otrosImpuestos  = $this->getRequest()->getParam('xmlOtrosImpuestos', 0);
	    	$importeTotal    = $this->getRequest()->getParam('xmlTotal', 0);
    		$ivaRetenido     = $this->getRequest()->getParam('xmlIvaRetenido', 0);
	    	$isr             = $this->getRequest()->getParam('xmlIsr', 0);
    		$nombreEmisor    = $this->getRequest()->getParam('xmlNombreEmisor', 0);
    		$rfcEmisor       = $this->getRequest()->getParam('xmlRfcEmisor', 0);
			$urlArchivoXML   = $this->getRequest()->getParam('xmlNombreArchivo', "");
			$oldNamePDF      = $this->getRequest()->getParam('oldnamepdffactura', 0);
			$newNamePDF      = $this->getRequest()->getParam('newnamepdffactura', 0);
			$conceptoArr = explode('_',$concepto); 
			$concepto = $conceptoArr[1];
		} else {
    		$urlArchivoPDF   = $this->getRequest()->getParam('nombreArchivo', "");
			$tpogasto        = $this->getRequest()->getParam('tpogasto', "");
			$idempleado      = $this->getRequest()->getParam('idempleado', "");
    		$noFactura       = $this->getRequest()->getParam('noFactura', 0);
    		$nombreEmisor    = $this->getRequest()->getParam('nombreEmisor', 0);
	    	$rfcEmisor       = $this->getRequest()->getParam('rfcEmisor', 0);
    		$fechaFactura    = $this->getRequest()->getParam('fechaFactura', 0);
		    $concepto        = $this->getRequest()->getParam('concepto', 0);
	    	$importe         = $this->getRequest()->getParam('importe', 0);
	    	$iva             = $this->getRequest()->getParam('iva', 0);
    		$importeIva      = $this->getRequest()->getParam('importeIva', 0);
		    $importeTotal    = $this->getRequest()->getParam('importeTotal', 0);
    		$ivaRetenido     = $this->getRequest()->getParam('ivaRetenido', 0);
    		$isr             = $this->getRequest()->getParam('isr', 0);
    		$otrosImpuestos  = $this->getRequest()->getParam('otrosImpuestos', 0);
			$oldNamePDF      = $this->getRequest()->getParam('oldName', '');
			$newNamePDF      = $this->getRequest()->getParam('newName', '');

			$tpogastoArr = explode('_',$tpogasto); 
			$tpogasto = $tpogastoArr[1];

			$conceptoArr = explode('_',$concepto); 
			$concepto = $conceptoArr[2];
		}
		
		if ($iva == NULL) {$iva=0;}
		if ($importeIva == NULL) {$importeIva=0;}
		if ( $iva >= 1 ) { $iva = $iva/100; }
		$nombreEmisor = str_replace("'", "", $nombreEmisor);

		$Comproba = new Gastos_Model_Comprobacion();

		// Valida Si ya se subio la factura anteriormente
		// $politicas = $Comproba->getOnePoliticasPV($gastoId,$tipoComprobante,$);

		$Comproba = new Gastos_Model_Comprobacion();
		$politicas = $Comproba->getOnePoliticasPV($tpogasto,$concepto,$tipoComprobante);
		$politicasInPv = $Comproba->getPoliticasPV($gastoId,$tpogasto,$concepto,$tipoComprobante, $fechaFactura);

		if( count($politicas) == 0 ){
			$response = array(
				'success' => false,
				'message' => 'Por politica no puede comprobar este CONCEPTO como Factura'
			);
			echo json_encode($response);
			exit();
		}

		if( $tpogasto==3 && $concepto==1 && $tipoComprobante==1 ){
			$politicaAcum = $Comproba->getOnePoliticasAcumulativaPV($gastoId,$tpogasto,$concepto,$tipoComprobante );

			$restoPagar = (int)$politicaAcum[0]["TOTALPOL"] - (int)$politicaAcum[0]["OTROS"];

			if( (int)$restoPagar < (int)$importeTotal ){
				$subMonto = (int)$restoPagar / (1+($iva));
				$response = array(
					'success' => false,
					'tpoDoc' => $tipoComprobante,
					'message' => ' Para el concepto el HOSPEDAJE el limite es de '.$politicaAcum[0]["TOTALPOL"].' ',
					'data' => array(
					/*	'montoMax' => $restoPagar,
						'xmlIva' => $restoPagar/(1+(float)xmlPorcIva),
						'xmlPorcIva' => $iva,
						'subtotalMax' => $subMonto*/
					'montoMax' => $restoPagar,
					'xmlIva' => $subMonto * (float)($iva) ,
					'xmlPorcIva' => $iva,
					'subtotalMax' => $subMonto
					)
				);
				echo json_encode($response);
				exit();
			}
			$politicas[0]["FNMONTO"] = $politicaAcum[0]["TOTALPOL"];
			
		}

		if( (int)$politicasInPv[0]["FNEVENTOS"] > 0 && (int)$politicasInPv[0]["FNEVENTOS"] <= (int)$politicasInPv[0]["CANTIDADDIAS"] ){
			$response = array(
				'success' => false,
				'message' => ' Solo puede definir '.(int)$politicasInPv[0]["FNEVENTOS"].' eventos al dia para este concepto'
			);
			echo json_encode($response);
			exit();
		}

		if( (int)$politicasInPv[0]["FNMONTO"] > 0 && (int)$politicasInPv[0]["FNMONTO"] < (float)$importeTotal && $tpogasto!=3 ){
			//$subMonto = (int)$politicasInPv[0]["FNMONTO"] / (1+($iva/100));
            //$subMonto = (int)$politicasInPv[0]["FNMONTO"] * (($iva));
            $subMonto = (int)$politicasInPv[0]["FNMONTO"] / ( 1+($iva) ) ;
			$response = array(
				'success' => false,
				'tpoDoc' => $tipoComprobante,
				'data' => array(
					/*'montoMax' => $politicasInPv[0]["FNMONTO"],
//					'xmlIva' => $politicasInPv[0]["FNMONTO"] - $subMonto,
                    'xmlIva' => $subMonto,
					'xmlPorcIva' => $iva,
//					'subtotalMax' => $subMonto
                    'subtotalMax' => $politicasInPv[0]["FNMONTO"] - $subMonto*/
					'montoMax' => $politicasInPv[0]["FNMONTO"],
					'xmlIva' => $subMonto * (float)($iva) ,
					'xmlPorcIva' => $iva,
					'subtotalMax' => $subMonto
				),
				'message' => ' El limite para este concepto es de '.(int)$politicasInPv[0]["FNMONTO"].' por DIA.'
			);
			echo json_encode($response);
			exit();
		}

		$campos = "IDCOMPROBACION,IDGASTO,IDTPOGASTO,IDCONCEPTO,IDTPOCOMPROBANTE,IDEMPLEADO,FCRFC,NMRFC,FNIMPORTE,FNIVAPRC,FNIVA,FNTOTAL,FDCOMPROBACION,";
		$campos.= "FDFECREGISTRO,FCVALIDACION,FCDESCUENTO,FCORIGEN,FCDOCERRONEO,FNMONTOPOLITICA,FCNOFACTURA,FNOTROSIMPUEST";

		$valores = "PENDUPM.IDCOIMPROBACION_SEQ.NEXTVAL,$gastoId,$tpogasto,$concepto,$tipoComprobante,'$idempleado','$rfcEmisor','$nombreEmisor',$importe,$iva,$importeIva,$importeTotal,TO_DATE('$fechaFactura','DD/MM/YYYY'),";
		$valores.= "SYSDATE,'0','0','PM','0',".$politicas[0]["FNMONTO"].",'$noFactura',$otrosImpuestos";

		if( $newNamePDF != '' ){
			$rutaPDF = "/opt/processmaker/shared/sites/workflow/files/facturas/" . $newNamePDF;
			$campos .= ",FCFACTURAPDF,FDFACTURAPDF";
			$valores .= ",'$rutaPDF',SYSDATE";
		}
	
		if( $oldNamePDF != '' ){
			$campos .= ",NMORIGPDF";
			$valores .= ",'$oldNamePDF'";
		}

		if( $newNameXML != 0 ){
			$rutaXML = "/opt/processmaker/shared/sites/workflow/files/facturas/" . $newNameXML;
			$campos .= ",FCFACTURAXML,FDFACTURAXML";
			$valores .= ",'$rutaXML',SYSDATE";
		}

		if( $oldNameXML != 0 ){
			$campos .= ",NMORIGXML";
			$valores .= ",'$oldNameXML'";  
		}

		if( $uuid != '' ){
			$campos .= ",FCUUID";
			$valores .= ",'$uuid'";  
		}

	    	$resGuardar = $Comproba->setQueryComprobantePV( $campos,$valores );

		if($resGuardar) {
			$result['success'] = true;
		    	$result['message'] = "Comprobante guardado correctamente.";
		    	$result['info'] = $resGuardar;
		} else {
			$result['success'] = false;
		    	$result['message'] = "ERROR al guardar comprobantes.";
		    	$result['info'] = $resGuardar." - ".$valores;
		}

    		
	    	echo json_encode($result);
		die();
	}

	// Editar Registro
	public function editarcomprobanteViaticosAction()
    	{
		$this->_helper->layout->disableLayout();

		$gastoId         = $this->getRequest()->getParam('gastoId', 0);
		$idComp          = $this->getRequest()->getParam('idComp', 0);
		$nombreArchivo   = $this->getRequest()->getParam('nombreArchivo', "");
		$tipoComprobante = $this->getRequest()->getParam('tipoComprobante', 0);
		$noFactura       = $this->getRequest()->getParam('noFactura', 0);
		$nombreEmisor    = $this->getRequest()->getParam('nombreEmisor', 0);
		$rfcEmisor       = $this->getRequest()->getParam('rfcEmisor', 0);
		$fechaFactura    = $this->getRequest()->getParam('fechaFactura', 0);
		$concepto        = $this->getRequest()->getParam('concepto', 0);
		$tpogasto        = $this->getRequest()->getParam('tpogasto', 0);
		$importe         = $this->getRequest()->getParam('importe', 0);
		$iva             = $this->getRequest()->getParam('iva', 0);
		$importeIva      = $this->getRequest()->getParam('importeIva', 0);
		$importeTotal    = $this->getRequest()->getParam('importeTotal', 0);
		$ivaRetenido     = $this->getRequest()->getParam('ivaRetenido', 0);
		$isr             = $this->getRequest()->getParam('isr', 0);
		$idempleado      = $this->getRequest()->getParam('idempleado', 0);
		$otrosImpuestos  = $this->getRequest()->getParam('otrosImpuestos', 0);
		$oldName         = $this->getRequest()->getParam('oldName', 0);
		$newName         = $this->getRequest()->getParam('newName', 0);
		$uuid            = $this->getRequest()->getParam('uuid', 0);

		$archivoPDF = "/opt/processmaker/shared/sites/workflow/files/facturas/" . $newName;
		$rutaComprobante = "";

		$arrDate = explode("-",$fechaFactura);
		$mes = '00';

		if(isset($arrDate[1])) {
			switch($arrDate[1]) {
				case 'ENE':  $mes='01'; break;
				case 'FEB':  $mes='02'; break;
				case 'MAR':  $mes='03'; break;
				case 'ABR':  $mes='04'; break;
				case 'MAY':  $mes='05'; break;
				case 'JUN':  $mes='06'; break;
				case 'JUL':  $mes='07'; break;
				case 'AGO':  $mes='08'; break;
				case 'SEP':  $mes='09'; break;
				case 'OCT':  $mes='10'; break;
				case 'NOV':  $mes='11'; break;
				case 'DIC':  $mes='12'; break;
			}
			$fechaFactura = $arrDate[0].'/'.$mes.'/'.$arrDate[2];
		} else {
			$fechaFactura = $arrDate[0];
		}

		// Validacion de Politicas
		$Comproba = new Gastos_Model_Comprobacion();
		$arrtpogasto = explode('_',$tpogasto);
		$tpogasto = $arrtpogasto[1];

		$arrconcepto = explode('_',$concepto);
		$concepto = $arrconcepto[2];

		$politicas = $Comproba->getPoliticasPV($gastoId,$tpogasto,$concepto,$tipoComprobante,$fechaFactura);
		$dataCase = $Comproba->getInfoCasoComproba($gastoId,$idComp);

		$eventosPolitica = (int)$politicas[0]["FNEVENTOS"];
		$montoPolitica = (int)$politicas[0]["FNMONTO"];

		if( $montoPolitica  > 0 && (int)$politicas[0]["FNMONTO"] < (int)$importeTotal ) {
			$response = array(
				"success" => false,
				"message" => "El monto definido no esta permitido por la politica."
			);
			echo json_encode($response); exit();
		}
/*
	$response = array(
		"success" => false,
		"message" => $dataCase[0]["FDCOMPROBACION"] ." - ". $fechaFactura
	);
	echo json_encode($response); exit();
*/

		if( 	(int)$politicas[0]["FNEVENTOS"] > 0  
			&& (int)$politicas[0]["FNEVENTOS"] <= (int)$politicas[0]["CANTIDADDIAS"] 
			&& $dataCase[0]["FDCOMPROBACION"] != $fechaFactura  
		) {

			$response = array(
				"success" => false,
				"message" => "El concepto solo esta permitido ".$politicas[0]["FNEVENTOS"]." VECES x dia."
			);
			echo json_encode($response); exit();
		}


		// INFORMACION DEL ARCHIVO
		$campos = "IDTPOGASTO   = $tpogasto,
		       IDCONCEPTO       = $concepto,
		       IDTPOCOMPROBANTE = $tipoComprobante,
		       IDEMPLEADO       = '$idempleado',
		       FCRFC            = '$rfcEmisor',
		       NMRFC            = '$nombreEmisor',
		       FNIMPORTE        = $importe,
		       FNIVA            = $iva,
		       FNTOTAL          = $importeTotal,
		       FDCOMPROBACION   = TO_DATE('$fechaFactura','DD/MM/YYYY'),
		       FCORIGEN         = 'PM',
	               FNMONTOPOLITICA  = ".$politicas[0]["FNMONTO"].",
	               FNOTROSIMPUEST   = '$otrosImpuestos',
		       FCNOFACTURA      = '$noFactura',
	               FCFACTURAPDF     = '$archivoPDF',
	               FDFACTURAPDF     = SYSDATE,
	               NMORIGPDF        = '$oldName' ";
    	
		if( $uuid != 0 || $uuid != ""){
			$campos .= ",UUID='$uuid' ";
		}
    	
		$Comproba = new Gastos_Model_Comprobacion();
		$resEditar = $Comproba->editQueryComprobantePV( $idComp,$gastoId,$campos );
		//var_dump($resEditar);exit;
    	
		$result['success'] = true;
		$result['message'] = "Comprobante editado correctamente.";
		$result['info'] = $resEditar;
		echo json_encode($result);
		die();
	}

	public function eliminacomprobanteplandeviajeAction(){

		$idgasto         = $this->getRequest()->getParam('gastoId', 0);
		$idcomprobacion  = $this->getRequest()->getParam('idComp', 0);
		$tpogasto        = $this->getRequest()->getParam('tpogasto', 0);
		$idconcepto      = $this->getRequest()->getParam('idconcep', 0);
		$tpocomprobante  = $this->getRequest()->getParam('tipo', 0);

		$Comproba = new Gastos_Model_Comprobacion();
		$result = $Comproba->deleteQueryComprobantePV($idgasto,$idcomprobacion,$tpocomprobante,$tpogasto,$idconcepto);

		$response = array(
			'success' => true,
			'message' => 'Registro eliminado',
			'result'  => $result
		);

		echo json_encode($response);
		exit();
	}
	
	
	
	public function uploadfileupdateAction()
    {
    	try{
    		$this->_helper->layout->disableLayout();	
    		
	    	$host = 'doc.pendulum.com.mx';
	    	$output = $this->ping($host);
	    	if ($output === false) {	            
	            echo '<div class="alert alert-error">
			         <button type="button" class="close" data-dismiss="alert">×</button>
					 <strong>Error!</strong> Ha ocurrido un error al conectarse al servidor de documentos. Intente en otro momento.
		             </div>';exit;
	    	}
    		
    		$targetFolder = "/opt/processmaker/shared/sites/workflow/files/gastos/comprobacion/";

  	  		$params = $this->getRequest()->getParams();
			$solicitudid = $params['solicitudid'];
			$comprobacionId = $params['comprobacionId'];
			$userid = $params['userid'];
			$tipoComprobante = 'Comprobante';
			$fechaFile = date("YmdHis");
			$ip = "quantum1.pendulum.com.mx";//Seteamos por default
			
			if (!empty($_FILES)) {
				$tempFile = $_FILES['Filedata']['tmp_name'];
				$targetPath = $targetFolder;

				// Validate the file type
				$fileTypes = array('xml', 'XML'); // File extensions
				$fileParts = pathinfo($_FILES['Filedata']['name']);

				$nombreArchivo = "" . $solicitudid . "_" . $comprobacionId . "." . $fileParts['extension'];
				$targetFile = rtrim($targetPath,'/') . "/" . $solicitudid . "_" . $comprobacionId . "." . $fileParts['extension'];
				$fileName = $_FILES['Filedata']['name'];
                if (in_array( strtolower($fileParts['extension']) ,$fileTypes)) {
					$up = move_uploaded_file($tempFile,$targetFile);

					if( !$up ){
						throw new Exception("No se pudo mover el archivo: " . $targetFile);
						$result['success'] = 'false';
						$result['msg'] = "No se pudo mover el archivo: " . $targetFile;
      					echo json_encode($result); die();
					}

       				//Leer el archivo XML
       				$str = file_get_contents($targetFile);
       				$str = str_replace('xmlns:schemaLocation', 'xsi:schemaLocation', $str);
        				
       				$pos_xml = strpos($str, '<?xml', 0);
       				$str_clob = substr($str, $pos_xml);

        			$xml = new SimpleXMLElement($str);
					$ns = $xml->getNamespaces(true);

					if(!isset($ns['cfdi'])){
						echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
       	      				<strong>Archivo erroneo!</strong> El archivo XML no es un archivo de Comprobaci�n CFDI.</div>';
						exit();
					}

       				$xml->registerXPathNamespace('c', $ns['cfdi']);
					$xml->registerXPathNamespace('t', $ns['tfd']);
					$total = '';

					// 	Leo la version
					foreach ($xml->xpath('//cfdi:Comprobante') as $cfdiComprobante)
					{	 
						$version = $cfdiComprobante['version'];
						if($version == ""){
							$version = $cfdiComprobante['Version'];
						}
					}
					
					foreach ($xml->xpath('//t:TimbreFiscalDigital') as $tfd) 
					{
						$uuid = (isset($tfd['UUID']))?$tfd['UUID']:''; 
					}

					if($uuid == ""){
						echo '<div class="alert alert-error">
						<button type="button" class="close" data-dismiss="alert">×</button>
						<strong>Archivo no valido!</strong> El archivo XML cargado no corresponde a una factura.
						</div>';exit;
					}
				
					$Comproba = new Gastos_Model_Comprobacion();
					$comprobacion = $Comproba->getValidadUuid( $uuid,'SG' );

					if($comprobacion){
						$idGastoRepite = $comprobacion[0]['EXISTE'];
						$result['success'] = 'false';
           				$result['msg'] = 'El archivo XML ya se ha cargado en el Gasto . ' . $idGastoRepite . '';
           				echo json_encode($result);
						exit();
   					}

					$arrComprobante = $xml->xpath('//cfdi:Comprobante');

					if( count($arrComprobante) == 0 ){
						echo '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>
        	      			<strong>Archivo repetido!</strong> El archivo XML NO es Valido para Comprobaci�n.</div>';
						exit();
					}

					foreach ($arrComprobante as $cfdiComprobante)
					{
						if ($version == '3.3') {
							$fecha = $cfdiComprobante['Fecha'];
							$fecha = date('d/m/Y' ,strtotime($fecha)); 
							$folio = $cfdiComprobante['Folio']; 
							$total = $cfdiComprobante['Total'];
							$subTotal = $cfdiComprobante['SubTotal']; 
				       		$serie = $cfdiComprobante['Serie']; 
				       		$factura = $serie . $folio;
						} else {
							$fecha = $cfdiComprobante['fecha'];
							$fecha = date('d/m/Y' ,strtotime($fecha)); 
							$folio = $cfdiComprobante['folio']; 
							$total = $cfdiComprobante['total'];
							$subTotal = $cfdiComprobante['subTotal']; 
				       		$serie = $cfdiComprobante['serie']; 
				       		$factura = $serie . $folio;
						}
					}

					$concepto = "";
					foreach ($xml->xpath('//cfdi:Conceptos') as $cfdiComprobante)
					{
						foreach ($cfdiComprobante->xpath('//cfdi:Concepto') as $cfdiComprobante)
						{
							if ($version == '3.3') {
								$concepto = $cfdiComprobante['Descripcion'];
								$concepto = (strlen($concepto) > 100) ? substr($concepto,0,90).'...' : $concepto;
							} else {
								$concepto = $cfdiComprobante['descripcion'];
								$concepto = (strlen($concepto) > 100) ? substr($concepto,0,90).'...' : $concepto;
							}
						}
					}

					$isr = 0;
					$ivaRetenido = 0;
					foreach ($xml->xpath('//cfdi:Impuestos') as $cfdiComprobante)
					{ 
						if ($version == '3.3') {
							$iva = $cfdiComprobante['TotalImpuestosTrasladados'];
						} else {
							$iva = $cfdiComprobante['totalImpuestosTrasladados'];
						}
					}
					$ivaporc = 0;
                    //Si no devolvio ningun resultado declaro el iva en cero
                    if($iva == NULL || empty($iva) || $iva == 0){
                        $iva=0.00;
                    }

                    foreach ($xml->xpath('//cfdi:Traslado') as $ivap)
					{
						if ($version == '3.3') {
							$ivaporc = (isset($ivap['Tasa']))?$ivap['Tasa']:'';
						} else {
							$ivaporc = (isset($ivap['tasa']))?$ivap['tasa']:'';
						} 
					}
					foreach ($cfdiComprobante->xpath('//cfdi:Retencion') as $cfdiRetencion)
					{
						if( $cfdiRetencion['impuesto'] == "ISR" ){
							$isr = $cfdiRetencion['importe'];
							$isr = trim($isr);
							$tipoComprobanteValidado = 'Recibo de honorarios';
						}
						if( $cfdiRetencion['Impuesto'] == "001" ){
							$isr = $cfdiRetencion['Importe'];
							$isr = trim($isr);
							$tipoComprobanteValidado = 'Recibo de honorarios';
						}
					
						if( $cfdiRetencion['impuesto'] == "IVA" ){
							$ivaRetenido = $cfdiRetencion['importe'];
							$ivaRetenido = trim($ivaRetenido);
						}
						if( $cfdiRetencion['Impuesto'] == "002" ){
							$ivaRetenido = $cfdiRetencion['Importe'];
							$ivaRetenido = trim($ivaRetenido);
						}
					}

					if($tipoComprobante == "Factura" && $tipoComprobanteValidado !== "Factura"){
						echo '<div class="alert alert-error">
			              		<button type="button" class="close" data-dismiss="alert">×</button>
					        <strong>Comprobante incorrecto!</strong>El comprobante seleccionado no del tipo Factura ya que contien un total del ISR de: ' . $isr . '
		            			</div>';exit;
					}

					if($tipoComprobante == "Recibo de honorarios" && $tipoComprobanteValidado !== "Recibo de honorarios"){
						echo '<div class="alert alert-error">
				    		<button type="button" class="close" data-dismiss="alert">×</button>
						<strong>Comprobante incorrecto!</strong>El comprobante seleccionado no es un Recibo de honorarios. Verifique.</div>';exit;
					}

					foreach ($xml->xpath('//cfdi:Emisor') as $cfdiComprobante)
					{ 
						if ($version == '3.3') {
							$rfcEmisor = utf8_encode($cfdiComprobante['Rfc']); 
         					$nombreEmisor = utf8_encode($cfdiComprobante['Nombre']);
						} else {
							$rfcEmisor = utf8_encode($cfdiComprobante['rfc']); 
         					$nombreEmisor = utf8_encode($cfdiComprobante['nombre']);
						}
					}

					foreach ($xml->xpath('//cfdi:Receptor') as $cfdiComprobante)
					{ 
						if ($version == '3.3') {
							$rfcReceptor = utf8_encode($cfdiComprobante['Rfc']);
							$nombreReceptor = utf8_encode($cfdiComprobante['Nombre']);
						} else {
							$rfcReceptor = utf8_encode($cfdiComprobante['rfc']);
							$nombreReceptor = utf8_encode($cfdiComprobante['nombre']);
						}
					}
				
					$mensaje = "";
				
					$targetFile = 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' . $solicitudid . "_" . $comprobacionId . "." . $fileParts['extension'];

					$resulupdate = $Comproba->updateComprobante( $solicitudid,$comprobacionId,$userid,$rfcEmisor,$factura,$subTotal,$ivaporc,$ivaRetenido,$total,$targetFile, $concepto,$fecha,$nombreEmisor,$fileName,$uuid,$iva );

					$result['success'] = 'true';
       				$result['msg'] = "Archivo actualizado.";
       				echo json_encode($result);
       				die();

				} else {
					echo '<div class="alert alert-error">
				    	<button type="button" class="close" data-dismiss="alert">×</button>
						<strong>Tipo de archivo no permitido!</strong>Verifique que el archivo sea un XML.</div>';exit;
       				die();
				}
			} else {
				$result['success'] = 'false';
	       		$result['msg'] = "Archivo no recibido. Intente de nuevo.";
				echo json_encode($result);
				die();
			}	
		
		} catch( Exception $e) {
    		$result['success'] = 'false';
			$result['msg'] = "Excepción: " . $e->getMessage();
            echo json_encode($result); die();
    	}
    }

	public function removefileAction() {
    	$params = $this->getRequest()->getParams();
		$solicitudid = $params['idgasto'];
		$comprobacionId = $params['idc'];
		$tipo = $params['tipo'];

		$Comproba = new Gastos_Model_Comprobacion();
		$archivo = $Comproba->setComprobanteFile( $solicitudid,$comprobacionId,$tipo );
		
		if( $archivo ) {
    		$result['success'] = true;
    		$result['msj'] = $archivo;
		} else {
			$result['success'] = false;
    		$result['msj'] = $archivo;
		}
    	echo json_encode($result);
    	exit;
    }
    
	public function validaDocsAction() {
    	$params = $this->getRequest()->getParams();

    	$name = $params['name'];
		$comprobacionId = $params['idcomproba'];
		$solicitudid    = $params['idgasto'];
		$value          = $params['newval'];
		
		$valresult = 'S';
		if( $value == 'false' ) {
			$valresult = 'N'; 
		}

		$Comproba = new Gastos_Model_Comprobacion();
		$data = $Comproba->setValidacionDocs( $solicitudid,$comprobacionId,$name, $valresult  );
		
		$result['sucess'] = true;
		$result['result'] = $data;
		$result['data'] = $valresult;
		
		echo json_encode($result);
    	exit;
    }

	public function validaDocsViajeAction() {
    	$params = $this->getRequest()->getParams();

    	$comprobacionId = $params['idc'];
		$solicitudid    = $params['idgasto'];
		$value          = $params['nval'];
		
		if( $value == 'true' ) {
			$valresult = '1'; 
		} else {
			$valresult = '0';
		}
		
		$Comproba = new Gastos_Model_Comprobacion();
		$data = $Comproba->setValidacionDocsViaje( $solicitudid,$comprobacionId, $valresult );
		
		if ($data == '1') {
			$result['success'] = true;
		} else {
			$result['success'] = false;
			$result['message'] = 'No se actualizo el registro.';
		}
		
		echo json_encode($result);
    	exit;
    }
    
    public function updateJustificacionAlertaAction()
    {
        $params = $this->getRequest()->getParams();
        $Comproba = new Gastos_Model_Comprobacion();
        $asignacion = $Comproba->getAsignacion($params);
        //Procedo a parsear las justificaciones
        foreach($asignacion as $ind=>$i){
            if($i['FCJUSTIFICACIONALERTA']!='' || !empty($i['FCJUSTIFICACIONALERTA'])){
                $patron = preg_split("/[|]+/", $i['FCJUSTIFICACIONALERTA']);
                unset($patron[0]);//elimino la primera posicion por ser un array vacio
                foreach ($patron as $indB=>$p){
                    $substring = substr($p, 10);
                    $result[$indB] = preg_split("/[]]+/", $substring);
                    $justificacion[$result[$indB][0]] = $result[$indB][1];

                }
                $justificacion[$params['ETAPA']]=$params['FCJUSTIFICACIONALERTA'];//agrego la nueva justificacion
                $justificacionResult="";
                foreach($justificacion as $indC =>$j){
                    $justificacionResult.= "|LA ETAPA [".$indC."] ".$justificacion[$indC];
                }
                $params['FCJUSTIFICACIONALERTA']=$justificacionResult;
                $asignacion[$ind]['JUSTIFICACIONES']=$justificacion;
            }else{
                $justificacionResult= "|LA ETAPA [".$params['ETAPA']."] ".$params['FCJUSTIFICACIONALERTA'];
                $params['FCJUSTIFICACIONALERTA']=$justificacionResult;
            }
        }

        $update = $Comproba->updateJustificacionAlerta($params);
        if($update){
            echo json_encode(array("status"=>"OK","msg"=>"Justificación guardada con exito."));
        }else{
            echo json_encode(array("status"=>"FAIL","msg"=>"Ocurrió un error intente nuevamente."));
        }
        exit;
    }

    public function setFechaEjecucionAction(){
        $params = $this->getRequest()->getParams();
        $Comproba = new Gastos_Model_Comprobacion();
        $update = $Comproba->updateFechaEjecucion($params);
        $response=json_encode(array('response'=>$update));
        echo $response;
        exit;
    }

}

