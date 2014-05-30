Import mojo
Import VectorClass

Class Shot
  Field position:Vector, mousePos:Vector, direction:Vector, speed:Float = 5
  Field image:Image
  Field shotCenter:Vector = New Vector()
  
  Method New(img:Image, initialPosX, initialPosY, mousePosX, mousePosY)
    image = img
	
	position = New Vector(initialPosX, initialPosY)
	
	direction = New Vector(mousePosX - initialPosX, mousePosY - initialPosY)
	
	direction = direction.Normalize().Multiply(speed)
  End
  
  Method Update:Void()
	position.Add(direction)
	
	shotCenter.X = image.Width / 2
	shotCenter.Y = image.Height / 2
  End
 
  Method Draw:Void()
    DrawImage(image, position.X, position.Y)
  End
  
End