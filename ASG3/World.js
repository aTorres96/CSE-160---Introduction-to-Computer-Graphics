// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'uniform bool u_click;\n' +
  'void main() {\n' +
    'if(u_click){\n' +
    '    vec4(1,1,1,1); }\n' +
    'gl_Position =  u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
    'v_UV = a_UV;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +
  'uniform vec4 u_FragColor;\n' +
  'uniform sampler2D u_Sampler0;\n' +
  'uniform sampler2D u_Sampler1;\n' +
  'uniform sampler2D u_Sampler2;\n' +
  'uniform int u_whichTexture;\n' +
  'void main() {\n' +
  '    if (u_whichTexture == -2){\n' + //color
  '        gl_FragColor = u_FragColor; }\n' +
  '    else if (u_whichTexture == -1){\n' +
  '        gl_FragColor = vec4(v_UV,1.0,1.0); }\n' +
  '    else if (u_whichTexture == 0){\n' +
  '        gl_FragColor = texture2D(u_Sampler0, v_UV);}\n' +
  '    else if (u_whichTexture == 1){\n' +
  '        gl_FragColor = texture2D(u_Sampler1, v_UV);}\n' +
  '    else if (u_whichTexture == 2){\n' +
  '        gl_FragColor = texture2D(u_Sampler2, v_UV);}\n' +
  '    else {\n' +
  '        gl_FragColor = vec4(1,.2,.2,1); }\n' +
  '}\n';

// Global UI elements
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
let a_Position;
let a_UV;
let u_FragColor
let u_Size
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_whichTexture;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
var u_click;
var falcor = false;

let g_camera;
let gAnimalGlobalRotation = 0;

var g_shapesList = [];

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

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture){
        console.log('Failed to get u_whichTexture');
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
    
  u_click = gl.getUniformLocation(gl.program, 'u_click');
  if (!u_click){
      console.log('Failed to get u_click');
      return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if (!u_GlobalRotateMatrix){
      console.log("Failed to get the storage location of u_GlobalRotateMatrix");
      return;
  }
    
  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix){
      console.log("Failed to get the storage location of u_ViewMatrix");
      return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix){
      console.log("Failed to get the storage location of u_ProjectionMatrix");
      return;
  }
  
  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if (!u_Sampler0){
      console.log("Failed to get the storage location of u_Sampler0");
      return;
  }
    
  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler1){
      console.log("Failed to get the storage location of u_Sampler1");
      return;
  }
  
  u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2");
  if (!u_Sampler2){
      console.log("Failed to get the storage location of u_Sampler2");
      return;
  }
    
var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function addActionsForHtmlUI(){
    
    document.getElementById('animationOnButton').addEventListener('click', function() {g_Animation = true});
    document.getElementById('animationOffButton').addEventListener('click', function() {g_Animation = false}); 
    
    document.getElementById('falcorOn').addEventListener('click', function() {falcor = true});
    document.getElementById('falcorOff').addEventListener('click', function() {falcor = false});
}

//From WebGl https://sites.google.com/site/webglbook/home/chapter-5?authuser=0 
function initTextures() {
  
  var image = new Image();  // Create the image object
  var image1 = new Image();
  var image2 = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendImageToTEXTURE0( image); };
  image1.onload = function(){ sendImageToTEXTURE1( image1); };
  image2.onload = function(){ sendImageToTEXTURE2( image2); };
  // Tell the browser to load an image
  image.src = 'sky.jpg';
  image1.src = 'minecraft.png';
  image2.src = 'digitalRain256.jpg';
    
  //add more texture loading here
  return true;
}

