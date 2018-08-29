<?php
class Gastos_Model_Doctossoporte
{
	public function getDetalleDoctosSoporte( $idSolicitud )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETDETALLEDOCSOPORTE(" . $idSolicitud . ", :RESDATA); END;";
		
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getDetDocSopArchS( $idSolicitud, $idConcepto, $nmdocumento )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETDETDOCSOPARCHS(" . $idSolicitud . "," . $idConcepto . ",'" . $nmdocumento . "', :RESDATA); END;";
		
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
	
	public function setAddDoctoSoporte( $query )
	{
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getOne($query);
        return $psError;
	}
}