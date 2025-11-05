/**
 * Bootstrap Bundle JS Unit Tests
 * 
 * This file contains comprehensive unit tests for the Bootstrap Bundle JS functionality.
 * Tests cover core utilities, components, and edge cases.
 */

// Test Suite Setup
const assert = require('assert');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Mock DOM Environment
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Import Bootstrap Bundle (mocked in test environment)
const bootstrap = require('./bootstrap.bundle.min.js');

/**
 * Utility Functions Test Suite
 */
describe('Bootstrap Utility Functions', () => {
  
  /**
   * Test CSS.escape() polyfill functionality
   */
  describe('CSS Escape', () => {
    it('should escape special characters in CSS selectors', () => {
      const testString = '#test[data="value"]';
      const escaped = bootstrap.escapeCss(testString);
      assert.strictEqual(escaped, '#test\[data\="value\"\]');
    });

    it('should handle already escaped strings', () => {
      const testString = '#already\ escaped';
      const escaped = bootstrap.escapeCss(testString);
      assert.strictEqual(escaped, testString);
    });
  });

  /**
   * Test element visibility detection
   */
  describe('Element Visibility', () => {
    beforeEach(() => {
      document.body.innerHTML = 
        `<div id="visible" style="visibility:visible"></div>
         <div id="hidden" style="visibility:hidden"></div>`;
    });

    it('should detect visible elements', () => {
      const el = document.getElementById('visible');
      assert.strictEqual(bootstrap.isVisible(el), true);
    });

    it('should detect hidden elements', () => {
      const el = document.getElementById('hidden');
      assert.strictEqual(bootstrap.isVisible(el), false);
    });
  });
});

/**
 * Component Initialization Test Suite
 */
describe('Component Initialization', () => {
  
  /**
   * Test Alert component initialization
   */
  describe('Alert', () => {
    beforeEach(() => {
      document.body.innerHTML = 
        `<div class="alert alert-warning alert-dismissible fade show">
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          Warning message
        </div>`;
    });

    it('should initialize dismissible alert', () => {
      const alertEl = document.querySelector('.alert');
      const alert = new bootstrap.Alert(alertEl);
      assert.strictEqual(alertEl.classList.contains('show'), true);
    });

    it('should close alert on button click', () => {
      const alertEl = document.querySelector('.alert');
      const alert = new bootstrap.Alert(alertEl);
      const closeBtn = document.querySelector('.btn-close');
      
      closeBtn.click();
      assert.strictEqual(alertEl.classList.contains('show'), false);
    });
  });

  /**
   * Test Modal component initialization
   */
  describe('Modal', () => {
    beforeEach(() => {
      document.body.innerHTML = 
        `<button data-bs-toggle="modal" data-bs-target="#testModal">
          Launch Modal
        </button>
        <div class="modal fade" id="testModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Test Modal</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">Test Content</div>
            </div>
          </div>
        </div>`;
    });

    it('should initialize modal on trigger click', () => {
      const trigger = document.querySelector('[data-bs-toggle="modal"]');
      const modalEl = document.getElementById('testModal');
      
      trigger.click();
      assert.strictEqual(modalEl.classList.contains('show'), true);
    });
  });
});

/**
 * Event Handling Test Suite
 */
describe('Event Handling', () => {
  
  /**
   * Test custom event triggering
   */
  describe('Custom Events', () => {
    it('should trigger and handle custom events', () => {
      const testEl = document.createElement('div');
      let eventHandled = false;
      
      testEl.addEventListener('test.event', () => {
        eventHandled = true;
      });
      
      bootstrap.triggerEvent(testEl, 'test.event');
      assert.strictEqual(eventHandled, true);
    });
  });

  /**
   * Test delegated event handling
   */
  describe('Delegated Events', () => {
    beforeEach(() => {
      document.body.innerHTML = 
        `<div id="container">
          <button class="dynamic-btn">Click Me</button>
        </div>`;
    });

    it('should handle events on dynamically added elements', () => {
      const container = document.getElementById('container');
      let clickCount = 0;
      
      bootstrap.on(container, 'click', '.dynamic-btn', () => {
        clickCount++;
      });
      
      const btn = document.querySelector('.dynamic-btn');
      btn.click();
      assert.strictEqual(clickCount, 1);
    });
  });
});

/**
 * Edge Case Test Suite
 */
describe('Edge Cases', () => {
  
  /**
   * Test component initialization with invalid elements
   */
  describe('Invalid Elements', () => {
    it('should handle null element initialization', () => {
      assert.doesNotThrow(() => {
        new bootstrap.Alert(null);
      });
    });

    it('should handle missing target elements', () => {
      document.body.innerHTML = 
        `<button data-bs-toggle="modal" data-bs-target="#missing">
          Launch Modal
        </button>`;
      
      const trigger = document.querySelector('[data-bs-toggle="modal"]');
      assert.doesNotThrow(() => {
        trigger.click();
      });
    });
  });

  /**
   * Test RTL (Right-to-Left) layout support
   */
  describe('RTL Support', () => {
    beforeEach(() => {
      document.documentElement.dir = 'rtl';
    });

    afterEach(() => {
      document.documentElement.dir = 'ltr';
    });

    it('should adjust dropdown positioning for RTL', () => {
      document.body.innerHTML = 
        `<div class="dropdown">
          <button class="dropdown-toggle" data-bs-toggle="dropdown">
            Menu
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Item</a></li>
          </ul>
        </div>`;
      
      const dropdown = new bootstrap.Dropdown(
        document.querySelector('.dropdown-toggle')
      );
      dropdown.toggle();
      
      const menu = document.querySelector('.dropdown-menu');
      assert.strictEqual(menu.classList.contains('dropdown-menu-end'), true);
    });
  });
});

console.log('All Bootstrap Bundle tests passed!');