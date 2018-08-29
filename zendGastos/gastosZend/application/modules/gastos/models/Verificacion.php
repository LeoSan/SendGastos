<?php
class Gastos_Model_Verificacion
{
	public function getDetalleComprobacion( $idSolicitud )
	{
		$query = "BEGIN PENDUPM.PCKFACTURACIONGASTO.GETDETALLEPARACOMPROBA(" . $idSolicitud . ", :RESDATA); END;";
		
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->getAll($query);
        return $items;
	}
	
	public function getDetallePagoServicios( $idSolicitud )
	{
		$query = "SELECT 
            ASI.FCCREDITOCARTERA,
            COM.FCNOFACTURA,
            ASI.FNIMPORTECOMPROBA,    
            PCKENVIOCORREO.aplFecha(ASI.FDFECREALPAGO) FECREALPAGO,
            ASI.FCREMESA,
            PCKENVIOCORREO.aplFecha(ASI.FDFECSERVPAGADODEL) FECSERVPAGADODEL,
            PCKENVIOCORREO.aplFecha(ASI.FDFECSERVPAGADOAL) FECSERVPAGADOAL,
            CASE WHEN ASI.FCPAGADOPREVIAMENTE = 'S' THEN 'SI' WHEN ASI.FCPAGADOPREVIAMENTE = 'N' THEN 'NO' ELSE '' END FCPAGADOPREVIAMENTE,
            PCKENVIOCORREO.aplFecha(ASI.FDFECCUMBREPAGO) FECCUMBREPAGO,
            ASI.FCCOMENTARIOPAGOSERV
            FROM FACTURAASIGNACION ASI
            INNER JOIN FACTURACIONCOMPROBA COM ON ASI.IDCOMPROBACION = COM.IDCOMPROBACION
            WHERE ASI.IDGASTOMAIN = $idSolicitud
       ORDER BY ASI.FDFECREGISTRO";
		
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getHayPagosServicios( $gastoId )
	{
		$query = "SELECT COUNT(*) HAY FROM PENDUPM.CTCATALOGOCUENTAS WHERE FCREQPAGSERV = 'S' 
			AND IDCONCEPTO IN(SELECT IDCONCEPTO FROM PENDUPM.FACTURAASIGNACION WHERE IDGASTOMAIN = $gastoId)";
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $respuesta = $Oracle->query($query);
        return $respuesta[0]["HAY"];
	}
	
	public function getComprobantesEncabezado($gastoId)
	{
		$query = "SELECT B.FCTIPOCOMPROBANTE, 
                (SELECT  COALESCE(SUM(FNTOTAL),0) AS TOTAL FROM FACTURACIONCOMPROBA WHERE FCTIPOCOMPROBANTE = B.FCTIPOCOMPROBANTE AND IDGASTOMAIN = $gastoId) TOTAL 
            FROM 
                (SELECT 'Factura' FCTIPOCOMPROBANTE FROM DUAL
                UNION
                 SELECT 'Recibo de honorarios' FCTIPOCOMPROBANTE FROM DUAL
                UNION
                 SELECT 'Comprobante' FCTIPOCOMPROBANTE FROM DUAL
                UNION
                 SELECT 'Ficha de Deposito' FCTIPOCOMPROBANTE FROM DUAL
                UNION
                 SELECT 'Descuento de nomina' FCTIPOCOMPROBANTE FROM DUAL
                UNION
                 SELECT 'Devolucion tarjeta corporativa' FCTIPOCOMPROBANTE FROM DUAL
                ) B";
		//return $query;
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getComprobantesPorTipo($gastoId, $tipoComprobante, $ip)
	{
		$targetFile = 'http:// ' . $ip . '/sysworkflow/es/classic/cases/cases_ShowGastosComp.php?archivo=';	
  
		$query = "SELECT IDGASTOMAIN, FCTIPOCOMPROBANTE, IDCOMPROBACION, IDUSUARIO, FDFECREGISTRO, FCTIPOCOMPROBANTE, FCRFC, FCNOFACTURA, FNIMPORTE, FNIVA, FNIMPIVA,
                     CASE WHEN FCTIPOCOMPROBANTE = 'Recibo de honorarios' THEN FNIVARET ELSE FNOTROSIMPUEST END FNOTROSIMPUEST, FNIVARET, FNISR, 
                     FNTOTAL, FCCOMENTARIO,  REPLACE(FCARCHIVOXML, '$targetFile','http://doc.pendulum.com.mx/PM/gastos/comprobacion/') FCARCHIVOXML,
                    FDARCHIVOXML,  REPLACE(FCARCHIVOPDF, '$targetFile','http://doc.pendulum.com.mx/PM/gastos/comprobacion/') FCARCHIVOPDF,
                     FDARCHIVOPDF, FCVALIDACION, FCCONCEPTO, FDCOMPROBACION, NMRFC, NMORIGXML, NMORIGPDF
            FROM PENDUPM.FACTURACIONCOMPROBA CG WHERE IDGASTOMAIN = $gastoId AND FCTIPOCOMPROBANTE = '$tipoComprobante' ORDER BY FDFECREGISTRO, IDCOMPROBACION ASC";
		//return $query;  
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
	public function getExisteCuenta( $cuenta )
	{
		$query = "SELECT ( CASE WHEN COUNT(1) = 0 THEN 'NO' WHEN COUNT(1) > 0 THEN 'SI'
                    END) EXISTE FROM RCVRY.DELQMST WHERE DMACCT = '$cuenta'";
  
		$Oracle = Pendum_Db_DbFactory::factory('oracle');
        $items = $Oracle->query($query);
        return $items;
	}
	
}