//From WebGl https://sites.google.com/site/webglbook/home/chapter-5?authuser=0 
function sendImageToTEXTURE0(image) {
  
  var texture = gl.createTexture();   // Create a texture object   
  if(!texture){
      console.log('Failed to create the texture object');
      return false;
  }
    
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendImageToTEXTURE1(image) {
  
  var texture = gl.createTexture();   // Create a texture object   
  if(!texture){
      console.log('Failed to create the texture object');
      return false;
  }
    
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendImageToTEXTURE2(image) {
  
  var texture = gl.createTexture();   // Create a texture object   
  if(!texture){
      console.log('Failed to create the texture object');
      return false;
  }
    
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
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

var g_map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,4,5,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,5,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,5,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,3,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,2,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,2,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,2,3,4,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,2,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
function drawMap(){
    for (x=0;x<32;x++){
        for (y=0;y<32;y++){
            if(x<1 || x==31 || y==0 || y==31){
                for(z = 0; z<8; z++){
                    var wall = new Cube();
                    wall.color = [0.8, 1.0, 1.0, 1.0];
                    wall.textureNum = 2;
                    wall.matrix.translate(0, -.75, 0);
                    wall.matrix.scale(.3, .3, .3);
                    wall.matrix.translate(x-16, z, y-16);
                    wall.render();
                }
            }
            else{
                for(w = 0; w < g_map[x][y];w++){
                    var terrain = new Cube();
                    terrain.textureNum = 1;
                    terrain.matrix.translate(0, -.75, 0);
                    terrain.matrix.scale(.3, .3, .3);
                    terrain.matrix.translate(y-16, w, x-16);
                    terrain.render();
                }
            }
            }
        }
}

function breakBlock() {
    let [atX, atY, atZ] = g_camera.at.elements;
    let bx = Math.floor(atX)+15;
    let bz = Math.floor(atZ)+13;
    if (g_map[bx][bz] > 0) {
        g_map[bz][bx]--;
    }
}
function placeBlock() {
    // debugger;
    let [atX, atY, atZ] = g_camera.at.elements;
    let bx = Math.floor(atX)+15;
    let bz = Math.floor(atZ)+13;
    if (g_map[bz][bx] < 7) {
        g_map[bz][bx]++;
    }
}

function renderScene(){
  
  //check the time at the start of this function
  var startTime = performance.now();
    
  //pass the projection matrix
  var projMat = g_camera.projMat;
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
    
  //pass the view matrix
  var viewMat = g_camera.viewMat;
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(gAnimalGlobalRotation, 0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
  // Clear <canvas>    
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  drawMap();
    
  var ground = new Cube();
  ground.color = [1.0,0.0,0.0,1.0];
  //var bodyCoordMat = new Matrix4(body.matrix);
  ground.textureNum = 1; 
  ground.matrix.translate(0, -0.75, 0.0);
  ground.matrix.scale(10, 0, 10);
  ground.matrix.translate(-.5, -0.5, -0.5);
  ground.render();
    
  var sky = new Cube();
  sky.color = [1.0,0.0,0.0,1.0];
  //var bodyCoordMat = new Matrix4(body.matrix);
  sky.textureNum = 0; 
  //sky.matrix.translate(0, -0.75, 0.0);
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-.5, -0.5, -0.5);
  sky.render();
    
  if (falcor == true){
      Falcor();
  }
 
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

  g_camera = new Camera();
  document.onkeydown = keydown;     
  let lastMouseX = null;
  let lastMouseY = null;
  let isLeftMouseDown = false;
    
  initTextures(gl,0);    

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

//mouse    
document.addEventListener('mousemove', event => {
        if (lastMouseX === null) {
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
            return;
        }

        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;

        if (isLeftMouseDown) {
            if (deltaX > 0.0) {
                g_camera.panRight();
            } else if (deltaX < 0.0) {
                g_camera.panLeft();
            }

            if (deltaY > 0.0) {
                g_camera.panDown();
            } else if (deltaY < 0.0) {
                g_camera.panUp();
            }

        }

        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    });
    document.addEventListener('mousedown', event => {
        if (event.button === 0) {
            isLeftMouseDown = true;
        }
    });

    document.addEventListener('mouseup', event => {
        if (event.button === 0) {
            isLeftMouseDown = false;
        }
    });
    
    
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

function keydown(ev){
   if(ev.keyCode==39 || ev.keyCode == 68){ // Right Arrow or D
      g_camera.right();
   } else if (ev.keyCode==37 || ev.keyCode == 65){ // Left Arrow or A
      g_camera.left();
   } else if (ev.keyCode==38 || ev.keyCode == 87){ // up Arrow or W
      g_camera.forward();
   } else if (ev.keyCode==40 || ev.keyCode == 83){ // down Arrow or S
      g_camera.back();
   } else if (ev.keyCode==81){ // Q
      g_camera.panLeft();
   } else if (ev.keyCode==69){ // E
      g_camera.panRight();
   }else if (ev.keyCode==88){ // X
      breakBlock();
   }else if (ev.keyCode==90){ // z
      placeBlock();
   }
   console.log(ev.keyCode);
   renderScene();
}

function click(ev) {
 
    if (e.buttons == 0) {
        // Left click isn't being pressed.
        return;
    }
    let x = e.clientX; // x coordinate of mouse pos
    let y = e.clientY; // y coordinate of mouse pos
    let rect = e.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height / 2.0) / (canvas.height / 2.0);
    y = (canvas.width / 2.0 - (y - rect.top)) / (canvas.width / 2.0);

    renderScene();
}