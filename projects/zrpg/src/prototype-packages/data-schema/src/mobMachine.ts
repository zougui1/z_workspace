import { createMachine, assign, interpret } from 'xstate';

interface MobContext {
  currentAction: any;
  currentStep: number;
  behavior: any;
}

type UserInteractEvent = {
  type: 'USER_INTERACT';
}

type ContinueEvent = {
  type: 'CONTINUE';
}

type MobEvent = UserInteractEvent | ContinueEvent;

const mobMachine = createMachine<MobContext, MobEvent>({
  id: 'mob',
  initial: 'idle',
  context: {
    currentAction: undefined,
    currentStep: 0,
    behavior: {},
  },
  states: {
    idle: {
      on: {
        USER_INTERACT: [
          {
            actions: assign(ctx => ({
              currentAction: ctx.behavior.interaction,
            })),
            target: 'dialoging',
            cond: ctx => {
              if (ctx.behavior.interaction?.type === 'dialog') {
                return true;
              }

              return false;
            }
          },
        ],
      }
    },

    dialoging: {
      always: {
        actions: assign(ctx => ({
          currentAction: ctx.currentAction.steps,
          currentSteps: 0,
        })),
        target: 'stepping',
      },
    },

    stepping: {
      entry: ctx => {
        console.log('dialog:', ctx.currentAction[ctx.currentStep].text);
      },

      on: {
        CONTINUE: [
          {
            actions: assign(ctx => ({
              currentStep: ctx.currentStep + 1,
            })),
            target: 'stepping',
            cond: ctx => {
              if (ctx.currentAction[ctx.currentStep + 1]) {
                return true;
              }

              return false;
            }
          },
          {
            target: 'idle',
          }
        ],
      }
    }
  }
});

const service = interpret(mobMachine.withContext({
  currentAction: undefined,
  currentStep: 0,
  behavior: {
    interaction: {
      type: 'dialog',
      steps: [
        {
          type: 'text',
          text: 'lorem ipsum',
        },
        {
          type: 'text',
          text: 'second text :o',
        },
      ]
    }
  }
})).onTransition(state => {
  console.log('transition to', state.value)
});
service.start();

service.send('USER_INTERACT');
service.send('CONTINUE');
service.send('CONTINUE');
