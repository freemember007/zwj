var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Define Deal schema
var _Item = new Schema({
	author: String,
	text: {type: String, index: true, unique: true},
	keyword: String,
	image_url: String,
	profile_url: String,
	created_at: Date,
	source: String,
	weibo_id: String,
	site_id: String
});

// export them
exports.Item = mongoose.model('Item', _Item);

