var starwars = angular.module('starwars',['app.config', 'ui.router']);

function attachDomainHTTPInterceptor(ENV, BASE_URL){
    for (var key in ENV) {
        if (typeof ENV[key] === 'string') {
            if (!ENV[key].includes('http')) { //Detect Full URLs in config file
                ENV[key] = BASE_URL + ENV[key];
            }
        }
    }
}

starwars.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    //unmatched URLs return to home page
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('login', {
        url: '/',
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl as login'
    })
    .state('search', {
        url: '/search',
        templateUrl: 'partials/search.html',
        controller: 'SearchCtrl as search'
    });
}]);

starwars.run(['$rootScope', 'ENV', 'BASE_URL', 'CommonGalaxyService',
    function($rootScope, ENV, BASE_URL, CommonGalaxyService) {
        attachDomainHTTPInterceptor(ENV, BASE_URL);
        CommonGalaxyService.getAllUsers();
}]);
