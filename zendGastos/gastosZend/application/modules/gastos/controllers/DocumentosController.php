<?php

class Gastos_DocumentosController extends Zend_Controller_Action
{

    public function init()
    {
        $this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
    	
    }
	
	public function generaZipRemesaAction()
	{
		$params = $this->getRequest()->getParams();
		$idcaso     = isset($params['idcaso'])    ? $params['idcaso']     : '0';
        $idconcepto = isset($params['idconcepto'])? $params['idconcepto'] : '0';
        $cuenta     = isset($params['cuenta'])    ? $params['cuenta']     : '0';
        $consec     = isset($params['consec'])    ? $params['consec']     : '0';
		$anticipo   = isset($params['anticipo'])  ? $params['anticipo']   : '0';
        if ( $idcaso == '0' || $idconcepto == '0' || $cuenta == '0' || $consec == '0' ) {
        	$response = array(
        		'success' => false,
        		'msg' => 'No se envio la informacion necesaria'
        	);
        	echo json_encode( $response );exit;
        }
        $Documentos = new Gastos_Model_Documentos();
        $documentos = $Documentos->getDocumentos($idcaso, $idconcepto, $cuenta);
        $ruta = 'zips/';
		$ID = 'Comprobantes_'.$idcaso.'_'.$cuenta;
		$zip = new ZipArchive();
		$zip->open($ruta.$ID.".zip",ZipArchive::CREATE);// A�adimos un directorio
		foreach ($documentos as $i => $data) {
			if( $data['FCARCHIVOPDF'] !== NULL ) {
				$file = $data['FCARCHIVOPDF'];
				$path_info = pathinfo( $file );
				$nombre = '';
				if ( $data['UUID'] !== NULL) { 
					$nombre = $data['FCRFC'];
				} else {
					$nombre = $anticipo;
				}
				$name = $consec.'_'.$nombre.'_'.$data['FCNOFACTURA'].'.'.$path_info['extension'];
				$download_file = file_get_contents($file);
				$zip->addFromString(basename($file), $download_file);
				$zip->renameName(basename($file), $name);
			}
			if( $data['FCARCHIVOPDFC'] !== NULL ) {
				$file = $data['FCARCHIVOPDFC'];
				$path_info = pathinfo( $file );
				$nombre = '';
				if ( $data['UUID'] !== NULL) {
					$nombre = $data['FCRFC'];
				} else {
					$nombre = $anticipo;
				}
				$name = $consec.'_'.$nombre.'_'.$data['FCNOFACTURA'].'.'.$path_info['extension'];
				$download_file = file_get_contents($file);
				$zip->addFromString(basename($file), $download_file);
				$zip->renameName(basename($file), $name);
			}
			if( $data['FCARCHIVOXML'] !== NULL ) {
				$file = $data['FCARCHIVOXML'];
				$path_info = pathinfo( $file );
				$nombre = '';
				if ( $data['UUID'] !== NULL) {
					$nombre = $data['FCRFC'];
				} else {
					$nombre = $anticipo;
				}
				$name = $consec.'_'.$nombre.'_'.$data['FCNOFACTURA'].'.'.$path_info['extension'];
				$download_file = file_get_contents($file);
				$zip->addFromString(basename($file), $download_file);
				$zip->renameName(basename($file), $name);
			}
		}
		$zip->close();
		$file_path  = $ID.".zip";
		// existe el archivo?
        if (is_file($ruta.$file_path))
        {   
			ob_end_clean();
			header("Content-type: application/zip");
			header("Content-disposition: attachment; filename=$file_path");
			header("Pragma: no-cache"); 
			header("Expires: 0"); 
			readfile($ruta.$file_path);
			ob_clean();
			flush();		
 			readfile($ruta.$file_path);
 			//unlink($ruta.$file_path);
 			exit;
        }
        else
        {
        	$response = array(
        		'success' => false,
        		'msg' => 'Sin documentos - Revisar permisos.'
        	);
        	echo json_encode( $response );exit;
        }
        exit;
	}
	
