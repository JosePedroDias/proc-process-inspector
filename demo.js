var ppInspector = require('./index');



var pid = 1197;

ppInspector.getMemory(pid, function(err, out) {
	console.log(err, out);
});

ppInspector.getCPU(pid, function(err, out) {
	console.log(err, out);
});
