<?php
class Gastos_Model_ProrrateoComproba
{
	public function getDetalleCreditos($idSolicitud, $archivo )
	{
		$query = "BEGIN PENDUPM.PKG_GASTOS_PRORRATEO.SP_GET_PRORRATEOCREDITOSCOMP($idSolicitud, '$archivo', :RESDATA); END;";
		//echo $query;exit;
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);

        return $items;
	}
	
	public function setProrrateoCreditos( $idSolicitud, $archivo, $idempleado )
	{
		$query = "BEGIN PENDUPM.PKG_GASTOS_PRORRATEO.SP_SET_PRORRATEOCREDITOSCOMP('$idSolicitud', '$archivo', $idempleado, :statAplica, :totRegistros); END;";
		die($query);
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');

		$res = $Oracle->setValidar($query);
        return $res;
	}
}