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



let parseProcPidFileLines = function(pid, fileName, onLine, onDone) {
    let fn = ['/proc', pid, fileName].join('/');
	let l = ls();
	let out = {};
    let died = false;

	l.on('data', function(line) {
        if (died) { return; }
        try {
            onLine(line, out);
        } catch (ex) {
            died = true;
            onDone(ex);
        }
	});
	
	l.on('error', function(err) {
		died = true;
		onDone(err);
	});
	
	l.on('close', function() {
		if (died) { return; }
		onDone(null, out);
	});
	
	fs.createReadStream(fn)
	.on('error', function(err) {
		died = true;
		onDone(err);
	})
	.pipe(l);
};



let getMemory = function(pid, cb) {
    parseProcPidFileLines(
        pid,
        'status',
        function(line, out) {
            if (startsWithVmSizeRgx.test(line)) {
                out.vmSize = parseEndsWithIntAndUnit(line);
            }
            else if (startsWithVmDataRgx.test(line)) {
                out.vmData = parseEndsWithIntAndUnit(line);
            }
        },
        cb
    );
};

let getCPU = function(pid, cb) {
    parseProcPidFileLines(
        pid,
        'sched',
        function(line, out) {
            if (startsWithSERRgx.test(line)) {
                out.sumExecRuntime = parseEndsWithFloat(line);
            }
        },
        cb
    );
};



module.exports = {
	getMemory : getMemory,
	getCPU    : getCPU
};
