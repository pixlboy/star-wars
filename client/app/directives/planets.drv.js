starwars.directive('planet', function() {
	let directive = {};
	directive.restrict = "E";
	directive.compile = function(element, attributes) {
	    let linkFunction = function($scope, element, attributes) {
			let size = ($scope.planet.population !== "unknown" ? $scope.planet.population.length * 15 : 50);
	        element.css("background-color", `#${Math.random().toString(16).slice(2, 8).toUpperCase()}`);
			element.css("width", size);
			element.css("height", size);
	    };
      	return linkFunction;
  	};

	return directive;

});
