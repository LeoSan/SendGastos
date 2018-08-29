<?php

class Gastos_EnviarcorreoController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
        // action body
        $EnvioCorreo = new Gastos_Model_EnvioCorreo();
        $correos = $EnvioCorreo->getCorreoEnviar();
        
        if(count($correos) <= 0){
        	echo "No hay Correos a enviar.";exit;
        }
        
        foreach ($correos as $item){
        	//Enviamos un correo a archivo
    		$subject   	= $item['ASUNTO'];
    		$body 		= $item['CUERPO'];
    		$from 		= $item['DEQUIEN'];
    		$fromName	= utf8_decode($item['NMFROM']);
    		$to 		= $item['PARAQUIEN'];
    		$cc 		= $item['COPIAQUIEN'];
    		$body 		= $item['CUERPO']->load();
    		//$body 		= "<h1>Correo de prueba</h1><p>Hacer caso omiso a este correo</p>";

			$casoid 	= $item['QUECASO'];
			$consecutivo = $item['QUECONSEC'];
			/*
    		$obj = Pendum_Db_SendEmail::getInstance();
    		var_dump($obj);exit;
    		exit;
    		*/
    		$res = Pendum_Db_SendEmail::getInstance()->send(
				'smtp',
				array(
					'from' 		=> $from,
					'fromName'	=> $fromName ,
					'to' 		=> $to,
					'cc' 		=> $cc,
					'cco' 		=> 'sistemas_soporte@pendulum.com.mx',
					'subject' 	=> $subject,
					'body' 		=> $body
				)
			);
			/*var_dump(array(
					'from' 		=> $from,
					'fromName'	=> $fromName ,
					'to' 		=> $to,
					'cc' 		=> $cc,
					'cco' 		=> 'sistemas_soporte@pendulum.com.mx',
					'subject' 	=> $subject,
					'body' 		=> $body
				));*/
			if($res){
				$resActualiza = $EnvioCorreo->setCorreoEnviado($casoid, $consecutivo);
			}
        }
        echo "Correo enviado exitosamente";exit;
    }
    
	public function enviarcorreodynAction()
    {
        // Aplicamos los correos que se van a enviar, llenando la tabla de correos pendientes
		$EnvioCorreo = new Gastos_Model_EnvioCorreo();
        //$res = $EnvioCorreo->getEnvCorreoNotifPagoProv(1);        
    	
    	
    	//Enviamos el correo a los proveedores que tienen pagos depositados
        $correos = $EnvioCorreo->getCorreoEnviarDyn();
        
        if(count($correos) <= 0){
        	echo "No hay Correos a enviar.";exit;
        }
        
        foreach ($correos as $item){
        	//Enviamos un correo a archivo
    		$subject   	= $item['ASUNTO'];
    		$body 		= $item['CUERPO'];
    		$from 		= $item['DEQUIEN'];
    		//$fromName	= $item['NMFROM'];
    		$fromName	= $from;
    		$to 		= $item['PARAQUIEN'];
    		$cc 		= $item['COPIAQUIEN'];
    		$body 		= $item['CUERPO']->load();
    		$referencia = $item['REFERENCIA'];
    		$idproveedor = $item['IDPROVEEDOR'];
    		$cuentadeposito = $item['CUENTADEPOSITO'];
    		//$body 		= "<h1>Correo de prueba</h1><p>Hacer caso omiso a este correo</p>";

			//$casoid 	= $item['QUECASO'];
			//$consecutivo = $item['QUECONSEC'];
			/*
    		$obj = Pendum_Db_SendEmail::getInstance();
    		var_dump($obj);exit;
    		exit;
    		*/
    		$res = Pendum_Db_SendEmail::getInstance()->send(
				'smtp',
				array(
					'from' 		=> $from,
					'fromName'	=> $fromName ,
					'to' 		=> $to,
					'cc' 		=> $cc,
                    'cco' 		=> 'sistemas_soporte@pendulum.com.mx',
					'subject' 	=> $subject,
					'body' 		=> $body
				)
			);
			
			if($res){
				$resActualiza = $EnvioCorreo->setCorreoEnviadoDyn($referencia, $idproveedor, $cuentadeposito);
			}
        }
        echo "Correo enviado exitosamente";exit;
    }
	
	public function noautorizadoAction()
	{
		$this->_helper->layout->disableLayout();
		//echo "Este usuario no esta autorizado para usar la aplicacion";exit;
	}
}

