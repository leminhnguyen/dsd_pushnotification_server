const crypto = require("crypto");
const webpush = require("web-push");
const Subscription = require('./models/Subscription');

const vapidKeys = {
  privateKey: "yRIfSrXJbEtRJusQpDr-jnnsAPL5sI59EgX2rXTSkN4",
  publicKey: "BL-eBn1GmJUsvUaBuiretJuPyWuyiJqyazFBHEcZchR6EKGdVQE2axsaBD-oPj_Y_Q7upi5GuChjHiLfDJbQquY"
};

webpush.setVapidDetails("mailto:example@yourdomain.org", vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input) {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
}

function handlePushNotificationSubscription(req, res) {
  console.log("someone calling subcribe request")
  const projectTypes = ['DE_DIEU', 'CAY_TRONG', 'CHAY_RUNG', 'LUOI_DIEN']
  const { subscription, project_type } = req.body;
  const subHash = createHash(JSON.stringify(subscription));
  Subscription.findOne({
    hash: subHash
  }, (err, sub) => {
    if (err) res.status(500).json({
      "code": 500,
      "message": err
    })
    if (sub) return res.status(401).json({ code: 401, message: "Endpoint already exists in DB"})
    else if (!projectTypes.includes(project_type)) return res.status(400).json({ code: 400, message: "Your project type is not valid 'DE_DIEU', 'CAY_TRONG', 'CHAY_RUNG', 'LUOI_DIEN')"})
    else {
      const newSub = new Subscription({
        project_type: project_type,
        hash: subHash,
        endpoint: subscription.endpoint,
        subscription: subscription
      })
      newSub.save().then(result => {
        res.status(201).json({
          code: 201,
          subscriptionId: subHash,
          message: "subcribed push notification successfully"
        })
      }).catch(err => {
          console.log(err);
          res.status(500).send({
              code: 500,
              message: "Can not subcribe push notification",
              error: err
          });
      });
    }
  })
}

function sendPushNotification(req, res) {
  console.log("someone calling push notification request")
  const { project_type, payload } = req.body;
  Subscription.find({ project_type: project_type }, (err, clients) => {
    clients.map( client => {
      webpush.sendNotification(
        client.subscription,
        JSON.stringify({
          title: payload.title,
          text: payload.text,
          image: payload.image,
          url: payload.url
        })
      )
      .catch(err => {
        console.log(err);
      });
      res.status(202).json({
        code: 202,
        message: `Push notifications successfully for ${clients.length} clients with project_type ${project_type}`
      });
    })
  })
}

module.exports = { handlePushNotificationSubscription, sendPushNotification };
