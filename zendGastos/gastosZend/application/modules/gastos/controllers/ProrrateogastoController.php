    <?php

class Gastos_ProrrateogastoController extends Zend_Controller_Action
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

    public function uploadfileAction()
    {

        $empleadoid = $this->getRequest()->getParam('empleadoid', '');
        $solicitudid = $this->getRequest()->getParam('solicitudid', '');
        $nombrearchivo = '';
        $params = $this->getRequest()->getParams();
//        echo '<pre>';print_r($params);exit;
        /**/
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
                //$targetFile = rtrim($targetPath,'/') . "/PRORRATEO" . $solicitudid . "FILE.csv";
                $targetFile = rtrim($targetPath,'/') . "/PRORRATEO" . $solicitudid . "FILE.csv";
                // Validate the file type
//                $fileTypes = array('csv'); // File extensions
                // Validate the file type
                $fileTypes = array('jpg','jpeg','gif','png','pdf','xls', 'xlsx','doc','docx','csv'); // File extensions
                //$fileTypes = array('pdf', 'csv', 'xls', 'xlsx', 'txt', 'doc');
                $fileParts = pathinfo($_FILES['Filedata']['name']);

                if (in_array($fileParts['extension'],$fileTypes)) {
                    $up = move_uploaded_file($tempFile,$targetFile);
                    if( !$up ){
                        throw new Exception("No se pudo mover el archivo: " . $targetFile);
                        $response['success'] = 'false';
                        $response['msg'] = "No se pudo mover el archivo: " . $targetFile;
                        echo json_encode($response); die();
                    }

                    chmod($targetFile, 0777); //Dar todos los permisos a los archivos

                    $response['success'] = 'true';
                    $response['file'] = "PRORRATEO" . $solicitudid . "FILE.csv";
                    $response['msg'] = 'Archivo ' . str_replace($targetFolder,'',$targetFile) . ' cargado correctamente.';
                    $response['total'] = 0;
                    $nombrearchivo = "PRORRATEO" . $solicitudid . "FILE.csv";
                    //$result['shell_res'] = $shell;
                    //$result['shell_file'] = $archivoEjecutar;
                    //echo json_encode($result);
                    //die();
                } else {
                    $response['success'] = 'false';
                    $response['msg'] = "Tipo de archivo no permitido.";
                    echo json_encode($response);
                    die();
                }
            }

            if($response['success'] == 'true'){
                $Prorrateo = new Gastos_Model_ProrrateoComproba();
                $psError = $Prorrateo->setProrrateoCreditos( $solicitudid, $nombrearchivo, $empleadoid );
                //var_dump($psError);exit;
                if( $psError['error'] == "0") {
                    $response['success'] = 'true';
                    $response['msg'] = $psError['error'];
                    $response['total'] = $psError['total'];
                } else {
                    $response['success'] = 'fail';
                    $response['msg'] = $psError['error'];
                }
            }
            echo json_encode($response);
            die();
            /*
            $result['success'] = 'false';
            $result['msg'] = "Archivo no recibido. Intente de nuevo.";
            echo json_encode($result);
            die();
            */
        } catch( Exception $e) {
            $result['success'] = 'false';
            $result['msg'] = "Excepción: " . $e->getMessage();
            echo json_encode($result); die();
        }
    }
    
    public function getprorrateodetalleAction()
	{
		$this->_helper->layout->disableLayout();
		
		$params = $this->getRequest()->getParams();
		$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
		$nombrearchivo = isset($params['nombrearchivo'])?$params['nombrearchivo']:'';
    	$Prorrateo = new Gastos_Model_ProrrateoComproba();
    	if($nombrearchivo == ""){
    		$nombrearchivo = 'PRORRATEO' . $solicitudid . 'FILE';
    	}
    	//var_dump($nombrearchivo);exit;
    	$creditos = $Prorrateo->getDetalleCreditos($solicitudid, $nombrearchivo );
    	//var_dump($asignaciones);exit;

    	$this->view->creditos = $creditos;
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
		if( $tipocaptura == "50"){
    		$tipocapturaLabel = 'Cuenta';
    	}
    	
    	$this->view->tipocapturaLabel = $tipocapturaLabel;
	}
}

