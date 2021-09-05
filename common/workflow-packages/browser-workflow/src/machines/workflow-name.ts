import { assign, createMachine, interpret } from 'xstate';

export const workflowName = 'browser';

const browsePage = {
  id: 'page-browser',
  initial: 'browsing',

  states: {
    browsing: {
      invoke: {
        id: 'browse',
        src: async (ctx: any) => console.log('browsing', ctx.source, 'page', ctx.page),
        onDone: 'posting',
        onError: 'failure'
      }
    },
    posting: {
      invoke: {
        id: 'browse',
        src: async (ctx: any) => null,
        onDone: 'success',
        onError: 'failure'
      }
    },

    success: {
      type: 'final',
    },
    failure: {
      entry: assign({
        error: (ctx, event: any) => event.data
      }),
      type: 'final',
    },
  }
}

const getBrowseSource = (browsePageMachine: any) => {
  return {
    id: 'source-browser',
    initial: 'browsing',

    states: {
      browsing: {
        invoke: {
          id: 'browse',
          src: browsePageMachine,
          data: {
            source: (ctx: any) => ctx.source,
            page: (ctx: any) => ctx.page,
          },
          onDone: [
            {
              target: 'preparing',
              cond: (ctx: any) => {
                if (ctx.page < 4) {
                  return true;
                }
              }
            },
            { target: 'success' }
          ],
          onError: 'failure'
        }
      },
      preparing: {
        entry: assign({
          page: (ctx: any) => ctx.page + 1,
        }),
        always: 'browsing',
      },

      success: {
        type: 'final',
      },
      failure: {
        entry: assign({
          error: (ctx, event: any) => event.data
        }),
        type: 'final',
      },
    }
  }
}

const getBrowse = (browseSourceMachine: any) => {
  const sources = ['e621', 'furaffinity'];

  return {
    id: 'browse',
    type: 'parallel',
    initial: 'browsing',
    context: {
      sources,
      index: 0,
      doneCount: 0
    },

    states: {
      ...(sources.reduce((acc, source) => {
        return {
          ...acc,
          [source]: {
            invoke: {
              id: 'browse',
              src: browseSourceMachine,
              data: {
                source,
                page: 1,
              },
              onDone: [
                {
                  target: 'success',
                  cond: (ctx: any) => {
                    return (ctx.doneCount + 1) >= ctx.sources.length
                  }
                },
                {
                  actions: assign({ doneCount: (ctx: any) => ctx.doneCount + 1 }),
                  //target: 'preparing'
                },
              ],
              onError: [
                {
                  target: 'failure',
                  cond: (ctx: any) => {
                    return (ctx.doneCount + 1) >= ctx.sources.length
                  }
                },
                {
                  actions: assign({ doneCount: (ctx: any) => ctx.doneCount + 1 }),
                  //target: 'preparing'
                },
              ],
            }
          },
        };
      }, {} as any)),

      /*preparing: {
        entry: assign({
          index: (ctx: any) => ctx.index + 1,
          printLine: () => console.log()
        }),
        always: 'browsing'
      },*/

      success: {
        type: 'final',
      },
      failure: {
        entry: assign({
          error: (ctx, event: any) => event.data
        }),
        type: 'final',
      },
    }
  }
}

const getBrowserMachine = () => {
  const browseSource = getBrowseSource(createMachine(browsePage as any));
  const browse = getBrowse(createMachine(browseSource as any));

  return createMachine(browse as any);
}

(async () => {
  const service = interpret(getBrowserMachine());
  service.onEvent(e => {
    //console.log(service.state.context)
  })
  service.start();


})()

/*
const e621 = {
  initial: 'idle',

  states: {
    idle: {
      on: {
        START: 'running',
      }
    },

    running: {
      initial: 'browsing',

      states: {
        browsing: {

        },
        posting: {

        },
      }
    },

    success: {
      always: 'idle',
    },
    failure: {
      always: 'idle',
    },
  }
};*/

//const browsePage = () => browse => post;
//const browseSource = () => loopWhile(previousBrowsingResult.canContinue, page => browsePage(page))
//const browse = (sources) => sources.loop(parallel(source => browseSource(source)))
//const run = () => interval(browse)
