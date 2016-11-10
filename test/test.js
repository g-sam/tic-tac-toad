import test from 'ava';
import run from '../src';

test('environment', (t) => {
  t.true(run());
});
