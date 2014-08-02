var daemonize = function (method, period, reinitializer) {
	var
		delayedFunction = null,
		keepRunning = true,
		postStop = null;


	if (typeof method !== 'function') {
		throw new TypeError('Argument 0 (Method) should be a function');
	}

	if (typeof period !== 'number') {
		throw new TypeError('Argument 1 (Period) should be a number');
	}

	if (!reinitalizer && typeof reinitializer !== 'function') {
		throw new TypeError('Argument 2 (Method) should be a function');
	}

	reinitializer = reinitializer || function () {};

	return {
		start: function () {
			var me = this;
			if (keepRunning) {
				postStop = null;
				method();
				delayedFunction = setTimeout(me.start, period);
			} else {
				if (postStop) {
					setTimeout(postStop(), period);
				}
			}
		},
		stop: function () {
			keepRunning = false;
			if (delayedFunction) cancelTimeout(delayedFunction);
		},
		restart: function () {
			var me = this;
			if (!keepRunning) {
				me.start();
			} else {
				postStop = function () {
					reinitializer();
					keepRunning = true;
					me.start();
				};
				me.stop();
			}
		},
		status: function () {
			return keepRunning;
		}
	};
};