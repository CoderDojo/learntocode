var log = require('../log')

module.exports = {
	
	cssToJson: function(results) {  

		for(var row = 0; row < results.length; row++) {
			console.log('Parsing json for user ' + results[row].name )
			if(results[row].css && results[row].css.length > 0)
				results[row].css = JSON.parse(results[row].css)
		}
		return results
	}
}