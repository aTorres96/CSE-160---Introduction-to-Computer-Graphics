// DrawRectangle.js
var ctx;
var canvas;
function main() {
// Retrieve <canvas> element <- (1)
 canvas = document.getElementById('example');
 if (!canvas) {
   console.log('Failed to retrieve the <canvas> element');
   return;
 }
 // Get the rendering context for 2DCG <- (2)

 ctx = canvas.getContext('2d');
 ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; //set a blue color
 ctx.fillRect(0, 0, 400, 400); // FIll a rectangle with the color

 var v1 = new Vector3([2.25, 2.25, 0]);
 
 drawVector(v1, 'rgba(255, 0, 0, 1.0)');
}

function drawVector(v, color){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(canvas.height/2+v.elements[0]*20, canvas.height/2-v.elements[1]*20);
    ctx.lineWidth = 1;
    ctx.stroke();
}

function handleDrawEvent(){
    var v1x = document.getElementById('v1x').value;
    var v1y = document.getElementById('v1y').value;
    var v1 = new Vector3([v1x, v1y, 0.0]);
    var v2x = document.getElementById('v2x').value;
    var v2y = document.getElementById('v2y').value;
    var v2 = new Vector3([v2x, v2y, 0.0]);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
    drawVector(v1, 'rgba(255, 0, 0, 1.0)');
    drawVector(v2, 'rgba(0, 0, 255, 1.0)');
}

function handleDrawOperationEvent(){
    var v1x = document.getElementById('v1x').value;
    var v1y = document.getElementById('v1y').value;
    var v1 = new Vector3([v1x, v1y, 0.0]);
    var v2x = document.getElementById('v2x').value;
    var v2y = document.getElementById('v2y').value;
    var v2 = new Vector3([v2x, v2y, 0.0]);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
    drawVector(v1, 'rgba(255, 0, 0, 1.0)');
    drawVector(v2, 'rgba(0, 0, 255, 1.0)');

    var op = document.getElementById('op').value;
    
    if(op == 'Add'){
        v1.add(v2);
        drawVector(v1, 'rgba(0, 255, 0, 1.0)');
    }
    else if(op == 'Sub'){
        v1.sub(v2);
        drawVector(v1, 'rgba(0, 255, 0, 1.0)');
    }
    else if(op == 'Mul'){
        var s = document.getElementById('scalar').value;
        v1.mul(s);
        v2.mul(s);
        drawVector(v1, 'rgba(0, 255, 0, 1.0)');
        drawVector(v2, 'rgba(0, 255, 0, 1.0)');
    }
    else if(op == 'Div'){
        var s = document.getElementById('scalar').value;
        v1.div(s);
        v2.div(s);
        drawVector(v1, 'rgba(0, 255, 0, 1.0)');
        drawVector(v2, 'rgba(0, 255, 0, 1.0)');
    }
    else if(op == 'Mag'){
        console.log("Magnitude v1: "+ v1.magnitude());
        console.log("Magnitude v2: "+ v2.magnitude());
    }
    else if(op == 'Norm'){
        var v1n = v1.normalize();
        var v2n = v2.normalize();
        drawVector(v1n, 'rgba(0, 255, 0, 1.0)');
        drawVector(v2n, 'rgba(0, 255, 0, 1.0)');
    }
    else if(op == 'Ang'){
        console.log("Angle: " + (angleBetween(v1, v2)).toFixed(2));
    }
    else if(op == 'Area'){
        console.log("Area of this triangle: " + (areaTriangle(v1, v2)).toFixed(2));
    }
function angleBetween(v1, v2){
    var v1m = v1.magnitude();
    var v2m = v2.magnitude();
    var d = Vector3.dot(v1, v2);
    //Radian
    var a = Math.acos(d/(v1m*v2m)); 
    a *= 180/Math.PI;
    return a;
}
    
function areaTriangle(v1,v2){
    var a = Vector3.cross(v1, v2);
    var v1 = new Vector3([a[0], a[1], a[2]]);
    var at = v1.magnitude()/2;
    return at;
}
    
}