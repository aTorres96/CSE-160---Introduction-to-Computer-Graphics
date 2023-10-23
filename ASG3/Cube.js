class Cube{
    constructor() {
        this.type = 'cube';
        this.matrix = new Matrix4();
        this.buffer = null;
        this.textureNum = 0;
        this.color = [1, 1, 1, 1];
        this.vertices = new Float32Array([
            // Front of cube
            0,0,0, 0,0,
            1,1,0, 1,1,
            1,0,0, 1,0,
            0,0,0, 0,0,
            0,1,0, 0,1,
            1,1,0, 1,1,

        // Top of cube
            0,1,0, 0,0,
            0,1,1, 0,1,
            1,1,1, 1,1,
            0,1,0, 0,0,
            1,1,1, 1,1,
            1,1,0, 1,0,

        // Right of cube
            1,0,0, 0,0,
            1,1,1, 1,1,
            1,1,0, 1,0,
            1,0,0, 0,0,
            1,0,1, 0,1,
            1,1,1, 1,1,

        // Bottom of cube
            0,0,0, 0,0,
            0,0,1, 0,1,
            1,0,1, 1,1,
            0,0,0, 0,0,
            1,0,1, 1,1,
            1,0,0, 1,0,

        // Left of cube
            0,0,0, 0,0,
            0,1,1, 1,1,
            0,1,0, 1,0,
            0,0,0, 0,0,
            0,0,1, 0,1,
            0,1,1, 1,1,

        //Back of cube
            0,0,1, 0,0,
            1,1,1, 1,1,
            1,0,1, 1,0,
            0,0,1, 0,0,
            0,1,1, 0,1,
            1,1,1, 1,1,
        ]);
    }

    
    render() {
        let [r, g, b, a] = this.color;

        // Pass the color
        gl.uniform4f(u_FragColor, r, g, b, a);

        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the matrix to u_ModelMatrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        if (this.vertices === null)  {
            this.generateVertices();
        }

        if (this.buffer === null) {
            // Create a buffer object
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log("Failed to create the buffer object");
                return -1;
            }
                // Bind the buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            
            // Write date into the buffer object
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

            let FSIZE = this.vertices.BYTES_PER_ELEMENT;

            // Assign the buffer object to a_Position variable
            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);

            // Enable the assignment to a_Position variable
            gl.enableVertexAttribArray(a_Position);

            // Assign the buffer object to a_UV variable
            gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);

            // Enable the assignment to a_UV variable
            gl.enableVertexAttribArray(a_UV);
        }

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 5);
    }

    renderf() {
      var rgba = this.color;

      gl.uniform1i(u_whichTexture, this.textureNum);

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

     
      // Front of CubeCUBE
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle3D([0.0,1.0,0.0, 1.0,1.0,0.0, 0.0,0.0,0.0 ]);
      drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,1.0,0.0 ]);
      // Back
      drawTriangle3D([0.0,1.0,1.0, 1.0,1.0,1.0, 0.0,0.0,1.0 ]);
      drawTriangle3D([0.0,0.0,1.0, 1.0,0.0,1.0, 1.0,1.0,1.0 ]);
      
      gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
       // Top
      drawTriangle3D([0.0,1.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0 ]);
      drawTriangle3D([0.0,1.0,1.0, 0.0,1.0,0.0, 1.0,1.0,1.0 ]);
      // Bottom
      drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0 ]);
      drawTriangle3D([1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0 ]);
      
      gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
      // Left
      drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0 ]);
      drawTriangle3D([0.0,1.0,1.0, 0.0,0.0,0.0, 0.0,0.0,1.0 ]);
      // Right
      drawTriangle3D([1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0 ]);
      drawTriangle3D([1.0,1.0,1.0, 1.0,0.0,0.0, 1.0,0.0,1.0 ]);


      }
}