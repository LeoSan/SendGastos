<?php
class Gastos_Model_Asignacionextranet
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
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.ADDCREDITOASIGNA(";
		$query .= $params['solicitudid']. ","; //pnSolicitud INTEGER
		$query .= "'" . $params['credito']. "',"; //psCredito VARCHAR2 /* SI  es psTipomovto = 4 [valor CARTERA]  psTipomovto = 42 [CONCEPTO ]*/
		$query .= $params['conceptoid']. ","; //pnConcepto NUMBER
		$query .= "'" . $params['tiposolicitud']. "',";
		$query .= $params['importe']. ","; //pnImporte NUMBER
		$query .= $params['tipoAsignacion']. ","; //psTipomovto INTEGER,  /* [2] X CREDITO , [3] MUT-CRED, [4] X CARTERA, [42] X IMP GRAL */
		$query .= $params['empleadoid']. ",";
		$query .= "'" . $params['usuariopm']. "',";
		$query .= "'" . $params['appuid']. "',";
		$query .= " :statAplica); END;";
		//echo $query;exit;
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
		$query .= " :statAplica); END;";
		//return $query;
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
		//echo $query;exit;
		/*
		return $query;
		*/
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
	
	public function  getCatConceptoAsig( $tiposolic, $queAsigna, $puesto )
	{
		$tiposolic = strtoupper($tiposolic);

		$query = "SELECT IDCUENTACAT IDVALOR, NMDESCRIP NMVALOR
			  FROM CTCUENTACATEGORIA A
			  WHERE FCSTATUS = 'A' AND IDCUENTACAT IN (SELECT IDCATEGORIA
					FROM CTCATALOGOCUENTAS
					WHERE FCSTATUS = 'A' AND APLICAPROCESO = 'S' AND FCPUESTOGASTO LIKE '%EXTERNO%'";

		if ($tiposolic == 'ANTICIPO' ) 
		{
			$query .= " AND FCANTICIPO = 'S' ";
		} else if ($tiposolic == 'REEMBOLSO') 
		{
			$query .= " AND FCREEMBOLSO = 'S' ";
		} else if ($tiposolic == 'TRAMITE') 
		{
			$query .= " AND FCTRAMITE = 'S' ";
		} else {
			$query .= " AND FCTRAMITE = 'X' ";
		}
		$query .= " ) ";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function getCategoriaCC()
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETCATEGORIACC(:RESDATA); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->getAll($query);
		return $items;
	}

	public function getMisConceptos( $empleadoId, $externo )
	{
		$query = "SELECT IDCONCEPTO, NMCONCEPTO FROM CTCATALOGOCUENTAS A WHERE FCPUESTOGASTO LIKE '%EXTERNO%'
				 AND FCSTATUS = 'A' AND APLICAPROCESO = 'S' ORDER BY 2";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function  getSbCatConceptoAsig( $categoria, $tiposolic, $queAsigna, $puesto )
	{
		//$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETSBCATCONCEPTOASIG(" . $categoria . ",'" . $tiposolic . "'," . $queAsigna . ",'" . $puesto . "', :RESDATA); END;";

		$tiposolic = strtoupper($tiposolic);

		$query = "SELECT IDCUENTACAT IDVALOR, NMDESCRIP NMVALOR FROM CTCUENTACATEGORIA A
             		WHERE IDHIJO = $categoria AND FCSTATUS = 'A' AND (IDHIJO,IDCUENTACAT) IN
                  (SELECT IDCATEGORIA,IDSUBCATEGORIA FROM CTCATALOGOCUENTAS WHERE FCSTATUS = 'A' AND APLICAPROCESO = 'S' AND FCPUESTOGASTO LIKE  '%EXTERNO%' ";


		if( $tiposolic == 'ANTICIPO' ) {
			$query .= " AND FCANTICIPO = 'S' ";
		} else if ( $tiposolic == 'REEMBOLSO' ) {
			$query .= " AND FCREEMBOLSO = 'S' ";
		} else if ( $tiposolic == 'TRAMITE' ) {
			$query .= " AND FCTRAMITE = 'S' ";
		} else {
			$query .= " AND FCTRAMITE = 'X' ";
		}

		if ( $queAsigna == 2 ) {
			$query .= " AND FCAPLCREDITO = 'S' ";
		} else if ( $queAsigna == 3 ) {
			$query .= " AND FCAPLMCREDITO = 'S' ";
		} else if ( $queAsigna == 4 ) {
			$query .= " AND FCAPLCARTERA = 'S' ";
		} else if ( $queAsigna == 42 ) {
			$query .= " AND FCAPLCREDITO IS NULL AND FCAPLMCREDITO IS NULL AND FCAPLCARTERA IS NULL ";
		}

      		$query .= " )  ORDER BY 2,1 ";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
		$items = $Oracle->query($query);
		return $items;
	}

	public function  getQueConceptoAsig( $categoria, $subcategoria, $tiposolic, $queAsigna, $puesto )
	{
		$puesto = strtoupper($puesto);
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
	
	
	
	public function getClaveQuasar( $empleadoId )
	{
		$query = "SELECT DISTINCT CLCOLLID FROM RCVRY.COLLID WHERE CLIDNUM = $empleadoId AND CLSTATUS <> '3'";
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        $cveQuasar = '0';
        foreach($items as $item):
        	$cveQuasar = $item['CLCOLLID'];
        endforeach;
        return $cveQuasar;
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

}