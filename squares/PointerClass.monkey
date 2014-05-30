Import mojo
Import VectorClass

Class Pointer
  Field position:Vector, mousePos:Vector, direction:Vector
  Field image:Image
  
  Method New(img:Image)
    image = img
  End
  
  Method Update:Void(initialPosX:Float, initialPosY:Float, mousePosX, mousePosY)
  	position = New Vector(initialPosX, initialPosY)
	
	direction = New Vector(mousePosX - initialPosX, mousePosY - initialPosY)
	
	direction = direction.Normalize().Multiply(50)
  
	position.Add(direction)
  End
 
  Method Draw:Void()
    DrawImage(image, position.X - image.Width / 2, position.Y - image.Height / 2)
  End
  
End