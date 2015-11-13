<?php
 
/**
 * Autoload files of https://github.com/google/google-api-php-client
 *
 */ 
require_once 'php-google-spreadsheet-client/google-api-php-client/vendor/autoload.php';
include_once('dbconnect.php');
 
/**
 * If you install https://github.com/asimlqt/php-google-spreadsheet-client through composer
 * Then you can just do:
 * require 'vendor/autoload.php';
 *
 * If you just download the zip file of https://github.com/asimlqt/php-google-spreadsheet-client
 * Then, you need to load the following files:
 *
 */
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/ServiceRequestInterface.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/DefaultServiceRequest.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/Exception.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/UnauthorizedException.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/ServiceRequestFactory.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/SpreadsheetService.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/SpreadsheetFeed.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/Spreadsheet.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/WorksheetFeed.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/Worksheet.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/ListFeed.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/ListEntry.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/CellFeed.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/CellEntry.php';
require_once 'php-google-spreadsheet-client/src/Google/Spreadsheet/Util.php';
 
 
/**
 * AUTHENTICATE
 *
 */
// These settings are found on google developer console
const CLIENT_APP_NAME = 'MyProject';
const CLIENT_ID       = '438461248139-f7kd5sfvreoplg69qs9m803l2611e30v.apps.googleusercontent.com';
const CLIENT_EMAIL    = '438461248139-f7kd5sfvreoplg69qs9m803l2611e30v@developer.gserviceaccount.com';
const CLIENT_KEY_PATH = 'credential.p12'; // PATH_TO_KEY = where you keep your key file
const CLIENT_KEY_PW   = 'e9892d96d35b97cfb2468d821c404c25610f9da5';

$SPREADSHEETS_SCOPE = 'https://spreadsheets.google.com/feeds';

$client = new Google_Client();
$client->setApplicationName('My Project');
$client->setScopes(array($SPREADSHEETS_SCOPE));
$client->setAuthConfig('credential.json');
if( $client->isAccessTokenExpired() )
{
    $client->refreshTokenWithAssertion();
}
$client->setClientId(CLIENT_ID);

    
$objToken  = $client->getAccessToken();
$accessToken = $objToken["access_token"];

/**
 * Initialize the service request factory
 */ 
use Google\Spreadsheet\DefaultServiceRequest;
use Google\Spreadsheet\ServiceRequestFactory;
 
$serviceRequest = new DefaultServiceRequest($accessToken);
ServiceRequestFactory::setInstance($serviceRequest);
 
 
/**
 * Get spreadsheet by title
 */
$spreadsheetTitle = 'startupinfo';
$spreadsheetService = new Google\Spreadsheet\SpreadsheetService();
$spreadsheetFeed = $spreadsheetService->getSpreadsheets();
$spreadsheet = $spreadsheetFeed->getByTitle($spreadsheetTitle);


$worksheetTitle = 'Sheet1'; // it's generally named 'Sheet1' 
$worksheetFeed = $spreadsheet->getWorksheets();
$worksheet = $worksheetFeed->getByTitle($worksheetTitle);

/**
 * Get row lists of worksheet
 */
$listFeed = $worksheet->getListFeed();

foreach ($listFeed->getEntries() as $entries) {
        $values = "";
        foreach ($entries->getValues() as $key => $value) {
            if( $key == "investment")
            {
                $values .= "'".str_replace(",","",substr($value,1))."',";
            }
            else if( $key == "deals")
            {
                $values .= "'".str_replace(",","",$value)."',";
            }
            else if( $key != "round")
            {
             $values .= "'".$value."',";
            }
            else
            {
                $values .= "'".$value."'";
            }
        }
        $sql = "INSERT INTO investmentinfo(id,quarter,deals,investment,percent_of_total_investment,city,sector,round) VALUES(NULL,". $values.")";
        $conn->query($sql);
}
echo "done";