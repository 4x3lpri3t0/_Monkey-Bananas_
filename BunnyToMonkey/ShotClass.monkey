Class Shot
  Field x:Float, y:Float, mousePosX:Float, mousePosY:Float, directionX:Float, directionY:Float
  Field image:Image
  
  Method New(img:Image, initialPosX:Float, initialPosY:Float, mousePosX:Float, mousePosY:Float, finalPosY:Float)
    Self.image = img
	
    Self.x = initialPosX
    Self.y = initialPosY
	
	Self.directionX = mousePosX - initialPosX
	Self.directionY = mousePosY - initialPosY
  End
  
  Method Update:Void()
  'TODO: Improve this. Find out how to make an object follow certain direction. Maybe see some Monkey project examples?
  	If directionX < 0
	  Self.x -= 1
	  directionX += 1
	ElseIf directionX > 0
	  Self.x += 1
	  directionX -= 1
	End
	
	If directionY < 0
	  Self.y -= 1
	  directionY += 1
	ElseIf directionY > 0
	  Self.y += 1
	  directionY -= 1
	End
  End
 
  Method Draw:Void()
    DrawImage(image, x, y)
  End
  
End