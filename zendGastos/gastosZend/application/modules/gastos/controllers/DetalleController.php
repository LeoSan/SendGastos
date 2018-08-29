<?php

class Gastos_DetalleController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    	$this->_helper->layout()->disableLayout();
    }

    public function getComentarioAction(){
    	$this->_helper->layout->disableLayout();
    	$params = $this->getRequest()->getParams();

    	$gastoid = $params['gastoid'];
        $tipo = (isset($params['tipo']) ) ? $params['tipo'] : '0' ;
        $auto = (isset($params['auto']) ) ? $params['auto'] : '0' ;
        $cc = (isset($params['cc']) ) ? $params['cc'] : '' ;
        $nmcc = (isset($params['nmcc']) ) ? $params['nmcc'] : '' ;
        $idconcepto = (isset($params['idcon']) ) ? $params['idcon'] : '' ;
		$urlPD = ''; $leyenda = '';
    	$detalle = new Gastos_Model_Detalle();
		if( $tipo == 8 ) {
        	$urlPD = 'http://quantum1.pendulum.com.mx/pendulum/procesoGastos/muestra_pagosdobles.php?dmacct='.$cc.'&concepto='.$idconcepto.'&casoid='.$gastoid;
        }
        $nmAutorizacion = $detalle->getNameAutorizacion($tipo);
        $comentarios = $detalle->getComentariosAut($gastoid,$tipo,$auto,$nmcc);
        $title = "Detalle de autorizaciones : ".$nmcc.' '.$nmAutorizacion[0]['NOMBRE'];
    	if( $tipo == 7 ) {
    		$etapas = $detalle->getEtapasbyVerif($gastoid,$cc,$idconcepto);
        	$title .= ' : Etapa Abierta: '.$etapas[0]['ETAPA_ABIERTA'].' - Etapa cerrada: '.$etapas[0]['ETAPA_CERRADA'].'';
        }
        $resultH = '<table class="table table-striped table-bordered table-hover"><thead><tr><th>Justificaci&oacute;n</th>
        	           <th>Autorizador</th><th>Resultado</th>
        	           <th>Fecha autorizada</th><th>Comentarios</th></tr></thead>';
        
        if( count($comentarios) > 0 ) {
        	$resultB = '<tbody>';
    		foreach($comentarios as $item){ 
    			$resultB .= '<tr>
				      		<td>'.($item['JUSTIFICACION']).'</td>
				      		<td>'.$item['NOMBREAUTORIZA'].'</td>
				      		<td>'.$item['RESULTADO'].'</td>
				      		<td>'.$item['FECAUTORIZA'].'</td>
				      		<td>'.utf8_decode($item['COMEAUTORIZA']).'</td>
				    	</tr>';
			}
			$resultB .= '</tbody></table>';
        } else {
        	$resultB = '<tbody><tr><td class="center" colspan="6">Sin informaci&oacute;n</td></tr></tbody></table>';
        }
        $resultB = utf8_decode($resultB);
        echo json_encode(array('title' => $title,
                               'body'  => utf8_encode($resultH.$resultB),
        					   'url'   => $urlPD,
        					   'leyend'=> $leyenda ) );
        exit;
    }
    
	public function getPagoServicioAction(){
    	$this->_helper->layout->disableLayout();
    	$params = $this->getRequest()->getParams();

    	$gastoid = $params['gastoid'];
        $idconcepto = (isset($params['concepto']) ) ? $params['concepto'] : '0' ;;
        $credito = (isset($params['credito']) ) ? $params['credito'] : '0' ;;

        $detalle = new Gastos_Model_Detalle();
        $comentarios = $detalle->getPagoServicios($gastoid,$idconcepto,$credito);
		$title = "Información de pago de servicios: ".$credito;
        $resultH = '<table class="table table-striped table-bordered table-hover"><thead><tr><th>Factura</th><th>Fecha real de pago</th>
        	           <th>Remesa</th><th>Servicio pagado del</th>
        	           <th>Servicio pagado al</th><th>Pagado previamente</th>
        	           <th>Fecha pr&oacute;ximo pago</th><th>Comentarios</th>
        	           </tr></thead>';
        
        if( count($comentarios) > 0 ) {
        	$resultB = '<tbody>';
        	foreach($comentarios as $item){ 
    			$resultB = '<tr>
				      		<td>'.$item['FCNOFACTURA'].'</td>
				      		<td>'.$item['FECREALPAGO'].'</td>
				      		<td>'.$item['FCREMESA'].'</td>
				      		<td>'.$item['FECSERVPAGADODEL'].'</td>
				      		<td>'.$item['FECSERVPAGADOAL'].'</td>
				      		<td>'.$item['FCPAGADOPREVIAMENTE'].'</td>
				      		<td>'.$item['FECCUMBREPAGO'].'</td>
				      		<td>'.($item['FCCOMENTARIOPAGOSERV']).'</td>
				    	</tr>';
        	}
        	$resultB .= '</tbody></table>';
        } else {
        	$resultB = '<tbody><tr><td class="center" colspan="6">Sin informaci&oacute;n</td></tr></tbody></table>';
        }
        
        echo json_encode(array(  'title'=> ($title),
                                 'body' => utf8_encode($resultH.$resultB) ) );
        exit;
    }
    
	public function getComprobacionesAction(){
    	$this->_helper->layout->disableLayout();
    	$params = $this->getRequest()->getParams();

    	$gastoid = $params['gastoid'];
        $concepto = (isset($params['concepto']) ) ? $params['concepto'] : '0' ;
        $comprob = (isset($params['comprob']) ) ? $params['comprob'] : '0' ;
        $nmconcepto = (isset($params['nmc']) ) ? $params['nmc'] : '0' ;
		$nmcuenta = (isset($params['nmcc']) ) ? $params['nmcc'] : '0' ;
		
        $detalle = new Gastos_Model_Detalle();
        $comprobaciones = $detalle->getComprobaciones($gastoid,$concepto,$comprob);
		$title = "Información de documentos de comprobación: ".$nmcuenta;

        $resultH = '<table class="table table-striped table-bordered table-hover"><thead><tr><th>Comprobantes</th>
    		 		   <th>Factura</th>
    		 		   <th>Concepto</th>
    		 		   <th>Fecha comprobaci&oacute;n</th>
    		 		   <th>Proveedor</th>
    		 		   <th>Importe</th>
    		 		   <th>IVA</th>
    		 		   <th>Otros imp</th>
    		 		   <th>IVA ret</th>
    		 		   <th>ISR</th>
    		 		   <th>Total</th></tr></thead>';
        
        $total1 = 0;$total2 = 0;$total3 = 0;
    	$total4 = 0;$total5 = 0;$total6 = 0;
    	$pdf = ''; $xml = ''; $pdf2 = ''; $x1 = ''; $x5 = '';
    	
		if( count($comprobaciones) > 0 ) {
        	$resultB = '<tbody>';
    		foreach ($comprobaciones as $value) {
    			if( $value['FCARCHIVOPDF'] != NULL ) {
    				$pdf = '<a href="'.$value['FCARCHIVOPDF'].'" target="_blank">PDF</a>';
    			}
    			if( $value['FCARCHIVOXML'] != NULL ) {
    				$xml = '<a href="'.$value['FCARCHIVOXML'].'" target="_blank">XML</a>';
    			}
    			if( $value['FCARCHIVOPDFC'] != NULL ) {
    				$pdf2= '<a href="'.$value['FCARCHIVOPDF'].'" target="_blank">PDF2</a>';
    			}

    			$resultB .= "<tr><td>$pdf $xml $pdf2 $x1 $x5</td>
    		        <td>".$value['FCNOFACTURA']."</td>
    		        <td>".$value['FCCONCEPTO']."</td>
    		        <td>".$value['FDCOMPROBACION']."</td>
    		        <td>".$value['NMRFC']."</td>
    		        <td class='right'>$".number_format($value['FNIMPORTE'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNIVA'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNOTROSIMPUEST'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNIVARET'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNISR'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNTOTAL'],2,'.',',')."</td>
    			</tr>";
    	 	
    	 		$total1 += $value['FNIMPORTE'];
    			$total2 += $value['FNIVA'];
    			$total3 += $value['FNOTROSIMPUEST'];
    			$total4 += $value['FNIVARET'];
    			$total5 += $value['FNISR'];
    			$total6 += $value['FNTOTAL'];
    		}
    		 
    		$resultB .= "<tr><td class='right' colspan='5'>Totales</td>
    				<td class='right'>$".number_format($total1,2,'.',',')."</td>
    				<td class='right'>$".number_format($total2,2,'.',',')."</td>
    				<td class='right'>$".number_format($total3,2,'.',',')."</td>
    				<td class='right'>$".number_format($total4,2,'.',',')."</td>
    				<td class='right'>$".number_format($total5,2,'.',',')."</td>
    				<td class='right'>$".number_format($total6,2,'.',',')."</td></tr></tbody></table>";
		} else {
        	$resultB = '<tbody><tr><td class="center" colspan="11">Sin informaci&oacute;n</td></tr></tbody></table>';
        }
        
        echo json_encode(array(  'title'=> ($title),
                     'body' => utf8_encode($resultH.$resultB) ) );
        exit;
    }
    
	public function getDocumentosAction(){
    	$this->_helper->layout->disableLayout();
    	$params = $this->getRequest()->getParams();

        $total1 = 0;
        $total2 = 0;
        $total3 = 0;
        $total4 = 0;
        $total5 = 0;
        $total6 = 0;

    	$gastoid = $params['gastoid'];
        $concepto = (isset($params['concepto']) ) ? $params['concepto'] : '0' ;
        $comprob = (isset($params['comprob']) ) ? $params['comprob'] : '0' ;
        $nmconcepto = (isset($params['nmc']) ) ? $params['nmc'] : '0' ;
		$nmcuenta = (isset($params['nmcc']) ) ? $params['nmcc'] : '0' ;
		
        $detalle = new Gastos_Model_Detalle();
        $comprobaciones = $detalle->getComprobaciones($gastoid,$concepto,$nmcuenta);
        $docsCotizacion = $detalle->getDocumentosCotizacion($gastoid,$concepto,$nmcuenta);
        $docsInicio = $detalle->getDocumentosInicio($gastoid,$concepto,$nmcuenta);
        
		$title = "Información de documentos: ".$nmcuenta;
		$pdf= '';$resultH = ''; $resultB = ''; $tabla = '';
		
		if( count($docsInicio) > 0 ) {
    		$resultH = '<table class="table table-striped table-bordered table-hover"><thead>
    		           <tr><th colspan="2">Documento inicio</th>
    		 		   <th>Crédito</th><th colspan="2">Concepto</th>
    		 		   <th colspan="6">Fecha de registro</th>
    		 		   </tr></thead>';
    		
    		$resultB = '<tbody>';
    		foreach ($docsInicio as $value) {
    			if( $value['FCRUTAFILE'] != NULL ) {
    				$pdf = '<a href="'.$value['FCRUTAFILE'].'" target="_blank">'.utf8_decode($value['FCNOMBRE']).'</a>';
    			}
    			$resultB .= "<tr><td colspan='2'>$pdf</td>
    		        <td>".$value['FCCREDITO']."</td>
    		        <td colspan='2'>".$value['NMCONCEPTO']."</td>
    		        <td colspan='8'>".$value['FDFECREGISTRO']."</td>
    			</tr>";
    		}
    		$resultB .= "</tbody></table>";
    	}
		$tabla .= $resultH.$resultB;
        $pdf= '';$resultH = ''; $resultB = '';
    	
    	if( count($docsCotizacion) > 0 ) {
    		$resultH = '<table class="table table-striped table-bordered table-hover"><thead><tr><th>Documento</th>
    		 		   <th>Concepto</th><th>RFC</th>
    		 		   <th>Razon social</th>
    		 		   <th>Fecha cotizaci&oacute;n</th><th>Importe</th>
    		 		   <th>IVA</th><th>Otros imp</th>
    		 		   <th>IVA ret</th><th>ISR</th>
    		 		   <th>Total</th></tr></thead>';
    		
    		$resultB = '<tbody>';
    		foreach ($docsCotizacion as $value) {
    			if( $value['RUTACOTIZA'] != NULL ) {
    				$pdf = '<a href="'.$value['RUTACOTIZA'].'" target="_blank">Cotizacion</a>';
    			}
    			$resultB .= "<tbody><tr><td>$pdf</td>
    				<td>".$value['CONCEPTO']."</td>
    		        <td>".$value['FCRFC']."</td>
    		        <td>".$value['FCRAZONSOCIAL']."</td>
    		        <td>".$value['FDFECREGISTRO']."</td>
    		        <td class='right'>$".number_format($value['FNIMPORTE'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNIVA'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNOTROSIMPUEST'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNIVARET'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNISR'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNTOTAL'],2,'.',',')."</td></tr></tbody>";
    		}    		
    		$resultB .= "</tbody></table>";

    	}
        $tabla .= $resultH.$resultB;
    	$pdf = ''; $xml = ''; $pdf2 = ''; $x1 = ''; $x5 = '';$resultH = ''; $resultB = '';
    	
		if( count($comprobaciones) > 0 ) {
        	
			$resultH .= '<table class="table table-striped table-bordered table-hover"><thead><tr><th>Comprobantes</th>
    		 		   <th>Factura</th><th>Concepto</th>
    		 		   <th>Fecha comprobaci&oacute;n</th>
    		 		   <th>Proveedor</th><th>Importe</th>
    		 		   <th>IVA</th><th>Otros imp</th>
    		 		   <th>IVA ret</th><th>ISR</th>
    		 		   <th>Total</th></tr></thead>';
			
			$resultB = '<tbody>';
    		foreach ($comprobaciones as $value) {
    			if( $value['FCARCHIVOPDF'] != NULL ) {
    				$pdf = '<a href="'.$value['FCARCHIVOPDF'].'" target="_blank">PDF</a>';
    			}
    			if( $value['FCARCHIVOXML'] != NULL ) {
    				$xml = '<a href="'.$value['FCARCHIVOPDF'].'" target="_blank">XML</a>';
    			}
    			if( $value['FCARCHIVOPDFC'] != NULL ) {
    				$pdf2= '<a href="'.$value['FCARCHIVOPDF'].'" target="_blank">PDF2</a>';
    			}

    			$resultB .= "<tr><td>$pdf $xml $pdf2 $x1 $x5</td>
    		        <td>".$value['FCNOFACTURA']."</td>
    		        <td>".$value['FCCONCEPTO']."</td>
    		        <td>".$value['FDCOMPROBACION']."</td>
    		        <td>".$value['NMRFC']."</td>
    		        <td class='right'>$".number_format($value['FNIMPORTE'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNIVA'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNOTROSIMPUEST'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNIVARET'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNISR'],2,'.',',')."</td>
    		        <td class='right'>$".number_format($value['FNTOTAL'],2,'.',',')."</td>
    			</tr>";
    	 	
    	 		$total1 += $value['FNIMPORTE'];
    			$total2 += $value['FNIVA'];
    			$total3 += $value['FNOTROSIMPUEST'];
    			$total4 += $value['FNIVARET'];
    			$total5 += $value['FNISR'];
    			$total6 += $value['FNTOTAL'];
    		}
    		 
    		$resultB .= "<tr><td class='right' colspan='5'>Totales</td>
    				<td class='right'>$".number_format($total1,2,'.',',')."</td>
    				<td class='right'>$".number_format($total2,2,'.',',')."</td>
    				<td class='right'>$".number_format($total3,2,'.',',')."</td>
    				<td class='right'>$".number_format($total4,2,'.',',')."</td>
    				<td class='right'>$".number_format($total5,2,'.',',')."</td>
    				<td class='right'>$".number_format($total6,2,'.',',')."</td></tr>";
    		$resultB = '</tbody></table>';
		}
		$tabla .= $resultH.$resultB;
    	
		echo json_encode(array(  'title'=> ($title),
                     'body' => utf8_encode($tabla) ) );
        exit;
    }
    
    public function indexAction()
    {
    	$this->_helper->layout->disableLayout();
        $params = $this->getRequest()->getParams();
		$gastoid = $params['gastoid'];
        $iduser = (isset($params['iduser']) ) ? $params['iduser'] : '1' ;;

		$detalle = new Gastos_Model_Detalle();
		$dataGeneral = $detalle->getInfoGeneral($gastoid);
                $etapaxetapa    = $detalle->getSeguimientoEtapa( $gastoid );
		$user = $detalle->getUser($iduser);

    	$this->view->existe = 0;
    	$this->view->idgasto = $params['gastoid'];
		if( isset($dataGeneral[0]) ){
			$this->view->existe = 1;
			
			$termometro     = $detalle->getBitacoraTermometro( $gastoid );
			$dataUsuario    = $detalle->getInfoUsuarioCompleta( $dataGeneral[0]["IDSOLICITANTE"] );
			$dataBitacora   = $detalle->getInfoLastBitacora( $gastoid );
			$dataBitacoraQM = $detalle->getInfoLastBitacoraQM( $gastoid ); 
			$comprobaciones = $detalle->getComprobaciones( $gastoid ); 
			
			$pagoservicio   = $detalle->getPagoServicios( $gastoid );
			$tesoreria      = $detalle->getSegTesoreria( $gastoid );
			$documentosIni  = $detalle->getDocumentosInicio( $gastoid );
			$documentosSop  = $detalle->getDocumentosSoporte( $gastoid );
			$documentosAnx  = $detalle->getDocumentosAnexo( $gastoid );
			$documentosCoti = $detalle->getDocumentosCotizacion( $gastoid );
			$asignafactura  = $detalle->getAsignaFacturacion( $gastoid );

			$autPrecomproba = $detalle->getAutorizadorGeneral( $gastoid, 'before');
			
			$autAftcomproba = $detalle->getAutorizadorGeneral( $gastoid, 'after');
			$autorizadores  = $detalle->getAutorizadores( $gastoid );
			$creditosAut    = $detalle->getAutorizadorByResumen( $gastoid );
			$pagosdobles    = $detalle->getCreditPagoDoble( $gastoid );
			$documentoTotal = $detalle->getDocumentTotal( $gastoid );

			$userLog = $detalle->getInfoUserPM('',$user[0]['CLMAIL']);
			$isAdmin = 0;
			if ( isset($userLog[0]) ) 
				$isAdmin = $detalle->getAdminPermiso( $userLog[0]['USR_UID'] );
			$paso = 0;

			if ( $dataGeneral[0]["STATUS"] == "F" ) {
				foreach ( $termometro as $index => $item ) {
					$termometro[$index]['SUCCESS'] = 1;
				}
			} else if ( count($dataBitacora) == 0 ) {
				foreach ( $termometro as $index => $item ) {
					$termometro[$index]['SUCCESS'] = 0;
				}
				$termometro[0]['SUCCESS'] = 1;
			} else {
				
				
				foreach ( $termometro as $index => $item ) {
					$idtipoaut = 0; 
					if( isset($dataBitacora[0]) && $dataBitacora[0]["TAS_UID"] == $item['UIDTASK'] && $paso == 0 ) {
						
						if( $dataBitacora[0]["TAS_UID"] == '8961359245370cf9de08e25000253648' ) {

							$idtipoaut = $detalle->getAutorizadorTermometro($gastoid,$dataBitacora[0]["FCUSUARIO"]);
							
							if( isset($idtipoaut[0]) && $idtipoaut[0]["IDTIPOAUTORIZA"] == $item["TPOAUT"] ) {
								$termometro[$index]['SUCCESS'] = 2;
								$paso = 1;
							} else {
								$termometro[$index]['SUCCESS'] = 1;
							}
						} else {
							$termometro[$index]['SUCCESS'] = 2;
							$paso = 1;
						}
						
						
						
					} else if ( $paso == 0 ) {
						$termometro[$index]['SUCCESS'] = 1;
					} else {
				    	$termometro[$index]['SUCCESS'] = 0;
					}
				}
				
				
			}
		
			$creditosAuto = array();
			foreach ($creditosAut as $value) {
				$index  = $value['IDTIPOAUTORIZA'];
				$index2 = $value['CREDITO'];
				if ( $index2 == NULL ) {
					$index2 = $index;
				}
				if ( $index == 41 ) {
					$index2 = $index;
				}
				
				if ( $index == 8 ) {
					foreach ($pagosdobles as $data) {
						$index2 = $data['FCCREDITOCARTERA'];
						
						$creditosAuto[ $index ][$index2]['RAUT'] = $value['FCRESULTADO'];
						$creditosAuto[ $index ][$index2]['RBIT'] = $value['RESULTBITACORA'];
						$creditosAuto[ $index ][$index2]['UIDT'] = $value['ACTUAL'];
					}
				} else {
					$creditosAuto[ $index ][$index2]['RAUT'] = $value['FCRESULTADO'];
					$creditosAuto[ $index ][$index2]['RBIT'] = $value['RESULTBITACORA'];
					$creditosAuto[ $index ][$index2]['UIDT'] = $value['ACTUAL'];
				}
			}
			foreach ($asignafactura as $index => $value) {
				$asignafactura[$index]['tdocument'] = 0;
				foreach ($documentoTotal as $docum) {
					if ($value['CREDITO'] == $docum['FCCREDITO'] ) {
						$asignafactura[$index]['tdocument'] = $docum['TOTAL'];
					}
				}
			}
			
			$this->view->isAdmin        = $isAdmin[0]['ADMIN'];
			$this->view->user           = $user;
			$this->view->comprobaciones = $comprobaciones;
			$this->view->termometro     = $termometro;
			$this->view->dataGeneral    = $dataGeneral;
			$this->view->dataUsuario    = $dataUsuario;
			$this->view->dataBitacora   = $dataBitacoraQM;
			
			$this->view->pagoservicio   = $pagoservicio;
			$this->view->tesoreria      = $tesoreria;
			$this->view->documentosIni  = $documentosIni;
			$this->view->documentosSop  = $documentosSop;
			$this->view->documentosAnx  = $documentosAnx;
			$this->view->documentosCotiza = $documentosCoti;
			$this->view->asignafactura  = $asignafactura;
			$this->view->autorizadores  = $autorizadores;
			$this->view->autPrecomproba = $autPrecomproba;
			$this->view->autAftcomproba = $autAftcomproba;
			$this->view->validaAuto     = $creditosAuto;
			$this->view->pagosdobles    = $pagosdobles;
		}
$this->view->etapaxetapa    = $etapaxetapa;
		
    }
	
    public function fechaServicioAction(){
    	$this->_helper->layout->disableLayout();
        $params = $this->getRequest()->getParams();
		$gastoid = $params['gastoid'];
		
		$detalle = new Gastos_Model_Detalle();
		$pagoservicio   = $detalle->getPagoServicios($gastoid);
		$this->view->pagoservicio   = $pagoservicio;
    }

    public function searchAction() {
    	$this->_helper->layout->disableLayout();
        $params = $this->getRequest()->getParams();
		$usr_uid = $params['userid'];
		
		$detalle = new Gastos_Model_Detalle();
		$infoUser  = $detalle->getInfoUserPM($usr_uid);
		
		$infoUserLog = $detalle->getInfoUserAll($infoUser[0]['USR_EMAIL']);
		
		$userPM = $infoUser[0]['USR_USERNAME'];
		$userQS = '';
		if ( isset($infoUserLog[0]) ) {
			$userQS = $infoUserLog[0]['CLCOLLID'];
		}
		
		$casos = $detalle->getMisCasos($userQS,$userPM);
		
		$this->view->usr     = $usr_uid;
		$this->view->infoUser   = $infoUserLog;
        foreach ($casos as $ind => $c){
            $casos[$ind]['CONCEPTO']=str_replace('"','\"',$c['CONCEPTO']);
        }
		$this->view->casos = json_encode($casos);
    }
    
	public function getSearchAction() {
        $params = $this->getRequest()->getParams();
		$usr_uid = $params['usrid'];
		
		$detalle = new Gastos_Model_Detalle();
		$isAdmin   = $detalle->getAdminPermiso($usr_uid);
		$infoUser  = $detalle->getInfoUserPM($usr_uid);
		
		$infoUserLog = $detalle->getInfoUserAll($infoUser[0]['USR_EMAIL']);
		
		$userPM = $infoUser[0]['USR_USERNAME'];
		$userQS = $infoUserLog[0]['CLCOLLID'];
		
		$casos = $detalle->getMisCasos($userQS,$userPM);

		echo json_encode($casos);
		exit;

    }

	public function searchAdvanceAction() {
        $params = $this->getRequest()->getParams();

        $caso    = $params['numGasto'];
        $email   = $params['mailsearch'];
        $credito = $params['numCredit'];
        $provee = $params['nmproveedorid'];
        $user    = $params['nmuser'];
        $aut    = $params['mailsearchaut'];
		$arrCasoPV = array();
		$casoPV = $caso;
		
		if ($params['nmproveedor']=='') { $provee=''; }
		if ($params['autorizador']=='') { $aut=''; }
        if ($user=='') { $email=''; }

        $result['autorizador'] = ( $aut == "" ) ? false : true;
        
		$detalle = new Gastos_Model_Detalle();

		if ( $result['autorizador'] === false ) {
			if ($credito != NULL) {
        		$arrCasoPV = $detalle->getCasosPVbyCredit($credito,$caso);
        		foreach ($arrCasoPV as $value) {
        			$casoPV .= $value['IDGASTO'].',';
        		}
        	}
			if ($caso!='') { $casoPV=$caso.','.$casoPV; }
			$casoPV = substr($casoPV,0,-1); 
		
			$result['data'] = $detalle->getMisCasosAdvance( $caso, $email, $credito, $provee, $casoPV );
		} else {
			if ($credito != NULL) {
        		$arrCasoPV = $detalle->getCasosPVbyCredit($credito,$caso);
        		foreach ($arrCasoPV as $value) {
        			$casoPV .= $value['IDGASTO'].',';
        		}
        	}
			if ($caso!='') { $casoPV=$caso.','.$casoPV; }
			$casoPV = substr($casoPV,0,-1);
			
			$result['data'] = $detalle->getMisCasosAdvanceAutorizadores( $caso, $email, $credito, $provee, $casoPV, $aut, 1, 999 );
			$result['total'] = $detalle->getMisCasosAdvanceAutorizadoresCount( $caso, $email, $credito, $provee, $casoPV, $aut,1, 999 );
		}
		
		echo json_encode($result);
		exit;
    }
    
    public function getScoreAction(){
    	$params = $this->getRequest()->getParams();
        $casoEmpNumero = $params['user'];
    	
        $detalle = new Gastos_Model_Detalle();
		$infoUser = $detalle->getInfoUsuarioCompleta($casoEmpNumero);
        
		$letraEmpleado = $infoUser[0]['CVECON'];
		
		$queLetraEs = '';
		if ( $letraEmpleado  == '03') { $queLetraEs = 'H'; }
		else { $queLetraEs = 'E'; }

		$tmp=str_pad($casoEmpNumero, 6, "0", STR_PAD_LEFT);
		$numero_empleado  = $queLetraEs.$tmp;

		$PlanViaje = new Planesdeviaje_Model_Consulta();
		$general = $PlanViaje->getInfoGeneralVencidos( $numero_empleado );
		
		$response['general'] = $general[0];
		$response['detalle'] = $PlanViaje->getInfoDetalleVencidos( $numero_empleado );

    	echo json_encode($response);
    	exit;
    }

    public function getallproveeAction() {
    	
    	$MiExpediente = new Gastos_Model_Detalle();
        $detalle = $MiExpediente->getListProveedores();
        echo json_encode($detalle);   
        exit(); 
    }
    
	public function equivalenciaAction() {
		$this->_helper->layout->disableLayout();
    	$params = $this->getRequest()->getParams();
        
    	$Detalle = new Gastos_Model_Detalle();
        $data = $Detalle->getListEquivalencias();
    	
    	$this->view->data = json_encode( $data );
    }
    
	public function equivalenciaReloadAction() {
		$this->_helper->layout->disableLayout();
    	$params = $this->getRequest()->getParams();
        
    	$Detalle = new Gastos_Model_Detalle();
        $data = $Detalle->getListEquivalencias();
    	
    	echo json_encode($data);
    	exit;
    }
    
	public function operEquivalenciaAction() {
        $params = $this->getRequest()->getParams();

        $Detalle = new Gastos_Model_Detalle();
        
        if( $params['oper'] == 'edit' ) {
        	$result = $Detalle->editEquivalencias( $params );
        	
        	if( $result ) {
        		$response['sucess'] = true;
        		$response['data'] = $params;
        	} else {
        		$response['sucess'] = false;
        		$response['data'] = array();
        	}
        	
        } else if ($params['oper'] == 'add') {
        	$result = $Detalle->addEquivalencias( $params );
        	$data = $Detalle->getListEquivalencias('MAX');
        	
        	if( $result ) {
        		$response['sucess'] = true;
        		$response['data'] = $data;
        	} else {
        		$response['sucess'] = false;
        		$response['data'] = array();
        	}
        	
        }

    	echo json_encode($response);
    	exit;
    }
    
    public function getConceptosEquivaleAction() {
    	$params = $this->getRequest()->getParams();
    	
    	$Detalle = new Gastos_Model_Detalle();
    	$data = $Detalle->getListConcepto();
    	
    	echo json_encode($data);
    	exit;
    }

	public function setConceptosEquivaleAction() {
    	$params = $this->getRequest()->getParams();
    	$params['cartera'] = substr($params['cartera'],0,-1);
    	$params['cadenaid'] = substr($params['cadenaid'],0,-1);
    	
    	$arrCartera = explode(",", $params['cartera']);
    	$arrIds = explode(",", $params['cadenaid']);

    	$Detalle = new Gastos_Model_Detalle();
    	foreach ($arrCartera as $i => $cartera) {
    		$result = $Detalle->dropListConcepto($arrIds[$i],$cartera,$params['idequivalencia']);
    		if( $params['idequivalencia'] != 0 )
    			$result = $Detalle->setListConcepto($arrIds[$i],$cartera,$params['idequivalencia']);
    	}
    	
    	$data = $Detalle->getListConcepto();
    	
    	echo json_encode( $data );
    	exit;
    }
    
    public function calculaAction() {
    	//phpinfo();
    	//exit;
    	
    	$params = $this->getRequest()->getParams();
        $maximo = $params['maximo'];
        $tope = $params['tope'];
    	
        $tiempo_inicial = microtime(true);
        
        // Obtiene el numero maximo divido
        /*
        for ($j = $maximo; $j <= $tope; $j=$j+$maximo) {
        	$bnd = true;
        	for ($i = 1; $i <= $maximo; $i++) {
				$result = $j/ $i;
				$define = is_int($result);
				if( !$define ) {
					$bnd = false;
					break;
				}
        	}
        	if( $bnd ) {
				echo $j;
				break;
			}
        }
        */
        // Calcula el primo numero 10001
        $x = 0;
        for ($i = 1; $x < $tope; $i++) {
        	if ( $this->isPrimo($i) ) {
        		$x++;
        		$primo = $i;
        	}
        }
        echo $primo;
        
        $tiempo_final = microtime(true);
		$tiempo_ejecucion = $tiempo_final - $tiempo_inicial;

		echo '<br>Tiempo: '.round($tiempo_ejecucion,4);
        
       // echo $maximo;
    	exit();
    }
    
	function isPrimo($num) {
    	if($num == 1) return false;
    	if($num == 2) return true;
    	if($num % 2 == 0) {return false;}

    	$ceil = ceil(sqrt($num));
    	for($i = 3; $i <= $ceil; $i = $i + 2) {
        	if($num % $i == 0)
            	return false;
    	}
    	return true;
	}

}