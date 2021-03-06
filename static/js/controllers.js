var ConsoleModule = angular.module('ConsoleModule', ['ngRoute']);
var locations = [{ lat: 0, lng: 0 },
                 { lat: 0, lng: 0 },
                 { lat: 0, lng: 0 },
                 { lat: 0, lng: 0 }];
var clickLattitude;
var clickLongitude;

ConsoleModule.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
        $routeProvider.when('/', {
            templateUrl: '/partials/Byzip.html',
            controller: 'wcontroller',
            controllerAs: 'wcontroller'
        });
    }]);

ConsoleModule.controller('wcontroller', ['$scope', '$http', '$routeParams', '$timeout', '$sce',
    function ($scope, $http, $routeParams, $timeout, $sce) {

        $scope.somemessage = "Some weather";
        $scope.zip1Weather = "";

        $scope.zip = function (which, event) {

            $scope.keyval = event.keyCode;

            var data = "";
            if (which === 1) {
                data = $scope.zip1m;
            } else if (which === 2) {
                data = $scope.zip2m;
            } else if (which === 3) {
                data = $scope.zip3m;
            } else if (which === 4) {
                data = $scope.zip4m;
            }

            //if the enter key is pressed.
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
                    initMap1.updateMarkers();
                }); 
            }
            else {
                if (which === 1) {
                    $scope.zip1Weather = "";
                    locations[0] = { lat: 0, lng: 0 };
                } else if (which === 2) {
                    $scope.zip2Weather = "";
                    locations[1] = { lat: 0, lng: 0 };
                } else if (which === 3) {
                    $scope.zip3Weather = "";
                    locations[2] = { lat: 0, lng: 0 };
                } else if (which === 4) {
                    $scope.zip4Weather = "";
                    locations[3] = { lat: 0, lng: 0 };
                }
                //reload the map henever there is a change.
                initMap1.updateMarkers();
            }
        };

        $scope.get = function () {
            $http({
                method: "GET",
                url: '/api/v1/getWeather2?lat=' + clickLattitude + '&lon=' + clickLongitude
            }).then(function (response) {
                $scope.click1Weather = response.data.weather;
                $scope.click1City = response.data.city;
            });
        };
    }]);

function initMap1() {
    // The location of Uluru, center on new zealand
    var uluru = { lat: -40.6187416, lng: 171.7195556 };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 5, center: uluru });
    //create some lables for the markers
    var labels = 'ABCDE';
    // Add some markers to them map

    var markers = [];

    initMap1.updateMarkers = function () {
        //delete exisitngg markers
        deleteMarkers();
        //add new markers.
        var locationLength = locations.length;
        for (var o = 0; o < locationLength; o++) {
            addMarker(locations[o]);
        }
        
    };

    function addMarker(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });
        markers.push(marker);
    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }
    //clear the markers by removing their map
    function clearMarkers() {
        setMapOnAll(null);
    }
    //delete markers by removing them from map and removing their location.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }

    initMap1.updateMarkers();

    var marker;
    //event listners
    google.maps.event.addListener(map, 'click', function (event) {
        placeMarker(event.latLng);
        clickLattitude = event.latLng.lat();
        clickLongitude = event.latLng.lng();
        updateWeather();
    });

    function placeMarker(location) {
        if (!marker) {
            marker = new google.maps.Marker({
                position: location,
                map: map,
                draggable: true
            });
        }
        else {
            marker.setPosition(location);
        }
    }
}

function updateWeather() {
    var scope = angular.element(document.getElementById('click1weather')).scope();
    scope.$apply(function () {
        scope.get();
    });
}
