
export class Promise {


    constructor() {
        this.State = {
            PENDING: 0,
            FULFILLED: 1,
            REJECTED: 2
        };
        this.state = this.State.PENDING
    }

    changeState(state, value) {
        // catch changing to same state (perhaps trying to change the value)
        if (this.state == state) {
            throw new Error("can't transition to same state: " + state);
        }

        // trying to change out of fulfilled or rejected
        if (this.state == this.State.FULFILLED ||
            this.state == this.State.REJECTED) {
            throw new Error("can't transition from current state: " + state);
        }

        // if second argument isn't given at all (passing undefined allowed)
        if (state == this.State.FULFILLED &&
            arguments.length < 2) {
            throw new Error("transition to fulfilled must have a non null value");
        }

        // if a null reason is passed in
        if (state == this.State.REJECTED &&
            value == null) {
            throw new Error("transition to rejected must have a non null reason");
        }

        //change state
        this.state = state;
        this.value = value;
        return this.state;

    }

    then(onFulfilled, onRejected) {

        // initialize array
        this.cache = this.cache || [];

        var promise = new Promise();
        var that = this;
        this.async(function () {
            that.cache.push({
                fulfill: onFulfilled,
                reject: onRejected,
                promise: promise
            });
            that.resolve();
        });

        return promise;
    }


    resolve() {
        // check if pending
        if (this.state == this.State.PENDING) {
            return false;
        }

        // for each 'then'
        while (this.cache && this.cache.length) {
            var obj = this.cache.shift();

            // get the function based on state
            var fn = this.state == this.State.FULFILLED ? obj.fulfill : obj.reject;
            if (typeof fn != 'function') {
                obj.promise.changeState(this.state, this.value);
            } else {

                // fulfill promise with value or reject with error
                try {

                    var value = fn(this.value);

                    // deal with promise returned
                    if (value && typeof value.then == 'function') {

                        value.then(function (value) {
                            obj.promise.changeState(this.State.FULFILLED, value);
                        }, function (reason) {
                            obj.promise.changeState(this.State.REJECTED, error);
                        });
                        // deal with other value returned
                    } else {
                        obj.promise.changeState(this.State.FULFILLED, value);
                    }
                    // deal with error thrown
                } catch (error) {
                    obj.promise.changeState(this.State.REJECTED, error);
                }
            }
        }
    }

    async(fn) {
        setTimeout(fn, 0);
    }
}
