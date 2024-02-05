var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { readFile, writeFile } = require('fs').promises;
function readCookies() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jsonString = yield readFile('./data/cookies.json', 'utf8');
            const arr = JSON.parse(jsonString);
            if (Array.isArray(arr)) {
                return arr;
            }
            else {
                throw new Error('File does not contain a valid JSON array.');
            }
        }
        catch (error) {
            console.error('Error:', error);
            return null;
        }
    });
}
module.exports = {
    readCookies
};
