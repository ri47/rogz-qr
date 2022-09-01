const express = require('express');
const router = express.Router();
const config = require('../config');
const qrCode = require('../controllers/qrCode');
const adminQrCode = require('../controllers/adminQrCode')

// Authentication API
router.post('/userLogin', qrCode.login);
router.post('/userRegister', qrCode.register);
router.post('/forgotPassword', qrCode.forgotPassword);
router.post('/resetPassword', qrCode.resetPassword);
router.post('/changePassword', qrCode.changePassword);

// qrCode API    
router.post('/createEditDynamicURL', config.verifyUserToken, qrCode.createEditDynamicURL);
router.post('/getUserQRCodes', config.verifyUserToken, qrCode.getUserQRCodes);
router.post('/getQRCodeByID', config.verifyUserToken, qrCode.getQRCodeByID);
router.post('/getQRCodeAnalyticsByID', config.verifyUserToken, qrCode.getQRCodeAnalyticsByID);
router.post('/deleteQRCodeByID', config.verifyUserToken, qrCode.deleteQRCodeByID);
router.post('/printQrCode', qrCode.printQrCode);
router.post('/redirectURL', qrCode.redirectURL);
router.post('/appSettings', qrCode.appSettings);

// Admin Authentication API
router.post('/adminLogin', adminQrCode.adminLogin);

// Admin qrCode API 
router.post('/getUsers', config.verifyUserToken, adminQrCode.getUsers);
router.post('/deleteUserByID', config.verifyUserToken, adminQrCode.deleteUserByID);
router.post('/getUserByID', config.verifyUserToken, adminQrCode.getUserByID);
router.post('/postEditUser', config.verifyUserToken, adminQrCode.postEditUser);
router.post('/changeVerifiedStatus', config.verifyUserToken, adminQrCode.changeVerifiedStatus);

module.exports = router;