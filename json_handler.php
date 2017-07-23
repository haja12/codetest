<?php
// find the latitude and longitude from location
function get_lat_long($address){

    $address = str_replace(" ", "+", $address);

    $json = file_get_contents("http://maps.google.com/maps/api/geocode/json?address=$address&sensor=false");
    $json = json_decode($json);

    $lat = $json->{'results'}[0]->{'geometry'}->{'location'}->{'lat'};
    $long = $json->{'results'}[0]->{'geometry'}->{'location'}->{'lng'};
    return $lat.','.$long;
}

// get the data from angular js form
$data = json_decode(file_get_contents("php://input"));

// access for registration and login check
$json = '';
$file = './json/registeration.json';
$json = json_decode(file_get_contents($file), true);

// for login
if(isset($data->page) && $data->page == 'login'){

    // if no data in registration.json, then return back to angular js
    if(count($json) == 0){
        echo ''; exit;
    }

    // check the login detail with registration.json file
    $username_check = array_search($data->username, array_column($json, 'username'));
    $password_check = array_search($data->password, array_column($json, 'password'));

    echo (($username_check == $password_check) && (gettype($username_check) != 'boolean') && (gettype($password_check) != 'boolean')) ? 1 : ''; exit;
}
// for dashboard
elseif(isset($data->page) && $data->page == 'dashboard'){
    // get the item detail from items.json
    $item_json = '';
    $file = './json/items.json';
    $item_json = json_decode(file_get_contents($file), true);

    // find sub array
    $result = [];
    foreach ($item_json as $subarray)
        if (in_array($data->username, $subarray)) {
            $result = $subarray;
            break;
        }

    // if user has not items, then return 1
    if(empty($result) == 1){
        echo 1; exit;
    }

    // split latitude and longitude from the return result
    $latlong = get_lat_long($result['from']);
    $latlong_split = explode(',', $latlong);

    // merge the latitude and longitude array with login user detail array
    if(count($latlong_split) > 0) {
        $latlong_array = array("latitude" => $latlong_split[0], "longitude" => $latlong_split[1]);
        $add_lat_long = array_merge($result, $latlong_array);
    }

    // return the result array in json format
    echo json_encode($add_lat_long); exit;
}
// for registration
else {
    $check_registration_user = -1;

    // check if the username is already exists while registration
    $check_registration_user = array_search($data->username, array_column($json, 'username'));

    if(gettype($check_registration_user) != 'boolean'){
        echo 2; exit;
    }

    // update the registration.json if more than one registration is happen
    if (count($json) > 0)
        $data = array_merge($json, array($data));

    // write the data to registration.json
    $fp = fopen('./json/registeration.json', 'w');
    fwrite($fp, json_encode($data));
    fclose($fp);
    echo 1; exit;
}
?>