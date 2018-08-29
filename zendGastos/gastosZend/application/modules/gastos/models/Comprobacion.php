<?php
class Gastos_Model_Comprobacion
{
	public function getDetalleComprobacion( $idSolicitud )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETDETALLEPARACOMPROBA(" . $idSolicitud . ", :RESDATA); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getTipoMovimiento( $idSolicitud )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETTIPOMOVIMIENTO(" . $idSolicitud . ", :RESDATA); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getConceptosolicitud( $idSolicitud, $tipoMovimiento )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETCONCEPTOSOLICITUD(" . $idSolicitud . "," . $tipoMovimiento . ", :RESDATA); END;";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getCategoriaCC()
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETCATEGORIACC(:RESDATA); END;";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getCCSolicitud( $idCategoria )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETCCSOLIC('" . $idCategoria . "', :RESDATA); END;";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getCarteraConcepto( $idConcepto )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETCARTERACONCEPTO(" . $idConcepto . ", :RESDATA); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function validaTipoMovimiento( $idSolicitud, $tipoMovimiento )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.VALIDATIPOMOVIMIENTO(" . $idSolicitud . "," . $tipoMovimiento . ", :statAplica); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function borraAsignacionsolic( $idSolicitud )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.BORRAASIGNACIONSOLIC(" . $idSolicitud . ", :statAplica); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function geTipoAsigActual($solicitudid = '')
	{
		$query = "SELECT PENDUPM.PCKCATALOGOS.queTipoAsignatiene(" . $solicitudid . ") TIPO FROM DUAL";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $tipo = $Oracle->query($query);
        return $tipo;
	}
	
	public function addCreditoAsigna( $params )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.ADDCREDITOASIGNA(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= "'" . $params['credito']. "',"; //psCredito VARCHAR2 /* SI  es psTipomovto = 4 [valor CARTERA]  psTipomovto = 42 [CONCEPTO ]*/
		$query .= $params['concepto']. ","; //pnConcepto NUMBER
		$query .= $params['importe']. ","; //pnImporte NUMBER
		$query .= $params['tipoAsignacion']. ","; //psTipomovto INTEGER,  /* [2] X CREDITO , [3] MUT-CRED, [4] X CARTERA, [42] X IMP GRAL */
		$query .= " :statAplica); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function addCarteraAsigna( $params )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.ADDCARTERAASIGNA(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= "'" . $params['carteraCar']. "',"; //psCredito VARCHAR2 /* SI  es psTipomovto = 4 [valor CARTERA]  psTipomovto = 42 [CONCEPTO ]*/
		$query .= $params['conceptoCar']. ","; //pnConcepto NUMBER
		$query .= $params['importeCar']. ","; //pnImporte NUMBER
		$query .= $params['tipoAsignacion']. ","; //psTipomovto INTEGER,  /* [2] X CREDITO , [3] MUT-CRED, [4] X CARTERA, [42] X IMP GRAL */
		$query .= " :statAplica); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function addImporteAsigna( $params )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.ADDIMPORTEASIGNA(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= $params['conceptoImp']. ","; //pnConcepto NUMBER
		$query .= $params['importeImp']. ","; //pnImporte NUMBER
		$query .= $params['tipoAsignacion']. ","; //psTipomovto INTEGER,  /* [2] X CREDITO , [3] MUT-CRED, [4] X CARTERA, [42] X IMP GRAL */
		$query .= " :statAplica); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function validaMasivaCreditoAsigna_________( $params )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.VALIDAMASIVACREDITOASIGNA(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= $params['tipoAsignacion']. ","; //psTipomovto INTEGER,  /* [2] X CREDITO , [3] MUT-CRED, [4] X CARTERA, [42] X IMP GRAL */
		$query .= "'" . $params['archivo']. "',"; //psNmFile VARCHAR2
		$query .= " :statAplica); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function validaArchivoAsigna( $params )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.VALIDAARCHIVOASIGNA(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= "'" . $params['archivo']. "',"; //psNmFile VARCHAR2
		$query .= " :statAplica, :totRegistros); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->setValidar($query);
        return $psError;
	}
	
