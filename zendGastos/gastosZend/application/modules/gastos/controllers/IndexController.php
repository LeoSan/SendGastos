<?php

class Gastos_IndexController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
        // action body
        //echo "Bienvenido: " . $_GET['usuario'];exit;
        //echo "Hola migues estas en la pagina de index";exit();
        //echo $this->view->baseUrl;exit();
        $this->_helper->layout->disableLayout();
    	
        $userid = $_GET['usuario'];
        //echo $userid;exit;
        
        
        $Work = new Catalogos_Model_Workflow();
    	$usuario = $Work->getUsuario($userid);
    	//var_dump($usuario);exit;
    	$mail = $usuario[0]['USR_EMAIL'];
    	$numUsuario = $Work->getUsuarioDetalle($mail);
    	
    	if($numUsuario == "-1"){
    		$this->_redirect('default/index/noautorizado');
    	}
    	
    	$this->view->numUsuario = $numUsuario;
        $this->view->mail = $mail;
        $this->view->userid = $userid;
        
        //$this->_redirect('catalogos/index');
    }
	
	public function noautorizadoAction()
	{
		$this->_helper->layout->disableLayout();
		//echo "Este usuario no esta autorizado para usar la aplicacion";exit;
	}


}

