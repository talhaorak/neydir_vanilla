import Editor from './components/editor.js';
import Renderer from './components/renderer.js';

// Initialize the editor and renderer
const editor = new Editor(document.getElementById('editor'));
const renderer = new Renderer(document.getElementById('rendererContainer'));

// Load the default shader code into the editor
fetch('./shaders/default.glsl')
  .then(response => response.text())
  .then(code => editor.setCode(code));

// Compile and render the shader code whenever it changes
editor.on('change', code => {
  try {
    renderer.compile(code);
    renderer.render();
  } catch (error) {
    console.error(error);
  }
});

// Adjust the sizes of the editor and renderer when the window is resized
window.addEventListener('resize', () => {
  const height = window.innerHeight;
  editor.setHeight(height / 2);
  renderer.setHeight(height / 2);
});