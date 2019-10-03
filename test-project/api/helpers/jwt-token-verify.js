var jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Verify JWT',
  description: 'Verify a JWT token.',
  inputs: {
    req: {
      type: 'ref',
      friendlyName: 'Request',
      description: 'A reference to the request object (req).',
      required: true
    },
    res: {
      type: 'ref',
      friendlyName: 'Response',
      description: 'A reference to the response object (res).',
      required: false
    }
  },
  exits: {
    invalid:{
      description: 'Invalid token or no authentication present.',
    }
  },
  fn: function (inputs, exits ) {
    var req = inputs.req;
    var res = inputs.res;

    if (req.header('authorization')) {
      console.log('authorization', req.header('authorization'));
      // if one exists, attempt to get the header data
      var token = req.header('authorization').split('Bearer ')[1];
      // if there's nothing after "Bearer", no go
      if (!token) { return     res.status(401).json({ error_msg: 'Invalid Token!' });}
      // if there is something, attempt to parse it as a JWT token
      return jwt.verify(token, sails.config.globals.jwtSecret, async (err, payload) => {
        if (err) { return res.status(401).json({ error_msg: 'Invalid Token!' });}
        // if it got this far, everything checks out, success
        return exits.success();
      });
    }
    return res.status(401).json({ error_msg: 'Invalid token or no authentication present.' });
  }
};
