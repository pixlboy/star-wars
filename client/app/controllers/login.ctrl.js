starwars.controller("LoginCtrl", ["$rootScope", "$scope", "CommonGalaxyService","$state",
    function($rootScope, $scope, CommonGalaxyService, $state) {

        let login = this;

        login.name = null;
		login.password = null;
        login.isError = false;

        login.submit = () => {
            if (login.isvalidUser()) {
                login.isError = false;
				let user = _.find(CommonGalaxyService.allUsers, { 'name': login.name, 'birth_year': login.password });
                CommonGalaxyService.setUserDetails(user);
				$state.go("search");
            } else {
                login.isError = true;
            }
        };

        login.isvalidUser = () => {
			let user = _.find(CommonGalaxyService.allUsers, { 'name': login.name, 'birth_year': login.password });
            if (user) {
                return true;
            }
        };

    }
]);
