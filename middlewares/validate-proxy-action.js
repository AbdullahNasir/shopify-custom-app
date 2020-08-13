module.exports = (req, res, next) => {
  const { action } = req.query;
  if (!action) return res.status(400).send('Missing action');
  next();
};
