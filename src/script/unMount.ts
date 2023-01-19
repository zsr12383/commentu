import ReactDOM from 'react-dom';
import React from 'react';
import { isValidURL } from '../common/URL';

(() => {
  if (!isValidURL(document.location.href)) return;
  const root = document.getElementById('commentu');
  if (root) root.remove();
})();
