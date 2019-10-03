/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');
module.exports = {
//primaryKey: 'id',
tableName:'users',
  attributes: {
    // id:{
    //     type:'integer',
    //     columnName:'userId',
    //      autoIncrement: true,
    //     primaryKey: true
    // },
    userName:{
        type:'string'
    },
    password:{
      type:'string'
    }
  

  },
  beforeCreate: function (values, cb) {
    bcrypt.hash(values.password, 10, (err, hash) => {
      if (err) { return cb(err); }
      values.password = hash;
      cb();
    });
  },

};

