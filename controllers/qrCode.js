// ********************************************************** qrCode controller ********************************************* //

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
const QRCode = require('easyqrcodejs-nodejs');
const jwtVerify = require('../config/index');

// ********************************************************* User Auth API **************************************************** //

exports.register = (req, res) => {
    var receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}' || receivedValues === undefined || receivedValues === null) {
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": "Invalid Data Enter"
        });
        return;
    } else {
        userSchema.findOne({
            userName: req.body.userName
        })
            .select({ _id: 1 })
            .exec((err, user) => {
                if (err) {
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": err.message
                    });
                    return;
                }
                if (!user) {
                    var userdata = new userSchema();
                    userdata.firstName = _.capitalize(receivedValues.firstName);
                    userdata.lastName = _.capitalize(receivedValues.lastName);
                    userdata.email = receivedValues.email;
                    userdata.userName = receivedValues.userName;
                    userdata.password = userdata.generateHash(receivedValues.password);
                    userdata.save((err, data) => {
                        if (!err) {
                            var authToken = jwt.sign(data.toJSON(), config.secret, {
                                expiresIn: '24h'
                            });
                            // const emailSubject = 'Registration';
                            // const emailBody = 'Your Registration successfully.';
                            // const senderName = 'Elsner Technology Ptv. Ltd.';
                            // config.emailSender(receivedValues.email, emailSubject, emailBody, senderName);
                            res.json({
                                "code": config.successCode,
                                "authToken": authToken,
                                "data": data,
                                "status": "success"
                            });
                        } else {
                            res.json({
                                "code": config.errCode,
                                "status": "Error",
                                "message": err.message
                            });
                        }
                    });
                } else {
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": "Username already exists"
                    });
                }
            });
    }
};

exports.login = (req, res) => {
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

exports.forgotPassword = (req, res) => {
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
        userSchema.findOne({
            email: receivedValues.email,
        }, (err, userDetail) => {
            if (userDetail !== null) {
                var authToken = jwt.sign({}, config.secret, {
                    expiresIn: '1h'
                });
                let fieldToSet;
                fieldToSet = {
                    tokenValidate: authToken
                };
                let Option = {
                    new: true
                };
                userSchema.findByIdAndUpdate(userDetail._id, fieldToSet, Option, async (err, updatedData) => {
                    if (err) {
                        console.log(err);
                        res.json({
                            "code": config.errCode,
                            "status": "Error",
                            "message": config.errMessage,
                        });
                        return;
                    } else {
                        let link = `http://localhost:4200/auth/reset-password?token=${updatedData.tokenValidate}`
                        const message = {
                            from: 'ivanshu@elsner.in', // Sender address
                            to: updatedData.email,         // List of recipients
                            subject: 'Change Password', // Subject line
                            html: `<p>Click <a href=${link}>here</a> to reset your password</p>` // Plain text body
                        };
                        config.transporter.sendMail(message, function (err, info) {
                            if (err) {
                                console.log(err);
                                res.json({
                                    "code": config.errCode,
                                    "status": "Error",
                                    "message": "Not able to sned the mail. Please try again!!",
                                });
                                return;
                            } else {
                                res.json({
                                    "code": config.successCode,
                                    "status": "success",
                                    "message": 'A mail has been sent to registered email-id. Please verify the mail to change the password.'
                                });
                            }
                        });

                    }
                });
            } else {
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": "Your email is wrong."
                });
            }
        });
    }
};

exports.resetPassword = (req, res) => {
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
        userSchema.findOne({
            email: receivedValues.email,
        }, async (err, userDetail) => {
            if (userDetail !== null) {
                try {
                    const decoded = await jwtVerify.jwtTokenVerifier(receivedValues.token);
                    if (decoded) {
                        let fieldToSet;
                        var userdata = new userSchema();
                        fieldToSet = {
                            password: userdata.generateHash(receivedValues.password),
                            tokenValidate: null
                        };
                        let Option = {
                            new: true
                        };
                        userSchema.findByIdAndUpdate(userDetail._id, fieldToSet, Option, (err, updatedData) => {
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
                                    "message": 'Your password has been updated succesfully.'
                                });
                            }
                        });
                    } else {
                        res.json({
                            "code": config.errCode,
                            "status": "Error",
                            "message": "This link is no more existing. PLease try again.."
                        });
                    }
                } catch (error) {
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": "This link no more existing. PLease try again.."
                    });
                }
            } else {
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": "Your email is wrong."
                });
            }
        });
    }
};


