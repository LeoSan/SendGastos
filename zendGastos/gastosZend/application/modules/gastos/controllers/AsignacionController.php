<?php

class Gastos_AsignacionController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
    	//$this->_helper->layout->disableLayout();
//        $this->_helper->layout->setLayout('gastos');
        $this->_helper->layout->setLayout('quantum_uselooper_template');
        $params = $this->getRequest()->getParams();

    	$empleadoid = isset($params['empleadoid'])?$params['empleadoid']:'1471';
        $solicitudid = isset($params['solicitudid'])?$params['solicitudid']:'113891';
        $tiposolicitud = isset($params['tiposolicitud'])?$params['tiposolicitud']:'0';
        $tipocaptura = isset($params['tipocaptura'])?$params['tipocaptura']:'0';
        $puestoid = isset($params['puestoid'])?$params['puestoid']:'0';
        $usuario = isset($params['usuario'])?$params['usuario']:'0'; // Process Maker
        $appuid = isset($params['appuid'])?$params['appuid']:'0';
		$externo = isset($params['externo'])?$params['externo']:'0';
        //echo $solicitudid;exit;
        $Asig = new Gastos_Model_Asignacion();
        //$movimientos = $Asig->getTipoMovimiento($solicitudid);
        //$tipoAsigActual = $Asig->geTipoAsigActual($solicitudid);
		$categorias = $Asig->getCatConceptoAsig($tiposolicitud, $tipocaptura, $puestoid);
        //$carteras = $Asig->getCarteraConcepto($solicitudid);
        $catcentrocosto = $Asig->getCategoriaCC($solicitudid, $tiposolicitud);
        $misconceptos = $Asig->getMisConceptos($empleadoid,$externo);
        $conceptosByPuestoTC = $Asig->getConceptosPuestoTC($params);
        $claveCyber = $Asig->getClaveCyber($empleadoid);
        //var_dump($misconceptos);exit;
        $this->view->categorias = $categorias;
        $this->view->carteras = array();
        $this->view->catcentrocosto = $catcentrocosto;
        $this->view->solicitudid = $solicitudid;
        $this->view->misconceptos = $misconceptos;
        $this->view->conceptosByPuestoTC = $conceptosByPuestoTC;
        //$this->view->tipoAsigActual = $tipoAsigActual[0]['TIPO'];
        
        $this->view->empleadoid = $empleadoid != "0" ? $empleadoid : '0';
        $this->view->tiposolicitud = $tiposolicitud != "0" ? $tiposolicitud : '0';
        $this->view->tipocaptura = $tipocaptura != "0" ? $tipocaptura : '0';
        $this->view->puestoid = $puestoid != "0" ? $puestoid : '0';
        $this->view->usuariopm = $usuario != "0" ? $usuario : '0';
        $this->view->appuid = $appuid != "0" ? $appuid : '0';
	 $this->view->clavecyber = $claveCyber != "0" ? $claveCyber : '0';
        
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
    	
    	$this->view->tipocapturaLabel = $tipocapturaLabel;
    }
	
	public function getdetalleasignacionAction()
	{
		$this->_helper->layout->disableLayout();
		
		$params = $this->getRequest()->getParams();
		$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
		$tipocaptura = isset($params['tipocaptura'])?$params['tipocaptura']:0;
    	$Asig = new Gastos_Model_Asignacion();
    	$asignaciones = $Asig->getDetalleAsignacion( $solicitudid );
    	//var_dump($asignaciones);exit;

    	$this->view->asignaciones = $asignaciones;
    	
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
    	
    	$this->view->tipocapturaLabel = $tipocapturaLabel;
	}
	
	public function getconceptosolicitudAction()
	{
		$params = $this->getRequest()->getParams();
    	$tipoMovto = isset($params['tipoMovto'])?$params['tipoMovto']:0;
    	$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
    	$Asig = new Gastos_Model_Asignacion();
    	$conceptos = $Asig->getConceptosolicitud($solicitudid, $tipoMovto);
    	//var_dump($sucursal);exit;
    	
    	
    	if( count($conceptos) > 0) {
        	$response['respuesta'] = 'success';
        	$response['query'] = $solicitudid . " - " . $tipoMovto;
	        $response['conceptos'] = $conceptos;
        } else {
        	$response['respuesta'] = 'fail';
        	$response['query'] = $conceptos;
        }
        echo json_encode($response);
        die();
	}
	
	public function getsbcatconceptoasigAction()
	{
		$params = $this->getRequest()->getParams();
		$categoriaid = isset($params['categoriaid'])?$params['categoriaid']:0;
		$tiposolicitud = isset($params['tiposolicitud'])?$params['tiposolicitud']:0;
    	$queasigna = isset($params['queasigna'])?$params['queasigna']:0;
    	$puesto = isset($params['puesto'])?$params['puesto']:0;
    	$Asig = new Gastos_Model_Asignacion();
    	$subcategorias = $Asig->getSbCatConceptoAsig($categoriaid, $tiposolicitud, $queasigna, $puesto);
    	//var_dump($sucursal);exit;
    	
    	if( count($subcategorias) > 0) {
        	$response['respuesta'] = 'success';
        	$response['query'] = $categoriaid . " - " . $tiposolicitud;
	        $response['subcategorias'] = $subcategorias;
        } else {
        	$response['respuesta'] = 'fail';
        	$response['query'] = $subcategorias;
        }
        echo json_encode($response);
        die();
	}
	
	public function getqueconceptonmasigAction()
	{
		$params = $this->getRequest()->getParams();
		$categoriaid = isset($params['categoriaid'])?$params['categoriaid']:0;
		$subcategoriaid = isset($params['subcategoriaid'])?$params['subcategoriaid']:0;
		$tiposolicitud = isset($params['tiposolicitud'])?$params['tiposolicitud']:0;
    	$queasigna = isset($params['queasigna'])?$params['queasigna']:0;
    	$puesto = isset($params['puesto'])?$params['puesto']:0;
    	$texto = isset($params['texto'])?$params['texto']:0;
    	$Asig = new Gastos_Model_Asignacion();
    	$conceptos = $Asig->getQueConceptoNmAsig($categoriaid, $subcategoriaid, $texto, $tiposolicitud, $queasigna, $puesto);
    	//var_dump($sucursal);exit;
    	
    	if( count($conceptos) > 0) {
        	$response['respuesta'] = 'success';
        	$response['query'] = $categoriaid . " - " . $tiposolicitud;
	        $response['conceptos'] = $conceptos;
        } else {
        	$response['respuesta'] = 'fail';
        	$response['query'] = $conceptos;
        }
        echo json_encode($response);
        die();
	}
	
	public function getqueconceptoasigAction()
	{
		$params = $this->getRequest()->getParams();
		$categoriaid = isset($params['categoriaid'])?$params['categoriaid']:0;
		$subcategoriaid = isset($params['subcategoriaid'])?$params['subcategoriaid']:0;
		$tiposolicitud = isset($params['tiposolicitud'])?$params['tiposolicitud']:0;
    	$queasigna = isset($params['queasigna'])?$params['queasigna']:0;
    	$puesto = isset($params['puesto'])?$params['puesto']:0;
    	$Asig = new Gastos_Model_Asignacion();
    	$conceptos = $Asig->getQueConceptoAsig($categoriaid, $subcategoriaid, $tiposolicitud, $queasigna, $puesto);
    	//var_dump($sucursal);exit;
    	
    	if( count($conceptos) > 0) {
        	$response['respuesta'] = 'success';
        	$response['query'] = $categoriaid . " - " . $tiposolicitud;
	        $response['conceptos'] = $conceptos;
        } else {
        	$response['respuesta'] = 'fail';
        	$response['query'] = $conceptos;
        }
        echo json_encode($response);
        die();
	}
	
	public function getcategoriasccAction()
	{
		$params = $this->getRequest()->getParams();
    	$tipoMovto = isset($params['tipoMovto'])?$params['tipoMovto']:0;
    	$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
    	$Asig = new Gastos_Model_Asignacion();
    	$categorias = $Asig->getCategoriaCC($solicitudid, $tipoMovto);
    	//var_dump($sucursal);exit;
    	
    	
    	if( count($categorias) > 0) {
        	$response['respuesta'] = 'success';
        	$response['query'] = $solicitudid . " - " . $tipoMovto;
	        $response['categorias'] = $categorias;
        } else {
        	$response['respuesta'] = 'fail';
        	$response['query'] = $categorias;
        }
        echo json_encode($response);
        die();
	}
	
	public function getccsolicitudAction()
	{
		$params = $this->getRequest()->getParams();
    	$categoriaid = isset($params['categoriaid'])?$params['categoriaid']:0;
    	$Asig = new Gastos_Model_Asignacion();
    	$centroscosto = $Asig->getCCSolicitud($categoriaid);
    	
    	//var_dump($sucursal);exit;
    	if( count($centroscosto) > 0) {
        	$newCC = array();
	    	foreach ($centroscosto as $item):
	    		$newCC[] = array( 'IDCENTROCOSTO' => $item['IDCENTROCOSTO'], 'NMCENTROCOSTO' => utf8_encode($item['NMCENTROCOSTO']) );
	    	endforeach;

    		$response['respuesta'] = 'success';
        	$response['centroscosto'] = $newCC;
        } else {
        	$response['respuesta'] = 'fail';
        	$response['query'] = $centroscosto;
        }
        echo json_encode($response);
        die();
	}
	
	public function getcarteraconceptoAction()
	{
		$params = $this->getRequest()->getParams();
    	$conceptoid = isset($params['conceptoid'])?$params['conceptoid']:0;
    	$Asig = new Gastos_Model_Asignacion();
    	$carteras = $Asig->getCarteraConcepto($conceptoid);
    	
    	//var_dump($sucursal);exit;
    	if( count($carteras) > 0) {
        	/*
    		$newCC = array();
	    	foreach ($centroscosto as $item):
	    		$newCC[] = array( 'IDCENTROCOSTO' => $item['IDCENTROCOSTO'], 'NMCENTROCOSTO' => utf8_encode($item['NMCENTROCOSTO']) );
	    	endforeach;
			*/
    		$response['respuesta'] = 'success';
        	$response['carteras'] = $carteras;
        } else {
        	$response['respuesta'] = 'fail';
        	$response['query'] = $carteras;
        }
        echo json_encode($response);
        die();
	}
	
	public function validatipomovimientoAction()
	{
		$params = $this->getRequest()->getParams();
    	$tipoMovto = isset($params['tipoMovto'])?$params['tipoMovto']:0;
    	$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
    	$Asig = new Gastos_Model_Asignacion();
    	$psError = $Asig->validaTipoMovimiento($solicitudid, $tipoMovto);
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
	
	public function borraasignacionsolicAction()
	{
		$params = $this->getRequest()->getParams();
    	$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
    	$Asig = new Gastos_Model_Asignacion();
    	$psError = $Asig->borraAsignacionsolic($solicitudid);
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

	public function addcreditoasignaAction()
	{
		$params = $this->getRequest()->getParams();
    	$Asig = new Gastos_Model_Asignacion();
		/*if( $params['solicitudid'] == 4153547 ) {
    		var_dump($params);exit;
    	}*/
    	$psError = $Asig->addCreditoAsigna($params);
    	
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
	
	public function addcarteraasignaAction()
	{
		$params = $this->getRequest()->getParams();
    	
    	$Asig = new Gastos_Model_Asignacion();
    	$psError = $Asig->addCarteraAsigna($params);
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
	/*
	public function addaimporteasignaAction()
	{
		$params = $this->getRequest()->getParams();
    	
    	$Asig = new Gastos_Model_Asignacion();
    	$psError = $Asig->addImporteAsigna($params);
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
	}*/
	public function addaimporteasignaAction()
	{
		$params = $this->getRequest()->getParams();
    	
		$params['planviaje'] = ( $params['planviaje'] || $params['planviaje'] != '' ) ? $params['planviaje'] : 0;
		
		$Asig = new Gastos_Model_Asignacion();
		$lastIdconcepto = $Asig->getLastPartida( $params['solicitudid'] );
		
		$combinacion = false;
		
		if ( isset( $lastIdconcepto[0] ) ) {
			if(    ($lastIdconcepto[0]['IDCONCEPTO'] == 1045 && $params['conceptoid'] == 4084)
		    	|| ($lastIdconcepto[0]['IDCONCEPTO'] == 4084 && $params['conceptoid'] == 1045) ) {
				$combinacion = true;
			}
		}
		
		if (    isset($lastIdconcepto[0]) 
		     && $lastIdconcepto[0]['IDCONCEPTO'] != $params['conceptoid'] 
		     && !$combinacion ) {
			$response['respuesta'] = 'fail';
        	$response['msj'] = 'El concepto no puede combinarse';
			echo json_encode($response);
        	die();
		}
    	
    	$psError = $Asig->addImporteAsigna($params);

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
	
	public function validamasivacreditoasignaAction________()
	{
		$params = $this->getRequest()->getParams();
    	$Asig = new Gastos_Model_Asignacion();
    	$psError = $Asig->validaMasivaCreditoAsigna($params);
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
	
	public function validaarchivoasignaAction()
	{
		$params = $this->getRequest()->getParams();
    	$Asig = new Gastos_Model_Asignacion();
    	$psError = $Asig->validaArchivoAsigna($params);
    	//var_dump($psError);exit;
    	if( $psError['error'] == "0") {
        	$response['respuesta'] = 'success';
        	$response['msj'] = $psError['error'];
	        $response['total'] = $psError['total'];
        } else {
        	$response['respuesta'] = 'fail';
        	$response['msj'] = $psError['error'];
        }
        echo json_encode($response);
        die();
	}
	
	public function validamasivacreditoasignaAction()
	{
		$params = $this->getRequest()->getParams();
    	$Asig = new Gastos_Model_Asignacion();
    	$psError = $Asig->validaMasivaCreditoAsigna($params);
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
	
	public function delasignacionsolicitudAction()
	{
		$params = $this->getRequest()->getParams();
    	$Asig = new Gastos_Model_Asignacion();
    	$psError = $Asig->delAsignacionsolicitud($params);
    	//var_dump($psError);exit;
		if( $psError['error'] == "0") {
        	$response['respuesta'] = 'success';
        	$response['msj'] = $psError['error'];
	        $response['total'] = $psError['total'];
        } else {
        	$response['respuesta'] = 'fail';
        	$response['msj'] = $psError['error'];
        }
        echo json_encode($response);
        die();
	}
	
	public function uploadfileAction()
    {
    	try{
    	// Define a destination
    	//$targetFolder = $_SERVER['DOCUMENT_ROOT'] . '/gastosfact/public/fileTmp/';
    	//$targetFolder = $_SERVER['DOCUMENT_ROOT'] . '/file_external/GASTOS/';
    	// $targetFolder = "/mnt/validacion/GASTOS/";
    	$targetFolder = "/mnt/file_external/";
    	//$targetFolder = "/opt/processmaker/shared/sites/workflow/files/gastos/documentos/";
    	
    	$params = $this->getRequest()->getParams();
		$solicitudid = $params['solicitudid'];

		//echo $targetFolder;exit;
		if (!empty($_FILES)) {
			$tempFile = $_FILES['Filedata']['tmp_name'];
			$targetPath = $targetFolder; //$_SERVER['DOCUMENT_ROOT'] . $targetFolder;
			//$targetFile = rtrim($targetPath,'/') . '/' . $_FILES['Filedata']['name'];
			$targetFile = rtrim($targetPath,'/') . "/GTO" . $solicitudid . "PASO.csv";
			// Validate the file type
			$fileTypes = array('csv'); // File extensions
			//$fileTypes = array('pdf', 'csv', 'xls', 'xlsx', 'txt', 'doc');
			$fileParts = pathinfo($_FILES['Filedata']['name']);
			
			if (in_array($fileParts['extension'],$fileTypes)) {
				$up = move_uploaded_file($tempFile,$targetFile);
				if( !$up ){
					throw new Exception("No se pudo mover el archivo: " . $targetFile);
					$result['success'] = 'false';
					$result['msg'] = "No se pudo mover el archivo: " . $targetFile;
            		echo json_encode($result); die();
				}
				
				chmod($targetFile, 0777); //Dar todos los permisos a los archivos
				
				//Crear el archivo SHELL
				/*
				$archivoShell = $targetFolder . "GTO" . $solicitudid . "PASO.sh";
				if( !$archivoShell ){
					$result['success'] = 'false';
					$result['msg'] = "No se pudo crear el archivo: " . $archivoShell;
            		echo json_encode($result); die();
				}
				
				$gestor = fopen($archivoShell, 'a');
				fwrite($gestor, "#!/usr/bin/expect -f\n");
				fwrite($gestor, "expect \"password:\"\n");
				fwrite($gestor, "send \"usubpm\\r\"\n");
				fwrite($gestor, "interact");
				fclose($gestor);
				chmod($archivoShell, 0777); */ //Dar todos los permisos al archivo SHELL
				
				//Ejecutamos el archivo Shell con shell_exec
				/*
				$archivoEjecutar = "/var/www/gastosfact/public/fileTmp/GTO" . $solicitudid . "PASO.sh";
				$shell = shell_exec("sh " . $archivoEjecutar);
				*/
				//$contents = file_get_contents($archivoEjecutar);
				//$shell = shell_exec($contents);
				
				$result['success'] = 'true';
				$result['file'] = "GTO" . $solicitudid . "PASO.csv";
            	$result['msg'] = 'Archivo ' . str_replace($targetFolder,'',$targetFile) . ' cargado correctamente.';
            	//$result['shell_res'] = $shell;
            	//$result['shell_file'] = $archivoEjecutar;
            	echo json_encode($result);
        		die();
			} else {
				$result['success'] = 'false';
            	$result['msg'] = "Tipo de archivo no permitido.";
            	echo json_encode($result);
        		die();
			}
		}
		
		$result['success'] = 'false';
        $result['msg'] = "Archivo no recibido. Intente de nuevo.";
        echo json_encode($result);
        die();
        	
    	} catch( Exception $e) {
    		$result['success'] = 'false';
			$result['msg'] = "Excepci�n: " . $e->getMessage();
            echo json_encode($result); die();
    	}
    }

	public function asignacionExternoAction()
	{
		$this->_helper->layout->setLayout('gastos');
		$params = $this->getRequest()->getParams();

		$empleadoid = isset($params['empleadoid'])?$params['empleadoid']:'1471';
		$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:'113891';
		$tiposolicitud = isset($params['tiposolicitud'])?$params['tiposolicitud']:'0';
		$tipocaptura = isset($params['tipocaptura'])?$params['tipocaptura']:'0';
		$puestoid = isset($params['puestoid'])?$params['puestoid']:'0';
		$usuario = isset($params['usuario'])?$params['usuario']:'0'; // Process Maker
		$appuid = isset($params['appuid'])?$params['appuid']:'0';
		$externo = isset($params['externo'])?$params['externo']:'0';

		$Asig = new Gastos_Model_Asignacionexterno();
		$categorias = $Asig->getCatConceptoAsig($tiposolicitud, $tipocaptura, $puestoid); 
		$catcentrocosto = $Asig->getCategoriaCC($solicitudid, $tiposolicitud);
		$misconceptos = $Asig->getMisConceptos($empleadoid,$externo);

        $misjuicios = $Asig->getMisJuicios($usuario,$externo);  
          
//var_dump( $misconceptos );
        $this->view->categorias = $categorias;
        $this->view->carteras = $misjuicios;
        $this->view->catcentrocosto = $catcentrocosto;
        $this->view->solicitudid = $solicitudid;
        $this->view->misconceptos = $misconceptos;
        $this->view->empleadoid = $empleadoid != "0" ? $empleadoid : '0';
        $this->view->tiposolicitud = $tiposolicitud != "0" ? $tiposolicitud : '0';
        $this->view->tipocaptura = $tipocaptura != "0" ? $tipocaptura : '0';
        $this->view->puestoid = $puestoid != "0" ? $puestoid : '0';
        $this->view->usuariopm = $usuario != "0" ? $usuario : '0';
        $this->view->appuid = $appuid != "0" ? $appuid : '0';
        
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
    	if( $tipocaptura == "50"){
    		$tipocapturaLabel = 'Cuenta';
    	}
    	
    	$this->view->tipocapturaLabel = $tipocapturaLabel;
    }
    
    public function getInfoJuicioAction()
    {
    	$params = $this->getRequest()->getParams();
    	$idjuicio = isset($params['idjuicio'])?$params['idjuicio']:'0';
    	
    	$Asig = new Gastos_Model_Asignacion();
        
    	$response = $Asig->getInfoJuicio($idjuicio);
    	
    	echo json_encode($response);
        die();
    	
    }

	public function findCreditoAction()
	{
		$params = $this->getRequest()->getParams();
		$acreditado = isset($params['acreditado'])?$params['acreditado']:'0';
		$empleadoid = isset($params['empleadoid'])?$params['empleadoid']:'0';
		$usuariopm  = isset($params['usuariopm'])?$params['usuariopm']:'0';
		$credito    = isset($params['credito'])?$params['credito']:'0';

		$Asig = new Gastos_Model_Asignacion(); 

		$response = $Asig->getInfoCredito($usuariopm,$credito,strtoupper($acreditado));

		echo json_encode(array("success"=>true,"data"=>$response));
		die();
	}

	public function getdetalleasignacionExternoAction()
	{
		$this->_helper->layout->disableLayout();
		
		$params = $this->getRequest()->getParams();
		$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
		$tipocaptura = isset($params['tipocaptura'])?$params['tipocaptura']:0;
		$Asig = new Gastos_Model_Asignacion();
		$asignaciones = $Asig->getDetalleAsignacion( $solicitudid );
		//var_dump($asignaciones);exit;

		$this->view->asignaciones = $asignaciones;

		$tipocapturaLabel = 'Cuenta / Cartera / Importe';
		if( $tipocaptura == "2" || $tipocaptura == "3" || $tipocaptura == "50" ){
			$tipocapturaLabel = 'Cuenta';
		}
		if( $tipocaptura == "4"){
			$tipocapturaLabel = 'Cartera';
		}
		if( $tipocaptura == "42"){
			$tipocapturaLabel = 'Importe';
		}
    	
		$this->view->tipocapturaLabel = $tipocapturaLabel;
	}

	public function espagodeserviciosAction()
    {
        $params = $this->getRequest()->getParams();
        $conceptoid = isset($params['conceptoid'])?$params['conceptoid']:0;
        $solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
        
        $Asig = new Gastos_Model_Asignacion();
        $pagoservicio = $Asig->getEsPagoDeServicio($conceptoid);
        $esPlanviaje = $Asig->getConfigPlanviaje($conceptoid);
        $esFechaEjecucion =  $Asig->getValidaFechaEjecucion( $conceptoid );
        //var_dump($esFechaEjecucion); 
        $response['fecha_ejec'] = ($esFechaEjecucion[0]['TOTAL']=='1')?true:false; 
        
        if( $pagoservicio[0]["HAY"] == 'SI') {
            $response['respuesta'] = 'success';
            $response['pagoservicio'] = true;
        } else {
            $response['respuesta'] = 'success';
            $response['pagoservicio'] = false;
        }
        
    	if( $esPlanviaje[0]["EXISTE"] == 0 ) {
            $response['planviajeidc'] = 0;
            $response['planviaje'] = false;
        } else {
        	
        	switch ($conceptoid) {
        	case 1043:
        		$idtask = '13227742553473a8a6c1632051428213';
        	break; 
        	case 1045:
        		$idtask = '54716651453473a734fc631093651248';
        	break;
        	default: $idtask = '';
        	}
        	
        	$lastPlanviaje    =  $Asig->getLastPlanviaje( $solicitudid,$conceptoid );
        	$lastIdconcepto   =  $Asig->getLastPartida( $solicitudid );
        	
        	$lastPV = ( isset($lastPlanviaje[0]) ) ? $lastPlanviaje[0]['PLANVIAJE'] : '' ;
        	$lastConcepto = ( isset($lastIdconcepto[0]) ) ? $lastIdconcepto[0]['IDCONCEPTO'] : '' ;
        	
        	$response['planviajeid'] = $lastPV;
        	$response['planviajeidc'] = $conceptoid;
        	$response['perfilconcepto'] = $lastConcepto;
            $response['planviaje'] = true;
        }
        
        echo json_encode($response);
        die();
    }
    
	public function espagodeserviciosDateAction()
    {
        $params = $this->getRequest()->getParams();
        $conceptoid = isset($params['conceptoid'])?$params['conceptoid']:0;
        $credito = isset($params['credito'])?$params['credito']:'';
        
    	if( $conceptoid == 0 || $credito == '' ) {
            $response['respuesta'] = 'success';
            $response['pagoservicio'] = 'NO';
            echo json_encode($response);
        	die();
        }
        
        $Asig = new Gastos_Model_Asignacion();
        $pagoservicio = $Asig->getEsPagoDeServicio($conceptoid);
        
        $configdates = $Asig->getConfiguracionFechas($conceptoid);
		$dates = array();
		$response['dates']['daydel'] = '';
        $response['dates']['dayal'] = '';
        if ( isset($configdates[0]) && count($configdates) > 0 && isset($params['credito'])) {
        	$response['dates']['daydel'] = '';
        	$response['dates']['dayal'] = '';
        	$dates = $Asig->getDatesMax( $conceptoid, $credito, $configdates );
        	if (isset($dates[0])) {
        		$response['dates']['daydel'] = $dates[0]['FECDEL'];
        		$response['dates']['dayal'] = $dates[0]['FECAL'];
        	}
        	
        }
        
        //var_dump($pagoservicio);exit;
        if( $pagoservicio[0]["HAY"] == 'SI') {
            $response['respuesta'] = 'success';
            $response['pagoservicio'] = 'SI';
            //$response['dates'] = $dates;
        } else {
            $response['respuesta'] = 'success';
            $response['pagoservicio'] = 'NO';
        }
        echo json_encode($response);
        die();
    }
    
	public function validaPlanviajeAction()
    {
        $params = $this->getRequest()->getParams();
        $idconcepto = isset($params['idconcepto'])?$params['idconcepto']:0;
        $idgasto = isset($params['idgasto'])?$params['idgasto']:0;
        $isNumero = is_numeric($idgasto);
        
        if ( !$isNumero ) {
        	$responde = array( 
				'success' => false,
				'message' => 'No es un numero de valido'
        	);
        	echo json_encode($responde);
        	exit;
        }
        
    	switch ($idconcepto) {
        	case 1043:
        		$idtask = '13227742553473a8a6c1632051428213';
        	break;
        	case 1045:
        		$idtask = '54716651453473a734fc631093651248';
        	break;
        	default: $idtask = '';
        }
        
        $Asig = new Gastos_Model_Asignacion();
        $isValido = $Asig->getPlanviajeValido($idtask,$idgasto);
    	if ( !isset($isValido[0]) ) {
        	$responde = array( 
				'success' => false,
				'message' => 'El plan de viaje no es valido'
        	);
        	echo json_encode($responde);
        	exit;
        }
        
    	$isValido = $Asig->getPlanviajeVerificado($idgasto,$idconcepto);
    	if ( isset($isValido[0]) && $isValido[0]['IDGASTOMAIN'] != '' ) {
        	$responde = array( 
				'success' => false,
				'message' => 'El plan de viaje ya fue registrado en el caso:'.$isValido[0]['IDGASTOMAIN']
        	);
        	echo json_encode($responde);
        	exit;
        }

        $responde = array( 
			'success' => true,
        	'idgasto' => $idgasto,
			'message' => '<a target="_blank" href="http://'.$_SERVER['HTTP_HOST'].'/gastosfact/public/planesdeviaje/consulta/getdetalleplanviaje/cc/1/caso/'.$idgasto.'" > Detalle plan de viaje </a>'
        );
        
        echo json_encode( $responde );
        die();
    }
    
	public function derivaCasosPlanviajeAction()
	{ 
		$params = $this->getRequest()->getParams();
		$index = isset($params['index'])?$params['index']:'0';
		$app = isset($params['app'])?$params['app']:'0';
		require_once 'Zend/Soap/Client.php';

        $wsdl="http://MXVLSQL04P.pendulum.com.mx/sysworkflow/en/green/services/wsdl2";
		$client = new Zend_Soap_Client($wsdl,array('soap_version' => SOAP_1_1));
		$client->setEncoding('ISO-8859-1');
		$data = array('userid'=>'enespera','password'=>'S1st3ma5');
		$respObj=$client->login($data);
		
		$mensaje = "";
		$respDeriva = '';
		if($respObj->status_code == 0) // si el login es exitoso
		{
			
			$idSession = $respObj->message;
			$arr_caso = array('sessionId'=>$idSession,'caseId'=>$app, 'delIndex'=>$index);
			$respDeriva=$client->routeCase($arr_caso);
			
			echo json_encode( $respDeriva );
			die();
		}else{
			$mensaje = "Error al autenticar con usuario enespera.";
		}
		
		echo json_encode(array("success"=>$respObj->status_code,"data"=>$respObj));
		die();
	}
    
	public function derivaCasosPlanviajeFaltantesAction()
	{ 
		$params = $this->getRequest()->getParams();
		$idgastomain = isset($params['idgasto'])?$params['idgasto']:'0';
		$idconcepto = isset($params['idconcepto'])?$params['idconcepto']:'0';

		$Detalle = new Gastos_Model_Detalle();
		$comprobantes = $Detalle->getComprobanteDeriva($idgastomain,$idconcepto);
		$idGasto = 0; $tas = '';
		$resuInserta = count($comprobantes);
		foreach ( $comprobantes as $value ) {
  			$idGasto = $value['IDPLANVIAJE'];
  			$tpoComprobante = 1;
  			$usuario = $value['FCUSUARIO'];
  			$nombreRFC = $value['NMRFC'];
  			$numRFC = $value['FCRFC'];
  			$importe = $value['FNIMPORTE'];
 			$iva = ((float)$value['FNIVA']/100);
 			$importeiva = $value['FNIMPIVA'];
  			$total = $value['FNTOTAL'];
  			$fdComproba = $value['FDCOMPROBACION'];
  			$uuid = $value['UUID'];
  			$noFactura = $value['FCNOFACTURA'];
  			$xml = $value['FCARCHIVOXML'];
  			$pdf = $value['FCARCHIVOPDF'];
  
  			if( $value['FCTIPOCOMPROBANTE'] == 'Factura' ) {  //Factura
  				$tipoComprobante = 1;
  			} else {
  				$tipoComprobante = 2;
  			}

  			if( $value['IDCONCEPTO'] == 1045 ) {  //Avion
     			$idTpoGasto = 7;
     			$idConcepto = 1;
     			$tas = '54716651453473a734fc631093651248';
  			} else if (  $value['IDCONCEPTO'] == 1043  ) { // Auto
  	 			$idTpoGasto = 8;
     			$idConcepto = 1;
     			$tas = '13227742553473a8a6c1632051428213';
  			}

  			$isComproba = $Detalle->estaComprobado($idGasto,$idTpoGasto,$idConcepto,$noFactura);
  			
  			if ($isComproba[0]['TOTAL'] == 0) {
  				$resuInserta = $Detalle->insertaComprobante($idGasto, $idTpoGasto, $idConcepto, $tipoComprobante, $usuario, $numRFC, $nombreRFC, $importe, $iva, $importeiva, $total, $fdComproba, $noFactura, $xml, $pdf, $uuid);
  				$Detalle->updateBitacoraAprovi( $idGasto, $tas );
  			}
		}

		if( $tas == '' ) {
			echo json_encode( $comprobantes );exit;
		}

		
		
		echo 'resultInserta: '.$resuInserta;
		exit;
	}
	public function derivaCasosPlanviajeFaltanteAction() 
	{
		$params = $this->getRequest()->getParams();
		$idGasto = isset($params['idgasto'])?$params['idgasto']:'0';
		
		if( $params['idconcepto'] == 1045 ) {  //Avion
     		$tas = '54716651453473a734fc631093651248';
  		} else if (  $params['idconcepto'] == 1043  ) { // Auto
  	 		$tas = '13227742553473a8a6c1632051428213';
  		}
		
		$Detalle = new Gastos_Model_Detalle();
		$dataRow = $Detalle->getRowDeriva($idGasto,$tas);
		
		$app = $dataRow[0]['APP_UID'];
		$index = $dataRow[0]['DEL_INDEX'];
		
		require_once 'Zend/Soap/Client.php';

        $wsdl="http://MXVLSQL04P.pendulum.com.mx/sysworkflow/en/green/services/wsdl2";
		$client = new Zend_Soap_Client($wsdl,array('soap_version' => SOAP_1_1));
		$client->setEncoding('ISO-8859-1');
		$data = array('userid'=>'enespera','password'=>'S1st3ma5');
		$respObj=$client->login($data);
		
		$mensaje = "";
		$respDeriva = '';
		
		if($respObj->status_code == 0) // si el login es exitoso
		{
			$idSession = $respObj->message;
			$arr_caso = array('sessionId'=>$idSession,'caseId'=>$app, 'delIndex'=>$index);
			$respDeriva=$client->routeCase($arr_caso);
		
			$response = array( 'app' => $app,'idGasto' => $idGasto, 'data'=> $respDeriva );
			echo json_encode( $response );
			die();
		}else{
			$mensaje = "Error al autenticar con usuario enespera.";
		}
		
		echo json_encode(array("success"=>$respObj->status_code,"data"=>$respObj,""));
		die();
	}
	
	
    public function capturaJustificacionesAction()
    {
    	$this->_helper->layout->setLayout('gastosv2');
    	$params = $this->getRequest()->getParams();
    	
		$etapa = (isset($params['etapa'])) ? $etapa = $params['etapa'] : '';
    	
    	$Asig = new Gastos_Model_Asignacion();
    	$alarmas = $Asig->getAlarmasTitulos( $params['caso'] , $etapa );
    	$data = array();
    	foreach($alarmas AS $index => $alarma)
		{
			$categoria_id = $alarma['IDTIPOAUTORIZA'];
			$id_alarma = $alarma['IDTIPOAUTORIZA'];
			$categoria = $alarma['AUTORIZACION'];
			
			$data[$id_alarma]['titulo'] = $categoria;
			$data[$id_alarma]['data'] = $this->getDataAutorizacion($params['caso'],$id_alarma);
			
		}
   	//var_dump($data);exit;
   	   	$this->view->idgasto = $params['caso'];
    	$this->view->alarmas = $data;

    }
    
    public function getDataAutorizacion($idgasto,$id_alarma) {
    
    	$condicion = '';
		$campo_usuario = '';
		$campo_justificacion = "fdfecregistro";
		$estilosColumna = 'style="background-color: #E1E1FF"';
		$editable = 'string';
			
    	switch($id_alarma)
		{
			case '6': 	$condicion = "AND FCQUEUMBRAL > 0 "; 
						$campo_justificacion = "fcjustificacionumbral"; 
						$campo_resultado = "fcresumbral03,fcresumbral04,fcresumbral05"; 
						$campo_usuario = "fcusuumbral03,fcusuumbral04,fcusuumbral05";
			break;
			case '8': 	$condicion = "AND FNPAGODOBLE > 0 "; 
						$campo_justificacion = "fcjustificapagodbl"; 
						$campo_resultado = "fcrespgodbl01,fcrespgodbl02"; 
						$campo_usuario = "fcusupgodbl01,fcusupgodbl02";
			break;
			case '7': 	$condicion = "AND (VERETAPACDACHKNO IS NOT NULL OR VERETAPAABIERTANO IS NOT NULL OR FCCODACCEXTNO IS NOT NULL OR FCCODRESEXTNO IS NOT NULL)"; 
						$campo_justificacion = "fcjustificaetapa"; 
						$campo_resultado = "fcresetapa01,fcresetapa02"; 
						$campo_usuario = "fcusuetapa01,fcusuetapa02";
			break;
	 		case '9': 	$condicion = "AND FCUSUJFEINMED IS NOT NULL "; 
						$campo_justificacion = "''"; 
						$campo_resultado = "fcresultjfeinmed"; 
						$campo_usuario = "fcusujfeinmed";
			break;
			case '10': 	$condicion = ""; 
						$campo_justificacion = "fcjustificaempresa"; 
						$campo_resultado = "fcresempresa"; 
						$campo_usuario = "fcusuempresa";
			break;
			case '34': 	$condicion = ""; 
						$campo_justificacion = "fcjustificaurgente"; 
						$campo_resultado = "fcresurgente"; 
						$campo_usuario = "fcusuurgente";
			break;
			case '44': 	$condicion = ""; 
						$campo_justificacion = "fcjustificaexcgasto"; 
						$campo_resultado = "fcresexcgasto01,fcresexcgasto02"; 
						$campo_usuario = "fcusuexcgasto01,fcusuexcgasto02";
			break;
			case '45': 	$condicion = ""; 
						$campo_justificacion = "fcjustificetafinal"; 
						$campo_resultado = "fcresetafinal01,fcresetafinal02"; 
						$campo_usuario = "fcusuetafinal01,fcusuetafinal02";
			break;
			case '46': 	$condicion = "AND (FCCREDSTATUS IS NOT NULL OR FCCREDCOLA IS NOT NULL)"; 
						$campo_justificacion = "fcjustificaliq"; 
						$campo_resultado = "fcresliq01,fcresliq02"; 
						$campo_usuario = "fcusuliquidado01,fcusuliquidado02";
			break;
			case '64': 	$condicion = "AND FCUSUPM IS NOT NULL AND FCESFACTURABLE = 'N'"; 
						$campo_justificacion = "FCJUSTIFICAPM"; 
						$campo_resultado = "FCRESULTPM"; 
						$campo_usuario = "FCUSUPM";
			break;
			case '65': 	$condicion = "AND FCUSUNOFACT IS NOT NULL AND FCESFACTURABLE = 'N'"; 
						$campo_justificacion = "FCJUSTIFICANOFACT"; 
						$campo_resultado = "FCRESULTNOFACT"; 
						$campo_usuario = "FCUSUNOFACT";
			break;
			default: $condicion = "";
			         $campo_resultado = "";
			         $campo_resultado = "";
			         $campo_usuario = "";
			break;
			}
				
			$Asig = new Gastos_Model_Asignacion();
			$data = $Asig->getAlarmaDetalle($idgasto,$id_alarma,$condicion,$campo_justificacion, $campo_resultado, $campo_usuario);		
			
			return $data;
    }
    
    public function setJustificacionesAction() {
    	$params = $this->getRequest()->getParams();
    	
    	
    	
    	echo json_encode($params);
    	exit;
    }

    public function testLayoutAction(){

        $this->_helper->layout->setLayout('quantum-uselooper-template');

    }
    
}

