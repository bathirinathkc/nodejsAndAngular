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
    	var createdUser = await User.createEach([{userName: req.param('username'),password:password},{userName:'test',password:'test'}]).fetch();
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
        console.log('err',err)
        console.log('record',record)
        if (record && record.length>0) {
          // eslint-disable-next-line handle-callback-err
          bcrypt.compare(password, record[0].password, (err, result) => {
            if (err) {
              res.status(400).json({ errorMsg: err });
            } else if (!result) {
              res.status(400).json({ errorMsg: 'username or password incorrect' });
            }else{
             
              var token =  jwt.sign({id:record[0].id}, sails.config.globals.jwtSecret, {
                expiresIn   :60 *60
              });
              res.status(200).json({ msg: 'success',status:true, data: record[0], token: token });
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
  User.find({ where:{isDelete:0}}).populate('userDetails',{where:{isDelete:0},sort: 'id DESC'}).sort('id DESC').exec((err, record) => {
    if (err) {
      res.status(400).json({ errorMsg: err });
    }
    if (record) {
      res.status(200).json({ msg: 'success', data: record });
    }
  });
},
 /**
   * delete user record
   * @param {*} req
   * @param {*} res
   */
  deleteUser: function (req, res) {
    var userId = req.param('userId');
    if (!userId){
      res.status(400).json({ errorMsg: 'UserId is required' });
    }else{
      User.find({ id: userId}).exec((err, record) => {
        if (err) {
          res.status(400).json({ errorMsg: err });
        }
        if (record) {
          User.update({ id: userId },{ isDelete: 1}).exec((err, record) => {
            if (err) {
              res.status(400).json({ errorMsg: err });
            }else{
              res.status(200).json({ msg: 'Deleted successfully', });
            }
          });
        }
      });
    }
  },
  login:function(req,res){
    var userName = req.param('userName'); 
    var password = req.param('password');
    if (!userName && !password) {
      return res.view('pages/login', { data: 'err' });
    } else if (!userName) {
      return res.view('pages/login', { data: 'err'  });
    } else if (!password) {
      return res.view('pages/login', { data: 'err' });
    } else {
      // eslint-disable-next-line handle-callback-err
      User.find({ userName: req.param('userName') }).exec((err, record) => {
        // console.log('record', record);
        if (record && record[0]) {
          // eslint-disable-next-line handle-callback-err
          bcrypt.compare(password, record[0].password, (err, result) => {
            if (err) {
              return res.redirect('/login');
            } else if (!result) {
              return res.redirect('/login');
            } else {
              req.session.authenticated = true;
              req.session.User = record[0];
              console.log(req.session.authenticated);
              return res.redirect('/listuser');
            }
          });
        } else {
          return res.redirect('/login');
        }
      });
    }
  },
  listUser: function (req, res) {
    User.find({ where: { isDelete: 0 }, select: ['userName', 'id'] }).populate('userDetails').sort('id DESC').exec((err, record) => {
      if (err) {
        return res.view('pages/list', { data: [] });
      }
      if (record) {
        return res.view('pages/list', { data: record });
      }
    });
  },

  userRecord: function (req, res) {
    var userId = req.param('userId');
    User.find({ id: userId }).exec((err, record) => {
      if (err) {
        return res.redirect('/listuser');
      }
      if (record) {
        return res.view('pages/updateUser', { data: record[0] });
      }
    });
  },

  updateUser: function (req, res) {
    var userId = req.param('userId');
    var userName = req.param('userName');
    if (!userName){
      // res.serverError('Name is required', 'new');
      // return res.redirect('/userRecord/'.userId);
      return res.serverError('Name is required', 'new');
    }else{
      User.find({ id: userId }).exec((err, record) => {
        if (err) {
          return res.serverError(err, 'new');
        }
        if (record) {
          User.update({ id: userId }, { userName: userName}).exec((err, record) => {
            if (err) {
              return res.serverError(err, 'new');
            } else {
              return res.redirect('/listuser');
            }
          });
        }
      });
    }

  },

  deleteRecord: function (req, res) {
    var userId = req.param('userId');
    User.find({ id: userId }).exec((err, record) => {
      if (err) {
        return res.redirect('/listuser');
      }
      if (record) {
        User.destroy({ id: userId }).exec((err, record) => {
          if (err) {
            return res.redirect('/listuser');
          } else {
            return res.redirect('/listuser');
          }
        });
      }
    });

  },

};

