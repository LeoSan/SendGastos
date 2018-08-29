<?php
class Gastos_Model_Verificacionsat
{
    public function validaFolioFiscal($datos)
    {
//        echo 'hola';exit;
        // Consulta el estado de una factura en el SAT
        // @ToRo 2016 https://tar.mx/tema/facturacion-electronica.html
        //
//        $options=array('trace'=>true, 'stream_context'=>'' );
        $options=array('compression' => SOAP_COMPRESSION_ACCEPT,'soap_version' => SOAP_1_1 );
//        $client = new Zend_Soap_Client("https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?wsdl",array('soap_version' => SOAP_1_1 ));
        $client = new Zend_Soap_Client("https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?wsdl",array('compression' => SOAP_COMPRESSION_ACCEPT,'soap_version' => SOAP_1_1 ));
        $client->setEncoding('ISO-8859-1');
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
        $factura   = "?re=".$rfcemisor."&rr=".$rfcreceptor."&tt=".str_pad(number_format($total,6,".",""),17,0,STR_PAD_LEFT)."&id=".strtoupper($uuid);
//                echo '<pre>';print_r($client);exit;
//                echo '<pre>';SoapClient($client->__getFunctions());exit;

//        $resultado = $client->Consulta(array('expresionImpresa'=>$factura));exit;
//        echo '<pre>';print_r($resultado);exit;
//        return $resultado;
//        //en caso que el SAT responda, dará una respuesta (objeto) parecida a:
//        /*
//        stdClass Object
//        (
//         [ConsultaResult] => stdClass Object
//             (
//                 [CodigoEstatus] => S - Comprobante obtenido satisfactoriamente.
//                 [Estado] => Vigente
//             )
//        )
//        */
    }

