const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Comments schema that has reference to Post and user schemas
 */
const notificationSchema = Schema({
  subscription: {
    type: Schema.Types.ObjectId,
    required: true
  },
  payload: {
    type: Schema.Types.Mixed,
    required: true
  },
  created: {
    type: Schema.Types.Date,
    default: Date.now(),
  },
});

module.exports = Notification = mongoose.model("notifications", notificationSchema);
