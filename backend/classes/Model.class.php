<?php

/**
 * Model Class
 */
class Model extends Dbh
{
    // Store the last inserted ID
    protected $lastInsertId = null;
    
    /**
     * Fetch records with optional where conditions and ordering.
     * 
     * @param string $table - The name of the database table.
     * @param array $conditions - Associative array of column-value pairs for WHERE conditions (optional).
     * @param string|null $orderBy - Column to order by (optional).
     * @param string $order - Order direction: 'ASC' or 'DESC' (default is 'ASC').
     * 
     * @return array|false - Returns result set or false if no results.
     */
    protected function selectRecords($table, $conditions = [], $orderBy = null, $order = 'ASC', $limit = null){
        // Start with base SQL query
        $sql = "SELECT * FROM $table";
        // Always initialize values array to avoid undefined variable warnings
        $values = [];
        
        // Add WHERE clause if conditions are provided
        if (!empty($conditions) && is_array($conditions)) {
            $whereClauses = [];
            foreach ($conditions as $column => $value) {
                if (is_array($value) && count($value) > 0) {
                    // Handle IN clause for array values
                    $placeholders = implode(',', array_fill(0, count($value), '?'));
                    $whereClauses[] = "$column IN ($placeholders)";
                    $values = array_merge($values, $value);
                } else {
                    $whereClauses[] = "$column = ?";
                    $values[] = $value;
                }
            }
            if (!empty($whereClauses)) {
                $sql .= " WHERE " . implode(" AND ", $whereClauses);
            }
        }

        // Add ORDER BY clause if specified
        if ($orderBy) {
            $sql .= " ORDER BY $orderBy $order";
        }
        if ($limit) {
            $sql .= " LIMIT $limit";
        }

        // Prepare the statement
        $stmt = $this->connect()->prepare($sql);
        
        // Execute with condition values (empty array is fine if no conditions)
        try {
            // Ensure $values is always an array
            if (!isset($values) || !is_array($values)) {
                $values = [];
            }
            $stmt->execute($values);
            
            // Fetch all results
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Return the result if records are found, otherwise return false
            return $stmt->rowCount() > 0 ? $result : false;
        } catch (PDOException $e) {
            error_log("SelectRecords Error: " . $e->getMessage());
            error_log("SQL: " . $sql);
            error_log("Values: " . print_r($values, true));
            return false;
        }
    }

    protected function selectDistinctRecords($table, $columns = [], $conditions = []) {
        // Ensure columns for DISTINCT selection
        $distinctColumns = !empty($columns) ? implode(", ", $columns) : '*';
        $sql = "SELECT DISTINCT $distinctColumns FROM $table";
        
        // Add WHERE clause if conditions are provided
        if (!empty($conditions)) {
            $whereClauses = [];
            $values = [];
            foreach ($conditions as $column => $value) {
                $whereClauses[] = "$column = ?";
                $values[] = $value;
            }
            $sql .= " WHERE " . implode(" AND ", $whereClauses);
        }

        // Prepare the statement
        $stmt = $this->connect()->prepare($sql);
        
        // Execute with condition values if provided
        $stmt->execute($values);

        // Fetch all unique results
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }




    
	
	/**
     * Fetch records with optional where conditions and ordering.
     * 
     * @param string $table - The name of the database table.
     * @param array $conditions - Associative array of column-value pairs for WHERE conditions (optional).
     * 
     * @return array|false - Returns result set or false if no results.
     */
	protected function setCountRecords($table, $conditions = []){
        try {
            // Start with base SQL query
            $sql = "SELECT COUNT(*) FROM $table";
            
            // Add WHERE clause if conditions are provided
            if (!empty($conditions)) {
                $whereClauses = [];
                foreach ($conditions as $column => $value) {
                    $whereClauses[] = "$column = ?";
                }
                $sql .= " WHERE " . implode(" AND ", $whereClauses);
            }
    
            // Prepare the statement
            $stmt = $this->connect()->prepare($sql);
            
            // Execute with condition values if provided
            $stmt->execute(array_values($conditions));
    
            // Fetch and return the count
            return $stmt->fetchColumn();
        } catch (PDOException $e) {
            // Log or display error as needed
            error_log("Database Error: " . $e->getMessage());
            return false; // or throw an exception
        }
    }



