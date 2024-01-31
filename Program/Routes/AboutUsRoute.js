const express = require('express');
const router = express.Router();

router.get('/aboutus', (req, res) => {
    res.render('AboutUs');
  });

module.exports = router;