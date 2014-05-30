Import mojo

Class Enemy
  Field x:Float, y:Float
  Public Field image:Image
  
  Method New(img:Image)
    Self.image = img
	
    Self.x = Rnd(0, 640)
    Self.y = Rnd(0, 480)
  End
 
  Method Draw:Void()
    DrawImage(image, x, y)
  End
  
  'STATIC METHOD
  Function RandomEnemySpawn:Void(enemies:List<Enemy>, img:Image) 'TODO: Add random MIN MAN parameters, so I can send level variable to set difficulty (enemy spawn frequency)
  	Local rndm:Int = Int(Rnd(0, 100))
	If rndm = 1 '1% probability of spawning an enemy
	  enemies.AddLast(New Enemy(img))
	EndIf
  End
End