<?php
$city_file = 'https://pogoda.yandex.ru/static/cities.xml';   //file with city and id
$xml_city = simplexml_load_file($city_file); 
$cityName = $_POST["cityName"]; //city title from ajax

foreach($xml_city->country as $country){ //array (city title - id)
  foreach($country->city as $city):
    $attrs = $city->attributes();
    $city = strval($city);
    $id = strval($attrs['id']);    
    $cities [$id] = $city;
  endforeach;
}

$cityid = array_search($cityName, $cities); //Search id, corresponding to the name entered the city

$data_file = 'https://export.yandex.ru/bar/reginfo.xml?region='.$cityid.'.xml';   //weather file
$xml = simplexml_load_file($data_file); 

foreach($xml->weather->day as $day){
 $id = 0; //counter for map in react

 foreach($day->day_part as $day_part):

  $img = strval($day_part->{'image-v2'}); //images
 $temp = strval($day_part->temperature); //temperature
 $tempFrom = strval($day_part->temperature_from); // temperature min
 $tempTo = strval($day_part->temperature_to); // temperature max

 $attrs = $day_part->attributes();
 $type= strval($attrs['type']); // time of the day
 $typeid= strval($attrs['typeid']); // day id 
 $id++;

//an array of weather displays for easy tracking download file, as Yandex is not always gives the desired file for id (for example, can load the same files on different id with the same title)

 $result[] = (array("id"=>$id, "cityName"=>$cityName, "cityid"=>$cityid, "typeid"=>$typeid, "type"=>$type, "src"=>$img, "temp"=>$temp, "tempFrom"=>$tempFrom, "tempTo"=>$tempTo, ));

 endforeach;

$first = array_shift($result); // remove the first element in order to avoid repetition time of day
usort($result, function($a, $b){ // time sorting the day (in the morning - before the night)
    return ($a['typeid'] - $b['typeid']);
});
	
 echo json_encode($result); // result.

}