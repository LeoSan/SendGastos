<?php 
/**
 * 
 * Clase Factory que se encarga de crear los Objetos :
 * Oracle,
 * SqServerRh,
 * Dynamics
 * 
 * @author mamartinez
 *	
 */
class  Pendum_Db_Oracle
{
	static protected $instance = null;
	
	public static function getInstance()
	{
		if (!isset(self::$instance)) {
			self::$instance = new self();
		}
		
		return self::$instance;
	}
	
	public function connect()
	{
		$oracleConfig = Zend_Registry::get('oracle')->params->toArray();
    	$conn = oci_connect($oracleConfig['username'], $oracleConfig['password'], $oracleConfig['dbname'], $oracleConfig['charset']);
    	if (!$conn) {
		   return false;
		}
		
		return $conn;
	}
	
	public function query($query = 'null')
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
            throw new Exception("Cant obtain Quasar Email\n" . $e->getMessage());
        }
        return $items;  
	}
	
	public function getAll($query)
	{
		try {
			$cursor = $this->_execCursor($query, array('RESDATA'));
    		$items = array();
			while ($row = oci_fetch_array($cursor, OCI_ASSOC + OCI_RETURN_NULLS)) {
	    		$items[] = $row;
	    	}
	    	//var_dump(APPLICATION_PATH. '/logs/bitacoraexcepciones.log');exit;
            /*
	    	$writer = new Zend_Log_Writer_Stream(APPLICATION_PATH . '/../logs/bitacoraexcepciones.log');
        	$logger = new Zend_Log();
       	    $logger->addWriter($writer);
       	    $logger->info("QUERY:".print_r($query,true));
	    	$logger->info("RESULT:".print_r($cursor,true));
	    	$logger->info("ITEMS:".print_r($items,true));
            */
	    	return $items;
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Error Oracle\n" . $e->getMessage());
        }
	}
	
	public function getOne($query)
	{
		try {
			$conn = $this->connect();
	    	$stmt = oci_parse($conn, $query);
	    	oci_bind_by_name($stmt, ':statAplica', $statAplica, 5000);
	    	$success = oci_execute($stmt);
	    	
			if ($success == false) {
				$message = oci_error($stmt);
				return $message['message'];
			}
	    	oci_commit($conn);
	    	
	    	return $statAplica;
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Error Oracle\n" . $e->getMessage());
        }
	}
	
	public function setValidar($query)
	{
		try {
			$conn = $this->connect();
	    	$stmt = oci_parse($conn, $query);
	    	oci_bind_by_name($stmt, ':statAplica', $statAplica, 5000);
	    	oci_bind_by_name($stmt, ':totRegistros', $totRegistros, 5000);
	    	$success = oci_execute($stmt);
	    	
			if ($success == false) {
				$message = oci_error($stmt);
				//return $message['message'];
				$res = array('error' => $message['message'], "total" => 0);
	    		return $res;
			}
	    	oci_commit($conn);
	    	$res = array('error' => $statAplica, "total" => $totRegistros);
	    	return $res;
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Error Oracle\n" . $e->getMessage());
        }
	}
	
	private function  _execCursor($query, $binds) 
	{
		$conn = $this->connect();
    	$cursor = oci_new_cursor($conn);
    	$stmt = oci_parse($conn, $query) or die ('Can not parse query');
       	
       	foreach ($binds as $data) {
       		oci_bind_by_name($stmt, $data, $cursor, -1, OCI_B_CURSOR);
       	}
       	
		$success = oci_execute($stmt);

		if ($success == false) {
			$message = oci_error($stmt);
			die ("Error -> " . $message['message']);
		}

		oci_execute($cursor) or die ('Can not Execute statment');
		
		return $cursor;
	}
	
	public function set($query = 'null')
	{
		$conn = $this->connect();
    	$stmt = oci_parse($conn, $query);
    	oci_bind_by_name($stmt, ':psError', $psError, 5000);
    	$success = oci_execute($stmt);
    	if ($success == false) {
			$message = oci_error($stmt);
			return $message['message'];
		}
    	oci_commit($conn);
    	
    	return $psError;
	}
	
	public function queryupdate($query = 'null')
	{
		try {
        	$conn = $this->connect();
        	//$query = "SELECT * FROM CTMENUARCHIVO WHERE IDPADRE=1";
        	$result = oci_parse($conn, $query);
			return oci_execute($result, OCI_DEFAULT);
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Cant obtain Quasar Email\n" . $e->getMessage());
        }
	}
}