const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, maxLength: 100, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, maxLength: 500, required: true },
  },
  {
    timestamps: true,
  }
);

PostSchema.virtual('postDate').get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_FULL
  );
});

module.exports = mongoose.model('Post', PostSchema);
