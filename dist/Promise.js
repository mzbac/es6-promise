"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by anchen on 2016/2/22.
 */

var Promise = exports.Promise = function () {
    function Promise() {
        _classCallCheck(this, Promise);

        this.State = {
            PENDING: 0,
            FULFILLED: 1,
            REJECTED: 2
        };
        this.state = this.State.PENDING;
    }

    _createClass(Promise, [{
        key: "changeState",
        value: function changeState(state, value) {
            // catch changing to same state (perhaps trying to change the value)
            if (this.state == state) {
                throw new Error("can't transition to same state: " + state);
            }

            // trying to change out of fulfilled or rejected
            if (this.state == this.State.FULFILLED || this.state == this.State.REJECTED) {
                throw new Error("can't transition from current state: " + state);
            }

            // if second argument isn't given at all (passing undefined allowed)
            if (state == this.State.FULFILLED && arguments.length < 2) {
                throw new Error("transition to fulfilled must have a non null value");
            }

            // if a null reason is passed in
            if (state == this.State.REJECTED && value == null) {
                throw new Error("transition to rejected must have a non null reason");
            }

            //change state
            this.state = state;
            this.value = value;
            return this.state;
        }
    }, {
        key: "then",
        value: function then(onFulfilled, onRejected) {

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
    }, {
        key: "resolve",
        value: function resolve() {
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
    }, {
        key: "async",
        value: function async(fn) {
            setTimeout(fn, 0);
        }
    }]);

    return Promise;
}();
//# sourceMappingURL=Promise.js.map
