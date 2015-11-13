<!DOCTYPE html>
<html>
<body>

<?php
$a=array("Volvo"=>"XC90","BMW"=>"X5","name"=>"anand");
$b = array("Volvo"=>"","name"=>"anand");
if (count(array_intersect($b, $a)) == count($b)) {
  echo "all found";
}
?>

</body>
</html>