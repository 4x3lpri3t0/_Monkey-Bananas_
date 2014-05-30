Import mojo
Import PlayerClass
Import EnemyClass
Import ShotClass
Import PointerClass
Import VectorClass

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
  
  Field playerCenter:Vector
  
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
	
	playerCenter = New Vector()
	
	SFX_main_music = LoadSound("FromHere.ogg")
	PlaySound(SFX_main_music, 0)
  End
 
  Method OnUpdate()
  	CheckCollisions(player, enemies, shots) '???
  
	' --- PLAYER MOVEMENT ---
  	If CollidingBelow(player)
	  player.position.Y = FLOOR_Y - PLAYER_HEIGHT
	  
	  If KeyDown(KEY_UP)
	  	player.Jump()
	  End
	Else
	  player.position.Y += GRAVITY
	End
	
	If player.isJumping
		player.Jumping
	EndIf
	
	If KeyDown(KEY_LEFT)
	  player.position.X -= LATERAL_PLAYER_VELOCITY
	EndIf
	If KeyDown(KEY_RIGHT)
	  player.position.X += LATERAL_PLAYER_VELOCITY
	EndIf
	' -----------------------
	
	Enemy.RandomEnemySpawn(enemies, enemyImg)
	
	playerCenter.X = player.image.Width / 2
	playerCenter.Y = player.image.Height / 2
	
	If MouseHit(MOUSE_LEFT)
	  'create shot
	  Local shotFinalPositionX:Float = MouseX
	  Local shotFinalPositionY:Float = MouseY
	  shots.AddLast(New Shot(shotImg, player.position.X + playerCenter.X, player.position.Y + playerCenter.Y,
	  						shotFinalPositionX, shotFinalPositionY))
	End
	
	For Local enemy:= EachIn enemies
	  enemy.Update()
	Next

	For Local shot:= EachIn shots
	  shot.Update()
	Next
	
	pointer.Update(player.position.X + playerCenter.X, player.position.Y + playerCenter.Y, MouseX, MouseY)
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
  
  Method CheckCollisions(player:Player1, enemies:List<Enemy>, shots:List<Shot>)
  	For Local enemy:Enemy = EachIn enemies
	  For Local shot:Shot = EachIn shots
		If shot.position.X + shot.shotCenter.X > enemy.position.X And 'LEFT COLLISION
		   shot.position.X +shot.shotCenter.X < enemy.position.X + enemy.image.Width And 'RIGHT COLLISION
		   shot.position.Y +shot.shotCenter.Y > enemy.position.Y And 'UP COLLISION
		   shot.position.Y +shot.shotCenter.Y < enemy.position.Y + enemy.image.Height Then 'DOWN COLLISION
		  shots.Remove(shot)
		  enemies.Remove(enemy)
		EndIf
	  Next
	  
	  'TODO player collision
	Next
  End
End

Function CollidingBelow:Bool(obj:Player1)
	If obj.position.Y + PLAYER_HEIGHT >= FLOOR_Y
		obj.isJumping = False
		Return True
	Else
		Return False
	End
End