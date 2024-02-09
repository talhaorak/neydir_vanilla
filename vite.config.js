import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
    plugins: [
        monacoEditorPlugin.default({
            // Specify the language workers you need
            languages: ['glsl']
        })
    ]
});
