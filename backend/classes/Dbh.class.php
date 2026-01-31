<?php 

	class Dbh{

		private $host = 'localhost';
		private $user = 'kumailthe1_alpha10';
		private $pwd = 'kumailthe1_alpha10';
		private $dbName = 'kumailthe1_alpha10';

		protected function connect(){
			$dsn = 'mysql:host='.$this->host.';dbname='.$this->dbName;

			$pdo = new PDO($dsn, $this->user, $this->pwd);
			$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
			return $pdo;
		}
	}