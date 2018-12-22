const Pool = require('../database/pool')

//model for database interactions
class Model {
	
    constructor(table){
      this.table = table;
      if (!table){
         throw Error ('table must be specified!');
      }
   }

   static filterBadCharacters(words) {
      return String(words).split('\'').join('`');
   }

    
   static createSQLClause(object, delimiter) {
      return Object.keys(object)
      .map(key => `${key}='${Model.filterBadCharacters(object[key])}'`)
      .join(delimiter);
   }
    
    //execute sql using Promises
   executeSQL(sql){
      return new Promise((resolve, reject) =>{
         Pool.getConnection((error, conn) => {
               if(error){
                  console.log(error.message)
               }
               conn.query(sql, function(error, results){
                   if(error){
                     throw Error (error.message)
                     reject(error.message);
                   }
                  resolve(results);
               })
         })
      })
   }

    
   executeQuery(query){
      return new Promise((resolve, reject) =>{
         this.executeSQL(query).then(result => {
            resolve(result)
         }).catch((error) => {
               reject(` error occured - ${error.message}` )
         });
      })
   }

    
   findOne(fields, entryPoint) {
      const sql = `SELECT ${fields.join()} FROM ${this.table}
      WHERE ${Model.createSQLClause(entryPoint, ' AND ')} LIMIT 1`;
      return this.executeQuery(sql);
   }

   insert(entryPoint) {
      const sql = `INSERT INTO ${this.table} (${Object.keys(entryPoint).join(',')})
      VALUES(${Object.values(entryPoint)
      .map(x => `'${Model.filterBadCharacters(x)}'`).join(',')})`;
        /**
         * print out inserted fields
         */
      var fields = Object.keys(entryPoint);
      //push the 'id' generated so we can resolve it along with the result
      fields.push('id')
      return new Promise((resolve, reject)=>{
         this.executeQuery(sql).then(() => {
            this.findOne(fields ,entryPoint).then((result) => {
               resolve(result)
            }).catch(error => reject(error.message))
         })
      })
   }

   find(entryPoint){
      var sql = `SELECT * FROM ${this.table}`;
      if (Object.keys(entryPoint).length){
         sql += ` WHERE ${Model.createSQLClause(entryPoint,' AND ')}`;
      }
      return (this.executeQuery(sql));
   }

   delete(entryPoint){
      var sql = `DELETE FROM ${this.table}`;
      if (Object.keys(entryPoint).length){
         sql += ` WHERE ${Model.createSQLClause(entryPoint,' AND ')}`;
      }
      return this.executeQuery(sql)
   }


   update(newfields, entryPoint){
      var sql = `UPDATE ${this.table} SET ${Model.createSQLClause(newfields,',')}
      WHERE ${Model.createSQLClause(entryPoint,' AND ')}`
        /**
         * first update the table using the above query 
         * then find the updated fields using the passed in parameters
         */
      var fields = Object.keys(newfields);
      return new Promise((resolve, reject)=>{
            this.executeSQL(sql)
            .then(() => {
               this.findOne(fields ,newfields)
               .then((result) => {
                  resolve(result)
            }).catch(error => reject(error.message))
         })
      })
   }
}
module.exports = Model;

