const { readFile, writeFile } = require('fs').promises;

async function readCookies() {
  try {
    const jsonString = await readFile('./data/cookies.json', 'utf8');
    const arr = JSON.parse(jsonString);

    if (Array.isArray(arr)) {
      return arr;
    } else {
      throw new Error('File does not contain a valid JSON array.');
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

module.exports = {
  readCookies
};