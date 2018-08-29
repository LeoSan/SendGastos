<?php 
class  Pendum_Db_Mysql
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
		$mysqlConfig = Zend_Registry::get('dbmysql')->params->toArray();
		$conn = mysqli_connect($mysqlConfig['server'], $mysqlConfig['username'], $mysqlConfig['password']);
    	if (!$conn) {
		   	return false;
		}
		if (!mysqli_select_db($conn, $mysqlConfig['dbname'] )) {
            return false;
        } 

		return $conn;
	}

	public function getAll($query)
	{
		try {
        	$conn = $this->connect();
	        $result = mysqli_query($conn, $query);
	        $items = array();
	        
	        while($row = mysqli_fetch_array($result)) {
	                $items[] = $row;
	        }

            mysqli_close($conn);
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
	        $result = mysqli_query($conn, $query);
	        $items = array();
	        
	        while($row = mysqli_fetch_array($result)) {
	                $items[] = $row;
	        }

            mysqli_close($conn);
        }
        catch(Zend_Db_Exception $e)
        {
            throw new Exception("Error Oracle\n" . $e->getMessage());
        }
        return $items; 
	}
	
	public function set($query = 'null')
	{
		if($query == 'null'){
			return false;
		}
		
		$conn = $this->connect();
		$result = mysqli_query($conn, $query);
        mysqli_close($conn);
    	
    	return $result;
	}
}
