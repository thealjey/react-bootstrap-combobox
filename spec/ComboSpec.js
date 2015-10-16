/* @flow */

import React from 'react/lib/ReactWithAddons';
import ReactDOM from 'react-dom';
import {Button, Dropdown, MenuItem} from 'react-bootstrap';
import proxyquire from 'proxyquire';

describe('Combo', function () {
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
      if (!Combo) {
        return;
      }
      spyOn(Combo.prototype.renderMenuItem, 'bind').and.returnValue('bound renderMenuItem');
      cmp = new Combo({something: 'here'});
    });

    it('inherits React.Component', function () {
      expect(cmp instanceof React.Component).toBeTruthy();
    });

    it('passes on the props', function () {
      if (!cmp) {
        return;
      }
      expect(cmp.props).toEqual({something: 'here'});
    });

    it('setup a component id', function () {
      if (!cmp) {
        return;
      }
      expect(cmp.id).toBe('al-combo-1');
    });

    it('sets the default viewportHeight', function () {
      if (!cmp) {
        return;
      }
      expect(cmp.viewportHeight).toBe(0);
    });

    it('initializes state', function () {
      if (!cmp) {
        return;
      }
      expect(cmp.state).toEqual({maxHeight: null});
    });

  });

  describe('original bind', function () {

    beforeEach(function () {
      if (!Combo) {
        return;
      }
      cmp = new Combo({something: 'here'});
    });

    it('shouldComponentUpdate', function () {
      if (!cmp) {
        return;
      }
      spyOn(React.addons, 'shallowCompare').and.returnValue('shallowCompare result');
      expect(cmp.shouldComponentUpdate('props', 'state')).toBe('shallowCompare result');
      expect(React.addons.shallowCompare).toHaveBeenCalledWith(cmp, 'props', 'state');
    });

    describe('onResize', function () {

      beforeEach(function () {
        spyOn(cmp, 'setState');
      });

      it('unchanged', function () {
        if (!cmp || !window) {
          return;
        }
        window.innerHeight = 0;
        cmp.onResize();
        expect(cmp.setState).not.toHaveBeenCalled();
      });

      it('changed', function () {
        if (!cmp || !window) {
          return;
        }
        const getBoundingClientRect = jasmine.createSpy('getBoundingClientRect').and.returnValue({bottom: 50});

        spyOn(ReactDOM, 'findDOMNode').and.returnValue({getBoundingClientRect});
        window.innerHeight = 80;
        cmp.onResize();
        expect(cmp.viewportHeight).toBe(80);
        expect(ReactDOM.findDOMNode).toHaveBeenCalledWith(cmp);
        expect(getBoundingClientRect).toHaveBeenCalled();
        expect(cmp.setState).toHaveBeenCalledWith({maxHeight: 25});
      });

    });

    describe('componentDidMount', function () {

      beforeEach(function () {
        if (!cmp) {
          return;
        }
        spyOn(cmp, 'onResize');
        cmp.componentDidMount();
      });

      it('calls handleResize', function () {
        if (!cmp) {
          return;
        }
        expect(cmp.onResize).toHaveBeenCalled();
      });

      it('sets up a resize listener on the window object', function () {
        if (!cmp) {
          return;
        }
        expect(addEventListener).toHaveBeenCalledWith('resize', cmp.onResize);
      });

    });

    describe('componentWillUnmount', function () {

      beforeEach(function () {
        if (!cmp) {
          return;
        }
        cmp.componentWillUnmount();
      });

      it('removes the resize listener from the window object', function () {
        if (!cmp) {
          return;
        }
        expect(removeEventListener).toHaveBeenCalledWith('resize', cmp.onResize);
      });

    });

    describe('normalize', function () {

      it('converts to divider', function () {
        if (!cmp) {
          return;
        }
        expect(cmp.normalize('-')).toEqual({divider: true});
      });

      it('converts to normal items', function () {
        if (!cmp) {
          return;
        }
        expect(cmp.normalize('some text here')).toEqual({label: 'some text here'});
      });

      it('just passes on everything else unchanged', function () {
        if (!cmp) {
          return;
        }
        const value = {label: 'some text here'};

        expect(cmp.normalize(value)).toBe(value);
      });

    });

    describe('getLabel', function () {

      beforeEach(function () {
        if (!cmp) {
          return;
        }
        cmp.props.items = {a: 'item 1', b: 'item 2'};
        cmp.props.value = 'a';
        spyOn(cmp, 'normalize').and.returnValue({label: 'some text here'});
      });

      it('returns the normalized label', function () {
        if (!cmp) {
          return;
        }
        expect(cmp.getLabel()).toBe('some text here');
      });

    });

    describe('renderButton', function () {

      beforeEach(function () {
        spyOn(React, 'createElement').and.callFake(function (type) {
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
          if (!cmp) {
            return;
          }
          cmp.renderButton();
        });

        it('calls getLabel', function () {
          if (!cmp) {
            return;
          }
          expect(cmp.getLabel).toHaveBeenCalled();
        });

        it('renders the button wrapper', function () {
          expect(React.createElement).toHaveBeenCalledWith('div', null, 'some text here', jasmine.objectContaining({
            type: 'span',
            props: {className: 'caret'}
          }));
        });

        it('renders the button', function () {
          expect(React.createElement).toHaveBeenCalledWith(Button,
            {block: true, bsRole: 'toggle', className: 'dropdown-toggle'}, 'the button label wrapper');
        });

      });

      it('returns a response', function () {
        if (!cmp) {
          return;
        }
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
          if (!cmp) {
            return;
          }
          cmp.renderMenuItem('item value', 'item key');
        });

        it('calls normalize', function () {
          if (!cmp) {
            return;
          }
          expect(cmp.normalize).toHaveBeenCalledWith('item value');
        });

        it('renders a divider', function () {
          expect(React.createElement).toHaveBeenCalledWith(MenuItem, {key: 'item key', divider: true});
        });

      });

      it('returns a response', function () {
        if (!cmp) {
          return;
        }
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
          if (!cmp) {
            return;
          }
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
          if (!cmp) {
            return;
          }
          cmp.props = {value: 'some other key'};
          cmp.renderMenuItem('item value', 'item key');
        });

        it('renders a menu item', function () {
          expect(React.createElement).toHaveBeenCalledWith(MenuItem, {key: 'item key', eventKey: 'item key',
            active: false, className: 'something', width: 50, label: 'some text here'}, 'the menu item label wrapper');
        });

      });

      it('returns a response', function () {
        if (!cmp) {
          return;
        }
        expect(cmp.renderMenuItem(null, 'item key')).toBe('the menu item component');
      });

    });

    describe('renderMenu', function () {

      beforeEach(function () {
        spyOn(React, 'createElement').and.returnValue('the menu component');
      });

      it('calls map', function () {
        if (!cmp) {
          return;
        }
        cmp.props = {items: 'the items list'};
        cmp.renderMenu();
        expect(map).toHaveBeenCalledWith('the items list', cmp.renderMenuItem, cmp);
      });

      it('renders the menu', function () {
        if (!cmp) {
          return;
        }
        cmp.state = 'the component state';
        cmp.renderMenu();
        expect(React.createElement).toHaveBeenCalledWith(Dropdown.Menu, {style: 'the component state'},
          'looping through items:)');
      });

      it('returns a response', function () {
        if (!cmp) {
          return;
        }
        expect(cmp.renderMenu()).toBe('the menu component');
      });

    });

    describe('render', function () {

      beforeEach(function () {
        if (!cmp) {
          return;
        }
        spyOn(React, 'createElement').and.returnValue('the combobox component');
        cmp.props = {onChange: 'the change handler'};
        spyOn(cmp, 'renderButton').and.returnValue('the button component');
        spyOn(cmp, 'renderMenu').and.returnValue('the menu component');
      });

      it('calls renderButton', function () {
        if (!cmp) {
          return;
        }
        cmp.render();
        expect(cmp.renderButton).toHaveBeenCalled();
      });

      it('calls renderMenu', function () {
        if (!cmp) {
          return;
        }
        cmp.render();
        expect(cmp.renderMenu).toHaveBeenCalled();
      });

      it('renders the combobox component', function () {
        if (!cmp) {
          return;
        }
        cmp.render();
        expect(React.createElement).toHaveBeenCalledWith(Dropdown, {className: 'al-combo', id: 'al-combo-1',
          onSelect: 'the change handler'}, 'the button component', 'the menu component');
      });

      it('returns a response', function () {
        if (!cmp) {
          return;
        }
        expect(cmp.render()).toBe('the combobox component');
      });

    });

  });

});
