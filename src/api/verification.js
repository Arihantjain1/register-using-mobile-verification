/**
* @Developed by @ArihantBhugari
*/

const mongoQuery = require('../../mongoQuery/query2mongo');
const message = require('../utils/enum');
var authy = require('authy')('API_KEY');

class verfication {
    //verifyOTP
    verifyOtp(number, code) {
        var response = {};
        return new Promise((resolve, reject) => {
            var mongoD = new mongoQuery();
            var query = { 'phone.number': number }
            mongoD.findOne('users', query, (err, result, data) => {
                if (err) {
                    //return err in failure handler
                    response.errors = [err];
                    response.code = 500;
                    response.message = message.SERVER_ERROR;
                    return this.failureHandler(response, reject)
                }
                if (result) {
                    authy.phones().verification_check(data.phone.number, data.phone.country, code, (err, data) => {
                        if (err) {
                            if (!err.success) {
                                console.log(err);
                                response.error = null;
                                response.code = 400;
                                response.message = err.message;
                                return this.failureHandler(response, reject)
                            }
                        } else {
                            return this.updateStatus(number, 'active', response, resolve);
                        }
                    });
                } else {
                    response.error = null;
                    response.code = 404;
                    response.message = message.USER_NOT_FOUND_ERROR
                    return this.failureHandler(response, reject)
                }
            })
        })
    }

    //sendOTP
    sendOtp(countryCode, number) {
        var response = {};
        return new Promise((resolve, reject) => {
            var mongoD = new mongoQuery();
            var query = { 'phone.number': number }
            mongoD.findOne('users', query, (err, result, data) => {
                if (err) {
                    //return err in failure handler
                    response.errors = [err];
                    response.code = 500;
                    response.message = message.SERVER_ERROR;
                    return this.failureHandler(response, reject)
                }
                if (result) {
                    authy.phones().verification_start(number, countryCode, 'sms', (error, data) => {
                        if (error) {
                            response.code = 400;
                            response.message = message.PHONE_NUMBER_INVALID;
                            return this.failureHandler(response, resolve)
                        } else {
                            response.result = 'Success';
                            response.code = 201;
                            response.message = message.OTP_SENT_SUCCESSFULLY;
                            return resolve(response)
                        }
                    });
                } else {
                    response.error = null;
                    response.code = 404;
                    response.message = message.USER_NOT_FOUND_ERROR
                    return this.failureHandler(response, reject)
                }
            })
        })
    }

    updateStatus(number, status, response, resolve) {
        var mongoD = new mongoQuery();
        var query = { 'phone.number': number };
        var update = { 'isAuthy': true, 'status': status }
        mongoD.updateOne('users', query, update, true, false, null, (err, result, data) => {
            if (err) {
                //return err in failure handler
                response.error = err;
                response.code = 500;
                response.message = message.SERVER_ERROR;
                return this.failureHandler(response, reject)
            }
            if (result) {
                response.result = 'Success'
                response.code = 200;
                response.message = message.VERIFICATION_SUCCESSFULL;
                return resolve(response)
            }
        })
    }

    failureHandler(response, reject) {
        response.responseTimestamp = new Date();
        response.result = 'Failed';
        return reject(response);
    }
}

module.exports = new verfication();