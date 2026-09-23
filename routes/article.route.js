const express = require("express");
const {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById,
    searchArticles,
} = require("../controllers/article.controller");
const router = express.Router();

router.post("/articles", postArticle);

router.get("/articles/search", searchArticles);   // must come BEFORE /articles/:id

router.get("/articles", getAllArticle);

router.get("/articles/:id", getArticleById);

router.put("/articles/:id", updateArticleById);

router.delete("/articles/:id", deleteArticleById);

module.exports = router;