exports.changePassword = (req, res) => {
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

        userSchema.findOne({
            _id: receivedValues.userID
        }, async (err, userDetail) => {
            if (userDetail !== null) {
                try {
                    if (userDetail.validPassword(receivedValues.currentPassword)) {
                        let fieldToSet;
                        var userdata = new userSchema();
                        fieldToSet = {
                            password: userdata.generateHash(receivedValues.newPassword),
                        };
                        let Option = {
                            new: true
                        };
                        userSchema.findByIdAndUpdate(userDetail._id, fieldToSet, Option, (err, updatedData) => {
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
                                    "message": 'Your password has been updated succesfully.'
                                });
                            }
                        });
                    } else {
                        res.json({
                            "code": config.errCode,
                            "status": "Error",
                            "message": "Your current password is wrong."
                        });
                    }
                } catch (error) {
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": "Something went wrong. PLease try again.."
                    });
                }
            } else {
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": "Your email is wrong."
                });
            }
        });
    }
};

// ********************************************************* Dynamic QR code API *********************************************** //

exports.createEditDynamicURL = (req, res) => {
    const receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": "Invalid data enter"
        });
    } else {
        qrSchema.findOne({
            userID: req.user._id,
            _id: req.body._id
        })
            .select({ _id: 1 })
            .exec((err, qrCodeInfo) => {
                if (err) {
                    console.log(err);
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": config.errMessage,
                    });
                    return;
                }
                if (!qrCodeInfo) {
                    let qrData;
                    qrData = {
                        userID: req.user._id,
                        qrName: !receivedValues.qrName || receivedValues.qrName == '' ? 'My QR' : receivedValues.qrName,
                        qrCodeContent: !receivedValues.qrCodeContent ? '' : receivedValues.qrCodeContent,
                        qrCodeType: !receivedValues.qrCodeType ? '' : receivedValues.qrCodeType,
                        created_date: config.utcDefault()
                    };
                    qrSchema.create(qrData, (err, result) => {
                        if (!err) {
                            res.json({
                                "code": config.successCode,
                                "status": "Smart QR code created successfully",
                                data: result
                            });
                        } else {
                            res.json({
                                "code": config.errCode,
                                "status": "err",
                                "message": "QR is not created",
                            });
                        }
                    });
                } else {
                    let fieldToSet;
                    fieldToSet = {
                        qrName: !receivedValues.qrName || receivedValues.qrName == '' ? 'My QR' : receivedValues.qrName,
                        qrCodeContent: !receivedValues.qrCodeContent ? '' : receivedValues.qrCodeContent,
                        qrCodeType: !receivedValues.qrCodeType ? '' : receivedValues.qrCodeType,
                        qrConfigData: !receivedValues.qrConfigData ? undefined : receivedValues.qrConfigData,
                        updated_date: config.utcDefault()
                    };
                    let Option = {
                        new: true
                    };
                    qrSchema.findByIdAndUpdate(qrCodeInfo._id, fieldToSet, Option, (err, updatedData) => {
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
                                "message": "QR code updated successfully",
                                "data": updatedData
                            });
                        }
                    });
                }
            });
    }
}

