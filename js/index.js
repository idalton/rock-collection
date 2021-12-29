// forked from  then github.com/scaleflex/js-cloudimage-360-view

/* 
MIT License

Copyright (c) 2019 scaleflex

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// import './core-js/features/array/for-each';
// import './core-js/features/array/filter';
// import './core-js/features/array/includes';
import CI360Viewer from './ci360.service.js';


function init() {
  const viewers = [];
  const view360Array = document.querySelectorAll('.cloudimage-360:not(.initialized)');

  [].slice.call(view360Array).forEach(container => { viewers.push(new CI360Viewer(container)); });

  window.CI360._viewers = viewers;
}

function destroy() {
  if (isNoViewers()) return;

  window.CI360._viewers.forEach(viewer => { viewer.destroy(); });

  window.CI360._viewers = [];
}

function getActiveIndexByID(id) {
  if (isNoViewers()) return;

  let currentViewer = window.CI360._viewers.filter(viewer => viewer.id === id)[0];

  return currentViewer && (currentViewer.activeImage - 1);
}

function isNoViewers() {
  return !(window.CI360._viewers && window.CI360._viewers.length > 0);
}

window.CI360 = window.CI360 || {};
window.CI360.init = init;
window.CI360.destroy = destroy;
window.CI360.getActiveIndexByID = getActiveIndexByID;

if (!window.CI360.notInitOnLoad) {
  init();
}