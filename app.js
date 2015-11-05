//必要モジュールのダウンロード
var client = require('cheerio-httpcli');
var mkdirp = require('mkdirp');
var URL = require('url');
var request = require('request');
var fs = require('fs');

//ダウンロードするページ数
var MAX_PAGE = 197;

var para = {};
var src;
var answer;

//==========================================================================================

//使用例
//for (var i = 1; i <= MAX_PAGE; i++) {
//	fetchComic('tomochan', i,'C:/Users/Patchgi/Documents/tw4Downloader');
//}

//0埋め関数
function nf(_num) {
	if (_num < 10) {
		return "000" + _num;
	}
	else if (_num < 100) {
		return "00" + _num;
	}
	else if (_num < 1000) {
		return "0" + _num;
	}
	else {
		return _num;
	}
}

//指定作品URLからからマンガの画像だけスクレイプする関数(マンガの名前,ページ引数,ダウンロード先)
function fetchComic(_comicName, _fileCount, _path) {
	var url = "http://sai-zen-sen.jp/comics/twi4/" + _comicName + "/";
	var urlList = new Array();

	url += nf(_fileCount) + ".html";
	

	mkdirp(_path+"/"+_comicName, function (err) {
		if (err) {
			console.error(err);
		} 
	});

	client.fetch(url, para, function (err, $, res) {
		if (err) {
			console.log(err);
			return;
		}
		$('.pgroup p img').each(function (idx) {
			src = $(this).attr('src');
			answer = URL.resolve(url, src);
			urlList.push(answer);
		});
		request(
			{
				method: 'GET',
				url: urlList[1],
				encoding: null
			},
			function (error, responce, body) {
				fs.writeFileSync(_path+"/"+_comicName + "/" + nf(_fileCount) + ".png", body, 'binary');
			}
			);
	})

}
