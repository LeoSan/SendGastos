<?php

class Gastos_AutorizacionesController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
        // action body
        $Auto = new Gastos_Model_Autorizacion();
        $idGasto = $this->getRequest()->getParam('id_gasto', 0);
        $idUsuario = $this->getRequest()->getParam('id_usuario', 0);

        $alarmas = $Auto->getAlarmaGasto($idGasto, $idUsuario);

        $claveCyber = $Auto->getClaveCyber($idUsuario);
        $comentariosAnteriores = $Auto->getComentariosAut($idGasto, $idUsuario);
        if( count($alarmas) <= 0){
        	echo "<p>No hay alarmas del gasto.</p>";exit;
        }
        $this->view->alarmas = $alarmas;
        $this->view->comentarios = $comentariosAnteriores;

        $html = "";
        $html .= '<input type="hidden" id="usuariopm" name="usuariopm" value="' . $claveCyber . '" />';
        foreach($alarmas as $alarma):
	        if($alarma['TIPODETALLE'] == "CREDITO"){
	        	$arrayCveUsu = explode("|", $alarma['CVEUSUARIOS']);
	        	$html .= '<table class="table table-bordered CREDITO">
				<thead style="font-size: 10px;" >
					<tr style="background-color:#343467;color:#fff;" >
						<th colspan="9" style="text-align:left;"><b>:::' . $alarma['NMALERTA'] . ':::</b></th>
					</tr>
			    	<tr style="background-color:#999;color: #fff;">
			      		<th style="text-align:center;">Categoría/Subcategoría/Concepto</th>
			      		<th style="text-align:center;">Cuenta/Cartera</th>
			      		<th style="text-align:center;">Ligas</th>
			      		<th>Detalle de alerta</th>
			      		<th>Justificación</th>';
			      		$i = 0; foreach($arrayCveUsu as $cve => $valor):
			      			if($valor != ""){
			      				$html .= '<th style="width: 160px;"><i class="icon-user"></i>' . $Auto->getQueUsuarioEs($valor) . '</th>';
			      			} else {
			      				$html .= '<th style="width: 160px;"></th>';
			      			}
			      		$i++;
			      		endforeach;
			      		if($i<3){
			      			$html .= '<th style="width: 160px;"></th>';
			      		}
			    	$html .= '</tr>
			  	</thead> 
			  	<tbody style="font-size: 8px;">';
			    	$tipoAlerta = $alarma['IDALERTA'];
			    	$alarmaDetalle = $Auto->getAlarmaDetalle($idGasto, $tipoAlerta, $idUsuario);
			    	//Zend_Debug::dump($alarmaDetalle);
			    	foreach ($alarmaDetalle as $detalle):
			    	//Zend_Debug::dump($detalle);
			    	$resultadoDetalle = explode("|", $detalle['RESULTADOS']);
			    	$comentariosDetalle = explode("|", $detalle['COMENTARIOS']);
			    	$creditoDetalle = explode("|", $detalle['FCDETALLECREDITO']);
			    	$usuariosDetalle = explode("|", $detalle['USUARIOS']);
			    	
	        		$isPD = $Auto->getPagoDobleDetalle( $idGasto, $detalle['FCCREDITOCARTERA'], $detalle['IDCONCEPTO']  );
			    	
			    	$html .= '<tr>
			      		<td>' . $detalle['CATEGSUBCAT'] . '</br> -->' . $detalle['CONCEPTO'] . '</td>
			      		<td>' . $detalle['FCCREDITOCARTERA'] . '<br>' . (isset($creditoDetalle[0])?$creditoDetalle[0]:'') . '<br>' . (isset($creditoDetalle[1])?$creditoDetalle[1]:'') . '</td>
			      		<td><a href="#" class="linkX1" rel="' . $detalle['FCCREDITOCARTERA'] . '" >X1</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="linkX5" rel="' . $detalle['FCCREDITOCARTERA'] . '">X5</a>';
			      		
			      	if( $isPD[0]["ISPAGO"] == 'S' ){
			      		$html .= " <a target='_blank' href='http://quantum1.pendulum.com.mx/pendulum/procesoGastos/muestra_pagosdobles.php?dmacct=".$detalle['FCCREDITOCARTERA']."&concepto=".$detalle['IDCONCEPTO']."&casoid=".$idGasto."' >PD</a> ";
			      	}
			      		
			      	$html .= '</td>
			      		<td>' . $detalle['ALERTA'] . '</td>
			      		<td>' . $detalle['JUSTIFICACION'] . '</td>';
			    		$j = 0;
			      		foreach($usuariosDetalle as $usuario):
			      			//var_dump($idUsuario);//exit;
			      			//var_dump($resultadoDetalle);
			      			if($usuario == $idUsuario){
				      			$selectedCor = ($resultadoDetalle[$j]=="Correcto")?'checked="checked"':'';
			    				$selectedInc = ($resultadoDetalle[$j]=="Incorrecto")?'checked="checked"':'';
			      				$html .= '<td><input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '_' . $detalle['FECHAREGISTRO'] .'" type="radio" value="Correcto" ' . $selectedCor . ' />Si&nbsp;&nbsp;<input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '_' . $detalle['FECHAREGISTRO'] .'" value="Incorrecto" type="radio" ' . $selectedInc . ' />No</br>
				      			<textarea name="comen_' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '_' . $detalle['FECHAREGISTRO'] .'" rows="" cols="" style="width: 100px;height: 27px;" maxlength="100">' . (isset($comentariosDetalle[$j])?$comentariosDetalle[$j]:'') . '</textarea>
				      			</td>';
			      			} else {
			      				if($resultadoDetalle[$j] == "Correcto"){
			      					$imagen = $this->view->baseUrl. '/images/correcto.png';
			      					$tdImagen = "<img title='$resultadoDetalle[$j]' src='$imagen' alt='$resultadoDetalle[$j]' style='width: 18px;height: 18px;'>";
			      				} else if($resultadoDetalle[$j] == "Incorrecto") {
			      					$imagen = $this->view->baseUrl. '/images/incorrecto.png';
			      					$tdImagen = "<img title='$resultadoDetalle[$j]' src='$imagen' alt='$resultadoDetalle[$j]' style='width: 18px;height: 18px;'>";
			      				} else {
			      					$tdImagen = '';
			      				}
			      				//$html .= "<td style='text-align:center;'><img title='$resultadoDetalle[$j]' src='$imagen' alt='$resultadoDetalle[$j]' style='width: 18px;height: 18px;'></td>'";
			      				$html .= "<td style='text-align:center;'>" . $tdImagen . "</td>'";
			      			}
			      			$j++;
			      		endforeach;
			      		if($j < 3){
			      			$html .= '<td></td>';
			      		}
			    	$html .= '</tr>';
			    	endforeach;
			  	$html .= '</tbody>
			</table>';
	        } else if($alarma['TIPODETALLE'] == "SINJUSTI"){
	        	$arrayCveUsu = explode("|", $alarma['CVEUSUARIOS']);
	        	$html .= '<table class="table table-bordered SINJUSTI">
				<thead>
					<tr style="background-color:#343467;color:#fff;">
						<th colspan="9" style="text-align:left;"><b>' . $alarma['NMALERTA'] . ' ::::</b></th>
					</tr>
			    	<tr style="background-color:#999;color: #fff;">
			      		<th style="width: 297px;" colspan="5" style="text-align:center;"></th>';
			      		$i = 0; foreach($arrayCveUsu as $cve => $valor):
			      			if($valor != ""){
			      				$html .= '<th colspan="3"><i class="icon-user"></i>' . $Auto->getQueUsuarioEs($valor) . '</th>';
			      			} else {
			      				$html .= '<th colspan="3"></th>';
			      			}
			      		$i++;
			      		endforeach;
			    	$html .= '
			    	</tr>
			  	</thead>
			  	<tbody style="font-size: 8px;">';
			    	$tipoAlerta = $alarma['IDALERTA'];
			    	$alarmaDetalle = $Auto->getAlarmaDetalle($idGasto, $tipoAlerta, $idUsuario);
			    	//Zend_Debug::dump($alarmaDetalle);exit;
			    	foreach ($alarmaDetalle as $detalle):
			    	//Zend_Debug::dump($detalle);
			    	$resultadoDetalle = explode("|", $detalle['RESULTADOS']);
			    	$comentariosDetalle = explode("|", $detalle['COMENTARIOS']);
			    	$creditoDetalle = explode("|", $detalle['FCDETALLECREDITO']);
			    	$usuariosDetalle = explode("|", $detalle['USUARIOS']);
			    	
			    	$html .= '<tr>';
			    	$html .= '<td colspan="5"></td>';
			    	/*$html .= '<td colspan="3"><input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '" type="radio" value="Correcto" />Si&nbsp;&nbsp;<input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '" value="Incorrecto" type="radio" />No</br>
				      			<textarea name="comen_' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '" rows="" cols="" style="width: 127px;height: 40px;" maxlength="100"></textarea>
				      			</td>'; */
			    	$selectedCor = ($detalle['RESULTADOS']=="Correcto")?'checked="checked"':'';
			    	$selectedInc = ($detalle['RESULTADOS']=="Incorrecto")?'checked="checked"':'';
			    	$html .= '<td colspan="3"><input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $idUsuario . '_' . $detalle['FECHAREGISTRO'] .'" type="radio" value="Correcto" ' . $selectedCor . ' />Si&nbsp;&nbsp;<input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $idUsuario . '_' . $detalle['FECHAREGISTRO'] .'" value="Incorrecto" ' . $selectedInc . ' type="radio" />No</br>
				      			</td>';
			    	$html .= '</tr>';
			    	break; // Sólo para aparezca solo una vez aun teniendo varios créditos a validar
//			    	$html .= '<tr>
//			      		<td colspan="5"></td>';
//			    		$j = 0;
//			      		foreach($usuariosDetalle as $usuario):
//			      			$j++;
//			      			if($usuario == $idUsuario){
//			      				$html .= '<td colspan="3"><input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '" type="radio" value="Correcto" ' . (isset($resultadoDetalle[$j])=="Correcto"?'checked="checked"':'') . ' />Si&nbsp;&nbsp;<input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '" value="Incorrecto" type="radio" ' . (isset($resultadoDetalle[$j])=="Incorrecto"?'checked="checked"':'') . ' />No</br>
//				      			<textarea name="comen_' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '" rows="" cols="" style="width: 127px;height: 40px;" maxlength="100">' . (isset($comentariosDetalle[$j])?utf8_decode($comentariosDetalle[$j]):'') . '</textarea>
//				      			</td>';
//			      			} else {
//			      				if($resultadoDetalle[$j] == "Correcto"){
//			      					$imagen = $this->view->baseUrl. '/images/correcto.png';
//			      				} else {
//			      					$imagen = $this->view->baseUrl. '/images/incorrecto.png';
//			      				}
//			      				$html .= "<td style='text-align:center;'><img title='$resultadoDetalle[$j]' src='$imagen' alt='$resultadoDetalle[$j]' style='width: 18px;height: 18px;'></td>'";
//			      			}
//			      		endforeach;
//			    	$html .= '</tr>';
			    	endforeach;
			  		$html .= '
			  		</tbody>
				</table>';
	        } else if($alarma['TIPODETALLE'] == "CONJUSTI"){
	        	$arrayCveUsu = explode("|", $alarma['CVEUSUARIOS']);
	        	$html .= '<table class="table table-bordered CONJUSTI">
				<thead>
					<tr style="background-color:#343467;color:#fff;">
						<th colspan="9" style="text-align:left;"><b>' . $alarma['NMALERTA'] . ' ::::</b></th>
					</tr>
			    	<tr style="background-color:#999;color: #fff;">
			      		<th style="width: 173px;" colspan="4" style="text-align:center;">Empresa</th>
			      		<th style="width: 114px;">Justificación</th>';
			      		$i = 0; foreach($arrayCveUsu as $cve => $valor):
			      		if($valor != ""){
			      			$html .= '<th colspan="3"><i class="icon-user"></i>' . $Auto->getQueUsuarioEs($valor) . '</th>';
			      		} else {
			      			$html .= '<th colspan="3"></th>';
			      		}
			      		$i++;
			      		endforeach;
	        			if($i < 3){
			      			//$html .= '<td></td>';
			      		}
			    	$html .= '
			    	</tr>
			  	</thead>
			  	<tbody style="font-size: 8px;">';
			    	$tipoAlerta = $alarma['IDALERTA'];
			    	$alarmaDetalle = $Auto->getAlarmaDetalle($idGasto, $tipoAlerta, $idUsuario);
			    	//Zend_Debug::dump($alarmaDetalle);
			    	foreach ($alarmaDetalle as $detalle):
			    	//var_dump($detalle);exit;
			    	$resultadoDetalle = explode("|", $detalle['RESULTADOS']);
			    	$comentariosDetalle = explode("|", $detalle['COMENTARIOS']);
			    	$creditoDetalle = explode("|", $detalle['FCDETALLECREDITO']);
			    	$usuariosDetalle = explode("|", $detalle['USUARIOS']);
			    	$html .= '<tr>
			      		<td colspan="4" >' . $detalle['JUSTIFICACION'] . '</td>';
			    		$html .= '<td >Justificación</td>';
			    		$j = 0;
			      		foreach($usuariosDetalle as $usuario):
			      			if($usuario == $idUsuario){
			      				$selectedCor = ($resultadoDetalle[$j]=="Correcto")?'checked="checked"':'';
			    				$selectedInc = ($resultadoDetalle[$j]=="Incorrecto")?'checked="checked"':'';
			      				$html .= '<td colspan="3"><input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '" type="radio" value="Correcto" ' . $selectedCor . ' />Si&nbsp;&nbsp;<input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '" value="Incorrecto" type="radio" ' . $selectedInc . ' />No</br>
				      			<textarea name="comen_' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '" rows="" cols="" style="width: 100px;height: 27px;" maxlength="100">' . (isset($comentariosDetalle[$j])?$comentariosDetalle[$j]:'') . '</textarea>
				      			</td>';
			      			} else {
			      				//$html .= '<td></td>';
			      				if($resultadoDetalle[$j] == "Correcto"){
			      					$imagen = $this->view->baseUrl. '/images/correcto.png';
			      				} else {
			      					$imagen = $this->view->baseUrl. '/images/incorrecto.png';
			      				}
			      				$html .= "<td style='text-align:center;'><img title='$resultadoDetalle[$j]' src='$imagen' alt='$resultadoDetalle[$j]' style='width: 18px;height: 18px;'></td>'";
			      			}
			      			$j++;
			      		endforeach;
			      		if($j < 3){
			      			//$html .= '<td></td>';
			      		}
			    	$html .= '</tr>';
			    	endforeach;
			  	$html .= '
			  	</tbody>
			</table>';
	        } else if($alarma['TIPODETALLE'] == "SOCTOSOP"){
	        	//Zend_Debug::dump($alarma);exit;
	        	$arrayCveUsu = explode("|", $alarma['CVEUSUARIOS']);
	        	$html .= '<table class="table table-bordered SOCTOSOP">
				<thead style="font-size: 10px;" >
					<tr style="background-color:#343467;color:#fff;" >
						<th colspan="9" style="text-align:left;"><b>' . $alarma['NMALERTA'] . ':::</b></th>
					</tr>
			    	<tr style="background-color:#999;color: #fff;">
			      		<th style="text-align:center;">Categoria/Subcategoria/Concepto</th>
			      		<th style="text-align:center;">Cuenta</th>
			      		<th style="text-align:center;">Ligas</th>
			      		<th>Detalle de alerta</th>
			      		<th>Justificación</th>';
			      		$i = 0; foreach($arrayCveUsu as $cve => $valor):
						//$html .= '<th style="width: 160px;"><i class="icon-user"></i>' . $Auto->getQueUsuarioEs($valor) . '</th>';
			      		if( $valor != "" ){
			      				$html .= '<th style="width: 160px;"><i class="icon-user"></i>' . $Auto->getQueUsuarioEs($valor) . '</th>';
			      			}else{
			      				$html .= '<th style="width: 160px;"></th>';
			      			}
			      		$i++;
			      		endforeach;
			      		if($i<3){
			      			$html .= '<th style="width: 160px;"></th>';
			      		}
			    	$html .= '</tr>
			  	</thead>
			  	<tbody style="font-size: 8px;">';
			    	$alarmaDetalle = array();
			    	$tipoAlerta = $alarma['IDALERTA'];
//			    	var_dump($idGasto);
//			    	var_dump($tipoAlerta);
			    	if( $idGasto != "" && $tipoAlerta != "" && $idUsuario != "" ){
			    		$alarmaDetalle = $Auto->getAlarmaDetalle($idGasto, $tipoAlerta, $idUsuario);
			    	} else {
			    		$alarmaDetalle = array();
			    	}
			    	//Zend_Debug::dump($alarmaDetalle);
			    	foreach ($alarmaDetalle as $detalle):
			    	//Zend_Debug::dump($detalle);
			    	$resultadoDetalle = explode("|", $detalle['RESULTADOS']);
			    	$comentariosDetalle = explode("|", $detalle['COMENTARIOS']);
			    	$creditoDetalle = explode("|", $detalle['FCDETALLECREDITO']);
			    	$usuariosDetalle = explode("|", $detalle['USUARIOS']);
			    	$html .= '<tr>
			      		<td>' . $detalle['CATEGSUBCAT'] . '</br>' . $detalle['CONCEPTO'] . '</td>
			      		<td>' . $creditoDetalle[0] . '<br>' . $creditoDetalle[1] . '</td>
			      		<td><a href="#" >X1</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#">X5</a></td>
			      		<td>' . $detalle['ALERTA'] . '</td>
			      		<td>' . $detalle['JUSTIFICACION'] . '</td>';
			    		$j = 0;
			      		foreach($usuariosDetalle as $usuario):
			      			//var_dump($idUsuario);exit;
			      			if($usuario == $idUsuario){
				      			$selectedCor = ($resultadoDetalle[$j]=="Correcto")?'checked="checked"':'';
			    				$selectedInc = ($resultadoDetalle[$j]=="Incorrecto")?'checked="checked"':'';
			      				$html .= '<td><input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '_' . $detalle['FECHAREGISTRO'] .'" type="radio" value="Correcto" ' . $selectedCor . ' />Si&nbsp;&nbsp;<input name="' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '_' . $detalle['FECHAREGISTRO'] .'" value="Incorrecto" type="radio" ' . $selectedInc . ' />No</br>
				      			<textarea name="comen_' . $idGasto . '_' . $tipoAlerta .'_' . $detalle['IDCONCEPTO'] . '_'. $detalle['FCCREDITOCARTERA'] . '_'. $usuario . '" rows="" cols="" style="width: 100px;height: 27px;" maxlength="100">' . (isset($comentariosDetalle[$j])?$comentariosDetalle[$j]:'') . '</textarea>
				      			</td>';
			      			} else {
			      				if($resultadoDetalle[$j] == "Correcto"){
			      					$imagen = $this->view->baseUrl. '/images/correcto.png';
			      					$tdImagen = "<img title='$resultadoDetalle[$j]' src='$imagen' alt='$resultadoDetalle[$j]' style='width: 18px;height: 18px;'>";
			      				} else if($resultadoDetalle[$j] == "Incorrecto") {
			      					$imagen = $this->view->baseUrl. '/images/incorrecto.png';
			      					$tdImagen = "<img title='$resultadoDetalle[$j]' src='$imagen' alt='$resultadoDetalle[$j]' style='width: 18px;height: 18px;'>";
			      				} else {
			      					$tdImagen = '';
			      				}
			      				//$html .= "<td style='text-align:center;'><img title='$resultadoDetalle[$j]' src='$imagen' alt='$resultadoDetalle[$j]' style='width: 18px;height: 18px;'></td>'";
			      				$html .= "<td style='text-align:center;'>" . $tdImagen . "</td>'";
			      			}
			      			$j++;
			      		endforeach;
			      		if($j < 3){
			      			$html .= '<td></td>';
			      		}
			    	$html .= '</tr>';
			    	endforeach;
			  	$html .= '</tbody>
			</table>';
	        }
        endforeach;
        
        $this->view->html = trim($html);
    }

    public function detallegastosAction()
    {
		//$this->_helper->layout->disableLayout();

		$Auto = new Gastos_Model_Autorizacion();
        $idGasto = $this->getRequest()->getParam('id_gasto', 0);
        $idUsuario= $this->getRequest()->getParam('id_usuario', 0);
        $claveCyber = $Auto->getClaveCyber($idUsuario);
        $gastos = $Auto->getDetallGasto($idGasto);
        $this->view->gastos = $gastos;
	 	$this->view->claveCyber = $claveCyber;
        $this->view->idGasto = $idGasto;
    }    	

    public function setautorizacionAction()
	{
		$params = $this->getRequest()->getParams();
    	
		//Zend_Debug::dump($params);exit;
		$Auto = new Gastos_Model_Autorizacion();
    	$psError = $Auto->addAutorizacion($params);
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
	
	public function setcomentarioAction()
	{
		$params = $this->getRequest()->getParams();
    	
		//Zend_Debug::dump($params);exit;
		$cadenaNombre = $params['nombre'];
		$arrayNombre = explode("_", $cadenaNombre);
		$idGasto = $arrayNombre[1];
		$idAlarma = $arrayNombre[2];
		$idCredito = $arrayNombre[4];
		$idUsuario = $arrayNombre[5];
		
		$valor = $params['valor'];
		
    	$Auto = new Gastos_Model_Autorizacion();
    	$psError = $Auto->addComentario($params);
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
	
	// QUANTUM
	public function setCalculaAutorizacionesAction()
	{
		$params = $this->getRequest()->getParams();
    	$idGasto       = $this->getRequest()->getParam('idgasto', 0);
        $idSolic       = $this->getRequest()->getParam('idsolicitante', 0);
        $taskId        = $this->getRequest()->getParam('taskId', 0);
        $delIndex      = $this->getRequest()->getParam('delIndex', 0);
        $tipoSolicitud = $this->getRequest()->getParam('tipoSolicitud', 0);
        
        $data = array();
		$Auto = new Gastos_Model_Autorizacion();

		$data[] = $Auto->setFormatAuto($idGasto, $idSolic, $taskId, $delIndex);

   		$data[] = $Auto->setAutoJefeInmed($idGasto, $idSolic, $taskId, $delIndex);
		$data[] = $Auto->setAutoEtapaProc($idGasto, $idSolic, $taskId, $delIndex);
		$data[] = $Auto->setAutoPagoDoble($idGasto, $idSolic, $taskId, $delIndex);
		$data[] = $Auto->setAutStatusCola($idGasto, $idSolic, $taskId, $delIndex);
		$data[] = $Auto->setAutProjectManager($idGasto, $idSolic, $taskId, $delIndex);
		$data[] = $Auto->setAutNoFacturable($idGasto, $idSolic, $taskId, $delIndex);
		
        echo json_encode($data);
        die();
	}
	
	public function calculaAutUmbralesAction()
	{
		$params = $this->getRequest()->getParams();
    	$idGasto       = $this->getRequest()->getParam('idgasto', 0);

        $data = array();
		$Auto = new Gastos_Model_Autorizacion();

		$data[] = $Auto->setFormatAutoTramite( $idGasto );
		$data[] = $Auto->calculaAutUmbrales( $idGasto );

        echo json_encode($data);
        die();
	}
	
	public function setCalculaAutTramiteAction()
	{
		$params = $this->getRequest()->getParams();
    	$idGasto       = $this->getRequest()->getParam('idgasto', 0);
        $idSolic       = $this->getRequest()->getParam('idsolicitante', 0);
        $taskId        = $this->getRequest()->getParam('taskId', 0);
        $delIndex      = $this->getRequest()->getParam('delIndex', 0);
        $tipoSolicitud = $this->getRequest()->getParam('tipoSolicitud', 0);

        $data = array();
		$Auto = new Gastos_Model_Autorizacion();

		$data[] = $Auto->setAutoEmpresa( $idGasto, $idSolic, $taskId, $delIndex);
		$data[] = $Auto->setAutUmbrales( $idGasto, $idSolic, $taskId, $delIndex);

        echo json_encode($data);
        die();
	}
	
	public function setCalculaAutorizaRechazoAction()
	{
		$params = $this->getRequest()->getParams();
    	$idGasto        = $this->getRequest()->getParam('idgasto', 0);
        $mailRechazo    = $this->getRequest()->getParam('mailRechazo', 0);
        $emailToRechazo = $this->getRequest()->getParam('emailToRechazo', 0);
        $delIndex       = $this->getRequest()->getParam('delIndex', 0);
        $resultAutoriza = $this->getRequest()->getParam('resultadoAutorizacion', 0);
        $comentario     = $this->getRequest()->getParam('comentario', 0);
        
        $Auto = new Gastos_Model_Autorizacion();
        $arrResu = $Auto->setDuplicaAutor($idGasto, $mailRechazo, $emailToRechazo, $delIndex, $resultAutoriza, $comentario);
        
        echo json_encode($arrResu);
        die();
	}
	
	public function setCalculaAutorizacionRechazoAction()
	{
		$params = $this->getRequest()->getParams();
    	$idGasto       = $this->getRequest()->getParam('idgasto', 0);
        $idSolic       = $this->getRequest()->getParam('idsolicitante', 0);
        $taskId        = $this->getRequest()->getParam('taskId', 0);
        $delIndex      = $this->getRequest()->getParam('delIndex', 0);
        $tipoSolicitud = $this->getRequest()->getParam('tipoSolicitud', 0);
        $emailAut      = $this->getRequest()->getParam('emailaut', 0);
        
        $data = array();
		$Auto = new Gastos_Model_Autorizacion();
		
		$arrResu = $Auto->getAutReject($idGasto, $taskId, $delIndex, $emailAut);
		$i=0;
		foreach ($arrResu as $value) { 
			
			switch ($value['IDTIPOAUTORIZA']) {
				case '9':
					$i++;
				   	$data[$i]['tipo'] = 'JI';
					$data[$i]['result'] = $Auto->setAutoJefeInmed($idGasto, $idSolic, $taskId, $delIndex);
				break;
				case '7':
					$i++;
				   	$data[$i]['tipo'] = 'ETAPA';
					$data[$i]['result'] = $Auto->setAutoEtapaProc($idGasto, $idSolic, $taskId, $delIndex);
				break;
				case '8':
					$i++;
				   	$data[$i]['tipo'] = 'PD';
					$data[$i]['result'] = $Auto->setAutoPagoDoble($idGasto, $idSolic, $taskId, $delIndex);
				break;
				case '46':
				   	$i++;
				   	$data[$i]['tipo'] = 'STATUS';
					$data[$i]['result'] = $Auto->setAutStatusCola($idGasto, $idSolic, $taskId, $delIndex);
				break;
				case '64':
				   	$i++;
				   	$data[$i]['tipo'] = 'PM';
					$data[$i]['result'] = $Auto->setAutProjectManager($idGasto, $idSolic, $taskId, $delIndex);
				break;
				case '65':
				   	$i++;
				   	$data[$i]['tipo'] = 'NF';
					$data[$i]['result'] = $Auto->setAutNoFacturable($idGasto, $idSolic, $taskId, $delIndex);
				break;
				case '10':
				   	$i++;
				   	$data[$i]['tipo'] = 'EMPRESA';
					$data[$i]['result'] = $Auto->setAutoEmpresa(  $idGasto, $idSolic, $taskId, $delIndex);
				break;
				case '6':
				   	$i++;
				   	$data[$i]['tipo'] = 'Um';
					$data[$i]['result'] = $Auto->setAutUmbrales($idGasto, $idSolic, $taskId, $delIndex);
				break;
			}
			
		}
		

        echo json_encode($data);
        die();
	}

	public function calcularAutFechaEjecAction(){
        $params = $this->getRequest()->getParams();
        $Auto = new Gastos_Model_Autorizacion();
        $response=$Auto->calcularAutFechaEjec($params);
        echo json_encode(array('responses'=>$response));
        exit;
    }
	
}

