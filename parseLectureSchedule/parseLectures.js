var fd = require('./fileDownload.js'), fc = require('./fileComparison.js'), fs = require('fs'), gd = require('./getDates.js'), exec = require('child_process').exec;
var courses = { wwi2016a: "http://studium.dhbw-stuttgart.de/fileadmin/wi/Vorlesungsplaene_WI/Vorlesungsplaene_Wenger/Vorlesungsplan_2016A_2Sem.pdf", wwi2015a: "http://studium.dhbw-stuttgart.de/fileadmin/wi/Vorlesungsplaene_WI/Vorlesungsplaene_Wenger/Vorlesungsplan_WWI2015A_4Sem.pdf" };

this.parseLectures = function(course, callback) {
	fd.downloadFile(courses[course], function(filename) {
		fc.compareFiles(filename, function(result) {
			if (!result) {
				try {fs.unlinkSync('tmp/' + filename + '.csv');} catch (err) {}
				try {fs.unlinkSync('tmp/' + filename);} catch (err) {}
				fs.rename(filename, 'tmp/' + filename, function (err) {
					exec("java -Dfile.encoding=UTF-8 -jar java/tabula-0.9.2-jar-with-dependencies.jar -g -n -o tmp/" + filename + ".csv tmp/" + filename, function(error, stdout, stderr) {
						fs.readFile( 'tmp/' + filename + '.csv', function (err, data) {
							gd.getDates(course, data.toString(), function(schedule) {
								callback(schedule);
							})
						});
					});
				});
			} else {
				try {fs.unlinkSync(filename);} catch (err) {}
				fs.readFile( 'tmp/' + filename + '.csv', function (err, data) {
					gd.getDates(course, data.toString(), function(schedule) {
						callback(schedule);
					});
				});
			}
		});
	})
}