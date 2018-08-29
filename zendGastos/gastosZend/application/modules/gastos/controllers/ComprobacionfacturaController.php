<?php

class Gastos_ComprobacionfacturaController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
        $this->view->baseUrl = $this->getRequest()->getBaseUrl();

    }

    public function indexAction()
    {
        // action body
    }

    public function pantallacomprobafacturaAction()
    {
        $this->_helper->layout->setLayout('layout_factura_xml');
    }

    public function pantallacomprobafacturapvAction()
    {
        $this->_helper->layout->setLayout('layout_factura_xml');
    }

    public function pantallaregresarcfAction()
    {
        $this->_helper->layout->setLayout('layout_regresar_tarea_cf');
    }

    public function abrircancelaciongasAction()
    {
        $this->_helper->layout->setLayout('layout_abrir_cancel_gas');
    }

    public function uploadfileAction(){
        try{
            $this->_helper->layout->disableLayout();
            // Define a destination
            $targetFolder = "/opt/processmaker/shared/sites/workflow/files/gastos/facturaMasiva/";
            $targetVisual = 'http://doc.pendulum.com.mx/pm/gastos/facturaMasiva/'; //Con este permite ver exactamente donde se debe ver el archivo luego de subirlo

            $params = $this->getRequest()->getParams();
            $fechaFile = date("YmdHis");
            if (!empty($_FILES)) {
                $tempFile = $_FILES['file_xml']['tmp_name'];
                $targetPath = $targetFolder;
                // Validate the file type
                $fileTypes = array('xml', 'XML'); // File extensions
                $fileParts = pathinfo($_FILES['file_xml']['name']);
                $solicitudid = (isset($params['numEmpleado']) ==true)? $params['numEmpleado'] : '';
                $nombreArchivo = "" . $solicitudid . "_" . $fechaFile . "." . $fileParts['extension'];
                $targetFile = rtrim($targetPath,'/') . "/" . $solicitudid . "_" . $fechaFile . "." . $fileParts['extension'];
                $fileName = $_FILES['file_xml']['name'];

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

                    $pos_xml = strpos($str, '<?xml', 0);
                    $str_clob = substr($str, $pos_xml);

                    error_reporting(E_ALL ^ E_WARNING);

                    $xml = new SimpleXMLElement($str);
                    //$comprobante = $xml->xpath('//cfdi:Comprobante');

                    $ns = $xml->getNamespaces(true);
                    $xml->registerXPathNamespace('c', $ns['cfdi']);

                    if(!isset($ns['tfd'])){
                        $result['success'] = 'false';
                        $result['msg'] = "Archivo erroneo! El archivo XML no es un archivo de Comprobacion CFDI. El archivo NO cuenta con un Folio Fiscal certificado por el SAT.";
                        echo json_encode($result);
                        die();
                    }

                    $xml->registerXPathNamespace('t', $ns['tfd']);

                    // Leo la version
                    foreach ($xml->xpath('//cfdi:Comprobante') as $cfdiComprobante){
                        $version = $cfdiComprobante['version'];
                        if($version == ""){
                            $version = $cfdiComprobante['Version'];
                        }
                    }

                    foreach ($xml->xpath('//pago10:DoctoRelacionado') as $key=> $filas){
                        $IdDocumento[$key] = $filas['IdDocumento'];
                    }

                    foreach ($xml->xpath('//t:TimbreFiscalDigital') as $tfd){
                        $uuid = (isset($tfd['UUID']))?$tfd['UUID']:'';
                    }

                    if($uuid == ""){
                        $result['success'] = 'false';
                        $result['msg'] = "Archivo no valido, El archivo XML cargado no corresponde a una factura";
                        echo json_encode($result);
                        die();
                    }

                    $Comproba = new Gastos_Model_Comprobacion();

                    $datos['archivo'] = $targetVisual.$nombreArchivo;
                    $datos['idUsuario'] = (isset($params['numEmpleado']) ==true)? $params['numEmpleado'] : '';
                    $datos['nomUsuario'] =  (isset($params['emailEmpleado']) ==true)? $params['emailEmpleado'] : '';
                    $datos['nomArchivoOriginal'] = $fileName;

                    $resultadoCargaMasiva = $Comproba->procesoCargaMasiva($uuid, $IdDocumento, $datos );

                    if(  $resultadoCargaMasiva['datosCoprobante']['validaUUID'] == true ){ //Valida si ya han cargado el archivo XML
                        $result['success'] = 'false';
                        $result['msg'] = "Este Archivo ya existe, Fue cargado por :".$resultadoCargaMasiva['datosUsuario']['nombre']." con fecha de: ".$resultadoCargaMasiva['datosCoprobante']['fecha'];
                       // unlink($targetFile); //Libero espacio en Servidor debido que debo subir archivo para leer el xml
                        echo json_encode($result);
                        die();
                    }

                    if(  $resultadoCargaMasiva['datosCoprobante']['validaUUID'] == false ){//Este arcvhivo no existe por lo que se procedio a Insert u Update
                        $result['success'] = 'true';
                        $result['msg'] = "Comprobante Cargado Exitosamente, ".$resultadoCargaMasiva['datosCoprobante']['nombreArchivo'];
                        echo json_encode($result);
                        die();
                    }
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


    public function busquedavanzadaAction(){
       	$this->_helper->layout->disableLayout();
        $params = $this->getRequest()->getParams();
        $Comproba = new Gastos_Model_Comprobacion();
        $type = 'Arrays';
        $respBusqueda = $Comproba->procesoBusqueda($params, $type);
        $this->view->array_busqueda = $respBusqueda;
    }

    public function busquedavanzadapvAction(){
       	$this->_helper->layout->disableLayout();
        $params = $this->getRequest()->getParams();
        $Comproba = new Gastos_Model_Comprobacion();
        $type = 'Arrays';
        $respBusqueda = $Comproba->procesoBusquedapv($params, $type);
        $this->view->array_busqueda = $respBusqueda;
    }


    public function listaCargaMasivaAction(){
       	$this->_helper->layout->disableLayout();
        $params = $this->getRequest()->getParams();
        $Comproba = new Gastos_Model_Comprobacion();
        $type = 'Json';
//        $params['numGasto'] = '190933';
        $response = $Comproba->procesoBusqueda($params, $type );
        echo json_encode($response);
        die();
    }

    public function listaCargaMasivapvAction(){
       	$this->_helper->layout->disableLayout();
        $params = $this->getRequest()->getParams();
        $Comproba = new Gastos_Model_Comprobacion();
        $type = 'Json';
        //$params['numGasto'] = '190933';
        $response = $Comproba->procesoBusquedapv($params, $type );
        echo json_encode($response);
        die();
    }

    /**
     * @author Leonard Cuenca <ljcuenca@pendulum.com.mx>
     * @company Neta System C.A
     * @deprecated Lista las Tareas
     * @access public
     *
     */
    public function listaTareasAction(){
        $this->_helper->layout->disableLayout();
        $params = $this->getRequest()->getParams();
        $Comproba = new Gastos_Model_Comprobacion();
        $response = $Comproba->procesoBusquedaTareas($params);
        echo ($response);
        die();
    }
    /**
     * @author Leonard Cuenca <ljcuenca@pendulum.com.mx>
     * @company Neta System C.A
     * @deprecated Proceso regresar tarea.
     * @access public
     *
     */
    public function regresarTareaPmAction(){
        $this->_helper->layout->disableLayout();
        $params = $this->getRequest()->getParams();
        $Comproba = new Gastos_Model_Comprobacion();
        $params['ruta'] = $this->view->baseUrl;
        $response = $Comproba->procesoRegresarTareasIndex($params);
        echo ($response);
        die();
    }






}

