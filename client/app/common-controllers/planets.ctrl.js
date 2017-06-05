starwars.controller("PlanetsCtrl", ["$rootScope", "$scope", "CommonUserConfigService","$state","$q","ENV","$http",
    function($rootScope, $scope, CommonUserConfigService, $state, $q, ENV, $http) {

        let planets = this;

        this.getAllPlanets = () => {
            var defer = $q.defer();
            // defining the HTTP options.
            var httpOptions = {
                method	: 'GET',
                url	: `${ENV.planets}`
            };

            $http(httpOptions).then((res) => {
                defer.resolve(res);
            }, (err) => {
                defer.reject(err);
            });
            return defer.promise;
        };

        planets.getAllPlanets();

    }
]);
