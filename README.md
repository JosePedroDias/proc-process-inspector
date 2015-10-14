# WAT?

Simple methods for asserting the state of processes.  
Requires procfs. Tested only on Linux so far.


# API

```javascript
var insp = require('proc-process-inspector');

insp.getMemory({Number} pid, {Function} cb);
returns object with:
{Number} vmSize - in bytes
{Number} vmData - in bytes

insp.getCPU({Number} pid, {Function} cb);
returns object with:
{Number} sumExecRuntime - in ?
```


# To know more

## Reference

* <https://www.kernel.org/doc/Documentation/filesystems/proc.txt>
* <http://www.linuxquestions.org/questions/linux-newbie-8/can-someone-explain-the-output-of-proc-pid-sched-4175412750/>


## What's being fetched currently

* status (memory stats)
	  * VmSize
    * VmData
* sched (cpu stats)
	  * se.sum_exec_runtime
