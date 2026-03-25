const { handleStatus, sendEmpty, sendJson } = require('../src/server');

module.exports = async function statusHandler(req, res) {
  if (req.method === 'OPTIONS') return sendEmpty(res, 204);
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  return handleStatus(res);
};