	public function setComprobacion( $query )
	{
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function setPagosServicios( $query )
	{
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->queryupdate($query);
        return $psError;
	}
	
	public function getHayPagosServicios( $gastoId )
	{
		$query = "SELECT COUNT(*) HAY FROM PENDUPM.CTCATALOGOCUENTAS WHERE FCREQPAGSERV = 'S' 
AND IDCONCEPTO IN(SELECT IDCONCEPTO FROM PENDUPM.FACTURAASIGNACION WHERE IDGASTOMAIN = $gastoId)";
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $respuesta = $Oracle->query($query);
        return $respuesta[0]["HAY"];
	}

	public function getPendientesComprobacion()
	{
		$query = "SELECT * FROM PENDUPM.FACTURACIONDEPOSITO
				WHERE FDFECREGISTRO BETWEEN to_date('31/01/2016 08:30:00','DD/MM/YYYY HH24:MI:SS') and SYSDATE
				AND FCREFERENCIA IS NOT NULL
				AND FCSTATUS = 'A'
				AND FNCONSEC = 2";
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        
        $appUid = '';
        $delIndex = '';
        $noCaso = '';
        $arrayReturn = array();
        $indice = '';
        foreach ($items as $item):
        	$appUid = $item['APPUID'];
	        $delIndex = $item['IDDELINDEX'];
	        $noCaso = $item['IDGASTOMAIN'];

        	$queryMysql = "SELECT MAX(`DEL_INDEX`) INDICE 
				FROM  `APP_DELEGATION` 
				WHERE  `APP_UID` LIKE  '$appUid'
				AND `DEL_THREAD_STATUS` = 'OPEN'";
        	$ConnMysql = Pendum_Db_DbFactory::factory('mysql');
        	$result = $ConnMysql->query($queryMysql);
        	$indice = $result[0]['INDICE'];
        	
        	if( $delIndex === $indice){
        		$arrayReturn[] = array('DEL_INDEX' => $delIndex, 'APP_UID' => $appUid, 'IDGASTOMAIN' => $noCaso);
        	}

        endforeach;

        return $arrayReturn;
	}
	
	public function getDetalleComprobante($uuid)
	{
		$query = "SELECT IDGASTOMAIN EXISTE FROM PENDUPM.FACTURACIONCOMPROBA WHERE UUID = '$uuid' AND IDGASTOMAIN IN (SELECT IDGASTOMAIN FROM FACTURACIONMAIN WHERE FCSTATUS != 'Z')";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function setComprobanteGasto($query)
	{
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->queryupdate($query);
        return $res;
	}
	
	public function delComprobanteGasto($comprobanteId)
	{
		$query = "BEGIN DELETE FROM PENDUPM.FACTURACIONCOMPROBA WHERE IDCOMPROBACION = $comprobanteId; COMMIT;END;";
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->queryupdate($query);
        return $res;
	}
	
	public function setComprobantePdf($comprobanteId, $nombrePdf, $rutaPdf, $tipo)
	{
	    $query = '';
		if($tipo == 'pdf' || $tipo == 'PDF'){
			$query = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA SET NMORIGPDF = '$nombrePdf', FCARCHIVOPDF = '$rutaPdf', FDARCHIVOPDF = SYSDATE WHERE IDCOMPROBACION = $comprobanteId; COMMIT;END;";
		} else if($tipo == 'pdfc' || $tipo == 'PDFC'){
			$query = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA SET NMORIGPDFC = '$nombrePdf', FCARCHIVOPDFC = '$rutaPdf', FDARCHIVOPDFC = SYSDATE WHERE IDCOMPROBACION = $comprobanteId; COMMIT;END;";
		} else if($tipo == 'tk' || $tipo == 'TK'){
			$query = "BEGIN UPDATE PENDUPM.COMPROBACIONGASTO SET NMORIGPDFC = '$nombrePdf', FCFACTURAPDFC = '$rutaPdf', FDFACTURAPDFC = SYSDATE WHERE IDCOMPROBACION = $comprobanteId; COMMIT;END;";
		} else{
			$query = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA SET NMORIGXML = '$nombrePdf', FCARCHIVOXML = '$rutaPdf', FDARCHIVOXML = SYSDATE WHERE IDCOMPROBACION = $comprobanteId; COMMIT;END;";
		}
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        	$res = $Oracle->queryupdate($query);
       	return $res;
	}
	
	public function setComprobanteXml($comprobanteId, $nombre, $ruta, $uuid)
	{
	    $query = '';
		$query = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA 
		            SET NMORIGXML = '$nombre', FCARCHIVOXML = '$ruta', FDARCHIVOXML = SYSDATE, UUID = '$uuid'
		          WHERE IDCOMPROBACION = $comprobanteId; COMMIT;END;";
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        	$res = $Oracle->queryupdate($query);
       	return $res;
	}
	
	public function getComprobantesPorGasto($gastoId)
	{
		//$query = "SELECT * FROM PENDUPM.FACTURACIONCOMPROBA WHERE FCTIPOCOMPROBANTE != 'Ficha de Deposito' AND IDGASTOMAIN = $gastoId ORDER BY FCNOFACTURA ASC";
		$query = "SELECT * FROM PENDUPM.FACTURACIONCOMPROBA WHERE (FCTIPOCOMPROBANTE != 'Ficha de Deposito' AND FCTIPOCOMPROBANTE != 'Descuento de nomina') AND IDGASTOMAIN = $gastoId ORDER BY FCNOFACTURA ASC";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getComprobantesEncabezado($gastoId)
	{
		$query = "SELECT B.FCTIPOCOMPROBANTE, 
                (SELECT  COALESCE(SUM(FNTOTAL),0) AS TOTAL FROM PENDUPM.FACTURACIONCOMPROBA WHERE FCTIPOCOMPROBANTE = B.FCTIPOCOMPROBANTE AND IDGASTOMAIN = $gastoId) TOTAL 
            FROM 
                (SELECT 'Factura' FCTIPOCOMPROBANTE FROM DUAL
                UNION
                 SELECT 'Recibo de honorarios' FCTIPOCOMPROBANTE FROM DUAL
                UNION
                 SELECT 'Comprobante' FCTIPOCOMPROBANTE FROM DUAL
                UNION
                 SELECT 'Ficha de Deposito' FCTIPOCOMPROBANTE FROM DUAL
                UNION
                 SELECT 'Descuento de nomina' FCTIPOCOMPROBANTE FROM DUAL
                UNION
                 SELECT 'Devolucion tarjeta corporativa' FCTIPOCOMPROBANTE FROM DUAL
                ) B";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getComprobantesPorTipo($gastoId, $tipoComprobante, $ip)
	{
		$targetFile = 'http:// ' . $ip . '/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=';	
  
		$query = "SELECT IDGASTOMAIN, FCTIPOCOMPROBANTE, IDCOMPROBACION, IDUSUARIO, TO_CHAR(FDFECREGISTRO,'DD-Mon-YY' ,'nls_date_language=Spanish') FDFECREGISTRO, FCTIPOCOMPROBANTE, FCRFC, FCNOFACTURA, PENDUPM.PCKCONVENIOS.formatComas(NVL(FNIMPORTE,0)) FNIMPORTE, FNIVA, PENDUPM.PCKCONVENIOS.formatComas(NVL(FNIMPIVA,0)) FNIMPIVA,
                    CASE WHEN FCTIPOCOMPROBANTE = 'Recibo de honorarios' THEN FNIVARET ELSE FNOTROSIMPUEST END FNOTROSIMPUEST, FNIVARET, FNISR, FNDESCSIAFECTA, FNDESCNOAFECTA,
                    PENDUPM.PCKCONVENIOS.formatComas(NVL(FNTOTAL,0)) FNTOTAL, FCCOMENTARIO,  REPLACE(FCARCHIVOXML, '$targetFile','http://doc.pendulum.com.mx/PM/gastos/comprobacion/') FCARCHIVOXML,
                    FDARCHIVOXML,  REPLACE(FCARCHIVOPDF, '$targetFile','http://doc.pendulum.com.mx/PM/gastos/comprobacion/') FCARCHIVOPDF,
                    REPLACE(FCARCHIVOPDFC, '$targetFile','http://doc.pendulum.com.mx/PM/gastos/comprobacion/') FCARCHIVOPDFC,
                    FDARCHIVOPDFC,FDARCHIVOPDF, FCVALIDACION, FCCONCEPTO, FDCOMPROBACION, NMRFC, NMORIGXML, NMORIGPDF, FCVALPDFC, FCVALPDF, FCVALXML,
                    CASE WHEN (FCARCHIVOPDFC IS NOT NULL AND ( FCVALPDFC = 'S' ) ) THEN 'N' ELSE 'S' END PDFCV,
         			CASE WHEN (FCARCHIVOXML IS NOT NULL AND ( FCVALXML = 'S' ) ) THEN 'N' ELSE 'S' END XMLV,
         			CASE WHEN (FCARCHIVOPDF IS NOT NULL AND ( FCVALPDF = 'S' ) ) THEN 'N' ELSE 'S' END PDFV
            FROM PENDUPM.FACTURACIONCOMPROBA CG WHERE IDGASTOMAIN = $gastoId AND FCTIPOCOMPROBANTE = '$tipoComprobante' ORDER BY FDFECREGISTRO, IDCOMPROBACION ASC";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getDatosFactura($gastoId)
	{
		$query = "SELECT EF.IDEMPRESA IDEMPRESA, EF.RFCCUENTA RFCEMPRESA, EF.NMEMPRESA, PG.IDPROVEEDORGTO IDPROVEEDOR, PG.FCRFC RFCPROVEEDOR, PG.NMPROVEEDOR NMPROVEEDOR
		FROM PENDUPM.FACTURACIONMAIN FM
		INNER JOIN PENDUPM.EMPRESAFACTURACION EF ON EF.IDEMPRESA = CASE WHEN FM.IDEMPRESAFACTURACION != 0 THEN FM.IDEMPRESAFACTURACION ELSE FM.IDOTEMPRESAFACTURACION END
		INNER JOIN PENDUPM.CTPROVEEDORGASTO PG ON FM.IDPROVEEDORGTO = PG.IDPROVEEDORGTO
		where FM.IDGASTOMAIN = $gastoId";
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}

	public function getComprobantesSinUuid()
	{
		$query = "SELECT IDGASTOMAIN, IDCOMPROBACION,FCCONTENIDOXML FROM PENDUPM.FACTURACIONCOMPROBA 
			WHERE FCARCHIVOXML IS NOT NULL
			AND UUID IS NULL
			ORDER BY FDFECREGISTRO DESC";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function setUuidComprobante($idgasto, $idcomproba, $uuid)
	{
		$query = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA SET UUID = '$uuid' WHERE IDGASTOMAIN = $idgasto AND IDCOMPROBACION = $idcomproba; COMMIT;END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
	        $res = $Oracle->queryupdate($query);
        	return $res;
	}

	public function getDatosComprobadosPV($gastoId)
	{
		$query = "SELECT IDCOMPROBACION, IDGASTO, CG.IDTPOGASTO, CG.IDCONCEPTO, IDTPOCOMPROBANTE, IDEMPLEADO, FCPSNFM, FCRFC, NMRFC, 
				FNIMPORTE, FNIVAPRC, FNIVA, FNTOTAL, FNIMPAUTORIZADO, FNIMPRESTANTE, TO_CHAR(FDCOMPROBACION,'DD'||'-'||'Mon'||'-'||'YY','nls_date_language=spanish') FDCOMPROBACION,TO_CHAR(FDCOMPROBACION,'DD'||'-'||'MON'||'-'||'YYYY','nls_date_language=spanish') COPYFDCOMPROBACION, FDFECREGISTRO, IDVALIDADOR, 
				FCVALIDACION, FDFECVALIDA, IDCONTADOR, FDCONTABLE, FCCONTABLE, FCDESCUENTO, FNIMPDESCUENTO, FCPENDIENTE, 
				FDFECPENDIENTE, FCORIGEN, FCDOCERRONEO, FCAUTEXCEDENTE, FCJUSTIFICAEXCEDENTE, FCREEMBOLSO, FNIMPORTEREMBOLSO, 
				FNMONTOPOLITICA, FNOTROSIMPUEST, FCNOFACTURA, IDREFERENCIA, FCFACTURAXML, FCFACTURAPDF, NMGASTO, TG.FCSTATUS, CT.NMCONCEPTO, NMORIGPDF,
				FDFACTURAPDFC,NMORIGPDFC,FCFACTURAPDFC
			FROM PENDUPM.COMPROBACIONGASTO CG, PENDUPM.CTTPOGASTO TG, PENDUPM.CONCEPTOGASTO  CT 
			WHERE CG.IDTPOGASTO = TG.IDTPOGASTO AND CG.IDCONCEPTO = CT.IDCONCEPTO AND CG.IDTPOGASTO = CT.IDTPOGASTO AND IDGASTO = $gastoId AND TG.IDTPOGASTO NOT IN (7, 8) 
			ORDER BY FDCOMPROBACION, IDCOMPROBACION ASC";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getPoliticasPV($idgasto,$tpogasto,$idconcepto,$idcomprobante, $diacomp)
	{
		$query = "SELECT A.IDTPOGASTO, A.IDCONCEPTO ,A.IDTPOCOMPROBANTE, A.FNEVENTOS, A.FNMONTO, 
				(SELECT COUNT(1) DIAS FROM PENDUPM.COMPROBACIONGASTO C 
        		WHERE IDGASTO = $idgasto AND C.IDTPOGASTO = $tpogasto AND C.IDCONCEPTO = $idconcepto 
				AND C.IDTPOCOMPROBANTE = $idcomprobante AND FDCOMPROBACION = TO_DATE('$diacomp','dd/mm/YYYY') ) CANTIDADDIAS,
				(SELECT distinct TO_CHAR(FDCOMPROBACION,'DD/MM/YYYY') FDCOMPROBACION FROM PENDUPM.COMPROBACIONGASTO C 
        		WHERE IDGASTO = $idgasto AND C.IDTPOGASTO = $tpogasto AND C.IDCONCEPTO = $idconcepto 
				AND C.IDTPOCOMPROBANTE = $idcomprobante AND FDCOMPROBACION = TO_DATE('$diacomp','dd/mm/YYYY') ) DIA
				FROM pendupm.CTPOLITICAGASTO A 
				WHERE IDTPOGASTO = $tpogasto AND IDCONCEPTO = $idconcepto AND IDTPOCOMPROBANTE = $idcomprobante ";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getInfoCasoComproba($gastoId,$idComp) {
		$query = "SELECT TO_CHAR(FDCOMPROBACION,'DD/MM/YYYY') FDCOMPROBACION FROM PENDUPM.COMPROBACIONGASTO CG WHERE CG.IDGASTO=$gastoId AND IDCOMPROBACION=$idComp";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getOnePoliticasPV($tpogasto,$idconcepto,$idcomprobante)
	{
		$query = "SELECT FNMONTO, FNEVENTOS
			FROM pendupm.CTPOLITICAGASTO A
			WHERE IDTPOCOMPROBANTE = $idcomprobante AND IDTPOGASTO = $tpogasto AND IDCONCEPTO = $idconcepto ";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getOnePoliticasAcumulativaPV($idgasto,$tpogasto,$idconcepto,$idcomprobante)
	{
		$query = "select  FDFECFIN-FDFECINI DIAS, P.FNMONTO*(FDFECFIN-FDFECINI) TOTALPOL, (SELECT SUM(FNTOTAL) OTROS FROM PENDUPM.COMPROBACIONGASTO
WHERE IDGASTO = $idgasto AND IDTPOCOMPROBANTE = $idcomprobante AND IDTPOGASTO = $tpogasto AND IDCONCEPTO = $idconcepto) OTROS
			    from PENDUPM.GASTOMAIN G , PENDUPM.CTPOLITICAGASTO P  
				where G.IDGASTO = $idgasto AND P.IDTPOCOMPROBANTE=$idcomprobante AND P.IDTPOGASTO=$tpogasto AND P.IDCONCEPTO=$idconcepto 
				GROUP BY FDFECFIN-FDFECINI, P.FNMONTO*(FDFECFIN-FDFECINI)";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getTipoGastoPV($idgasto)
	{
		$query = "SELECT COALESCE(SUM(COMPG.FNTOTAL),0) AS TOTAL, TG.IDTPOGASTO, TG.NMGASTO 
			FROM PENDUPM.CTTPOGASTO TG LEFT JOIN (SELECT CG.IDTPOGASTO, CG.FNTOTAL 
				FROM PENDUPM.COMPROBACIONGASTO CG WHERE CG.IDGASTO = $idgasto) COMPG ON COMPG.IDTPOGASTO = TG.IDTPOGASTO 
			WHERE FCSTATUS = 'A' AND TG.IDTPOGASTO NOT IN (7, 8) GROUP BY TG.NMGASTO, TG.IDTPOGASTO ORDER BY TG.NMGASTO";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getAllTiposGastoPV( $factura=0 )
	{
		$filtro = ($factura!==0) ? ' AND TC.IDTPOCOMPROBANTE = '.$factura.' ' : '' ;

		$query = "SELECT TC.IDTPOCOMPROBANTE, TG.IDTPOGASTO, TG.NMGASTO
		            FROM pendupm.CTTPOGASTO TG INNER JOIN PENDUPM.CTPOLITICAGASTO PC ON TG.IDTPOGASTO = PC.IDTPOGASTO
                                       INNER JOIN PENDUPM.CTTPOCOMPROBANTE TC ON PC.IDTPOCOMPROBANTE = TC.IDTPOCOMPROBANTE 
		            WHERE TC.FCSTATUS = 'A' AND TG.IDTPOGASTO NOT IN (4,5,7,8) $filtro 
			    GROUP BY TG.IDTPOGASTO, TG.NMGASTO, TC.IDTPOCOMPROBANTE ORDER BY TC.IDTPOCOMPROBANTE";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}


	public function getConceptoPV($factura=0)
	{
		$filtro = ($factura!==0) ? ' AND P.IDTPOCOMPROBANTE = '.$factura.' ' : '' ;

		$query = "SELECT P.IDTPOCOMPROBANTE,P.IDTPOGASTO,P.IDCONCEPTO, TP.NMCONCEPTO
			FROM PENDUPM.CONCEPTOGASTO TP INNER JOIN PENDUPM.CTPOLITICAGASTO P ON (TP.IDTPOGASTO=P.IDTPOGASTO AND TP.IDCONCEPTO = P.IDCONCEPTO)
				$filtro 
			WHERE TP.FCSTATUS = 'A' ORDER BY P.IDCONCEPTO";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getTpoComprobantePV()
	{
		$query = "SELECT C.IDTPOCOMPROBANTE, C.NMCOMPROBANTE, C.FCDEDUCIBLE FROM PENDUPM.CTTPOCOMPROBANTE C 
				WHERE FCSTATUS = 'A' ORDER BY C.IDTPOCOMPROBANTE";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getDatosPV($idgasto)
	{
		$query = "SELECT CLNAME NAMEUSER, TO_CHAR(FDFECINI,'DD/MM/YYYY') DATEINI, TO_CHAR(FDFECFIN,'DD/MM/YYYY') DATEFIN, 
		                 FNEMPNOMINA, FCVIATICO0,
		                 TO_CHAR(FDCOMPROBACION,'DD-Mon-YY','nls_date_language=spanish') FDCOMPROBACION,
		                 TO_CHAR(FDFECINI,'DD-Mon-YY','nls_date_language=spanish') FECHAINIM,
		                 TO_CHAR(FDFECFIN,'DD-Mon-YY','nls_date_language=spanish') FECHAFINM
    			FROM rcvry.COLLID cols INNER JOIN pendupm.GASTOMAIN ON  CLCOLLID = IDSOLICITANTE
    			WHERE IDGASTO = $idgasto";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getAllPoliticasPV()
	{
		$query = "SELECT NMGASTO TPOGASTO, NMCONCEPTO CONCEPTO ,
               CASE WHEN (C.IDTPOGASTO = 2 AND C.IDCONCEPTO = 3 ) THEN 'COMPROBANTE' ELSE D.NMCOMPROBANTE END TPOCOMPROBANTE, 
		       DECODE ( FNEVENTOS, 0, 'SIN limite', FNEVENTOS||' VECES'|| ' x dia') NUMVECES, 
		       DECODE ( FNMONTO, 0, 'NO definido', '$'||FNMONTO|| ' x dia' ) LIMITEIMPORTE
		  FROM pendupm.CTPOLITICAGASTO A 
			  INNER JOIN pendupm.CTTPOGASTO B ON ( A.IDTPOGASTO = B.IDTPOGASTO) 
			  INNER JOIN pendupm.CONCEPTOGASTO C ON (A.IDTPOGASTO = C.IDTPOGASTO AND A.IDCONCEPTO = C.IDCONCEPTO ) 
			  INNER JOIN pendupm.CTTPOCOMPROBANTE D ON ( A.IDTPOCOMPROBANTE = D.IDTPOCOMPROBANTE)";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function setQueryComprobantePV($campos,$valores)
	{
		$query = "BEGIN INSERT INTO PENDUPM.COMPROBACIONGASTO ($campos) VALUES($valores); COMMIT; END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->queryupdate($query);
		
		return $items;
	}

	public function editQueryComprobantePV($idComp,$idgasto,$valores)
	{
		$query = "BEGIN UPDATE PENDUPM.COMPROBACIONGASTO SET $valores WHERE IDGASTO= $idgasto AND IDCOMPROBACION=$idComp; COMMIT; END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->queryupdate($query);
		
		return $items;
	}

	public function deleteQueryComprobantePV( $idgasto,$idcomprobacion,$tpocomprobante,$tpogasto,$idconcepto )
	{
		$query = "BEGIN DELETE FROM PENDUPM.COMPROBACIONGASTO WHERE IDCOMPROBACION=$idcomprobacion AND IDGASTO=$idgasto AND 
				IDTPOGASTO=$tpogasto AND IDCONCEPTO=$idconcepto AND IDTPOCOMPROBANTE=$tpocomprobante; COMMIT; END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->queryupdate($query);
		
		return $items;
	}

	public function getValidadUuid ($uuid) 
	{
		$query = "select IDGASTO EXISTE from PENDUPM.COMPROBACIONGASTO where FCUUID = '$uuid' ";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function setComprobanteFile($solicitudid,$comprobacionId,$tipo) {
		
		if( $tipo == 'xml'  ) {
			$update = "FCARCHIVOXML  = '',
                        NMORIGXML     = '',
                        FDARCHIVOXML  = SYSDATE,
                        UUID          = ''"; 
		}
		
		if( $tipo == 'pdf'  ) {
			$update = "FCARCHIVOPDF  = '',
                        NMORIGPDF     = '',
                        FDARCHIVOPDF  = SYSDATE"; 
		}
		
		if( $tipo == 'pdfc'  ) {
			$update = "FCARCHIVOPDFC  = '',
                        NMORIGPDFC     = '',
                        FDARCHIVOPDFC  = SYSDATE"; 
		}
		

		$query = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA
                    SET $update
					WHERE  IDCOMPROBACION    = $comprobacionId AND 
					     IDGASTOMAIN = $solicitudid;COMMIT;END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->queryupdate($query);
		
		return $items;
	}
	
	public function setValidacionDocs( $solicitudid,$comprobacionId,$tipo, $valresult ) {
		
		if( $tipo == 'cbxpdfc'  ) {
			$update = "FCVALPDFC = '$valresult'"; 
		} else if( $tipo == 'cbxxml'  ) {
			$update = "FCVALXML = '$valresult'"; 
		}else if( $tipo == 'cbxpdf'  ) {
			$update = "FCVALPDF = '$valresult'"; 
		}


		$query = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA
                    SET $update
					WHERE IDCOMPROBACION = $comprobacionId AND IDGASTOMAIN = $solicitudid; COMMIT;END;";
 
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->queryupdate($query);
		
		return $items;
	}

	public function setValidacionDocsViaje( $solicitudid,$comprobacionId, $valresult ) {

		$query = "BEGIN UPDATE PENDUPM.COMPROBACIONGASTO
                    SET FCVALIDACION = $valresult, FDFECVALIDA = SYSDATE
					WHERE IDCOMPROBACION = $comprobacionId AND IDGASTO = $solicitudid; COMMIT;END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->queryupdate($query);
		
		return $items;
	}
	
    public function getEtapaJucioByIdcaso($idCaso)
    {
        //primero busco el ultimo juicio activo
        $query = "SELECT REPLACE(B.VERETAPAFIN,'|',',') ETAPAS,B.FCCREDITOCARTERA CREDITO, D.CESTATUS ESTATUS_JUCIO ,MAX(C.CCCASENO) JUICIO,B.IDCONCEPTO,
                    (SELECT CCB.NMDESCRIP FROM PENDUPM.CTCATALOGOCUENTAS CCA INNER JOIN PENDUPM.CTCUENTACATEGORIA CCB ON CCA.IDCATEGORIA=CCB.IDCUENTACAT WHERE CCA.IDCONCEPTO = B.IDCONCEPTO) CATEGORIA,
                    (SELECT CCB.NMDESCRIP FROM PENDUPM.CTCATALOGOCUENTAS CCA INNER JOIN PENDUPM.CTCUENTACATEGORIA CCB ON CCA.IDSUBCATEGORIA=CCB.IDCUENTACAT WHERE IDCONCEPTO = B.IDCONCEPTO) SUBCATEGORIA,                    
                    (SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS WHERE IDCONCEPTO = B.IDCONCEPTO) CONCEPTO,
                    B.FCJUSTIFICACIONALERTA JUSTIFICACION
                    FROM PENDUPM.FACTURACIONMAIN A
                    INNER JOIN PENDUPM.FACTURAASIGNACION B ON (B.IDGASTOMAIN = A.IDGASTOMAIN AND B.IDCONCEPTO = A.IDCONCEPTO)
                    INNER JOIN RCVRY.CASEACCT C ON C.CCACCT = B.FCCREDITOCARTERA
                    INNER JOIN RCVRY.CASE D ON D.CECASENO = C.CCCASENO 
                    WHERE A.IDGASTOMAIN = $idCaso                    
                    AND D.CESTATUS = 'A'
                    GROUP BY B.VERETAPAFIN, B.FCCREDITOCARTERA,B.IDCONCEPTO,D.CESTATUS,B.FCJUSTIFICACIONALERTA";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        if(count($items)==0){
            //Si no hay un ultimo juicio activo entonces busco el ultimo juicio
            $query = "SELECT REPLACE(B.VERETAPAFIN,'|',',') ETAPAS,B.FCCREDITOCARTERA CREDITO, D.CESTATUS ESTATUS_JUCIO ,MAX(C.CCCASENO) JUICIO,B.IDCONCEPTO,
                    (SELECT CCB.NMDESCRIP FROM PENDUPM.CTCATALOGOCUENTAS CCA INNER JOIN PENDUPM.CTCUENTACATEGORIA CCB ON CCA.IDCATEGORIA=CCB.IDCUENTACAT WHERE CCA.IDCONCEPTO = B.IDCONCEPTO) CATEGORIA,
                    (SELECT CCB.NMDESCRIP FROM PENDUPM.CTCATALOGOCUENTAS CCA INNER JOIN PENDUPM.CTCUENTACATEGORIA CCB ON CCA.IDSUBCATEGORIA=CCB.IDCUENTACAT WHERE IDCONCEPTO = B.IDCONCEPTO) SUBCATEGORIA,                    
                    (SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS WHERE IDCONCEPTO = B.IDCONCEPTO) CONCEPTO,
                    B.FCJUSTIFICACIONALERTA JUSTIFICACION
                    FROM PENDUPM.FACTURACIONMAIN A
                    INNER JOIN PENDUPM.FACTURAASIGNACION B ON (B.IDGASTOMAIN = A.IDGASTOMAIN AND B.IDCONCEPTO = A.IDCONCEPTO)
                    INNER JOIN RCVRY.CASEACCT C ON C.CCACCT = B.FCCREDITOCARTERA
                    INNER JOIN RCVRY.CASE D ON D.CECASENO = C.CCCASENO 
                    WHERE A.IDGASTOMAIN = $idCaso     
                    GROUP BY B.VERETAPAFIN, B.FCCREDITOCARTERA,B.IDCONCEPTO,D.CESTATUS,B.FCJUSTIFICACIONALERTA";

            $Oracle = Pendum_Db_DbFactory::factory('oracle');
            $items = $Oracle->query($query);
            //Procedo a parsear las justificaciones
            foreach($items as $ind=>$i){
                $patron = preg_split("/[|]+/", $i['JUSTIFICACION']);
                unset($patron[0]);//elimino la primera posicion por ser un array vacio
                foreach ($patron as $indB=>$p){
                    $substring = substr($p, 10);
                    $result[$indB] = preg_split("/[]]+/", $substring);
                    $justificacion[$result[$indB][0]] = $result[$indB][1];

                }
                if(isset($justificacion)){
                    $items[$ind]['JUSTIFICACIONES']=$justificacion;
                }else{
                    $items[$ind]['JUSTIFICACIONES']='';
                }


            }
            return $items;
        }else{
            //Procedo a parsear las justificaciones
            foreach($items as $ind=>$i){
                $patron = preg_split("/[|]+/", $i['JUSTIFICACION']);
                unset($patron[0]);//elimino la primera posicion por ser un array vacio
//                echo '<pre>';print_r($patron);exit;
                foreach ($patron as $indB=>$p){
                    $substring = substr($p, 10);
                    $result[$indB] = preg_split("/[]]+/", $substring);
                    $justificacion[$result[$indB][0]] = $result[$indB][1];

                }

                if(isset($justificacion)){
                    $items[$ind]['JUSTIFICACIONES']=$justificacion;
                }else{
                    $items[$ind]['JUSTIFICACIONES']='';
                }
//                echo '<pre>';print_r($items[$ind]['JUSTIFICACIONES'][66]);exit;
            }
            return $items;
        }


    }

    public function getAlertaFechaAprobacionFechaFinEtapa($idCaso,$idJuicio,$etapas)
    {
        $query = "SELECT CASE WHEN (FECHA_TERMINO_ETAPA < FECHA_AUTORIZACION) THEN '<b style=''color: red; font-size: 15px;''>&#10008;</b>' ELSE '<b style=''color: green; font-size: 15px;''>&#10004;</b>' END ALERTA,FECHA_AUTORIZACION,FECHA_TERMINO_ETAPA, NUMERO_ETAPA  from(
                    SELECT MAX(A.FECHA_TERMINO) FECHA_TERMINO_ETAPA, 
                    /*(SELECT MAX(A.FDFECAUTORIZA) FECHA_AUTORIZACION FROM PENDUPM.FACTURACIONAUT A WHERE A.IDGASTOMAIN = $idCaso AND A.IDTIPOAUTORIZA = 45 AND A.FCCREDITOCARTERA = 'ETAPA PROC FINAL' AND A.FCRESULTADO = 'Autorizado')FECHA_AUTORIZACION,*/
                    (SELECT MAX(A.FDFECREGISTRO ) FECHA_AUTORIZACION FROM PENDUPM.FACTURACIONBITACORA A WHERE A.IDGASTOMAIN = $idCaso AND A.NMETAPA = 'AUTORIZACIONES DEL GASTO')FECHA_AUTORIZACION,
                    A.NUMERO_ETAPA
                    FROM OPERACION.VW_ELP_ETAPAS_LEGALES A WHERE A.NUMERO_JUICIO = $idJuicio AND A.NUMERO_ETAPA IN ($etapas) GROUP BY A.NUMERO_ETAPA
                  )
                  WHERE FECHA_TERMINO_ETAPA < FECHA_AUTORIZACION";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
    }

    public function updateJustificacionAlerta($datos)
    {
        $query = "BEGIN UPDATE PENDUPM.FACTURAASIGNACION SET FCJUSTIFICACIONALERTA = '".$datos['FCJUSTIFICACIONALERTA']."' WHERE IDGASTOMAIN='".$datos['IDGASTOMAIN']."' AND FCCREDITOCARTERA='".$datos['FCCREDITOCARTERA']."';COMMIT;END;";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->queryupdate($query);
        return $items;
    }

    public function getAsignacion($datos)
    {
        $query = "SELECT * FROM PENDUPM.FACTURAASIGNACION A WHERE A.IDGASTOMAIN = $datos[IDGASTOMAIN] AND A.FCCREDITOCARTERA = '$datos[FCCREDITOCARTERA]' AND A.IDCONCEPTO = $datos[IDCONCEPTO]";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $item = $Oracle->query($query);
        return $item;
    }

    public function procesoCargaMasiva($uuid, $IdDocumento, $datos){
        $query  = "SELECT * FROM PENDUPM.FACARGAMASIVA WHERE UUID = '".$uuid."'";
        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items  = $Oracle->query($query);
      if (count($items) > 0){
            $resultadoCargaMasiva['datosUsuario']['nombre'] = $items[0]['NOM_USUARIO'];
            $resultadoCargaMasiva['datosCoprobante']['fecha'] = $items[0]['FECHA_REGISTRO'];
            $resultadoCargaMasiva['datosCoprobante']['validaUUID'] = true;
        }else{ //Proceso para Insert y Update

            if (count($IdDocumento)>0){
                //Proceso Insert
                foreach ($IdDocumento as $key=> $filas){
                    $query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.INSERTCARGAMASIVAFACTURA('" . $uuid . "', '" . $IdDocumento[$key] . "', '" . $datos['idUsuario'] . "', '" . $datos['nomUsuario'] . "', '" . $datos['archivo'] . "',:psError); COMMIT; END;";
                    $Oracle->set($query);
                }
                //Proceso Update
                foreach ($IdDocumento as $key=> $filas){
                        $query_select   = "SELECT A.ID_FACARGAMASIVA FROM PENDUPM.FACARGAMASIVA A WHERE A.ID_DOCUMENTO = '".$IdDocumento[$key]."'";
                        $items_facarga  = $Oracle->query($query_select);

                        $querry_update  = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA  SET ID_FACARGAMASIVA = '".$items_facarga[0]['ID_FACARGAMASIVA']."' WHERE UUID = '".$IdDocumento[$key]."'; COMMIT;END;";
                        $Oracle->queryupdate($querry_update);

                        $querry_update_p  = "BEGIN UPDATE PENDUPM.COMPROBACIONGASTO  SET ID_FACARGAMASIVA = '".$items_facarga[0]['ID_FACARGAMASIVA']."' WHERE FCUUID = '".$IdDocumento[$key]."'; COMMIT;END;";
                        $Oracle->queryupdate($querry_update_p);
                }
            }
            $resultadoCargaMasiva['datosCoprobante']['nombreArchivo'] = $datos['nomArchivoOriginal'];
            $resultadoCargaMasiva['datosCoprobante']['validaUUID'] = false;
      }
        return $resultadoCargaMasiva;
   }

    public function procesoBusqueda($param, $type){
    //      $filtro = ' WHERE A.IDGASTOMAIN > 0';
    //      $filtro = ' WHERE A.ID_FACARGAMASIVA IS NULL ';
    $filtro = ' WHERE A.ID_FACARGAMASIVA  > 0';

        if ( empty($param['numGasto']) == false ){  $filtro .=   " AND A.IDGASTOMAIN = ".$param['numGasto']; }
        if ( empty($param['NomUsuario']) == false  ){ $filtro .= " AND B.IDSOLICITANTE = '".$param['NomUsuario']."'";}
        if ( empty($param['Proveedor']) == false  ){ $filtro .=  " AND B.IDPROVEEDORGTO = '".$param['Proveedor']."'";}
        if ( empty($param['numCredito']) == false  ){ $filtro .= " AND E.FCCREDITOCARTERA ='".$param['numCredito']."'";}
        if ( empty($param['numAutorizador']) == false ){ $filtro .= " AND  ";}

        $query = "SELECT B.IDGASTOMAIN AS CASO
                      , C.NMCONCEPTO AS CONCEPTO
                      , B.FDFECREGISTRO AS FECHA_REGISTRO
                      , D.NMPROVEEDOR AS NMPROVEEDOR
                      , FCARCHIVOXML AS XML_INDI
                      , (SELECT AA.URL_XML FROM PENDUPM.FACARGAMASIVA AA WHERE AA.ID_FACARGAMASIVA = A.ID_FACARGAMASIVA ) XML_MASIVO
                      , (SELECT AA.ID_FACARGAMASIVA FROM PENDUPM.FACARGAMASIVA AA WHERE AA.ID_FACARGAMASIVA = A.ID_FACARGAMASIVA ) AS REPORTE
                      , E.FCCREDITOCARTERA
                    FROM PENDUPM.FACTURACIONCOMPROBA A 
         INNER JOIN PENDUPM.FACTURACIONMAIN B ON A.IDGASTOMAIN = B.IDGASTOMAIN
         INNER JOIN PENDUPM.CTCATALOGOCUENTAS C ON B.IDCONCEPTO = C.IDCONCEPTO 
         INNER JOIN PENDUPM.CTPROVEEDORGASTO D ON D.IDPROVEEDORGTO = B.IDPROVEEDORGTO
         INNER JOIN PENDUPM.FACTURAASIGNACION E ON E.IDGASTOMAIN = B.IDGASTOMAIN   ".$filtro;

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $arregloTemp = $Oracle->query($query);

        if ($type == 'Json'){
            foreach($arregloTemp as $key => $filas){
            $response['rows'][$key]['id'] = $key;
            $response['rows'][$key]['cell'] = array(
                $item['CASO']  = $filas['CASO'],
                $item['CUENTA'] = $filas['FCCREDITOCARTERA'],
                $item['CONCEPTO'] = $filas['CONCEPTO'],
                $item['FECHA_REGISTRO'] = $filas['FECHA_REGISTRO'],
                $item['NMPROVEEDOR'] = $filas['NMPROVEEDOR'],
                $item['XML_INDI'] = "<a href='".$filas['XML_INDI']."' target='_blank'> Ver </a>",
                $item['XML_MASIVO'] = (empty($filas['REPORTE'])==true)? 'No': "<a href='".$filas['XML_MASIVO']."' target='_blank'> Ver </a>",
                $item['REPORTE'] =   ( empty($filas['REPORTE'])==true)? 'No':'Si',
            );
        }//fin del for
            return $response;
        }else{
            return $arregloTemp;
        }
    }

    public function procesoBusquedapv($param, $type){
        $filtro = ' WHERE A.IDGASTO > 0';
        $filtroB = '';
        if ( empty($param['numGasto']) == false ){  $filtro .=   " AND A.IDGASTO = ".$param['numGasto']; }
        if ( empty($param['NomUsuario']) == false  ){ $filtroB = " INNER JOIN PENDUPM.CTUSUARIOS  B ON B.FCCLAVEQUASAR = A.IDEMPLEADO AND B.NMNOMBRE LIKE '%".$param['NomUsuario']."%'";  }

        $query = "SELECT 
                        A.IDGASTO AS CASO 
                        , A.FCFACTURAXML AS XML_INDI
                        , A.IDEMPLEADO
                        , (SELECT AA.URL_XML FROM PENDUPM.FACARGAMASIVA AA WHERE AA.ID_FACARGAMASIVA = A.ID_FACARGAMASIVA ) XML_MASIVO
                        , (SELECT AA.ID_FACARGAMASIVA FROM PENDUPM.FACARGAMASIVA AA WHERE AA.ID_FACARGAMASIVA = A.ID_FACARGAMASIVA ) AS REPORTE
                        , (SELECT AA.NMNOMBRE FROM PENDUPM.CTUSUARIOS AA WHERE AA.FCCLAVEQUASAR = A.IDEMPLEADO ) AS  NOMBRE_SOLICITANTE
                      FROM PENDUPM.COMPROBACIONGASTO A
                          ".$filtroB."
                           ".$filtro;

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $arregloTemp = $Oracle->query($query);

        if ($type == 'Json'){
            foreach($arregloTemp as $key => $filas){
            $response['rows'][$key]['id'] = $key;
            $response['rows'][$key]['cell'] = array(
                $item['CASO']  = $filas['CASO'],
                $item['NOMBRE_SOLICITANTE'] = $filas['NOMBRE_SOLICITANTE'],
                $item['XML_INDI'] = "<a href='".$filas['XML_INDI']."' target='_blank'> Ver </a>",
                $item['XML_MASIVO'] = (empty($filas['REPORTE'])==true)? 'No': "<a href='".$filas['XML_MASIVO']."' target='_blank'> Ver </a>",
                $item['REPORTE'] = (empty($filas['REPORTE'])==true)? 'No':'Si',
            );
        }//fin del for
            return $response;
        }else{
            return $arregloTemp;
        }
    }


    public function procesoCargaIndividual($IdDocumento){
        $Oracle = Pendum_Db_DbFactory::factory('oracle');

        $query_select   = "SELECT A.ID_FACARGAMASIVA FROM PENDUPM.FACARGAMASIVA A WHERE A.ID_DOCUMENTO = '".$IdDocumento."'";
        $items_facarga  = $Oracle->query($query_select);

        if (empty($items_facarga[0]['ID_FACARGAMASIVA']) == false){
            $querry_update  = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA  SET ID_FACARGAMASIVA = '".$items_facarga[0]['ID_FACARGAMASIVA']."' WHERE UUID = '".$IdDocumento."'; COMMIT;END;";
            $Oracle->queryupdate($querry_update);

            $querry_update_p  = "BEGIN UPDATE PENDUPM.COMPROBACIONGASTO  SET ID_FACARGAMASIVA = '".$items_facarga[0]['ID_FACARGAMASIVA']."' WHERE FCUUID = '".$IdDocumento."'; COMMIT;END;";
            $Oracle->queryupdate($querry_update_p);
        }
    }

    public function procesoBusquedaTareas($param){
        $query = "SELECT A.`APP_UID`, A.`DEL_INDEX`, A.`USR_UID`, A.`TAS_UID`, A.`APP_TAS_TITLE`, A.`APP_CURRENT_USER` 
                    FROM wf_workflow.APP_CACHE_VIEW AS A  
                   WHERE A.APP_NUMBER = ". $param['NumCaso'] ." ORDER BY A.DEL_INDEX ";
        $ConnMysql = Pendum_Db_DbFactory::factory('mysql');
        $items_facarga  = $ConnMysql->query($query);

        $query = "SELECT * FROM PENDUPM.FACTURACIONMAIN GAS WHERE GAS.IDGASTOMAIN = '". $param['NumCaso'] ."' AND GAS.FCSTATUS = 'F'";
        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $arregloTemp = $Oracle->query($query);

        if( count($arregloTemp) > 0 ){
            $response = "<div class='alert alert-danger' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Alerta:</span>Este caso esta finalizado, se sugiere comunicarse con sistemas.</div>";
        }else{
            if( count($items_facarga) > 0 ){
                $response ='<div class="panel panel-default">';
                $response .='<div class="panel-heading">Listado de Tareas</div>';
                $response .='<table class="table">';
                $response .='<thead>';
                $response .='<tr><th>No</th>';
                $response .='<th>Nombre Tarea</th>';
                $response .='<th>Responsable</th>';
                $response .='<th>Acción</th>';
                $response .='</tr>';
                $response .='</thead>';
                $response .='<tbody>';

                foreach ($items_facarga as $key => $filas){
                    $key ++;
                    $response .='<tr>';
                    $response .='<th scope="row">'.$key.'</th>';
                    $response .='<th>'.utf8_encode($filas['APP_TAS_TITLE']).'</th>';
                    $response .='<th>'.utf8_encode($filas['APP_CURRENT_USER']).' </th>';
                    $response .='<th>'.$this->muestraBotonAccion($filas, 'VERIF COMPROBANTES FISCALES').'</th>';
                    $response .='</tr>';
                }
                $response .='</tbody>';
                $response .='</table>';
                $response .='</div>';

            }else{
                $response = false;
            }
        }


        return $response;
    }

    function muestraBotonAccion($arreglo, $compara){
        if ($arreglo['APP_TAS_TITLE'] == $compara){
            return $boton = '<button  data-app_uid="'.$arreglo['APP_UID'].'" data-app_usr="'.$arreglo['USR_UID'].'" data-app_tas="'.$arreglo['TAS_UID'].'" data-index="'.$arreglo['DEL_INDEX'].'"  type="button" class="btn btn-success btnRegresarTarea">Regrear</button>';
        }else{
            return 'No aplica!';
        }
        //id="btnRegresarTarea" name="btnRegresarTarea"
    }

    function procesoRegresarTareasIndex($param){
        //Guardo en un Log el Historial
        $query = "SELECT * FROM wf_workflow.APP_CACHE_VIEW AS A WHERE A.APP_NUMBER = ".$param['NumCaso'];
        $ConnMysql = Pendum_Db_DbFactory::factory('mysql');
        $items_logs  = $ConnMysql->query($query);
        $data = '-------------------------************* DATE -> '.date('d/m/y').' *****************---------------------';

        $f = fopen('/var/www/gastosfact/' . 'logs/RegresarTareaComproFiscal.log',"a+");
        fputs($f,$data . print_r($items_logs,true)."\r\n") or die("no se pudo crear o insertar el fichero");
        fclose($f);


        $query = "UPDATE wf_workflow.APPLICATION SET APP_STATUS = 'TO_DO', APP_FINISH_DATE = NULL  WHERE APP_NUMBER = ".$param['NumCaso'];
        $ConnMysql = Pendum_Db_DbFactory::factory('mysql');
        $items_facarga  = $ConnMysql->set($query);

        //Abro Tarea de Comprobante Fiscal
        // $query = "SELECT * FROM wf_workflow.APP_DELEGATION AS A WHERE A.APP_UID = '".$param['APP_UID']."' AND A.DEL_INDEX = ".$param['APP_INDEX']." AND A.TAS_UID = '".$param['APP_TAS']."' AND A.USR_UID ='".$param['APP_USR']."'";
        $query = "UPDATE wf_workflow.APP_DELEGATION  SET  `DEL_THREAD_STATUS`= 'OPEN', `DEL_FINISH_DATE` = NULL, DEL_LAST_INDEX = 1  WHERE APP_UID = '".$param['APP_UID']."' AND DEL_INDEX = ".$param['APP_INDEX']." AND TAS_UID = '".$param['APP_TAS']."' AND USR_UID ='".$param['APP_USR']."'";
        $ConnMysql = Pendum_Db_DbFactory::factory('mysql');
        $items_facarga  = $ConnMysql->set($query);

        //Elimino las tareas que estan por delante de el CF
        //Elimino Datos APP_DELEGATION
        //   $query2 = "SELECT * FROM wf_workflow.APP_DELEGATION AS A WHERE A.APP_UID = '".$param['APP_UID']."' AND A.DEL_INDEX > ".$param['APP_INDEX'];
        $query2 = "DELETE FROM wf_workflow.APP_DELEGATION  WHERE APP_UID = '".$param['APP_UID']."' AND DEL_INDEX > ".$param['APP_INDEX'];
        $ConnMysql = Pendum_Db_DbFactory::factory('mysql');
        $items_facarga  = $ConnMysql->set($query2);

        //Elimino Datos APP_CACHE_VIEW
        //$query = "SELECT * FROM wf_workflow.`APP_CACHE_VIEW` AS A WHERE A.APP_UID = '".$param['APP_UID']."' AND A.DEL_INDEX > ".$param['APP_INDEX'];
        $query = "DELETE FROM wf_workflow.APP_CACHE_VIEW  WHERE APP_UID = '".$param['APP_UID']."' AND DEL_INDEX > ".$param['APP_INDEX'];
        $ConnMysql = Pendum_Db_DbFactory::factory('mysql');
        $items_facarga  = $ConnMysql->set($query);


        //Elimino Datos APP_CACHE_VIEW
        //   $query = "SELECT * FROM PENDUPM.FACTURACIONBITACORA A WHERE A.IDGASTOMAIN = '".$param['NumCaso']."' AND A.DEL_INDEX > ".$param['APP_INDEX'];
        $query = "BEGIN UPDATE  PENDUPM.FACTURACIONMAIN SET FCSTATUS = 'D' WHERE IDGASTOMAIN = '".$param['NumCaso']."' AND FCSTATUS = 'F'; UPDATE PENDUPM.FACTURACIONBITACORA SET  FCRESULTADO = '', FCCOMENTARIOS=''  WHERE IDGASTOMAIN = '".$param['NumCaso']."' AND DEL_INDEX = ".$param['APP_INDEX']."; DELETE FROM PENDUPM.FACTURACIONBITACORA A WHERE A.IDGASTOMAIN = '".$param['NumCaso']."' AND A.DEL_INDEX > ".$param['APP_INDEX']."; COMMIT;END;";
        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $item = $Oracle->queryupdate($query);


        $mensajeProcess = "<div class='alert alert-danger' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Error:</span>Falla al Regresar Tarea</div>";
        if ( count($item) > 0  ){
            $mensajeProcess = "<div class='alert alert-success' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Éxito:</span>Se realizó. el cambio exitosamente.</div>";
        }
        return $mensajeProcess;
    }

	public function updateUUIDxml( $solicitudid, $comprobanteId, $uuid, $rfcemisor, $path )
	{
		$query = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA 
		                   SET UUID = '$uuid',
		                      FCRFC = '$rfcemisor',
		                     FCARCHIVOXML = '$path',
		                     FDARCHIVOXML = SYSDATE
		                 WHERE IDGASTOMAIN = $solicitudid AND IDCOMPROBACION = $comprobanteId; COMMIT;END;";
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->queryupdate($query);
        return $res;
	}



}