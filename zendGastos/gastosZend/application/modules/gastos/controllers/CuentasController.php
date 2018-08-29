<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Gastos_CuentasController extends Zend_Controller_Action
{
 
	public function init()
	{
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		//$this->_helper->layout()->disableLayout();
	}

	public function indexAction()
	{
		$params = $this->getRequest()->getParams();
		$this->_helper->layout()->disableLayout();

		$Cuentas = new Gastos_Model_Cuentas();
		$casos = $Cuentas->getAllCuentas( $params["credito"] );
		//$isPagosS = $Cuentas->getIsPagosServ( $params["credito"] );
		$validaPago = 0;

		foreach( $casos as $i => $item ) {
			
			$casos[$i]["GASTO"] = '<a data-caso=\"'.$casos[$i]["GASTO"].'\" class=\"getDetalle\">'.$casos[$i]["GASTO"].'</a>';

			$casos[$i]["NOMBRESOLICITA"] = UTF8_encode( $casos[$i]["NOMBRESOLICITA"] );

			// Botones
			$casos[$i]["BTNACC"] = "";
	/*		if ( $casos[$i]["FDFECSERVPAGADODEL"] == "" && $casos[$i]["FDFECSERVPAGADOAL"] == "" && $casos[$i]["STATUS"] == "FINALIZADO" ) {
				$casos[$i]["BTNACC"] = '<a href=\"#\" class=\"btnEdit\" >Editar</a> <a href=\"#\" class=\"btnSave\" data-case=\"'.$item["GASTO"].'\" data-credito=\"'.$params["credito"].'\" data-concepto=\"'.$item["CONCEPTO"].'\" >Guardar</a>';
			} 
		*/	
			if($casos[$i]["STATUS"] == "FINALIZADO") {
				$casos[$i]["STATUS"] = '<div style=\"color:green;\">'.$casos[$i]["STATUS"].'</div>';
			} else {
				$casos[$i]["STATUS"] = '<div style=\"color:red;\">'.$casos[$i]["STATUS"].'</div>';
			}
			
			// Status
			if($casos[$i]["STATUS"] == "FINALIZADO") {
				$casos[$i]["STATUS"] = '<div style=\"color:green;\">'.$casos[$i]["STATUS"].'</div>';
			} else {
				$casos[$i]["STATUS"] = '<div style=\"color:red;\">'.$casos[$i]["STATUS"].'</div>';
			}
			
			$casos[$i]["documents"] = $Cuentas->getDocumentsByCase($item["GASTO"],$params["credito"],$item["CONCEPTO"],$item["IDCOMPROBACION"]);

			$PDF = "";
			if ( isset($casos[$i]["documents"][0]["PDF"]) ) {
				$PDF = str_replace("http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=","http://doc.pendulum.com.mx/PM/gastos/comprobacion/",$casos[$i]["documents"][0]["PDF"]);
			} 
			$XML = "";
			if ( isset($casos[$i]["documents"][0]["XML"]) ) {
				$XML = str_replace("http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=","http://doc.pendulum.com.mx/PM/gastos/comprobacion/",$casos[$i]["documents"][0]["XML"]);
			}
			$PDFC = "";
			if ( isset($casos[$i]["documents"][0]["PDFC"]) ) {
				$PDFC = str_replace("http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=","http://doc.pendulum.com.mx/PM/gastos/comprobacion/",$casos[$i]["documents"][0]["PDFC"]);
			}

			if( strlen($PDF) > 0 ) {
				$PDF = '<a target=\"_blank\" class=\"jqgridurl\" href=\"'.$PDF.'\">PDF</a><br>';
			}
			if( strlen($XML) > 0 ) {
				$XML = '<a target=\"_blank\" class=\"jqgridurl\" href=\"'.$XML.'\">XML</a><br>';
			}
			if( strlen($PDFC) > 0 ) {
				$PDFC = '<a target=\"_blank\" class=\"jqgridurl\" href=\"'.$PDFC.'\">PDF2</a>';
			}

			$casos[$i]["documents"] = $PDF."".$XML."".$PDFC;

			$isPago = $Cuentas->isPagosServ($item["CONCEPTO"]);

			if( $validaPago == 0 && $isPago[0]["TOTAL"] == 1 ) {
				$validaPago = 1;
			}
			
			$casos[$i]["FCCOMENTARIOPAGOSERV"] = "";//str_replace('"', '\"', $casos[$i]["FCCOMENTARIOPAGOSERV"]);
		}

		$this->view->mostrarPS = $validaPago;
		$this->view->campos = json_encode($casos);
		//$this->view->isPS = $isPagosS;
		$this->view->credito = $params["credito"];
	}

	public function editRowAction(){
		
		$params = $this->getRequest()->getParams();
		$this->_helper->layout()->disableLayout();

		$Cuentas = new Gastos_Model_Cuentas();
		$casos = $Cuentas->setFechasPagoServicios( $params ); 
		
		$response = array( 'success' => true, 'data' => $casos );
		echo json_encode( $response );
		exit;
	}

}