	public function generaZipLoteAction()
	{
		$params = $this->getRequest()->getParams();
		$lote     = isset($params['lote'])    ? $params['lote']     : '0';

     	if ( $lote == '0' ) {
        	$response = array(
        		'success' => false,
        		'msg' => 'No se envio la informacion necesaria'
        	);
        	echo json_encode( $response );exit;
        }
        
        $Documentos = new Gastos_Model_Documentos();
        $documentos = $Documentos->getDocumentosByLote( $lote );
        
        
        $ruta = 'zips/';
		$ID = 'Comprobantes_'.$lote.'';
		$zip = new ZipArchive();
		$zip->open($ruta.$ID.'.zip',ZipArchive::CREATE);// A�adimos un directorio
		foreach ($documentos as $i => $data) {
			
				if ( $data['UUID'] !== NULL) { 
					$dir = 'Deducibles';
					$zip->addEmptyDir($dir);
					
					if( $data['FCARCHIVOXML'] !== NULL ) {
						$file = $data['FCARCHIVOXML'];
						$path_info = pathinfo( $file );
						
						$consec = str_pad($data['CONSECUTIVO'], 3, '0', STR_PAD_LEFT);
						$nombre = $data['FCRFC'];
						$factura = $data['FCNOFACTURA'];
						
						$name = $consec.'_'.$nombre.'_'.$data['FCNOFACTURA'].'.'.$path_info['extension'];
						$download_file = file_get_contents($file);
						
						$zip->addFromString($dir.'/'.basename($file), $download_file);
						$zip->renameName($dir.'/'.basename($file), $dir.'/'.$name);
					}
					
					if( $data['FCARCHIVOPDF'] !== NULL ) {
						$file = $data['FCARCHIVOPDF'];
						$path_info = pathinfo( $file );
						
						$consec = str_pad($data['CONSECUTIVO'], 3, '0', STR_PAD_LEFT);
						$nombre = $data['FCRFC'];
						$factura = $data['FCNOFACTURA'];
						
						$name = $consec.'_'.$nombre.'_'.$data['FCNOFACTURA'].'.'.$path_info['extension'];
						$download_file = file_get_contents($file);

						$zip->addFromString($dir.'/'.basename($file), $download_file);
						$zip->renameName($dir.'/'.basename($file), $dir.'/'.$name);
						
					}
					
					if( $data['FCARCHIVOPDFC'] !== NULL ) {
						$file = $data['FCARCHIVOPDFC'];
						$path_info = pathinfo( $file );
						
						$consec = str_pad($data['CONSECUTIVO'], 3, '0', STR_PAD_LEFT);
						$nombre = $data['FCRFC'];
						$factura = $data['FCNOFACTURA'];
						
						$name = $consec.'_'.$nombre.'_'.$data['FCNOFACTURA'].'_R.'.$path_info['extension'];
						$download_file = file_get_contents($file);
						
						$zip->addFromString($dir.'/'.basename($file), $download_file);
						$zip->renameName($dir.'/'.basename($file), $dir.'/'.$name);
					}
					
					
				} else {
					$dir = 'No deducibles';
					$zip->addEmptyDir($dir);
					
					if( $data['FCARCHIVOPDFC'] !== NULL ) {
						$file = $data['FCARCHIVOPDFC'];
						$path_info = pathinfo( $file );
						
						$consec = str_pad($data['CONSECUTIVO'], 3, '0', STR_PAD_LEFT);
						$nombre = $data['ID_ANTICIPO'];
						$factura = $data['FCNOFACTURA'];
						
						$name = $consec.'_'.$nombre.'_'.$factura.'.'.$path_info['extension'];
						$download_file = file_get_contents($file);
						
						$zip->addFromString($dir.'/'.basename($file), $download_file);
						$zip->renameName($dir.'/'.basename($file), $dir.'/'.$name);
					}
					
				}
			
		}
		$zip->close();
		$file_path  = $ID.".zip";
		// existe el archivo?
        if (is_file($ruta.$file_path))
        {   
			ob_end_clean();
			header("Content-type: application/zip");
			header("Content-disposition: attachment; filename=$file_path");
			header("Pragma: no-cache"); 
			header("Expires: 0"); 
			readfile($ruta.$file_path);
			ob_clean();
			flush();		
 			readfile($ruta.$file_path);
 			unlink($ruta.$file_path);
 			exit;
        }
        else
        {
        	$response = array(
        		'success' => false,
        		'msg' => 'Sin documentos - Revisar permisos.'
        	);
        	echo json_encode( $response );exit;
        }
        exit;
	}
	
	public function actualizaUuidAction()
    {
    	$Documentos = new Gastos_Model_Documentos();
    	$documentos = $Documentos->getXmlsuuid();
    	
    	foreach ($documentos as $row) {
    		$uuid = '';
    		$file = $row['DCXML'];
			$newfile = "/opt/processmaker/shared/sites/workflow/files/gastos/comprobacion/xml.xml";
    		
    		copy($file, $newfile);
    		
    		$str = file_get_contents( $newfile );
        	$pos_xml = strpos($str, '<?xml');
        	$pos_cfdi = strpos($str, '<cfdi:Comprobante');
        	
        	
        	
        	
        	
        	if ( //$pos_xml === FALSE || 
        	     $pos_cfdi === FALSE ) {
        		$uuid = 'NO VALIDO';
        	} else {
        		$xml = new SimpleXMLElement($str);
	    		$ns = $xml->getNamespaces(true);
	        	
	        	if( isset($ns['cfdi']) ) {
	        		$xml->registerXPathNamespace('c', $ns['cfdi']);
	        	} else {
	        		$uuid = 'NO VALIDO';
	        	}
	        	
	        	if( isset($ns['tfd']) ) {
	        		
		        	$xml->registerXPathNamespace('t', $ns['tfd']);
			    		
			    	// Identifico el UUID de la factura
					foreach ($xml->xpath('//t:TimbreFiscalDigital') as $tfd) 
					{
						$uuid = (isset($tfd['UUID']))?$tfd['UUID']:'UUID';  
					}
	        	} else {
	        		$uuid = 'SIN TIMBRE';
	        	}
        	}
			$respuesta = $Documentos->setuuid( $row['IDGASTOMAIN'], $row['IDCOMPROBACION'], $uuid );

			$response = array(
				'IDGASTO' => $row['IDGASTOMAIN'],
				'IDCOMPROBACION' => $row['IDCOMPROBACION'],
				'uuid' => $uuid,
				'response' => $respuesta
			);
			
			echo json_encode( $response );
			echo '<br><br>';

    	}

    	exit;
    }

