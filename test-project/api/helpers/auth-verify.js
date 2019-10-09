

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

    if (req.session.authenticated) {
        return exits.success();
    }
    return res.redirect('/login');
  }
};
