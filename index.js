var fs = require('fs');
var rp = require('request-promise');
var rimraf = require('rimraf');
var webshot = require('webshot');


var sitmapUrl = "/dumpsite/sitemap.json"; // change this url to a proper url
var destination = "./sitedump/";
rimraf.sync(destination);
fs.mkdir(destination);

function getArg(_arg, _default){
	var foundArg = process.argv.filter(function(a) { return a.indexOf(_arg) == 0; });
	if(foundArg.length > 0){
		return foundArg[0].replace(_arg, "");
	}
	return _default;
}

var domain = getArg("domain=","missing domain");
var screenshot = getArg("screenshot=", "false");

function sitemapDownloaded(data) {
	console.log("SiteMap:", JSON.parse(data));

	JSON.parse(data).list.forEach(function(url) {
		console.log("screenshot: " + screenshot);
		if(screenshot == "true"){
			webshot(domain + url, urlToFileName(url, ".png"), function(err) {});	
		}
		
		rp(domain + url)
			.then(function(html) { pageDownloaded(url,html) })
    		.catch(console.error);
	});
}

function pageDownloaded(url, html){
	var path = urlToFileName(url, ".html");
	console.log("Output to: " + path);
	fs.writeFile(path, html, {flags:"w"});
}

function urlToFileName(url, type){
	return destination + url.replace("/","")
		.split("/").join("_")
		.replace(".html","") + type;
}

console.log("SiteMapUrl: " + domain + sitmapUrl);
rp(domain + sitmapUrl)
    .then(sitemapDownloaded)
    .catch(console.error);
