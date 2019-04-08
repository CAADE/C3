module.exports = {


  friendlyName: 'Handle',


  description: 'Handle events.',


  inputs: {
    events: {
      description: 'events to handle',
      type: 'ref',
      required: true
    },
  },


  exits: {},


  fn: async function (inputs, exits) {

    try {
      let events;
      for (let k in inputs.events) {
        let event = inputs.events[k];

        events = await Events.findOne({id: event.id}).populateAll();
        for (let i = 0; i < events.triggers.length; i++) {
          // Connect the Service Instance to resources.
          let trigger = events.triggers[i];

          let flag = eval(trigger.condition);
          if (flag && !trigger.fired) {
            let actions = trigger.action.split(/;/);
            await Trigger.update({id: trigger.id}, {fired: true});
            trigger = await Trigger.findOne({id: trigger.id}).populateAll();
            sails.sockets.broadcast('c3', 'triggered', {policy: trigger.policy, trigger: trigger});
            for (let j = 0; j < actions.length; j++) {
              try {
                await eval(actions[j]);
              }
              catch (e) {
                console.error('Action Error: ', e);
              }
            }
          }
          else if (!flag && trigger.fired) {
            await Trigger.update({id: trigger.id}, {fired: false});
            trigger = await Trigger.findOne({id: trigger.id}).populateAll();
            sails.sockets.broadcast('c3', 'triggered', {policy: trigger.policy, trigger: trigger});
          }
        }
      }
      // Load the Service again and broadcast change.
      return exits.success(events);
    }
    catch (e) {
      console.error(e);
      return exits.success();
    }
    // All done.
  }
};
/*
function incService(name, amount) {
  console.log('IncService', name, amount);
}
function decService(name, amount) {
  console.log('DecService', name, amount);
}
function killService(name, signal, message) {
  console.log('KillService', name, signal, message);
}
function killApp(name,signal, message) {
  console.log('KillApp', name, signal, message);
}
 */
