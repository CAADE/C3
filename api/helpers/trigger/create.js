module.exports = {


  friendlyName: 'Create trigger',

  description: 'Create trigger',

  inputs: {
    name: {
      description: 'Name of the trigger',
      type: 'string',
      required: false
    },
    events: {
      description: 'Name of the Events to monitor',
      type: 'string',
      required: false
    },
    condition: {
      description: 'Condition to meet (events > 100',
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

    let events;

    if (inputs.events) {
      events = await Events.findOrCreate({name: inputs.events}, {name: inputs.events});
    }
    let trigger = await Trigger.create({
      name: inputs.name,
      events: events.id,
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

