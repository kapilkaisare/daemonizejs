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
	daemon.status(); // returns true if the function is currently running, false if not.

You can also specify a function that runs on the restart invocation once the daemon stops.

	var reinit = function () {
		// Clean up
	};

	var daemon2 = $.daemonize(testFun, 1000, reinit);

	daemon2.start();
	daemon2.restart(); // stops testFun, runs reinit, then starts testFun again

Number of runs
--------------
It is possible to control the number of times the daemonized function runs (rather than running it infinitely, as is the default)

Run the daemon a given number of times:

	daemon.start(10); // causes daemon to run 10 times.

Stopping the daemon sets the number of times it will run back to 0.

Set daemon to run a given number of additional times, on top of the # of times it's already been set to run. 

	daemon.start(10);
		// ...then later in the code, after daemon has run twice: //
	daemon.addRepeats(4); 	//daemon will now run a total of 12 more times

-----------------
daemon.addRepeats(numRepeatsToAdd, doRunImmediately)
-----------------
Set a stopped daemon up to run a certain number of times when eventually started:

or set it up to immediately start and run the given number of times:
	daemon.stop();
	daemon.addRepeats(4);
	daemon.addRepeats(3);
	daemon.restart(); //daemon will now run the function 7 times

- if
			      // e.g. if  

	daemon.addRepeats(someNumber); //If the function is not infinitely looping, will add 'someNumber' of 
				       // repeats to the number of times the function will run.

