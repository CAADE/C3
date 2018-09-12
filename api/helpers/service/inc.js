module.exports = {


  friendlyName: 'increment',


  description: 'Inc service.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    console.log("Service Inc");
    // All done.
    return exits.success();

  }


};

