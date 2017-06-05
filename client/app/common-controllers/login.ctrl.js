starwars.controller("LoginCtrl", ["$rootScope", "$scope", "CommonUserConfigService","$state",
    function($rootScope, $scope, CommonUserConfigService, $state) {

        let login = this;

        login.name = null;
		login.password = null;
        login.isError = false;

        login.submit = () => {
            if (login.isvalidUser()) {
                login.isError = false;
				let user = _.find(CommonUserConfigService.allUsers, { 'name': login.name, 'birth_year': login.password });
                CommonUserConfigService.setUserDetails(user);
				$state.go("planets");
            } else {
                login.isError = true;
            }
        };

        login.isvalidUser = () => {
			let user = _.find(CommonUserConfigService.allUsers, { 'name': login.name, 'birth_year': login.password });
            if (user) {
                return true;
            }
        };

    }
]);
