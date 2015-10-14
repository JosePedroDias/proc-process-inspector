'use strict';

/*jshint node:true, esnext:true */



let fs = require('fs');
let ls = require('line-stream');



let units = {
     B :    1,
    kB : 1000
};



let startsWithVmSizeRgx = /^VmSize:/;
let startsWithVmDataRgx = /^VmData:/;
let startsWithSERRgx    = /^se\.sum_exec_runtime/;

let endsWithIntAndUnitRgx = /([0-9]+) ([A-Za-z]+)$/;
let endsWithFloatRgx      = /([0-9]+\.?[0-9]*)$/;



let parseEndsWithIntAndUnit = function(line) {
    let parts = line.split(' ');
    let unit = parts.pop();
    let num = parts.pop();
    return parseInt(num, 10) * units[unit];
};

let parseEndsWithFloat = function(line) {
	let parts = line.split(' ');
	return parseFloat( parts.pop() );
};



var getMemory = function(pid, cb) {
    var fn = ['/proc/', pid, '/status'].join('');
	var l = ls();
	var out = {};

	l.on('data', function(line) {
		if (startsWithVmSizeRgx.test(line)) {
			out.size = parseEndsWithIntAndUnit(line);
		}
		else if (startsWithVmDataRgx.test(line)) {
			out.data = parseEndsWithIntAndUnit(line);
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
	var fn = ['/proc/', pid, '/sched'].join('');
	var l = ls();
	var out = {};

	l.on('data', function(line) {
		if (startsWithSERRgx.test(line)) {
			out.sumExecRuntime = parseEndsWithFloat(line);
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
