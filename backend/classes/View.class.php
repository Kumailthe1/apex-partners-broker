<?php

/**
 * View Class
 */
class View extends Model
{

   /**
     * Display records with optional conditions and ordering.
     *
     * @param string $table - The name of the table.
     * @param array $conditions - Associative array of conditions (optional).
     * @param string|null $orderBy - Column to order by (optional).
     * @param string $order - Order direction (default 'ASC').
     * 
     * @return array|false - Returns the records or false if no results.
     */
    public function showRecords($table, $conditions = [], $orderBy = null, $order = 'ASC', $limit = null){
        return $this->selectRecords($table, $conditions, $orderBy, $order, $limit);
    }

    public function getDistinct($table, $columns = [], $conditions = []) {
        return $this->selectDistinctRecords($table, $columns, $conditions);
    }



    

    /**
     * Display records with optional conditions and ordering.
     *
     * @param string $table - The name of the table.
     * @param array $conditions - Associative array of conditions (optional).
     * 
     * @return array|false - Returns the records or false if no results.
     */
	
	public function countRecords($table, $conditions = []){
        return $this->setCountRecords($table, $conditions);
    }




    public function countRange($table, $conditions = []){
        return $this->setCountRecordsRange($table, $conditions = []);
    }
}
?>
