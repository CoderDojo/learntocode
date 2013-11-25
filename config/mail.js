module.exports = {

	config: function() {
		return {
		    auth: {
		        user: "dcu@coderdojo.com",
		        pass: process.env['EMAIL_PASSWORD'] || ""
		    }
		}
	}
}
