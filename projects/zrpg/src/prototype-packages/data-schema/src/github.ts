import { Dialog } from './Dialog';

/* istanbul ignore next */
export const dialog: Dialog = {
  // NPC says "Lorem ipsum"
  type: 'text',
  text: 'Lorem ipsum',
  $on: {
    $done: {
      // when the user presses a button the NPC asks this
      // with for only answers "kill" and "Do something interesting"
      type: 'select',
      text: 'what do you want to do?',
      options: [
        {
          value: 'kill',
          text: 'kill',
        },
        {
          value: 'interesting-thing',
          text: 'Do something interesting',
        },
      ],

      $on: {
        $answer: {
          // if the user answers "kill" the NPC will have 50% of chance to say "Sounds thrilling"
          // and 50% chance to say "I fear you may only hurt yourself"
          kill: [
            'Sounds thrilling',
            {
              type: 'text',
              text: 'I fear you may only hurt yourself...',
              $on: {
                // when the user presses a button the NPC says "Killing is not a good solution"
                $done: 'Killing is not a good solution.',
              },
            }
          ],
          // if the user answers "Do something interesting"
          'interesting-thing': {
            $if: {
              $cond: {},
              /*$cond: {
                type: 'quest',
                id: 5,
                status: 'completed',
              },*/
              $then: 'Just enjoy your free time, there is plenty to do.'
            },
            '$else if': [
              {
                $cond: {},
                /*$cond: {
                  type: 'quest',
                  id: 5,
                  status: 'accepted',
                },*/
                $then: 'You already have something interesting to do.'
              },
              {
                $cond: {},
                /*$cond: {
                  type: 'npc',
                  id: 69,
                  killCount: 69
                },*/
                $then: 'Well you\'ve killed every monsters, so now life\'s boring. That\'s on you.'
              }
            ],
            $else: {
              $pick: {
                $resolve: 'single',
                $options: [
                  {
                    // The NPC has 5% chance to say "I don't say that everyday, so listen well. You're silly"
                    $chance: 5,
                    $value: 'I don\'t say that everyday, so listen well. You\'re silly.'
                  },
                  {
                    // The NPC has 95% chance to say "Go somewhere interesting"
                    $chance: 95,
                    $value: 'Go somewhere interesting.'
                  }
                ]
              }
            },
          },
        }
      },
    }
  },
}

export const t = {
  type: 'dialog',
  selector: {
    states: {
      idle: {

      }
    }
  }
}

export const dialogV2 = {
  type: 'dialog',
  steps: [
    {
      type: 'text',
      text: 'Lorem ipsum',
    },
    {
      type: 'select',
      label: 'what do you want to do?',
      options: [
        {
          type: 'option',
          text: 'kill',
          actions: [
            {
              type: 'dialog',
              selector: {
                random: [
                  {
                    type: 'text',
                    text: 'Sounds thrilling'
                  },
                  {
                    type: 'dialog',
                    steps: [
                      {
                        type: 'text',
                        text: 'I fear you may only hurt yourself...',
                      },
                      {
                        type: 'text',
                        text: 'Killing is not a good solution.',
                      },
                    ]
                  }
                ]
              },
            }
          ]
        },
        {
          type: 'option',
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
                }
              ]
            },
            {
              type: 'dialog',
              sensor: {
                type: 'quest',
                id: 5,
                status: 'accepted',
              },
              steps: [
                {
                  type: 'text',
                  text: 'You already have something interesting to do.'
                }
              ]
            },
            {
              type: 'dialog',
              sensors: [
                {
                  type: 'quest',
                  id: 5,
                  status: 'unaccepted'
                },
                {
                  type: 'mob',
                  id: 69,
                  killCount: 69,
                }
              ],
              steps: [
                {
                  type: 'text',
                  text: 'Well you\'ve killed every monsters, so now life\'s boring. That\'s on you.'
                }
              ]
            },
            {
              type: 'dialog',
              selector: {
                chance: [
                  {
                    type: 'option',
                    chance: '5%',
                    value: {
                      type: 'text',
                      text: 'I don\'t say that everyday, so listen well. You\'re silly.'
                    }
                  },
                  {
                    type: 'option',
                    chance: '95%',
                    value: {
                      type: 'text',
                      text: 'Go somewhere interesting.'
                    }
                  }
                ]
              }
            },
          ]
        },
      ]
    }
  ]
}