exports.getUserQRCodes = async (req, res) => {
    const offset = req.body.pageOffset * req.body.pageLimit;
    try {
        const qrCount = qrSchema.find({
            userID: req.user._id,
        });
        const search = req.body.search ? req.body.search.trim() : null;
        if (search) {
            qrCount.where('qrName').in(new RegExp(search, "i"));
        }
        const totalQRCodes = await qrCount
            .sort({ _id: -1 })
            .select({ _id: 1 })
            .countDocuments().exec();
        if (!totalQRCodes || totalQRCodes === 0) {
            res.json({
                "code": config.successCode,
                "status": "Error",
                "message": 'No QR code found',
                "data": {
                    qrCodes: [],
                    totalQRCodes: []
                }
            });
            return;
        } else {
            const qrCodesQuery = qrSchema.find({
                userID: req.user._id
            });
            if (search) {
                qrCodesQuery.where('qrName').in(new RegExp(search, "i"));
            }

            const qrCodes = await qrCodesQuery
                .sort({ _id: -1 })
                .skip(offset)
                .limit(req.body.limit)
                .select({ userID: 0, qrCodeContent: 0, qrConfigData: 0, __v: 0 })
                .lean()
                .exec();
            return res.json({
                "code": config.successCode,
                "status": "success",
                "data": {
                    qrCodes: qrCodes,
                    totalQRCodes: totalQRCodes
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": config.errMessage,
            "data": {
                qrCodes: [],
                totalQRCodes: []
            }
        });
    }

};

exports.getQRCodeByID = (req, res) => {
    const receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": "Invalid data enter"
        });
    } else {
        let usercolumns = ["qrID"];
        for (let iter = 0; iter < usercolumns.length; iter++) {
            let columnName = usercolumns[iter];
            if (receivedValues[columnName] === undefined && (columnName === 'qrID')) {
                console.log(chalk.red(columnName, " field is undefined at getQRCodeByID"));
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": columnName + " field is undefined"
                });
                return;
            }
        }
        qrSchema.findOne({
            userID: req.user._id,
            _id: req.body.qrID
        })
            .select({ userID: 0, stats: 0, created_At: 0, updated_date: 0, __v: 0 })
            .exec((err, qrCodeInfo) => {
                if (err) {
                    if (err.name == 'CastError' && err.kind == 'ObjectId' && err.path == '_id') {
                        res.json({
                            "code": config.errCode,
                            "status": "Error",
                            "message": "QR code not found...",
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
                if (!qrCodeInfo) {
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": "QR code not found...",
                    });
                } else {
                    res.json({
                        "code": config.successCode,
                        "status": "success",
                        "data": qrCodeInfo
                    });
                }
            });
    }
};

exports.getQRCodeAnalyticsByID = (req, res) => {
    const receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": "Invalid data enter"
        });
    } else {
        let usercolumns = ["qrID"];
        for (let iter = 0; iter < usercolumns.length; iter++) {
            let columnName = usercolumns[iter];
            if (receivedValues[columnName] === undefined && (columnName === 'qrID')) {
                console.log(chalk.red(columnName, " field is undefined at getQRCodeByID"));
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": columnName + " field is undefined"
                });
                return;
            }
        }
        qrSchema.findOne({
            userID: req.user._id,
            _id: req.body.qrID
        })
            .select({ stats: 1 })
            .exec((err, qrCodeInfo) => {
                if (err) {
                    console.log(err);
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": config.errMessage,
                    });
                    return;
                }
                if (!qrCodeInfo) {
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": config.errMessage,
                    });
                } else {
                    if (qrCodeInfo.stats) {
                        res.json({
                            "code": config.successCode,
                            "status": "success",
                            "data": qrCodeInfo
                        });
                    } else {
                        res.json({
                            "code": config.errCode,
                            "status": "Error",
                            "message": "No analytics found for this QR code",
                        });
                    }
                }
            });
    }
};

