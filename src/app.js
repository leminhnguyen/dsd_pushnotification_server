const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const subscriptionHandler = require('./services/subscriptionHandler');
const mongoose = require('mongoose');

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');
const verifyToken = require('./utils/verifyToken');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// connect to MongoDB
const url = process.env.MONGO_URI || "mongodb+srv://nguyenlm:YPCZUmLxE3sgPqh@cluster0.dwryo.mongodb.net/dsd_20201?retryWrites=true&w=majority";
console.log(url)
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
app.post("/get_notifications", subscriptionHandler.getNotifications)

module.exports = app;