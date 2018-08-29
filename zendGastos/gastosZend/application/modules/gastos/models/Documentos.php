<?php
class Gastos_Model_Documentos
{
	
	public function getDocumentos ( $caso, $concepto, $cuenta )
	{
		$query = "SELECT REPLACE(FCARCHIVOPDF,  'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=' , 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' ) FCARCHIVOPDF, 
		                 REPLACE(FCARCHIVOXML,  'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=' , 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' ) FCARCHIVOXML,
		                 REPLACE(FCARCHIVOPDFC, 'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=' , 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' ) FCARCHIVOPDFC,
		                 FC.UUID, FC.FCNOFACTURA, FC.FCRFC
		            FROM PENDUPM.FACTURAASIGNACION FA INNER JOIN PENDUPM.FACTURACIONCOMPROBA FC
		              ON FA.IDCOMPROBACION =  FC.IDCOMPROBACION
		           WHERE     FA.IDGASTOMAIN = $caso
                         AND FA.FCCREDITOCARTERA = '$cuenta'
                         AND FA.IDCONCEPTO = $concepto";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
	        $items = $Oracle->query($query);
        	return $items;
	}
	
	public function getDocumentosByLote ( $lote )
	{ 
		$query = "SELECT REPLACE(FC.FCARCHIVOPDF,  'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=' , 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' ) FCARCHIVOPDF, 
            REPLACE(FC.FCARCHIVOXML,  'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=' , 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' ) FCARCHIVOXML,
            REPLACE(FC.FCARCHIVOPDFC, 'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=' , 'http://doc.pendulum.com.mx/PM/gastos/comprobacion/' ) FCARCHIVOPDFC,
            CASE FC.UUID
                WHEN 'ERROR' THEN NULL
                WHEN 'NO VALIDO' THEN NULL
                WHEN 'UUID'  THEN NULL
                WHEN 'SIN TIMBRE' THEN NULL
                ELSE FC.UUID
            END UUID, FC.FCNOFACTURA, FC.FCRFC, RM.ID_ANTICIPO, RC.CONSECUTIVO
       FROM PENDUPM.FACTURAASIGNACION FA 
 INNER JOIN PENDUPM.FACTURACIONCOMPROBA FC
         ON FA.IDCOMPROBACION =  FC.IDCOMPROBACION
 INNER JOIN PENDUPM.REMESALAYOUT RC
         ON RC.IDGASTOMAIN = FA.IDGASTOMAIN AND FA.IDCONCEPTO = RC.IDCONCEPTO AND
            FA.FCCREDITOCARTERA = RC.FCCREDITOCARTERA 
 INNER JOIN PENDUPM.REMESAMAIN RM
         ON RC.ID_REMESA = RM.ID_REMESA
WHERE RC.NO_LOTE = $lote AND RC.ID_REMESA IS NOT NULL";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
	        $items = $Oracle->query($query);
        	return $items;
	}
	
	public function getXmlsuuid (  )
	{
		$query = "SELECT IDCOMPROBACION, IDGASTOMAIN, 
                 REPLACE(FCARCHIVOXML,'http://quantum1.pendulum.com.mx/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=','http://doc.pendulum.com.mx/PM/gastos/comprobacion/') DCXML 
                FROM PENDUPM.FACTURACIONCOMPROBA FC 
                 WHERE FCARCHIVOXML IS NOT NULL AND ( UUID IS NULL OR UUID = 'NO VALIDO' ) 
                 AND FDFECREGISTRO > TO_DATE('24/05/2018 00:00:01','DD/MM/YYYY HH24:MI:SS')";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
	        $items = $Oracle->query($query);
        	return $items;
	}
	
	public function setuuid( $idgasto, $idcomprobacion, $uuid ) {
		$query = "BEGIN UPDATE PENDUPM.FACTURACIONCOMPROBA
		         SET UUID = '$uuid'
                 WHERE IDGASTOMAIN = $idgasto AND IDCOMPROBACION = $idcomprobacion; COMMIT;END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
	    $items = $Oracle->queryupdate($query);
        return $items;
	}



    public function getDocumentosByRevision ( $datos )
    {
        $query = "BEGIN PENDUPM.PCKREMESACARTERA.getByRegionalConceptoRev(:RESDATA,'".urldecode($datos['regional'])."','".urldecode($datos['concepto'])."');END;";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
    }

}