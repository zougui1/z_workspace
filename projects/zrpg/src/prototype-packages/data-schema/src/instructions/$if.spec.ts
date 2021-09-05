import { $if } from './$if';
import { Branch } from '../utils';

describe('$if()', () => {
  it('should return the value from $if when its condition passes', () => {
    const branch: Branch<string> = {
      $if: {
        $cond: {},
        $then: 'value from $if'
      },
      '$else if': {
        $cond: {},
        $then: 'value from "$else if"',
      },
      $else: 'value from $else',
    };

    const result = $if(branch);
    expect(result).toBe('value from $if');
  });

  it('should return the value from "$else if" when its condition passes and not $if\'s', () => {
    const branch: Branch<string> = {
      $if: {
        $cond: false as any,
        $then: 'value from $if'
      },
      '$else if': {
        $cond: {},
        $then: 'value from "$else if"',
      },
      $else: 'value from $else',
    };

    const result = $if(branch);
    expect(result).toBe('value from "$else if"');
  });

  it('should return the value from $else when no $if or "$else if" pass', () => {
    const branch: Branch<string> = {
      $if: {
        $cond: false as any,
        $then: 'value from $if'
      },
      '$else if': {
        $cond: false as any,
        $then: 'value from "$else if"',
      },
      $else: 'value from $else',
    };

    const result = $if(branch);
    expect(result).toBe('value from $else');
  });

  it('should return undefined when $if does not pass and there is no "$else if" nor $else', () => {
    const branch: Branch<string> = {
      $if: {
        $cond: false as any,
        $then: 'value from $if'
      },
    };

    const result = $if(branch);
    expect(result).toBe(undefined);
  });

  it('should return undefined when $if and "$else if" do not pass and there is no $else', () => {
    const branch: Branch<string> = {
      $if: {
        $cond: false as any,
        $then: 'value from $if'
      },
      '$else if': {
        $cond: false as any,
        $then: 'value from "$else if"',
      },
    };

    const result = $if(branch);
    expect(result).toBe(undefined);
  });

  it('should return the value from the second "$else if" when it passes and $if and the first "$else if" do not pass', () => {
    const branch: Branch<string> = {
      $if: {
        $cond: false as any,
        $then: 'value from $if'
      },
      '$else if': [
        {
          $cond: false as any,
          $then: 'value from first "$else if"',
        },
        {
          $cond: {},
          $then: 'value from second "$else if"',
        },
        {
          $cond: {},
          $then: 'value from third "$else if"',
        },
      ],
    };

    const result = $if(branch);
    expect(result).toBe('value from second "$else if"');
  });
});
