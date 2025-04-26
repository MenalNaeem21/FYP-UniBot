// rate-limit.js
let requestLog = [];
const MAX_REQUESTS_PER_HOUR = 100;

function checkRateLimit() {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  // Remove old requests
  requestLog = requestLog.filter(entry => entry > oneHourAgo);

  if (requestLog.length < MAX_REQUESTS_PER_HOUR) {
    requestLog.push(now);
    return true;
  }

  return false;
}

module.exports = { checkRateLimit };
