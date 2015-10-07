/* @flow */

import React from 'react';
import {Button, Dropdown, MenuItem} from 'react-bootstrap';
import proxyquire from 'proxyquire';

describe('Combo', function () {

  /* @noflow */
  let Combo, cmp, debounce, map, addEventListener, removeEventListener, window;

  beforeEach(function () {
    debounce = jasmine.createSpy('debounce').and.callFake(callback => callback);
    map = jasmine.createSpy('map').and.returnValue('looping through items:)');
    addEventListener = jasmine.createSpy('addEventListener');
    removeEventListener = jasmine.createSpy('removeEventListener');
    window = global.window = {innerHeight: 0, addEventListener, removeEventListener};
    Combo = proxyquire('../lib/Combo', {'lodash/function/debounce': debounce, 'lodash/collection/map': map});
  });

  describe('bind overridden', function () {

    beforeEach(function () {
      spyOn(Combo.prototype.onResize, 'bind').and.returnValue('bound handler');
      spyOn(Combo.prototype.renderMenuItem, 'bind').and.returnValue('bound renderMenuItem');
      cmp = new Combo({something: 'here'});
    });

    it('inherits React.Component', function () {
      expect(cmp instanceof React.Component).toBeTruthy();
    });

    it('passes on the props', function () {
      expect(cmp.props).toEqual({something: 'here'});
    });

    it('setup a component id', function () {
      expect(cmp.id).toBe('al-combo-1');
    });

    it('sets the default viewportHeight', function () {
      expect(cmp.viewportHeight).toBe(0);
    });

    it('calls the bind method', function () {
      expect(cmp.onResize.bind).toHaveBeenCalledWith(cmp);
    });

    it('debounces the bound handler', function () {
      expect(debounce).toHaveBeenCalledWith('bound handler', 150);
    });

    it('initializes state', function () {
      expect(cmp.state).toEqual({maxHeight: null});
    });

  });

  describe('original bind', function () {

    beforeEach(function () {
      cmp = new Combo({something: 'here'});
    });

    describe('shouldComponentUpdate', function () {

      it('onChange different', function () {
        cmp.props.onChange = function () {};
        expect(cmp.shouldComponentUpdate({onChange() {}})).toBeTruthy();
      });

      it('items different', function () {
        const onChange = cmp.props.onChange = function () {};

        cmp.props.items = {a: 'item 1', b: 'item 2'};
        expect(cmp.shouldComponentUpdate({onChange, items: {c: 'item 3', d: 'item 4'}})).toBeTruthy();
      });

      it('value different', function () {
        const onChange = cmp.props.onChange = function () {},
            items = cmp.props.items = {a: 'item 1', b: 'item 2'};

        cmp.props.value = 'a';
        expect(cmp.shouldComponentUpdate({onChange, items, value: 'b'})).toBeTruthy();
      });

      it('maxHeight different', function () {
        const onChange = cmp.props.onChange = function () {},
            items = cmp.props.items = {a: 'item 1', b: 'item 2'},
            value = cmp.props.value = 'a';

        cmp.state.maxHeight = 100;
        expect(cmp.shouldComponentUpdate({onChange, items, value}, {maxHeight: 200})).toBeTruthy();
      });

      it('no difference', function () {
        const onChange = cmp.props.onChange = function () {},
            items = cmp.props.items = {a: 'item 1', b: 'item 2'},
            value = cmp.props.value = 'a',
            maxHeight = cmp.state.maxHeight = 100;

        expect(cmp.shouldComponentUpdate({onChange, items, value}, {maxHeight})).toBeFalsy();
      });

    });

    describe('onResize', function () {

      beforeEach(function () {
        spyOn(cmp, 'setState');
      });

      it('unchanged', function () {
        window.innerHeight = 0;
        cmp.onResize();
        expect(cmp.setState).not.toHaveBeenCalled();
      });

      it('changed', function () {
        const getBoundingClientRect = jasmine.createSpy('getBoundingClientRect').and.returnValue({bottom: 50});

        spyOn(React, 'findDOMNode').and.returnValue({getBoundingClientRect});
        window.innerHeight = 80;
        cmp.onResize();
        expect(cmp.viewportHeight).toBe(80);
        expect(React.findDOMNode).toHaveBeenCalledWith(cmp);
        expect(getBoundingClientRect).toHaveBeenCalled();
        expect(cmp.setState).toHaveBeenCalledWith({maxHeight: 25});
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
        const value = {label: 'some text here'};

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

    describe('renderButton', function () {

      beforeEach(function () {
        spyOn(React, 'createElement').and.callFake(function (type) {
          if ('span' === type) {
            return 'the caret icon';
          }
          if ('div' === type) {
            return 'the button label wrapper';
          }
          if (Button === type) {
            return 'the button component';
          }
        });
        spyOn(cmp, 'getLabel').and.returnValue('some text here');
      });

      describe('structure', function () {

        beforeEach(function () {
          cmp.renderButton();
        });

        it('calls getLabel', function () {
          expect(cmp.getLabel).toHaveBeenCalled();
        });

        it('creates the caret icon', function () {
          expect(React.createElement).toHaveBeenCalledWith('span', {className: 'caret'});
        });

        it('renders the button wrapper', function () {
          expect(React.createElement).toHaveBeenCalledWith('div', null, 'some text here', 'the caret icon');
        });

        it('renders the button', function () {
          expect(React.createElement).toHaveBeenCalledWith(Button,
            {block: true, bsRole: 'toggle', className: 'dropdown-toggle'}, 'the button label wrapper');
        });

      });

      it('returns a response', function () {
        expect(cmp.renderButton()).toBe('the button component');
      });

    });

    describe('renderMenuItem divider', function () {

      beforeEach(function () {
        spyOn(React, 'createElement').and.returnValue('the divider component');
        spyOn(cmp, 'normalize').and.returnValue({divider: true});
      });

      describe('structure', function () {

        beforeEach(function () {
          cmp.renderMenuItem('item value', 'item key');
        });

        it('calls normalize', function () {
          expect(cmp.normalize).toHaveBeenCalledWith('item value');
        });

        it('renders a divider', function () {
          expect(React.createElement).toHaveBeenCalledWith(MenuItem, {key: 'item key', divider: true});
        });

      });

      it('returns a response', function () {
        expect(cmp.renderMenuItem(null, 'item key')).toBe('the divider component');
      });

    });

    describe('renderMenuItem', function () {

      beforeEach(function () {
        spyOn(React, 'createElement').and.callFake(function (type) {
          if ('div' === type) {
            return 'the menu item label wrapper';
          }
          if (MenuItem === type) {
            return 'the menu item component';
          }
        });
        spyOn(cmp, 'normalize').and.returnValue({className: 'something', width: 50, label: 'some text here'});
      });

      describe('structure active', function () {

        beforeEach(function () {
          cmp.props = {value: 'item key'};
          cmp.renderMenuItem('item value', 'item key');
        });

        it('renders the menu item wrapper', function () {
          expect(React.createElement).toHaveBeenCalledWith('div', null, 'some text here');
        });

        it('renders a menu item', function () {
          expect(React.createElement).toHaveBeenCalledWith(MenuItem, {key: 'item key', eventKey: 'item key',
            active: true, className: 'something', width: 50, label: 'some text here'}, 'the menu item label wrapper');
        });

      });

      describe('structure no active', function () {

        beforeEach(function () {
          cmp.props = {value: 'some other key'};
          cmp.renderMenuItem('item value', 'item key');
        });

        it('renders a menu item', function () {
          expect(React.createElement).toHaveBeenCalledWith(MenuItem, {key: 'item key', eventKey: 'item key',
            active: false, className: 'something', width: 50, label: 'some text here'}, 'the menu item label wrapper');
        });

      });

      it('returns a response', function () {
        expect(cmp.renderMenuItem(null, 'item key')).toBe('the menu item component');
      });

    });

    describe('renderMenu', function () {

      beforeEach(function () {
        spyOn(React, 'createElement').and.returnValue('the menu component');
      });

      it('calls map', function () {
        cmp.props = {items: 'the items list'};
        cmp.renderMenu();
        expect(map).toHaveBeenCalledWith('the items list', cmp.renderMenuItem, cmp);
      });

      it('renders the menu', function () {
        cmp.state = 'the component state';
        cmp.renderMenu();
        expect(React.createElement).toHaveBeenCalledWith(Dropdown.Menu, {style: 'the component state'},
          'looping through items:)');
      });

      it('returns a response', function () {
        expect(cmp.renderMenu()).toBe('the menu component');
      });

    });

    describe('render', function () {

      beforeEach(function () {
        spyOn(React, 'createElement').and.returnValue('the combobox component');
        cmp.props = {onChange: 'the change handler'};
        spyOn(cmp, 'renderButton').and.returnValue('the button component');
        spyOn(cmp, 'renderMenu').and.returnValue('the menu component');
      });

      it('calls renderButton', function () {
        cmp.render();
        expect(cmp.renderButton).toHaveBeenCalled();
      });

      it('calls renderMenu', function () {
        cmp.render();
        expect(cmp.renderMenu).toHaveBeenCalled();
      });

      it('renders the combobox component', function () {
        cmp.render();
        expect(React.createElement).toHaveBeenCalledWith(Dropdown, {className: 'al-combo', id: 'al-combo-1',
          onSelect: 'the change handler'}, 'the button component', 'the menu component');
      });

      it('returns a response', function () {
        expect(cmp.render()).toBe('the combobox component');
      });

    });

  });

});
