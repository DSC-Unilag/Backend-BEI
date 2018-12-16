const Pool = require('../database/pool')

class Model {
    constructor(table){
        this.table = table;
        if (!table){
            throw Error ('table must be specified!');
        }
    }
    
    //execute sql in Promise
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

    
    
    sqlQuery(sql){
         return new Promise((resolve, reject) =>{
            this.executeSQL(sql)
            .then(result => {
                resolve(result)
            })
            .catch((error) => {
                reject(` error occured - ${error.message}` )
            });
         })
    }

    
    findOne(fields, entryPoint) {
        const sql = `SELECT ${fields.join()} FROM ${this.table}
         WHERE ${Model.createSQLClause(entryPoint, ' AND ')} LIMIT 1`;

        return this.sqlQuery(sql);
    }

    insert(entryPoint) {
        const sql = `INSERT INTO ${this.table} (${Object.keys(entryPoint).join(',')})
         VALUES(${Object.values(entryPoint)
        .map(x => `'${Model.filterOut(x)}'`).join(',')})`;
        /**
         * print out inserted fields
         */
        var fields = Object.keys(entryPoint);
        //push the 'id' generated so we can resolve it along with the result
        fields.push('id')
         return new Promise((resolve, reject)=>{
            this.sqlQuery(sql)
            .then(() => {
                this.findOne(fields ,entryPoint)
                .then((result) => {
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
        return (this.sqlQuery(sql));
    }

    delete(entryPoint){
        var sql = `DELETE FROM ${this.table}`;
        if (Object.keys(entryPoint).length){
            sql += ` WHERE ${Model.createSQLClause(entryPoint,' AND ')}`;
        }
        return this.sqlQuery(sql)
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



    
    static filterOut(words) {
        return String(words).split('\'').join('`');
    }

    static createSQLClause(object, delimiter) {
        return Object.keys(object)
        .map(key => `${key}='${Model.filterOut(object[key])}'`)
        .join(delimiter);
    }
   
}



module.exports = Model;
//UPDATE TABLE SET Name='Joseph', Terms = 8 WHERE Name='Buhari'
