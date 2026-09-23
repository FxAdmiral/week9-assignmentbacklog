const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    content: {
        type: String,
        required: true,
        minlength: 20
    },
    author: {
        type: String,
        default: "Guest"
    },

},
{ timestamps: true }
);

articleSchema.index({ title: "text", content: "text" });

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;