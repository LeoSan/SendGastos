<?php
class Gastos_Model_Doctosinicio
{
	public function getDetalleDoctosinicio( $idSolicitud )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETDETALLEDOCINI(" . $idSolicitud . ", :RESDATA); END;";
		
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getDetDocIniArchS( $idSolicitud, $idConcepto, $nmdocumento )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETDETDOCINIARCHS(" . $idSolicitud . "," . $idConcepto . ",'" . $nmdocumento . "', :RESDATA); END;";

		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getLwDigital( $credito )
    {
    	$query = "BEGIN PENDUPM.PCKCTRLDOCUMENTAL01.GETLWDIGITAL( '" . $credito . "', :RESDATA); END;";
    	//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
    }
	
	public function setAddDoctoInicio( $query )
	{
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
}