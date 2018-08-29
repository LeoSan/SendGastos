<?php 
class  Pendum_Db_Dynamics
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
		$oracleConfig = Zend_Registry::get('dynamics')->params->toArray();
		$conn = mssql_connect($oracleConfig['server'],$oracleConfig['username'], $oracleConfig['password']);
        $selected = mssql_select_db($oracleConfig['dbname'], $conn);
        
        if(!$selected){
            die("Couldn't open database DYNAMICS");
    	}
        
    	if (!$conn) {
           return false;
        }
        
       return $conn;
	
	}
	
	public function get($where = 'null')
	{
		
	}
	
	public function getAll($query)
	{
		try {
        	$conn = $this->connect();
	        $result = mssql_query($query);  
	        $items = array();
	        
	        while($row = mssql_fetch_array($result)) {
	                $items[] = $row;
	        }
	        
	        mssql_close($conn);
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Error Oracle\n" . $e->getMessage());
        }
        return $items; 
	}
	
	public function query($query)
	{
		try {
        	$conn = $this->connect();
	        $result = mssql_query($query);  
	        $items = array();
	        
	        while($row = mssql_fetch_array($result)) {
	                $items[] = $row;
	        }
	        
	        mssql_close($conn);
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Error Oracle\n" . $e->getMessage());
        }
        return $items; 
	}
}
