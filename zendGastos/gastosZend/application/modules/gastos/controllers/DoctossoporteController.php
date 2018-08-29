<?php

class Gastos_DoctossoporteController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
    	//$this->_helper->layout->disableLayout();
        $this->_helper->layout->setLayout('gastos');
        $params = $this->getRequest()->getParams();
    	//var_dump($params);exit;
    	$empleadoid = isset($params['empleadoid'])?$params['empleadoid']:'1471';
        $solicitudid = isset($params['solicitudid'])?$params['solicitudid']:'113891';
		$tipocaptura = isset($params['tipocaptura'])?$params['tipocaptura']:0;
        $this->view->solicitudid = $solicitudid;
        $userid = isset($empleadoid)?$empleadoid:'1471';
        $this->view->empleadoid = $userid != "0" ? $userid : 'jccabrera';
        $this->view->tipocaptura = $tipocaptura != "0" ? $tipocaptura : '0';
    }
	
	public function getdetalledoctossoporteAction()
	{
		$this->_helper->layout->disableLayout();
		
		$params = $this->getRequest()->getParams();
		$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
    	$DoctosSop = new Gastos_Model_Doctossoporte();
    	$documentossoporte = $DoctosSop->getDetalleDoctosSoporte( $solicitudid );

    	//var_dump($documentossoporte);exit;
    	$this->view->documentossoporte = $documentossoporte;
    	
    	$tipocaptura = isset($params['tipocaptura'])?$params['tipocaptura']:0;
    	$tipocapturaLabel = 'Cuenta / Cartera / Importe';
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
	
	public function getdetdocsoparchsAction()
	{
		$this->_helper->layout->disableLayout();
		
		$params = $this->getRequest()->getParams();
		$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
		$conceptoid = isset($params['concepto'])?$params['concepto']:0;
		$nmdocumento = isset($params['nmdocumento'])?$params['nmdocumento']:"";
		$nmdocumento = trim($nmdocumento); // Quitamos espacios a inicio y al final
    	$DoctosSop = new Gastos_Model_Doctossoporte();
    	$documentosinicio = $DoctosSop->getDetDocSopArchS( $solicitudid, $conceptoid, $nmdocumento );

    	//var_dump($documentosinicio);exit;
    	$this->view->nmdocumento = $nmdocumento;
    	$this->view->documentossoporte = $documentosinicio;
	}
	
	public function setadddoctosoporteAction()
	{
		$params = $this->getRequest()->getParams();
		//var_dump($params);exit;
		$origen = $params['origen'];
		if($origen == "2"){
			$arrayConsecutivos = explode("|", $params['consecutivos']);
			$gastoid = $params['solicitudid'];
			$userid = $params['userid'];
			$archivo = $params['nmdocumento'];
			$ruta = $params['archivo_soporte'];
			
			//$ruta = '/opt/processmaker/workflow/public_html/pendulum/procesoGastos/documentos_soporte/' . $params['archivo_soporte'];
	    	$ruta = 'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastos?archivo=' . $params['archivo_soporte'];
	    	
	    	$sql="DECLARE DOCTOSOPORTE PENDUPM.PCKFACTURACIONGASTO.TABDOCTOINI; BEGIN ";
	    	$indicador = 1;
	    	
	    	if (is_array($arrayConsecutivos)) {
		    	 for($i = 0; $i <= count($arrayConsecutivos) - 2; $i++){
		    	 	$sql.="DOCTOSOPORTE({$indicador}).rIdGasto := {$gastoid};"; //NUMBER(15)NUMBER(15)
					$sql.="DOCTOSOPORTE({$indicador}).rconsecutivo := {$arrayConsecutivos[$i]};"; //NUMBER(15),
					$sql.="DOCTOSOPORTE({$indicador}).rArchivo := '{$archivo}';"; //VARCHAR2(255), /*LW IDDOCTO AGREGAR NOMBRE ARCHIVO */
					$sql.="DOCTOSOPORTE({$indicador}).rRuta := '{$ruta}';"; //VARCHAR2(255)
					$sql.="DOCTOSOPORTE({$indicador}).rQueEs := '{$origen}';"; //CHAR(1)  /* 1 LW 2 AGREGAR NUEVOFILE */
		    	 	$indicador++;
		    	 }
	    	 }
			$sql.="PENDUPM.PCKFACTURACIONGASTO.setAddDoctoSoporte(DOCTOSOPORTE,'{$userid}', :statAplica); END;";
    	}else if($origen == "1"){
    		$gastoid = $params['solicitudid'];
			$consecutivo = $params['consecutivoLw'];
			$nmdocumento = $params['nmdocumentoLw'];
			$ruta = $params['ruta'];
			$userid = $params['userid'];
			
	    	$sql="DECLARE DOCTOSOPORTE PENDUPM.PCKFACTURACIONGASTO.TABDOCTOINI; BEGIN ";
	    	$indicador = 1;
	    	
	    	$sql.="DOCTOSOPORTE({$indicador}).rIdGasto := {$gastoid};"; //NUMBER(15)NUMBER(15)
			$sql.="DOCTOSOPORTE({$indicador}).rconsecutivo := {$consecutivo};"; //NUMBER(15),
			$sql.="DOCTOSOPORTE({$indicador}).rArchivo := '{$nmdocumento}';"; //VARCHAR2(255), /*LW IDDOCTO AGREGAR NOMBRE ARCHIVO */
			$sql.="DOCTOSOPORTE({$indicador}).rRuta := '{$ruta}';"; //VARCHAR2(255)
			$sql.="DOCTOSOPORTE({$indicador}).rQueEs := '{$origen}';"; //CHAR(1)  /* 1 LW 2 AGREGAR NUEVOFILE */
		    
			$sql.="PENDUPM.PCKFACTURACIONGASTO.setAddDoctoSoporte(DOCTOSOPORTE,'{$userid}', :statAplica); END;";
    	} else {
    		$sql = "";
    	}
		
		/*
		$response['respuesta'] = 'fail';
        $response['msj'] = $sql;
    	echo json_encode($response);
        die();
		 */
		$DocSop = new Gastos_Model_Doctossoporte();
		//echo $sql; exit;
    	$psError = $DocSop->setAddDoctoSoporte($sql);
    	
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
	
	public function uploadfileAction()
    {
    	try{
    	// Define a destination
    	//$targetFolder = $_SERVER['DOCUMENT_ROOT'] . '/gastosfact/public/fileTmp/';
    	//$targetFolder = $_SERVER['DOCUMENT_ROOT'] . '/../../../opt/processmaker/workflow/public_html/pendulum/procesoGastos/documentos_soporte/';
    	$targetFolder = '/opt/processmaker/shared/sites/workflow/files/gastos/documentos';
    	
    	$params = $this->getRequest()->getParams();
		$solicitudid = $params['solicitudid'];
		$consecutivo = isset($params['consecutivo'])?$params['consecutivo']:0;
		$indice = isset($params['indice'])?$params['indice']:0;

		//echo $targetFolder;exit;
        if ( $this->ping('doc.pendulum.com.mx') ){
             if (!empty($_FILES)) {
			$tempFile = $_FILES['Filedata']['tmp_name'];
			$targetPath = $targetFolder; //$_SERVER['DOCUMENT_ROOT'] . $targetFolder;
			//$targetFile = rtrim($targetPath,'/') . '/' . $_FILES['Filedata']['name'];
			$targetFile = rtrim($targetPath,'/') . "/" . $solicitudid . "_" . $consecutivo . "_" . $indice . ".pdf";
			// Validate the file type
			$fileTypes = array('pdf','PDF','zip','ZIP','rar','RAR','xls','XLS','xlsx','XLSX'); // File extensions
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
				
				//chmod($targetFile, 0777); //Dar todos los permisos a los archivos
				
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
				$result['file'] = $solicitudid . "_" . $consecutivo . "_" . $indice . ".".$fileParts['extension'];
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
        } else {
                $result['success'] = 'false';
                $result['msg'] = "Solo se permite archivos de imagen o documentos PDF";
                echo json_encode($result);
                die();
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
	
	public function getlwdigitalAction()
	{
		$this->_helper->layout->disableLayout();
		$params = $this->getRequest()->getParams();
		$credito = isset($params['credito'])?$params['credito']:'';
		$credito = trim($credito); // Quitamos espacios a inicio y al final
		$DoctosSop = new Gastos_Model_Doctossoporte();
    	$documentos = $DoctosSop->getLwDigital( $credito );
		
    	//var_dump($documentos);exit;
    	$this->view->credito = $credito;
    	$this->view->documentos = $documentos;
    	
    	/*
		$credito = $this->getRequest()->getParam('credito');
    	$asociar = $this->getRequest()->getParam('asociar');
    	$pantalla = 'getLWDigital';
    	$data = array('credito' => $credito);
		$inventarioDetail = OracleProcedureManager::getInstance()->getReporteExterno($data, $pantalla);

        $logger->info(print_r($inventarioDetail,true). " Inventario Detail");
        error_log(print_r($inventarioDetail, true));
    	$response = array();
        $i = 0;
        foreach ($inventarioDetail as $item) {
            $response['rows'][$i]['id'] = $i + 1;
            $file = '<a href="' . $item['VIEWER'] . '" id="' . $item['VIEWER'] . '" target="_blank">' . $item['ARCHIVO'] . '</a>';
            $response['rows'][$i]['cell'] = array(
                //$i + 1,
                $asociar ? '<input type="checkbox" id="" name="" value="' . $item['VIEWER'] . '" ></input>' : $i + 1,
            	$item['INDICE'],
            	htmlentities($item['DESCRIPCION']),
            	htmlentities($item['FECALTA']),
            	htmlentities($item['USUARIO']),
            	$file 	
            );
            $i++;
        }
        $response['page'] = 1;
        $response['total'] = count($inventarioDetail);
        $response['records'] = $response['total'];
        echo json_encode($response);
        die();
        */
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

}

