const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
  res.json({success:'ok',msg:'admin setup'})
})
// api for user registration

module.exports = router;