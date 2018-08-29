<?php
class Gastos_Model_Autorizacion
{
	public function getAlarmaGasto( $idGasto, $idUsuario )
	{
		$query = "BEGIN PENDUPM.PCKGASTOLIB.GETALARMAGASTO(" . $idGasto . "," . $idUsuario . ", :RESDATA); END;";
		//echo $query;//exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getQueUsuarioEs( $idEmpleado )
	{
		$query = "SELECT PENDUPM.PCKGASTOLIB.QUEUSUARIOES(" . $idEmpleado . ") AS NOMBRE FROM DUAL";
		//echo $query;exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $item = $Oracle->query($query);
        return $item[0]['NOMBRE'];
	}

	public function getClaveCyber( $idEmpleado )
	{
		$query = "SELECT CLCOLLID FROM RCVRY.COLLID WHERE CLIDNUM = " . $idEmpleado . " AND CLSTATUS <> '3'";
		//echo $query;exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $item = $Oracle->query($query);
        return $item[0]['CLCOLLID'];
	}

	public function getDetallGasto( $idGasto )
	{
		$query = "SELECT '--> '||(SELECT NMDESCRIP  FROM PENDUPM.CTCUENTACATEGORIA C 
        WHERE C.IDCUENTACAT = (SELECT IDCATEGORIA FROM PENDUPM.CTCATALOGOCUENTAS H WHERE A.IDCONCEPTO = H.IDCONCEPTO))||'<BR/>'||
    '--> '||(SELECT NMDESCRIP  FROM PENDUPM.CTCUENTACATEGORIA C 
        WHERE C.IDCUENTACAT = (SELECT IDSUBCATEGORIA FROM PENDUPM.CTCATALOGOCUENTAS H WHERE A.IDCONCEPTO = H.IDCONCEPTO))||'<BR/>'||
    '--> '||(SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS B WHERE B.IDCONCEPTO = A.IDCONCEPTO) CATEGSUBCAT, 
                    CASE WHEN FCQUEUMBRAL > 0 THEN 'SI' ELSE '' END UMBRAL, 
                    CASE WHEN FNPAGODOBLE > 0 THEN 'SI' ELSE '' END PAGODOBLE, 
                    CASE WHEN VERETAPACDACHKNO IS NOT NULL OR VERETAPAABIERTANO IS NOT NULL THEN 'SI' ELSE '' END ETAPAS,
                    CASE WHEN VERETAPACDACHKNO IS NOT NULL THEN 'SI ABIERTA' ELSE '' END ETAPASAB,
                    CASE WHEN VERETAPAABIERTANO IS NOT NULL THEN 'SI CERRADA' ELSE '' END ETAPASCR,
                    CASE WHEN ( SELECT COUNT(1) FROM PENDUPM.FACTURACIONAUT WHERE IDGASTOMAIN = A.IDGASTOMAIN AND IDTIPOAUTORIZA = 45 ) > 0 THEN 'SI ETAPA FINAL' ELSE '' END ETAPAFINAL,
                    CASE WHEN FCCODACCEXTNO IS NOT NULL OR FCCODRESEXTNO IS NOT NULL THEN 'SI' ELSE '' END CODIGO,
                    (SELECT COUNT(1) FROM PENDUPM.FACTURADCINICIO WHERE IDGASTOMAIN = A.IDGASTOMAIN AND FCCREDITO = A.FCCREDITOCARTERA AND IDCONCEPTO = A.IDCONCEPTO) DOCINICIO,
                    (SELECT COUNT(1) FROM PENDUPM.FACTURADCSOPORTE WHERE IDGASTOMAIN = A.IDGASTOMAIN AND FCCREDITO = A.FCCREDITOCARTERA AND IDCONCEPTO = A.IDCONCEPTO) DOCSOPORTE,
       (SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS B WHERE B.IDCONCEPTO = A.IDCONCEPTO) CONCEPTO, IDCONCEPTO, FCCREDITOCARTERA, FNIMPORTE, FCDETALLECREDITO,
    FCESFACTURABLE ESFACTURABLE, 
    FCESREEMBOLSABLE ESREEMBOLSABLE,
    (CASE WHEN ALERTAFECHAEJECCOMENTARIO IS NOT NULL THEN 'SI' ELSE '' END) FECHAEJECUCION,
    (CASE WHEN ALERTASIGNACOMENTARIO IS NOT NULL THEN 'SI' ELSE '' END) ASIGNACION,
    PENDUPM.PCKCONVENIOS.formatComas(NVL(FNIMPORTE,0)) IMPORTE,
    CASE WHEN IDTIPOMOVTO IN (2,3) THEN
                (SELECT NMCENTROCOSTO FROM PENDUPM.CENTROCOSTOGASTO where IDCATEGORIA = 3 AND FCSTATUS = 'A' AND NMCENTROCOSTO = FCCENTROCOSTOS)
                WHEN IDTIPOMOVTO IN (42,4) THEN
                (SELECT NMCENTROCOSTO FROM PENDUPM.CENTROCOSTOGASTO where IDCATEGORIA IN (1,2,5,6,7,8,9) AND FCSTATUS = 'A' AND IDCENTROCOSTO = FCCENTROCOSTOS)
                ELSE
                'NA'
                END FCCENTROCOSTOS
FROM PENDUPM.FACTURAASIGNACION A 
WHERE IDGASTOMAIN =" . $idGasto;
		//echo $query;exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getPagoDobleDetalle( $idgasto, $credito, $idconcepto)
	{
		$query = "SELECT CASE WHEN FNPAGODOBLE>0 THEN 'S' ELSE 'N' END ISPAGO 
                  FROM PENDUPM.FACTURAASIGNACION F 
                  WHERE F.FCCREDITOCARTERA='$credito' AND IDCONCEPTO=$idconcepto AND IDGASTOMAIN = $idgasto";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getAlarmaDetalle( $idGasto, $tipoAlarma, $idUsuario )
	{
		$query = "BEGIN PENDUPM.PCKGASTOLIB.GETALARMAGASTOTIPO(".$idGasto;
		$query.= "," . $tipoAlarma . "," . $idUsuario . ", :RESDATA); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function addAutorizacion( $data )
	{
		$cadenaNombre = $data['nombre'];
		$arrayNombre = explode("_", $cadenaNombre);
		$idGasto = $arrayNombre[0];
		$idAlarma = $arrayNombre[1];
		$idConcepto = $arrayNombre[2];
		$idCredito = $arrayNombre[3];
		$idUsuario = $arrayNombre[4];
		//$fechaRegistro = $arrayNombre[5];
		$fechaRegistro = isset($arrayNombre[5])?$arrayNombre[5]:'';
		$valor = $data['valor'];
		
		$query = "BEGIN PENDUPM.PCKGASTOLIB.SETAUTORIZARESULTADO($idGasto, $idAlarma, '$idCredito', $idConcepto, $idUsuario, '$valor','$fechaRegistro', :psError); END;";
    	
		//echo $query;exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function addComentario( $data )
	{
		$cadenaNombre = $data['nombre'];
		$arrayNombre = explode("_", $cadenaNombre);
		
		$idGasto = $arrayNombre[1];
		$idAlarma = $arrayNombre[2];
		$idConcepto = $arrayNombre[3];
		$idCredito = $arrayNombre[4];
		$idUsuario = $arrayNombre[5];
		$fechaRegistro = $arrayNombre[6];
		
		$valor = $data['valor'];
		
		$query = "BEGIN PENDUPM.PCKGASTOLIB.SETAUTORIZACOMENTARIO($idGasto, $idAlarma, '$idCredito', $idConcepto, $idUsuario, '$valor', '$fechaRegistro', :psError); END;";
    	
		//echo $query;exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}

	public function getComentariosAut( $idGasto, $idUsuario )
	{
		/*
		$query = "SELECT FCAUTORIZADOR,FCUSUARIOAUTORIZA,IDTIPOAUTORIZA,FDFECAUTORIZA, FCRESULTADO, FCCOMENTARIO02 COMENTARIO FROM PENDUPM.FACTURACIONAUT";
		$query .= " WHERE IDGASTOMAIN = " . $idGasto;
		$query .= " AND FCUSUARIOAUTORIZA = " . $idUsuario;
		$query .= " AND FDFECAUTORIZA IS NOT NULL ORDER BY FDFECAUTORIZA ASC";
		*/
		$query = "SELECT (SELECT NMDESCRIPCION FROM PENDUPM.CTCATALOGOGASTOS G WHERE G.IDCATGASTO = A.IDTIPOAUTORIZA)  TIPOAUTORIZA,
            	PENDUPM.PCKENVIOCORREO.aplFecha(FDFECREGISTRO) FECSOLICITUD,
           	 CASE WHEN IDTIPOAUTORIZA = 6 THEN (SELECT DISTINCT FCJUSTIFICACIONUMBRAL FROM PENDUPM.FACTURAASIGNACION X WHERE A.IDGASTOMAIN = X.IDGASTOMAIN AND FCJUSTIFICACIONUMBRAL IS NOT NULL AND ROWNUM = 1)
                 WHEN IDTIPOAUTORIZA = 7 THEN (SELECT DISTINCT FCJUSTIFICAETAPA FROM PENDUPM.FACTURAASIGNACION X WHERE A.IDGASTOMAIN = X.IDGASTOMAIN AND FCJUSTIFICAETAPA IS NOT NULL AND ROWNUM = 1)
                 WHEN IDTIPOAUTORIZA = 8 THEN (SELECT DISTINCT FCJUSTIFICAPAGODBL FROM PENDUPM.FACTURAASIGNACION X WHERE A.IDGASTOMAIN = X.IDGASTOMAIN AND FCJUSTIFICAPAGODBL IS NOT NULL AND ROWNUM = 1)
                 WHEN IDTIPOAUTORIZA = 9 THEN 'NO APLICA'
                 WHEN IDTIPOAUTORIZA = 10 THEN (SELECT DISTINCT FCJUSTIFICAEMPRESA FROM PENDUPM.FACTURAASIGNACION X WHERE A.IDGASTOMAIN = X.IDGASTOMAIN AND FCJUSTIFICAEMPRESA IS NOT NULL AND ROWNUM = 1)
                 WHEN IDTIPOAUTORIZA = 34 THEN (SELECT DISTINCT FCJUSTIFICAURGENTE FROM PENDUPM.FACTURAASIGNACION X WHERE A.IDGASTOMAIN = X.IDGASTOMAIN AND FCJUSTIFICAURGENTE IS NOT NULL AND ROWNUM = 1)
                 WHEN IDTIPOAUTORIZA = 41 THEN 'VERIFICACION DE DOCTOS SOPORTE'
                 WHEN IDTIPOAUTORIZA = 44 THEN (SELECT DISTINCT FCJUSTIFICAEXCGASTO FROM PENDUPM.FACTURAASIGNACION X WHERE A.IDGASTOMAIN = X.IDGASTOMAIN AND FCJUSTIFICAEXCGASTO IS NOT NULL AND ROWNUM = 1)
                 WHEN IDTIPOAUTORIZA = 45 THEN (SELECT DISTINCT FCJUSTIFICETAFINAL FROM PENDUPM.FACTURAASIGNACION X WHERE A.IDGASTOMAIN = X.IDGASTOMAIN AND FCJUSTIFICETAFINAL IS NOT NULL AND ROWNUM = 1)
                 WHEN IDTIPOAUTORIZA = 64 THEN (SELECT DISTINCT FCCOMENTARIO FROM PENDUPM.ASIGNACIONCOMENTA Z WHERE A.IDGASTOMAIN = Z.IDGASTOMAIN   AND A.FCCREDITOCARTERA = Z.FCCREDITOCARTERA AND Z.IDTIPOALARMA = A.IDTIPOAUTORIZA AND Z.FCCOMENTARIO IS NOT NULL AND ROWNUM = 1)
                 WHEN IDTIPOAUTORIZA = 65 THEN (SELECT DISTINCT FCCOMENTARIO FROM PENDUPM.ASIGNACIONCOMENTA Z WHERE A.IDGASTOMAIN = Z.IDGASTOMAIN   AND A.FCCREDITOCARTERA = Z.FCCREDITOCARTERA AND Z.IDTIPOALARMA = A.IDTIPOAUTORIZA AND Z.FCCOMENTARIO IS NOT NULL AND ROWNUM = 1)
            	END  JUSTIFICACION,
            	FCAUTORIZADOR AUTORIZADOR,
            	(
            	SELECT \"nombreCompleto\" NOMBRE FROM PENDUPM.VISTAASOCIADOSCOMPLETA WHERE \"email\" = FCAUTORIZADOR AND \"cvetra\" = (SELECT MAX(\"cvetra\") FROM PENDUPM.VISTAASOCIADOSCOMPLETA WHERE \"email\" = FCAUTORIZADOR )
            	) NOMBREAUTORIZA,
            	NVL(FCRESULTADO,'')  RESULTADO,
            	PENDUPM.PCKENVIOCORREO.aplFecha(FDFECAUTORIZA) FECAUTORIZA,
            	NVL(FCCOMENTARIO02,'') COMEAUTORIZA
       	FROM PENDUPM.FACTURACIONAUT A
      		WHERE IDGASTOMAIN = $idGasto
     		AND FCRESULTADO != '----------'
   		ORDER BY IDDELINDEX,IDCONSEC";
		//echo $query;exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function setFormatAuto( $idGasto, $idSolic, $taskId, $delIndex )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setFormatAutorizadores($idGasto, $idSolic, '$taskId', $delIndex, :psError); END;";
    	
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function setFormatAutoTramite( $idGasto )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setFormatAutorizadoresTramite($idGasto, :psError); END;";
    	
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function setAutoJefeInmed( $idGasto, $idSolic, $taskId, $delIndex )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setAutJefeInmediato($idGasto, $idSolic, '$taskId', $delIndex, :psError); END;";
    	
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function setAutoEtapaProc( $idGasto, $idSolic, $taskId, $delIndex )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setAutEtapaProcesal($idGasto, $idSolic, '$taskId', $delIndex, :psError); END;";
    	
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function setAutoPagoDoble( $idGasto, $idSolic, $taskId, $delIndex )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setAutPagoDoble($idGasto, $idSolic, '$taskId', $delIndex, :psError); END;";
    	
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function setAutStatusCola( $idGasto, $idSolic, $taskId, $delIndex )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setAutStatusCola($idGasto, $idSolic, '$taskId', $delIndex, :psError); END;";
    	
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function setAutProjectManager( $idGasto, $idSolic, $taskId, $delIndex )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setAutProjectManager($idGasto, $idSolic, '$taskId', $delIndex, :psError); END;";
    	
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function setAutNoFacturable( $idGasto, $idSolic, $taskId, $delIndex )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setAutNoFacturable($idGasto, $idSolic, '$taskId', $delIndex, :psError); END;";
    	
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function setAutoEmpresa( $idGasto, $idSolic, $taskId, $delIndex )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setAutEmpresa($idGasto, $idSolic, '$taskId', $delIndex, :psError); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function calculaAutUmbrales( $idGasto ) {
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.calculaAutUmbrales($idGasto, :psError); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function setAutUmbrales( $idGasto, $idSolic, $taskId, $delIndex )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setAutUmbrales($idGasto, $idSolic, '$taskId', $delIndex, :psError); END;";
    	
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
	public function setDuplicaAutor( $idGasto, $mailRechazo, $emailToRechazo, $delIndex, $resultAutoriza, $comentario )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.setDuplicaAutor($idGasto, '$mailRechazo', '$emailToRechazo', $delIndex , '$resultAutoriza', '$comentario',  :psError); END;";
    	//echo $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->set($query);
        return $res;
	}
	
}