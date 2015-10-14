'use strict';

var fs = require('fs');
var ls = require('line-stream');

var units = {
	B  : 1,
	kB : 1000
};

var parseIntUnit = function(line) {
	var parts = line.split(' ');
	var unit = parts.pop();
	var num = parts.pop();
	return parseInt(num, 10) * units[unit];
};

var parseFloat_ = function(line) {
	var parts = line.split(' ');
	return parseFloat( parts.pop() );
};



var getMemory = function(pid, cb) {
	var fn = '/proc/' + pid + '/status';
	var l = ls();
	var out = {};

	l.on('data', function(line) {
		if ((/^VmSize:/).test(line)) {
			out.size = parseIntUnit(line);
		}
		else if ((/^VmData:/).test(line)) {
			out.data = parseIntUnit(line);
		}	
	});
	
	var died = false;
	l.on('error', function(err) {
		died = true;
		cb(err);
	});
	
	l.on('close', function() {
		if (died) { return; }
		cb(null, out);
	});
	
	fs.createReadStream(fn)
	.on('error', function(err) {
		died = true;
		cb(err);
	})
	.pipe(l);
};

var getCPU = function(pid, cb) {
	var fn = '/proc/' + pid + '/sched';
	var l = ls();
	var out = {};

	l.on('data', function(line) {
		if ((/^se.sum_exec_runtime/).test(line)) {
			out.sumExecRuntime = parseFloat_(line);
		}
	});

	var died = false;
	l.on('error', function(err) {
		died = true;
		cb(err);
	});
	
	l.on('close', function() {
		if (died) { return; }
		cb(null, out);
	});

	fs.createReadStream(fn)
	.on('error', function(err) {
		died = true;
		cb(err);
	})
	.pipe(l);
};



module.exports = {
	getMemory : getMemory,
	getCPU    : getCPU
};
