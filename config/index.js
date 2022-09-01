const moment = require('moment');
const _ = require('lodash');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const Pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { Parser } = require('json2csv');
const json2xls = require('json2xls');
const nodemailer = require('nodemailer');

exports.chalk = chalk;
exports.NODE_PORT = 8787;
exports.DB_URL = 'mongodb://localhost:27017/QR-DB';
exports.secret = 'QR@123$';
exports.successCode = 200;
exports.errCode = 403;
exports.errMessage = 'Something went wrong!';

exports.HOST_URL = 'https://www.qr-codegen.com';

exports.utcDefault = function utcDefault() {
    let date = new Date()
    return date = moment.utc(date).format();
};

exports.jwtTokenVerifier = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, this.secret, function (err, decoded) {
            if (err) {
                reject('Failed to authenticate token.');
            } else {
                resolve(decoded);
            }
        });
    });
};

exports.verifyUserToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.token;
    if (token) {
        try {
            const decoded = await this.jwtTokenVerifier(token);
            if (decoded) {
                req.user = decoded;
            }
            next();
        } catch (error) {
            return res.json({
                status: "err",
                code: 403,
                success: false,
                message: 'Failed to authenticate token.',
                data: null
            });
        }
    } else {
        return res.status(403).send({
            status: "err",
            success: false,
            message: 'No token provided.',
            data: null
        });
    }
}

Handlebars.registerHelper("inc", (val) => {
    return Number(val) + 1;
});

let readHTMLFile = (fullpath, callback) => {
    fs.readFile(fullpath, { 'encoding': 'utf-8' }, (err, html) => {
        if (err) callback(err);
        else callback(null, html);
    });
};

let getPdf = (htmlData) => {
    return new Promise((resolve, reject) => {
        try {
            let options = {
                type: 'pdf', format: 'A4',
            };
            Pdf.create(htmlData, options).toBuffer((err, buffer) => {
                if (err) return reject(err);
                let base64data = Buffer.from(buffer, 'binary').toString('base64');
                return resolve(base64data);
            });
        } catch (error) {
            return reject(error);
        }
    });
}

exports.generatePDF = async (templateName, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let templatePath = path.join(__dirname, `../templates/${templateName}`);
            readHTMLFile(templatePath, async (err, html) => {
                if (err) {
                    return reject(err);
                }
                let htmlData = Handlebars.compile(html)(Object.assign({}, data));
                let pdfData = await getPdf(htmlData);
                return resolve(pdfData);
            });
        } catch (error) {
            return reject(error);
        }
    });
}

exports.generateCSV = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse(data);
            let result = Buffer.from(csvData).toString('base64');
            resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
};

exports.generateXLSX = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // json2xls returns xlsx file data in binary format
            const xlsxBinaryData = json2xls(data);
            // https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/#encodingbinarydatatobase64strings
            // read Reza Rahmati's comment
            const xlsxDataBuffer = Buffer.from(xlsxBinaryData, 'binary');
            let result = xlsxDataBuffer.toString('base64');
            resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
};

// create transporter object with smtp server details
exports.transporter = nodemailer.createTransport({
    host: 'mail.php.fmv.cc',
    port: 587,
    tls: {
        rejectUnauthorized: false
    },
    pool: true,
    auth: {
        user: 'ivanshu@php.fmv.cc',
        pass: 'ivanshuelsner'
    }
});