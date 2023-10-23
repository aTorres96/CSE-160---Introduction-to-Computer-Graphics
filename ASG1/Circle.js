class Circle{
    constructor(){
        this.type='circle';
        this.position= [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segmentCount = 10;
    }
    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the color of a paint to u_FragColor variable
        gl.uniform1f(u_Size, size);
        // Draw
        var d = this.size/200.0; //delta
        let angleStep=360/this.segmentCount;
        for(var angle = 0; angle < 360; angle=angle+angleStep){
          let centerPt= [xy[0], xy[1]];
          let angle1=angle;
          let angle2=angle+angleStep;
          let vec1=[Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
          let vec2=[Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
          let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
          let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
          drawCircle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
    }
  }
}
function drawCircle(vertices) {
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