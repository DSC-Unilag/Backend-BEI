const mysql = require('mysql');
const {dbOptions} = require('../config');

const Pool = mysql.createPool(dbOptions);

module.exports = Pool;