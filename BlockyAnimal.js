// ColoredPoint.js (c) 2012 matsuda

// Global UI elements
let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_hGlobalAngle = 20;
let g_yellowAngle = 0;
let g_headAngle = 0;
let g_shoulderAngle = 0;
let g_jawAngle = 0;
let g_Animation = false;
let g_magentaAnimation = false;
let g_globalAngleX = 0;
let g_globalAngleY = 0;

let canvas;
let gl;
let a_position;
let u_FragColor
let u_Size
let u_ModelMatrix;

var g_shapesList = [];


// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position =  u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

function drag(ev){
   let [x, y] = connectVariablesToGLSL(ev);
   g_globalAngleX = x * 180;
   g_globalAngleY = y * 180;
}

function setUpWebGL(){
  canvas = document.getElementById('webgl');
 
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  } 
    
  gl.enable(gl.DEPTH_TEST);
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
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
      console.log('Failed to get u_ModelMatrix');
      return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if (!u_GlobalRotateMatrix){
      console.log("Failed to get the storage location of u_GlobalRotateMatrix");
      return;
  }
    
var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function addActionsForHtmlUI(){

    //slides
    document.getElementById('shoulderSlide').addEventListener('mousemove', function() {g_shoulderAngle = this.value; renderScene();});
    
    document.getElementById('jawSlide').addEventListener('mousemove', function() {g_jawAngle = this.value; renderScene();});
    
    document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderScene();});

    document.getElementById('angleXSlider').addEventListener('mousemove', function () { g_globalAngleX = this.value; renderAllShapes(); })
    document.getElementById('angleYSlider').addEventListener('mousemove', function () { g_globalAngleY = this.value; renderAllShapes(); });
    
    document.getElementById('animationOnButton').addEventListener('click', function() {g_Animation = true});
    document.getElementById('animationOffButton').addEventListener('click', function() {g_Animation = false});    
    
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
function updateAnimationAngles(){
    if (g_Animation){
        g_AnimationAngle = (45*Math.sin(g_seconds));
    }
}

