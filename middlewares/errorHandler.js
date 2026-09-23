const errorhandler = (err, req, res, next) => {
    console.error(err.message);
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
}
module.exports = errorhandler;