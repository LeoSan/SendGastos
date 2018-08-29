<?php 
class  Pendum_Db_Finanzas
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
//		$conn = mssql_connect('10.73.98.81','processm', 'processm');
		$conn = mssql_connect('MXVWERP02P.pendulum.com.mx','processm', 'processm');
        $selected = mssql_select_db('PENDULUMAPP', $conn);
        
        if(!$selected){
            die("Couldn't open database Finanzas");
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
}
?>