var ConsoleModule = angular.module('ConsoleModule', ['ngRoute']);
var locations = [{ lat: 0, lng: 0 },
                 { lat: 0, lng: 0 },
                 { lat: 0, lng: 0 },
                 { lat: 0, lng: 0 }];

var keyVal = 0;

function initMap1() {
    // The location of Uluru, center on new zealand
    var uluru = { lat: -40.6187416, lng: 171.7195556 };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 5, center: uluru });
    //create some lables for the markers
    var labels = 'ABCDE';
    // Add some markers to them map
    var markers = locations.map(function (location, i) {
        if (location.lat != 0) {
            return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length]
            });
        }
    });

    var markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
}



ConsoleModule.config(['$routeProvider', '$locationProvider','$sceDelegateProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/Byzip.html',
        controller: 'wcontroller',
        controllerAs: 'wcontroller'
    });
}]);

ConsoleModule.controller('wcontroller', ['$scope', '$http', '$routeParams', '$timeout', '$sce',
    function($scope, $http, $routeParams, $timeout, $sce) {

    $scope.somemessage = "Some weather";
    $scope.zip1Weather = "";

        $scope.zip = function (which, event) {

        $scope.keyval = event.keyCode;

        var data = "";
        if(which === 1) {
            data = $scope.zip1m;
        } else if(which === 2) {
            data = $scope.zip2m;
        } else if(which === 3) {
            data = $scope.zip3m;
        } else if(which === 4) {
            data = $scope.zip4m;
        } 

            //if the enter key is pressed.
            if (data.length > 1) {
                if ($scope.keyval === 13) {
                    $http({
                        method: "GET",
                        url: '/api/v1/getWeather?city=' + data
                    }).then(function (response) {
                        if (which === 1) {
                            $scope.zip1Weather = response.data.weather;
                            locations[0] = { lat: response.data.lattutude, lng: response.data.longitude };
                        } else if (which === 2) {
                            $scope.zip2Weather = response.data.weather;
                            locations[1] = { lat: response.data.lattutude, lng: response.data.longitude };
                        } else if (which === 3) {
                            $scope.zip3Weather = response.data.weather;
                            locations[2] = { lat: response.data.lattutude, lng: response.data.longitude };
                        } else if (which === 4) {
                            $scope.zip4Weather = response.data.weather;
                            locations[3] = { lat: response.data.lattutude, lng: response.data.longitude };
                        }
                        //reload the map henever there is a change.
                        initMap1();

                    });
                }
        }
        else {
            if(which === 1) {
                $scope.zip1Weather = "";
                locations[0] = { lat: 0, lng: 0 };
            } else if(which === 2) {
                $scope.zip2Weather = "";
                locations[1] = { lat: 0, lng: 0 };
            } else if(which === 3) {
                $scope.zip3Weather = "";
                locations[2] = { lat: 0, lng: 0 };
            } else if(which === 4) {
                $scope.zip4Weather = "";
                locations[3] = { lat: 0, lng: 0 };
            }  
        }
    };
    
    }]);
