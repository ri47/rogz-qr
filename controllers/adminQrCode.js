// ********************************************************** AdminQrCode controller ********************************************* //

const mongoose = require('mongoose');
const config = require('../config');
const async = require('async');
const _ = require('lodash');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const CryptoTS = require("crypto-ts");
const userSchema = mongoose.model('user');
const qrSchema = mongoose.model('qrCode');
const fs = require('fs');

// ********************************************************* Admin Auth API **************************************************** //

exports.adminLogin = (req, res) => {
    var receivedValues = req.body;
    if (
        JSON.stringify(receivedValues) === '{}' ||
        receivedValues === undefined ||
        receivedValues === null ||
        receivedValues.userName === '' ||
        receivedValues.password === ''
    ) {
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": "All fields are required"
        });
        return;
    } else {
        const bytes = CryptoTS.AES.decrypt(req.body.password.toString(), config.secret);
        const plaintext = bytes.toString(CryptoTS.enc.Utf8);
        userSchema.findOne({
            userName: receivedValues.userName,
            isAdmin: true
        }, (err, userDetail) => {
            if (userDetail !== null) {
                if (userDetail.validPassword(plaintext)) {
                    var authToken = jwt.sign(userDetail.toJSON(), config.secret, {
                        expiresIn: '24h'
                    });
                    res.json({
                        "code": config.successCode,
                        "authToken": authToken,
                        "data": userDetail,
                        "status": "success"
                    });
                } else {
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": "Your password is wrong."
                    });
                }
            } else {
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": "Your username is wrong."
                });
            }
        });
    }
};


exports.getUsers = (req, res) => {
    if(req.user && !req.user.isAdmin) {
        return res.json({
            status: "err",
            code: 401,
            success: false,
            message: 'Failed to authenticate token.',
            data: null
        })
    }
    const offset = req.body.pageOffset * req.body.pageLimit;
    userSchema.find({
        _id: { $ne: req.user._id },
        isAdmin: false
    })
        .lean()
        .countDocuments()
        .then(counts => {
            return counts;
        }).then((totalUsers) => {
            if (!totalUsers || totalUsers === 0) {
                res.json({
                    "code": config.successCode,
                    "status": "Error",
                    "message": 'No Users found',
                });
                return;
            } else {
                userSchema.find({
                    _id: { $ne: req.user._id },
                    isAdmin: false
                })
                    .sort({ _id: -1 })
                    .skip(offset)
                    .limit(req.body.limit)
                    .select({ __v: 0 })
                    .lean()
                    .exec((err, Users) => {
                        if (err) {
                            console.log(err);
                            res.json({
                                "code": config.errCode,
                                "status": "Error",
                                "message": config.errMessage,
                            });
                            return;
                        } else {
                            res.json({
                                "code": config.successCode,
                                "status": "success",
                                "data": {
                                    users: Users,
                                    totalUsers: totalUsers
                                }
                            });
                        }
                    });
            }
        })
};

exports.deleteUserByID = (req, res) => {
    const receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": "Invalid data enter"
        });
    } else {
        let usercolumns = ["userID"];
        for (let iter = 0; iter < usercolumns.length; iter++) {
            let columnName = usercolumns[iter];
            if (receivedValues[columnName] === undefined && (columnName === 'userID')) {
                console.log(chalk.red(columnName, " field is undefined at getUserByID"));
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": columnName + " field is undefined"
                });
                return;
            }
        }
        userSchema.deleteOne({
            _id: req.body.userID
        }).exec((err, userInfo) => {
            if (err) {
                console.log(err);
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": config.errMessage,
                });
                return;
            }
            if (userInfo.deletedCount === 1) {
                res.json({
                    "code": config.successCode,
                    "status": "success",
                    "message": 'User deleted sucessfully'
                });
            } else {
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": config.errMessage,
                });
            }
        });
    }
};

exports.getUserByID = (req, res) => {
    const receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": "Invalid data enter"
        });
    } else {
        let usercolumns = ["userID"];
        for (let iter = 0; iter < usercolumns.length; iter++) {
            let columnName = usercolumns[iter];
            if (receivedValues[columnName] === undefined && (columnName === 'qrID')) {
                console.log(chalk.red(columnName, " field is undefined at getUserByID"));
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": columnName + " field is undefined"
                });
                return;
            }
        }
        userSchema.findOne({
            _id: req.body.userID
        })
            .select({ __v: 0 })
            .exec((err, userInfo) => {
                if (err) {
                    if (err.name == 'CastError' && err.kind == 'ObjectId' && err.path == '_id') {
                        res.json({
                            "code": config.errCode,
                            "status": "Error",
                            "message": "User not found...",
                        });
                        return;
                    } else {
                        console.log(err);
                        res.json({
                            "code": config.errCode,
                            "status": "Error",
                            "message": config.errMessage,
                        });
                        return;
                    }
                }
                if (!userInfo) {
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": "User not found...",
                    });
                } else {
                    res.json({
                        "code": config.successCode,
                        "status": "success",
                        "data": userInfo
                    });
                }
            });
    }
};

exports.postEditUser = (req, res) => {
    const receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": "Invalid data enter"
        });
    } else {
        userSchema.findOne({
            _id: req.body.userID
        })
            .select({ _id: 1 })
            .exec((err, userInfo) => {
                if (err) {
                    console.log(err);
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": config.errMessage,
                    });
                    return;
                }
                if (userInfo) {
                    let fieldToSet;
                    fieldToSet = {
                        firstName: !receivedValues.firstName ? 'User' : receivedValues.firstName,
                        lastName: !receivedValues.lastName ? '' : receivedValues.lastName,
                        email: !receivedValues.email ? '' : receivedValues.email,
                        userName: !receivedValues.userName ? '' : receivedValues.userName,
                        updated_date: config.utcDefault()
                    };
                    let Option = {
                        new: true
                    };
                    userSchema.findByIdAndUpdate(userInfo._id, fieldToSet, Option, (err, updatedData) => {
                        if (err) {
                            console.log(err);
                            res.json({
                                "code": config.errCode,
                                "status": "Error",
                                "message": config.errMessage,
                            });
                            return;
                        } else {
                            res.json({
                                "code": config.successCode,
                                "status": "Success",
                                "message": "User updated successfully",
                                "data": updatedData
                            });
                        }
                    });
                }
            });
    }
}


exports.changeVerifiedStatus = (req, res) => {

    const receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": "Invalid data enter"
        });
    } else {
        userSchema.findOne({
            _id: req.body.userID
        })
            .select({ _id: 1 })
            .exec((err, userInfo) => {
                if (err) {
                    console.log(err);
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": config.errMessage,
                    });
                    return;
                }
                if (userInfo) {
                    let fieldToSet;
                    fieldToSet = {
                        isVerified: receivedValues.isVerified == "false" ? false : true,
                        updated_date: config.utcDefault()
                    };
                    let Option = {
                        new: true
                    };
                    userSchema.findByIdAndUpdate(userInfo._id, fieldToSet, Option, (err, updatedData) => {
                        if (err) {
                            console.log(err);
                            res.json({
                                "code": config.errCode,
                                "status": "Error",
                                "message": config.errMessage,
                            });
                            return;
                        } else {
                            res.json({
                                "code": config.successCode,
                                "status": "Success",
                                "message": "User status updated successfully",
                                "data": updatedData
                            });
                        }
                    });
                }
            });
    }

}

