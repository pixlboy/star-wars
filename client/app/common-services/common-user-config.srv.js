starwars.service("CommonUserConfigService", ["ENV", "$q", "$http", function(ENV, $q, $http) {

	this.name = null;
	this.gender = null;
	this.allUsers = [];

	this.setUserDetails = (user) => {
		this.name = user.name;
		this.gender = user.gender;
	};

	this.getAllUsers = () => {
		var defer = $q.defer();
		// defining the HTTP options.
		var httpOptions = {
			method	: 'GET',
			url	: `${ENV.people}`
		};

		$http(httpOptions).then((res) => {
			this.flattenUsers(res.data.results);
			defer.resolve(res);
		}, (err) => {
			defer.reject(err);
		});
		return defer.promise;
	};

	this.flattenUsers = (collection) => {
		this.allUsers = collection;
	};

}]);
