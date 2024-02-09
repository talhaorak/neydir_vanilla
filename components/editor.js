// Use monaco-editor to create a shader editor

import * as monaco from 'monaco-editor';

export default class Editor {
  constructor(container) {
    this.editor = monaco.editor.create(container, {
      value: '',
      language: 'glsl',
      theme: 'vs-dark',
      height: '100%',
    });
    this.editor.onDidChangeModelContent(() => {
      this.emit('change', this.editor.getValue());
    });
  }

  setCode(code) {
    this.editor.setValue(code);
  }

  on(event, callback) {
    this.events = this.events || {};
    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events && this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  setHeight(height) {
    this.editor.layout({ height });
  }
}