    public function getDetalleComprobante() {
    	$query = "SELECT  FC.IDGASTOMAIN, IDCOMPROBACION, FCRFC RFC_EMISOR, UUID, 
                          ( SELECT RFCCUENTA 
                              FROM PENDUPM.EMPRESAFACTURACION 
                             WHERE IDEMPRESA = ID_EMPRESA_RECEPTOR ) RFC_RECEPTOR, FC.FNTOTAL
                    FROM  PENDUPM.FACTURACIONCOMPROBA  FC
              INNER JOIN  ( 
                            SELECT  IDGASTOMAIN, 
                                    ( CASE  
                                        WHEN IDEMPRESAFACTURACION IS NULL THEN IDOTEMPRESAFACTURACION
                                        WHEN IDEMPRESAFACTURACION =  0    THEN IDOTEMPRESAFACTURACION
                                        ELSE IDEMPRESAFACTURACION
                                    END ) ID_EMPRESA_RECEPTOR
                              FROM  PENDUPM.FACTURACIONMAIN 
                             WHERE  FCSTATUS = 'D' --AND FCSTATUS != 'R'
                          GROUP BY  IDGASTOMAIN, IDEMPRESAFACTURACION,  IDOTEMPRESAFACTURACION ) FM
                      ON  FM.IDGASTOMAIN = FC.IDGASTOMAIN
                   WHERE  UUID IS NOT NULL AND FCVALIDAUUID IS NULL AND LENGTH( UUID ) > 30 AND ROWNUM = 1";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }

    public function getSetValidaComprobante(  $idcomprobacion, $resultado ){
    	$query = "BEGIN UPDATE  PENDUPM.FACTURACIONCOMPROBA
    	             SET  FCVALIDAUUID = '$resultado' WHERE IDCOMPROBACION = $idcomprobacion;
    	            COMMIT; END;"; 
    	
        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->queryupdate($query);
        return $res;
    }
    
    public function uploadFile($params)
    {
        try{
            // Define a destination
            $targetFolder = $_SERVER['DOCUMENT_ROOT'] . '/file_external/GASTOS/';
            $solicitudid = (isset($params['solicitudid']) || !empty($params['solicitudid']))?$params['solicitudid']:rand(0, 9999);
            $empleadoid = (isset($params['empleadoid']))?$params['empleadoid']:'20101';
            $nombrearchivo = '';

            //echo $targetFolder;exit;
            if (!empty($_FILES)) {
                $tempFile = $_FILES['Filedata']['tmp_name'];
                $targetPath = $targetFolder; //$_SERVER['DOCUMENT_ROOT'] . $targetFolder;
                $targetFile = rtrim($targetPath,'/') . "/TESTR10" . $solicitudid . "FILE.xml";
                // Validate the file type
                $fileTypes = array('xml'); // File extensions
                //$fileTypes = array('pdf', 'csv', 'xls', 'xlsx', 'txt', 'doc');
                $fileParts = pathinfo($_FILES['Filedata']['name']);

                if (in_array($fileParts['extension'],$fileTypes)) {
                    $up = move_uploaded_file($tempFile,$targetFile);
                    if( !$up ){
                        throw new Exception("No se pudo mover el archivo: " . $targetFile);
                        $response['success'] = 'false';
                        $response['msg'] = "No se pudo mover el archivo: " . $targetFile;
                        echo json_encode($response); die();
                    }

                    chmod($targetFile, 0777); //Dar todos los permisos a los archivos

                    $response['success'] = 'true';
                    $response['file'] = "TESTR10" . $solicitudid . "FILE.xml";
                    $response['msg'] = 'Archivo ' . str_replace($targetFolder,'',$targetFile) . ' cargado correctamente.';
                    $response['total'] = 0;
                    $nombrearchivo = "TESTR10" . $solicitudid . "FILE.xml";
                    //$result['shell_res'] = $shell;
                    //$result['shell_file'] = $archivoEjecutar;
                    //echo json_encode($result);
                    //die();
                } else {
                    $response['success'] = 'false';
                    $response['msg'] = "Tipo de archivo no permitido.";
                    echo json_encode($response);
                    die();
                }
            }

            if($response['success'] == 'true'){
                //$nombrearchivo
                $datos['nombrearchivo']=$nombrearchivo;
                $datosXML=$this->getInfoXML($datos);
                /*$Prorrateo = new Gastos_Model_ProrrateoComproba();
                $psError = $Prorrateo->setProrrateoCreditos( $solicitudid, $nombrearchivo, $empleadoid );
                //var_dump($psError);exit;
                if( $psError['error'] == "0") {
                    $response['success'] = 'true';
                    $response['msg'] = $psError['error'];
                    $response['total'] = $psError['total'];
                } else {
                    $response['success'] = 'fail';
                    $response['msg'] = $psError['error'];
                }*/
            }
            echo json_encode($response);
            die();
        } catch( Exception $e) {
            $result['success'] = 'false';
            $result['msg'] = "Excepción: " . $e->getMessage();
            echo json_encode($result); die();
        }
    }

    public function getInfoXML($datos){
        /*
       * lee información de CFDi y genera salida en csv delimitado por comas
       * (configurable), útil para generar reportes para excel.
       * @ToRo 2016-11-15 https://tar.mx/tema/facturacion-electronica.html
       */
        // Configuración
        $path=$_SERVER['DOCUMENT_ROOT'] . '/file_external/GASTOS/'; // el directorio donde se tienen los archivos XML
        $archivo= "resumen.csv";      //nombre del archivo a generar

        if(!is_dir($path)) die("\nError: No existe el directorio ".$path);
        //
        //
        // lee 3 niveles de profundidad
        // d1/d2/d3
        //
        $pathd=dir($path);
        $t=0;
        while(false !== ($e0 = $pathd->read())) {
            if(preg_match("/^\./",$e0)) continue;
            elseif(preg_match("/\.xml/i",$e0)) { $archivos["/"][] = $e0;$t++; }
            elseif(is_dir($path."/".$e0)) {
                $pathd1 = dir($path."/".$e0);
                while(false !== ($e1 = $pathd1->read())) {
                    if(preg_match("/^\./",$e1)) continue;
                    elseif(preg_match("/\.xml/i",$e1)) { $archivos["/".$e0."/"][] = $e1;$t++; }
                    elseif(is_dir($path."/".$e0."/".$e1)) {
                        $pathd2 = dir($path."/".$e0."/".$e1);
                        while(false !== ($e2 = $pathd2->read())) {
                            if(preg_match("/^\./",$e2)) continue;
                            elseif(preg_match("/\.xml/i",$e2)) { $archivos["/".$e0."/".$e1."/"][] = $e2; $t++; }
                        }
                        $pathd2->close();
                    }
                }
                $pathd1->close();
            }
        }
        $pathd->close();

        if(!empty($archivos)) {
            $i=0;
            foreach($archivos AS $dir=>$files) {
                foreach($files AS $file) {
                    if($file==$datos['nombrearchivo']){
                        $xmlfile = $path.$dir.$file;
                        if(is_file($xmlfile)) {
                            $xmldata = $this->parseCFDi($xmlfile);
                            return $xmldata;
                        }
                    }else{
                        return "El archivo no existe";
                    }
                }
            }
        }

    }

    /*
    * lee el cfdi y regresa un arreglo de datos.
    */
    public function parseCFDi() {
        @$tmp = func_get_arg(0);
        @$xml = simplexml_load_file($tmp);
        @$ns = $xml->getNamespaces(true);
        @$xml->registerXPathNamespace('c', $ns['cfdi']);
        @$xml->registerXPathNamespace('t', $ns['tfd']);
        if(!isset($ns['cfdi'])) {
            echo "=== no pude leer $tmp como CFDi :(\n";
            return;
        }
        $cfdiComprobante = $xml->xpath('//cfdi:Comprobante');
        $datos = Array('id'=>'');
        foreach ($xml->xpath('//cfdi:Comprobante') as $cfdiComprobante) {
            $fecha = strtotime($cfdiComprobante['fecha']);
            $datos['fecha'] = date('Y-m-d H:i:s',$fecha);
            $datos['total']= (string)$cfdiComprobante['total'];
            $datos['subtotal']=(string)$cfdiComprobante['subTotal'];
            $datos['descuento']=(string)$cfdiComprobante['descuento'];
            $datos['formapago']=(string)$cfdiComprobante['formaDePago'];
            $datos['tipo']=(string)$cfdiComprobante['tipoDeComprobante'];
            $datos['expedido']=(string)$cfdiComprobante['LugarExpedicion'];
            $datos['metodopago']=(string)$cfdiComprobante['metodoDePago'];
            $datos['nocertificado']=(string)$cfdiComprobante['noCertificado'];
            $datos['serie']=(string)$cfdiComprobante['serie'];
            $datos['folio']=(string)$cfdiComprobante['folio'];
            foreach ($xml->xpath('//cfdi:Comprobante//cfdi:Emisor') as $Emisor) {
                $datos['emisor'] = array((string)$Emisor['rfc'],(string)$Emisor['nombre']);
            }
            foreach ($xml->xpath('//cfdi:Comprobante//cfdi:Receptor') as $Receptor){
                $datos['receptor']=array((string)$Receptor['rfc'],(string)$Receptor['nombre']);
            }
            foreach ($xml->xpath('//cfdi:Comprobante//cfdi:Impuestos') as $Receptor){
                $datos['impuestos']=array((string)$Receptor['totalImpuestosTrasladados'],(string)$Receptor['totalImpuestosRetenidos']);
            }
            $i=0;
            foreach ($xml->xpath('//cfdi:Comprobante//cfdi:Conceptos//cfdi:Concepto') as $Concepto) {
                $i++;
                $datos['concepto'][$i] = array((string)$Concepto['unidad'], (string)$Concepto['importe'], (string)$Concepto['cantidad'], (string)$Concepto['valorUnitario'], (string)$Concepto['descripcion']);
            }
            foreach ($xml->xpath('//cfdi:Comprobante//cfdi:Conceptos//cfdi:Concepto') as $Concepto) {
                $i++;
                @$datos['traslado'][$tmp] = array((string)$Traslado['tasa'],(string)$Traslado['importe']);
            }
            foreach ($xml->xpath('//cfdi:Comprobante//cfdi:Impuestos//cfdi:Retenciones//cfdi:Retencion') as $Traslado) {
                $tmp = (string) $Traslado['impuesto'];
                $datos['retencion'][$tmp] = (string)$Traslado['importe'];
            }
            foreach ($xml->xpath('//t:TimbreFiscalDigital') as $tfd) {
                $datos['id'] = (string)$tfd['UUID'];
                $datos['id'] = strtoupper($datos['id']);
                $datos['timbrado'] = date('Y-m-d H:i:s',strtotime($tfd['FechaTimbrado']));
            }
        }
        return $datos;
    }


}