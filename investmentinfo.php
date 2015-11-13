<?php
	include_once("dbconnect.php");
	
	class Result
	{
		public $status = "SUCCESS";
	}
	$sendback = new Result();
	
	$quarter = "SELECT * FROM investmentinfo";
	$result = $conn->query($quarter);
	
	/*to store the quarter and the related id of that*/
	$quarter = array();
	$city = array();
	$sector = array();
	$round = array();
	
	if($result->num_rows > 0)
	{
		while($row = $result->fetch_assoc())
		{
			$quarter[$row['id']] =  $row['quarter'];
			if( !in_array($row['city'],$city))
			{
				$city[] = $row['city'];
			}
			if( !in_array($row['sector'],$sector))
			{
				$sector[] = $row['sector'];
			}
			if( !in_array($row['round'],$round))
			{
				$round[] = $row['round'];
			}
		}
	}
	$sendback->quarter = $quarter;
	$sendback->city = $city;
	$sendback->sector = $sector;
	$sendback->round = $round;
	$conn->close();
	echo json_encode($sendback);
