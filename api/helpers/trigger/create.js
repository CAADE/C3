module.exports = {


  friendlyName: 'Create trigger',

  description: 'Create trigger',

  inputs: {
    name: {
      description: 'Name of the trigger',
      type: 'string',
      required: false
    },
    event: {
      description: 'Name of the Events to monitor',
      type: 'string',
      required: false
    },
    condition: {
      description: 'Condition to meet (events > 100)',
      type: 'string',
      required: false
    },
    action: {
      description: 'Action to take sails.helpers.incService(\'ingress\', 100);',
      type: 'string',
      required: false
    },
    policy: {
      description: 'Policy to attach the trigger',
      type: 'string',
      required: false
    }

  },

  exits: {},


  fn: async function (inputs, exits) {

    let event;

    if (inputs.event) {
      event = await Events.findOrCreate({name: inputs.event}, {name: inputs.event});
    }
    let trigger = await Trigger.create({
      name: inputs.name,
      event: event.id,
      condition: inputs.condition,
      action: inputs.action,
      policy: inputs.policy,
      fired: false,
      state: 'enabled'
    });
    sails.sockets.broadcast('c3', 'trigger', trigger);
    return exits.success(trigger);

  }


};

