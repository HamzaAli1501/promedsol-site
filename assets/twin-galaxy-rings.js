(function () {
  'use strict';

  var vertex = 'attribute vec2 p;attribute float a;uniform vec2 r;uniform float t;uniform float arms;uniform float zoom;varying float v;void main(){float q=fract(p.x+t);float angle=q*18.0+p.y*6.2831853/arms;float radius=18.0+q*q*520.0;float wave=sin(angle*2.0+q*12.0)*18.0;vec2 pos=vec2(cos(angle),sin(angle))*(radius+wave*a);float perspective=0.45+q*0.85;pos*=perspective;gl_Position=vec4(pos.x/(r.x*.5),pos.y/(r.y*.5),0.0,1.0);gl_PointSize=max(1.0,zoom*(1.5+a*2.5)*(1.2-q));v=1.0-q;}';
  var fragment = 'precision mediump float;varying float v;void main(){float d=length(gl_PointCoord-.5)*2.0;float alpha=(1.0-smoothstep(.2,1.0,d))*v*.72;vec3 color=mix(vec3(.25,.55,.95),vec3(.82,.92,1.0),v);gl_FragColor=vec4(color*alpha,alpha);}';

  function shader(gl, type, source) {
    var item = gl.createShader(type);
    gl.shaderSource(item, source);
    gl.compileShader(item);
    return item;
  }

  window.initTwinGalaxyRings = function (id) {
    var canvas = document.getElementById(id);
    if (!canvas || canvas.__twinGalaxyRings) return;
    var gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!gl) return;
    canvas.__twinGalaxyRings = true;

    var program = gl.createProgram();
    gl.attachShader(program, shader(gl, gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, shader(gl, gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    gl.useProgram(program);

    var total = 22000;
    var paths = new Float32Array(total * 2);
    var offsets = new Float32Array(total);
    var seed = 918273;
    function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    for (var i = 0; i < total; i++) { paths[i * 2] = random(); paths[i * 2 + 1] = random(); offsets[i] = random() * 2 - 1; }

    var pathBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pathBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, paths, gl.STATIC_DRAW);
    var pathLocation = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(pathLocation);
    gl.vertexAttribPointer(pathLocation, 2, gl.FLOAT, false, 0, 0);

    var offsetBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
    var offsetLocation = gl.getAttribLocation(program, 'a');
    gl.enableVertexAttribArray(offsetLocation);
    gl.vertexAttribPointer(offsetLocation, 1, gl.FLOAT, false, 0, 0);

    var resolution = gl.getUniformLocation(program, 'r');
    var time = gl.getUniformLocation(program, 't');
    var arms = gl.getUniformLocation(program, 'arms');
    var zoom = gl.getUniformLocation(program, 'zoom');
    var start = performance.now();

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    function frame(now) {
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, (now - start) * 0.000018);
      gl.uniform1f(arms, 5.0);
      gl.uniform1f(zoom, Math.min(canvas.width, canvas.height) * 0.006);
      gl.drawArrays(gl.POINTS, 0, total);
      requestAnimationFrame(frame);
    }
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
  };
})();
