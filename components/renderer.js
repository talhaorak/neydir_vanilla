import * as THREE from 'three';


export default class Renderer {
  static defaultVertexShader = `
  varying vec2 vUv;
			void main()	{
				vUv = uv;
				gl_Position = vec4( position, 1.0 );
			}
  `;

  static defaultFragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform float frame;
  uniform vec2 mouse;
  varying vec2 vUv;
  void main() {
    vec2 p = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
    vec3 col = 0.5 + 0.5 * cos(time + p.xyx + vec3(0, 2, 4));
    gl_FragColor = vec4(col, 1.0);
  }
  `;

  constructor(rendererContainer) {
    const Size = {
      w: window.innerWidth,
      h: window.innerHeight
    };
    const pixRatio = window.devicePixelRatio;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(Size.w, Size.h);
    renderer.setPixelRatio(pixRatio);
    rendererContainer.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, Size.w / Size.h, 0.1, 1000);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2(Size.w, Size.h).multiplyScalar(pixRatio) },
      frame: { value: 0.0 },
      mouse: { value: new THREE.Vector2(Size.w, Size.h).multiplyScalar(pixRatio) },

    };
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: Renderer.defaultVertexShader,
      fragmentShader: Renderer.defaultFragmentShader
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock(true);


    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.material = material;
    this.mesh = mesh;
    this.clock = clock;
    renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.animate();
  }

  onMouseMove(event) {
    this.material.uniforms.mouse.value.set(event.pageX, window.innerHeight - event.pageY).multiplyScalar(window.devicePixelRatio);
  }

  setShader(shaderCode) {
    this.material = new THREE.ShaderMaterial({
      uniforms: this.material.uniforms,
      vertexShader: Renderer.defaultVertexShader,
      fragmentShader: shaderCode
    });
    this.mesh.material = this.material;
  }

  render() {
    this.material.uniforms.frame.value += 1;

    this.renderer.render(this.scene, this.camera);
  }

  compile(shaderCode) {
    this.setShader(shaderCode);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.material.uniforms.time.value = this.clock.getElapsedTime();
    this.render();
  }

  setHeight(height) {
    this.renderer.setSize(window.innerWidth, height);
  }
}