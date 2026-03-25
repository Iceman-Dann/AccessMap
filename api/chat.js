const { handleChat, sendEmpty, sendJson } = require('../src/server');

module.exports = async function chatHandler(req, res) {
  if (req.method === 'OPTIONS') return sendEmpty(res, 204);
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  return handleChat(req, res);
};
