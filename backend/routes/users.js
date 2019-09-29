const express = require('express');
const router = express.Router();
const { auth, getUser } = require('../middleware/auth');
const _ = require('lodash');

router.use('/', auth);

router.get('/:id/teams', async (req, res) => {
  const user = await getUser(res, req.params.id).populate({ path: 'teams', match: { status: 'active' } });
  res.json(user.teams.map(x => _.pick(x, ['players', 'name', '_id', 'leagues'])));
});

module.exports = router;