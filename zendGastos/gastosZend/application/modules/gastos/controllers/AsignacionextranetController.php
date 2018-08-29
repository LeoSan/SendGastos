<?php

class Gastos_AsignacionextranetController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
    	//$this->_helper->layout->disableLayout();
        $this->_helper->layout->setLayout('extranet');
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
	 $claveQuasar = $Asig->getClaveQuasar($empleadoid);
        //var_dump($misconceptos);exit;
        $this->view->categorias = $categorias;
        $this->view->carteras = array();
        $this->view->catcentrocosto = $catcentrocosto;
        $this->view->solicitudid = $solicitudid;
        $this->view->misconceptos = $misconceptos;
        //$this->view->tipoAsigActual = $tipoAsigActual[0]['TIPO'];
        
        $this->view->empleadoid = $empleadoid != "0" ? $empleadoid : '0';
        $this->view->tiposolicitud = $tiposolicitud != "0" ? $tiposolicitud : '0';
        $this->view->tipocaptura = $tipocaptura != "0" ? $tipocaptura : '0';
        $this->view->puestoid = $puestoid != "0" ? $puestoid : '0';
        $this->view->usuariopm = $usuario != "0" ? $usuario : '0';
        $this->view->appuid = $appuid != "0" ? $appuid : '0';
	 $this->view->claveQuasar = $claveQuasar != "0" ? $claveQuasar : '0';
        
        $tipocaptura = isset($params['tipocaptura'])?$params['tipocaptura']:0;
    	$tipocapturaLabel = 'Crédito / Cartera / Importe';
    	if( $tipocaptura == "2" || $tipocaptura == "3" ){
    		$tipocapturaLabel = 'Cr&eacute;dito';
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
    	
    	$tipocapturaLabel = 'Crédito / Cartera / Importe';
    	if( $tipocaptura == "2" || $tipocaptura == "3" ){
    		$tipocapturaLabel = 'Cr&eacute;dito';
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

		$Asig = new Gastos_Model_Asignacionextranet();
		$subcategorias = $Asig->getSbCatConceptoAsig($categoriaid, $tiposolicitud, $queasigna, $puesto);

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
		$params         = $this->getRequest()->getParams();

		$categoriaid    = isset($params['categoriaid'])?$params['categoriaid']:0;
		$subcategoriaid = isset($params['subcategoriaid'])?$params['subcategoriaid']:0;
		$tiposolicitud  = isset($params['tiposolicitud'])?$params['tiposolicitud']:0;
		$queasigna      = isset($params['queasigna'])?$params['queasigna']:0;
		$puesto         = isset($params['puesto'])?$params['puesto']:0;
		$texto          = isset($params['texto'])?$params['texto']:0;

		$Asig = new Gastos_Model_Asignacionextranet();
		$conceptos = $Asig->getQueConceptoNmAsig($categoriaid, $subcategoriaid, $texto, $tiposolicitud, $queasigna, $puesto);

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

		$Asig = new Gastos_Model_Asignacionextranet();
		$conceptos = $Asig->getQueConceptoAsig($categoriaid, $subcategoriaid, $tiposolicitud, $queasigna, $puesto);

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

		$params['empleadoid'] = str_replace( "P","", $params['empleadoid'] );

		$Asig = new Gastos_Model_Asignacion();
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
    	$targetFolder = $_SERVER['DOCUMENT_ROOT'] . '/file_external/GASTOS/';
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
				fwrite($gestor, "spawn /usr/bin/scp /var/www/gastosfact/public/fileTmp/" . str_replace($targetFolder,'',$targetFile) . " usubpm@10.73.98.40:./GASTOS/GTO" . $solicitudid . "PASO.csv\n");
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
			$result['msg'] = "Excepción: " . $e->getMessage();
            echo json_encode($result); die();
    	}
    }

	public function asignacionExternoAction()
	{
		$this->_helper->layout->setLayout('extranet');
		$params = $this->getRequest()->getParams();

		$empleadoid = isset($params['empleadoid'])?$params['empleadoid']:'1471';
		$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:'113891';
		$tiposolicitud = isset($params['tiposolicitud'])?$params['tiposolicitud']:'0';
		$tipocaptura = isset($params['tipocaptura'])?$params['tipocaptura']:'0';
		$puestoid = isset($params['puestoid'])?$params['puestoid']:'0';
		$usuario = isset($params['usuario'])?$params['usuario']:'0'; // Process Maker
		$appuid = isset($params['appuid'])?$params['appuid']:'0';
		$externo = isset($params['externo'])?$params['externo']:'0';

		$Asig = new Gastos_Model_Asignacionextranet();
		$categorias = $Asig->getCatConceptoAsig($tiposolicitud, $tipocaptura, $puestoid); 
		$catcentrocosto = $Asig->getCategoriaCC($solicitudid, $tiposolicitud);
		$misconceptos = $Asig->getMisConceptos($empleadoid,$externo);

        $misjuicios = $Asig->getMisJuicios($usuario,$externo);  

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
    	$tipocapturaLabel = 'Crï¿½dito / Cartera / Importe';
    	if( $tipocaptura == "2" || $tipocaptura == "3" ){
    		$tipocapturaLabel = 'Cr&eacute;dito';
    	}
		if( $tipocaptura == "4"){
    		$tipocapturaLabel = 'Cartera';
    	}
		if( $tipocaptura == "42"){
    		$tipocapturaLabel = 'Importe';
    	}
    	if( $tipocaptura == "50"){
    		$tipocapturaLabel = 'Cr&eacute;dito';
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

		$tipocapturaLabel = 'Cr&eacute;dito / Cartera / Importe';
		if( $tipocaptura == "2" || $tipocaptura == "3" || $tipocaptura == "50" ){
			$tipocapturaLabel = 'Cr&eacute;dito';
		}
		if( $tipocaptura == "4"){
			$tipocapturaLabel = 'Cartera';
		}
		if( $tipocaptura == "42"){
			$tipocapturaLabel = 'Importe';
		}
    	
		$this->view->tipocapturaLabel = $tipocapturaLabel;
	}


}

