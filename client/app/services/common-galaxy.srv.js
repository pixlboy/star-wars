starwars.service("CommonGalaxyService", ["ENV", "$q", "$http", function(ENV, $q, $http) {

	this.name = null;
	this.allUsers = [];

	this.setUserDetails = (user) => {
		this.name = user.name;
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

	this.flattenUsers = (collection) => {
		this.allUsers = collection;
	};

}]);
