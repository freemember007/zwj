var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Define Deal schema
var _Item = new Schema({
	user: {
		author: String,
		avatar: String,
		profile_url: String,
	},
	text: {type: String, index: true, unique: true},
	keyword: String,
	image_url: String,
	created_at: Date,
	weibo_id: String,
});

// export them
exports.Item = mongoose.model('Item', _Item);

