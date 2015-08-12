/* @flow */

import {Combo as TestCombo} from '../lib';

import Combo from '../lib/Combo';

describe('index', function () {

  it('re-exports Combo', function () {
    expect(TestCombo).toBe(Combo);
  });

});
