import { runQuery } from './runQuery';

describe('runQuery()', () => {
  const value = {
    some: 'value',
    this: {
      length: 4,
      array: [],
      is: {
        a: {
          nested: {
            object: {
              with: 'a value',
            },
            array: ['with', '3', 'values']
          }
        }
      }
    },
    'another.nested.object': ':O',
    myUndefined: undefined,
    myDate: new Date(),
    myNull: null,
    number1: 42,
    number69: 69,
    bool1: true,
    bool2: false,
    Deutsch: 'Es ist mein Drache',
  };

  let randomSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random').mockName('Math.random').mockReturnValue(0.6);
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  describe('$eq', () => {
    it('should return true when the query is empty', () => {
      const value = {};
      const query = {};
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });

    it('should return true when the query matches the value', () => {
      const value = { some: 'value' };
      const query = { some: 'value' };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });

    it('should return false when the query does not match the value', () => {
      const value = { some: 'value' };
      const query = { some: 'super value!' };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });

    it('should return true when querying "this.is.a.nested.object.with" using nested objects', () => {
      const query = {
        this: {
          is: {
            a: {
              nested: {
                object: {
                  with: 'a value'
                }
              }
            }
          }
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });

    it('should return true when querying "this.is.a.nested.object.with" using nested objects with $eq', () => {
      const query = {
        this: {
          is: {
            a: {
              nested: {
                object: {
                  with: {
                    $eq: 'a value'
                  }
                }
              }
            }
          }
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });

    it('should return true when querying "this.is.a.nested.object.with" using the dot notation', () => {
      const query = {
        'this.is.a.nested.object.with': 'a value',
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });

    it('should return true when querying "this.is.a.nested.object.with" using the dot notation with $eq', () => {
      const query = {
        'this.is.a.nested.object.with': {
          $eq: 'a value',
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });

    it('should return true when performing an equality test on an array with a correct value', () => {
      const query = {
        'this.is.a.nested.array': {
          $eq: ['with', '3', 'values'],
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return false when performing an equality test on an array with an incorrect value', () => {
      const query = {
        'this.is.a.nested.array': {
          $eq: ['with', '4', 'values'],
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });

    it('should return true when performing an equality test on an item of an array with a correct value', () => {
      const query = {
        'this.is.a.nested.array[1]': {
          $eq: '3',
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return false when performing an equality test on an item of an array with an incorrect value', () => {
      const query = {
        'this.is.a.nested.array[1]': {
          $eq: '4',
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
  });

  describe('$ne', () => {
    it('should return true when performing a $ne with an incorrect value', () => {
      const query = {
        'this.is.a.nested.object.with': {
          $ne: 'Kein Drache?! D:',
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return false when performing a $ne with a correct value', () => {
      const query = {
        'this.is.a.nested.object.with': {
          $ne: 'a value',
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
  });

  describe('$pattern', () => {
    it('should return true when matching a value with a correct pattern', () => {
      const query = {
        'this.is.a.nested.array[1]': {
          $regex: '/[0-9]/',
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return false when matching a value with an incorrect pattern', () => {
      const query = {
        'this.is.a.nested.array[1]': {
          $regex: '/[a-z]/',
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
  });

  describe('explicit $and; $gt and $lt', () => {
    it('should return true when the number is greater than 0 and less than 100 using $and and $gt/$lt separately', () => {
      const query = {
        $and: [
          { number1: { $gt: 0 } },
          { number1: { $lt: 100 } },
        ],
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return false when the number is not greater than 100 and/or not less than 150 using $and and $gt/$lt separately', () => {
      const query = {
        $and: [
          { number1: { $gt: 100 } },
          { number1: { $lt: 150 } },
        ],
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
  });

  describe('implicit $and; $gt and $lt', () => {
    it('should return true when the number is greater than 0 and less than 100 using $gt/$lt together', () => {
      const query = {
        number1: {
          $gt: 0,
          $lt: 100,
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return false when the number is not greater than 100 and/or not less than 150 using $gt/$lt together', () => {
      const query = {
        number1: {
          $gt: 100,
          $lt: 150,
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
  });

  describe('implicit $and; $gte and $lte', () => {
    it('should return true when the number is greater than or equal to 69 and less than or equal to 69 using $gte/$lte together', () => {
      const query = {
        number69: {
          $gte: 69,
          $lte: 69,
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return false when the number is not greater than or equal to 40 and/or not less than or equal to 50 using $gte/$lte together', () => {
      const query = {
        number69: {
          $gte: 40,
          $lte: 50,
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
  });

  describe('$in', () => {
    it('should return true when the array provided to $in contains the value', () => {
      const query = {
        Deutsch: {
          $in: ['Es ist mein Drache', 'Es ist ein Drache', 'Ich bin ein Drache']
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return true when the array provided to $in contains the value', () => {
      const query = {
        Deutsch: {
          $in: [{ $gt: 45 }, { $type: 'string' }]
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return false when the array provided to $in does not contain the value', () => {
      const query = {
        Deutsch: {
          $in: ['Es ist ein Drache', 'Ich bin ein Drache']
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
  });

  describe('$nin', () => {
    it('should return false when the array provided to $nin contains the value', () => {
      const query = {
        Deutsch: {
          $nin: ['Es ist mein Drache', 'Es ist ein Drache', 'Ich bin ein Drache']
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
    it('should return true when the array provided to $nin does not contain the value', () => {
      const query = {
        Deutsch: {
          $nin: ['Es ist ein Drache', 'Ich bin ein Drache']
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
  });

  describe('$or', () => {
    it('should return true when at least one expression given to $or succeed', () => {
      const query = {
        $or: [
          {
            'this.is.a.nested.object.with': 'a value'
          },
          {
            'this.is.a.nested.object.with': 'a'
          },
        ]
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return false when every expression given to $or fail', () => {
      const query = {
        $or: [
          {
            'this.is.a.nested.object.with': 'value'
          },
          {
            'this.is.a.nested.object.with': 'a'
          },
        ]
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
    it('should return false when every expression given to $or, nested into the property to test, fail', () => {
      const query = {
        'this.is.a.nested.object.with': {
          $or: [
            'value',
            'a',
          ]
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
    it('should return true when at least one expression given to $or, nested into the property to test, succeed', () => {
      const query = {
        'this.is.a.nested.object.with': {
          $or: [
            'a value',
            'a',
          ]
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
  });

  describe('$nor', () => {
    it('should return false when at least one expression given to $nor succeed', () => {
      const query = {
        $nor: [
          {
            'this.is.a.nested.object.with': 'a value'
          },
          {
            'this.is.a.nested.object.with': 'a'
          },
        ]
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
    it('should return true when every expression given to $nor fail', () => {
      const query = {
        $nor: [
          {
            'this.is.a.nested.object.with': 'value'
          },
          {
            'this.is.a.nested.object.with': 'a'
          },
        ]
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return true when every expression given to $nor, nested into the property to test, fail', () => {
      const query = {
        'this.is.a.nested.object.with': {
          $nor: [
            'value',
            'a',
          ]
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
    it('should return false when at least one expression given to $nor, nested into the property to test, succeed', () => {
      const query = {
        'this.is.a.nested.object.with': {
          $nor: [
            'a value',
            'a',
          ]
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
  });

  describe('$not', () => {
    it('should return true when the equality check given to $not fails', () => {
      const query = {
        $not: {
          'this.is.a.nested.object.with': 'value'
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });

    it('should return false when the equality check given to $not succeeds', () => {
      const query = {
        $not: {
          'this.is.a.nested.object.with': 'a value'
        },
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
  });

  describe('$all', () => {
    it('should return true when all the values given to $all are present in the target\'s array', () => {
      const query = {
        'this.is.a.nested.array': {
          $all: ['with', '3', 'values'],
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });

    it('should return true when all the nested operators given to $all succeed', () => {
      const query = {
        'this.is.a.nested.array': {
          $all: [{ $type: 'string' }, { $type: 'string' }, { $type: 'string' }],
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });

    it('should return false when at least one value given to $all is not present in the target\'s array', () => {
      const query = {
        'this.is.a.nested.array': {
          $all: ['with', '69', 'values'],
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });

    it('should return false when $all does not target an array', () => {
      const query = {
        'this': {
          $all: ['with', '3', 'values'],
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });
  });

  describe('$type', () => {
    describe('test value', () => {
      it('should return true if the value is required to be undefined and it is undefined', () => {
        const query = {
          myUndefined: {
            $type: 'undefined'
          }
        };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return true if the value is required to be undefined and it does not exist', () => {
        const query = {
          'some.inexistent.property': {
            $type: 'undefined'
          }
        };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return false if the value is required to be undefined and it is not undefined', () => {
        const query = {
          some: {
            $type: 'undefined'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });

      it('should return true if the value is required to be null and it is null', () => {
        const query = {
          myNull: {
            $type: 'null'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return false if the value is required to be null and it is not null', () => {
        const query = {
          number1: {
            $type: 'null'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });

      it('should return true if the value is required to be a number and it is a number', () => {
        const query = {
          number1: {
            $type: 'number'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return false if the value is required to be a number and it is not a number', () => {
        const query = {
          myNull: {
            $type: 'number'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });

      it('should return true if the value is required to be a string and it is a string', () => {
        const query = {
          Deutsch: {
            $type: 'string'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return false if the value is required to be a string and it is not a string', () => {
        const query = {
          number1: {
            $type: 'string'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });

      it('should return true if the value is required to be an array and it is an array', () => {
        const query = {
          'this.is.a.nested.array': {
            $type: 'array'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return false if the value is required to be an array and it is not an array', () => {
        const query = {
          number1: {
            $type: 'array'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });

      it('should return true if the value is required to be an object and it is an object', () => {
        const query = {
          this: {
            $type: 'object'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return false if the value is required to be an object and it is not an object', () => {
        const query = {
          number1: {
            $type: 'object'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });

      it('should return true if the value is required to be a boolean and it is false', () => {
        const query = {
          bool1: {
            $type: 'boolean'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return true if the value is required to be a boolean and it is true', () => {
        const query = {
          bool2: {
            $type: 'boolean'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return false if the value is required to be a boolean and it is not a boolean', () => {
        const query = {
          number1: {
            $type: 'array'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });

      it('should return true if the value is required to be a date and it is a date', () => {
        const query = {
          myDate: {
            $type: 'date'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return false if the value is required to be a date and it is not a date', () => {
        const query = {
          number1: {
            $type: 'date'
          }
         };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });
    });

    describe('return result', () => {
      it('should return \`undefined\` if the value is undefined', () => {
        const query = {
          $return: {
            myUndefined: {
              $return: {
                $type: {}
              }
            }
          }
        };
        const result = runQuery(value, query);

        expect(result).toBe('undefined');
      });

      it('should return \`undefined\` if the value does not exist', () => {
        const query = {
          $return: {
            'some.inexistent.property': {
              $return: {
                $type: {}
              }
            }
          }
        };
        const result = runQuery(value, query);

        expect(result).toBe('undefined');
      });

      it('should return \`null\` if the value is null', () => {
        const query = {
          $return: {
            myNull: {
              $return: {
                $type: {}
              }
            }
          }
        };
        const result = runQuery(value, query);

        expect(result).toBe('null');
      });

      it('should return \`number\` if the value is a number', () => {
        const query = {
          $return: {
            number1: {
              $return: {
                $type: {}
              }
            }
          }
        };
        const result = runQuery(value, query);

        expect(result).toBe('number');
      });

      it('should return \`string\` if the value is a string', () => {
        const query = {
          $return: {
            Deutsch: {
              $return: {
                $type: {}
              }
            }
          }
        };
        const result = runQuery(value, query);

        expect(result).toBe('string');
      });

      it('should return \`array\` if the value is an array', () => {
        const query = {
          $return: {
            'this.is.a.nested.array': {
              $return: {
                $type: {}
              }
            }
          }
        };
        const result = runQuery(value, query);

        expect(result).toBe('array');
      });

      it('should return \`object\` if the value is an object', () => {
        const query = {
          $return: {
            this: {
              $return: {
                $type: {}
              }
            }
          }
        };
        const result = runQuery(value, query);

        expect(result).toBe('object');
      });

      it('should return \`boolean\` if the value is false', () => {
        const query = {
          $return: {
            bool1: {
              $return: {
                $type: {}
              }
            }
          }
        };
        const result = runQuery(value, query);

        expect(result).toBe('boolean');
      });

      it('should return \`boolean\` if the value is true', () => {
        const query = {
          $return: {
            bool2: {
              $return: {
                $type: {}
              }
            }
          }
        };
        const result = runQuery(value, query);

        expect(result).toBe('boolean');
      });

      it('should return \`date\` if the value is a date', () => {
        const query = {
          $return: {
            myDate: {
              $return: {
                $type: {}
              }
            }
          }
        };
        const result = runQuery(value, query);

        expect(result).toBe('date');
      });
    });
  });

  describe('$exists', () => {
    it('should return true when the property exists and we want it to exist', () => {
      const query = {
        myUndefined: {
          $exists: true
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });

    it('should return false when the property exists and we want it to not exist', () => {
      const query = {
        myUndefined: {
          $exists: false
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });

    it('should return false when the property does not exist and we want it to exist', () => {
      const query = {
        'some.inexistent.property': {
          $exists: true
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(false);
    });

    it('should return true when the property does not exist and we want it to not exist', () => {
      const query = {
        'some.inexistent.property': {
          $exists: false
        }
      };
      const doMatch = runQuery(value, query);

      expect(doMatch).toBe(true);
    });
  });

  describe('$length', () => {
    describe('test value', () => {
      it('should return true when the array has the same size as what is specified to $length', () => {
        const query = {
          'this.is.a.nested.array': {
            $length: 3
          }
        };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return false when the array does not have the same size as what is specified to $length', () => {
        const query = {
          'this.is.a.nested.array': {
            $length: 69
          }
        };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });

      it('should return true when the string has the same size as what is specified to $length', () => {
        const query = {
          'some': {
            $length: 5
          }
        };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(true);
      });

      it('should return false when the string does not have the same size as what is specified to $length', () => {
        const query = {
          'some': {
            $length: 69
          }
        };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });

      it('should return false when the target is neither an array or a string', () => {
        const query = {
          'this': {
            $length: 4
          }
        };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(false);
      });
    });

    describe('return result', () => {
      it('should return the length of the array', () => {
        const query = {
          $return: {
            'this.is.a.nested.array': {
              $return: {
                $length: {}
              },
            }
          },
        };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(3);
      });

      it('should return the length of the string', () => {
        const query = {
          $return: {
            some: {
              $return: {
                $length: {}
              },
            }
          },
        };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBe(5);
      });

      it('should return undefined when the target is neither an array or a string', () => {
        const query = {
          $return: {
            this: {
              $return: {
                $length: {}
              },
            }
          },
        };
        const doMatch = runQuery(value, query);

        expect(doMatch).toBeUndefined();
      });
    });
  });

  describe('return query type', () => {
    it('should return true', () => {
      const query = {
        $return: {
          this: {
            $type: 'object',
          },
        },

      };
      const res = runQuery(value, query);

      expect(res).toBe(true);
    });
  });

  describe('return-all query type', () => {
    it('should return an array containing a number and a boolean both generated by `Math.random()`', () => {
      randomSpy.mockReturnValue(0.6);

      const query = {
        $returnAll: {
          $random: {},
          $randomBoolean: {},
        },
      };
      const result = runQuery(value, query);

      expect(randomSpy).toBeCalledTimes(2);
      expect(result).toBeInstanceOf(Array);
      expect(result).toContainEqual(0.6);
      expect(result).toContainEqual(true);
    });

    it('should return the correct values', () => {
      randomSpy.mockReturnValue(0.6);

      const query = {
        $returnAll: {
          // should be true
          number69: {
            $randomInt: [0, 100],
          },
          // should be 60
          $randomInt: [0, 100],
          // true
          'this.is.a.nested.array': {
            $return: {
              $type: 'array'
            }
          },
          // 'array'
          this: {
            'is.a.nested.array': {
              $return: {
                $type:  {}
              }
            },
          },
          // this will return only 1 value: whether one of those queries has succeeded
          // should be true
          $or: [
            // 60
            {
              $return: {
                $randomInt: [0, 100],
              }
            },
            // true
            {
              'this.is.a.nested.array': {
                $return: {
                  $type: 'array'
                }
              }
            },
            // false
            {
              'this.is.a.nested.array': {
                $return: {
                  $type: 'string'
                }
              }
            },
          ]
        }
      };
      const res = runQuery(value, query);

      expect(res).toEqual([true, 60, 'array', true, true]);
    });
  });

  describe('$random', () => {
    it('should return a number generated by `Math.random()`', () => {
      const query = {
        $return: {
          $random: {},
        },

      };
      const num = runQuery(value, query);

      expect(randomSpy).toBeCalledTimes(1);
      expect(typeof num).toBe('number');
    });
  });

  describe('$randomBoolean', () => {
    it('should return a boolean', () => {
      const query = {
        $return: {
          $randomBoolean: {},
        },

      };
      const bool = runQuery(value, query);

      expect(randomSpy).toBeCalledTimes(1);
      expect(typeof bool).toBe('boolean');
    });
  });

  describe('$randomFloat', () => {
    it('should return a number generated by `Math.random()`', () => {
      const minimum = 0;
      const maximum = 5;
      const query = {
        $return: {
          $randomFloat: [minimum, maximum] as [number, number]
        },

      };
      const num = runQuery(value, query);

      expect(randomSpy).toBeCalledTimes(1);
      expect(typeof num).toBe('number');
    });
  });

  describe('$randomIndex', () => {
    it('should return a number generated by `Math.random()`', () => {
      const query = {
        $return: {
          'this.is.a.nested.array': {
            // if we don't explicitely do a $return
            // it will implicitely test if the value
            // of `'this.is.a.nested.array'` is equal to the
            // value returned by $randomIndex
            $return: {
              $randomIndex: {}
            }
          }
        },
      };
      const index = runQuery(value, query);

      expect(randomSpy).toBeCalledTimes(1);
      expect(typeof index).toBe('number');
    });

    it('should return undefined if the value is not an array', () => {
      const query = {
        $return: {
          'this': {
            $return: {
              $randomIndex: {}
            }
          }
        },
      };
      const index = runQuery(value, query);

      expect(randomSpy).not.toBeCalled();
      expect(index).toBeUndefined();
    });

    it('should return a number generated by `Math.random()`', () => {
      const query = {
        $return: {
          'this.array': {
            $return: {
              $randomIndex: {}
            }
          }
        },
      };
      const index = runQuery(value, query);

      expect(randomSpy).not.toBeCalled();
      expect(index).toBeUndefined();
    });
  });

  describe('$randomInt', () => {
    it('should return a number generated by `Math.random()`', () => {
      const minimum = 0;
      const maximum = 5;
      const query = {
        $return: {
          $randomInt: [minimum, maximum] as [number, number]
        },

      };
      const num = runQuery(value, query);

      expect(randomSpy).toBeCalledTimes(1);
      expect(typeof num).toBe('number');
      expect(Number.isSafeInteger(num)).toBeTruthy();
    });
  });

  describe('$randomItem', () => {
    it('should return a number generated by `Math.random()`', () => {
      const query = {
        $return: {
          'this.is.a.nested.array': {
            $return: {
              $randomItem: {}
            }
          }
        },
      };
      const item = runQuery(value, query);

      expect(randomSpy).toBeCalledTimes(1);
      expect(['with', '3', 'values']).toContainEqual(item);
    });

    it('should return undefined if the value is not an array', () => {
      const query = {
        $return: {
          'this': {
            $return: {
              $randomItem: {}
            }
          }
        },
      };
      const item = runQuery(value, query);

      expect(randomSpy).not.toBeCalled();
      expect(item).toBeUndefined();
    });

    it('should return a number generated by `Math.random()`', () => {
      const query = {
        $return: {
          'this.array': {
            $return: {
              $randomItem: {}
            }
          }
        },
      };
      const item = runQuery(value, query);

      expect(randomSpy).not.toBeCalled();
      expect(item).toBeUndefined();
    });
  });

  describe('prototype tests', () => {
    xit('should return the value of `value.some`', () => {
        const query = {
          $return: {
            // `value.some`
            $this: 'some',
            // the scope is `value` because we're at the root level
            // `value.some`
            $scope: 'some',
            // access to an external variable (through the option `onExternalVar`)
            $external: 'someExternalVariableName',
            $var: {
              // creates a variable with for name 'myVar' and for value 'my value'
              myVar: 'my value',
              // creates a variable with for name 'someType'
              // and for value the type of `value.some`
              someType: {
                //? maybe make the variables definition a return type by default?
                $return: {
                  $type: {
                    $this: 'some',
                  }
                }
              }
            },

            'this.is.a.nested': {
              // `value.object`
              $this: 'object',
              // scope is `value.this.is.a.nested`
              // because that's where we're at and it is an object
              // `value.this.is.a.nested.object`
              $scope: 'object',

              object: {
                with: {
                  // `value.deeper`
                  $this: 'deeper',
                  // scope is `value.this.is.a.nested.object`
                  // because that's where the deepest object/array is
                  // `value.this.is.a.nested.object.with` is a string
                  // `value.this.is.a.nested.object.deeper`
                  $scope: 'deeper',
                },
              }
            },
          },
        };
      const res = runQuery(value, query);

      expect(res).toBe(3);
    });

    xit('should test if a value is equal to another', () => {
      const query = {
        some: {
          $this: 'this.is.a.nested.object.with'
        },
      };
    const res = runQuery(value, query);

    expect(res).toBe(3);
    });
  });

  it('should return true when querying multiple fields at once with correct values', () => {
    const query = {
      this: {
        is: {
          a: {
            nested: {
              object: {
                with: {
                  $eq: 'a value',
                }
              },
              array: ['with', '3', 'values'],
              'array[1]': '3',
              'array[0]': {
                $eq: 'with',
                $ne: 'not that! D:',
                $regex: '/^with$/',
              },
            }
          }
        }
      },
      $and: [
        { number1: { $gt: 0 } },
        { number1: { $lt: 100 } },
      ],
      number1: {
        $gt: 0,
        $lt: 100,
      },
      number69: {
        $gte: 69,
        $lte: 69,
      },
    };

    const doMatch = runQuery(value, query);
    expect(doMatch).toBe(true);
  });

  it('should return false when querying multiple fields at once with incorrect values', () => {
    const query = {
      this: {
        is: {
          a: {
            nested: {
              object: {
                with: {
                  $eq: 'Mein value!',
                }
              },
              array: ['with', '4', 'values'],
              'array[1]': '7',
              'array[0]': {
                $eq: 'with :o',
                $ne: 'with',
                $regex: '/^Kein Drache?! D:$/',
              },
            }
          }
        }
      },
      $and: [
        { number1: { $gt: 100 } },
        { number1: { $lt: 150 } },
      ],
      number1: {
        $gt: 100,
        $lt: 150,
      },
      number69: {
        $gte: 40,
        $lte: 50,
      },
    };

    const doMatch = runQuery(value, query);
    expect(doMatch).toBe(false);
  });

  it('should throw an error when a property starting with "$" is not a valid operator', () => {
    const value = {
      some: 'value'
    };
    const query = {
      $inexistentOperator: 'value'
    };
    const tryMatch = () => runQuery(value, query);

    expect(tryMatch).toThrowError('invalid operator "$inexistentOperator"');
  });
});
