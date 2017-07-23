var trackApp = angular.module('trackControllers', []);

// Login controller
trackApp.controller("loginController", function ($scope, $http, $location){

    // login form submit
    $scope.submit = function (loginSubmit) {

        // if all fields of login form is valid
        if(loginSubmit.$valid) {
            $scope.user.page = 'login';
            $http.post('json_handler.php', $scope.user
            ).success(function(data, status, headers, config) {
                if(data == 1){
                    $location.path('/dashboard/').search({name: btoa($scope.user.username)});   // redirect to dashboard if login is success
                } else
                    $scope.auth = data;
            }).error(function(data, status) {
                alert(data);
            });
        }
    }

});

// Registration controller
trackApp.controller("registerController", function ($scope, $http, $location, $timeout){

    // registration form submit
    $scope.submit = function (registerSubmit) {

        // global declaration
        $scope.duplicate = '';
        
        if (registerSubmit.$valid) {                                    // if all fields of registration form is valid
            $http.post('json_handler.php', $scope.user
            ).success(function (data, status, headers, config) {
                if(data == 1){
                    $scope.written = data;
                    $timeout(function(){$location.url('/')}, 3000);     // redirect to login page after registration successfully
                } else if(data == 2){
                    $scope.duplicate = 2;                               // set 2 for already exists user
                }
            }).error(function (data, status) {
                alert(data);
            });
        }
    }
});

// dashboard controller
trackApp.controller("dashboardController", function ($scope, $http, $location){

    // set page width
    $scope.classForDashboard = '';
    if($location.url() == '/dashboard')
        $scope.classForDashboard = 'dashboard-page-width';

    $scope.dashboard = {
        "username": atob($location.search().name),  // decode the user name
        "page": 'dashboard'                         // add this string to differentiate in json_handler.json
    };
    var decodeName = atob($location.search().name);

    if(decodeName!=''){                             // if name if valid, then allow
        $scope.name = atob($location.search().name);
        $http.post('json_handler.php', $scope.dashboard
        ).success(function (data, status, headers, config) {
            $scope.noItem = (data == 1) ? 1 : 0;    // if user has not item, then set 1, otherwise 0

            // set class due to status
            $scope.processingClass = (data.status == 'processing') ? 'btn-primary' : 'btn-default';
            $scope.transitClass = (data.status == 'transit') ? 'btn-primary' : 'btn-default';
            $scope.deliveredClass = (data.status == 'delivered') ? 'btn-primary' : 'btn-default';

            // store latitude and longitude to display
            $scope.latitude = data.latitude;
            $scope.longitude = data.longitude;
        }).error(function (data, status) {
            alert(data);
        });
    }
});

// Search Controller
trackApp.controller("searchController", function ($scope, $http, $location){

    $scope.name = $location.search().name;
    $scope.decodeName = btoa($scope.name);  // decode name

    $scope.reverseSort = false;     // for reverse sort

    $http.get('./json/items.json').success(function(data, status, headers, config) {
        $scope.items = data;
    }).error(function (data, status) {
        alert(data);
    });
});