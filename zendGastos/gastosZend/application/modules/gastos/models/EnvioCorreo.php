<?php

class Gastos_Model_EnvioCorreo
{
	public function getCorreoEnviar()
	{
		$query = "BEGIN PENDUPM.PCKENVIOCORREO.getCorreosEnvioGasto(:RESDATA); END;";

		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $detalleCorreo = $Oracle->getAll($query);
        return $detalleCorreo;
	}
	
	public function setCorreoEnviado($casoid, $consecutivo)
	{
		$query = "BEGIN UPDATE FACTURACORREOS SET FDFECENVIO = SYSDATE WHERE IDGASTOMAIN = $casoid AND IDCONSEC = $consecutivo; COMMIT; END;";
		//echo $query;exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->queryupdate($query);
        return $psError;
	}
	
	public function getEnvCorreoNotifPagoProv($userid)
	{
		$query = "BEGIN PENDUPM.PCKENVIOCORREO.envCorreoNotifPagoProv($userid, :RESDATA); END;";
		//echo $query;exit;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->getAll($query);
        return $psError;
	}
	
	public function getCorreoEnviarDyn()
	{
		$query = "BEGIN PENDUPM.PCKENVIOCORREO.getCorreosEnvioDyn(:RESDATA); END;";
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $detalleCorreo = $Oracle->getAll($query);
        return $detalleCorreo;
	}
	
	public function setCorreoEnviadoDyn($referencia, $idproveedor, $idcuentadeposito)
	{
		$query = "BEGIN UPDATE FACTURACORREODYN SET FDFECENVIO = SYSDATE WHERE FCREFERENCIA = '$referencia' AND IDPROVEEDOR = '$idproveedor' AND FCCUENTADEPOSITO = '$idcuentadeposito'; COMMIT; END;";
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $psError = $Oracle->queryupdate($query);
        return $psError;
	}
}