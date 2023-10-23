class Cube{
    constructor(){
        this.type='cube';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.tail = false;
    }
    
    render() {
        //var xy = this.postion;
        var rgba = this.color;
        //var size = this.size;
        
        //Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        //Draw
    
        //front of cube
        if(this.tail){
            drawTriangle3D( [0.0,0.1,0.1, 1.0,1.0,0.0, 1.0,0.0,0.0 ]);
            drawTriangle3D( [0.0,0.1,0.1, 0.0,0.9,0.1, 1.0,1.0,0.0 ]);
        }else{
        drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0 ]);
        drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0 ]);
        }
        
        //back of cube
        if(this.tail){
            drawTriangle3D( [0.0,0.1,0.9, 1.0,1.0,1.0, 1.0,0.0,1.0 ]);
            drawTriangle3D( [0.0,0.1,0.9, 0.0,0.9,0.9, 1.0,1.0,1.0 ]);
        }
        else{
        drawTriangle3D( [0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0 ]);
        drawTriangle3D( [0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0 ]);
        }
        
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);

        //left of cube
        if(this.tail){
            drawTriangle3D( [0.0,0.1,0.1, 0.0,0.9,0.9, 0.0,0.1,0.9 ]);
            drawTriangle3D( [0.0,0.1,0.1, 0.0,0.9,0.1, 0.0,0.9,0.9 ]);
        }
        else{
            drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0 ]);
            drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0 ]);
        }
        
        //right of cube
        drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0 ]);
        drawTriangle3D( [1.0,0.0,0.0, 1.0,0.0,1.0, 1.0,1.0,1.0 ]);
        
        gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);

        //top of cube
        if(this.tail){
            drawTriangle3D( [0.1,0.9,0.1, 1.0,1.0,0.0, 1.0,1.0,1.0 ]);
            drawTriangle3D( [0.1,0.9,0.1, 0.0,0.9,0.9, 1.0,1.0,1.0 ]);
        }
        else{
            drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0 ]);
            drawTriangle3D( [0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0 ]);
        }
        //bottom of cube
        if(this.tail){
            drawTriangle3D( [0.1,0.1,0.1, 1.0,0.0,0.0, 1.0,0.0,1.0 ]);
            drawTriangle3D( [0.1,0.1,0.1, 0.0,0.1,0.9, 1.0,0.0,1.0 ]);
        }
        else{
            drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0 ]);
            drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0 ]);
        }
        
        //drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
        //drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);
    }
}