<?php
	$servername = "localhost";
	$username = "root";
	$password = "anandh";
	$dbname = "excelreader";

	// Create connection
	$conn = new mysqli($servername, $username, $password,$dbname);

	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 
	//echo "Connected successfully";
	
	/*$sql = "CREATE TABLE investmentinfo (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
	quarter VARCHAR(10) NOT NULL,
	deals VARCHAR(10) NOT NULL,
	investment VARCHAR(20) NOT NULL,
	percent_of_total_investment VARCHAR(10),
	city VARCHAR(20),
	sector VARCHAR(10),
	round VARCHAR(10)
	)";

	if ($conn->query($sql) === TRUE) {
	    echo "Table MyGuests created successfully";
	} else {
	    echo "Error creating table: " . $conn->error;
	}
	$conn->close();*/
	