/**
 * Userdetails.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'userdetails',
  attributes: {
    id: {
      type: 'number',
      autoIncrement: true,
    },
    userId: {
      model: 'user',
    },
    address: {
      type: 'string',
      allowNull: true
    },
    city: {
      type: 'string',
      allowNull: true
    },
    countryId: {
      type: 'number',
      allowNull: true
    },
    isDelete:{
      type:'number',
      defaultsTo:0
    }

  },

};

