#daemonizejs
===========

Daemonize is a tool that takes a method and returns a function with a daemon like interface (start, stop, restart).

Usage
-----

	var testFun = function () {
		// Do something
	};

	var daemon = $.daemonize(testFun, 1000);

	daemon.start(); // will run the testFun every second.
	daemon.stop(); // will stop the testFun from running.
	daemon.restart(); // will stop, then start the function.
	daemon.status(); // returns true if the function is currently running, false if not.

You can also specify a function that runs on the restart invocation once the daemon stops.

	var reinit = function () {
		// Clean up
	};

	var daemon2 = $.daemonize(testFun, 1000, reinit);

	daemon2.start();
	daemon2.restart(); // stops testFun, runs reinit, then starts testFun again

--------------
##Number of runs
--------------
It is possible to control the number of times the daemonized function runs (rather than running it infinitely, as is the default).

To run the daemon a given number of times:

	daemon.start(10); // causes daemon to run 10 times.

- stopping the daemon sets the number of times it will run back to 0.

To set a running daemon up to run a given number of additional times, on top of the # of runs it has remaining:

	daemon.start(10);
		// ...then later in the code, after daemon has run twice: //
	daemon.addRepeats(4); 	//daemon will now run a total of 12 more times


Set a stopped daemon up to run a certain number of times when eventually started, without starting it:

	daemon.stop();
	daemon.addRepeats(4);
	daemon.restart();	// daemon will run 4 times

	
Set a stopped daemon up to accumulate the number of times it will run when eventually started:

	daemon.stop();
	daemon.addRepeats(2);
	daemon.addRepeats(3);
	daemon.restart(); //daemon will run 5 times

Increase the number of additional times the daemon will run the function if, and start it if it's currently stopped:

	daemon.addRepeats(5, true); //If stopped, start it & run 5 times; if started, add 5 to # of runs left.
