<?php

class Pendum_Db_DbFactory
{
	const ORACLE = 'oracle';
	
	public function __construct(){}
	
	public static function factory($manejador)
	{
		switch($manejador) {
			case 'oracle':
				return Pendum_Db_Oracle::getInstance();
				break;
			case 'rh':
				return Pendum_Db_SqlServerRh::getInstance();
				break;
			case 'finanzas':
				return Pendum_Db_Finanzas::getInstance();
				break;
			case 'mysql':
				return Pendum_Db_Mysql::getInstance(); // ProcessMaker
				break;
			case 'dynamics':
				return Pendum_Db_Dynamics::getInstance();
				break;
			case 'gastosbi':
				return Pendum_Db_GastosBi::getInstance();
				break;
			case 'matrixdb':
				return Pendum_Db_MatrixDb::getInstance();
				break;
		}
	}
	
	static protected $instance = null;
	
	public static function getInstance()
	{
		if (!isset(self::$instance)) {
			self::$instance = new self();
		}
		
		return self::$instance;
	}
	
	private function connect()
	{
		$oracleConfig = Zend_Registry::get('oracle')->params->toArray();
    	$conn = oci_connect($oracleConfig['username'], $oracleConfig['password'], $oracleConfig['dbname'], $oracleConfig['charset']);
    	if (!$conn) {
		   return false;
		}
		
		return $conn;
	
	}
	
	public function get($where = 'null')
	{
		
	}
	
	public function query($query)
	{
		try {
        	$conn = $this->connect();
        	//$query = "SELECT * FROM CTMENUARCHIVO WHERE IDPADRE=1";
        	$result = oci_parse($conn, $query);
			oci_execute($result, OCI_DEFAULT);
			$items = array();
			while($data = oci_fetch_array($result, OCI_ASSOC + OCI_RETURN_NULLS)) {
				$items[] = $data;
			}
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Error Oracle\n" . $e->getMessage());
        }
        return $items; 
	}
	
    public function getQuasarUserMail($username) 
    {
        try 
        {
			$conn = $this->connect();
			$query = "SELECT CLMAIL FROM RCVRY.COLLID WHERE CLCOLLID = '" . $username . "'";
        	$result = oci_parse($conn, $query);
            oci_execute($result, OCI_DEFAULT);
            $email = oci_fetch_row($result);
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Cant obtain TipoTramiteCol\n" . $e->getMessage());
        }
        return $email[0]; 
    }
    
    public function getMenuArchivo() 
    {
    	try {
        	$conn = $this->connect();
        	$query = "SELECT * FROM CTMENUARCHIVO WHERE IDPADRE=1";
        	$result = oci_parse($conn, $query);
			oci_execute($result, OCI_DEFAULT);
			$items = array();
			while($data = oci_fetch_array($result, OCI_ASSOC + OCI_RETURN_NULLS)) {
				$items[] = $data;
			}
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Cant obtain Quasar Email\n" . $e->getMessage());
        }
        return $items;     	
    }
    
	public function getCountExpedienteArchivo() 
    {
    	try {
        	$conn = $this->connect();
        	$query = "SELECT COUNT(*) FROM EXPEDIENTEARCHIVO";
        	$result = oci_parse($conn, $query);
			oci_execute($result, OCI_DEFAULT);
			$count = oci_fetch_row($result);
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Cant obtain count for Expediente Archivo\n" . $e->getMessage());
        }
        return $count[0];     	
    }
    
    public function getExpedienteArchivo($sidx, $sord, $start, $limit, $where) 
    {
    	try {
        	$conn = $this->connect();
        	if (empty($where)) {
        		$query = "SELECT * FROM EXPEDIENTEARCHIVO WHERE IDEXPEDIENTE BETWEEN " . $start . " AND " . $limit . " ORDER BY " . $sidx . " " . $sord;
        	} else {
        		$query = "SELECT * FROM EXPEDIENTEARCHIVO WHERE " . $where . " ORDER BY " . $sidx . " " . $sord;
        	}
        	error_log('query: ' . $query);
        	$result = oci_parse($conn, $query);
			oci_execute($result, OCI_DEFAULT);
			$items = array();
			while($data = oci_fetch_array($result, OCI_ASSOC + OCI_RETURN_NULLS)) {
				$items[] = $data;
			}
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Cant obtain Expediente Archivo\n" . $e->getMessage());
        }
        return $items;     	
    }
   public function getTipoInventario()
    {  
        $query = "SELECT IDCATARCH AS IDPROCESO , NMDESCRIPCION AS DESCRIPCION FROM CTCATALOGOARCHIVO
         WHERE  IDHIJO  = 1 
         AND FCSTATUS = 'A'";
        
        $conn = $this->connect();
        
        $result = oci_parse($conn, $query);
        oci_execute($result, OCI_DEFAULT);

        $items=array();
        while($data = oci_fetch_array($result, OCI_ASSOC + OCI_RETURN_NULLS)) {
                $items[] = $data;
        }
        return $items;
    }
     public function connect_mysqlserver(){
    
//        $conn = mssql_connect('10.73.98.17','puntualidad', 'puntualidad');
        $conn = mssql_connect('MXVWNOM01P.pendulum.com.mx','puntualidad', 'puntualidad');
        $selected = mssql_select_db('aspnet', $conn);
        if(!$selected){
            die("Couldn't open database SAC");
    }
        if (!$conn) {
           return false;
        }
        
       return $conn;

    }

   public function getUserData($email){

         $query = "SELECT cvetra numEmpleado,
                     cveUbicacion idSucursal, 
                     ubicacion Sucursal, 
                     cveArea  idArea, 
                     Area ,  
                     cvetra_jefe empJefe, 
                     nombre_Jefe 
                 FROM dbo.VistaAsociados WHERE email = '$email'";

                 
        $conn = $this->connect_mysqlserver();
        $result = mssql_query($query);  
        $items=array();
        while($row = mssql_fetch_array($result)) {
                $items[] = $row;
        }
        
        mssql_close($conn);
        return $items;
    }

}
?>