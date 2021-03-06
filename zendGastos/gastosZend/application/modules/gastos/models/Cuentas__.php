<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Gastos_Model_Cuentas 
{
	public function getAllCuentas($credito)
	{
		$query = "(SELECT FA.IDGASTOMAIN GASTO, FA.FCCREDITOCARTERA CREDITO, 
                                  TO_CHAR(FA.FDFECREGISTRO,'DD-MON-YY', 'nls_date_language=Spanish') FECHAREGISTRO,
         	          (SELECT NMDESCRIP FROM PENDUPM.CTCUENTACATEGORIA B
           		   WHERE  IDCUENTACAT = (SELECT IDCATEGORIA FROM PENDUPM.CTCATALOGOCUENTAS C WHERE C.IDCONCEPTO = FA.IDCONCEPTO)) CATEGORIA,
                          (SELECT NMDESCRIP FROM PENDUPM.CTCUENTACATEGORIA B
                           WHERE  IDCUENTACAT = (SELECT IDSUBCATEGORIA FROM PENDUPM.CTCATALOGOCUENTAS C WHERE C.IDCONCEPTO = FA.IDCONCEPTO)) SUBCATEGORIA,
         		  (SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS WHERE IDCONCEPTO = FA.IDCONCEPTO) NOMBRECONCEPTO,
                          FA.IDCONCEPTO CONCEPTO, 
         (SELECT   \"nombreCompleto\"
            FROM   pendupm.vistaAsociados
           WHERE   \"cvetra\" = FA.FCUSUARIO)
            NOMBRESOLICITA,
         FA.FCUSUARIO SOLICITANTE,
         FA.FNIMPORTE IMPORTE,
         FA.FNIMPORTECOMPROBA IMPORTECOMPROBADO,
         TO_CHAR(FA.FDFECCOMPROBA,'DD-MON-YY', 'nls_date_language=Spanish') FECHACOMPROBA, CASE
            WHEN FA.FCESFACTURABLE = 'S' THEN 'SI'
            ELSE 'NO'
         END ESFACTURABLE,
         (CASE
            WHEN FCSTATUS = 'F' THEN 'FINALIZADO'
            WHEN FCSTATUS = 'Z' THEN 'CANCELADO'
            ELSE 'EN SOLUCION'
         END) STATUS, TO_CHAR(FDFECREALPAGO,'DD-MON-YY', 'nls_date_language=Spanish') FDFECREALPAGO, FCREMESA, 
            TO_CHAR(FDFECSERVPAGADODEL,'DD-MON-YY', 'nls_date_language=Spanish') FDFECSERVPAGADODEL,
		 TO_CHAR(FDFECSERVPAGADOAL,'DD-MON-YY', 'nls_date_language=Spanish') FDFECSERVPAGADOAL,  
               CASE WHEN FCPAGADOPREVIAMENTE = 'S' THEN 'SI' ELSE 'NO' END FCPAGADOPREVIAMENTE, 
			TO_CHAR(FDFECCUMBREPAGO,'DD-MON-YY', 'nls_date_language=Spanish') FDFECCUMBREPAGO, FCCOMENTARIOPAGOSERV
		 FROM PENDUPM.FACTURAASIGNACION FA
         INNER JOIN
            PENDUPM.FACTURACIONMAIN FM
         ON (FA.IDGASTOMAIN = FM.IDGASTOMAIN AND FA.IDCONCEPTO=FM.IDCONCEPTO) 
         INNER JOIN PENDUPM.FACTURACIONBITACORA FB
           ON (FA.IDGASTOMAIN = FB.IDGASTOMAIN)
	INNER JOIN
            PENDUPM.FACTURACIONCOMPROBA FC
         ON (FA.IDGASTOMAIN = FC.IDGASTOMAIN AND FA.IDCOMPROBACION=FC.IDCOMPROBACION)
        WHERE FCCREDITOCARTERA = '$credito' AND FA.STATUS = 'A' AND FB.IDTASKGASTO = '4515947455273e63c4198f0073790158' AND FB.FCRESULTADO = 'Autorizado'
         ) UNION (SELECT   FA.IDGASTOMAIN GASTO, FA.FCCREDITOCARTERA CREDITO, TO_CHAR(FA.FDFECREGISTRO,'DD-MON-YY', 'nls_date_language=Spanish') FECHAREGISTRO,
         	       (SELECT   NMDESCRIP FROM   PENDUPM.CTCUENTACATEGORIA B
           		WHERE   IDCUENTACAT = (SELECT   IDCATEGORIA FROM   PENDUPM.CTCATALOGOCUENTAS C WHERE   C.IDCONCEPTO = FA.IDCONCEPTO)) CATEGORIA,
                       (SELECT   NMDESCRIP FROM PENDUPM.CTCUENTACATEGORIA B
           	WHERE   IDCUENTACAT = (SELECT   IDSUBCATEGORIA FROM   PENDUPM.CTCATALOGOCUENTAS C WHERE   C.IDCONCEPTO = FA.IDCONCEPTO)) SUBCATEGORIA,
         		(SELECT   NMCONCEPTO FROM   PENDUPM.CTCATALOGOCUENTAS WHERE   IDCONCEPTO = FA.IDCONCEPTO) NOMBRECONCEPTO,
         FA.IDCONCEPTO CONCEPTO, 
         (SELECT   \"nombreCompleto\"
            FROM   pendupm.vistaAsociados
           WHERE   \"cvetra\" = FA.FCUSUARIO)
            NOMBRESOLICITA,
         FA.FCUSUARIO SOLICITANTE,
         FA.FNIMPORTE IMPORTE,
         FA.FNIMPORTECOMPROBA IMPORTECOMPROBADO,
         TO_CHAR(FA.FDFECCOMPROBA,'DD-MON-YY', 'nls_date_language=Spanish') FECHACOMPROBA, CASE
            WHEN FA.FCESFACTURABLE = 'S' THEN 'SI'
            ELSE 'NO'
         END ESFACTURABLE,
         (CASE
            WHEN FCSTATUS = 'F' THEN 'FINALIZADO'
            WHEN FCSTATUS = 'Z' THEN 'CANCELADO'
            ELSE 'EN SOLUCION'
         END) STATUS, TO_CHAR(FDFECREALPAGO,'DD-MON-YY', 'nls_date_language=Spanish') FDFECREALPAGO, FCREMESA, 
                TO_CHAR(FDFECSERVPAGADODEL,'DD-MON-YY', 'nls_date_language=Spanish') FDFECSERVPAGADODEL,
		 TO_CHAR(FDFECSERVPAGADOAL,'DD-MON-YY', 'nls_date_language=Spanish') FDFECSERVPAGADOAL,  
CASE WHEN FCPAGADOPREVIAMENTE = 'S' THEN 'SI' ELSE 'NO' END FCPAGADOPREVIAMENTE, 
			TO_CHAR(FDFECCUMBREPAGO,'DD-MON-YY', 'nls_date_language=Spanish') FDFECCUMBREPAGO, FCCOMENTARIOPAGOSERV
		 FROM PENDUPM.FACTURAASIGNACION FA
         INNER JOIN
            PENDUPM.FACTURACIONMAIN FM
         ON (FA.IDGASTOMAIN = FM.IDGASTOMAIN AND FA.IDCONCEPTO=FM.IDCONCEPTO) 
         INNER JOIN PENDUPM.FACTURACIONBITACORA FB
           ON (FA.IDGASTOMAIN = FB.IDGASTOMAIN)
        WHERE FCCREDITOCARTERA = '$credito' AND FA.STATUS = 'A' ) ";



		$query = "SELECT FA.IDGASTOMAIN GASTO, TO_CHAR(FA.FDFECREGISTRO,'DD-MON-YY', 'nls_date_language=Spanish') FECHAREGISTRO,
			 FA.FCCREDITOCARTERA CREDITO,
                         (SELECT NMDESCRIP FROM   PENDUPM.CTCUENTACATEGORIA B
                          WHERE  IDCUENTACAT = (SELECT   IDCATEGORIA FROM   PENDUPM.CTCATALOGOCUENTAS C WHERE   C.IDCONCEPTO = FA.IDCONCEPTO)) CATEGORIA,
                         (SELECT NMDESCRIP FROM PENDUPM.CTCUENTACATEGORIA B
                          WHERE  IDCUENTACAT = (SELECT   IDSUBCATEGORIA FROM   PENDUPM.CTCATALOGOCUENTAS C WHERE   C.IDCONCEPTO = FA.IDCONCEPTO)) SUBCATEGORIA,
                         (SELECT NMCONCEPTO FROM   PENDUPM.CTCATALOGOCUENTAS WHERE   IDCONCEPTO = FA.IDCONCEPTO) NOMBRECONCEPTO,
                         FA.IDCONCEPTO CONCEPTO,
                         (SELECT \"nombreCompleto\" FROM pendupm.vistaAsociados WHERE \"cvetra\" = FA.FCUSUARIO) NOMBRESOLICITA,
                         FA.FCUSUARIO SOLICITANTE,
                         FA.FNIMPORTE IMPORTE,
                         FA.FNIMPORTECOMPROBA IMPORTECOMPROBADO,
                         TO_CHAR(FA.FDFECCOMPROBA,'DD-MON-YY', 'nls_date_language=Spanish') FECHACOMPROBA,
                         CASE WHEN FA.FCESFACTURABLE = 'S' THEN 'SI' ELSE 'NO' END ESFACTURABLE,
                         FCSTATUS,
                         (CASE WHEN FCSTATUS = 'F' THEN 'FINALIZADO' WHEN FCSTATUS = 'Z' THEN 'CANCELADO' ELSE 'EN SOLUCION' END) STATUS,
                         TO_CHAR(FDFECREALPAGO,'DD-MON-YY', 'nls_date_language=Spanish') FDFECREALPAGO,
                         TO_CHAR(FDFECSERVPAGADODEL,'DD-MON-YY', 'nls_date_language=Spanish') FDFECSERVPAGADODEL,
                         FCREMESA,
                         TO_CHAR(FDFECSERVPAGADOAL,'DD-MON-YY', 'nls_date_language=Spanish') FDFECSERVPAGADOAL,
                         CASE WHEN FCPAGADOPREVIAMENTE = 'S' THEN 'SI' ELSE 'NO' END FCPAGADOPREVIAMENTE,
                         TO_CHAR(FDFECCUMBREPAGO,'DD-MON-YY', 'nls_date_language=Spanish') FDFECCUMBREPAGO,
                         FCCOMENTARIOPAGOSERV,
                         FA.IDCOMPROBACION
                    FROM PENDUPM.FACTURAASIGNACION FA INNER JOIN PENDUPM.FACTURACIONMAIN FM
                                                          ON (FA.IDGASTOMAIN = FM.IDGASTOMAIN AND FA.IDCONCEPTO=FM.IDCONCEPTO)
                    WHERE FCCREDITOCARTERA = '$credito' AND FA.STATUS = 'A' AND FM.FCSTATUS != 'Z' ORDER BY FA.FDFECREGISTRO DESC ";



		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getDocumentsByCase($idGasto,$credito,$idConcepto)
	{
		$query = "(SELECT FCCONCEPTO CONCEPTO,'Comprobacion' TIPO,FCARCHIVOPDF PDF, FCARCHIVOXML XML 
                           FROM PENDUPM.FACTURACIONCOMPROBA WHERE IDGASTOMAIN = $idGasto)
			UNION
			(SELECT FCNOMBRE CONCEPTO,'Anexos' TIPO,FCRUTAFILE PDF, '' XML FROM PENDUPM.FACTURACIONANEXOS WHERE IDGASTOMAIN = $idGasto)
			UNION
			(SELECT FCTIPOCOTIZACION CONCEPTO,FCTIPOCOTIZACION TIPO,FCARCHIVOPDF PDF, FCARCHIVOXML XML 
                         FROM PENDUPM.FACTURACIONCOTIZA WHERE IDGASTOMAIN = $idGasto)
			UNION
			(SELECT FCNOMBRE CONCEPTO,'Doc Ini' TIPO,FCRUTAFILE PDF, '' XML FROM PENDUPM.FACTURADCINICIO WHERE IDGASTOMAIN = $idGasto)
			UNION
			(SELECT FCNOMBRE CONCEPTO,'Doc Sop' TIPO,FCRUTAFILE PDF, '' XML FROM PENDUPM.FACTURADCSOPORTE WHERE IDGASTOMAIN = $idGasto)";

		$query = "(SELECT FCCONCEPTO CONCEPTO,'Comprobacion' TIPO,FCARCHIVOPDF PDF, FCARCHIVOXML XML 
                           FROM PENDUPM.FACTURACIONCOMPROBA WHERE IDGASTOMAIN = $idGasto)";

		$query = "SELECT FCCONCEPTO CONCEPTO,FCTIPOCOMPROBANTE TIPO,FCARCHIVOPDF PDF, FCARCHIVOXML XML 
                      FROM PENDUPM.FACTURACIONCOMPROBA F INNER JOIN PENDUPM.FACTURAASIGNACION A ON F.IDCOMPROBACION = A.IDCOMPROBACION 
			 WHERE A.IDGASTOMAIN = $idGasto AND A.FCCREDITOCARTERA = '$credito' AND IDCONCEPTO = $idConcepto";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getIsPagosServ($credito)
	{
		$query = "SELECT  COUNT(1) TOTAL
	                  FROM PENDUPM.FACTURAASIGNACION FA INNER JOIN PENDUPM.FACTURACIONMAIN FM ON FA.IDGASTOMAIN = FM.IDGASTOMAIN 
	                  WHERE FCCREDITOCARTERA = '$credito' AND (FDFECREALPAGO IS NOT NULL 
                                 OR FCREMESA IS NOT NULL
                                 OR FDFECSERVPAGADODEL IS NOT NULL
                                 OR FDFECSERVPAGADOAL IS NOT NULL
                                 OR FCPAGADOPREVIAMENTE  IS NOT NULL
                                 OR FDFECCUMBREPAGO IS NOT NULL
                                 OR FCCOMENTARIOPAGOSERV IS NOT NULL)
                          ORDER BY FA.IDGASTOMAIN DESC";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function isPagosServ($concepto)
	{
		$query = "SELECT COUNT(1) TOTAL FROM PENDUPM.CTCATALOGOCUENTAS WHERE IDCONCEPTO = $concepto AND FCREQPAGSERV = 'S' ";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

}