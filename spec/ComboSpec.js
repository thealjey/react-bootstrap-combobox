/* @flow */

import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import proxyquire from 'proxyquire';

describe('Combo', function () {

  /* @noflow */
  var Combo, cmp, debounce, requestAnimationFrame, addEventListener, removeEventListener, window;

  beforeEach(function () {
    debounce = jasmine.createSpy('debounce').and.callFake(callback => callback);
    requestAnimationFrame = jasmine.createSpy('requestAnimationFrame').and.callFake(function (callback) {
      callback();
    });
    addEventListener = jasmine.createSpy('addEventListener');
    removeEventListener = jasmine.createSpy('removeEventListener');
    window = global.window = {innerHeight: 0, requestAnimationFrame, addEventListener, removeEventListener};
    Combo = proxyquire('../lib/Combo', {'lodash/function/debounce': debounce});
    cmp = new Combo({something: 'here'});
  });

  it('inherits React.Component', function () {
    expect(cmp instanceof React.Component).toBeTruthy();
  });

  it('passes on the props', function () {
    expect(cmp.props).toEqual({something: 'here'});
  });

  it('sets the default viewportHeight', function () {
    expect(cmp.viewportHeight).toBe(0);
  });

  it('sets up the handler function', function () {
    expect(debounce).toHaveBeenCalledWith(jasmine.any(Function), 150);
    expect(cmp.handleResize).toEqual(jasmine.any(Function));
    spyOn(cmp, 'onResize');
    cmp.handleResize();
    expect(cmp.onResize).toHaveBeenCalled();
  });

  describe('shouldComponentUpdate', function () {

    it('onChange different', function () {
      cmp.props.onChange = function () {};
      expect(cmp.shouldComponentUpdate({onChange() {}})).toBeTruthy();
    });

    it('items different', function () {
      var onChange = cmp.props.onChange = function () {};

      cmp.props.items = {a: 'item 1', b: 'item 2'};
      expect(cmp.shouldComponentUpdate({onChange, items: {c: 'item 3', d: 'item 4'}})).toBeTruthy();
    });

    it('value different', function () {
      var onChange = cmp.props.onChange = function () {},
          items = cmp.props.items = {a: 'item 1', b: 'item 2'};

      cmp.props.value = 'a';
      expect(cmp.shouldComponentUpdate({onChange, items, value: 'b'})).toBeTruthy();
    });

    it('no difference', function () {
      var onChange = cmp.props.onChange = function () {},
          items = cmp.props.items = {a: 'item 1', b: 'item 2'},
          value = cmp.props.value = 'a';

      expect(cmp.shouldComponentUpdate({onChange, items, value})).toBeFalsy();
    });

  });

  describe('onResize', function () {

    it('unchanged', function () {
      window.innerHeight = 0;
      spyOn(React, 'findDOMNode');
      cmp.onResize();
      expect(React.findDOMNode).not.toHaveBeenCalled();
    });

    describe('changed', function () {

      /* @noflow */
      var setDropdownState, getBoundingClientRect, style;

      beforeEach(function () {
        setDropdownState = jasmine.createSpy('setDropdownState');
        getBoundingClientRect = jasmine.createSpy('getBoundingClientRect').and.returnValue({top: 50});
        style = {maxHeight: 0};
        window.innerHeight = 80;
        cmp.refs = {
          combo: {
            setDropdownState,
            refs: {menu: 'the menu component'}
          }
        };
        spyOn(React, 'findDOMNode').and.returnValue({style, getBoundingClientRect});
      });

      describe('does not change the dropdown state', function () {

        beforeEach(function () {
          cmp.refs.combo.state = {open: true};
          cmp.onResize();
        });

        it('remembers the viewport height', function () {
          expect(cmp.viewportHeight).toBe(80);
        });

        it('searches for the DOM node of the menu', function () {
          expect(React.findDOMNode).toHaveBeenCalledWith('the menu component');
        });

        it('does not call setDropdownState', function () {
          expect(setDropdownState).not.toHaveBeenCalled();
        });

        it('calculates the menu position', function () {
          expect(getBoundingClientRect).toHaveBeenCalled();
        });

        it('updates the maximum height of the menu accordingly', function () {
          expect(style.maxHeight).toBe('30px');
        });

      });

      describe('changes the dropdown state', function () {

        beforeEach(function () {
          cmp.refs.combo.state = {open: false};
          cmp.onResize();
        });

        it('opens and closes the menu', function () {
          expect(setDropdownState.calls.count()).toBe(2);
          expect(setDropdownState.calls.argsFor(0)).toEqual([true]);
          expect(setDropdownState.calls.argsFor(1)).toEqual([false]);
        });

      });

    });

  });

  describe('componentDidMount', function () {

    beforeEach(function () {
      spyOn(cmp, 'handleResize');
      cmp.componentDidMount();
    });

    it('calls handleResize', function () {
      expect(cmp.handleResize).toHaveBeenCalled();
    });

    it('sets up a resize listener on the window object', function () {
      expect(addEventListener).toHaveBeenCalledWith('resize', cmp.handleResize);
    });

  });

  describe('componentWillUnmount', function () {

    beforeEach(function () {
      cmp.componentWillUnmount();
    });

    it('removes the resize listener from the window object', function () {
      expect(removeEventListener).toHaveBeenCalledWith('resize', cmp.handleResize);
    });

  });

  describe('normalize', function () {

    it('converts to divider', function () {
      expect(cmp.normalize('-')).toEqual({divider: true});
    });

    it('converts to normal items', function () {
      expect(cmp.normalize('some text here')).toEqual({label: 'some text here'});
    });

    it('just passes on everything else unchanged', function () {
      var value = {label: 'some text here'};

      expect(cmp.normalize(value)).toBe(value);
    });

  });

  describe('getLabel', function () {

    beforeEach(function () {
      cmp.props.items = {a: 'item 1', b: 'item 2'};
      cmp.props.value = 'a';
      spyOn(cmp, 'normalize').and.returnValue({label: 'some text here'});
    });

    it('returns the normalized label', function () {
      expect(cmp.getLabel()).toBe('some text here');
    });

  });

  describe('render', function () {
    var bind;

    beforeEach(function () {
      cmp.props.items = {a: 'item 1', b: 'item 2'};
      cmp.props.value = 'a';
      spyOn(React, 'createElement').and.callFake(function (type, props, child) {
        if ('span' === type) {
          return 'the caret icon';
        }
        if ('div' === type) {
          if (null === props) {
            return `dropdown menu ${child}`;
          }
          return 'the button label wrapper';
        }
        if (MenuItem === type) {
          return `element with a key ${props.key}`;
        }
      });
      spyOn(cmp, 'getLabel').and.returnValue('some text here');
      spyOn(cmp, 'normalize').and.callFake(label => ({label}));
      bind = jasmine.createSpy('bind').and.returnValue('bound handler function');
      cmp.props.onChange = {bind};
      cmp.render();
    });

    it('creates the caret icon', function () {
      expect(React.createElement).toHaveBeenCalledWith('span', {className: 'caret'});
    });

    it('creates the button label', function () {
      expect(React.createElement).toHaveBeenCalledWith('div', {className: 'wrap'}, 'some text here', 'the caret icon');
    });

    it('creates element wrappers', function () {
      expect(React.createElement).toHaveBeenCalledWith('div', null, 'item 1');
      expect(React.createElement).toHaveBeenCalledWith('div', null, 'item 2');
    });

    it('creates menu items', function () {
      expect(React.createElement).toHaveBeenCalledWith(MenuItem, {key: 'a', eventKey: 'a', active: true,
                                                       label: 'item 1'}, 'dropdown menu item 1');
      expect(React.createElement).toHaveBeenCalledWith(MenuItem, {key: 'b', eventKey: 'b', active: false,
                                                       label: 'item 2'}, 'dropdown menu item 2');
    });

    it('creates the combobox', function () {
      expect(bind).toHaveBeenCalledWith(cmp);
      expect(React.createElement).toHaveBeenCalledWith(DropdownButton, {block: true, noCaret: true, ref: 'combo',
                                                       className: 'al-combo', title: 'the button label wrapper',
                                                       onSelect: 'bound handler function'},
                                                       ['element with a key a', 'element with a key b']);
    });

  });

});
