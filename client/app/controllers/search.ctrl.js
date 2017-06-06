starwars.controller("SearchCtrl", ["$rootScope", "$scope", "CommonGalaxyService","$state","$q","ENV","$http",
    function($rootScope, $scope, CommonGalaxyService, $state, $q, ENV, $http) {

        let search = this;

        search.allPlanets = [];
        search.query = '';
        search.userName = CommonGalaxyService.name ? CommonGalaxyService.name.split(" ")[0] : "Human";

        search.init = () => {
            CommonGalaxyService.getAllPlanets().then((res) => {
                search.allPlanets = res.data.results;
            }, (err) => {
                console.log(err);
            });
        };

        search.init();

    }
]);
