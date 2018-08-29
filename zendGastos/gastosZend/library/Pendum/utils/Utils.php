<?php 
class Utils
{
        public static $_instance = null;

    public static function utf8ize($d) {
        if (is_array($d)) {
            foreach ($d as $k => $v) {
                $d[$k] = self::utf8ize($v);
            }
        } else if (is_string($d)) {
            return utf8_encode($d);
        }
        
        return $d;
    }

    public static function getInstance() {
        if (null === self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
	private static function getWhereClauseFromFilter($item) 
	{
		$where = '';
		switch ($item->op) {
			case 'eq':
				$where = $item->field . "='" . str_replace('Ñ', '{', $item->data) . "'";
 				break;
			case 'cn':
				$where = $item->field . " LIKE '%" . str_replace('Ñ', '{', $item->data) . "%'";
				break;
		}
		
		return $where;
	}
	
	public static function getWhereFromFilters($filters) 
	{
		$where = '';
		
		if (!empty($filters)){ 
	        $filters = json_decode($filters);
        	$count = 1;
	        $searchLength = count($filters->rules);
	        $where = '';
	        foreach ($filters->rules as $item) {
	        	$item->data = mb_strtoupper($item->data);
	        	$whereClause = Utils::getWhereClauseFromFilter($item);
	        	if ($count == $searchLength) {
	        		$where .= $whereClause . " ";
	        	} else {
	        		$where .= $whereClause . " AND ";
	        	}
	        	$count ++;
	        }
        }
		//return strtoupper($where);
		return $where;
	}
	
	public static function getGridFinalParams($count, $page, $limit) 
	{
        $totalPages = 0;
		if( $count > 0 ) {
            $totalPages = ceil($count/$limit);
        }
        
        if ($page > $totalPages) {
        	$page = $totalPages;
        }
        
        $start = ($limit * $page) - $limit;
        $end = 0;
        
        if ($start <= 0) {
        	$start = 0;
        }
        
        if ($count > 0) { 
	        $end = $start + $limit;
	        $start ++;
        }
         
        return array(
        	'page' => $page,
        	'totalPages' => $totalPages,
        	'start' => $start,
        	'end' => $end,
        );
	}
        public static function firebug($message, $type = Zend_Log::INFO) {
        $writer = new Zend_Log_Writer_Firebug();
        $logger = new Zend_Log($writer);
        $logger->log($message, $type);
    }
    
        public static function xDebug($var, $on_screen = true) {
        if ($on_screen) {
            echo '<pre>' . print_r($var, 1) . '</pre>';
        } else {
            return print_r($var, 1);
        }
    }
	
	private static function getWhereClauseFromFilterSpecial($item)
    {
        $where = '';
        switch ($item->op) {
            case 'eq':
                $where = $item->field . "=''" . $item->data . "''";
                break;
            case 'cn':
                $where = $item->field . " LIKE ''%" . $item->data . "%''";
                break;
        }

        return $where;
    }
    public static function getWhereFromFiltersSpecial($filters) 
    {
            $where = '';

            if (!empty($filters)){ 
            $filters = json_decode($filters);
            $count = 1;
            $searchLength = count($filters->rules);
            $where = '';
            foreach ($filters->rules as $item) {
                    $item->data = mb_strtoupper($item->data);
                    $whereClause = Utils::getWhereClauseFromFilterSpecial($item);
                    if ($count == $searchLength) {
                            $where .= $whereClause . " ";
                    } else {
                            $where .= $whereClause . " AND ";
                    }
                    $count ++;
            }
    }
            //return strtoupper($where);
            return $where;
    }
}

?>