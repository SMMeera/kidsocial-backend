const PROFANITY = ['badword1','idiot','stupid','badword2'];

function containsProfanity(text) {
  if (!text) return false;
  const s = text.toLowerCase();
  return PROFANITY.some(w => s.includes(w));
}

function sanitizeText(text) {
  if (!text) return text;
  let out = text;
  PROFANITY.forEach(w => {
    const re = new RegExp(w, 'gi');
    out = out.replace(re, '****');
  });
  return out;
}

module.exports = { containsProfanity, sanitizeText };
