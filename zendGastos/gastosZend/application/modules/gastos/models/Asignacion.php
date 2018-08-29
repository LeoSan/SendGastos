<?php
class Gastos_Model_Asignacion
{
	public function getDetalleAsignacion( $idSolicitud )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETDETALLEASIGNACION(" . $idSolicitud . ", :RESDATA); END;";
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);

        return $items;
	}
	
	public function getTipoMovimiento( $idSolicitud )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETTIPOMOVIMIENTO(" . $idSolicitud . ", :RESDATA); END;";
		//$query = "BEGIN PENDUPM.PCKCATALOGOS.GETMENUOPERATIVO( 'jccabrera', :RESDATA); END;";
		
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getConceptosolicitud( $idSolicitud, $tipoMovimiento )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETCONCEPTOSOLICITUD(" . $idSolicitud . "," . $tipoMovimiento . ", :RESDATA); END;";
		
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getCategoriaCC()
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETCATEGORIACC(:RESDATA); END;";
		
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getCCSolicitud( $idCategoria )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETCCSOLIC('" . $idCategoria . "', :RESDATA); END;";
		
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getCarteraConcepto( $idConcepto )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETCARTERACONCEPTO(" . $idConcepto . ", :RESDATA); END;";

		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function validaTipoMovimiento( $idSolicitud, $tipoMovimiento )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.VALIDATIPOMOVIMIENTO(" . $idSolicitud . "," . $tipoMovimiento . ", :statAplica); END;";
		
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function borraAsignacionsolic( $idSolicitud )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.BORRAASIGNACIONSOLIC(" . $idSolicitud . ", :statAplica); END;";
		
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function geTipoAsigActual($solicitudid = '')
	{
		$query = "SELECT PCKCATALOGOS.queTipoAsignatiene(" . $solicitudid . ") TIPO FROM DUAL";
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $tipo = $Oracle->query($query);
        return $tipo;
	}
	
	public function addCreditoAsigna( $params )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.ADDCREDITOASIGNACION(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= "'" .trim( $params['credito'] ). "',"; //psCredito VARCHAR2 /* SI  es psTipomovto = 4 [valor CARTERA]  psTipomovto = 42 [CONCEPTO ]*/
		$query .= $params['conceptoid']. ","; //pnConcepto NUMBER
		$query .= "'" . $params['tiposolicitud']. "',";
		$query .= $params['importe']. ","; //pnImporte NUMBER
		$query .= $params['tipoAsignacion']. ","; //psTipomovto INTEGER,  /* [2] X CREDITO , [3] MUT-CRED, [4] X CARTERA, [42] X IMP GRAL */
		$query .= $params['empleadoid']. ",";
		$query .= "'" . $params['usuariopm']. "',";
		$query .= "'" . $params['appuid']. "',";
		$query .= "'" . $params['fpagoini']. "',";
        $query .= "'" . $params['fpagofin']. "',";
        $query .= "'" . $params['fechaejec']. "',";
		$query .= " :statAplica); END;";
		
		//echo $query;exit;
		if( $params['solicitudid'] == 4345965  ) {
    	//	var_dump($query);exit;
    	}
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function addCarteraAsigna( $params )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.ADDCARTERAASIGNA(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= "'" . $params['cartera']. "',"; //psCredito VARCHAR2 /* SI  es psTipomovto = 4 [valor CARTERA]  psTipomovto = 42 [CONCEPTO ]*/
		$query .= $params['conceptoid']. ","; //pnConcepto NUMBER
		$query .= "'" . $params['tiposolicitud']. "',";
		$query .= $params['importe']. ","; //pnImporte NUMBER
		$query .= $params['tipoAsignacion']. ","; //psTipomovto INTEGER,  /* [2] X CREDITO , [3] MUT-CRED, [4] X CARTERA, [42] X IMP GRAL */
		$query .= $params['empleadoid']. ",";
		$query .= "'" . $params['usuariopm']. "',";
		$query .= "'" . $params['appuid']. "',";
		$query .= "'" . $params['ccosto']. "',";
		$query .= " :statAplica); END;";

		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function addImporteAsigna( $params )
	{
		if( !isset($params['planviaje']) || $params['planviaje'] == '' || $params['planviaje'] == 0 ) {
			$params['planviaje'] = "''"; 
		}
		
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.ADDIMPORTEASIGNA(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= $params['conceptoid']. ","; //pnConcepto NUMBER
		$query .= "'" . $params['tiposolicitud']. "',";
		$query .= $params['importe']. ","; //pnImporte NUMBER
		$query .= $params['tipoAsignacion']. ","; //psTipomovto INTEGER,  /* [2] X CREDITO , [3] MUT-CRED, [4] X CARTERA, [42] X IMP GRAL */
		$query .= $params['empleadoid']. ",";
		$query .= "'" . $params['usuariopm']. "',";
		$query .= "'" . $params['appuid']. "',";
		$query .= "'" . $params['ccosto']. "',";
		$query .= "" . $params['planviaje']. ",";
		$query .= "'" . $params['fechaejec']. "',";
		$query .= " :statAplica); END;";
		//echo $query; exit; 
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
		return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function validaArchivoAsigna( $params )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.VALIDAARCHIVOASIGNA(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= $params['conceptoid']. ","; // pnConcepto         NUMBER,
		$query .= "'" . $params['tiposolicitud']. "',";
		$query .= "'" . $params['tipoAsignacion']. "',"; // tipoAsignacion         NUMBER,
		$query .= "'" . $params['archivo']. "',"; //psNmFile VARCHAR2
		$query .= $params['empleadoid']. ",";
		$query .= "'" . $params['usuariopm']. "',";
		$query .= "'" . $params['appuid']. "',";
		$query .= " :statAplica, :totRegistros); END;";
		//echo $query;exit;
		/*
		$response['error'] = $query;
		return $response;
		*/
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->setValidar($query);
        return $psError;
	}
	
	public function delAsignacionsolicitud( $params )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.DELASIGNACIONSOLICITUD(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= "'" . $params['concepto']. "',"; //pnConcepto INTEGER
		$query .= "'" . $params['credito']. "',"; //psValor VARCHAR2
		$query .= " :statAplica); END;";
		//echo $query;exit;
		/*
		$response['error'] = $query;;
		return $response;
		*/
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function validaMasivaCreditoAsigna( $params )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.VALIDAMASIVACREDITOASIGNA(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= $params['tipoAsignacion']. ","; //psTipomovto INTEGER,  /* [2] X CREDITO , [3] MUT-CRED, [4] X CARTERA, [42] X IMP GRAL */
		$query .= "'" . $params['archivo']. "',"; //psNmFile VARCHAR2
		$query .= " :statAplica); END;";
//		echo $query;exit;
		/*
		return $query;
		*/
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function  getCatConceptoAsig( $tiposolic, $queAsigna, $puesto )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETCATCONCEPTOASIG('" . $tiposolic . "'," . $queAsigna . ",'" . $puesto . "', :RESDATA); END;";
		//$query = "BEGIN PENDUPM.PCKCATALOGOS.GETMENUOPERATIVO( 'jccabrera', :RESDATA); END;";
		//echo $query; exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function  getSbCatConceptoAsig( $categoria, $tiposolic, $queAsigna, $puesto )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETSBCATCONCEPTOASIG(" . $categoria . ",'" . $tiposolic . "'," . $queAsigna . ",'" . $puesto . "', :RESDATA); END;";
		//$query = "BEGIN PENDUPM.PCKCATALOGOS.GETMENUOPERATIVO( 'jccabrera', :RESDATA); END;";
//		var_dump( $query );
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function  getQueConceptoAsig( $categoria, $subcategoria, $tiposolic, $queAsigna, $puesto )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETQUECONCEPTOASIG(" . $categoria . "," . $subcategoria . ",'" . $tiposolic . "'," . $queAsigna . ",'" . $puesto . "', :RESDATA); END;";
		//$query = "BEGIN PENDUPM.PCKCATALOGOS.GETMENUOPERATIVO( 'jccabrera', :RESDATA); END;";
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function  getQueConceptoNmAsig( $categoria, $subcategoria, $texto, $tiposolic, $queAsigna, $puesto )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETQUECONCEPTONMASIG(" . $categoria . "," . $subcategoria . ",'" . $texto . "','" . $tiposolic . "'," . $queAsigna . ",'" . $puesto . "', :RESDATA); END;";
		//$query = "BEGIN PENDUPM.PCKCATALOGOS.GETMENUOPERATIVO( 'jccabrera', :RESDATA); END;";
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getMisConceptos( $empleadoId, $externo )
	{
		//$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETMISCONCEPTOS(" . $empleadoId . ", :RESDATA); END;";
	$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETMISCONCEPTOS('" . $empleadoId . "',".$externo.", :RESDATA); END;";	
	//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getClaveCyber( $empleadoId )
	{
		$query = "SELECT DISTINCT CLCOLLID FROM RCVRY.COLLID WHERE CLIDNUM = $empleadoId AND CLSTATUS <> '3'";
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        $cveCyber = '0';
        foreach($items as $item):
        	$cveCyber = $item['CLCOLLID'];
        endforeach;
        return $cveCyber;
	}

	public function getMisJuicios( $usuario,$externo )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETMISJUICIOS('" . $usuario . "', :RESDATA); END;";
		//var_dump($query );exit();
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getInfoJuicio( $idjuicio )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETINFOJUICIO('" . $idjuicio . "', :RESDATA); END;";
		//var_dump($query );exit();
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}

	public function getInfoCredito( $usuario, $credito = "", $acreditado = "" )
	{
		$query = "SELECT   CASEACCT.CCACCT || ' - ' || CASE.CECASENO credito_juicio,
	         CASEACCT.CCACCT credito,
        	 CASE.CECASENO juicio,
	         CASE.CESTATUS estatus_juicio,
        	 CASE.CEEXTLWYR cve_externo,
	         CASE.CENAME ACREDITADO,
        	 CASE.CESUPVLWYR cve_supervisor,
	         USR_SUPERVISOR.CLNAME nombre_supervisor,
        	 USR_SUPERVISOR.CLMAIL mail_supervisor,
	         USR_SUPERVISOR.CLIDNUM num_emp_supervisor,
        	 USR_SUPERVISOR.CLSTATUS estatus_supervisor
	  FROM   RCVRY.CASE,
        	 RCVRY.CASEACCT,
	         RCVRY.COLLID USR_EXTERNO,
        	 RCVRY.COLLID USR_SUPERVISOR
	 WHERE   (CASE.CECASENO = CASEACCT.CCCASENO)
        	 AND (USR_EXTERNO.CLCOLLID = CASE.CEEXTLWYR)
	         AND (USR_SUPERVISOR.CLCOLLID = CASE.CESUPVLWYR)
		 AND ceextlwyr = '$usuario'";

		if( $credito != "0" && $credito != "" ) { 
			$query .= " AND (CASEACCT.CCACCT = '$credito') ";
		}
		if( $acreditado != "0" ) {
			$query .= " AND CASE.CENAME LIKE '%$acreditado%' ";
		}

		$query .= " ORDER BY CASEACCT.CCACCT ";

//		var_dump($query);exit(); 
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
	        $items = $Oracle->query($query);
        	return $items;
	}

	public function changeAutorizador($params)
	{
		  $query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.SETSUPERVISORBYEXTERNO(".$params["solicitudid"].",'".$params["emailsupervisor"]."','".$params["numsupervisor"]."','".$params["empleadoid"]."',:RESDATA); END;";
	//	$query = "BEGIN UPDATE FACTURACIONAUT
    //            SET FCAUTORIZADOR = '".$params["emailsupervisor"]."', FCUSUARIOAUTORIZA = ".$params["numsupervisor"]."
    //            WHERE IDGASTOMAIN = ".$params["solicitudid"]." AND IDDELINDEX = 1; END;";
		
	//	  var_dump($query );exit();
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getEsPagoDeServicio($conceptoid = '0')
    {
        $query = "SELECT CASE WHEN FCREQPAGSERV = 'S' THEN 'SI' ELSE 'NO' END HAY FROM PENDUPM.CTCATALOGOCUENTAS WHERE IDCONCEPTO = $conceptoid";
        //return $query;
        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }
    
	public function getConfiguracionFechas($conceptoid = '0')
    {
        $query = "SELECT RANGOTIEMPO, MEDIDATIEMPO FROM PENDUPM.CTCONFIGPAGOSERVICIOS WHERE FCSTATUS = 'A' AND IDCONCEPTO = $conceptoid";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }
    
	public function getDatesMax($conceptoid = '0',$credito,$configdates)
    {
        $query = "select TO_CHAR(ADD_MONTHS(FDFECSERVPAGADOAL+1,".$configdates[0]['RANGOTIEMPO']."),'DD/MM/YYYY') FECAL, TO_CHAR(FDFECSERVPAGADOAL+1,'DD/MM/YYYY') FECDEL, FDFECCUMBREPAGO
                    from PENDUPM.FACTURAASIGNACION
                   WHERE FDFECSERVPAGADOAL = (
                        select  MAX(FDFECSERVPAGADOAL)
                         from PENDUPM.FACTURAASIGNACION 
                        where idconcepto = $conceptoid AND FCCREDITOCARTERA = '$credito'
                   ) and idconcepto = $conceptoid AND FCCREDITOCARTERA = '$credito'";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }
    
	public function getConfigPlanviaje($conceptoid) {
    	$query = "SELECT COUNT(IDCONCEPTOFACTURA) EXISTE FROM PENDUPM.CONCEPTOGASTO WHERE IDCONCEPTOFACTURA = $conceptoid";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }
    
    public function getLastPlanviaje( $idgasto, $idconcepto ) {
    	
    	$query = "SELECT IDPLANVIAJE PLANVIAJE FROM PENDUPM.FACTURAASIGNACION WHERE IDGASTOMAIN = $idgasto AND IDCONCEPTO = $idconcepto";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }
    
    public function getLastPartida($idgasto) {
    	$query = "SELECT FA.IDCONCEPTO FROM PENDUPM.FACTURAASIGNACION FA INNER JOIN PENDUPM.CONCEPTOGASTO
          ON FA.IDCONCEPTO = IDCONCEPTOFACTURA WHERE FA.IDCONCEPTO IN (1043,1045) AND FA.IDGASTOMAIN = $idgasto";
    	
    	$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }
    
	public function getPlanviajeValido($idtask,$idgasto=0) {
		$where = '';
		if ($idgasto != 0) {
			$where = " AND APP_NUMBER = $idgasto ";
		}
		
    	$query = "SELECT APP_NUMBER IDGASTO FROM APP_CACHE_VIEW 
    	           WHERE PRO_UID = '62298808750576cfc307717079255213' $where 
                   -- AND APP_STATUS LIKE 'TO_DO'
                    AND TAS_UID = '$idtask'
                    AND DEL_THREAD_STATUS LIKE 'OPEN' ORDER BY APP_NUMBER DESC LIMIT 0,10";

        $Mysql = Pendum_Db_DbFactory::factory('mysql');
        $datos = $Mysql->getAll($query);
        return $datos;
    }
 
    public function getPlanviajeVerificado( $idgasto, $idconcepto ) {

    	$query = "SELECT FA.IDGASTOMAIN FROM PENDUPM.FACTURAASIGNACION FA INNER JOIN PENDUPM.FACTURACIONMAIN FM ON FA.IDGASTOMAIN = FM.IDGASTOMAIN 
                   WHERE FM.FCSTATUS NOT IN ('Z') AND FA.IDPLANVIAJE = $idgasto AND FA.IDCONCEPTO = $idconcepto GROUP BY FA.IDGASTOMAIN";

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }
    
    public function getAlarmasTitulos($idgasto,$etapa) 
    {
    	$filtro = '';
    	if ( $etapa == 'ET' ){
    		$filtro = ' AND IDTIPOAUTORIZA = 6 ';
    	}
    	
    	$query = "SELECT DISTINCT IDTIPOAUTORIZA, (NMTASK||' '||NMSUBTASK) AUTORIZACION
                    FROM PENDUPM.FACTURACIONAUT FA INNER JOIN PENDUPM.CTETAPASFACTURACION EF
                      ON FA.IDTIPOAUTORIZA = EF.TPOAUT WHERE IDGASTOMAIN = $idgasto AND FDFECAUTORIZA IS NULL ".$filtro;

        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }

    public function getAlarmaDetalle($idgasto,$id_alarma,$condicion,$campo_justificacion, $campo_resultado, $campo_usuario) {
    	$query = "SELECT (SELECT NMDESCRIP  FROM PENDUPM.CTCUENTACATEGORIA C 
							 WHERE C.IDCUENTACAT = (SELECT IDCATEGORIA FROM PENDUPM.CTCATALOGOCUENTAS H 
							                         WHERE A.IDCONCEPTO = H.IDCONCEPTO)) CATEG,
			 			 (SELECT NMDESCRIP  FROM PENDUPM.CTCUENTACATEGORIA C  
						     WHERE C.IDCUENTACAT = (SELECT IDSUBCATEGORIA FROM PENDUPM.CTCATALOGOCUENTAS H 
						                             WHERE A.IDCONCEPTO = H.IDCONCEPTO)) CATEGSUBCAT,
						 (SELECT NMCONCEPTO FROM PENDUPM.CTCATALOGOCUENTAS B 
						     WHERE B.IDCONCEPTO = A.IDCONCEPTO) CONCEPTO, IDCONCEPTO, FCCREDITOCARTERA, 
						   CASE WHEN $id_alarma = 6 THEN PENDUPM.PCKCONVENIOS.formatComas(FNIMPORTE) 
								WHEN $id_alarma = 8 THEN TO_CHAR(FNPAGODOBLE)
                                WHEN $id_alarma = 45 THEN  'ETAPA CRR/VER: '||VERETAPAFIN
                                WHEN $id_alarma = 46 THEN  
                                      CASE WHEN FCCREDSTATUS IS NOT NULL THEN 'ESTATUS: '||NVL(FCCREDSTATUS,'')  END||' '||
                                      CASE WHEN FCCREDCOLA IS NOT NULL THEN 'COLA: '||NVL(FCCREDCOLA,'') END
								WHEN $id_alarma = 7 THEN 
								      CASE WHEN VERETAPACDACHK IS NOT NULL THEN 'ETAPA CRR/VER: '||VERETAPACDACHK END||' '||
                                      CASE WHEN VERETAPAABIERTA IS NOT NULL THEN 'ETAPA ABR: '||VERETAPAABIERTA END||' '||
                                      CASE WHEN FCCODACCEXT IS NOT NULL THEN 'CA: '||FCCODACCEXT END||' '||
                                      CASE WHEN FCCODRESEXT IS NOT NULL THEN 'CR: '||FCCODRESEXT END
                                WHEN $id_alarma = 67 THEN PENDUPM.PCKCONVENIOS.formatComas(FNIMPORTE)
                             else ''
                           END FNIMPORTE, 
                           IDCONCEPTO,TO_CHAR(FDFECREGISTRO, 'DDMMYYYYHH24MISS') FECHAREGISTRO,
						FCDETALLECREDITO, $campo_justificacion, $campo_resultado, $campo_usuario
						FROM PENDUPM.FACTURAASIGNACION A WHERE IDGASTOMAIN = $idgasto 
						$condicion";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }
    
    public function getValidaFechaEjecucion( $conceptoid ) {
    	$query = "SELECT COUNT(1) TOTAL FROM PENDUPM.CTCATALOGOCUENTAS 
                   WHERE FCREQFECHAEJEC = 'S' AND AUTETAPAFECHAEJEC IS NOT NULL
                         AND IDCONCEPTO = $conceptoid";
    
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $res = $Oracle->query($query);
        return $res;
    }

    public function getConceptosPuestoTC($params)
    {
        $query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.getConceptosPuestoTC(:RESDATA,'".$params["puestoid"]."','".$params["tiposolicitud"]."',".$params["tipocaptura"]."); END;";
        $Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        $arrayConceptosBuscardor = array();
        $arrayFilters = array();
        $arrayCategoria = array();
        $arraySubCategoria = array();
        $arrayConcepto = array();
        $arrayCartera = array();
        $flagCategoria = 0;
        $flagSubCategoria = 0;
        $flagConcepto = 0;

        foreach ($items as $ind=>$i){
            $arrayConceptosBuscardor[] =array("id"=>$i['IDCONCEPTO'],"label"=>utf8_encode($i['CONCEPTOS']),"idcategoria"=>$i['IDCATEGORIA'],"idsubcategoria"=>$i['IDSUBCATEGORIA']);
//            $arrayConceptosBuscardor[] =utf8_encode($i['CONCEPTOS']);
            $arrayFilters[$i['IDCONCEPTO']]['CATEGORIA'] = array("IDCATEGORIA"=>$i['IDCATEGORIA'],"CATEGORIA"=>utf8_encode($i['CATEGORIA']));
            $arrayFilters[$i['IDCONCEPTO']]['SUBCATEGORIA'] = array("IDSUBCATEGORIA"=>$i['IDSUBCATEGORIA'],"SUBCATEGORIA"=>utf8_encode($i['SUBCATEGORIA']));
            $arrayFilters[$i['IDCONCEPTO']]['CONCEPTO'] = array("IDCONCEPTO"=>$i['IDCONCEPTO'],"CONCEPTOS"=>utf8_encode($i['CONCEPTOS']));
            if($flagCategoria != $i['IDCATEGORIA']){
                $arrayCategoria[$i['IDCATEGORIA']]=array("IDCATEGORIA"=>$i['IDCATEGORIA'],"CATEGORIA"=>utf8_encode($i['CATEGORIA']));
                $flagCategoria = $i['IDCATEGORIA'];
            }
            if($flagSubCategoria != $i['IDSUBCATEGORIA']){
                $arraySubCategoria[$i['IDCATEGORIA']][]=array("IDCATEGORIA"=>$i['IDCATEGORIA'],"IDSUBCATEGORIA"=>$i['IDSUBCATEGORIA'],"SUBCATEGORIA"=>utf8_encode($i['SUBCATEGORIA']));
                $flagSubCategoria = $i['IDSUBCATEGORIA'];
            }
            if($flagConcepto != $i['IDCONCEPTO']){
                $arrayConcepto[$i['IDSUBCATEGORIA']][]=array("IDSUBCATEGORIA"=>$i['IDSUBCATEGORIA'],"IDCONCEPTO"=>$i['IDCONCEPTO'],"CONCEPTO"=>utf8_encode($i['CONCEPTOS']));
                $flagConcepto = $i['IDCONCEPTO'];
            }

            $arrayCartera[$i['IDCONCEPTO']]=$this->getCarteraConcepto($i['IDCONCEPTO']);



        }



        $info = array("arrayConceptosBuscardor"=>json_encode($arrayConceptosBuscardor),
            "arrayFilters"=>json_encode($arrayFilters),
            "arrayCategoria"=>json_encode($arrayCategoria),
            "arraySubCategoria"=>json_encode($arraySubCategoria),
            "arrayConcepto"=>json_encode($arrayConcepto),
            "arrayCategoriaView"=>$arrayCategoria,
            "arraySubCategoriaView"=>$arraySubCategoria,
            "arrayConceptoView"=>$arrayConcepto,
        );

        return $info;
    }
    
}