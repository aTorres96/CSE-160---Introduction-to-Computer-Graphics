class Camera{
   constructor(){
      this.fov = 60;
      this.eye = new Vector3([0,0,0]);
      this.at  = new Vector3([0,0,-1]);
      this.up  = new Vector3([0,1,0]);
       
      this.verticalAngle = 0.0;
      this.lookSpeed = 2;
       
      this.viewMat = new Matrix4();
      this.updateView();
      
      this.projMat = new Matrix4();
      this.projMat.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
   }

   forward(){
      var f = new Vector3([0,0,0]);
      f.set(this.at);
      f.sub(this.eye);
      f = f.normalize();
      this.at = this.at.add(f.mul(0.25));
      this.eye = this.eye.add(f.mul(0.25));
      this.updateView();
   }

   back(){
       let f = new Vector3();
        f.elements[0] = this.at.elements[0] - this.eye.elements[0];
        f.elements[1] = this.at.elements[1] - this.eye.elements[1];
        f.elements[2] = this.at.elements[2] - this.eye.elements[2];
        f = f.normalize();

        this.eye.elements[0] -= f.elements[0] * .25;
        this.eye.elements[1] -= f.elements[1] * .25;
        this.eye.elements[2] -= f.elements[2] * .25;
        this.at.elements[0] -= f.elements[0] * .25;
        this.at.elements[1] -= f.elements[1] * .25;
        this.at.elements[2] -= f.elements[2] * .25;

        this.updateView();
   }

   left(){ 
      var f = new Vector3([0,0,0]);
      f.set(this.at);
      f.sub(this.eye);
      f.normalize();
      f.mul(-.2);
      var s = new Vector3([0,0,0]);
       
      //Vector class broken i guess -\('')\_
      s.elements[0] = (f.elements[1]*this.up.elements[2]) - (f.elements[2]*this.up.elements[1]);
      s.elements[1] = (f.elements[2]*this.up.elements[0]) - (f.elements[0]*this.up.elements[2]);
      s.elements[2] = (f.elements[0]*this.up.elements[1]) - (f.elements[1]*this.up.elements[0]);
       
      s.normalize();
      this.eye.add(s);
      this.at.add(s);
      this.updateView();
   }

   right(){
      var f = new Vector3([0,0,0]);
      f.set(this.eye);
      f.sub(this.at);
      f.normalize();
      f.mul(.2);
      var s = new Vector3([0,0,0]);
      
      s.elements[0] = (this.up.elements[1]*f.elements[2]) - (this.up.elements[2]*f.elements[1]);
      s.elements[1] = (this.up.elements[2]*f.elements[0]) - (this.up.elements[0]*f.elements[2]);
      s.elements[2] = (this.up.elements[0]*f.elements[1]) - (this.up.elements[1]*f.elements[0]);
       
      s.normalize();
      this.eye.add(s);
      this.at.add(s);
      this.updateView();
   }

   panLeft(){
      var f = new Vector3([0,0,0]);
      f.set(this.at);
      f.sub(this.eye);
      var rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      var f_prime = new Vector3([0,0,0]);
      f_prime = rotationMatrix.multiplyVector3(f);
      var tempEye = new Vector3([0,0,0]);
      tempEye.set(this.eye);
      this.at = tempEye.add(f_prime);
      this.updateView();
   }

   panRight(){
      var f = new Vector3([0,0,0]);
      f.set(this.at);
      f.sub(this.eye);
      var rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(-10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      var f_prime = new Vector3([0,0,0]);
      f_prime = rotationMatrix.multiplyVector3(f);
      var tempEye = new Vector3([0,0,0]);
      tempEye.set(this.eye);
      this.at = tempEye.add(f_prime);
      this.updateView();
   }

   panUp() {
        // forward vec
        let d = new Vector3();
        d.elements[0] = this.at.elements[0] - this.eye.elements[0];
        d.elements[1] = this.at.elements[1] - this.eye.elements[1];
        d.elements[2] = this.at.elements[2] - this.eye.elements[2];
        d = d.normalize();

        //right vec
        let r = new Vector3();
        
        //cross
        r.elements[0] = (d.elements[1]*this.up.elements[2]) - (d.elements[2]*this.up.elements[1]);
        r.elements[1] = (d.elements[2]*this.up.elements[0]) - (d.elements[0]*this.up.elements[2]);
        r.elements[2] = (d.elements[0]*this.up.elements[1]) - (d.elements[1]*this.up.elements[0]);

        //rotate forward vec about right vec
        let rotMat = new Matrix4().setRotate(this.lookSpeed, r.elements[0], r.elements[1], r.elements[2]);

        // Rotate forward vec by rot matrix
        d = rotMat.multiplyVector3(d);

        // update if vertical angle is clamped between -60, and 60. Prevents gimbal lock.
        if (this.verticalAngle < 60 && this.verticalAngle > -60) {
            this.at.elements[0] = this.eye.elements[0] + d.elements[0];
            this.at.elements[1] = this.eye.elements[1] + d.elements[1];
            this.at.elements[2] = this.eye.elements[2] + d.elements[2];

            this.verticalAngle += this.lookSpeed;
            this.verticalAngle = clamp(this.verticalAngle, -59, 59);
            this.updateView();
        }
    }

    panDown() {
        // forward vec
        let d = new Vector3();
        d.elements[0] = this.at.elements[0] - this.eye.elements[0];
        d.elements[1] = this.at.elements[1] - this.eye.elements[1];
        d.elements[2] = this.at.elements[2] - this.eye.elements[2];
        d = d.normalize();

        // right vec
        let r = new Vector3();
        
        //cross
        r.elements[0] = (d.elements[1]*this.up.elements[2]) - (d.elements[2]*this.up.elements[1]);
        r.elements[1] = (d.elements[2]*this.up.elements[0]) - (d.elements[0]*this.up.elements[2]);
        r.elements[2] = (d.elements[0]*this.up.elements[1]) - (d.elements[1]*this.up.elements[0]);

        //rotate forward vec about right vec
        let rotMat = new Matrix4().setRotate(-this.lookSpeed, r.elements[0], r.elements[1], r.elements[2]);

        // Rotate forward vec by rot matrix
        d = rotMat.multiplyVector3(d);

        //update if vertical angle is clamped between -60, and 60. Prevents gimbal lock.
        if (this.verticalAngle < 60 && this.verticalAngle > -60) {
            this.at.elements[0] = this.eye.elements[0] + d.elements[0];
            this.at.elements[1] = this.eye.elements[1] + d.elements[1];
            this.at.elements[2] = this.eye.elements[2] + d.elements[2];

            this.verticalAngle -= this.lookSpeed;
            this.verticalAngle = clamp(this.verticalAngle, -59, 59);
            this.updateView();
        }
    }
    updateView(){
       this.viewMat.setLookAt(
         this.eye.elements[0], this.eye.elements[1],  this.eye.elements[2],
         this.at.elements[0],  this.at.elements[1],   this.at.elements[2],
         this.up.elements[0],  this.up.elements[1],   this.up.elements[2]); // (eye, at, up)
   }
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}