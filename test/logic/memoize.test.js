import test from 'ava';
import { spy } from 'sinon';
import memoize from '../../src/logic/memoize';

test('memoized function returns result from cache', (t) => {
  const fn = spy(arg => arg);
  const memoized = memoize(fn);
  memoized('test', 1351);
  t.true(fn.calledOnce);
  memoized('test', 1351);
  t.false(fn.calledTwice);
  memoized('test');
  t.true(fn.calledTwice);
});
