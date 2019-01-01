const mysql = require('mysql');
const {dbOptions} = require('../helpers/config');

const Pool = mysql.createPool(dbOptions);

module.exports = Pool;