# WAT?

Simple methods for asserting the state of processes.
Requires procfs. Tested only on Linux so far.


# API

```javascript
var insp = require('proc-process-inspector');

insp.getMemory({Number} pid, {Function} cb);

insp.getCPU({Number} pid, {Function} cb);
```


# Reference

/proc/<PID>
	status table 1-2
	stat   table 1-1 1-4
	statm  table 1-3
	io     table 1-
	sched  http://www.linuxquestions.org/questions/linux-newbie-8/can-someone-explain-the-output-of-proc-pid-sched-4175412750/

memory - status
	VmSize, VmData
cpu - sched
	se.vm_...
		

https://www.kernel.org/doc/Documentation/filesystems/proc.txt
