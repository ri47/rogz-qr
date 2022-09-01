const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const fs = require('fs');
path = require('path');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config(); // loads CONFIG variables from the .env top-level file

const app = express();
const config = require('./config');
const { DB_URL } = process.env;
const port = process.env.PORT

mongoose.connect(DB_URL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function (err, data) {
    if (err) {
        console.log();
        console.log(config.chalk.red('Server failed to connect with database...'));
        console.log(err);
        return;
    } else if (data) {
        console.log();
        console.log(config.chalk.yellow('Database'), config.chalk.green('connected successfully...'));
        startserver();
        return;
    }
});

function startserver() {
    app.use(express.static(path.join(__dirname, '/qr-generator'))); // sets static file directory path
    app.use(express.static(__dirname + '/images'));
    app.use(compression()); // uses compression
    app.use(helmet());
    app.use(express.json({
        limit: '50mb'
    }));
    app.use(express.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000
    }));

    const enableCORS = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, token, Content-Length, X-Requested-With, *');
        if ('OPTIONS' === req.method) {
            res.sendStatus(200);
        } else {
            next();
        }
    };
    app.use(enableCORS);

    const models_path = __dirname + '/model';
    fs.readdirSync(models_path).forEach(function (file) {
        if (~file.indexOf('.js')) require(models_path + '/' + file);
    });

    // Routes
    app.use('/api', require('./routes'));

    app.use(function(req, res, next) {
        res.setHeader("Content-Security-Policy", "default-src https:; script-src https: 'unsafe-inline'; style-src https: 'unsafe-inline'");
        return next();
    });

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '/qr-generator/index.html'));
    });

    process.on('uncaughtException', function (err) {
        console.log('Caught exception: ' + err);
        console.log(err.stack);
    });

    if (process.env.NODE_ENV === 'production') {
        // serve the app on PORT variable
        app.listen(config.NODE_PORT, function (err) {
            if (err) {
                console.log();
                console.log(config.chalk.red('App is listening error '), err);
            } else {
                console.log();
                console.log(config.chalk.green(`Server listening on the port::${config.NODE_PORT}`));
            }
        });
    } else {
        // serve the app on PORT variable
        app.listen(port, function (err) {
            if (err) {
                console.log();
                console.log(config.chalk.red('App is listening error '), err);
            } else {
                console.log();
                console.log(config.chalk.green(`Server listening on the port::${port}`));
            }
        });
    }
}
