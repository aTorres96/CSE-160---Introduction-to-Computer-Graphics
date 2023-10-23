class Wave{
    constructor(){
        this.type='triangle';
        this.position= [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.base = false;
        this.secnd = false;
        this.third = false;
        this.fourth = false;
        this.fifth = false;
    }
    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        var base = this.base;
        var secnd = this.secnd;
        var third = this.third;
        var fourth = this.fourth;
        var fifth = this.fifth;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the color of a paint to u_FragColor variable
        gl.uniform1f(u_Size, size);
        // Draw
        var d = this.size/200.0; //delta
        var inc = 0.1;
        //standard right triangle
        /*if (base) {
            //squares
            for(var i = 0.0; i < 2.0; i+=0.1){
              drawTriangle( [xy[0]+i, xy[1], xy[0]+d+i, xy[1], xy[0]+i, xy[1]+d]);
              drawTriangle( [xy[0]+d+i, xy[1]+d, xy[0]+d+i, xy[1], xy[0]+i, xy[1]+d]);
            }
            for(var j = 0.4; j < 0.7; j+=0.1){
              drawTriangle( [xy[0]+j, xy[1]+0.1, xy[0]+d+j, xy[1]+0.1, xy[0]+j, xy[1]+d+0.1]);
              drawTriangle( [xy[0]+d+j, xy[1]+d+0.1, xy[0]+d+j, xy[1]+0.1, xy[0]+j, xy[1]+d+0.1]);
            }
            for(i = 0.0; i < 0.2; i += 0.1){
              drawTriangle( [xy[0]+0.5+i, xy[1]+0.2, xy[0]+d+0.5+i, xy[1]+0.2, xy[0]+0.5+i, xy[1]+d+0.2]);
              drawTriangle( [xy[0]+d+0.5+i, xy[1]+d+0.2, xy[0]+d+0.5+i, xy[1]+0.2, xy[0]+0.5+i, xy[1]+d+0.2]);
              drawTriangle( [xy[0]+0.5+i, xy[1]+0.2+i, xy[0]+d+0.5+i, xy[1]+0.2+i, xy[0]+0.5+i, xy[1]+d+0.2+i]);
              drawTriangle( [xy[0]+d+0.5+i, xy[1]+d+0.2+i, xy[0]+d+0.5+i, xy[1]+0.2+i, xy[0]+0.5+i, xy[1]+d+0.2+i]);
            }
            //top squares
            for(i = 0.1; i < 0.3; i+=0.1){
              drawTriangle( [xy[0]+i+0.8, xy[1]+0.6, xy[0]+d+i+0.8, xy[1]+0.6, xy[0]+i+0.8, xy[1]+d+0.6]);
              drawTriangle( [xy[0]+d+i+0.8, xy[1]+d+0.6, xy[0]+d+i+0.8, xy[1]+0.6, xy[0]+i+0.8, xy[1]+d+0.6]);
            }
            //end squares
            for(i = 0.1; i < 0.3; i+=0.1){
              drawTriangle( [xy[0]+1.3, xy[1]+0.4-i, xy[0]+d+1.3, xy[1]+0.4-i, xy[0]+1.3, xy[1]+d+0.4-i]);
              drawTriangle( [xy[0]+d+1.3, xy[1]+d+0.4-i, xy[0]+d+1.3, xy[1]+0.4-i, xy[0]+1.3, xy[1]+d+0.4-i]);
            }

            
            //y axis flip
            for(i = 0.0; i < 0.6; i+=0.1){
              drawTriangle( [xy[0]+0.4+i, xy[1]+0.1+i, xy[0]-d+0.4+i, xy[1]+0.1+i, xy[0]+0.4+i, xy[1]+d+0.1+i]);
            }
            
            //std
            drawTriangle( [xy[0]+0.7, xy[1]+0.1, xy[0]+d+0.7, xy[1]+0.1, xy[0]+0.7, xy[1]+d+0.1]);
            for(i = 0.0; i < 0.3; i+=0.1){
              drawTriangle([xy[0]+1.1+i, xy[1]+0.6-i, xy[0]+d+1.1+i, xy[1]+0.6-i, xy[0]+1.1+i, xy[1]+d+0.6-i]);
            }
            //45
            for(i = 0.1; i < 0.3; i+=0.1){  
                drawTriangle( [xy[0]+d+1.0+i, xy[1]+d+0.6-i, xy[0]+d+1.0+i, xy[1]+0.6-i, xy[0]+1.0+i, xy[1]+d+0.6-i]);
            }
            //mirrorx
            drawTriangle([xy[0]+0.7, xy[1]+0.5, xy[0]+d+0.7, xy[1]+0.5, xy[0]+0.7, xy[1]-d+0.5]);
            drawTriangle([xy[0]+0.8, xy[1]+0.6, xy[0]+d+0.8, xy[1]+0.6, xy[0]+0.8, xy[1]-d+0.6]);
        }
        else if(secnd){   
            for(var i = 0.0; i < 0.2; i+=0.1){
                drawTriangle( [xy[0]+d+0.7+i, xy[1]+d+0.1, xy[0]+d+0.7+i, xy[1]+0.1, xy[0]+0.7+i, xy[1]+d+0.1]);
                drawTriangle( [xy[0]+0.8+i, xy[1]+0.1, xy[0]+d+0.8+i, xy[1]+0.1, xy[0]+0.8+i, xy[1]+d+0.1]);
            }
            for(var i = 0.0; i < 0.2; i+=0.1){
                drawTriangle( [xy[0]+d+0.7+i, xy[1]+d+0.2, xy[0]+d+0.7+i, xy[1]+0.2, xy[0]+0.7+i, xy[1]+d+0.2]);
                drawTriangle( [xy[0]+0.7+i, xy[1]+0.2, xy[0]+d+0.7+i, xy[1]+0.2, xy[0]+0.7+i, xy[1]+d+0.2]);
            }
            for(var i = 0.0; i < 0.2; i+=0.1){
                drawTriangle( [xy[0]+d+0.7+i, xy[1]+d+0.3, xy[0]+d+0.7+i, xy[1]+0.3, xy[0]+0.7+i, xy[1]+d+0.3]);
                drawTriangle( [xy[0]+0.7+i, xy[1]+0.3, xy[0]+d+0.7+i, xy[1]+0.3, xy[0]+0.7+i, xy[1]+d+0.3]);
            }
            //lip
            for(i = 0.0; i < 0.3; i+=0.1){
              drawTriangle([xy[0]+1.2+i, xy[1]+0.6-i, xy[0]+d+1.2+i, xy[1]+0.6-i, xy[0]+1.2+i, xy[1]+d+0.6-i]);
              drawTriangle( [xy[0]+d+1.1+i, xy[1]+d+0.6-i, xy[0]+d+1.1+i, xy[1]+0.6-i, xy[0]+1.1+i, xy[1]+d+0.6-i]);
              drawTriangle([xy[0]+1.3+i, xy[1]+0.6-i, xy[0]+d+1.3+i, xy[1]+0.6-i, xy[0]+1.3+i, xy[1]+d+0.6-i]);
              drawTriangle( [xy[0]+d+1.2+i, xy[1]+d+0.6-i, xy[0]+d+1.2+i, xy[1]+0.6-i, xy[0]+1.2+i, xy[1]+d+0.6-i]);
            }
            
            //end squares
            for(i = 0.1; i < 0.3; i+=0.1){
              drawTriangle( [xy[0]+1.4, xy[1]+0.4-i, xy[0]+d+1.4, xy[1]+0.4-i, xy[0]+1.4, xy[1]+d+0.4-i]);
              drawTriangle( [xy[0]+d+1.4, xy[1]+d+0.4-i, xy[0]+d+1.4, xy[1]+0.4-i, xy[0]+1.4, xy[1]+d+0.4-i]);
              drawTriangle( [xy[0]+1.5, xy[1]+0.4-i, xy[0]+d+1.5, xy[1]+0.4-i, xy[0]+1.5, xy[1]+d+0.4-i]);
              drawTriangle( [xy[0]+d+1.5, xy[1]+d+0.4-i, xy[0]+d+1.5, xy[1]+0.4-i, xy[0]+1.5, xy[1]+d+0.4-i]);
            }
            
            drawTriangle( [xy[0]+0.8, xy[1]+0.4, xy[0]-d+0.8, xy[1]+0.4, xy[0]+0.8, xy[1]+d+0.4]);
            
            drawTriangle( [xy[0]+d+0.8, xy[1]+d+0.4, xy[0]+d+0.8, xy[1]+0.4, xy[0]+0.8, xy[1]+d+0.4]);
            drawTriangle( [xy[0]+0.8, xy[1]+0.4, xy[0]+d+0.8, xy[1]+0.4, xy[0]+0.8, xy[1]+d+0.4]);
            drawTriangle( [xy[0]+0.9, xy[1]+0.5, xy[0]+d+0.9, xy[1]+0.5, xy[0]+0.9, xy[1]-d+0.5]);

        }
        //mirrored on 45
        else if(third){
            drawTriangle( [xy[0]+0.9, xy[1]+0.5, xy[0]-d+0.9, xy[1]+0.5, xy[0]+0.9, xy[1]+d+0.5]);
            for(var i = 0.0; i < 0.2; i+=0.1){
                drawTriangle( [xy[0]+d+0.9+i, xy[1]+d+0.5, xy[0]+d+0.9+i, xy[1]+0.5, xy[0]+0.9+i, xy[1]+d+0.5]);
                drawTriangle( [xy[0]+1.0+i, xy[1]+0.5, xy[0]+d+1.0+i, xy[1]+0.5, xy[0]+1.0+i, xy[1]+d+0.5]);
            }
            drawTriangle( [xy[0]+0.9, xy[1]+0.5, xy[0]+d+0.9, xy[1]+0.5, xy[0]+0.9, xy[1]+d+0.5]);
        }
        
        //mirrored on x-axis
        else if(fourth){
            drawTriangle( [xy[0]+1.3, xy[1]+0.1, xy[0]-d+1.3, xy[1]+0.1, xy[0]+1.3, xy[1]+d+0.1]); 
            //end squares
              drawTriangle( [xy[0]+1.3, xy[1]+0.1, xy[0]+d+1.3, xy[1]+0.1, xy[0]+1.3, xy[1]+d+0.1]);
              drawTriangle( [xy[0]+d+1.3, xy[1]+d+0.1, xy[0]+d+1.3, xy[1]+0.1, xy[0]+1.3, xy[1]+d+0.1]);            
        }
        else if(fifth){
            for(i = 0.0; i < 0.2; i+=0.1){
              drawTriangle( [xy[0]+1.4+i, xy[1]+0.1, xy[0]+d+1.4+i, xy[1]+0.1, xy[0]+1.4+i, xy[1]+d+0.1]);
              drawTriangle( [xy[0]+d+1.4+i, xy[1]+d+0.1, xy[0]+d+1.4+i, xy[1]+0.1, xy[0]+1.4+i, xy[1]+d+0.1]);
            }
            drawTriangle( [xy[0]+1.6, xy[1]+0.1, xy[0]+d+1.6, xy[1]+0.1, xy[0]+1.6, xy[1]+d+0.1]);
        }
    }*/
        drawTriangle( [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);      
}
function drawTriangle(vertices) {
  var n = 3;
  
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer){
    console.log("Failed to create the buffer object");
    return -1;
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
  gl.enableVertexAttribArray(a_Position);
  
  gl.drawArrays(gl.TRIANGLES, 0, n);
}