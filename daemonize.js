var daemonize = function ( method, period, reinitializer ) {
		var 
            delayedFunction = null,
			keepRunning = true,
			postStop = null,
            moreRepeats = 0;


		if ( typeof method !== 'function' ) {
			throw new TypeError( 'Argument 0 ( Method ) should be a function' );
		}

		if ( typeof period !== 'number' ) {
			throw new TypeError( 'Argument 1 ( Period ) should be a number' );
		}

        if (typeof reinitalizer !== "undefined") {
            if (typeof reinitializer !== 'function' ) {
			    throw new TypeError( 'Argument 2 ( Method ) should be a function' );
            }
        } else {
            var reinitializer = reinitializer || function (){};
        }
    
        /**
         * Public functions 
         */
		return {

            /**
			 * Start running the function. Run it 'numRuns' times. If no 'numRuns' value is 
			 * given, run until 'stop' is called.
			 */
			start: function( numRuns ) {
				var me = this;
				if ( keepRunning ) {
					postStop = null;
					method();
                    if (typeof numRuns === 'undefined' || typeof numRuns != 'number') {
    					delayedFunction = setTimeout( me['start'].bind(me), period);
                    } else if (typeof numRuns === 'number'){
                        if ( numRuns > 1 ) {
                            delayedFunction = setTimeout( me['start'].bind( me, (--numRuns) ), 
                            							  period );
                        } else {
                            if (moreRepeats > 0) {
                                var repeats = moreRepeats;
                                moreRepeats = me.moreRepeats = 0;
                            delayedFunction = setTimeout( me['start'].bind( me, repeats ), 
                            							  period );
                            } else {
                                keepRunning = false;
                                return true;
                            }
                        }
                    }
				} else {
					if ( postStop ) setTimeout( postStop(), period );
				}
			},

            /**
			 * Stop running the function.
			 */
			stop: function () {
				keepRunning = false;
			},

 			/**
			 * Start running the function again. If a number of runs was initially given, it
			 * is ignored. On restart, the function runs either indefinitely, or the number of
             * times passed into this function (numRuns).
			 */
			restart: function ( numRuns ) {
				var me = this;
				if ( !keepRunning ) {
    				keepRunning = true;
   					if ( numRuns && typeof numRuns === "number" ) me.start( numRuns )
                    else me.start();
				} else {
					postStop = function () {
						reinitializer();
						keepRunning = true;
                        if ( typeof numRuns !== 'undefined' && typeof numRuns === 'number' ) {
                            me['start'].bind( me )( numRuns );
                        } else {
                            me['start'].bind( me )();
                        }
					};
					me.stop();
				}
			},
            
            /**
             * Add numToAdd to the number of times the function will run. If doRunImmediately, 
             * instantly launch not running. Otherwise just add it to a cumulative # of times
             * it will run once it's launched. If the function is already running and non-infinite,
             * add numToAdd to the number of times it will run.
             */
            addRepeats: function(numToAdd, doRunImmediately) {
				var me = this, 
                    newNum;
                moreRepeats = me.moreRepeats = moreRepeats + numToAdd;
                if (keepRunning === false) {
                    if (doRunImmediately !== "undefined" && doRunImmediately === true) {
                        newNum = moreRepeats;
                        moreRepeats = me.moreRepeats = 0;
						keepRunning = true;
                        me['start'].bind( me )( newNum );
                    }
                }
            },

            /**
             * Return whether or not the function is currently running.
             */
			status: function () {
				return keepRunning;
			},
		};
};
