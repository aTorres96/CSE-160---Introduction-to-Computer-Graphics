// ColoredPoint.js (c) 2012 matsuda
//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const WAVE = 3;

// Global UI elements
let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType=POINT;
let g_selectedSegment = 10;

let canvas;
let gl;
let a_position;
let u_FragColor
let u_Size

var g_shapesList = [];

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

function setUpWebGL(){
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas); 
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }  
}

function connectVariablesToGLSL(){
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
    
  // Get the storage location of u_FragColor
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
  }
}

function addActionsForHtmlUI(){
    //Color buttons
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById('clearButton').onclick = function() {g_shapesList = []; renderShapes();};
    
    document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
    document.getElementById('triangleButton').onclick = function() {g_selectedType=TRIANGLE};
    document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
    document.getElementById('waveButton').onclick = function() {drawWave(); };
    //slides
    document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });

    
    document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value; });
    document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegment = this.value; });
}

function click(ev) {
 
  let [x, y] = convertCoordinates(ev);

  // create and store new point
  let point;
  if (g_selectedType==POINT){
      point = new Point();
  } else if (g_selectedType==TRIANGLE) {
      point = new Triangle();
  } else if (g_selectedType==CIRCLE) {
        point = new Circle();
        point.segmentCount = g_selectedSegment;
  } else {
      drawWave();
  }
  point.position=[x, y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  renderShapes();
}

function convertCoordinates(ev){
  
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderShapes(){
    // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

function drawWave(){
    var t0 = new Wave;
    t0.color = [0.0, 0.0, 1.0, 1.0].slice();
    t0.position = [0.0, 0.0];
    t0.size = 20;
    //t0.base = true;
    g_shapesList.push(t0);
    /*var t0 = new Wave;
    t0.color = [0.0, 0.0, 1.0, 1.0].slice();
    t0.position = [-1.0, -0.5];
    t0.size = 20;
    t0.base = true;
    g_shapesList.push(t0);
    
    
    var t1 = new Wave;
    t1.color = [0.0, 0.2, 0.8, 1.0].slice();
    t1.position = [-1.0, -0.5];
    t1.size = 20;
    t1.secnd = true;
    g_shapesList.push(t1);

    var t2 = new Wave;
    t2.color = [0.0, 0.2, 0.6, 1.0].slice();
    t2.position = [-1.0, -0.5];
    t2.size = 20;
    t2.third = true;
    g_shapesList.push(t2);

    var t3 = new Wave;
    t3.color = [0.2, 0.4, 0.7, 1.0].slice();
    t3.position = [-1.0, -0.5];
    t3.size = 20;
    t3.fourth = true;
    g_shapesList.push(t3);
    
    var t4 = new Wave;
    t4.color = [0.3, 0.5, 0.8, 1.0].slice();
    t4.position = [-1.0, -0.5];
    t4.size = 20;
    t4.fifth = true;
    g_shapesList.push(t4);*/
    renderShapes();
}

//function waveCoord(x, y){
  //var rect = 
  //x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  //y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  //return([x,y]);
//}

function main() {
  
  // Retrieve <canvas> element
  setUpWebGL();

  // Initialize shaders
  connectVariablesToGLSL();
    
  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}