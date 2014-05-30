Import mojo
Import PlayerClass
Import EnemyClass
Import ShotClass
Import PointerClass

Const FLOOR_Y:Int = 440
Const GRAVITY:Int = 1
Const PLAYER_HEIGHT = 32
Const PLAYER_WIDTH = 32
Const LATERAL_PLAYER_VELOCITY = 7

Function Main()
	New GameApp
End

Class GameApp Extends App
  Field player:Player1
  Field enemies:List<Enemy>
  Field shots:List<Shot>
  Field pointer:Pointer
  
  Field playerImg:Image
  Field enemyImg:Image
  Field shotImg:Image
  Field pointerImg:Image
  
  Field SFX_main_music:Sound
 
  Method OnCreate()
    SetUpdateRate(60)
	
	playerImg = LoadImage("player.png")
	enemyImg = LoadImage("enemy.png")
	shotImg = LoadImage("shot.png")
	pointerImg = LoadImage("pointer.png")
	  	
    player = New Player1(playerImg, 10, FLOOR_Y - 50)
	enemies = New List<Enemy>()
	shots = New List<Shot>()
	pointer = New Pointer(pointerImg)
	
	SFX_main_music = LoadSound("FromHere.ogg")
	PlaySound(SFX_main_music, 0)
  End
 
  Method OnUpdate()
  	CheckCollisions() '???
  
  	If CollidingBelow(player)
	  player.y = FLOOR_Y - PLAYER_HEIGHT
	  
	  If KeyDown(KEY_UP)
	  	player.Jump()
	  End
	Else
	  player.y += GRAVITY
	End
	
	If player.isJumping
		player.Jumping
	EndIf
	
	If KeyDown(KEY_LEFT)
	  player.x -= LATERAL_PLAYER_VELOCITY
	EndIf
	If KeyDown(KEY_RIGHT)
	  player.x += LATERAL_PLAYER_VELOCITY
	EndIf
	
	Enemy.RandomEnemySpawn(enemies, enemyImg)
	
	If MouseHit(MOUSE_LEFT)
	  'create shot
	  Local shotFinalPositionX:Float = MouseX
	  Local shotFinalPositionY:Float = MouseY
	  shots.AddLast(New Shot(shotImg, player.x + player.image.Width / 2, player.y + player.image.Height / 2,
	  						shotFinalPositionX, shotFinalPositionY))
	End

	For Local shot:= EachIn shots
	  shot.Update()
	Next
	
	pointer.Update(player.x + player.image.Width / 2, player.y + player.image.Height / 2, MouseX, MouseY)
  End
 
  Method OnRender()
    Cls(0, 0, 0)
 
    player.Draw()
	For Local enemy:= EachIn enemies
	  enemy.Draw()
	Next
	For Local shot:= EachIn shots
	  shot.Draw()
	Next
	
	SetColor(32, 64, 128)
	DrawRect(0, FLOOR_Y, 640, 40)
	
	pointer.Draw()
  End
  
  Method CheckCollisions()
  	For Local shot:= EachIn shots
	  'TODO
	Next
  End
End

Function CollidingBelow:Bool(obj:Player1)
	If obj.y + PLAYER_HEIGHT >= FLOOR_Y
		obj.isJumping = False
		Return True
	Else
		Return False
	End
End