function renderScene(){
  
  //check the time at the start of this function
  var startTime = performance.now();
    
  // Clear <canvas>    
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let globalRotMat = new Matrix4().rotate(-g_globalAngleX,0,1,0);
  globalRotMat.rotate(g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
  //new body cube
  var body = new Cube();
  body.color = [1,1,.5];
  body.matrix.translate(-0.46, -0.01, -0.07);
  var bodyCoordMat = new Matrix4(body.matrix);
  //body.matrix.rotate(-5,1,0,0);
  if (g_Animation){
    body.matrix.rotate(-3*Math.sin(g_seconds), 0,0,1);
  } 
  body.matrix.scale(0.26, .25, .25);
  hipsMat = new Matrix4(body.matrix);
  body.render();
    
  var lLeg = new Cube();
  lLeg.color=[0.6, 0.6, 0.9, 1.0];
  lLeg.matrix = hipsMat;
  lLeg.matrix.translate(0.25, -0.4, -.1);
  lLeg.matrix.scale(.5, .8, .25);
  if (g_Animation){
    lLeg.matrix.rotate(3*Math.sin(g_seconds), 0,0,1);
  }
  legMat = new Matrix4(lLeg.matrix);
  lLeg.render();
    
  var rLeg = new Cube();
  rLeg.color=[0.6, 0.6, 0.9, 1.0];
  rLeg.matrix = legMat;
  rLeg.matrix.translate(0, 0, 3.8);
  rLegMat = new Matrix4(rLeg.matrix);
  rLeg.render();    
    
  var rFoot = new Cube();
  rFoot.color=[0.5, 0.6, 0.9, 1.0];
  rFoot.matrix = legMat;
  rFoot.matrix.translate(0, 0, 0.1);
  rFoot.matrix.scale(2, .4, 1);
  if (g_Animation){
    rFoot.matrix.rotate(3*Math.sin(g_seconds), 0,0,1);
  }
  rFootMat = new Matrix4(rLeg.matrix);
  rFoot.render(); 
    
  var lFoot = new Cube();
  lFoot.color=[0.5, 0.6, 0.9, 1.0];
  lFoot.matrix = rFootMat;
  lFoot.matrix.translate(0, 0, -4);
  lFoot.render(); 
    
  var torso1 = new Cube();
  torso1.color = [0.6,0.6,0.9,1.0];
  torso1.matrix = bodyCoordMat;
  torso1.matrix.translate(0.25, 0.01, 0.01);
  if (g_Animation){
    torso1.matrix.rotate(-3*Math.sin(g_seconds), 0,0,1);
  }
  torso1.matrix.scale(0.25, .25, .23);
  torso1.render();
    
  var torso2 = new Cube();
  torso2.color = [0.6,0.6,0.9,1.0];
  torso2.matrix = bodyCoordMat;
  //torso2.matrix.rotate(-5,0,0,1);
  torso2.matrix.scale(1, 1.1, 1.2);
  torso2.matrix.translate(.9, -.05, -.08);
  if (g_Animation){
    torso2.matrix.rotate(3*Math.sin(g_seconds), 0,0,1);
  }
  torso2.render();

  var shoulder = new Cube();
  shoulder.color = [0.6,0.6,0.9,1.0];
  shoulder.matrix = bodyCoordMat;
  //shoulder.matrix.rotate(-5,0,0,1);
  shoulder.matrix.scale(.8, .9, .9);
  shoulder.matrix.translate(1.2, .05, 0.05);
  if (g_Animation){
    shoulder.matrix.rotate(3*Math.sin(g_seconds), 0,0,1);
  }
  else{
      shoulder.matrix.rotate(g_shoulderAngle, 0, 0, 1);
  }
  bodyCoordMat = new Matrix4(shoulder.matrix)
  shoulderMat = new Matrix4(shoulder.matrix)
  shoulder.render(); 
    
  var lArm = new Cube();
  lArm.color=[0.6, 0.6, 0.9, 1.0];
  lArm.matrix = shoulderMat;
  lArm.matrix.translate(0.25, -0.45, -.1);
  lArm.matrix.scale(.5, .8, .25);
  if (g_Animation){
    lArm.matrix.rotate(3*Math.sin(g_seconds), 0,0,1);
  }
  armMat = new Matrix4(lArm.matrix);
  lArm.render();
    
  var rArm = new Cube();
  rArm.color=[0.6, 0.6, 0.9, 1.0];
  rArm.matrix = armMat;
  rArm.matrix.translate(0, 0, 3.8);
  //rMat = new Matrix4(r.matrix);
  rArm.render();
    
  var rPaw = new Cube();
  rPaw.color=[0.5, 0.6, 0.9, 1.0];
  rPaw.matrix = armMat;
  rPaw.matrix.translate(0, 0, 0.1);
  rPaw.matrix.scale(2, .4, 1);
  if (g_Animation){
    rPaw.matrix.rotate(5*Math.sin(g_seconds), 0,0,1);
  }
  rPawMat = new Matrix4(rPaw.matrix);
  //rFoot.matrix.rotate(1, 45, 0, 1);
  rPaw.render(); 
    
  var lPaw = new Cube();
  lPaw.color=[0.5, 0.6, 0.9, 1.0];
  lPaw.matrix = rPawMat;
  lPaw.matrix.translate(0, 0, -4);
  //lFoot.matrix.scale(2, .5, 1);
  lPaw.render();  
    
  var neck = new Cube();
  neck.color = [0.6,0.6,0.9,1.0];
  neck.matrix = bodyCoordMat;
  //neck.matrix.rotate(15,0,0,1);
  neck.matrix.scale(.8, .9, .9);
  neck.matrix.translate(1.2, .05, 0.05);
  if (g_Animation){
    neck.matrix.rotate(3*Math.sin(g_seconds), 0,0,1);
  }
  else{
      neck.matrix.rotate(g_headAngle, 0, 0, 1);
  }
  //bodyCoordMat = new Matrix4(neck.matrix);
  neckMat = new Matrix4(neck.matrix);
  neck.render();

  var bjaw = new Cube();
  bjaw.color = [0.5,0.6,0.9,1.0];
  bjaw.matrix = bodyCoordMat;
  //bjaw.matrix.rotate(-5,1,0,0);
  bjaw.matrix.scale(1.5, .5, 1.2);
  bjaw.matrix.translate(.5, -.1, -0.1);
  bodyCoordMat = new Matrix4(bjaw.matrix)
  if(g_Animation){
      bjaw.matrix.rotate(2*Math.sin(g_seconds), 0, 0, 1);
  }else{
      bjaw.matrix.scale(1, .8, 1)
      bjaw.matrix.rotate(-g_jawAngle, 0, 0, 1)
  }
  bjaw.render();
    
  var tjaw = new Cube();
  tjaw.color = [0.6,0.6,0.9,1.0];
  tjaw.matrix = bodyCoordMat;
  tjaw.matrix.scale(1.5, .75, 1.2);
  tjaw.matrix.translate(-.25, 1, -0.075);
  bodyCoordMat = new Matrix4(tjaw.matrix)
  tjaw.render();
    
  var lEye = new Cube();
  lEye.color = [0.6, 0.6, 0.9, 1.0];
  lEye.matrix = neckMat;
  neckMat = new Matrix4(lEye.matrix)
  lEye.matrix.translate(.8, .75, .6);
  lEye.matrix.scale(.5, .5, .5);
  eyeMat = new Matrix4(lEye.matrix);
  lEye.render();
    
  var rEye = new Cube();
  rEye.color = [0.6, 0.6, 0.9, 1.0];
  rEye.matrix = neckMat;
  rEye.matrix.translate(.8, .75, -.1);
  rEye.matrix.scale(.5, .5, .5);
  rEye.render();
    
  var lEyeBall = new Cube();
  lEyeBall.color = [0, 0, 0, 1.0];
  lEyeBall.matrix = eyeMat;
  lEyeBall.matrix.translate(.75, .25, .25);
  lEyeBall.matrix.scale(.5, .5, .5);
  eyeBallMat = new Matrix4(lEyeBall.matrix);
  lEyeBall.render();
  
  var rEyeBall = new Cube();
  rEyeBall.color = [0, 0, 0, 1.0];
  rEyeBall.matrix = eyeBallMat;
  rEyeBall.matrix.translate(0, 0, -2.8);
  //lEyeBall.matrix.scale(.5, .5, .5);
  rEyeBall.render();
  
  //tail
  //Modified the professors loop.
  var k = 7;
  for (var i = 1; i < k; i++){
      var t = new Cube();
      t.tail = true;
      t.color = [0.5, 0.6, 0.9, 1];
      t.matrix.translate((.52*i/k-1.0), 0, -i/100);
      if (g_Animation){     
        t.matrix.rotate(-4*Math.sin(g_seconds)+3*Math.cos(g_seconds),0, 0, 1);
        if(i%2 == 1){
          t.matrix.translate(0, (-4*Math.sin(g_seconds)+3*Math.cos(g_seconds))/500,0);
        }
          //t.matrix.translate(0, -(-4*Math.sin(g_seconds)+3*Math.cos(g_seconds))/500,0);        
      }
      t.matrix.scale(.1, (.5/k)+2*i/75, (.5/k)+2*i/75);
      t.render();
  }
  // check the time at the end of the funciton and show on webpage
 
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + "fps: " + Math.floor(10000/duration), "numdot");
}


function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;        
    }
    htmlElm.innerHTML =  text;
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

function main() {
  
  // Retrieve <canvas> element
  setUpWebGL();

  // Initialize shaders
  connectVariablesToGLSL();
    
  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { drag(ev) } };
    

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  requestAnimationFrame(tick);
}

function tick(){
    g_seconds=performance.now()/1000.0-g_startTime;
    console.log(g_seconds);
    
    updateAnimationAngles();
    
    renderScene();
      
    requestAnimationFrame(tick);
}