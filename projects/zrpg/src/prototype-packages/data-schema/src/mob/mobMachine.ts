import { createMachine, interpret, assign, send } from 'xstate';

import { createMobDialogMachine } from './mobDialogMachine';

const createMobMachine = (config: any) => {
  return createMachine({
    id: 'mob',
    initial: 'idle',
    context: config.context,
    states: {
      idle: {
        on: {
          USER_INTERACT: [
            {
              target: 'dialoging',
              cond: 'isDialog'
            }
          ]
        }
      },

      dialoging: {
        invoke: {
          id: 'mob-dialog',
          src: (ctx: any) => createMobDialogMachine({
            context: {
              currentAction: ctx.behavior.interaction,
            },
            onSensor: config.onSensor,
          }),
          onDone: 'idle',
        },

        on: {
          CONTINUE: {
            actions: ['deleteAction', 'continueDialog'],
          },
          SELECT: {
            actions: ['deleteAction', 'selectAnswer']
          },
        }
      }
    },

    on: {
      DELEGATE_ACTION: {
        actions: 'delegateAction'
      }
    }
  }, {
    actions: {
      continueDialog: send('CONTINUE', { to: 'mob-dialog' }),
      selectAnswer: send((context: any, event: any) => event, { to: 'mob-dialog' }),
      //continueDialog: forwardTo('mob-dialog'),
      //selectAnswer: forwardTo('mob-dialog'),
      delegateAction: assign<any>((ctx, event: any) => {
        return {
          currentAction: event.payload.currentAction,
        };
      }),
      deleteAction: assign({
        currentAction: undefined,
      }),
    },

    guards: {
      isDialog: (ctx: any) => {
        return ctx.behavior.interaction?.type === 'dialog';
      }
    }
  });
}

const context_ = {
  behavior: {
    interaction: {
      type: 'dialog',
      steps: [
        {
          type: 'text',
          text: 'lorem ipsum',
        },
        {
          type: 'select',
          label: 'What do you want to do?',
          options: [
            {
              text: 'kill',
              actions: [
                {
                  type: 'dialog',
                  steps: [
                    {
                      type: 'text',
                      text: 'Sounds interesting'
                    }
                  ]
                }
              ],
            },
            {
              text: 'Do something interesting',
              actions: [
                {
                  type: 'dialog',
                  sensor: {
                    type: 'quest',
                    id: 5,
                    status: 'completed',
                  },
                  steps: [
                    {
                      type: 'text',
                      text: 'Just enjoy your free time, there is plenty to do.'
                    },
                    {
                      type: 'text',
                      text: 'Step 2!'
                    }
                  ]
                },
                {
                  type: 'text',
                  text: 'Second action!!'
                }
              ],
            },
          ]
        },
      ]
    }
  }
};
context_

const context = {
  behavior: {
    interaction: {
      type: 'dialog',
      steps: [
        {
          type: 'dialog',
          steps: [
            {
              type: 'text',
              text: '1-1'
            },
            {
              type: 'text',
              text: '1-2'
            }
          ]
        },
        {
          type: 'dialog',
          steps: [
            {
              type: 'text',
              text: '2-1'
            },
            {
              type: 'dialog',
              steps: [
                {
                  type: 'text',
                  text: '2-2-1'
                },
                {
                  type: 'dialog',
                  steps: [
                    {
                      type: 'text',
                      text: '2-2-2-1'
                    },
                    {
                      type: 'text',
                      text: '2-2-2-2'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
};

const onSensor = (sensor: any) => {
  //console.log('onSensor', sensor)

  if (sensor.type === 'quest' && sensor.id === 5 && sensor.status === 'completed') {
    //throw new Error('Sensor false');
  }
}

const logDialog = (node: any) => {
  if (!node) {
    return;
  }

  if (node.type === 'text') {
    console.log('text:', node.text);
  } else if (node.type === 'select') {
    console.log('select:', node.label);
    console.log('options:', node.options.map((opt: any) => opt.text).join(', '));
  }
}
logDialog

const wait = (timeout: number) => new Promise(r => setTimeout(r, timeout));

const divider = '-'.repeat(25);
/*
(async () => {
  console.group(divider);
  console.time('machine');

  const service = interpret(createMobMachine({ context, onSensor })).onTransition(state => {
    if (!state.changed) {
      return;
    }

    const { currentAction } = service.state.context as any;
    logDialog(currentAction);
  });

  service.start();

  // the user starts to interact with the NPC
  service.send('USER_INTERACT');
  await wait(0);
  // when the user presses enter after the text has been fully printed
  service.send('CONTINUE');
  //await wait(50);
  // when the user presses enter after the text has been fully printed
  service.send('CONTINUE');
  //await wait(50);
  // when the user selects one of the options
  // @ts-ignore
  //service.send({ type: 'SELECT', payload: { answer: 'kill' } });
  // @ts-ignore
  service.send({ type: 'SELECT', payload: { answer: 'Do something interesting' } });
  await wait(0);
  // automatically send a continue event after a select
  service.send('CONTINUE');
  //await wait(50);
  // when the user presses enter after the text has been fully printed
  // since the dialog is over, the will stop the interaction
  service.send('CONTINUE');
  //await wait(50);
  // when the user presses enter after the text has been fully printed
  // since the dialog is over, the will stop the interaction
  service.send('CONTINUE');
  //await wait(50);
  // when the user presses enter after the text has been fully printed
  // since the dialog is over, the will stop the interaction
  service.send('CONTINUE');


  await wait(0);
  console.groupEnd();
  console.log(divider);
  console.timeEnd('machine');
})()*/

(async () => {
  console.group(divider);
  console.time('machine');

  const service = interpret(createMobMachine({ context, onSensor })).onTransition(state => {
    if (!state.changed) {
      return;
    }

    const { currentAction } = service.state.context as any;
    logDialog(currentAction);
  });

  service.start();

  // the user starts to interact with the NPC
  service.send('USER_INTERACT');
  await wait(0);

  for (let index = 100; index; index--) {
    service.send('CONTINUE');
    await wait(0);
  }

  await wait(0);
  console.groupEnd();
  console.log(divider);
  console.timeEnd('machine');
})()
