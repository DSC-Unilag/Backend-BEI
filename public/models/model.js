'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pool = require('../database/pool');

//model for database interactions

var Model = function () {
   function Model(table) {
      _classCallCheck(this, Model);

      this.table = table;
      if (!table) {
         throw Error('table must be specified!');
      }
   }

   _createClass(Model, [{
      key: 'executeSQL',


      //execute sql using Promises
      value: function executeSQL(sql) {
         return new Promise(function (resolve, reject) {
            Pool.getConnection(function (error, conn) {
               if (error) {
                  console.log(error.message);
               }
               conn.query(sql, function (error, results) {
                  if (error) {
                     throw Error(error.message);
                     reject(error.message);
                  }
                  resolve(results);
               });
            });
         });
      }
   }, {
      key: 'executeQuery',
      value: function executeQuery(query) {
         var _this = this;

         return new Promise(function (resolve, reject) {
            _this.executeSQL(query).then(function (result) {
               resolve(result);
            }).catch(function (error) {
               reject(' error occured - ' + error.message);
            });
         });
      }
   }, {
      key: 'findOne',
      value: function findOne(fields, entryPoint) {
         var sql = 'SELECT ' + fields.join() + ' FROM ' + this.table + '\n      WHERE ' + Model.createSQLClause(entryPoint, ' AND ') + ' LIMIT 1';
         return this.executeQuery(sql);
      }
   }, {
      key: 'insert',
      value: function insert(entryPoint) {
         var _this2 = this;

         var sql = 'INSERT INTO ' + this.table + ' (' + Object.keys(entryPoint).join(',') + ')\n      VALUES(' + Object.values(entryPoint).map(function (x) {
            return '\'' + Model.filterBadCharacters(x) + '\'';
         }).join(',') + ')';
         /**
          * print out inserted fields
          */
         var fields = Object.keys(entryPoint);
         //push the 'id' generated so we can resolve it along with the result
         fields.push('id');
         return new Promise(function (resolve, reject) {
            _this2.executeQuery(sql).then(function () {
               _this2.findOne(fields, entryPoint).then(function (result) {
                  resolve(result);
               }).catch(function (error) {
                  return reject(error.message);
               });
            });
         });
      }
   }, {
      key: 'find',
      value: function find(entryPoint) {
         var sql = 'SELECT * FROM ' + this.table;
         if (Object.keys(entryPoint).length) {
            sql += ' WHERE ' + Model.createSQLClause(entryPoint, ' AND ');
         }
         return this.executeQuery(sql);
      }
   }, {
      key: 'delete',
      value: function _delete(entryPoint) {
         var sql = 'DELETE FROM ' + this.table;
         if (Object.keys(entryPoint).length) {
            sql += ' WHERE ' + Model.createSQLClause(entryPoint, ' AND ');
         }
         return this.executeQuery(sql);
      }
   }, {
      key: 'update',
      value: function update(newfields, entryPoint) {
         var _this3 = this;

         var sql = 'UPDATE ' + this.table + ' SET ' + Model.createSQLClause(newfields, ',') + '\n      WHERE ' + Model.createSQLClause(entryPoint, ' AND ');
         /**
          * first update the table using the above query 
          * then find the updated fields using the passed in parameters
          */
         var fields = Object.keys(newfields);
         return new Promise(function (resolve, reject) {
            _this3.executeSQL(sql).then(function () {
               _this3.findOne(fields, newfields).then(function (result) {
                  resolve(result);
               }).catch(function (error) {
                  return reject(error.message);
               });
            });
         });
      }
   }], [{
      key: 'filterBadCharacters',
      value: function filterBadCharacters(words) {
         return String(words).split('\'').join('`');
      }
   }, {
      key: 'createSQLClause',
      value: function createSQLClause(object, delimiter) {
         return Object.keys(object).map(function (key) {
            return key + '=\'' + Model.filterBadCharacters(object[key]) + '\'';
         }).join(delimiter);
      }
   }]);

   return Model;
}();

module.exports = Model;