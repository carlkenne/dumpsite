var fs = require('fs');
var rp = require('request-promise');
var rimraf = require('rimraf');

var sitmapUrl = "/dumpsite/sitemap.json"; // change this url to a proper url
var destination = "./sitedump/";
rimraf.sync(destination);
fs.mkdir(destination);

var domain = process.argv.filter(function(arg) { return arg.indexOf("domain=") == 0; })[0];
domain = domain.replace("domain=", "");

function sitemapDownloaded(data) {
	console.log("SiteMap:", JSON.parse(data));

	JSON.parse(data).list.forEach(function(url) {
		rp(domain + url)
			.then(function(html) { pageDownloaded(url,html) })
    		.catch(console.error);
	});
}

function pageDownloaded(url, html){
	var path = destination + url.replace("/","").split("/").join("_").replace(".html","") + ".html";
	console.log("Output to: " + path);
	fs.writeFile(path, html, {flags:"w"});
}

console.log("SiteMapUrl: " + domain + sitmapUrl);
rp(domain + sitmapUrl)
    .then(sitemapDownloaded)
    .catch(console.error);