exports.deleteQRCodeByID = (req, res) => {
    const receivedValues = req.body;
    if (JSON.stringify(receivedValues) === '{}') {
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": "Invalid data enter"
        });
    } else {
        // let usercolumns = ["qrID"];
        // for (let iter = 0; iter < usercolumns.length; iter++) {
        //     let columnName = usercolumns[iter];
        //     if (receivedValues[columnName] === undefined && (columnName === 'qrID')) {
        //         console.log(chalk.red(columnName, " field is undefined at getQRCodeByID"));
        //         res.json({
        //             "code": config.errCode,
        //             "status": "Error",
        //             "message": columnName + " field is undefined"
        //         });
        //         return;
        //     }
        // }
        qrSchema.deleteMany({
            userID: req.user._id,
            _id: { '$in': req.body.qrID }
        }).exec((err, qrCodeInfo) => {
            if (err) {
                console.log(err);
                res.json({
                    "code": config.errCode,
                    "status": "Error",
                    "message": config.errMessage,
                });
                return;
            }
            if (qrCodeInfo.deletedCount === req.body.qrID.length) {
                res.json({
                    "code": config.successCode,
                    "status": "success",
                    "message": 'QR code deleted sucessfully'
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

// ********************************************************** Dynamic Redirect URL ******************************************** //

const trackQrCode = (qrCodeInfo) => {
    let stats = qrCodeInfo.stats;

    let today = new Date();
    let dd = today.getDate();

    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;

    if (stats) {
        let newData = false;
        let statsArr = stats.map((item) => {
            return new Promise((resolve) => {
                asyncFunction(item, resolve);
            });
        });
        function asyncFunction(item, callback) {
            if (item.date == today) {
                item.counter++;
                newData = false;
                callback();
            } else {
                newData = true;
                callback();
            }
        }
        Promise.all(statsArr).then(() => {
            if (newData) {
                stats.push({
                    date: today,
                    counter: 1
                });
            }
            qrSchema.updateOne({ _id: qrCodeInfo._id }, { '$set': { stats: stats } }, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        });
    } else {
        let fieldToSet = {
            '$set': {
                stats: [{
                    date: today,
                    counter: 1
                }]
            }
        };
        qrSchema.updateOne({ _id: qrCodeInfo._id }, fieldToSet, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
}

exports.redirectURL = async (req, res, next) => {
    try {
        const receivedValues = req.body;
        if (JSON.stringify(receivedValues) === '{}') {
            res.json({
                "code": config.errCode,
                "status": "Error",
                "message": "Invalid data enter"
            });
        } else {
            let usercolumns = ["qrID"];
            for (let iter = 0; iter < usercolumns.length; iter++) {
                let columnName = usercolumns[iter];
                if (receivedValues[columnName] === undefined && (columnName === 'qrID')) {
                    console.log(chalk.red(columnName, " field is undefined at redirectURL"));
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": columnName + " field is undefined"
                    });
                    return;
                }
            }
        }
        const qrCodeInfo = await qrSchema.findOne({
            _id: req.body.qrID
        })
            .select({ qrCodeContent: 1, qrCodeType: 1, qrConfigData: 1, stats: 1, userID: 1, isPrivate: 1 }).exec();
        if (!qrCodeInfo) {
            res.json({
                "code": config.errCode,
                "status": "Error",
                "message": config.errMessage,
            });
        } else {
            let receivedUser = null;
            const token = req.body.token || req.query.token || req.headers.token;
            if (token) {
                receivedUser = await config.jwtTokenVerifier(token);
            }
            if (qrCodeInfo.qrConfigData?.isPrivate) {
                if (receivedUser && receivedUser._id === qrCodeInfo.userID.toString()) {
                    res.json({
                        "code": config.successCode,
                        "status": "OK",
                        qrData: qrCodeInfo.qrCodeContent,
                        qrType: qrCodeInfo.qrCodeType,
                        isPrivate: qrCodeInfo?.qrConfigData?.isPrivate ?? false,
                    });
                } else {
                    return res.json({
                        code: 403,
                        success: false,
                        message: 'Sorry you do not have access to view this QR-code',
                        data: null
                    });
                }
            } else {
                res.json({
                    "code": config.successCode,
                    "status": "OK",
                    qrData: qrCodeInfo.qrCodeContent,
                    qrType: qrCodeInfo.qrCodeType,
                    isPrivate: qrCodeInfo?.qrConfigData?.isPrivate ?? false,
                });
                if (!receivedUser || (receivedUser && receivedUser._id !== qrCodeInfo.userID.toString())) {
                    trackQrCode(qrCodeInfo);
                }
            }
        }
    } catch (error) {
        if (error == 'Failed to authenticate token.') {
            return res.json({
                status: "err",
                code: 403,
                success: false,
                message: 'Failed to authenticate token.',
                data: null
            });
        }
        res.json({
            "code": config.errCode,
            "status": "Error",
            "message": config.errMessage,
        });
    }
};

exports.appSettings = (req, res) => {
    try {
        if (req.body.flag === 0) {
            let resultData = [];
            async.each(req.body.imagesArray, (imgName, callback) => {
                fs.exists(`./images/settings/${imgName}`, (success) => {
                    if (success) {
                        resultData.push({
                            name: imgName,
                            status: success
                        });
                        callback();
                    }
                    else if (!success) {
                        resultData.push({
                            name: imgName,
                            status: success
                        });
                        callback();
                    }
                });
            }, (err) => {
                if (err) {
                    res.json(err);
                    return;
                } else if (resultData.length > 0) {
                    res.json({
                        "code": config.successCode,
                        "data": resultData,
                        message: 'Files found sucessfully'
                    });
                    return;
                }
            })
        } else {
            fs.exists(`./images/settings/${req.body.imageName}.png`, (success) => {
                if (success) {
                    fs.unlink(`./images/settings/${req.body.imageName}.png`, function (err) {
                        if (err) { throw err }
                    });
                }
                let data = req.body.image.split(';');
                let imagePath;
                let base64Data;
                let image;
                if (data[0] == "data:image/png") {
                    imagePath = `./images/settings/${req.body.imageName}.png`;
                    base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
                    image = imagePath.split('./images/settings/')[1];
                }
                if (!imagePath || !base64Data) {
                    res.json({
                        "code": config.errCode,
                        success: false,
                        message: 'Failed to upload image please try again'
                    });
                } else {
                    fs.writeFile(imagePath, base64Data, 'base64', function (err) {
                        if (err) {
                            res.json({
                                "code": config.errCode,
                                success: false,
                                message: 'Failed to upload image please try again',
                                data: err
                            });
                            return;
                        } else {
                            res.json({
                                "code": config.successCode,
                                'status': 'Sucess',
                                "image": image,
                                message: 'File uploaded sucessfully'
                            });
                        }
                    });
                };
            })
        }
    } catch (e) {
        console.log(e);
        res.json({
            "code": config.errCode,
            'status': 'Error',
            "message": config.errMessage
        });
    }
};

exports.printQrCode = async (req, res) => {
    try {
        const receivedValues = req.body;

        if (JSON.stringify(receivedValues) === '{}') {
            return res.json({
                "code": config.errCode,
                "status": "Error",
                "message": "Invalid data enter"
            });
        } else {
            let usercolumns = ["selectedQrs"];
            for (let iter = 0; iter < usercolumns.length; iter++) {
                let columnName = usercolumns[iter];
                if (receivedValues[columnName] === undefined && (columnName === 'selectedQrs')) {
                    console.log(chalk.red(columnName, " field is undefined at getQRCodeByID"));
                    res.json({
                        "code": config.errCode,
                        "status": "Error",
                        "message": columnName + " field is undefined"
                    });
                    return;
                }
            }
            const dataUrlArr = await Promise.all(receivedValues.selectedQrs.map(async (qrCodeId) => {
                const qrCodeInfo = await qrSchema.findOne({
                    _id: qrCodeId
                }).exec();

                if (!qrCodeInfo) {
                    throw ('QR code not found...');
                } else {
                    const options = qrCodeInfo.qrConfigData;
                    const qrCodeContent = config.HOST_URL + '/redirectQR/qrURL/' + qrCodeInfo._id;
                    const qrcode = new QRCode({
                        ...receivedValues.qrConfigData,
                        ...options,
                        text: qrCodeContent,
                        title: qrCodeInfo.qrName,
                        width: receivedValues.qrConfigData?.width ? receivedValues.qrConfigData?.width : options.width,
                        height: receivedValues.qrConfigData?.height ? receivedValues.qrConfigData?.height : options.height,
                        quietZone: receivedValues.qrConfigData?.quietZone ? receivedValues.qrConfigData?.quietZone : options.quietZone,
                        titleHeight: receivedValues.qrConfigData?.titleHeight ? receivedValues.qrConfigData?.titleHeight : options.titleHeight,
                        titleTop: receivedValues.qrConfigData?.titleTop ? receivedValues.qrConfigData?.titleTop : options.titleTop,
                        titleFont: receivedValues.qrConfigData?.titleFont ? receivedValues.qrConfigData?.titleFont : options.titleFont,
                    });
                    const data = await qrcode.toDataURL();
                    return data;
                }
            }));
            result = await config.generatePDF('printQrCode.hbs', { dataUrlArr });

            return res.json({
                "code": config.successCode,
                "status": "success",
                data: dataUrlArr,
                result,
                message: 'Pdf file generated sucessfully'
            });
        }
    } catch (err) {
        if (err.name == 'CastError' && err.kind == 'ObjectId' && err.path == '_id') {
            res.json({
                "code": config.errCode,
                "status": "Error",
                "message": "QR code not found...",
            });
            return;
        } else {
            console.log(err);
            res.json({
                "code": config.errCode,
                "status": "Error",
                "message": typeof err === 'string' ? err : config.errMessage,
            });
            return;
        }
    }
};