daemonizejs
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

You can also specify a function that runs on the restart invocation once the daemon stops.

	var reinit = function () {
		// Clean up
	};

	var daemon2 = $.daemonize(testFun, 1000, reinit);

	daemon2.start();
	daemon2.restart(); // stops testFun, runs reinit, then starts testFun again
