<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Gastos_Model_Detalle 
{
	public function getAdminPermiso ($usr) {
    	$query = "SELECT COUNT(1) ADMIN FROM `GROUP_USER` 
    	           WHERE USR_UID LIKE '$usr' AND GRP_UID IN (SELECT UID_GROUP
                 FROM  pendu_pm.pendu_category_group
              WHERE NMSYSTEM IN ('GASTOS','MIPENDULUM')
                 AND TYPE IN ('ADMIN','ADMIN_DETALLE') AND STATUS = 1 )";

    	$PM = Pendum_Db_DbFactory::factory('mysql');
        $data = $PM->getAll($query);
        return $data;
    }
    
	public function getInfoUserPM($usr='',$mail='') {
		
		if ($usr!='') {
			$filtro = "USR_UID = '$usr'";
		}
		
		if ($mail!='') {
			$filtro = "USR_EMAIL = '$mail'";
		}
		
    	$query = "SELECT USR_UID,USR_USERNAME, USR_EMAIL FROM USERS 
    	           WHERE $filtro AND USR_STATUS =  'ACTIVE'";
 
    	$PM = Pendum_Db_DbFactory::factory('mysql');
        $data = $PM->getAll($query);
        return $data;
    }
    
	public function getInfoUserAll ($email) {
    	$query = "SELECT CLCOLLID, CLIDNUM FROM rcvry.COLLID cols 
    	           WHERE CLMAIL LIKE '$email' AND CLSTATUS = 2";
    	
    	$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
    }
    
    
	public function getInfoGeneral($idgasto)
	{
		$query = "SELECT PCKENVIOCORREO.aplFecha(FDFECREGISTRO) FECHAALTA, FCSTATUS STATUS,
		     (SELECT NMEMPRESA
                FROM EMPRESAFACTURACION
               WHERE IDEMPRESA = ( CASE
                     WHEN A.IDEMPRESAFACTURACION = 0 THEN A.IDOTEMPRESAFACTURACION
                     WHEN (A.IDEMPRESAFACTURACION != 0 OR A.IDEMPRESAFACTURACION IS NOT NULL) THEN A.IDEMPRESAFACTURACION
                     END )
             ) EMPFACTURA,
             (SELECT NMDESCRIPCION
                FROM CTCATALOGOGASTOS G
               WHERE G.IDCATGASTO = A.IDFORMAPAGO)||' - '||
                ( SELECT NMPROVEEDOR FROM CTPROVEEDORGASTO F WHERE F.IDPROVEEDORGTO = A.IDPROVEEDORDEPOSITO )||
                         CASE WHEN A.IDFORMAPAGO = 38 THEN '<BR/>A nombre de : '||A.FCNMPAGOCHQCAJA END
             FORMAPAGO,
             (CASE WHEN FCTIPOCUENTA = '1' THEN 'Fiscal' ELSE 'No Fiscal' END) TPOCUENTA,
		     FNNUMEMPLEADO IDSOLICITANTE, FCSEVERIDADGASTO SEVERIDAD, 
		     (NVL (FNIMPORTESOLICITADO, 0)) IMPSOLICITADO,
		     (SELECT PCKENVIOCORREO.aplFecha (MAX(Z.FDFECPARAPAGO))
                FROM FACTURACIONPAGOS Z
               WHERE Z.IDGASTOMAIN = A.IDGASTOMAIN
                     AND FNCONSEC = ( CASE WHEN TPOMOVIMIENTO = 'Anticipo' THEN 2 
                                           WHEN TPOMOVIMIENTO = 'Reembolso' THEN 6
                                           WHEN TPOMOVIMIENTO = 'Tramite' AND FCPAGOADICIONAL = 'Anticipo' THEN 2 
                                           WHEN TPOMOVIMIENTO = 'Tramite' AND FCPAGOADICIONAL = 'Reembolso' THEN 6
                                      END )) FECMAXPAGO,
             (SELECT PCKENVIOCORREO.aplFecha (  FDFECDERIVACION
                                              + (SELECT MAX(TIEMPOMAXCOMPROBA) DIAS FROM PENDUPM.CTCATALOGOCUENTAS CT
                                                INNER JOIN PENDUPM.FACTURACIONMAIN FM ON CT.IDCONCEPTO = FM.IDCONCEPTO 
                                                WHERE IDGASTOMAIN = $idgasto))
                FROM FACTURACIONDEPOSITO X
               WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 2 AND FCSTATUS = 'A')
                FECCOMPDEP,
		     CASE WHEN (NVL (FNIMPORTEANTICIPO, 0) = 0 ) THEN 'NO REALIZADO' ELSE TO_CHAR(NVL(FNIMPORTEANTICIPO,0)) END ANTICIPO,
		     (CASE WHEN TPOMOVIMIENTO = 'Tramite' THEN  TPOMOVIMIENTO||' - Solucion '||NVL((SELECT FCTIPOSOLUCION  FROM FACTURATRAMITE F WHERE F.IDGASTOMAIN = A.IDGASTOMAIN),' en Proceso')
                  ELSE TPOMOVIMIENTO END) TPOMOVIMIENTO, 
		     FCCOMENTARIOSOLICITUD COMENTARIO, FCTIPOSOLUCION TIPOSOLUCION,
		     (SELECT NMDESCRIP FROM CTCUENTACATEGORIA B WHERE IDCUENTACAT = (SELECT IDCATEGORIA
                                                                               FROM CTCATALOGOCUENTAS C
                                                                              WHERE C.IDCONCEPTO = A.IDCONCEPTO)
             ) CATEGORIA,
             (SELECT NMDESCRIP FROM CTCUENTACATEGORIA B WHERE IDCUENTACAT = (SELECT IDSUBCATEGORIA
                                                                               FROM CTCATALOGOCUENTAS C
                                                                              WHERE C.IDCONCEPTO = A.IDCONCEPTO)
             ) SUBCATEGORIA,
             ( SELECT NMCONCEPTO FROM CTCATALOGOCUENTAS C WHERE C.IDCONCEPTO = A.IDCONCEPTO ) NMCONCEPTO,
             (SELECT NMDESCRIPCION FROM CTCATALOGOGASTOS G
               WHERE G.IDCATGASTO = A.IDFORMAPAGO)||' - '||
             (SELECT NMPROVEEDOR FROM CTPROVEEDORGASTO F 
               WHERE F.IDPROVEEDORGTO = A.IDPROVEEDORDEPOSITO)||
             CASE WHEN A.IDFORMAPAGO = 38 THEN '<BR/>A nombre de : '||A.FCNMPAGOCHQCAJA END
             FORMAPAGO
				 FROM PENDUPM.FACTURACIONMAIN A
			    WHERE IDGASTOMAIN = ".$idgasto;

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getUser($id){
		$query = "SELECT CLCOLLID PMUSER, CLMAIL FROM rcvry.COLLID cols WHERE CLIDNUM = $id";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getInfoUsuarioCompleta($cvetra)
	{
		$query = "SELECT \"cvetra\"||' - '||\"nombreCompleto\"||' - '||\"despue\" DATAEMPLEADO,
		                 \"email\" EMAIL, \"nombreCompleto\" NOMBRE,\"cveArea\" IDAREA,\"Area\" AREA, 
		                 \"despue\" PUESTO, \"ubicacion\" UBICACION, \"cveUbicacion\" IDUBICACION, \"cvecon\" CVECON
		          FROM PENDUPM.VISTAASOCIADOSCOMPLETA 
		          WHERE \"cvetra\" = ".$cvetra;

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getInfoLastBitacoraQM( $idgasto ) {
		$query = "SELECT date_format(DEL_DELEGATE_DATE,'%d-%b-%y %H:%i') DELEGADO, UPPER(APP_CURRENT_USER) USER_ACTUAL, APP_TAS_TITLE TAREA_ACTUAL, TAS_UID 
    			FROM APP_CACHE_VIEW A
   				WHERE APP_NUMBER IN ( $idgasto )
     			AND DEL_LAST_INDEX = 1 AND DEL_THREAD_STATUS='OPEN'";

		$Mysql = Pendum_Db_DbFactory::factory('mysql');
        $datos = $Mysql->getAll($query);
        return $datos;
	}
	
	public function getInfoLastBitacora( $idgasto ) {
		$query = "SELECT FCRESULTADO, IDTASKGASTO TAS_UID, FCUSUARIO,( SELECT COUNT(1) FROM PENDUPM.FACTURACIONAUT A 
                      WHERE A.IDGASTOMAIN = B.IDGASTOMAIN AND FCRESULTADO IS NULL AND FCAUTORIZADOR = FCUSUARIO ) RESULT
FROM PENDUPM.FACTURACIONBITACORA B 
WHERE B.IDGASTOMAIN = $idgasto AND DEL_INDEX = ( SELECT MAX(DEL_INDEX) FROM PENDUPM.FACTURACIONBITACORA WHERE IDGASTOMAIN = $idgasto )";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getBitacoraTermometro() {
		$query = "SELECT * 
		          FROM PENDUPM.CTETAPASFACTURACION WHERE TIPO = 'BITACORA' AND FCSTATUS = 'A'
                  ORDER BY FNORDER";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getAutorizadorTermometro($idgasto,$mail='')
	{
		$where = '';
		if( $mail != '' ) {
			$where = " AND FCAUTORIZADOR = '$mail' ";
		}
		$query = "SELECT IDTIPOAUTORIZA FROM PENDUPM.FACTURACIONAUT WHERE IDGASTOMAIN = $idgasto AND FCRESULTADO IS NULL $where ";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getComprobaciones($idgasto,$idconcepto=0,$idcomproba=0){
		$filtro = '';$join = '';
		
		if( $idconcepto != 0 ) {
			$filtro .= " AND FA.IDCONCEPTO = $idconcepto ";
			$join = "INNER JOIN PENDUPM.FACTURAASIGNACION FA ON ( FC.IDCOMPROBACION = FA.IDCOMPROBACION )";
		}
		if( $idcomproba != 0 ) {
			$filtro .= " AND FA.IDCOMPROBACION = $idcomproba ";
			$join = "INNER JOIN PENDUPM.FACTURAASIGNACION FA ON ( FC.IDCOMPROBACION = FA.IDCOMPROBACION )";
		}

		$query = "SELECT  FC.IDCOMPROBACION ,
				FCTIPOCOMPROBANTE TIPOCOMP,
                PCKENVIOCORREO.aplFecha(FC.FDFECREGISTRO) FDFECREGISTRO,
                FC.FCTIPOCOMPROBANTE, FC.FCNOFACTURA,
                NVL(FC.FNIMPORTE,0) FNIMPORTE,
                NVL(FC.FNIVA,0) FNIVA,
                NVL(FC.FNOTROSIMPUEST,0) FNOTROSIMPUEST,
                NVL(FC.FNIVARET,0) FNIVARET,
                NVL(FC.FNISR,0) FNISR,
                NVL(FC.FNTOTAL,0) FNTOTAL,
                REPLACE(FCARCHIVOPDF,  'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=','http://doc.pendulum.com.mx/PM/gastos/comprobacion/') FCARCHIVOPDF,
                REPLACE(FCARCHIVOXML,  'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=','http://doc.pendulum.com.mx/PM/gastos/comprobacion/') FCARCHIVOXML,
                REPLACE(FCARCHIVOPDFC, 'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=','http://doc.pendulum.com.mx/PM/gastos/comprobacion/') FCARCHIVOPDFC,
                FCCONCEPTO,
                PCKENVIOCORREO.aplFecha(FC.FDCOMPROBACION) FDCOMPROBACION,
                FC.NMRFC
          FROM FACTURACIONCOMPROBA FC $join
         WHERE FC.IDGASTOMAIN = $idgasto $filtro
       ORDER BY FC.FDCOMPROBACION";
//echo $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getSeguimientoEtapa($idgasto){
         $query = "SELECT DEL_INDEX,NMETAPA, PENDUPM.PCKENVIOCORREO.aplFecha(FDFECREGISTRO) FECREG, IDTASKGASTO,
               CASE WHEN IDTASKGASTO = '2082181485273e6002e4959086601056' THEN 'TESORERIA ANTICIPOS'
                    WHEN IDTASKGASTO = '656925561529384c6847c88021053266' THEN 'TESORERIA REEMBOLSOS'
                    ELSE (SELECT \"nombreCompleto\" FROM PENDUPM.VISTAASOCIADOSCOMPLETA WHERE \"email\" = FCUSUARIO AND ROWNUM = 1 )
               END FCUSUARIO,
               CASE WHEN FCCOMENTARIOS IS NULL THEN '' ELSE FCRESULTADO END FCRESULTADO ,
               FCCOMENTARIOS
        FROM PENDUPM.FACTURACIONBITACORA
        WHERE IDGASTOMAIN = $idgasto
        ORDER BY DEL_INDEX ASC";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getPagoServicios($idgasto,$idconcepto=0,$credito=0)
	{
		$filtro = '';
		
		if( $idconcepto != 0 ) {
			$filtro .= " AND IDCONCEPTO = $idconcepto ";
		}
		if( $credito !== 0 ) {
			$filtro .= " AND FCCREDITOCARTERA = '$credito' ";
		}

		$query = "SELECT 
            ASI.FCCREDITOCARTERA CREDITO,
            (SELECT COM.FCNOFACTURA FROM PENDUPM.FACTURACIONCOMPROBA COM WHERE ASI.IDCOMPROBACION = COM.IDCOMPROBACION ) FCNOFACTURA,
            ASI.FNIMPORTECOMPROBA,    
            PCKENVIOCORREO.aplFecha(ASI.FDFECREALPAGO) FECREALPAGO,
            ASI.FCREMESA,
            PCKENVIOCORREO.aplFecha(ASI.FDFECSERVPAGADODEL) FECSERVPAGADODEL,
            PCKENVIOCORREO.aplFecha(ASI.FDFECSERVPAGADOAL) FECSERVPAGADOAL,
            CASE WHEN ASI.FCPAGADOPREVIAMENTE = 'S' THEN 'SI' WHEN ASI.FCPAGADOPREVIAMENTE = 'N' THEN 'NO' ELSE '' END FCPAGADOPREVIAMENTE,
            PCKENVIOCORREO.aplFecha(ASI.FDFECCUMBREPAGO) FECCUMBREPAGO,
            (ASI.FCCOMENTARIOPAGOSERV) FCCOMENTARIOPAGOSERV
            FROM FACTURAASIGNACION ASI
            WHERE ASI.IDGASTOMAIN = $idgasto $filtro
       ORDER BY ASI.FDFECREGISTRO";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getSegTesoreria($idgasto) {
		$query = "SELECT (CASE WHEN (NVL (FNIMPORTEANTICIPO, 0) = 0 ) THEN 'NO REALIZADO' ELSE TO_CHAR(NVL(FNIMPORTEANTICIPO,0)) END) ANTICIPO,
		(SELECT FCNOMBRE 
                FROM PENDUPM.FACTURACIONDEPOSITO X
               WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 2 AND FCSTATUS = 'A')
                QUIENDEPOSITODEP,
        (SELECT IDPROVEEDORGTO
                FROM PENDUPM.FACTURACIONDEPOSITO X
               WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 2 AND FCSTATUS = 'A')
                IDDEPOSITODEP,
             (SELECT Y.NMEMPRESA||' ('||X.IDEMPRESA||')'
                FROM PENDUPM.FACTURACIONDEPOSITO X INNER JOIN PENDUPM.EMPRESAFACTURACION Y ON X.IDEMPRESA = Y.IDEMPRESA
               WHERE X.IDGASTOMAIN = $idgasto AND X.FNCONSEC = 2 AND X.FCSTATUS = 'A')
                EMPRESADEP,
             NVL ( (SELECT FCREFERENCIA
                      FROM FACTURACIONDEPOSITO X
                     WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 2 AND FCSTATUS = 'A'),
                  '')
                REFERENCIADEP,
             (SELECT PCKENVIOCORREO.aplFecha (FDFECREGISTRO)
                FROM PENDUPM.FACTURACIONDEPOSITO X
               WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 2 AND FCSTATUS = 'A')
                FECAPLDEP,
             (SELECT NMNOMBRE||' ('||FCUSUARIOAPLICA||')'
                FROM FACTURACIONDEPOSITO X INNER JOIN PENDUPM.CTUSUARIOS ON FCEMPLEADO = FCUSUARIOAPLICA
               WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 2 AND FCSTATUS = 'A' AND FCEMAIL IS NOT NULL AND FCCLAVEQUASAR IS NOT NULL)
                QUIENLOHIZODEP,
             PCKENVIOCORREO.aplFecha (FDDYNAMICSGASTOCONF) FECCONFDEP,
		(SELECT Y.NMEMPRESA||' ('||X.IDEMPRESA||')'
                FROM PENDUPM.FACTURACIONDEPOSITO X INNER JOIN PENDUPM.EMPRESAFACTURACION Y ON X.IDEMPRESA = Y.IDEMPRESA
               WHERE X.IDGASTOMAIN = $idgasto AND X.FNCONSEC = 6 AND X.FCSTATUS = 'A')
                EMPRESAREE,
             NVL ( (SELECT FCREFERENCIA
                      FROM PENDUPM.FACTURACIONDEPOSITO X
                     WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 6 AND FCSTATUS = 'A'),
                  '')
                REFERENCIAREE,
             (SELECT PENDUPM.PCKENVIOCORREO.aplFecha (FDFECREGISTRO)
                FROM PENDUPM.FACTURACIONDEPOSITO X
               WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 6 AND FCSTATUS = 'A')
                FECAPLREE,
             (SELECT NMNOMBRE||' ('||FCUSUARIOAPLICA||')'
                FROM PENDUPM.FACTURACIONDEPOSITO X INNER JOIN PENDUPM.CTUSUARIOS ON FCEMPLEADO = FCUSUARIOAPLICA
               WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 6 AND FCSTATUS = 'A' AND FCEMAIL IS NOT NULL AND FCCLAVEQUASAR IS NOT NULL)
                QUIENLOHIZOREE,
             (SELECT PENDUPM.PCKENVIOCORREO.aplFecha (FDFECDERIVACION)
                FROM PENDUPM.FACTURACIONDEPOSITO X
               WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 6 AND FCSTATUS = 'A')
                FECCONFREE,
             (SELECT FCNOMBRE || ' - ' || NVL (IDPROVEEDORGTO, '----')
                FROM PENDUPM.FACTURACIONDEPOSITO X
               WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 6 AND FCSTATUS = 'A')
                QUIENDEPOSITOREE,
             NVL (FNIMPORTEREEMBOLSO, 0) REEMBOLSO,
             (SELECT FNLOTE FROM PENDUPM.FACTURACIONPAGOS WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 2) LOTEANT,
			 (SELECT FCREFERDYN FROM PENDUPM.FACTURACIONPAGOS WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 2) REFDYNANT,
			 (SELECT FNLOTE FROM PENDUPM.FACTURACIONPAGOS WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 6) LOTEREE,
             (SELECT FCREFERDYN FROM PENDUPM.FACTURACIONPAGOS WHERE IDGASTOMAIN = $idgasto AND FNCONSEC = 6) REFDYNREE
                FROM PENDUPM.FACTURACIONMAIN A
       WHERE     IDGASTOMAIN = $idgasto
             AND FDFECREGISTRO = (SELECT MIN (FDFECREGISTRO)
                                    FROM PENDUPM.FACTURACIONMAIN A
                                   WHERE IDGASTOMAIN = $idgasto )";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getDocumentosInicio( $idgasto,$concepto='',$cuenta='' ) {
		$where = "";
		
		if ($concepto != '') {
			$where = " AND IDCONCEPTO = '$concepto'";
		}
		if ($cuenta != '') {
			$where = " AND FCCREDITO = '$cuenta'";
		}
		
		$query = "SELECT IDGASTOMAIN, FCNOMBRE, FCRUTAFILE, TO_CHAR(X.FDFECREGISTRO,'DD-Mon-YY HH24:MI','nls_date_language=Spanish') FDFECREGISTRO, FCCREDITO,
       		C.NMCONCEPTO,
       		NMCONCEPTO,
               ( SELECT NMDESCRIP FROM PENDUPM.CTCUENTACATEGORIA  C WHERE IDCUENTACAT = C.IDSUBCATEGORIA ) CATEGSUB ,
               ( SELECT NMDESCRIP FROM PENDUPM.CTCUENTACATEGORIA  C WHERE IDCUENTACAT = C.IDCATEGORIA ) CATEG  
			FROM PENDUPM.FACTURADCINICIO X INNER JOIN PENDUPM.CTCATALOGOCUENTAS C ON X.IDCONCEPTO = C.IDCONCEPTO WHERE IDGASTOMAIN = $idgasto $where ";
//echo $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getDocumentosSoporte($idgasto,$concepto='',$cuenta='') {
		$where = "";
		
		if ($concepto != '') {
			$where = " AND IDCONCEPTO = '$concepto'";
		}
		if ($cuenta != '') {
			$where = " AND FCCREDITO = '$cuenta'";
		}
		
		$query = "SELECT (SELECT NMDESCRIP  FROM PENDUPM.CTCUENTACATEGORIA C
        WHERE C.IDCUENTACAT = (SELECT IDCATEGORIA FROM PENDUPM.CTCATALOGOCUENTAS H WHERE x.IDCONCEPTO = H.IDCONCEPTO)) CATEG,
       (SELECT NMDESCRIP  FROM PENDUPM.CTCUENTACATEGORIA C
        WHERE C.IDCUENTACAT = (SELECT IDSUBCATEGORIA FROM PENDUPM.CTCATALOGOCUENTAS H WHERE x.IDCONCEPTO = H.IDCONCEPTO)) CATEGSUB,
       (SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS C WHERE x.IDCONCEPTO = C.IDCONCEPTO) CONCEPTO,
                X.IDCONSEC,
                X.FCCREDITO,
                FCNOMBRE, PENDUPM.PCKFACTURACIONGASTO.getValorArchIniSopUnif(IDCONSEC, 'SOP') FCRUTAFILE,
               PENDUPM.PCKENVIOCORREO.aplFecha(FDFECREGISTRO,'N') FECREG,
               FCUSUARIO, FCRESULTADO01, FCCOMENTARIO01, PENDUPM.PCKENVIOCORREO.aplFecha(FDFECREGISTRO01,'N') FDFECREGISTRO01,
               FCUSUARIO01, FCRESULTADO02, FCCOMENTARIO02, PENDUPM.PCKENVIOCORREO.aplFecha(FDFECREGISTRO02,'N') FDFECREGISTRO02,
               FCUSUARIO02, FCRESULTADO03, FCCOMENTARIO03, PENDUPM.PCKENVIOCORREO.aplFecha(FDFECREGISTRO03,'N') FDFECREGISTRO03
          FROM PENDUPM.FACTURADCSOPORTE X WHERE IDGASTOMAIN = ".$idgasto.$where;
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getDocumentosAnexo($idgasto){
		$query = "SELECT IDCONSEC , FCNOMBRE,
              REPLACE(FCRUTAFILE, 'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastos.php?archivo=','http://doc.pendulum.com.mx/PM/gastos/documentos/') FCRUTAFILE,
               PCKENVIOCORREO.aplFecha(FDFECREGISTRO) FECREG
          FROM FACTURACIONANEXOS WHERE IDGASTOMAIN = ".$idgasto;
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getDocumentosCotizacion($idgasto,$concepto=''){
		$where = "";
		
		if ($concepto != '') {
			$where = " AND IDCONCEPTO = '$concepto'";
		}
		$query = "SELECT IDCOTIZACION, FCRAZONSOCIAL, FCRFC, PCKENVIOCORREO.aplFecha(FDFECREGISTRO) FDFECREGISTRO,
                         REPLACE(FCARCHIVOPDF, 'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastos.php?archivo=','http://doc.pendulum.com.mx/PM/gastos/documentos/') RUTACOTIZA,
                         ( SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS WHERE IDCONCEPTO = FC.IDCONCEPTO ) CONCEPTO,
                         FNIMPORTE, FNIVA, FNOTROSIMPUEST, FNIVARET, FNISR, FNTOTAL
                    FROM FACTURACIONCOTIZA FC
                   WHERE IDGASTOMAIN = $idgasto $where
                ORDER BY IDCOTIZACION";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getAsignaFacturacion( $idgasto ) {
//echo $idgasto; exit; 
		$query = "SELECT (SELECT NMDESCRIP  FROM PENDUPM.CTCUENTACATEGORIA C WHERE C.IDCUENTACAT = (SELECT IDCATEGORIA FROM PENDUPM.CTCATALOGOCUENTAS H WHERE x.IDCONCEPTO = H.IDCONCEPTO)) CATEG,
                         (SELECT NMDESCRIP  FROM PENDUPM.CTCUENTACATEGORIA C WHERE C.IDCUENTACAT = (SELECT IDSUBCATEGORIA FROM PENDUPM.CTCATALOGOCUENTAS H WHERE x.IDCONCEPTO = H.IDCONCEPTO)) CATEGSUB,
                         (SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS C WHERE x.IDCONCEPTO = C.IDCONCEPTO) NMCONCEPTO,
                         PENDUPM.PCKENVIOCORREO.aplFecha(FDFECREGISTRO,'N') FECSOLICITUD,
                         FCCREDITOCARTERA CREDCART,
                         CASE WHEN IDTIPOMOVTO IN (2,3) THEN (SELECT '['||NVL(U1CARTERA,U2CARTERA)||'] '||DMNAME FROM RCVRY.DELQMST A LEFT JOIN RCVRY.UDA1 B ON (A.DMACCT = B.U1ACCT)
                                                                                   LEFT JOIN RCVRY.UDA2 C ON (A.DMACCT = C.U2ACCT) WHERE A.DMACCT = X.FCCREDITOCARTERA)
                     WHEN IDTIPOMOVTO IN (4) THEN (SELECT NMDESCRIPCION FROM PENDUPM.CTCARTERA A WHERE A.IDCARTERA = X.FCCREDITOCARTERA)
                     ELSE 'IMPORTE GENERAL'
                END NMDETALLE,
        		CASE WHEN FCESFACTURABLE = 'S' THEN
                    'SI'
                WHEN FCESFACTURABLE = 'N' THEN
                    'NO'
                ELSE
                    'NO'
                END ESFACTURABLE,
                CASE WHEN FCESREEMBOLSABLE = 'S' THEN
                    'SI'
                WHEN FCESREEMBOLSABLE = 'N' THEN
                    'NO'
                ELSE
                    'NO'
                END ESREEMBOLSABLE,
                CASE WHEN FCQUEUMBRAL = 0 THEN '' ELSE  FCJUSTIFICACIONUMBRAL
                END JUSUMBRAL,
                FCRESUMBRAL03, FCRESUMBRAL04, FCRESUMBRAL05,
                FCUSUUMBRAL03,FCUSUUMBRAL04,FCUSUUMBRAL05,
                '' UMBRALRESULT,
                CASE WHEN VERETAPACDACHK IS NOT NULL THEN 'ETAPA :'||VERETAPACDACHK END||
                CASE WHEN FCCODACCEXT IS NOT NULL THEN ' CA :'||FCCODACCEXT END||
                CASE WHEN FCCODRESEXT IS NOT NULL THEN ' CR :'||FCCODRESEXT END ETAPAESP,
                CASE WHEN VERETAPACDACHK IS NOT NULL OR FCCODACCEXT IS NOT NULL OR FCCODRESEXT IS NOT NULL THEN FCJUSTIFICAETAPA
                END JUSETAPA,
                FCUSUETAPA01, FCUSUETAPA02,FCRESETAPA01,FCRESETAPA02,''ETAPARESULT,
                CASE WHEN FNPAGODOBLE = 0 THEN '' ELSE FCJUSTIFICAPAGODBL
                END JUSPGODBL,
                FCUSUPGODBL01, FCUSUPGODBL02, FCRESPGODBL01,FCRESPGODBL02,'' PGODBLRESULT,
                 CASE WHEN IDTIPOMOVTO IN (2,3) THEN
                (SELECT NMCENTROCOSTO FROM PENDUPM.CENTROCOSTOGASTO where IDCATEGORIA = 3 AND FCSTATUS = 'A' AND NMCENTROCOSTO = FCCENTROCOSTOS)
                WHEN IDTIPOMOVTO IN (42,4) THEN
                (SELECT NMCENTROCOSTO  FROM PENDUPM.CENTROCOSTOGASTO where IDCATEGORIA IN (1,2,5,6,7,8,9) AND FCSTATUS = 'A' AND IDCENTROCOSTO = FCCENTROCOSTOS)
                ELSE
                'NA'
                END FCCENTROCOSTOS,
                PENDUPM.PCKCONVENIOS.formatComas(NVL(FNIMPORTE,0)) FNIMPORTE,
                PENDUPM.PCKCONVENIOS.formatComas(NVL(FNIMPORTECOMPROBA,0)) FNIMPORTECOMPROBA,
                FNIMPORTE IMPORTE,
                FNIMPORTECOMPROBA IMPORTECOMPROBA,
                STATUS,
                X.IDCONCEPTO,
                X.IDPLANVIAJE IDPLAN,
                X.FCCREDITOCARTERA CREDITO,
                X.IDCOMPROBACION COMPROBA,
                ( CASE WHEN (SELECT COUNT(1) FROM PENDUPM.CTCARTERA WHERE IDCARTERA = X.FCCREDITOCARTERA )  > 0 THEN '' ELSE FCCREDITOCARTERA END ) XLINK,
                ( SELECT DMNAME FROM RCVRY.DELQMST WHERE DMACCT = X.FCCREDITOCARTERA ) NMACREDITADO,
                ( SELECT U1CARTERA FROM RCVRY.UDA1 WHERE U1ACCT = X.FCCREDITOCARTERA UNION SELECT U2CARTERA FROM RCVRY.UDA2 WHERE U2ACCT = X.FCCREDITOCARTERA ) CARTERA
            FROM PENDUPM.FACTURAASIGNACION X
           WHERE IDGASTOMAIN = $idgasto
           ORDER BY 1,2,3 ";
//echo $query;exit;		

		/*if( $idgasto == 4254220 ) {
			return $query;
		}*/
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getAutorizadores( $idgasto ){
		$query = "SELECT * FROM (
            SELECT IDGASTOMAIN, IDTIPOAUTORIZA, FCAUTORIZADOR, MAX(IDCONSEC) INDICE, FCRESULTADO,
            (SELECT NMNOMBRE FROM PENDUPM.CTUSUARIOS WHERE FCEMAIL = FA.FCAUTORIZADOR) NMAUT, 
   (SELECT NMTASK||' '||NMSUBTASK FROM PENDUPM.CTETAPASFACTURACION WHERE TPOAUT = FA.IDTIPOAUTORIZA) TPOAUT 
FROM PENDUPM.FACTURACIONAUT FA WHERE IDGASTOMAIN = $idgasto GROUP BY IDGASTOMAIN, IDTIPOAUTORIZA, FCAUTORIZADOR,FCRESULTADO
) AUTORIZADORES
ORDER BY INDICE";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getDocumentTotal ( $idgasto ) {
		$query = "SELECT IDGASTOMAIN,FCCREDITO, COUNT(1) TOTAL 
FROM (
SELECT IDGASTOMAIN,FCCREDITO, 'SOP' TPODOC FROM PENDUPM.FACTURADCSOPORTE WHERE IDGASTOMAIN = $idgasto 
UNION ALL
SELECT IDGASTOMAIN,FCCREDITO, 'INI' TPODOC FROM PENDUPM.FACTURADCINICIO WHERE IDGASTOMAIN = $idgasto
UNION ALL
SELECT FA.IDGASTOMAIN,FCCREDITOCARTERA FCCREDITO, 'XML' TPODOC FROM PENDUPM.FACTURAASIGNACION FA 
                        INNER JOIN PENDUPM.FACTURACIONCOMPROBA C ON ( FA.IDCOMPROBACION = C.IDCOMPROBACION )
   WHERE FA.IDGASTOMAIN = $idgasto AND FA.IDCOMPROBACION > 0 AND STATUS = 'A' 
         AND FCARCHIVOXML IS NOT NULL GROUP BY FA.IDGASTOMAIN,FCCREDITOCARTERA
UNION ALL
SELECT FA.IDGASTOMAIN,FCCREDITOCARTERA FCCREDITO, 'PDF' TPODOC FROM PENDUPM.FACTURAASIGNACION FA 
                        INNER JOIN PENDUPM.FACTURACIONCOMPROBA C ON ( FA.IDCOMPROBACION = C.IDCOMPROBACION )
   WHERE FA.IDGASTOMAIN = $idgasto AND FA.IDCOMPROBACION > 0 AND STATUS = 'A' 
         AND FCARCHIVOPDF IS NOT NULL GROUP BY FA.IDGASTOMAIN,FCCREDITOCARTERA
UNION ALL
SELECT FA.IDGASTOMAIN,FCCREDITOCARTERA FCCREDITO, 'PDFC' TPODOC FROM PENDUPM.FACTURAASIGNACION FA 
                        INNER JOIN PENDUPM.FACTURACIONCOMPROBA C ON ( FA.IDCOMPROBACION = C.IDCOMPROBACION )
   WHERE FA.IDGASTOMAIN = $idgasto AND FA.IDCOMPROBACION > 0 AND STATUS = 'A' 
         AND FCARCHIVOPDFC IS NOT NULL        
) GROUP BY IDGASTOMAIN,FCCREDITO";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getAutorizadorByResumen($idGasto) {
		$query = "SELECT IDTIPOAUTORIZA, A.FCRESULTADO, ( CASE 
          WHEN FCCREDITOCARTERA = 'PGO DBL' THEN ''  
          WHEN FCCREDITOCARTERA = 'JFE INMED' THEN '' 
          WHEN FCCREDITOCARTERA = 'SEVERIDAD' THEN '' 
          WHEN FCCREDITOCARTERA = 'AUTORIZA EXCEDENTE GASTO' THEN ''  
          WHEN FCCREDITOCARTERA = 'STATUS / COLA CREDITO' THEN ''
          WHEN FCCREDITOCARTERA = 'ETAPA PROC' THEN ''
          WHEN FCCREDITOCARTERA = 'ETAPA PROC FINAL' THEN ''
          ELSE FCCREDITOCARTERA END ) CREDITO,
          IDTASKGASTO ACTUAL,
          B.FCRESULTADO RESULTBITACORA
        FROM PENDUPM.FACTURACIONAUT A LEFT JOIN PENDUPM.FACTURACIONBITACORA B ON (FCUSUARIO = FCAUTORIZADOR AND 
                                                                          A.IDGASTOMAIN = B.IDGASTOMAIN AND
                                                                          B.IDTASKGASTO IN ('8961359245370cf9de08e25000253648','18385767052f0fe4c52e5a1077764896') 
                                                                          )
        WHERE (A.FCRESULTADO NOT LIKE '%---%' OR A.FCRESULTADO IS NULL) AND A.IDGASTOMAIN = $idGasto
     GROUP BY IDTIPOAUTORIZA, A.FCRESULTADO, FCCREDITOCARTERA, FDFECAUTORIZA, B.FCRESULTADO, IDTASKGASTO
     ORDER BY IDTIPOAUTORIZA, FDFECAUTORIZA";
//echo $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getAutorizadorGeneral($idGasto,$tiempo="") {
		$filtro = " AND SUBTIPO IS NOT NULL ";
		if ( $tiempo != "") {
			$filtro = " AND SUBTIPO = '$tiempo' ";
		}
		
		$query = "SELECT NMTASK, NMSUBTASK, TPOAUT, NMSHORTTASK FROM PENDUPM.CTETAPASFACTURACION 
                   WHERE FCSTATUS = 'A' $filtro
                ORDER BY FNORDER";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}
	
	public function getComentariosAut( $idGasto, $tipo=0, $auto=0, $nmcc=0 )
	{
		$filtro = '';
		if( $tipo != 0 ){
			$filtro .= ' AND IDTIPOAUTORIZA = '.$tipo;
		}
		if( $auto != 0 ){
			$filtro .= " AND FCAUTORIZADOR = '$auto' ";
		}
		if( $nmcc !== '' && $tipo!=8 ){
			$filtro .= " AND FCCREDITOCARTERA = '$nmcc' ";
		}

		$query = "SELECT (SELECT NMDESCRIPCION FROM PENDUPM.CTCATALOGOGASTOS G WHERE G.IDCATGASTO = A.IDTIPOAUTORIZA)  TIPOAUTORIZA,
            	TO_CHAR(FDFECREGISTRO,'DD-Mon-YY HH24:MI','nls_date_language=Spanish') FECSOLICITUD,
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
                 WHEN IDTIPOAUTORIZA = 66 THEN (SELECT DISTINCT ALERTAFECHAEJECCOMENTARIO FROM PENDUPM.FACTURAASIGNACION X WHERE A.IDGASTOMAIN = X.IDGASTOMAIN   AND A.FCCREDITOCARTERA = X.FCCREDITOCARTERA AND X.ALERTAFECHAEJECCOMENTARIO IS NOT NULL AND ROWNUM = 1)
                 WHEN IDTIPOAUTORIZA = 67 THEN (SELECT DISTINCT ALERTASIGNACOMENTARIO FROM PENDUPM.FACTURAASIGNACION X WHERE A.IDGASTOMAIN = X.IDGASTOMAIN   AND A.FCCREDITOCARTERA = X.FCCREDITOCARTERA AND X.ALERTASIGNACOMENTARIO IS NOT NULL AND ROWNUM = 1)
            	END  JUSTIFICACION,
            	FCAUTORIZADOR AUTORIZADOR,
            	(
            	SELECT \"nombreCompleto\" NOMBRE FROM PENDUPM.VISTAASOCIADOSCOMPLETA WHERE \"email\" = FCAUTORIZADOR AND \"cvetra\" = (SELECT MAX(\"cvetra\") FROM PENDUPM.VISTAASOCIADOSCOMPLETA WHERE \"email\" = FCAUTORIZADOR )
            	) NOMBREAUTORIZA,
            	NVL(FCRESULTADO,'')  RESULTADO,
            	TO_CHAR(FDFECAUTORIZA,'DD-Mon-YY HH24:MI','nls_date_language=Spanish') FECAUTORIZA,
            	NVL(FCCOMENTARIO02,'') COMEAUTORIZA
       	FROM PENDUPM.FACTURACIONAUT A
      		WHERE (FCRESULTADO NOT LIKE '%---%' OR FCRESULTADO IS NULL) AND IDGASTOMAIN = $idGasto
     		$filtro 
   		ORDER BY IDDELINDEX,IDCONSEC";
//echo $query;exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getNameAutorizacion( $tipo )
	{
		$query = "SELECT NMTASK||' '||NMSUBTASK NOMBRE FROM PENDUPM.CTETAPASFACTURACION WHERE TPOAUT = $tipo";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getMisCasos($cyber, $process) {
		$query = "SELECT DD.*, 
                    (CASE WHEN TIPOMOV = 'N' THEN 'VIATICO NORMAL' WHEN TIPOMOV = 'S' THEN 'VIATICO CERO' ELSE TIPOMOV END) TIPOMOVLABEL
                  FROM
(SELECT 'GASTO' TIPO, FM.IDGASTOMAIN CASO, TO_CHAR(FM.FDFECREGISTRO,'DD-Mon-YY HH24:MI','nls_date_language=Spanish') FDFECREGISTRO, 
         FM.IDSOLICITANTE, '--' FDFECINI, '--' FDFECFIN, FM.FCSTATUS, FM.TPOMOVIMIENTO TIPOMOV,
        (CASE WHEN FM.FCSTATUS = 'F' THEN 'Finalizado' 
                   WHEN FM.FCSTATUS = 'R' THEN 'Registrado'
                   WHEN FM.FCSTATUS = 'Z' THEN 'Cancelado'
                   WHEN FM.FCSTATUS = 'A' THEN 'Autorizado' 
                   ELSE 'En proceso' END) FCSTATUSLABEL,
        ( SELECT \"nombreCompleto\" FROM PENDUPM.VISTAASOCIADOSCOMPLETA WHERE \"cvetra\" = FNNUMEMPLEADO ) NMSOLICITANTE,
        ( SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS WHERE IDCONCEPTO = FM.IDCONCEPTO) CONCEPTO,
        FA.FCCREDITOCARTERA CREDITO
FROM PENDUPM.FACTURACIONMAIN FM INNER JOIN PENDUPM.FACTURAASIGNACION FA ON ( FM.IDGASTOMAIN = FA.IDGASTOMAIN AND FM.IDCONCEPTO = FA.IDCONCEPTO )
WHERE IDSOLICITANTE = '$process'
UNION
SELECT 'PLAN DE VIAJE' TIPO, IDGASTO CASO, TO_CHAR(FDFECREGISTRO,'DD-Mon-YY HH24:MI','nls_date_language=Spanish') FDFECREGISTRO, 
        IDSOLICITANTE, PENDUPM.PCKENVIOCORREO.aplFecha(FDFECINI) FDFECINI, PENDUPM.PCKENVIOCORREO.aplFecha(FDFECFIN) FDFECFIN, FCSTATUS, FCVIATICO0 TIPOMOV,
       (CASE WHEN FCSTATUS = 'F' THEN 'Finalizado' 
                   WHEN FCSTATUS = 'R' THEN 'Registrado'
                   WHEN FCSTATUS = 'Z' THEN 'Cancelado'
                   WHEN FCSTATUS = 'P' THEN 'Pendiente de Autorizacion'
                   WHEN FCSTATUS = 'A' THEN 'Autorizado'
                   WHEN FCSTATUS = 'G' THEN 'En comprobacion' 
                   ELSE FCSTATUS END) FCSTATUSLABEL,
       ( SELECT \"nombreCompleto\" FROM RCVRY.COLLID R INNER JOIN PENDUPM.VISTAASOCIADOSCOMPLETA ON \"cvetra\" = CLIDNUM
          WHERE R.CLCOLLID = IDSOLICITANTE AND CLSTATUS = 2 ) NMSOLICITANTE, 
       ( SELECT NMMOTIVOGASTO FROM PENDUPM.CTMOTIVOGASTO WHERE IDMOTIVOGASTO = GM.IDMOTIVOGASTO ) CONCEPTO,
       '' CREDITO
FROM PENDUPM.GASTOMAIN GM 
WHERE IDSOLICITANTE = '$cyber'
) DD ORDER BY FDFECREGISTRO DESC ";

//		echo $query;exit;

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getMisCasosAdvance($caso, $email, $credito, $provee, $casosPV = '') 
	{
		$and = 0;
		$where1 = "";
		$where2 = "";

		$inner1 = "";
		$inner2 = "";

		if ($caso != "") {
			$where1 .= " FM.IDGASTOMAIN = $caso ";
			$where2 .= " GM.IDGASTO = $caso ";
			$and = 1;
		}
	
		if ($email != "") {
			if ($and == 1 ) { $where1 .= " AND"; $where2 .= " AND"; }
			$arrmail = explode('@', $email);
			$where1 .= " FM.IDSOLICITANTE = '$arrmail[0]' ";
			$where2 .= " GM.IDSOLICITANTE IN ( SELECT R.CLCOLLID FROM RCVRY.COLLID R WHERE R.CLMAIL = '$email' AND CLSTATUS = 2 ) ";
			$and = 1;
		}
		$inner1 = " INNER JOIN PENDUPM.FACTURAASIGNACION FA ON ( FM.IDGASTOMAIN = FA.IDGASTOMAIN AND FM.IDCONCEPTO = FA.IDCONCEPTO ) ";
		if ($credito != "") {
			if ($and == 1 ) { $where1 .= " AND"; $where2 .= " AND"; }

			$where1 .= " FA.FCCREDITOCARTERA = '$credito' ";

			if ($casosPV != '' ) { 
				$where2 .= " GM.IDGASTO IN ( $casosPV ) "; 
			} else if ($caso != '') {
				$where2 .= " GM.IDGASTO IN ( $caso ) ";
			} else {
				$where2 .= " GM.IDGASTO = 0 ";
			}
			$and = 1;
		}
	
		if( $provee != "" ) {
			if ($and == 1 ) { $where1 .= " AND"; $where2 .= " AND"; }
			$where1 .= " FM.IDPROVEEDORGTO = '$provee' ";
			$where2 .= " GM.FNEMPNOMINA = '$provee' "; 
		}
		
		$query = "SELECT TIPOMOV, TIPO, CASO, IDSOLICITANTE, NMSOLICITANTE, TO_CHAR(FDFECREGISTRO,'DD-Mon-YY','nls_date_language=Spanish') FDFECREGISTRO,CREDITO, 
	                 PENDUPM.PCKENVIOCORREO.aplFecha(FDFECINI) FDFECINI, PENDUPM.PCKENVIOCORREO.aplFecha(FDFECFIN) FDFECFIN, 
	                 FCSTATUS, FCSTATUSLABEL, CONCEPTO,
(CASE WHEN TIPOMOV = 'N' THEN 'VIATICO NORMAL' WHEN TIPOMOV = 'S' THEN 'VIATICO CERO' ELSE TIPOMOV END) TIPOMOVLABEL
FROM
(SELECT 'GASTO' TIPO, FM.IDGASTOMAIN CASO, FM.FDFECREGISTRO, IDSOLICITANTE, '' FDFECINI, '' FDFECFIN, FCSTATUS, TPOMOVIMIENTO TIPOMOV,
        (CASE WHEN FCSTATUS = 'F' THEN 'Finalizado' 
                   WHEN FCSTATUS = 'R' THEN 'Registrado'
                   WHEN FCSTATUS = 'Z' THEN 'Cancelado'
                   WHEN FCSTATUS = 'A' THEN 'Autorizado' 
                   ELSE 'En proceso' END) FCSTATUSLABEL,
        ( SELECT \"nombreCompleto\" FROM PENDUPM.VISTAASOCIADOSCOMPLETA WHERE \"cvetra\" = FNNUMEMPLEADO ) NMSOLICITANTE,
        ( SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS WHERE IDCONCEPTO = FM.IDCONCEPTO) CONCEPTO,
        FA.FCCREDITOCARTERA CREDITO
FROM PENDUPM.FACTURACIONMAIN FM $inner1 
WHERE $where1
UNION
SELECT 'PLAN DE VIAJE' TIPO, GM.IDGASTO CASO, GM.FDFECREGISTRO, IDSOLICITANTE, TO_CHAR(FDFECINI), TO_CHAR(FDFECFIN), FCSTATUS, FCVIATICO0 TIPOMOV,
       (CASE WHEN FCSTATUS = 'F' THEN 'Finalizado' 
                   WHEN FCSTATUS = 'R' THEN 'Registrado'
                   WHEN FCSTATUS = 'Z' THEN 'Cancelado'
                   WHEN FCSTATUS = 'P' THEN 'Pendiente de Autorizacion'
                   WHEN FCSTATUS = 'A' THEN 'Autorizado'
                   WHEN FCSTATUS = 'G' THEN 'En comprobacion'
                   WHEN FCSTATUS = 'V' THEN 'Comprobacion validada'  
                   ELSE FCSTATUS END) FCSTATUSLABEL,
       ( SELECT \"nombreCompleto\" FROM RCVRY.COLLID R INNER JOIN PENDUPM.VISTAASOCIADOSCOMPLETA ON \"cvetra\" = CLIDNUM
          WHERE R.CLCOLLID = IDSOLICITANTE AND CLSTATUS = 2 ) NMSOLICITANTE,
       ( SELECT NMMOTIVOGASTO FROM PENDUPM.CTMOTIVOGASTO WHERE IDMOTIVOGASTO = GM.IDMOTIVOGASTO ) CONCEPTO,
       '' CREDITO
FROM PENDUPM.GASTOMAIN GM $inner2
WHERE $where2
) DD GROUP BY TIPOMOV, TIPO, CASO, IDSOLICITANTE, FDFECREGISTRO, FDFECINI, FDFECFIN, FCSTATUS, NMSOLICITANTE, FCSTATUSLABEL, CONCEPTO, CREDITO ORDER BY FDFECREGISTRO DESC ";

		// if ($caso == 4166501) {
		//	echo $query;exit;
		// }
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}

	public function getCasosPVbyCredit($credit,$caso) {
		$where = '';
		if ($caso != '' ) {
			$where = " AND IDGASTO = $caso ";
		}
    	
		$query = "SELECT IDGASTO FROM
			(SELECT IDGASTO FROM PENDUPM.PLANCOBRANZALEGAL WHERE FCCREDITO = '$credit' $where
				UNION 
			 SELECT IDGASTO FROM PENDUPM.PLANAUDITORIA WHERE FCCREDITO = '$credit' $where
			) ";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
    }
    
    public function getEtapasbyVerif($gasto, $credito, $concepto) {

    	$query = "select VERETAPACDACHK ETAPA_CERRADA, VERETAPAABIERTA ETAPA_ABIERTA 
    	          from PENDUPM.FACTURAASIGNACION where IDGASTOMAIN = $gasto AND FCCREDITOCARTERA = '$credito' AND IDCONCEPTO = $concepto ";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
    }
    
	public function getCreditPagoDoble($gasto) {

    	$query = "SELECT FCCREDITOCARTERA FROM PENDUPM.FACTURAASIGNACION F 
    	          WHERE F.FNPAGODOBLE > 0 AND IDGASTOMAIN = $gasto";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
    }
    
	public function getListProveedores() {
		$query = "SELECT IDPROVEEDORGTO||' - ' ||NMPROVEEDOR NOMBRE, IDPROVEEDORGTO IDU 
				FROM PENDUPM.CTPROVEEDORGASTO ";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->query($query);
        return $detalle;
	}
	
	public function getMisCasosAdvanceAutorizadores($caso, $email, $credito, $provee, $casosPV = '', $aut ) {
		
		$and = 0;
		$where1 = "";
		$where2 = "";

		$inner1 = "";
		$inner2 = "";

		if ($caso != "") {
			$where1 .= " FM.IDGASTOMAIN = $caso AND  ";
			$where2 .= " GM.IDGASTO = $caso AND ";
			$and = 1;
		}
	
		if ($email != "") {
			if ($and == 1 ) { $where1 .= " AND"; $where2 .= " AND"; }
			$arrmail = explode('@', $email);
			$where1 .= " FM.IDSOLICITANTE = '$arrmail[0]' ";
			$where2 .= " GM.IDSOLICITANTE IN ( SELECT R.CLCOLLID FROM RCVRY.COLLID R WHERE R.CLMAIL = '$email' AND CLSTATUS = 2 ) ";
			$and = 1;
		}
		$inner1 = " INNER JOIN PENDUPM.FACTURAASIGNACION FA ON ( FM.IDGASTOMAIN = FA.IDGASTOMAIN AND FM.IDCONCEPTO = FA.IDCONCEPTO ) ";
		if ($credito != "") {
			if ($and == 1 ) { $where1 .= " AND"; $where2 .= " AND"; }

			$where1 .= " FA.FCCREDITOCARTERA = '$credito' ";

			if ($casosPV != '' ) { 
				$where2 .= " GM.IDGASTO IN ( $casosPV ) "; 
			} else if ($caso != '') {
				$where2 .= " GM.IDGASTO IN ( $caso ) ";
			} else {
				$where2 .= " GM.IDGASTO = 0 ";
			}
			$and = 1;
		}
	
		if( $provee != "" ) {
			if ($and == 1 ) { $where1 .= " AND"; $where2 .= " AND"; }
			$where1 .= " FM.IDPROVEEDORGTO = '$provee' ";
			$where2 .= " GM.FNEMPNOMINA = '$provee' "; 
		}
		
		$query = "SELECT TIPOMOV, TIPO, CASO, IDSOLICITANTE, NMSOLICITANTE, TO_CHAR(FDFECREGISTRO,'DD-Mon-YY','nls_date_language=Spanish') FDFECREGISTRO,'' CREDITO, 
	                 FCCOMENTARIOS, FCSTATUS, FCSTATUSLABEL, CONCEPTO, FCRESULTADO, 
	                 ( SELECT NMTASK||' '||NMSUBTASK FROM PENDUPM.CTETAPASFACTURACION WHERE TPOAUT = IDTIPOAUTORIZA ) IDTIPOAUTORIZA,
(CASE WHEN TIPOMOV = 'N' THEN 'VIATICO NORMAL' WHEN TIPOMOV = 'S' THEN 'VIATICO CERO' ELSE TIPOMOV END) TIPOMOVLABEL
FROM 
(SELECT 'GASTO' TIPO, FM.IDGASTOMAIN CASO, FM.FDFECREGISTRO, IDSOLICITANTE, TO_CHAR(FT.IDTIPOAUTORIZA) IDTIPOAUTORIZA, FT.FCCOMENTARIO02 FCCOMENTARIOS, FCSTATUS, TPOMOVIMIENTO TIPOMOV,
        (CASE WHEN FCSTATUS = 'F' THEN 'Finalizado' 
                   WHEN FCSTATUS = 'R' THEN 'Registrado'
                   WHEN FCSTATUS = 'Z' THEN 'Cancelado'
                   WHEN FCSTATUS = 'A' THEN 'Autorizado' 
                   ELSE 'En proceso' END) FCSTATUSLABEL,
        ( SELECT \"nombreCompleto\" FROM PENDUPM.VISTAASOCIADOSCOMPLETA WHERE \"cvetra\" = FNNUMEMPLEADO ) NMSOLICITANTE,
        ( SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS WHERE IDCONCEPTO = FM.IDCONCEPTO) CONCEPTO,
        FA.FCCREDITOCARTERA CREDITO, FB.NMETAPA, TO_CHAR(FB.FDFECREGISTRO,'DD-Mon-YY','nls_date_language=Spanish') FDFECHAVAL, FB.FCRESULTADO
FROM PENDUPM.FACTURACIONMAIN FM $inner1 INNER JOIN PENDUPM.FACTURACIONBITACORA FB ON FM.IDGASTOMAIN = FB.IDGASTOMAIN 
                                        INNER JOIN PENDUPM.FACTURACIONAUT FT 
                                                      ON (     FB.IDGASTOMAIN = FT.IDGASTOMAIN
                                                           AND FB.FCUSUARIO = FT.FCAUTORIZADOR 
                                                           AND FB.DEL_INDEX = FT.DELINDEX_AUTORIZA)
WHERE $where1 FB.IDTASKGASTO IN ('8961359245370cf9de08e25000253648','788513233584a0442d6cb49025931910','18385767052f0fe4c52e5a1077764896','62915318153faff251c0553039135422')
     AND FB.FCUSUARIO = '$aut'
UNION
SELECT 'PLAN DE VIAJE' TIPO, GM.IDGASTO CASO, GM.FDFECREGISTRO, IDSOLICITANTE, '0' IDTIPOAUTORIZA, PB.FCCOMENTARIOS, FCSTATUS, FCVIATICO0 TIPOMOV,
       (CASE WHEN FCSTATUS = 'F' THEN 'Finalizado' 
                   WHEN FCSTATUS = 'R' THEN 'Registrado'
                   WHEN FCSTATUS = 'Z' THEN 'Cancelado'
                   WHEN FCSTATUS = 'P' THEN 'Pendiente de Autorizacion'
                   WHEN FCSTATUS = 'A' THEN 'Autorizado'
                   WHEN FCSTATUS = 'G' THEN 'En comprobacion'
                   WHEN FCSTATUS = 'V' THEN 'Comprobacion validada'  
                   ELSE FCSTATUS END) FCSTATUSLABEL,
       ( SELECT \"nombreCompleto\" FROM RCVRY.COLLID R INNER JOIN PENDUPM.VISTAASOCIADOSCOMPLETA ON \"cvetra\" = CLIDNUM
          WHERE R.CLCOLLID = IDSOLICITANTE AND CLSTATUS = 2 ) NMSOLICITANTE,
       ( SELECT NMMOTIVOGASTO FROM PENDUPM.CTMOTIVOGASTO WHERE IDMOTIVOGASTO = GM.IDMOTIVOGASTO ) CONCEPTO,
       '' CREDITO, '' NMETAPA, '' FDFECHAVAL, '' FCRESULTADO
    FROM PENDUPM.GASTOMAIN GM $inner2 INNER JOIN PENDUPM.PLANDEVIAJEBITACORA PB ON GM.IDGASTO = PB.IDGASTO 
   WHERE $where2 PB.IDTASK = '58330755250576e173db313032467847' AND PB.FCUSUARIO = '$aut'
) DD /* WHERE ROWNUM < 5000 */ GROUP BY TIPOMOV, TIPO, CASO, IDSOLICITANTE, FDFECREGISTRO, IDTIPOAUTORIZA, FCCOMENTARIOS, FCSTATUS, NMSOLICITANTE, FCSTATUSLABEL, CONCEPTO , FCRESULTADO ORDER BY FDFECREGISTRO DESC ";

		// echo $query; exit;

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->query($query);
        return $detalle;
	}
    
	public function getMisCasosAdvanceAutorizadoresCount($caso, $email, $credito, $provee, $casosPV = '', $aut, $ini, $fin ) {
		
		$and = 0;
		$where1 = "";
		$where2 = "";

		$inner1 = "";
		$inner2 = "";

		if ($caso != "") {
			$where1 .= " FM.IDGASTOMAIN = $caso AND  ";
			$where2 .= " GM.IDGASTO = $caso AND ";
			$and = 1;
		}
	
		if ($email != "") {
			if ($and == 1 ) { $where1 .= " AND"; $where2 .= " AND"; }
			$arrmail = explode('@', $email);
			$where1 .= " FM.IDSOLICITANTE = '$arrmail[0]' ";
			$where2 .= " GM.IDSOLICITANTE IN ( SELECT R.CLCOLLID FROM RCVRY.COLLID R WHERE R.CLMAIL = '$email' AND CLSTATUS = 2 ) ";
			$and = 1;
		}
		$inner1 = " INNER JOIN PENDUPM.FACTURAASIGNACION FA ON ( FM.IDGASTOMAIN = FA.IDGASTOMAIN AND FM.IDCONCEPTO = FA.IDCONCEPTO ) ";
		if ($credito != "") {
			if ($and == 1 ) { $where1 .= " AND"; $where2 .= " AND"; }

			$where1 .= " FA.FCCREDITOCARTERA = '$credito' ";

			if ($casosPV != '' ) { 
				$where2 .= " GM.IDGASTO IN ( $casosPV ) "; 
			} else if ($caso != '') {
				$where2 .= " GM.IDGASTO IN ( $caso ) ";
			} else {
				$where2 .= " GM.IDGASTO = 0 ";
			}
			$and = 1;
		}
	
		if( $provee != "" ) {
			if ($and == 1 ) { $where1 .= " AND"; $where2 .= " AND"; }
			$where1 .= " FM.IDPROVEEDORGTO = '$provee' ";
			$where2 .= " GM.FNEMPNOMINA = '$provee' "; 
		}
		
		$query = "SELECT COUNT(1) TOTAL
                    FROM
                      (SELECT 'GASTO' TIPO, FM.IDGASTOMAIN CASO, FM.FDFECREGISTRO, IDSOLICITANTE, '' FDFECINI, '' FDFECFIN, FCSTATUS, TPOMOVIMIENTO TIPOMOV,
        (CASE WHEN FCSTATUS = 'F' THEN 'Finalizado' 
                   WHEN FCSTATUS = 'R' THEN 'Registrado'
                   WHEN FCSTATUS = 'Z' THEN 'Cancelado'
                   WHEN FCSTATUS = 'A' THEN 'Autorizado' 
                   ELSE 'En proceso' END) FCSTATUSLABEL,
        ( SELECT \"nombreCompleto\" FROM PENDUPM.VISTAASOCIADOSCOMPLETA WHERE \"cvetra\" = FNNUMEMPLEADO ) NMSOLICITANTE,
        ( SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS WHERE IDCONCEPTO = FM.IDCONCEPTO) CONCEPTO,
        FA.FCCREDITOCARTERA CREDITO, FB.NMETAPA, TO_CHAR(FB.FDFECREGISTRO,'DD-Mon-YY','nls_date_language=Spanish') FDFECHAVAL, FB.FCRESULTADO
FROM PENDUPM.FACTURACIONMAIN FM $inner1 INNER JOIN PENDUPM.FACTURACIONBITACORA FB ON FM.IDGASTOMAIN = FB.IDGASTOMAIN
WHERE $where1 FB.IDTASKGASTO IN ('8961359245370cf9de08e25000253648','788513233584a0442d6cb49025931910','18385767052f0fe4c52e5a1077764896','62915318153faff251c0553039135422')
     AND FB.FCUSUARIO = '$aut'
UNION
SELECT 'PLAN DE VIAJE' TIPO, GM.IDGASTO CASO, GM.FDFECREGISTRO, IDSOLICITANTE, TO_CHAR(FDFECINI), TO_CHAR(FDFECFIN), FCSTATUS, FCVIATICO0 TIPOMOV,
       (CASE WHEN FCSTATUS = 'F' THEN 'Finalizado' 
                   WHEN FCSTATUS = 'R' THEN 'Registrado'
                   WHEN FCSTATUS = 'Z' THEN 'Cancelado'
                   WHEN FCSTATUS = 'P' THEN 'Pendiente de Autorizacion'
                   WHEN FCSTATUS = 'A' THEN 'Autorizado'
                   WHEN FCSTATUS = 'G' THEN 'En comprobacion'
                   WHEN FCSTATUS = 'V' THEN 'Comprobacion validada'  
                   ELSE FCSTATUS END) FCSTATUSLABEL,
       ( SELECT \"nombreCompleto\" FROM RCVRY.COLLID R INNER JOIN PENDUPM.VISTAASOCIADOSCOMPLETA ON \"cvetra\" = CLIDNUM
          WHERE R.CLCOLLID = IDSOLICITANTE AND CLSTATUS = 2 ) NMSOLICITANTE,
       ( SELECT NMMOTIVOGASTO FROM PENDUPM.CTMOTIVOGASTO WHERE IDMOTIVOGASTO = GM.IDMOTIVOGASTO ) CONCEPTO,
       '' CREDITO, '' NMETAPA, '' FDFECHAVAL, '' FCRESULTADO
    FROM PENDUPM.GASTOMAIN GM $inner2 INNER JOIN PENDUPM.PLANDEVIAJEBITACORA PB ON GM.IDGASTO = PB.IDGASTO 
   WHERE $where2 PB.IDTASK = '58330755250576e173db313032467847' AND PB.FCUSUARIO = '$aut'
) DD";

		// echo $query; exit;

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->query($query);
        return $detalle;
	}
	
    public function getListEquivalencias( $tipo = 'NORMAL' ) {
		$max = ' ';
		
		if( $tipo == 'MAX' ) {
			$max = " WHERE IDEQUIVALENCIA = ( SELECT MAX(IDEQUIVALENCIA) IDDATO FROM PENDUPM.FACTURAEQUIVALENCIA ) ";
		}
		
		$query = "SELECT IDEQUIVALENCIA IDDATO,NMEQUIVALENCIA NOMBRE, TO_CHAR(FDFECREGISTRO,'DD-Mon-YY HH24:MI') FECREGISTRO, FCSTATUS STATUS, IDEQUIVALENCIA ACCION, ( SELECT COUNT(1) FROM PENDUPM.CTAGRUPACIONCARTERA WHERE IDAGRUPACION = FE.IDEQUIVALENCIA ) TOTALC 
FROM PENDUPM.FACTURAEQUIVALENCIA FE".$max."ORDER BY IDEQUIVALENCIA"; 

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->query($query);
        return $detalle;
	}
	
	public function editEquivalencias($params) {
		$query = "BEGIN UPDATE PENDUPM.FACTURAEQUIVALENCIA 
		            SET NMEQUIVALENCIA = '$params[NOMBRE]',  FCSTATUS = '$params[STATUS]'
		          WHERE IDEQUIVALENCIA = $params[id]; COMMIT;
		          END;";
		//var_dump($query);exit();
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->queryupdate($query);
        return $detalle;
	}
    
	public function addEquivalencias($params) {
		$query = "BEGIN INSERT INTO PENDUPM.FACTURAEQUIVALENCIA ( IDEQUIVALENCIA, NMEQUIVALENCIA, FCSTATUS) 
                  VALUES ( (SELECT NVL((MAX(IDEQUIVALENCIA)+1),1) ULTIMO FROM PENDUPM.FACTURAEQUIVALENCIA), '$params[NOMBRE]','$params[STATUS]' ); COMMIT; END;";
		//var_dump($query);exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->queryupdate($query);
        return $detalle;
	}
	
	public function getListConcepto() {

		$query = "SELECT ( SELECT NMDESCRIP FROM PENDUPM.CTCUENTACATEGORIA WHERE IDCUENTACAT = CC.IDCATEGORIA) NMCATEGORIA, 
         ( SELECT NMDESCRIP FROM PENDUPM.CTCUENTACATEGORIA WHERE IDCUENTACAT = CC.IDSUBCATEGORIA) NMSUBCATEGORIA, 
         IDCONCEPTO, NMCONCEPTO CONCEPTO, CA.IDCARTERA CARTERA,
         ( SELECT IDAGRUPACION FROM PENDUPM.CTAGRUPACIONCARTERA 
            WHERE IDCONCEPTO = CC.IDCONCEPTO AND CARTERA = CA.IDCARTERA ) IDEQUIVALENCIA,
         NVL(( SELECT NVL(NMEQUIVALENCIA,'-') FROM PENDUPM.CTAGRUPACIONCARTERA INNER JOIN PENDUPM.FACTURAEQUIVALENCIA ON IDAGRUPACION = IDEQUIVALENCIA
            WHERE IDCONCEPTO = CC.IDCONCEPTO AND CARTERA = CA.IDCARTERA ), '   ' ) NMEQUVALENCIA
    FROM PENDUPM.CTCATALOGOCUENTAS CC, PENDUPM.CTCARTERA CA
   WHERE FCCARTERAASIGNADA||'-' LIKE '%'||IDCARTERA||'-%' AND FCCARTERAASIGNADA IS NOT NULL AND CC.FCSTATUS = 'A'";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->query($query);
        return $detalle;
	}
	
	public function dropListConcepto($cadenaid,$cartera,$idequivalencia) {
		$query = "BEGIN DELETE FROM PENDUPM.CTAGRUPACIONCARTERA WHERE IDCONCEPTO = $cadenaid AND CARTERA = '$cartera'; COMMIT; END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->queryupdate($query);
        return $detalle;
	}
	
	public function setListConcepto($cadenaid,$cartera,$idequivalencia) {
		$query = "BEGIN INSERT INTO PENDUPM.CTAGRUPACIONCARTERA ( IDCONCEPTO, CARTERA, IDAGRUPACION) 
                        VALUES ( $cadenaid, '$cartera' , $idequivalencia ); COMMIT; END;";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->queryupdate($query);
        return $detalle;
	}
	
	public function getComprobanteDeriva($idgastomain,$idconcepto) {
		$query = "SELECT FA.IDCONCEPTO, FA.FCUSUARIO, FCRFC, FCNOFACTURA, FC.FNIMPORTE, FNIVA, FNIMPIVA, FNTOTAL,FNOTROSIMPUEST, FC.FCTIPOCOMPROBANTE,
                     FCARCHIVOXML, FCARCHIVOPDF, FCCONCEPTO, TO_CHAR(FDCOMPROBACION,'DD/MM/YYYY') FDCOMPROBACION, NMRFC, UUID, IDPLANVIAJE
                FROM PENDUPM.FACTURACIONCOMPROBA FC 
          INNER JOIN PENDUPM.FACTURAASIGNACION FA 
                  ON FC.IDCOMPROBACION = FA.IDCOMPROBACION
               WHERE FC.IDGASTOMAIN = $idgastomain AND IDCONCEPTO = $idconcepto
            GROUP BY FCRFC, FCNOFACTURA, FC.FNIMPORTE, FNIVA, FNIMPIVA ,FNTOTAL,FNOTROSIMPUEST, FCARCHIVOXML, FCARCHIVOPDF, FC.FCTIPOCOMPROBANTE,
                     FCCONCEPTO, FDCOMPROBACION, NMRFC, UUID, IDPLANVIAJE, FA.IDCONCEPTO, FA.FCUSUARIO";
		
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->query($query);
        return $detalle;
		
	}
	
	public function estaComprobado($idGasto,$idTpoGasto,$idConcepto,$noFactura) {
		$query = "SELECT COUNT(1) TOTAL FROM PENDUPM.COMPROBACIONGASTO WHERE IDGASTO = $idGasto 
		                 AND FCNOFACTURA = '$noFactura' AND IDTPOGASTO = $idTpoGasto AND IDCONCEPTO = $idConcepto";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->query($query);
        return $detalle;
	}
	
	public function insertaComprobante($idGasto, $idTpoGasto, $idConcepto, $tipoComprobante, $usuario, $numRFC, $nombreRFC, $importe, $iva, $importeiva,$total, $fdComproba, $noFactura, $xml, $pdf, $uuid) {
		$query = "BEGIN INSERT INTO PENDUPM.COMPROBACIONGASTO (
                         IDCOMPROBACION, IDGASTO,        IDTPOGASTO,    IDCONCEPTO,  IDTPOCOMPROBANTE, 
                         IDEMPLEADO,     FCRFC,          NMRFC,         FNIMPORTE,   FNIVAPRC,  FNIVA,
                         FNTOTAL,        FDCOMPROBACION, FDFECREGISTRO, FCNOFACTURA, FCFACTURAXML, 
                         FDFACTURAXML,   FCFACTURAPDF,   FDFACTURAPDF,  FCUUID) 
                VALUES ( PENDUPM.IDCOIMPROBACION_SEQ.NEXTVAL, $idGasto, $idTpoGasto, $idConcepto, $tipoComprobante, 
                         '$usuario', '$numRFC', '$nombreRFC', $importe, $iva, $importeiva,
         $total, TO_DATE('$fdComproba','DD/MM/YYYY'), SYSDATE, '$noFactura', '$xml', SYSDATE, '$pdf', SYSDATE, '$uuid');
   COMMIT; END;";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->queryupdate($query);
        return $detalle;
	}
	
	public function updateBitacoraAprovi( $idGasto, $tas ) {
		$query = "BEGIN UPDATE PENDUPM.PLANDEVIAJEBITACORA 
		                   SET FCRESULTADO = 'COMPROBADO',
		                      FCCOMENTARIOS = 'Comprobado por referencia..' 
                         WHERE IDGASTO = $idGasto AND IDTASK = '$tas'
                               AND FCRESULTADO IS NULL AND FCCOMENTARIOS IS NULL;
                 COMMIT; END;";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
		$detalle = $Oracle->queryupdate($query);
        return $detalle;
	}
	
	// Insertar comentario
	
	public function getRowDeriva($idgasto,$tas){
		$query="SELECT 	APP_UID,DEL_INDEX  FROM APP_CACHE_VIEW 
		        WHERE   APP_NUMBER = $idgasto AND TAS_UID LIKE '$tas'";
		$PM = Pendum_Db_DbFactory::factory('mysql');
        $data = $PM->getAll($query);
        return $data;
	}
	
}