    protected function setCountRecordsRange($table, $conditions = []) {
        // Start with base SQL query
        $sql = "SELECT * FROM $table";
        
        // Add WHERE clause if conditions are provided
        if (!empty($conditions)) {
            $whereClauses = [];
            $values = [];
            foreach ($conditions as $column => $value) {
                if (is_array($value) && count($value) === 2) {
                    // Handle range (BETWEEN) condition
                    $whereClauses[] = "$column BETWEEN ? AND ?";
                    $values[] = $value[0];
                    $values[] = $value[1];
                } else {
                    $whereClauses[] = "$column = ?";
                    $values[] = $value;
                }
            }
            $sql .= " WHERE " . implode(" AND ", $whereClauses);
        }

        // Prepare the statement
        $stmt = $this->connect()->prepare($sql);
        
        // Execute with condition values if provided
        $stmt->execute($values);

        // Count all results
        $result = $stmt->rowCount();
        return $result;
    }





    
    
    
    
    
    
    
    
     /**
     * Insert a new record into a table.
     * 
     * @param string $table - The name of the database table.
     * @param array $data - Associative array of column => value pairs for the new record.
     * 
     * @return int|false - Returns the inserted ID on success, false on failure.
     */
    protected function insertRecord($table, $data) {
        try {
            $columns = implode(", ", array_keys($data));
            $placeholders = implode(", ", array_fill(0, count($data), "?"));
            
            $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
            
            $pdo = $this->connect();
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute(array_values($data));
            
            if ($success) {
                // Get and return the inserted ID directly
                $insertId = $pdo->lastInsertId();
                // Store it for backward compatibility
                $this->lastInsertId = $insertId;
                return $insertId; // Return ID on success
            }
            
            error_log("Insert failed: " . print_r($stmt->errorInfo(), true));
            $this->lastInsertId = null;
            return false;
        } catch (PDOException $e) {
            error_log("Insert Error: " . $e->getMessage());
            error_log("SQL: " . $sql);
            error_log("Data: " . print_r(array_values($data), true));
            $this->lastInsertId = null;
            return false;
        }
    }
    
    // Get last inserted ID (for backward compatibility)
    protected function getLastInsertId() {
        return $this->lastInsertId;
    }

    
    
    
    
    
    
    

    /**
     * Update records in a table with given conditions.
     * 
     * @param string $table - The name of the database table.
     * @param array $data - Associative array of column => value pairs for the updated data.
     * @param array $conditions - Associative array of column => value pairs for WHERE conditions.
     * 
     * @return bool - Returns true on success, false on failure.
     */
    protected function updateRecord($table, $data, $conditions){
        // Prepare SET clause
        $setClause = implode(", ", array_map(function ($column) {
            return "$column = ?";
        }, array_keys($data)));
        
        // Prepare WHERE clause
        $whereClause = implode(" AND ", array_map(function ($column) {
            return "$column = ?";
        }, array_keys($conditions)));
        
        // Construct SQL query
        $sql = "UPDATE $table SET $setClause WHERE $whereClause";
        
        // Prepare and execute the statement
        $stmt = $this->connect()->prepare($sql);
        return $stmt->execute(array_merge(array_values($data), array_values($conditions)));
    }
    
    

    /**
     * Delete records from a table with given conditions.
     * 
     * @param string $table - The name of the database table.
     * @param array $conditions - Associative array of column => value pairs for WHERE conditions.
     * 
     * @return bool - Returns true on success, false on failure.
     */
    protected function deleteRecord($table, $conditions){
        // Prepare WHERE clause
        $whereClause = implode(" AND ", array_map(function ($column) {
            return "$column = ?";
        }, array_keys($conditions)));
        
        // Construct SQL query
        $sql = "DELETE FROM $table WHERE $whereClause";
        
        // Prepare and execute the statement
        $stmt = $this->connect()->prepare($sql);
        return $stmt->execute(array_values($conditions));
    }
    
    
    
    
}
?>