    public function generaZipRevisionAction()
    {
        $params = $this->getRequest()->getParams();
        /*$lote     = isset($params['lote'])    ? $params['lote']     : '0';

        if ( $lote == '0' ) {
            $response = array(
                'success' => false,
                'msg' => 'No se envio la informacion necesaria'
            );
            echo json_encode( $response );exit;
        }*/

        $Documentos = new Gastos_Model_Documentos();
        $documentos = $Documentos->getDocumentosByRevision( $params );


        $ruta = 'zips/';
        $ID = 'Comprobantes_'.date("dmYHis").'';
        $zip = new ZipArchive();
        $zip->open($ruta.$ID.'.zip',ZipArchive::CREATE);// A�adimos un directorio
        foreach ($documentos as $i => $data) {

            if ( $data['UUID'] !== NULL) {
                $dir = 'Deducibles';
                $zip->addEmptyDir($dir);

                if( $data['FCARCHIVOXML'] !== NULL ) {
                    $file = $data['FCARCHIVOXML'];
                    $path_info = pathinfo( $file );

                    $consec = str_pad($data['CONSECUTIVO'], 3, '0', STR_PAD_LEFT);
                    $nombre = $data['FCRFC'];
                    $factura = $data['FCNOFACTURA'];

                    $name = $consec.'_'.$nombre.'_'.$data['FCNOFACTURA'].'.'.$path_info['extension'];
                    $download_file = file_get_contents($file);

                    $zip->addFromString($dir.'/'.basename($file), $download_file);
                    $zip->renameName($dir.'/'.basename($file), $dir.'/'.$name);
                }

                if( $data['FCARCHIVOPDF'] !== NULL ) {
                    $file = $data['FCARCHIVOPDF'];
                    $path_info = pathinfo( $file );

                    $consec = str_pad($data['CONSECUTIVO'], 3, '0', STR_PAD_LEFT);
                    $nombre = $data['FCRFC'];
                    $factura = $data['FCNOFACTURA'];

                    $name = $consec.'_'.$nombre.'_'.$data['FCNOFACTURA'].'.'.$path_info['extension'];
                    $download_file = file_get_contents($file);

                    $zip->addFromString($dir.'/'.basename($file), $download_file);
                    $zip->renameName($dir.'/'.basename($file), $dir.'/'.$name);

                }

                if( $data['FCARCHIVOPDFC'] !== NULL ) {
                    $file = $data['FCARCHIVOPDFC'];
                    $path_info = pathinfo( $file );

                    $consec = str_pad($data['CONSECUTIVO'], 3, '0', STR_PAD_LEFT);
                    $nombre = $data['FCRFC'];
                    $factura = $data['FCNOFACTURA'];

                    $name = $consec.'_'.$nombre.'_'.$data['FCNOFACTURA'].'_R.'.$path_info['extension'];
                    $download_file = file_get_contents($file);

                    $zip->addFromString($dir.'/'.basename($file), $download_file);
                    $zip->renameName($dir.'/'.basename($file), $dir.'/'.$name);
                }


            } else {
                $dir = 'No deducibles';
                $zip->addEmptyDir($dir);

                if( $data['FCARCHIVOPDFC'] !== NULL ) {
                    $file = $data['FCARCHIVOPDFC'];
                    $path_info = pathinfo( $file );

                    $consec = str_pad($data['CONSECUTIVO'], 3, '0', STR_PAD_LEFT);
                    $nombre = $data['ID_ANTICIPO'];
                    $factura = $data['FCNOFACTURA'];

                    $name = $consec.'_'.$nombre.'_'.$factura.'.'.$path_info['extension'];
                    $download_file = file_get_contents($file);

                    $zip->addFromString($dir.'/'.basename($file), $download_file);
                    $zip->renameName($dir.'/'.basename($file), $dir.'/'.$name);
                }

            }

        }
        $zip->close();
        $file_path  = $ID.".zip";
        // existe el archivo?
        if (is_file($ruta.$file_path))
        {
            ob_end_clean();
            header("Content-type: application/zip");
            header("Content-disposition: attachment; filename=$file_path");
            header("Pragma: no-cache");
            header("Expires: 0");
            readfile($ruta.$file_path);
            ob_clean();
            flush();
            readfile($ruta.$file_path);
            unlink($ruta.$file_path);
            exit;
        }
        else
        {
            $response = array(
                'success' => false,
                'msg' => 'Sin documentos - Revisar permisos.'
            );
            echo json_encode( $response );exit;
        }
        exit;
    }
    
}

