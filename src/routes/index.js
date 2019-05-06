const express = require('express');
const router = express.Router();

const userController = require('../api/registration');
const verifcationController = require('../api/verification');



//register route
router.post('/register', (req, res) => {
    console.log(req.body)
    var userReg = new userController(req.body, req.headers);
    userReg.register()
        .then(result => {
            res.status(result.code).json({
                result: result.result,
                code: result.code,
                message: result.message
            })
        })
        .catch(err => {
            res.status(err.code).json({
                result: err.result,
                code: err.code
                // errors: (err.errors.length > 0) ? err.errors : null
            })
        })
})

//to send otp on user number for account verification
router.post('/sendOtp',(req,res)=>{
    console.log(req.body)
    verifcationController.sendOtp(req.body.code,req.body.number)
    .then(verification=>{
        res.status(verification.code).json({
            result: verification.result,
            code: verification.code,
            message: verification.message
        })
    })
    .catch(verificationError=>{
        res.status(verificationError.code).json({
            result: verificationError.result,
            code: verificationError.code,
            message: verificationError.message
        })
    })
})

//to verfy user mobile number via otp
router.post('/verify',(req,res)=>{
    console.log(req.body)
    verifcationController.verifyOtp(req.body.number,req.body.code)
    .then(verification=>{
        res.status(verification.code).json({
            result: verification.result,
            code: verification.code,
            message: verification.message
        })
    })
    .catch(verificationError=>{
        res.status(verificationError.code).json({
            result: verificationError.result,
            code: verificationError.code,
            message: verificationError.message
        })
    })
})

module.exports = router;