//----------------- 变量与环境 -----------------//
var util = require('util'),
	fs = require('fs'),
	_ = require('underscore'),
	needle = require('needle'),
	Fetch = require("fetch"),
	async = require('async'),
	models = require('./models/models.js'),
	Item = models.Item,
	https = require('https');


exports.start = function() {
	fs.readFile('./src/dealSites.json', function(err, data) {
		var _sites = _.values(JSON.parse(data));
		var sites = [];
		function groupSites(){
			if(_sites.length>0){
				var group = _sites.splice(0,20).join(',');
				sites.push(group)
				groupSites();
			}
		}
		groupSites();
		async.each(sites, function(group, callback) {
			fetch(group);
			callback();
		}, function(err) {
			if(err) { util.log(err) };
		})
		// var sites = ["1713053037", "1341267693", "1273034312", "1610362247", "1624763627", "1644225642", "1573047053", "1495037557", "1919131861", "1222135407", "1653460650", "1191965271", "2109300743", "1891422510", "1918182630", "2195315124", "1640516504", "1920061532", "1893786465", "2093879035", "2377059260", "1947267610", "1848155523", "2720880354", "2141100877", "1708242827", "2267520473", "2272568451", "1733950851", "2124580897"];
	})
}
function fetch(group) {
	needle.get('https://api.weibo.com/2/statuses/timeline_batch.json?access_token=2.00xudY2Bp7AtIDfb89a2306f0o2KP2&uids=' + group + '&feature=1&count=200', function(error, res, body){
		var plantsDict;
		fs.readFile('./src/plantsDict.txt', function(err, data) {
			plantsDict = _.compact(data.toString().split('\n'));
			tweets = (body||'').statuses;
			util.log(group);
			//util.log(util.inspect(tweets[0]));
			if (tweets && tweets.length) {
				for (i = tweets.length-1; i >= 0; i--) {
					tweet = tweets[i];
					if (tweet.text.match(/预订|粉丝|微博|屏蔽|有奖|奖品|大奖|转发|转让|微信/) || tweet.bmiddle_pic === void 0) {
					} else {
						// console.log("\n图片: " + tweet.bmiddle_pic);
						// console.log("内容：" + tweet.text);
						async.detect(plantsDict, function(v, callback){
							callback(tweet.text.indexOf(v) !== -1);
						}, function(result){
							if (result !== undefined) {
								var item = new Item();
								item.text = tweet.text;
								item.keyword = result;
								item.image_url = tweet.bmiddle_pic;
								item.author = tweet.user.name;
								item.profile_url = tweet.user.profile_url;
								item.created_at = tweet.created_at;
								item.weibo_id = tweet.mid;
								item.source = "weibo";
								item.site_id = tweet.user.name;
								item.save(function(err) {
									//return console.log(err);
								});
							}
						})
					}
				}
			}
		})
	})
	// var options = {
	// 	host: 'api.weibo.com',
	// 	port: 443,
	// 	path: '/2/statuses/timeline_batch.json?&access_token=2.00xudY2Bp7AtIDfb89a2306f0o2KP2&uids=' + sites + '&feature=1&count=10',
	// 	method: 'get'
	// };
	// var req = https.get(options, function(res) {
	// 	res.on('data', function(chunk) {
	// 		console.log('BODY: ' + chunk);
	// 	});
	// })
	// req.end();
	// Fetch.fetchUrl('https://api.weibo.com/2/statuses/timeline_batch.json?access_token=2.00xudY2Bp7AtIDfb89a2306f0o2KP2&uids=' + sites + '&feature=1&count=10', function(error, meta, body){
	// 	console.log(body.toString()+'/n/n/n/nasfsf');
	// })
}

		
