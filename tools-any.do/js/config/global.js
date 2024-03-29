define(["jquery", "underscore", "backbone", "constants"], function() {
	return function() {
		this.initialize = function() {
			this.anydoServicesJson = [];
			this.anydoServicesJson.push({
				name: "auto-complete",
				version: "2.0",
				url: "http://ac-anydo.elasticbeanstalk.com/auto-complete",
				status: "ON"
			})
		};
		this._queryService = function(b, c) {
			for (var d in this.anydoServicesJson) {
				var a = this.anydoServicesJson[d];
				if ((a.name = b) && a.version == c) return a.url
			}
			return null
		};
		this.getAutoCompleteServiceUrl = function() {
			return this._queryService("auto-complete", "2.0")
		};
		this.initialize()
	}
});