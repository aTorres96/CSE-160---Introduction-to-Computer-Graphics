function Falcor(){
  var body = new Cube();
  body.color = [0.6,0.6,0.9,1.0];
  body.textureNum = -2;
  body.matrix.translate(-.96, -0.4, -3.07);
  var bodyCoordMat = new Matrix4(body.matrix);
  if (g_Animation){
    body.matrix.rotate(-3*Math.sin(g_seconds), 0,0,1);
  } 
  body.matrix.scale(0.26, .25, .25);
  hipsMat = new Matrix4(body.matrix);
  body.renderf();
    
  var lLeg = new Cube();
  lLeg.color=[0.6, 0.6, 0.9, 1.0];
  lLeg.textureNum = -2;
  lLeg.matrix = hipsMat;
  lLeg.matrix.translate(0.25, -0.4, -.1);
  lLeg.matrix.scale(.5, .8, .25);
  if (g_Animation){
    lLeg.matrix.rotate(3*Math.sin(g_seconds), 0,0,1);
  }
  legMat = new Matrix4(lLeg.matrix);
  lLeg.renderf();
    
  var rLeg = new Cube();
  rLeg.color=[0.6, 0.6, 0.9, 1.0];
  rLeg.textureNum = -2;
  rLeg.matrix = legMat;
  rLeg.matrix.translate(0, 0, 3.8);
  rLegMat = new Matrix4(rLeg.matrix);
  rLeg.renderf();    
    
  var rFoot = new Cube();
  rFoot.color=[0.5, 0.6, 0.9, 1.0];
  rFoot.textureNum = -2;
  rFoot.matrix = legMat;
  rFoot.matrix.translate(0, 0, 0.1);
  rFoot.matrix.scale(2, .4, 1);
  if (g_Animation){
    rFoot.matrix.rotate(3*Math.sin(g_seconds), 0,0,1);
  }
  rFootMat = new Matrix4(rLeg.matrix);
  rFoot.renderf(); 
    
  var lFoot = new Cube();
  lFoot.color=[0.5, 0.6, 0.9, 1.0];
  lFoot.textureNum = -2;
  lFoot.matrix = rFootMat;
  lFoot.matrix.translate(0, 0, -4);
  lFoot.renderf(); 
    
  var torso1 = new Cube();
  torso1.color = [0.6,0.6,0.9,1.0];
  torso1.textureNum = -2;
  torso1.matrix = bodyCoordMat;
  torso1.matrix.translate(0.25, 0.01, 0.01);
  if (g_Animation){
    torso1.matrix.rotate(-3*Math.sin(g_seconds), 0,0,1);
  }
  torso1.matrix.scale(0.25, .25, .23);
  torso1.renderf();
    
  var torso2 = new Cube();
  torso2.color = [0.6,0.6,0.9,1.0];
  torso2.textureNum = -2;
  torso2.matrix = bodyCoordMat;
  //torso2.matrix.rotate(-5,0,0,1);
  torso2.matrix.scale(1, 1.1, 1.2);
  torso2.matrix.translate(.9, -.05, -.08);
  if (g_Animation){
    torso2.matrix.rotate(3*Math.sin(g_seconds), 0,0,1);
  }
  torso2.renderf();

  var shoulder = new Cube();
  shoulder.color = [0.6,0.6,0.9,1.0];
  shoulder.textureNum = -2;
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
  shoulder.renderf(); 
    
  var lArm = new Cube();
  lArm.color=[0.6, 0.6, 0.9, 1.0];
  lArm.textureNum = -2;
  lArm.matrix = shoulderMat;
  lArm.matrix.translate(0.25, -0.45, -.1);
  lArm.matrix.scale(.5, .8, .25);
  if (g_Animation){
    lArm.matrix.rotate(3*Math.sin(g_seconds), 0,0,1);
  }
  armMat = new Matrix4(lArm.matrix);
  lArm.renderf();
    
  var rArm = new Cube();
  rArm.color=[0.6, 0.6, 0.9, 1.0];
  rArm.textureNum = -2;
  rArm.matrix = armMat;
  rArm.matrix.translate(0, 0, 3.8);
  //rMat = new Matrix4(r.matrix);
  rArm.renderf();
    
  var rPaw = new Cube();
  rPaw.color=[0.5, 0.6, 0.9, 1.0];
  rPaw.textureNum = -2;
  rPaw.matrix = armMat;
  rPaw.matrix.translate(0, 0, 0.1);
  rPaw.matrix.scale(2, .4, 1);
  if (g_Animation){
    rPaw.matrix.rotate(5*Math.sin(g_seconds), 0,0,1);
  }
  rPawMat = new Matrix4(rPaw.matrix);
  //rFoot.matrix.rotate(1, 45, 0, 1);
  rPaw.renderf(); 
    
  var lPaw = new Cube();
  lPaw.color=[0.5, 0.6, 0.9, 1.0];
  lPaw.textureNum = -2;
  lPaw.matrix = rPawMat;
  lPaw.matrix.translate(0, 0, -4);
  //lFoot.matrix.scale(2, .5, 1);
  lPaw.renderf();  
    
  var neck = new Cube();
  neck.color = [0.6,0.6,0.9,1.0];
  neck.textureNum = -2;
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
  neck.renderf();

  var bjaw = new Cube();
  bjaw.color = [0.5,0.6,0.9,1.0];
  bjaw.textureNum = -2;
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
  bjaw.renderf();
    
  var tjaw = new Cube();
  tjaw.color = [0.6,0.6,0.9,1.0];
  tjaw.textureNum = -2;
  tjaw.matrix = bodyCoordMat;
  tjaw.matrix.scale(1.5, .75, 1.2);
  tjaw.matrix.translate(-.25, 1, -0.075);
  bodyCoordMat = new Matrix4(tjaw.matrix)
  tjaw.renderf();
    
  var lEye = new Cube();
  lEye.color = [0.6, 0.6, 0.9, 1.0];
  lEye.textureNum = -2;
  lEye.matrix = neckMat;
  neckMat = new Matrix4(lEye.matrix)
  lEye.matrix.translate(.8, .75, .6);
  lEye.matrix.scale(.5, .5, .5);
  eyeMat = new Matrix4(lEye.matrix);
  lEye.renderf();
    
  var rEye = new Cube();
  rEye.color = [0.6, 0.6, 0.9, 1.0];
  rEye.textureNum = -2;
  rEye.matrix = neckMat;
  rEye.matrix.translate(.8, .75, -.1);
  rEye.matrix.scale(.5, .5, .5);
  rEye.renderf();
    
  var lEyeBall = new Cube();
  lEyeBall.color = [0, 0, 0, 1.0];
  lEyeBall.textureNum = -2;
  lEyeBall.matrix = eyeMat;
  lEyeBall.matrix.translate(.75, .25, .25);
  lEyeBall.matrix.scale(.5, .5, .5);
  eyeBallMat = new Matrix4(lEyeBall.matrix);
  lEyeBall.renderf();
  
  var rEyeBall = new Cube();
  rEyeBall.color = [0, 0, 0, 1.0];
  rEyeBall.textureNum = -2;
  rEyeBall.matrix = eyeBallMat;
  rEyeBall.matrix.translate(0, 0, -2.8);
  //lEyeBall.matrix.scale(.5, .5, .5);
  rEyeBall.renderf();
  
  //tail
  //Modified the professors loop.
  var k = 7;
  for (var i = 1; i < k; i++){
      var t = new Cube();
      //t.tail = true;
      t.color = [0.5, 0.6, 0.9, 1];
      t.textureNum = -2;
      t.matrix.translate((.52*i/k-1.0)-.5, -0.4, (-i/100)-3);
      if (g_Animation){     
        t.matrix.rotate(-4*Math.sin(g_seconds)+3*Math.cos(g_seconds),0, 0, 1);
        if(i%2 == 1){
          t.matrix.translate(0, (-4*Math.sin(g_seconds)+3*Math.cos(g_seconds))/500,0);
        }
          //t.matrix.translate(0, -(-4*Math.sin(g_seconds)+3*Math.cos(g_seconds))/500,0);        
      }
      t.matrix.scale(.1, (.5/k)+2*i/75, (.5/k)+2*i/75);
      t.renderf();
 }
}