require('dotenv').config();
const controller = require('../controllers/gameController');

const payload = {
  name: 'Teste Controller',
  description: 'desc ctrl',
  price: '2.00',
  release_date: '2025-12-15',
  developer_id: 1,
  categories: [1,1,9999]
};

const res = {
  status(code) { this._code = code; return this; },
  json(obj) { console.log('RES.JSON status=', this._code || 200, obj); },
  send() { console.log('RES.SEND status=', this._code || 200); }
};

(async () => {
  try {
    await controller.createGame({ body: payload }, res);
  } catch (err) {
    console.error('CALL ERROR:', err);
  }
})();
