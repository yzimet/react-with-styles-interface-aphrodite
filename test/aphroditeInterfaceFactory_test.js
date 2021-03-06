import { expect } from 'chai';
import sinon from 'sinon-sandbox';
import aphrodite from 'aphrodite';
import aphroditeInterfaceFactory from '../src/aphroditeInterfaceFactory';

import * as resolve from '../src/utils/resolve';

describe('aphroditeInterfaceFactory', () => {
  const { StyleSheetTestUtils } = aphrodite;
  const aphroditeInterface = aphroditeInterfaceFactory(aphrodite);
  let resolveSpy;

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
    resolveSpy = sinon.spy(resolve, 'default');
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
    sinon.restore();
  });

  describe('.create()', () => {
    it('processes the styles with Aphrodite', () => {
      expect(aphroditeInterface.create({
        foo: {
          color: 'red',
        },
      })).to.eql({
        foo: {
          _definition: {
            color: 'red',
          },
          _len: 15,
          _name: 'foo_137u7ef',
        },
      });
    });
  });

  describe('.resolve()', () => {
    it('calls resolve method', () => {
      aphroditeInterface.resolve([]);
      expect(resolveSpy.callCount).to.equal(1);
    });
  });

  describe('.resolveNoRTL()', () => {
    it('calls resolve method', () => {
      aphroditeInterface.resolveNoRTL([]);
      expect(resolveSpy.callCount).to.equal(1);
    });
  });
});
