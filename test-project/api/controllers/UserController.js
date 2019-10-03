/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
module.exports = {
  
/** to create user  */
  createUser: async  function (req, res) {
    var userName = req.param('username');
    var password = req.param('password');
    if (!userName) {
      res.status(400).json({ error_msg: 'User name is required' });
    }else if(!password){
      res.status(400).json({ error_msg: 'Password is required' });
    } else {
    	 // res.status(200).json({ msg: 'success', data: []});
    	var createdUser = await User.create({userName: req.param('username'),password:password}).fetch();
       	console.log('createdUser',createdUser)
       	res.status(200).json({ msg: 'success', data: createdUser});
    }
  },



  /** to get user data */
  userDetails: function (req, res) {
    var id = req.param('userId');
    if (!id) {
      res.status(400).json({ error_msg: 'User id is required' });
    } else {
      User.find({ id: req.param('userId') }).exec((err, record) => {
      	console.log('record',record)
        if (err) {
          res.status(400).json({ error_msg: err });
        }
        if (record){
          res.status(200).json({ msg: 'success', data: record[0] });
        }
      });
    }
  },

   /** verify user  */
   loginVerify: function(req, res) {
    var userName = req.param('userName');
    var password = req.param('password');
    if (!userName && !password) {
      res.status(400).json({ errorMsg: 'User name and  password  is required' });
    } else if (!userName) {
      res.status(400).json({ errorMsg: 'User name  is required' });
    } else if (!password) {
      res.status(400).json({ errorMsg: 'Password  is required' });
    } else {
      // eslint-disable-next-line handle-callback-err
      User.find({ userName: req.param('userName') }).exec((err, record) => {
        if (record) {
          // eslint-disable-next-line handle-callback-err
          bcrypt.compare(password, record[0].password, (err, result) => {
            if (err) {
              res.status(400).json({ errorMsg: err });
            } else if (!result) {
              res.status(400).json({ errorMsg: 'username or password incorrect' });
            }else{
             
              var token =  jwt.sign({id:record[0].id}, sails.config.globals.jwtSecret, {
                expiresIn   :60 *5
              });
              res.status(200).json({ msg: 'success', data: record[0], token: token });
            }
          });
        }else{
          res.status(400).json({ errorMsg: 'username or password incorrect' });
        }
      });
    }
  },
   /**
 *  To fetch all user
 * @param {*} req
 * @param {*} res
 */
allUser: function (req, res) {
  User.find({ select: ['userName', 'id']}).exec((err, record) => {
    if (err) {
      res.status(400).json({ errorMsg: err });
    }
    if (record) {
      res.status(200).json({ msg: 'success', data: record });
    }
  });
}

};

