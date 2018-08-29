<?php

class Gastos_MontosolicitudController extends Zend_Controller_Action
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

        $this->view->solicitudid = $solicitudid;
        $userid = isset($empleadoid)?$empleadoid:'1471';
        $this->view->userid = $userid != "0" ? $userid : 'jccabrera';
    }
	
	public function getdetallecomprobacionAction()
	{
		$this->_helper->layout->disableLayout();
		
		$params = $this->getRequest()->getParams();
		$solicitudid = isset($params['solicitudid'])?$params['solicitudid']:0;
    	$Comproba = new Gastos_Model_Comprobacion();
    	$comprobaciones = $Comproba->getDetalleComprobacion( $solicitudid );
    	//var_dump($comprobaciones);exit;
    	$this->view->comprobaciones = $comprobaciones;
	}
	
	public function setcomprobacionAction()
	{
		$params = $this->getRequest()->getParams();
		//var_dump($params);exit;
    	$arrayCreditos = explode("|", $params['creditos']);
    	$arrayImportes = explode("|", $params['importes']);
    	$arrayConceptos = explode("|", $params['conceptos']);
    	$gastoid = $params['gastoid'];

    	$sql="DECLARE ASIGNACONCEPTOS PENDUPM.PCKFACTURACIONGASTO.TABASIGNACOMP; BEGIN ";
    	$indicador = 1;
    	
    	if (is_array($arrayCreditos)) {
	    	 for($i = 0; $i <= count($arrayCreditos) - 2; $i++){
	    	 	$sql.="ASIGNACONCEPTOS({$indicador}).rIdGasto := {$gastoid};";
				$sql.="ASIGNACONCEPTOS({$indicador}).rConcepto := {$arrayConceptos[$i]};";
				$sql.="ASIGNACONCEPTOS({$indicador}).rCredito := '{$arrayCreditos[$i]}';";
				$sql.="ASIGNACONCEPTOS({$indicador}).rImporteCom := {$arrayImportes[$i]};";
	    	 	$indicador++;
	    	 }
    	 }
		$sql.="PENDUPM.PCKFACTURACIONGASTO.setAsignacomprobacion(ASIGNACONCEPTOS, :statAplica); END;";
    	
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
}

