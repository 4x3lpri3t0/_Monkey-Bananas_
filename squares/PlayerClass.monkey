Import mojo

Class Player1
  Field x:Float, y:Float
  Field image:Image
  Const JUMP_ACCELERATION:Int = 5
  Field yInitialVelocity:Int = 50
  Field yVelocity:Int = 0
  Field isJumping:Bool = False
 
  Method New(img:Image, x:Float = 100, y:Float = 100)
    Self.image = img
    Self.x = x
    Self.y = y
  End
 
  Method Draw:Void()
    DrawImage(image, x, y)
  End
  
  Method Jump:Void()
  	yVelocity = yInitialVelocity
	isJumping = True
	
	Jumping()
  End
  
  Method Jumping:Void()
  	yVelocity -= JUMP_ACCELERATION
	Self.y -= yVelocity
  End
End