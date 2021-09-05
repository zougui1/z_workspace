import { createMachine, assign, send, sendParent } from 'xstate';

/**
 * ! after some depth of recursivity the state machine no longer works
 * ! a depth of 3 nested machines work, after that the nested machines no longer
 * ! receive their parent's events
 *
 * TODO try to preprocess the behavior config object to make a machine
 * TODO with nested states with all their own context instead
 */
export const createMobDialogMachine = (config: any): any => {
  console.count('createMobDialogMachine')
  //console.log(config.context.currentAction)
  return createMachine({
    id: 'mob-dialog',
    initial: 'idle',
    context: {
      ...config.context,
      currentStep: -1,
    },
    states: {
      idle: {
        entry: 'init',
        always: 'checkingSensors',
      },

      checkingSensors: {
        entry: ['goToNextAction'],

        invoke: {
          id: 'checking-sensors',
          src: async ctx => {
            const action = ctx.type === 'actions'
              ? ctx.currentAction[ctx.currentActionIndex]
              : ctx.currentAction[ctx.currentStep] || ctx.currentAction;

            if (Array.isArray(ctx.currentAction)) {
              //console.log(ctx)
            }

            if (!action?.sensor && !action?.sensors) {
              return;
            }

            if (action.sensor) {
              await config.onSensor(action.sensor);
            }

            if (action.sensors) {
              const sensorsPromises = action.sensors.map((sensor: any) => config.onSensor(sensor));
              await Promise.all(sensorsPromises)
            }
          },
          onDone: 'dialoging',
          onError: 'checkingSensors',
        }
      },

      dialoging: {
        initial: 'dispatching',

        states: {
          dispatching: {
            always: [
              {
                actions: 'dispatchSteps',
                target: 'stepping',
                cond: 'hasSteps'
              },
              {
                target: 'stepping',
                cond: 'canStepOver'
              },
              {
                cond: 'canGoToNext',
                target: 'discussing',
              },
              {
                target: '#mob-dialog.complete'
              }
            ]
          },

          stepping: {
            on: {
              CONTINUE: [
                {
                  actions: 'stepOver',
                  target: 'discussing',
                  cond: 'canStepOver'
                },
                {
                  target: '#mob-dialog.complete',
                }
              ]
            }
          },

          discussing: {
            initial: 'dispatching',

            states: {
              dispatching: {
                always: [
                  {
                    target: 'text',
                    cond: 'isText'
                  },
                  {
                    target: 'selecting',
                    cond: 'isSelect'
                  },
                  {
                    target: 'subDialog',
                    cond: 'isDialog'
                  },
                  {
                    target: '#mob-dialog.complete'
                  }
                ]
              },

              subDialog: {
                //entry: 'delegateCurrentAction',

                invoke: {
                  id: 'subDialogService',
                  src: (ctx: any) => createMobDialogMachine({
                    context: {
                      currentAction: (ctx.type === 'actions'
                      ? ctx.currentAction[ctx.currentActionIndex]
                      : ctx.currentAction[ctx.currentStep]) || ctx.currentAction,
                    },
                    onSensor: config.onSensor,
                  }),
                  onDone: '#mob-dialog.checkingSensors',
                  onError: '#mob-dialog.checkingSensors',
                },

                on: {
                  CONTINUE: {
                    actions: 'continueDialog'
                  },
                  SELECT: {
                    actions: 'selectAnswer'
                  },
                }
              },

              text: {
                entry: 'delegateCurrentAction',
                always: '#mob-dialog.dialoging.stepping',
              },

              selecting: {
                entry: 'delegateCurrentAction',

                on: {
                  SELECT: {
                    actions: 'select',
                    target: '#mob-dialog.checkingSensors'
                  }
                }
              },
            }
          },
        }
      },

      complete: {
        type: 'final',
        entry: ['dialogComplete', 'delegateCurrentAction'],
      }
    },

    on: {
      DELEGATE_ACTION: {
        actions: 'delegateAction'
      }
    }
  }, {
    actions: {
      init: assign({
        currentActionIndex: -1,
      }),
      goToNextAction: assign<any>(ctx => {
        //console.count('goToNextAction')
        if (ctx.type === 'actions') {
          return {
            currentActionIndex: ctx.currentActionIndex + 1,
          };
        }
      }),
      resetCurrentStep: assign({ currentStep: -1 }),
      dispatchSteps: assign<any>(ctx => {
        return {
          currentAction: ctx.currentAction.steps,
        };
      }),
      stepOver: assign<any>(ctx => {
        return {
          currentStep: ctx.currentStep + 1,
        }
      }),

      select: assign<any, any>((ctx, event) => {
        return {
          type: 'actions',
          currentAction: ctx.currentAction[ctx.currentStep].options
            .find((action: any) => action.text === event.payload.answer)
            ?.actions
        };
      }),

      dialogComplete: assign({
        currentAction: undefined,
        currentActionIndex: -1,
        currentStep: -1,
      }),
      delegateCurrentAction: sendParent(ctx => {
        /*console.log('delegateCurrentAction', ctx, ctx.type === 'actions'
        ? ctx.currentAction?.[ctx.currentActionIndex]
        : ctx.currentAction?.[ctx.currentStep])*/
        return {
          type: 'DELEGATE_ACTION',
          payload: {
            currentAction: ctx.type === 'actions'
              ? ctx.currentAction?.[ctx.currentActionIndex]
              : ctx.currentAction?.[ctx.currentStep],
          },
        };
      }),

      delegateAction: sendParent((ctx, event) => {
        return event;
      }),

      continueDialog: send('CONTINUE', { to: 'subDialogService' }),
      selectAnswer: send((context: any, event: any) => event, { to: 'subDialogService' }),
    },

    guards: {
      hasSteps: ctx => {
        console.log('hasSteps', ctx.currentAction, Array.isArray(ctx.currentAction?.steps))
        return Array.isArray(ctx.currentAction?.steps);
      },
      canStepOver: ctx => {
        console.log('canStepOver', ctx.currentAction, ctx.currentStep)
        return ctx.type !== 'actions' && !!ctx.currentAction[ctx.currentStep + 1];
      },
      canGoToNext: ctx => {
        return ctx.type === 'actions' && Array.isArray(ctx.currentAction) && ctx.currentAction[ctx.currentActionIndex];
      },
      isText: ctx => {
        const action = ctx.type === 'actions'
          ? ctx.currentAction[ctx.currentActionIndex]
          : ctx.currentAction[ctx.currentStep];
        return action.type === 'text';
      },
      isSelect: ctx => {
        const action = ctx.type === 'actions'
          ? ctx.currentAction[ctx.currentActionIndex]
          : ctx.currentAction[ctx.currentStep];
        return action.type === 'select';
      },
      isDialog: ctx => {
        const action = ctx.type === 'actions'
          ? ctx.currentAction[ctx.currentActionIndex]
          : ctx.currentAction[ctx.currentStep];
        return action.type === 'dialog';
      },
    }
  });
}
