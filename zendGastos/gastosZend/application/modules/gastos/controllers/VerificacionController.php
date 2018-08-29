<?php

class Gastos_VerificacionController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    	$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }
	
	public function getcomprobantesAction()
	{
		//$this->_helper->layout->disableLayout();
    	
    	$gastoId = $this->getRequest()->getParam('solicitudid', 0);
    	
    	$Comproba = new Gastos_Model_Verificacion();
    	//$comprobaciones = $Comproba->getComprobantesPorGasto( $gastoId );
    	$encabezados = $Comproba->getComprobantesEncabezado( $gastoId );
    	//$comprobaciones = $Comproba->getComprobantesPorTipo( $gastoId );
    	
    	$comprobaciones = $Comproba->getDetallePagoServicios( $gastoId );
    	$hayPagoServ = $Comproba->getHayPagosServicios( $gastoId );
    	$this->view->comprobaciones = $comprobaciones;
    	$this->view->haypagoserv = $hayPagoServ;
    	$this->view->encabezados = $encabezados;
    	//$this->view->comprobaciones = $comprobaciones;
    	
    	$ip = $_SERVER['SERVER_ADDR'];

    	if($ip == "quantum2.pendulum.com.mx"){
            $ip = "quantum1.pendulum.com.mx";
        } 
    	
    	$tableBody = "";
    	$granTotal = 0;
    	foreach($encabezados as $item):
    		$granTotal += $item['TOTAL'];
    		if($item['TOTAL'] > 0){
    			$tableBody .= '<thead>
							    	<tr style="background-color: #343467;color: #FFF;">
							      		<th colspan="9">' . $item['FCTIPOCOMPROBANTE'] . '</th>
							      		<th colspan="3">$ ' . $item['TOTAL'] . '</th>
							    	</tr>
							    	<tr>
							      		<th>Fecha</th>
							      		<th>Concepto</th>
							      		<th>Serie/Folio</th>
							      		<th>Proveedor</th>
							      		<th>RFC</th>
							      		<th>Monto</th>
							      		<th>Iva</th>
							      		<th>Isr</th>
							      		<th>Otros</th>
							      		<th>Total</th>
							      		<th>Xml</th>
							      		<th>Pdf</th>
							    	</tr>
							  	</thead>';
    			$comprobaciones = $Comproba->getComprobantesPorTipo( $gastoId, $item['FCTIPOCOMPROBANTE'], $ip );
    			$tableBody .= '<tbody>';
    			foreach($comprobaciones as $comproba):
    				$tableBody .= '<tr>
							      		<td>' . $comproba['FDFECREGISTRO'] . '</td>
							      		<td>' . $comproba['FCCONCEPTO'] . '</td>
							      		<td>' . $comproba['FCNOFACTURA'] . '</td>
							      		<td>' . $comproba['NMRFC'] . '</td>
							      		<td>' . $comproba['FCRFC'] . '</td>
							      		<td>' . $comproba['FNIMPORTE'] . '</td>
							      		<td>' . $comproba['FNIVA'] . '</td>
							      		<td>' . $comproba['FNISR'] . '</td>
							      		<td>' . $comproba['FNOTROSIMPUEST'] . '</td>
							      		<td>' . $comproba['FNTOTAL'] . '</td>
							      		<td>' . ($comproba['FCARCHIVOXML'] != ""?'<a target="_blank" href="' . $comproba['FCARCHIVOXML'] . '">Ver</a>' :'N/A') . '</td>
							      		<td>' . ($comproba['FCARCHIVOPDF'] != ""?'<a target="_blank" href="' . $comproba['FCARCHIVOPDF'] . '">Ver</a>' :'<a class="uploadpdf" idrel="' . $comproba['IDCOMPROBACION'] . '" href="#">Subir</a>') . '</td>
							    	</tr>';
    			endforeach;
    			$tableBody .= '</tbody>';
    		}
    			
    	endforeach;
    	$tableBody .= '<tfoot>
							  		<tr style="background-color: #CCC;">
							  			<th colspan="9">Total</th>
							  			<td colspan="4">$ ' . $granTotal . '</td>
							    	</tr>
							  	</tfoot>';
    	$this->view->tableBody = $tableBody;
	}
	
	public function scanDirectoryAction()
	{
		$params = $this->getRequest()->getParams();
		$Comproba = new Gastos_Model_Verificacion();
		
		$url = '/var/www/gastosfact/public/patricia/constancia/';
		$directorio = scandir($url);
		$registro = '';
		
		foreach ($directorio as $i => $nombre) {
			if ($nombre != '.' && $nombre != '..') {
				$targetFile = $url.$nombre;
				
				$str = file_get_contents($targetFile);
				
				$pos_xml = strpos($str, '<?xml', 0);
        		$str_clob = substr($str, $pos_xml);
        		
        		error_reporting(E_ALL ^ E_WARNING); 
        		
        		$xml = new SimpleXMLElement($str);
        		
        		$ns = $xml->getNamespaces(true);
        		$xml->registerXPathNamespace('r', $ns['retenciones']);
        		$xml->registerXPathNamespace('i', $ns['intereseshipotecarios']);
				
        		
        		
        		foreach ( $xml->xpath('//r:Nacional') as $cfdiComprobante )
				{ 
					$NomDenRazSocR = ( $cfdiComprobante["NomDenRazSocR"] );
					$RFCRecep = ( $cfdiComprobante["RFCRecep"] );
				}
				
				foreach ( $xml->xpath('//i:Intereseshipotecarios') as $cfdiComprobante )
				{ 
					$NumContrato = ( $cfdiComprobante['NumContrato'] );
				}
				
				$existe = $Comproba->getExisteCuenta( $NumContrato );

				$registro .= "<tr>";
				$registro .= "<td>".$nombre."</td>";
				$registro .= "<td>'".$NumContrato."</td>";
				$registro .= "<td>'".$NomDenRazSocR."</td>";
				$registro .= "<td>'".$RFCRecep."</td>";
				$registro .= "<td>".$existe[0]['EXISTE']."</td>";
				$registro .= "</tr>";
				
			}
		}
		
		
		$filename = "Casos".date('H:i:s'); $html = '';
		
		header('Content-Disposition: attachment; filename="'.$filename.'.xls"');
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Transfer-Encoding: binary');
		header('Cache-Control: must-revalidate');
		header('Pragma: public');
		ob_start();

		
		$totalImporte = 0;
		$totalIVA = 0;
		$totalTOTAL = 0;
		$html .= '<table><thead><tr><th>Archivo</th>';
		$html .= '<th>NumContrato</th>';
		$html .= '<th>NomDenRazSocR</th>';
		$html .= '<th>RFCRecep</th>';
		$html .= '<th>EXISTE</th>';
		$html .= '</tr></thead><tbody>';
		
		$html .= $registro;
		
		$html .= "</body></html>";
		ob_end_flush();
		echo $html;
		
		
		
		//var_dump( $directorio );
		exit;
	}
	
}

