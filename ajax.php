<?php
	include_once("dbconnect.php");
	class Result
	{
		public $status = "SUCCESS";
	}
	$sendback = new Result();
	if($_SERVER['REQUEST_METHOD'] == "POST")
	{	
		$fromDate = $_POST['fromDate'];
		$toDate = $_POST['toDate'];
		$city = $_POST['city_selected'];
		$city_count =  sizeof($city);
		$sector = $_POST['sector_selected'];
		$sector_count = sizeof($sector);
		$round = $_POST['round_selected'];
		$round_count = sizeof($round);

		$city_query = "and ( ";
		$sector_query = "and ( ";
		$round_query = "and ( ";
		for($i = 0; $i < $city_count; $i++)
		{
			if( $i == ($city_count - 1))
			{
				$city_query .= "city = '". $city[$i]."'";
			}
			else
			{
				$city_query .= "city = '". $city[$i]."' or ";
			}
		}
		$city_query .= " )";
		for($i = 0; $i < $sector_count; $i++)
		{
			if( $i == ($sector_count - 1))
			{
				$sector_query .= "sector = '". $sector[$i]."'";
			}
			else
			{
				$sector_query .= "sector = '". $sector[$i]."' or ";
			}
		}
		$sector_query .= " )";
		for($i = 0; $i < $round_count; $i++)
		{
			if( $i == ($round_count - 1))
			{
				$round_query .= "round = '". $round[$i]."'";
			}
			else
			{
				$round_query .= "round = '". $round[$i]."' or ";
			}
		}
		$round_query .= " )";
		
		if($city_count == 0)
		{
			$city_query = "";
		}
		if( $sector_count == 0)
		{
			$sector_query = "";
		}
		if($round_count == 0)
		{
			$round_query = "";
		}
		$quarter = "SELECT * FROM investmentinfo where ( id >=".$fromDate." and id <=". $toDate.")". $city_query ." ". $sector_query." ". $round_query;
		$result = $conn->query($quarter);

		$xaxis = array();
		$investment = array();
		$total_deals = array();

		if($result)
		{
			$num_rows = $result->num_rows;
			if($num_rows > 0)
			{
				while($row = $result->fetch_assoc())
				{
					$xaxis[] = $row['quarter'];
					$investment[] = $row['investment'];
					$total_deals[] = $row['deals'];
				}
			}
		}

		$sendback->msg = $sa;
		$sendback->xaxis = $xaxis;
		$sendback->investment = $investment;
		$sendback->deals = $total_deals;

		echo json_encode($sendback);
	}
	else
	{
		$quarter = "SELECT * FROM investmentinfo";
		$result = $conn->query($quarter);

		$xaxis = array();
		$investment = array();
		$total_deals = array();

		if($result)
		{
			while($row = $result->fetch_assoc())
			{
				$xaxis[] = $row['quarter'];
				$investment[] = $row['investment'];
				$total_deals[] = $row['deals'];
			}
		}

		$sendback->xaxis = $xaxis;
		$sendback->investment = $investment;
		$sendback->deals = $total_deals;

		echo json_encode($sendback);
	}
	