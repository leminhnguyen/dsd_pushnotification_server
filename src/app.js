const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const subscriptionHandler = require('./subscriptionHandler');
const config = require("config");
const mongoose = require('mongoose');

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(bodyParser.json());
app.use(cors())

// connect to MongoDB
const url = config.get("mongoURI");
mongoose.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(`errors: ${err}`)
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/subscribe", subscriptionHandler.handlePushNotificationSubscription);
app.post("/push_notification", subscriptionHandler.sendPushNotification);

module.exports = app;