<?php

class Gastos_VerificacionsatController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
        $this->view->baseUrl = $this->getRequest()->getBaseUrl();
        $this->model = new Gastos_Model_Verificacionsat();
    }


    public function indexAction()
    {
        $params = $this->getRequest()->getParams();
        $msg=$this->model->validaFolioFiscal($params);
        $this->view->msg=$msg;
        exit;

    }

    public function getInfoAction()
    {
//        phpinfo();
        $params = $this->getRequest()->getParams();
//        $msg=$this->model->validaFolioFiscal($params);
        $client = new Zend_Soap_Client("https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?wsdl",array('soap_version' => SOAP_1_1 ));
//        $client->setEncoding('ISO-8859-1');
        //uso: asumimos que tenemos  el RFC del emisor, el RFC del receptor,  el total y el uuid (folio fiscal).
        $rfcreceptor="BIN150119HL2";
        $rfcemisor="DINR880914AC5";
        $total="10000.00";
        $uuid="52E5936A-0E72-4198-B883-429B4702A0D6";
        /**Ejemplo de factura cancelada*/
        //$rfcreceptor="BBA830831LJ2";
        //$rfcemisor="CES790211HK4";
        //$total="9996.00";
        //$uuid="C9128871-DA81-4D0B-BF9B-6683C9AB9C28";
//
        echo $factura   = "?re=".$rfcemisor."&rr=".$rfcreceptor."&tt=".str_pad(number_format($total,6,".",""),17,0,STR_PAD_LEFT)."&id=".strtoupper($uuid);
//                echo '<pre>';print_r($client->status_code);exit;
//                echo '<pre>';SoapClient($client->__getFunctions());exit;

//        $resultado = $client->Consulta(array($factura));
//        echo '<pre>';print_r($resultado);exit;
       echo 'hola';
        exit;
    }

    public function uploadfileAction()
    {
        $params = $this->getRequest()->getParams();
        $this->model->uploadFile($params);
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

        $tipocapturaLabel = 'Cr�dito / Cartera / Importe';
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
    
	public function consultaCfdiServiceAction()
    {
		$this->_helper->layout->disableLayout();

		$Asig = new Gastos_Model_Verificacionsat();
        $datos = $Asig->getDetalleComprobante( );
		
        $rfcreceptor = $datos[0]["RFC_RECEPTOR"];
		$rfcemisor   = $datos[0]["RFC_EMISOR"];
		$total       = $datos[0]["FNTOTAL"];
		$uuid        = $datos[0]["UUID"];
		$idcomprobacion  = $datos[0]["IDCOMPROBACION"];

		$factura = "?re=".$rfcemisor."&rr=".$rfcreceptor."&tt=".str_pad(number_format($total,6,".",""),17,0,STR_PAD_LEFT)."&id=".strtoupper($uuid);
		
		$options=array('trace'=>true, 'stream_context'=>stream_context_create( array('http' => array('timeout'=>1) ) ));
		$client = new SoapClient("https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?wsdl",$options);

		$resultado = $client->Consulta(array('expresionImpresa'=>$factura));

		//echo $factura;
		//echo '<br><br>';
	   	//var_dump($resultado->ConsultaResult);
		
	   	//$resultado = $resultado->ConsultaResult->Estado.' - '.$resultado->ConsultaResult->CodigoEstatus;
	   	$resultado = $resultado->ConsultaResult->Estado;
	   	$datos = $Asig->getSetValidaComprobante( $idcomprobacion, $resultado );
	   	
		//echo '<br><br>';
        //echo $datos;
	   	exit;
        
    }
    
}

