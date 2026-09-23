const joi = require("joi");
const ArticleModel = require("../models/article.model");

const postArticle = async (req, res, next) => {
    const articleSchema = joi.object({
        title: joi.string().min(5).required(),
        content: joi.string().min(20).required(),
        author: joi.string().optional().default("Guest"),
    });

    const { error, value } = articleSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Please provide a valid article title and content",
            error: error.details[0].message,
        });
    }

    try {
        const newArticle = new ArticleModel(value);
        await newArticle.save();
        return res.status(201).json({ message: "Article created successfully", data: newArticle });
    } catch (error) {
        next(error);
    }
};

const getAllArticle = async (req, res, next) => {
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    try {
        const articles = await ArticleModel.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        return res.status(200).json({
            message: "Articles fetched successfully",
            page,
            limit,
            data: articles,
        });
    } catch (error) {
        next(error);
    }
};

const getArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: `Article with id ${req.params.id} not found` });
        }
        return res.status(200).json({ message: "Article fetched successfully", data: article });
    } catch (error) {
        next(error);
    }
};

const updateArticleById = async (req, res, next) => {
    const updateSchema = joi.object({
        title: joi.string().min(5),
        content: joi.string().min(20),
        author: joi.string(),
    }).min(1);

    const { error, value } = updateSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Please provide valid article fields",
            error: error.details[0].message,
        });
    }

    try {
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true, runValidators: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ message: `Article with id ${req.params.id} not found` });
        }

        return res.status(200).json({ message: "Article updated successfully", data: updatedArticle });
    } catch (error) {
        next(error);
    }
};

const deleteArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({ message: `Article with id ${req.params.id} not found` });
        }

        return res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const searchArticles = async (req, res, next) => {
    const { q } = req.query;

    if (!q || !q.trim()) {
        return res.status(400).json({ message: "Please provide a search keyword using ?q=" });
    }

    try {
        const articles = await ArticleModel.find(
            { $text: { $search: q } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });

        return res.status(200).json({
            message: "Search results fetched successfully",
            count: articles.length,
            data: articles,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById,
    searchArticles,
};