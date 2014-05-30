Import mojo
Import VectorClass

Class Player1
'  Field x:Float, y:Float
  
  Field position:Vector = New Vector()
  
  Field image:Image
  Const JUMP_ACCELERATION:Int = 5
  Field yInitialVelocity:Int = 50
  Field yVelocity:Int = 0
  Field isJumping:Bool = False
 
  Method New(img:Image, x:Float = 100, y:Float = 100)
    image = img
    position.X = x
    position.Y = y
  End
 
  Method Draw:Void()
    DrawImage(image, position.X, position.Y)
  End
  
  Method Jump:Void()
  	yVelocity = yInitialVelocity
	isJumping = True
	
	Jumping()
  End
  
  Method Jumping:Void()
  	yVelocity -= JUMP_ACCELERATION
	position.Y -= yVelocity
  End
End