
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}

	BBMonkeyGame.Main( document.getElementById( "GameCanvas" ) );
}

//${CONFIG_BEGIN}
CFG_BINARY_FILES="*.bin|*.dat";
CFG_BRL_GAMETARGET_IMPLEMENTED="1";
CFG_BRL_THREAD_IMPLEMENTED="1";
CFG_CONFIG="debug";
CFG_HOST="winnt";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_LANG="js";
CFG_MOJO_AUTO_SUSPEND_ENABLED="1";
CFG_MOJO_DRIVER_IMPLEMENTED="1";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="0";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[mojo_font.png];type=image/png;width=864;height=13;\n[enemy.png];type=image/png;width=32;height=32;\n[player.png];type=image/png;width=32;height=32;\n[pointer.png];type=image/png;width=16;height=16;\n[shot.png];type=image/png;width=8;height=8;\n";
//${METADATA_END}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	var cons=document.getElementById( "GameConsole" );
	if( cons ){
		cons.value+=str+"\n";
		cons.scrollTop=cons.scrollHeight-cons.clientHeight;
	}else if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	if( window.console!=undefined ) window.console.log( str );
}

function debugStop(){
	debugger;	//	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_charCodeAt( str,index ){
	if( index<0 || index>=str.length ) error( "Character index out of range" );
	return str.charCodeAt( index );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_startswith( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_endswith( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_tochars( str ){
	var arr=new Array( str.length );
	for( var i=0;i<str.length;++i ) arr[i]=str.charCodeAt(i);
	return arr;
}

function string_fromchars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}


function BBGameEvent(){}
BBGameEvent.KeyDown=1;
BBGameEvent.KeyUp=2;
BBGameEvent.KeyChar=3;
BBGameEvent.MouseDown=4;
BBGameEvent.MouseUp=5;
BBGameEvent.MouseMove=6;
BBGameEvent.TouchDown=7;
BBGameEvent.TouchUp=8;
BBGameEvent.TouchMove=9;
BBGameEvent.MotionAccel=10;

function BBGameDelegate(){}
BBGameDelegate.prototype.StartGame=function(){}
BBGameDelegate.prototype.SuspendGame=function(){}
BBGameDelegate.prototype.ResumeGame=function(){}
BBGameDelegate.prototype.UpdateGame=function(){}
BBGameDelegate.prototype.RenderGame=function(){}
BBGameDelegate.prototype.KeyEvent=function( ev,data ){}
BBGameDelegate.prototype.MouseEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.TouchEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.MotionEvent=function( ev,data,x,y,z ){}
BBGameDelegate.prototype.DiscardGraphics=function(){}

function BBGame(){
	BBGame._game=this;
	this._delegate=null;
	this._keyboardEnabled=false;
	this._updateRate=0;
	this._started=false;
	this._suspended=false;
	this._debugExs=(CFG_CONFIG=="debug");
	this._startms=Date.now();
}

BBGame.Game=function(){
	return BBGame._game;
}

BBGame.prototype.SetDelegate=function( delegate ){
	this._delegate=delegate;
}

BBGame.prototype.Delegate=function(){
	return this._delegate;
}

BBGame.prototype.SetUpdateRate=function( updateRate ){
	this._updateRate=updateRate;
}

BBGame.prototype.SetKeyboardEnabled=function( keyboardEnabled ){
	this._keyboardEnabled=keyboardEnabled;
}

BBGame.prototype.Started=function(){
	return this._started;
}

BBGame.prototype.Suspended=function(){
	return this._suspended;
}

BBGame.prototype.Millisecs=function(){
	return Date.now()-this._startms;
}

BBGame.prototype.GetDate=function( date ){
	var n=date.length;
	if( n>0 ){
		var t=new Date();
		date[0]=t.getFullYear();
		if( n>1 ){
			date[1]=t.getMonth()+1;
			if( n>2 ){
				date[2]=t.getDate();
				if( n>3 ){
					date[3]=t.getHours();
					if( n>4 ){
						date[4]=t.getMinutes();
						if( n>5 ){
							date[5]=t.getSeconds();
							if( n>6 ){
								date[6]=t.getMilliseconds();
							}
						}
					}
				}
			}
		}
	}
}

BBGame.prototype.SaveState=function( state ){
	localStorage.setItem( "monkeystate@"+document.URL,state );	//key can't start with dot in Chrome!
	return 1;
}

BBGame.prototype.LoadState=function(){
	var state=localStorage.getItem( "monkeystate@"+document.URL );
	if( state ) return state;
	return "";
}

BBGame.prototype.LoadString=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );
	
	xhr.send( null );
	
	if( xhr.status==200 || xhr.status==0 ) return xhr.responseText;
	
	return "";
}

BBGame.prototype.PollJoystick=function( port,joyx,joyy,joyz,buttons ){
	return false;
}

BBGame.prototype.OpenUrl=function( url ){
	window.location=url;
}

BBGame.prototype.SetMouseVisible=function( visible ){
	if( visible ){
		this._canvas.style.cursor='default';	
	}else{
		this._canvas.style.cursor="url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
	}
}

BBGame.prototype.PathToFilePath=function( path ){
	return "";
}

//***** js Game *****

BBGame.prototype.PathToUrl=function( path ){
	return path;
}

BBGame.prototype.LoadData=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );

	if( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );

	xhr.send( null );
	if( xhr.status!=200 && xhr.status!=0 ) return null;

	var r=xhr.responseText;
	var buf=new ArrayBuffer( r.length );
	var bytes=new Int8Array( buf );
	for( var i=0;i<r.length;++i ){
		bytes[i]=r.charCodeAt( i );
	}
	return buf;
}

//***** INTERNAL ******

BBGame.prototype.Die=function( ex ){

	this._delegate=new BBGameDelegate();
	
	if( !ex.toString() ){
		return;
	}
	
	if( this._debugExs ){
		print( "Monkey Runtime Error : "+ex.toString() );
		print( stackTrace() );
	}
	
	throw ex;
}

BBGame.prototype.StartGame=function(){

	if( this._started ) return;
	this._started=true;
	
	if( this._debugExs ){
		try{
			this._delegate.StartGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.StartGame();
	}
}

BBGame.prototype.SuspendGame=function(){

	if( !this._started || this._suspended ) return;
	this._suspended=true;
	
	if( this._debugExs ){
		try{
			this._delegate.SuspendGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.SuspendGame();
	}
}

BBGame.prototype.ResumeGame=function(){

	if( !this._started || !this._suspended ) return;
	this._suspended=false;
	
	if( this._debugExs ){
		try{
			this._delegate.ResumeGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.ResumeGame();
	}
}

BBGame.prototype.UpdateGame=function(){

	if( !this._started || this._suspended ) return;

	if( this._debugExs ){
		try{
			this._delegate.UpdateGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.UpdateGame();
	}
}

BBGame.prototype.RenderGame=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.RenderGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.RenderGame();
	}
}

BBGame.prototype.KeyEvent=function( ev,data ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.KeyEvent( ev,data );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.KeyEvent( ev,data );
	}
}

BBGame.prototype.MouseEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MouseEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MouseEvent( ev,data,x,y );
	}
}

BBGame.prototype.TouchEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.TouchEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.TouchEvent( ev,data,x,y );
	}
}

BBGame.prototype.MotionEvent=function( ev,data,x,y,z ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MotionEvent( ev,data,x,y,z );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MotionEvent( ev,data,x,y,z );
	}
}

BBGame.prototype.DiscardGraphics=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.DiscardGraphics();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.DiscardGraphics();
	}
}


function BBHtml5Game( canvas ){
	BBGame.call( this );
	BBHtml5Game._game=this;
	this._canvas=canvas;
	this._loading=0;
	this._timerSeq=0;
	this._gl=null;
	if( CFG_OPENGL_GLES20_ENABLED=="1" ){
		this._gl=this._canvas.getContext( "webgl" );
		if( !this._gl ) this._gl=this._canvas.getContext( "experimental-webgl" );
		if( !this._gl ) this.Die( "Can't create WebGL" );
		gl=this._gl;
	}
}

BBHtml5Game.prototype=extend_class( BBGame );

BBHtml5Game.Html5Game=function(){
	return BBHtml5Game._game;
}

BBHtml5Game.prototype.ValidateUpdateTimer=function(){

	++this._timerSeq;

	if( !this._updateRate || this._suspended ) return;
	
	var game=this;
	var updatePeriod=1000.0/this._updateRate;
	var nextUpdate=Date.now()+updatePeriod;
	var seq=game._timerSeq;
	
	function timeElapsed(){
		if( seq!=game._timerSeq ) return;

		var time;		
		var updates;
		
		for( updates=0;updates<4;++updates ){
		
			nextUpdate+=updatePeriod;
			
			game.UpdateGame();
			if( seq!=game._timerSeq ) return;
			
			if( nextUpdate-Date.now()>0 ) break;
		}
		
		game.RenderGame();
		if( seq!=game._timerSeq ) return;
		
		if( updates==4 ){
			nextUpdate=Date.now();
			setTimeout( timeElapsed,0 );
		}else{
			var delay=nextUpdate-Date.now();
			setTimeout( timeElapsed,delay>0 ? delay : 0 );
		}
	}

	setTimeout( timeElapsed,updatePeriod );
}

//***** BBGame methods *****

BBHtml5Game.prototype.SetUpdateRate=function( updateRate ){

	BBGame.prototype.SetUpdateRate.call( this,updateRate );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.GetMetaData=function( path,key ){
	if( path.indexOf( "monkey://data/" )!=0 ) return "";
	path=path.slice(14);

	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

BBHtml5Game.prototype.PathToUrl=function( path ){
	if( path.indexOf( "monkey:" )!=0 ){
		return path;
	}else if( path.indexOf( "monkey://data/" )==0 ) {
		return "data/"+path.slice( 14 );
	}
	return "";
}

BBHtml5Game.prototype.GetLoading=function(){
	return this._loading;
}

BBHtml5Game.prototype.IncLoading=function(){
	++this._loading;
	return this._loading;
}

BBHtml5Game.prototype.DecLoading=function(){
	--this._loading;
	return this._loading;
}

BBHtml5Game.prototype.GetCanvas=function(){
	return this._canvas;
}

BBHtml5Game.prototype.GetWebGL=function(){
	return this._gl;
}

//***** INTERNAL *****

BBHtml5Game.prototype.UpdateGame=function(){

	if( !this._loading ) BBGame.prototype.UpdateGame.call( this );
}

BBHtml5Game.prototype.SuspendGame=function(){

	BBGame.prototype.SuspendGame.call( this );
	
	BBGame.prototype.RenderGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.ResumeGame=function(){

	BBGame.prototype.ResumeGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.Run=function(){

	var game=this;
	var canvas=game._canvas;
	
	var touchIds=new Array( 32 );
	for( i=0;i<32;++i ) touchIds[i]=-1;
	
	function eatEvent( e ){
		if( e.stopPropagation ){
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble=true;
			e.returnValue=false;
		}
	}
	
	function keyToChar( key ){
		switch( key ){
		case 8:case 9:case 13:case 27:case 32:return key;
		case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 45:return key|0x10000;
		case 46:return 127;
		}
		return 0;
	}
	
	function mouseX( e ){
		var x=e.clientX+document.body.scrollLeft;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}
	
	function mouseY( e ){
		var y=e.clientY+document.body.scrollTop;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}

	function touchX( touch ){
		var x=touch.pageX;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}			
	
	function touchY( touch ){
		var y=touch.pageY;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}
	
	canvas.onkeydown=function( e ){
		game.KeyEvent( BBGameEvent.KeyDown,e.keyCode );
		var chr=keyToChar( e.keyCode );
		if( chr ) game.KeyEvent( BBGameEvent.KeyChar,chr );
		if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
	}

	canvas.onkeyup=function( e ){
		game.KeyEvent( BBGameEvent.KeyUp,e.keyCode );
	}

	canvas.onkeypress=function( e ){
		if( e.charCode ){
			game.KeyEvent( BBGameEvent.KeyChar,e.charCode );
		}else if( e.which ){
			game.KeyEvent( BBGameEvent.KeyChar,e.which );
		}
	}

	canvas.onmousedown=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseDown,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseDown,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseDown,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmouseup=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmousemove=function( e ){
		game.MouseEvent( BBGameEvent.MouseMove,-1,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.onmouseout=function( e ){
		game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );
		eatEvent( e );
	}
	
	canvas.onclick=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		eatEvent( e );
		return;
	}
	
	canvas.oncontextmenu=function( e ){
		return false;
	}
	
	canvas.ontouchstart=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=-1 ) continue;
				touchIds[j]=touch.identifier;
				game.TouchEvent( BBGameEvent.TouchDown,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchmove=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				game.TouchEvent( BBGameEvent.TouchMove,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchend=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				touchIds[j]=-1;
				game.TouchEvent( BBGameEvent.TouchUp,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	window.ondevicemotion=function( e ){
		var tx=e.accelerationIncludingGravity.x/9.81;
		var ty=e.accelerationIncludingGravity.y/9.81;
		var tz=e.accelerationIncludingGravity.z/9.81;
		var x,y;
		switch( window.orientation ){
		case   0:x=+tx;y=-ty;break;
		case 180:x=-tx;y=+ty;break;
		case  90:x=-ty;y=-tx;break;
		case -90:x=+ty;y=+tx;break;
		}
		game.MotionEvent( BBGameEvent.MotionAccel,0,x,y,tz );
		eatEvent( e );
	}

	canvas.onfocus=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.ResumeGame();
		}
	}
	
	canvas.onblur=function( e ){
		for( var i=0;i<256;++i ) game.KeyEvent( BBGameEvent.KeyUp,i );
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.SuspendGame();
		}
	}
	
	canvas.focus();
	
	game.StartGame();

	game.RenderGame();
}


function BBMonkeyGame( canvas ){
	BBHtml5Game.call( this,canvas );
}

BBMonkeyGame.prototype=extend_class( BBHtml5Game );

BBMonkeyGame.Main=function( canvas ){

	var game=new BBMonkeyGame( canvas );

	try{

		bbInit();
		bbMain();

	}catch( ex ){
	
		game.Die( ex );
		return;
	}

	if( !game.Delegate() ) return;
	
	game.Run();
}


// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

//***** gxtkGraphics class *****

function gxtkGraphics(){
	this.game=BBHtml5Game.Html5Game();
	this.canvas=this.game.GetCanvas()
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	this.gl=null;
	this.gc=this.canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	if( !this.gc ) return 0;
	this.gc.save();
	if( this.game.GetLoading() ) return 2;
	return 1;
}

gxtkGraphics.prototype.EndRender=function(){
	if( this.gc ) this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	var game=this.game;

	var ty=game.GetMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;
	
	function onloadfun(){
		game.DecLoading();
	}
	
	game.IncLoading();

	var image=new Image();
	image.onload=onloadfun;
	image.meta_width=parseInt( game.GetMetaData( path,"width" ) );
	image.meta_height=parseInt( game.GetMetaData( path,"height" ) );
	image.src=game.PathToUrl( path );

	return new gxtkSurface( image,this );
}

gxtkGraphics.prototype.CreateSurface=function( width,height ){
	var canvas=document.createElement( 'canvas' );
	
	canvas.width=width;
	canvas.height=height;
	canvas.meta_width=width;
	canvas.meta_height=height;
	canvas.complete=true;
	
	var surface=new gxtkSurface( canvas,this );
	
	surface.gc=canvas.getContext( '2d' );
	
	return surface;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;	
	this.gc.globalAlpha=this.alpha;	
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawPoint=function( x,y ){
	if( this.tformed ){
		var px=x;
		x=px * this.ix + y * this.jx + this.tx;
		y=px * this.iy + y * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
		this.gc.fillRect( x,y,1,1 );
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
		this.gc.fillRect( x,y,1,1 );
	}
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<2 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawPoly2=function( verts,surface,srx,srcy ){
	if( verts.length<4 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=4;i<verts.length;i+=4 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tmpGC=this.tmpCanvas.getContext( "2d" );
	tmpGC.globalCompositeOperation="copy";
	
	tmpGC.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tmpGC.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tmpGC.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

gxtkGraphics.prototype.ReadPixels=function( pixels,x,y,width,height,offset,pitch ){

	var imgData=this.gc.getImageData( x,y,width,height );
	
	var p=imgData.data,i=0,j=offset,px,py;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			pixels[j++]=(p[i+3]<<24)|(p[i]<<16)|(p[i+1]<<8)|p[i+2];
			i+=4;
		}
		j+=pitch-width;
	}
}

gxtkGraphics.prototype.WritePixels2=function( surface,pixels,x,y,width,height,offset,pitch ){

	if( !surface.gc ){
		if( !surface.image.complete ) return;
		var canvas=document.createElement( "canvas" );
		canvas.width=surface.swidth;
		canvas.height=surface.sheight;
		surface.gc=canvas.getContext( "2d" );
		surface.gc.globalCompositeOperation="copy";
		surface.gc.drawImage( surface.image,0,0 );
		surface.image=canvas;
	}

	var imgData=surface.gc.createImageData( width,height );

	var p=imgData.data,i=0,j=offset,px,py,argb;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			argb=pixels[j++];
			p[i]=(argb>>16) & 0xff;
			p[i+1]=(argb>>8) & 0xff;
			p[i+2]=argb & 0xff;
			p[i+3]=(argb>>24) & 0xff;
			i+=4;
		}
		j+=pitch-width;
	}
	
	surface.gc.putImageData( imgData,x,y );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

gxtkSurface.prototype.OnUnsafeLoadComplete=function(){
	return true;
}

//***** gxtkChannel class *****
function gxtkChannel(){
	this.sample=null;
	this.audio=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.flags=0;
	this.state=0;
}

//***** gxtkAudio class *****
function gxtkAudio(){
	this.game=BBHtml5Game.Html5Game();
	this.okay=typeof(Audio)!="undefined";
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
		if( !this.okay ) this.channels[i].state=-1;
	}
}

gxtkAudio.prototype.Suspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ){
			if( chan.audio.ended && !chan.audio.loop ){
				chan.state=0;
			}else{
				chan.audio.pause();
				chan.state=3;
			}
		}
	}
}

gxtkAudio.prototype.Resume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==3 ){
			chan.audio.play();
			chan.state=1;
		}
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	if( !this.okay ) return null;

	var audio=new Audio( this.game.PathToUrl( path ) );
	if( !audio ) return null;
	
	return new gxtkSample( audio );
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];

	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
	
	for( var i=0;i<33;++i ){
		var chan2=this.channels[i];
		if( chan2.state==1 && chan2.audio.ended && !chan2.audio.loop ) chan.state=0;
		if( chan2.state==0 && chan2.sample ){
			chan2.sample.FreeAudio( chan2.audio );
			chan2.sample=null;
			chan2.audio=null;
		}
	}

	var audio=sample.AllocAudio();
	if( !audio ) return;

	audio.loop=(flags&1)!=0;
	audio.volume=chan.volume;
	audio.play();

	chan.sample=sample;
	chan.audio=audio;
	chan.flags=flags;
	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
}

gxtkAudio.prototype.PauseChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==1 ){
		if( chan.audio.ended && !chan.audio.loop ){
			chan.state=0;
		}else{
			chan.audio.pause();
			chan.state=2;
		}
	}
}

gxtkAudio.prototype.ResumeChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==2 ){
		chan.audio.play();
		chan.state=1;
	}
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.state==1 && chan.audio.ended && !chan.audio.loop ) chan.state=0;
	if( chan.state==3 ) return 1;
	return chan.state;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.state>0 ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.PauseMusic=function(){
	this.PauseChannel( 32 );
}

gxtkAudio.prototype.ResumeMusic=function(){
	this.ResumeChannel( 32 );
}

gxtkAudio.prototype.MusicState=function(){
	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.free=new Array();
	this.insts=new Array();
}

gxtkSample.prototype.FreeAudio=function( audio ){
	this.free.push( audio );
}

gxtkSample.prototype.AllocAudio=function(){
	var audio;
	while( this.free.length ){
		audio=this.free.pop();
		try{
			audio.currentTime=0;
			return audio;
		}catch( ex ){
			print( "AUDIO ERROR1!" );
		}
	}
	
	//Max out?
	if( this.insts.length==8 ) return null;
	
	audio=new Audio( this.audio.src );
	
	//yucky loop handler for firefox!
	//
	audio.addEventListener( 'ended',function(){
		if( this.loop ){
			try{
				this.currentTime=0;
				this.play();
			}catch( ex ){
				print( "AUDIO ERROR2!" );
			}
		}
	},false );

	this.insts.push( audio );
	return audio;
}

gxtkSample.prototype.Discard=function(){
}


function BBThread(){
	this.result=null;
	this.running=false;
}

BBThread.prototype.Start=function(){
	this.result=null;
	this.running=true;
	this.Run__UNSAFE__();
}

BBThread.prototype.IsRunning=function(){
	return this.running;
}

BBThread.prototype.Result=function(){
	return this.result;
}

BBThread.prototype.Run__UNSAFE__=function(){
	this.running=false;
}


function BBAsyncImageLoaderThread(){
	this._running=false;
}

BBAsyncImageLoaderThread.prototype.Start=function(){

	var thread=this;
	var image=new Image();

	image.onload=function( e ){
		image.meta_width=image.width;
		image.meta_height=image.height;
		thread._surface=new gxtkSurface( image,thread._device )
		thread._running=false;
	}
	
	image.onerror=function( e ){
		thread._surface=null;
		thread._running=false;
	}
	
	thread._running=true;
	
	image.src=BBGame.Game().PathToUrl( thread._path );
}

BBAsyncImageLoaderThread.prototype.IsRunning=function(){
	return this._running;
}



function BBAsyncSoundLoaderThread(){
}

BBAsyncSoundLoaderThread.prototype.Start=function(){
	this._sample=this._device.LoadSample( this._path );
}

BBAsyncSoundLoaderThread.prototype.IsRunning=function(){
	return false;
}

function c_App(){
	Object.call(this);
}
c_App.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<104>";
	if((bb_app__app)!=null){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<104>";
		error("App has already been created");
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<105>";
	bb_app__app=this;
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<106>";
	bb_app__delegate=c_GameDelegate.m_new.call(new c_GameDelegate);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<107>";
	bb_app__game.SetDelegate(bb_app__delegate);
	pop_err();
	return this;
}
c_App.prototype.p_OnCreate=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnSuspend=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnResume=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnUpdate=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnLoading=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnRender=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnClose=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<129>";
	bb_app_EndApp();
	pop_err();
	return 0;
}
c_App.prototype.p_OnBack=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<133>";
	this.p_OnClose();
	pop_err();
	return 0;
}
function c_GameApp(){
	c_App.call(this);
	this.m_playerImg=null;
	this.m_enemyImg=null;
	this.m_shotImg=null;
	this.m_pointerImg=null;
	this.m_player=null;
	this.m_enemies=null;
	this.m_shots=null;
	this.m_pointer=null;
	this.m_playerCenter=null;
	this.m_SFX_main_music=null;
}
c_GameApp.prototype=extend_class(c_App);
c_GameApp.m_new=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<18>";
	c_App.m_new.call(this);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<18>";
	pop_err();
	return this;
}
c_GameApp.prototype.p_OnCreate=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<34>";
	bb_app_SetUpdateRate(60);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<36>";
	this.m_playerImg=bb_graphics_LoadImage("player.png",1,c_Image.m_DefaultFlags);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<37>";
	this.m_enemyImg=bb_graphics_LoadImage("enemy.png",1,c_Image.m_DefaultFlags);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<38>";
	this.m_shotImg=bb_graphics_LoadImage("shot.png",1,c_Image.m_DefaultFlags);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<39>";
	this.m_pointerImg=bb_graphics_LoadImage("pointer.png",1,c_Image.m_DefaultFlags);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<41>";
	this.m_player=c_Player1.m_new.call(new c_Player1,this.m_playerImg,10.0,390.0);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<42>";
	this.m_enemies=c_List.m_new.call(new c_List);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<43>";
	this.m_shots=c_List2.m_new.call(new c_List2);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<44>";
	this.m_pointer=c_Pointer.m_new.call(new c_Pointer,this.m_pointerImg);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<46>";
	this.m_playerCenter=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<48>";
	this.m_SFX_main_music=bb_audio_LoadSound("FromHere.ogg");
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<49>";
	bb_audio_PlaySound(this.m_SFX_main_music,0,0);
	pop_err();
	return 0;
}
c_GameApp.prototype.p_CheckCollisions=function(t_player,t_enemies,t_shots){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<116>";
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<116>";
	var t_=t_enemies.p_ObjectEnumerator();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<116>";
	while(t_.p_HasNext()){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<116>";
		var t_enemy=t_.p_NextObject();
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<117>";
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<117>";
		var t_2=t_shots.p_ObjectEnumerator();
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<117>";
		while(t_2.p_HasNext()){
			err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<117>";
			var t_shot=t_2.p_NextObject();
		}
	}
	pop_err();
	return 0;
}
c_GameApp.prototype.p_OnUpdate=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<53>";
	this.p_CheckCollisions(this.m_player,this.m_enemies,this.m_shots);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<56>";
	if(bb_squares_CollidingBelow(this.m_player)){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<57>";
		dbg_object(dbg_object(this.m_player).m_position).m_Y=408.0;
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<59>";
		if((bb_input_KeyDown(38))!=0){
			err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<60>";
			this.m_player.p_Jump();
		}
	}else{
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<63>";
		dbg_object(dbg_object(this.m_player).m_position).m_Y=dbg_object(dbg_object(this.m_player).m_position).m_Y+1.0;
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<66>";
	if(dbg_object(this.m_player).m_isJumping){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<67>";
		this.m_player.p_Jumping();
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<70>";
	if((bb_input_KeyDown(37))!=0){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<71>";
		dbg_object(dbg_object(this.m_player).m_position).m_X=dbg_object(dbg_object(this.m_player).m_position).m_X-7.0;
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<73>";
	if((bb_input_KeyDown(39))!=0){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<74>";
		dbg_object(dbg_object(this.m_player).m_position).m_X=dbg_object(dbg_object(this.m_player).m_position).m_X+7.0;
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<78>";
	c_Enemy.m_RandomEnemySpawn(this.m_enemies,this.m_enemyImg);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<80>";
	dbg_object(this.m_playerCenter).m_X=((dbg_object(this.m_player).m_image.p_Width()/2)|0);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<81>";
	dbg_object(this.m_playerCenter).m_Y=((dbg_object(this.m_player).m_image.p_Height()/2)|0);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<83>";
	if((bb_input_MouseHit(0))!=0){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<85>";
		var t_shotFinalPositionX=bb_input_MouseX();
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<86>";
		var t_shotFinalPositionY=bb_input_MouseY();
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<88>";
		this.m_shots.p_AddLast2(c_Shot.m_new.call(new c_Shot,this.m_shotImg,((dbg_object(dbg_object(this.m_player).m_position).m_X+dbg_object(this.m_playerCenter).m_X)|0),((dbg_object(dbg_object(this.m_player).m_position).m_Y+dbg_object(this.m_playerCenter).m_Y)|0),((t_shotFinalPositionX)|0),((t_shotFinalPositionY)|0)));
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<91>";
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<91>";
	var t_=this.m_shots.p_ObjectEnumerator();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<91>";
	while(t_.p_HasNext()){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<91>";
		var t_shot=t_.p_NextObject();
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<92>";
		t_shot.p_Update();
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<95>";
	this.m_pointer.p_Update2(dbg_object(dbg_object(this.m_player).m_position).m_X+dbg_object(this.m_playerCenter).m_X,dbg_object(dbg_object(this.m_player).m_position).m_Y+dbg_object(this.m_playerCenter).m_Y,((bb_input_MouseX())|0),((bb_input_MouseY())|0));
	pop_err();
	return 0;
}
c_GameApp.prototype.p_OnRender=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<99>";
	bb_graphics_Cls(0.0,0.0,0.0);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<101>";
	this.m_player.p_Draw();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<102>";
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<102>";
	var t_=this.m_enemies.p_ObjectEnumerator();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<102>";
	while(t_.p_HasNext()){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<102>";
		var t_enemy=t_.p_NextObject();
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<103>";
		t_enemy.p_Draw();
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<105>";
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<105>";
	var t_2=this.m_shots.p_ObjectEnumerator();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<105>";
	while(t_2.p_HasNext()){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<105>";
		var t_shot=t_2.p_NextObject();
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<106>";
		t_shot.p_Draw();
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<109>";
	bb_graphics_SetColor(32.0,64.0,128.0);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<110>";
	bb_graphics_DrawRect(0.0,440.0,640.0,40.0);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<112>";
	this.m_pointer.p_Draw();
	pop_err();
	return 0;
}
var bb_app__app=null;
function c_GameDelegate(){
	BBGameDelegate.call(this);
	this.m__graphics=null;
	this.m__audio=null;
	this.m__input=null;
}
c_GameDelegate.prototype=extend_class(BBGameDelegate);
c_GameDelegate.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<24>";
	pop_err();
	return this;
}
c_GameDelegate.prototype.StartGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<33>";
	this.m__graphics=(new gxtkGraphics);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<34>";
	bb_graphics_SetGraphicsDevice(this.m__graphics);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<35>";
	bb_graphics_SetFont(null,32);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<37>";
	this.m__audio=(new gxtkAudio);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<38>";
	bb_audio_SetAudioDevice(this.m__audio);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<40>";
	this.m__input=c_InputDevice.m_new.call(new c_InputDevice);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<41>";
	bb_input_SetInputDevice(this.m__input);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<43>";
	bb_app__app.p_OnCreate();
	pop_err();
}
c_GameDelegate.prototype.SuspendGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<47>";
	bb_app__app.p_OnSuspend();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<48>";
	this.m__audio.Suspend();
	pop_err();
}
c_GameDelegate.prototype.ResumeGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<52>";
	this.m__audio.Resume();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<53>";
	bb_app__app.p_OnResume();
	pop_err();
}
c_GameDelegate.prototype.UpdateGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<57>";
	this.m__input.p_BeginUpdate();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<58>";
	bb_app__app.p_OnUpdate();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<59>";
	this.m__input.p_EndUpdate();
	pop_err();
}
c_GameDelegate.prototype.RenderGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<63>";
	var t_mode=this.m__graphics.BeginRender();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<64>";
	if((t_mode)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<64>";
		bb_graphics_BeginRender();
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<65>";
	if(t_mode==2){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<65>";
		bb_app__app.p_OnLoading();
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<65>";
		bb_app__app.p_OnRender();
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<66>";
	if((t_mode)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<66>";
		bb_graphics_EndRender();
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<67>";
	this.m__graphics.EndRender();
	pop_err();
}
c_GameDelegate.prototype.KeyEvent=function(t_event,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<71>";
	this.m__input.p_KeyEvent(t_event,t_data);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<72>";
	if(t_event!=1){
		pop_err();
		return;
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<73>";
	var t_1=t_data;
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<74>";
	if(t_1==432){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<75>";
		bb_app__app.p_OnClose();
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<76>";
		if(t_1==416){
			err_info="C:/MonkeyX77a/modules/mojo/app.monkey<77>";
			bb_app__app.p_OnBack();
		}
	}
	pop_err();
}
c_GameDelegate.prototype.MouseEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<82>";
	this.m__input.p_MouseEvent(t_event,t_data,t_x,t_y);
	pop_err();
}
c_GameDelegate.prototype.TouchEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<86>";
	this.m__input.p_TouchEvent(t_event,t_data,t_x,t_y);
	pop_err();
}
c_GameDelegate.prototype.MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<90>";
	this.m__input.p_MotionEvent(t_event,t_data,t_x,t_y,t_z);
	pop_err();
}
c_GameDelegate.prototype.DiscardGraphics=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<94>";
	this.m__graphics.DiscardGraphics();
	pop_err();
}
var bb_app__delegate=null;
var bb_app__game=null;
function bbMain(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<15>";
	c_GameApp.m_new.call(new c_GameApp);
	pop_err();
	return 0;
}
var bb_graphics_device=null;
function bb_graphics_SetGraphicsDevice(t_dev){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<59>";
	bb_graphics_device=t_dev;
	pop_err();
	return 0;
}
function c_Image(){
	Object.call(this);
	this.m_surface=null;
	this.m_width=0;
	this.m_height=0;
	this.m_frames=[];
	this.m_flags=0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_source=null;
}
c_Image.m_DefaultFlags=0;
c_Image.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<66>";
	pop_err();
	return this;
}
c_Image.prototype.p_SetHandle=function(t_tx,t_ty){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<110>";
	dbg_object(this).m_tx=t_tx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<111>";
	dbg_object(this).m_ty=t_ty;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<112>";
	dbg_object(this).m_flags=dbg_object(this).m_flags&-2;
	pop_err();
	return 0;
}
c_Image.prototype.p_ApplyFlags=function(t_iflags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<188>";
	this.m_flags=t_iflags;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<190>";
	if((this.m_flags&2)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		var t_=this.m_frames;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		var t_2=0;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		while(t_2<t_.length){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
			var t_f=dbg_array(t_,t_2)[dbg_index];
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
			t_2=t_2+1;
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<192>";
			dbg_object(t_f).m_x+=1;
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<194>";
		this.m_width-=2;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<197>";
	if((this.m_flags&4)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		var t_3=this.m_frames;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		var t_4=0;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		while(t_4<t_3.length){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
			var t_f2=dbg_array(t_3,t_4)[dbg_index];
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
			t_4=t_4+1;
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<199>";
			dbg_object(t_f2).m_y+=1;
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<201>";
		this.m_height-=2;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<204>";
	if((this.m_flags&1)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<205>";
		this.p_SetHandle((this.m_width)/2.0,(this.m_height)/2.0);
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<208>";
	if(this.m_frames.length==1 && dbg_object(dbg_array(this.m_frames,0)[dbg_index]).m_x==0 && dbg_object(dbg_array(this.m_frames,0)[dbg_index]).m_y==0 && this.m_width==this.m_surface.Width() && this.m_height==this.m_surface.Height()){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<209>";
		this.m_flags|=65536;
	}
	pop_err();
	return 0;
}
c_Image.prototype.p_Init=function(t_surf,t_nframes,t_iflags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<146>";
	this.m_surface=t_surf;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<148>";
	this.m_width=((this.m_surface.Width()/t_nframes)|0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<149>";
	this.m_height=this.m_surface.Height();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<151>";
	this.m_frames=new_object_array(t_nframes);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<152>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<153>";
		dbg_array(this.m_frames,t_i)[dbg_index]=c_Frame.m_new.call(new c_Frame,t_i*this.m_width,0)
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<156>";
	this.p_ApplyFlags(t_iflags);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<157>";
	pop_err();
	return this;
}
c_Image.prototype.p_Init2=function(t_surf,t_x,t_y,t_iwidth,t_iheight,t_nframes,t_iflags,t_src,t_srcx,t_srcy,t_srcw,t_srch){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<161>";
	this.m_surface=t_surf;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<162>";
	this.m_source=t_src;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<164>";
	this.m_width=t_iwidth;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<165>";
	this.m_height=t_iheight;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<167>";
	this.m_frames=new_object_array(t_nframes);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<169>";
	var t_ix=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<169>";
	var t_iy=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<171>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<172>";
		if(t_ix+this.m_width>t_srcw){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<173>";
			t_ix=0;
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<174>";
			t_iy+=this.m_height;
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<176>";
		if(t_ix+this.m_width>t_srcw || t_iy+this.m_height>t_srch){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<177>";
			error("Image frame outside surface");
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<179>";
		dbg_array(this.m_frames,t_i)[dbg_index]=c_Frame.m_new.call(new c_Frame,t_ix+t_srcx,t_iy+t_srcy)
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<180>";
		t_ix+=this.m_width;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<183>";
	this.p_ApplyFlags(t_iflags);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<184>";
	pop_err();
	return this;
}
c_Image.prototype.p_Width=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<77>";
	pop_err();
	return this.m_width;
}
c_Image.prototype.p_Height=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<81>";
	pop_err();
	return this.m_height;
}
function c_GraphicsContext(){
	Object.call(this);
	this.m_defaultFont=null;
	this.m_font=null;
	this.m_firstChar=0;
	this.m_matrixSp=0;
	this.m_ix=1.0;
	this.m_iy=.0;
	this.m_jx=.0;
	this.m_jy=1.0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_tformed=0;
	this.m_matDirty=0;
	this.m_color_r=.0;
	this.m_color_g=.0;
	this.m_color_b=.0;
	this.m_alpha=.0;
	this.m_blend=0;
	this.m_scissor_x=.0;
	this.m_scissor_y=.0;
	this.m_scissor_width=.0;
	this.m_scissor_height=.0;
	this.m_matrixStack=new_number_array(192);
}
c_GraphicsContext.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<25>";
	pop_err();
	return this;
}
c_GraphicsContext.prototype.p_Validate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<36>";
	if((this.m_matDirty)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<37>";
		bb_graphics_renderDevice.SetMatrix(dbg_object(bb_graphics_context).m_ix,dbg_object(bb_graphics_context).m_iy,dbg_object(bb_graphics_context).m_jx,dbg_object(bb_graphics_context).m_jy,dbg_object(bb_graphics_context).m_tx,dbg_object(bb_graphics_context).m_ty);
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<38>";
		this.m_matDirty=0;
	}
	pop_err();
	return 0;
}
var bb_graphics_context=null;
function bb_data_FixDataPath(t_path){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<3>";
	var t_i=t_path.indexOf(":/",0);
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<4>";
	if(t_i!=-1 && t_path.indexOf("/",0)==t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/data.monkey<4>";
		pop_err();
		return t_path;
	}
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<5>";
	if(string_startswith(t_path,"./") || string_startswith(t_path,"/")){
		err_info="C:/MonkeyX77a/modules/mojo/data.monkey<5>";
		pop_err();
		return t_path;
	}
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<6>";
	var t_="monkey://data/"+t_path;
	pop_err();
	return t_;
}
function c_Frame(){
	Object.call(this);
	this.m_x=0;
	this.m_y=0;
}
c_Frame.m_new=function(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<19>";
	dbg_object(this).m_x=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<20>";
	dbg_object(this).m_y=t_y;
	pop_err();
	return this;
}
c_Frame.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<14>";
	pop_err();
	return this;
}
function bb_graphics_LoadImage(t_path,t_frameCount,t_flags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<238>";
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<239>";
	if((t_surf)!=null){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<239>";
		var t_=(c_Image.m_new.call(new c_Image)).p_Init(t_surf,t_frameCount,t_flags);
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<243>";
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<244>";
	if((t_surf)!=null){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<244>";
		var t_=(c_Image.m_new.call(new c_Image)).p_Init2(t_surf,0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags,null,0,0,t_surf.Width(),t_surf.Height());
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_graphics_SetFont(t_font,t_firstChar){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<545>";
	if(!((t_font)!=null)){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<546>";
		if(!((dbg_object(bb_graphics_context).m_defaultFont)!=null)){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<547>";
			dbg_object(bb_graphics_context).m_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<549>";
		t_font=dbg_object(bb_graphics_context).m_defaultFont;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<550>";
		t_firstChar=32;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<552>";
	dbg_object(bb_graphics_context).m_font=t_font;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<553>";
	dbg_object(bb_graphics_context).m_firstChar=t_firstChar;
	pop_err();
	return 0;
}
var bb_audio_device=null;
function bb_audio_SetAudioDevice(t_dev){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<18>";
	bb_audio_device=t_dev;
	pop_err();
	return 0;
}
function c_InputDevice(){
	Object.call(this);
	this.m__joyStates=new_object_array(4);
	this.m__keyDown=new_bool_array(512);
	this.m__keyHitPut=0;
	this.m__keyHitQueue=new_number_array(33);
	this.m__keyHit=new_number_array(512);
	this.m__charGet=0;
	this.m__charPut=0;
	this.m__charQueue=new_number_array(32);
	this.m__mouseX=.0;
	this.m__mouseY=.0;
	this.m__touchX=new_number_array(32);
	this.m__touchY=new_number_array(32);
	this.m__accelX=.0;
	this.m__accelY=.0;
	this.m__accelZ=.0;
}
c_InputDevice.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<22>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<23>";
		dbg_array(this.m__joyStates,t_i)[dbg_index]=c_JoyState.m_new.call(new c_JoyState)
	}
	pop_err();
	return this;
}
c_InputDevice.prototype.p_PutKeyHit=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<233>";
	if(this.m__keyHitPut==this.m__keyHitQueue.length){
		pop_err();
		return;
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<234>";
	dbg_array(this.m__keyHit,t_key)[dbg_index]+=1
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<235>";
	dbg_array(this.m__keyHitQueue,this.m__keyHitPut)[dbg_index]=t_key
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<236>";
	this.m__keyHitPut+=1;
	pop_err();
}
c_InputDevice.prototype.p_BeginUpdate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<185>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<186>";
		var t_state=dbg_array(this.m__joyStates,t_i)[dbg_index];
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<187>";
		if(!BBGame.Game().PollJoystick(t_i,dbg_object(t_state).m_joyx,dbg_object(t_state).m_joyy,dbg_object(t_state).m_joyz,dbg_object(t_state).m_buttons)){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<187>";
			break;
		}
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<188>";
		for(var t_j=0;t_j<32;t_j=t_j+1){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<189>";
			var t_key=256+t_i*32+t_j;
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<190>";
			if(dbg_array(dbg_object(t_state).m_buttons,t_j)[dbg_index]){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<191>";
				if(!dbg_array(this.m__keyDown,t_key)[dbg_index]){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<192>";
					dbg_array(this.m__keyDown,t_key)[dbg_index]=true
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<193>";
					this.p_PutKeyHit(t_key);
				}
			}else{
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<196>";
				dbg_array(this.m__keyDown,t_key)[dbg_index]=false
			}
		}
	}
	pop_err();
}
c_InputDevice.prototype.p_EndUpdate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<203>";
	for(var t_i=0;t_i<this.m__keyHitPut;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<204>";
		dbg_array(this.m__keyHit,dbg_array(this.m__keyHitQueue,t_i)[dbg_index])[dbg_index]=0
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<206>";
	this.m__keyHitPut=0;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<207>";
	this.m__charGet=0;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<208>";
	this.m__charPut=0;
	pop_err();
}
c_InputDevice.prototype.p_KeyEvent=function(t_event,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<107>";
	var t_1=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<108>";
	if(t_1==1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<109>";
		if(!dbg_array(this.m__keyDown,t_data)[dbg_index]){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<110>";
			dbg_array(this.m__keyDown,t_data)[dbg_index]=true
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<111>";
			this.p_PutKeyHit(t_data);
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<112>";
			if(t_data==1){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<113>";
				dbg_array(this.m__keyDown,384)[dbg_index]=true
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<114>";
				this.p_PutKeyHit(384);
			}else{
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<115>";
				if(t_data==384){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<116>";
					dbg_array(this.m__keyDown,1)[dbg_index]=true
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<117>";
					this.p_PutKeyHit(1);
				}
			}
		}
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<120>";
		if(t_1==2){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<121>";
			if(dbg_array(this.m__keyDown,t_data)[dbg_index]){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<122>";
				dbg_array(this.m__keyDown,t_data)[dbg_index]=false
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<123>";
				if(t_data==1){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<124>";
					dbg_array(this.m__keyDown,384)[dbg_index]=false
				}else{
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<125>";
					if(t_data==384){
						err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<126>";
						dbg_array(this.m__keyDown,1)[dbg_index]=false
					}
				}
			}
		}else{
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<129>";
			if(t_1==3){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<130>";
				if(this.m__charPut<this.m__charQueue.length){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<131>";
					dbg_array(this.m__charQueue,this.m__charPut)[dbg_index]=t_data
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<132>";
					this.m__charPut+=1;
				}
			}
		}
	}
	pop_err();
}
c_InputDevice.prototype.p_MouseEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<138>";
	var t_2=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<139>";
	if(t_2==4){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<140>";
		this.p_KeyEvent(1,1+t_data);
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<141>";
		if(t_2==5){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<142>";
			this.p_KeyEvent(2,1+t_data);
			pop_err();
			return;
		}else{
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<144>";
			if(t_2==6){
			}else{
				pop_err();
				return;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<148>";
	this.m__mouseX=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<149>";
	this.m__mouseY=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<150>";
	dbg_array(this.m__touchX,0)[dbg_index]=t_x
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<151>";
	dbg_array(this.m__touchY,0)[dbg_index]=t_y
	pop_err();
}
c_InputDevice.prototype.p_TouchEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<155>";
	var t_3=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<156>";
	if(t_3==7){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<157>";
		this.p_KeyEvent(1,384+t_data);
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<158>";
		if(t_3==8){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<159>";
			this.p_KeyEvent(2,384+t_data);
			pop_err();
			return;
		}else{
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<161>";
			if(t_3==9){
			}else{
				pop_err();
				return;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<165>";
	dbg_array(this.m__touchX,t_data)[dbg_index]=t_x
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<166>";
	dbg_array(this.m__touchY,t_data)[dbg_index]=t_y
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<167>";
	if(t_data==0){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<168>";
		this.m__mouseX=t_x;
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<169>";
		this.m__mouseY=t_y;
	}
	pop_err();
}
c_InputDevice.prototype.p_MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<174>";
	var t_4=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<175>";
	if(t_4==10){
	}else{
		pop_err();
		return;
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<179>";
	this.m__accelX=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<180>";
	this.m__accelY=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<181>";
	this.m__accelZ=t_z;
	pop_err();
}
c_InputDevice.prototype.p_KeyDown=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<43>";
	if(t_key>0 && t_key<512){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<43>";
		pop_err();
		return dbg_array(this.m__keyDown,t_key)[dbg_index];
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<44>";
	pop_err();
	return false;
}
c_InputDevice.prototype.p_KeyHit=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<48>";
	if(t_key>0 && t_key<512){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<48>";
		pop_err();
		return dbg_array(this.m__keyHit,t_key)[dbg_index];
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<49>";
	pop_err();
	return 0;
}
c_InputDevice.prototype.p_MouseX=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<65>";
	pop_err();
	return this.m__mouseX;
}
c_InputDevice.prototype.p_MouseY=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<69>";
	pop_err();
	return this.m__mouseY;
}
function c_JoyState(){
	Object.call(this);
	this.m_joyx=new_number_array(2);
	this.m_joyy=new_number_array(2);
	this.m_joyz=new_number_array(2);
	this.m_buttons=new_bool_array(32);
}
c_JoyState.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<10>";
	pop_err();
	return this;
}
var bb_input_device=null;
function bb_input_SetInputDevice(t_dev){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<18>";
	bb_input_device=t_dev;
	pop_err();
	return 0;
}
var bb_graphics_renderDevice=null;
function bb_graphics_SetMatrix(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<311>";
	dbg_object(bb_graphics_context).m_ix=t_ix;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<312>";
	dbg_object(bb_graphics_context).m_iy=t_iy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<313>";
	dbg_object(bb_graphics_context).m_jx=t_jx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<314>";
	dbg_object(bb_graphics_context).m_jy=t_jy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<315>";
	dbg_object(bb_graphics_context).m_tx=t_tx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<316>";
	dbg_object(bb_graphics_context).m_ty=t_ty;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<317>";
	dbg_object(bb_graphics_context).m_tformed=((t_ix!=1.0 || t_iy!=0.0 || t_jx!=0.0 || t_jy!=1.0 || t_tx!=0.0 || t_ty!=0.0)?1:0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<318>";
	dbg_object(bb_graphics_context).m_matDirty=1;
	pop_err();
	return 0;
}
function bb_graphics_SetMatrix2(t_m){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<307>";
	bb_graphics_SetMatrix(dbg_array(t_m,0)[dbg_index],dbg_array(t_m,1)[dbg_index],dbg_array(t_m,2)[dbg_index],dbg_array(t_m,3)[dbg_index],dbg_array(t_m,4)[dbg_index],dbg_array(t_m,5)[dbg_index]);
	pop_err();
	return 0;
}
function bb_graphics_SetColor(t_r,t_g,t_b){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<253>";
	dbg_object(bb_graphics_context).m_color_r=t_r;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<254>";
	dbg_object(bb_graphics_context).m_color_g=t_g;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<255>";
	dbg_object(bb_graphics_context).m_color_b=t_b;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<256>";
	bb_graphics_renderDevice.SetColor(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_SetAlpha(t_alpha){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<270>";
	dbg_object(bb_graphics_context).m_alpha=t_alpha;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<271>";
	bb_graphics_renderDevice.SetAlpha(t_alpha);
	pop_err();
	return 0;
}
function bb_graphics_SetBlend(t_blend){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<279>";
	dbg_object(bb_graphics_context).m_blend=t_blend;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<280>";
	bb_graphics_renderDevice.SetBlend(t_blend);
	pop_err();
	return 0;
}
function bb_graphics_DeviceWidth(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<230>";
	var t_=bb_graphics_device.Width();
	pop_err();
	return t_;
}
function bb_graphics_DeviceHeight(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<234>";
	var t_=bb_graphics_device.Height();
	pop_err();
	return t_;
}
function bb_graphics_SetScissor(t_x,t_y,t_width,t_height){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<288>";
	dbg_object(bb_graphics_context).m_scissor_x=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<289>";
	dbg_object(bb_graphics_context).m_scissor_y=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<290>";
	dbg_object(bb_graphics_context).m_scissor_width=t_width;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<291>";
	dbg_object(bb_graphics_context).m_scissor_height=t_height;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<292>";
	bb_graphics_renderDevice.SetScissor(((t_x)|0),((t_y)|0),((t_width)|0),((t_height)|0));
	pop_err();
	return 0;
}
function bb_graphics_BeginRender(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<216>";
	bb_graphics_renderDevice=bb_graphics_device;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<217>";
	dbg_object(bb_graphics_context).m_matrixSp=0;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<218>";
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<219>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<220>";
	bb_graphics_SetAlpha(1.0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<221>";
	bb_graphics_SetBlend(0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<222>";
	bb_graphics_SetScissor(0.0,0.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	pop_err();
	return 0;
}
function bb_graphics_EndRender(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<226>";
	bb_graphics_renderDevice=null;
	pop_err();
	return 0;
}
function c_BBGameEvent(){
	Object.call(this);
}
function bb_app_EndApp(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<186>";
	error("");
	pop_err();
	return 0;
}
var bb_app__updateRate=0;
function bb_app_SetUpdateRate(t_hertz){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<151>";
	bb_app__updateRate=t_hertz;
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<152>";
	bb_app__game.SetUpdateRate(t_hertz);
	pop_err();
	return 0;
}
function c_Player1(){
	Object.call(this);
	this.m_image=null;
	this.m_position=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	this.m_isJumping=false;
	this.m_yInitialVelocity=50;
	this.m_yVelocity=0;
}
c_Player1.m_new=function(t_img,t_x,t_y){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PlayerClass.monkey<16>";
	this.m_image=t_img;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PlayerClass.monkey<17>";
	dbg_object(this.m_position).m_X=t_x;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PlayerClass.monkey<18>";
	dbg_object(this.m_position).m_Y=t_y;
	pop_err();
	return this;
}
c_Player1.m_new2=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PlayerClass.monkey<4>";
	pop_err();
	return this;
}
c_Player1.prototype.p_Jumping=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PlayerClass.monkey<33>";
	this.m_yVelocity-=5;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PlayerClass.monkey<34>";
	dbg_object(this.m_position).m_Y=dbg_object(this.m_position).m_Y-(this.m_yVelocity);
	pop_err();
}
c_Player1.prototype.p_Jump=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PlayerClass.monkey<26>";
	this.m_yVelocity=this.m_yInitialVelocity;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PlayerClass.monkey<27>";
	this.m_isJumping=true;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PlayerClass.monkey<29>";
	this.p_Jumping();
	pop_err();
}
c_Player1.prototype.p_Draw=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PlayerClass.monkey<22>";
	bb_graphics_DrawImage(this.m_image,dbg_object(this.m_position).m_X,dbg_object(this.m_position).m_Y,0);
	pop_err();
}
function c_Vector(){
	Object.call(this);
	this.m_X=.0;
	this.m_Y=.0;
}
c_Vector.m_new=function(t_x,t_y){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<22>";
	this.m_X=t_x;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<23>";
	this.m_Y=t_y;
	pop_err();
	return this;
}
c_Vector.prototype.p_Length=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<152>";
	var t_=Math.sqrt(this.m_X*this.m_X+this.m_Y*this.m_Y);
	pop_err();
	return t_;
}
c_Vector.prototype.p_Multiply=function(t_Value){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<67>";
	this.m_X*=t_Value;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<68>";
	this.m_Y*=t_Value;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<69>";
	pop_err();
	return this;
}
c_Vector.prototype.p_Length2=function(t_length){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<159>";
	if(t_length==0.0){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<160>";
		this.m_X=0.0;
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<161>";
		this.m_Y=0.0;
		pop_err();
		return;
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<165>";
	if(this.m_X==0.0 && this.m_Y==0.0){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<166>";
		this.m_X=t_length;
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<169>";
	this.p_Normalize();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<170>";
	this.p_Multiply(t_length);
	pop_err();
}
c_Vector.prototype.p_Set=function(t_vector){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<29>";
	this.m_X=dbg_object(t_vector).m_X;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<30>";
	this.m_Y=dbg_object(t_vector).m_Y;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<31>";
	pop_err();
	return this;
}
c_Vector.prototype.p_Set2=function(t_x,t_y){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<34>";
	this.m_X=t_x;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<35>";
	this.m_Y=t_y;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<36>";
	pop_err();
	return this;
}
c_Vector.prototype.p_Normalize=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<137>";
	var t_Length=this.p_Length();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<138>";
	if(t_Length==0.0){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<139>";
		pop_err();
		return this;
	}
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<144>";
	this.p_Set2(this.m_X/t_Length,this.m_Y/t_Length);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<145>";
	pop_err();
	return this;
}
c_Vector.prototype.p_Add=function(t_vector){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<42>";
	this.m_X+=dbg_object(t_vector).m_X;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<43>";
	this.m_Y+=dbg_object(t_vector).m_Y;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/VectorClass.monkey<44>";
	pop_err();
	return this;
}
function c_Enemy(){
	Object.call(this);
	this.m_image=null;
	this.m_x=.0;
	this.m_y=.0;
}
c_Enemy.m_new=function(t_img){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/EnemyClass.monkey<8>";
	dbg_object(this).m_image=t_img;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/EnemyClass.monkey<10>";
	dbg_object(this).m_x=bb_random_Rnd2(0.0,640.0);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/EnemyClass.monkey<11>";
	dbg_object(this).m_y=bb_random_Rnd2(0.0,480.0);
	pop_err();
	return this;
}
c_Enemy.m_new2=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/EnemyClass.monkey<3>";
	pop_err();
	return this;
}
c_Enemy.m_RandomEnemySpawn=function(t_enemies,t_img){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/EnemyClass.monkey<20>";
	var t_rndm=((bb_random_Rnd2(0.0,100.0))|0);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/EnemyClass.monkey<21>";
	if(t_rndm==1){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/EnemyClass.monkey<22>";
		t_enemies.p_AddLast(c_Enemy.m_new.call(new c_Enemy,t_img));
	}
	pop_err();
}
c_Enemy.prototype.p_Draw=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/EnemyClass.monkey<15>";
	bb_graphics_DrawImage(this.m_image,this.m_x,this.m_y,0);
	pop_err();
}
function c_List(){
	Object.call(this);
	this.m__head=(c_HeadNode.m_new.call(new c_HeadNode));
}
c_List.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List.prototype.p_AddLast=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<108>";
	var t_=c_Node.m_new.call(new c_Node,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List.m_new2=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<14>";
		this.p_AddLast(t_t);
	}
	pop_err();
	return this;
}
c_List.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<186>";
	var t_=c_Enumerator.m_new.call(new c_Enumerator,this);
	pop_err();
	return t_;
}
function c_Node(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<261>";
	this.m__succ=t_succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<262>";
	this.m__pred=t_pred;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<263>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<264>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<265>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<258>";
	pop_err();
	return this;
}
function c_HeadNode(){
	c_Node.call(this);
}
c_HeadNode.prototype=extend_class(c_Node);
c_HeadNode.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<310>";
	c_Node.m_new2.call(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<311>";
	this.m__succ=(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<312>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function c_Shot(){
	Object.call(this);
	this.m_image=null;
	this.m_position=null;
	this.m_direction=null;
	this.m_speed=5.0;
}
c_Shot.m_new=function(t_img,t_initialPosX,t_initialPosY,t_mousePosX,t_mousePosY){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/ShotClass.monkey<9>";
	this.m_image=t_img;
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/ShotClass.monkey<11>";
	this.m_position=c_Vector.m_new.call(new c_Vector,(t_initialPosX),(t_initialPosY));
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/ShotClass.monkey<13>";
	this.m_direction=c_Vector.m_new.call(new c_Vector,(t_mousePosX-t_initialPosX),(t_mousePosY-t_initialPosY));
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/ShotClass.monkey<15>";
	this.m_direction=this.m_direction.p_Normalize().p_Multiply(this.m_speed);
	pop_err();
	return this;
}
c_Shot.m_new2=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/ShotClass.monkey<4>";
	pop_err();
	return this;
}
c_Shot.prototype.p_Update=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/ShotClass.monkey<19>";
	this.m_position.p_Add(this.m_direction);
	pop_err();
}
c_Shot.prototype.p_Draw=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/ShotClass.monkey<23>";
	bb_graphics_DrawImage(this.m_image,dbg_object(this.m_position).m_X,dbg_object(this.m_position).m_Y,0);
	pop_err();
}
function c_List2(){
	Object.call(this);
	this.m__head=(c_HeadNode2.m_new.call(new c_HeadNode2));
}
c_List2.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List2.prototype.p_AddLast2=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<108>";
	var t_=c_Node2.m_new.call(new c_Node2,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List2.m_new2=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<14>";
		this.p_AddLast2(t_t);
	}
	pop_err();
	return this;
}
c_List2.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<186>";
	var t_=c_Enumerator2.m_new.call(new c_Enumerator2,this);
	pop_err();
	return t_;
}
function c_Node2(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node2.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<261>";
	this.m__succ=t_succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<262>";
	this.m__pred=t_pred;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<263>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<264>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<265>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node2.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<258>";
	pop_err();
	return this;
}
function c_HeadNode2(){
	c_Node2.call(this);
}
c_HeadNode2.prototype=extend_class(c_Node2);
c_HeadNode2.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<310>";
	c_Node2.m_new2.call(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<311>";
	this.m__succ=(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<312>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function c_Pointer(){
	Object.call(this);
	this.m_image=null;
	this.m_position=null;
	this.m_direction=null;
}
c_Pointer.m_new=function(t_img){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PointerClass.monkey<9>";
	this.m_image=t_img;
	pop_err();
	return this;
}
c_Pointer.m_new2=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PointerClass.monkey<4>";
	pop_err();
	return this;
}
c_Pointer.prototype.p_Update2=function(t_initialPosX,t_initialPosY,t_mousePosX,t_mousePosY){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PointerClass.monkey<13>";
	this.m_position=c_Vector.m_new.call(new c_Vector,t_initialPosX,t_initialPosY);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PointerClass.monkey<15>";
	this.m_direction=c_Vector.m_new.call(new c_Vector,(t_mousePosX)-t_initialPosX,(t_mousePosY)-t_initialPosY);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PointerClass.monkey<17>";
	this.m_direction=this.m_direction.p_Normalize().p_Multiply(50.0);
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PointerClass.monkey<19>";
	this.m_position.p_Add(this.m_direction);
	pop_err();
}
c_Pointer.prototype.p_Draw=function(){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/PointerClass.monkey<23>";
	bb_graphics_DrawImage(this.m_image,dbg_object(this.m_position).m_X-((this.m_image.p_Width()/2)|0),dbg_object(this.m_position).m_Y-((this.m_image.p_Height()/2)|0),0);
	pop_err();
}
function c_Sound(){
	Object.call(this);
	this.m_sample=null;
}
c_Sound.m_new=function(t_sample){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<28>";
	dbg_object(this).m_sample=t_sample;
	pop_err();
	return this;
}
c_Sound.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<25>";
	pop_err();
	return this;
}
function bb_audio_LoadSound(t_path){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<43>";
	var t_sample=bb_audio_device.LoadSample(bb_data_FixDataPath(t_path));
	err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<44>";
	if((t_sample)!=null){
		err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<44>";
		var t_=c_Sound.m_new.call(new c_Sound,t_sample);
		pop_err();
		return t_;
	}
	err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<45>";
	pop_err();
	return null;
}
function bb_audio_PlaySound(t_sound,t_channel,t_flags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<49>";
	if(((t_sound)!=null) && ((dbg_object(t_sound).m_sample)!=null)){
		err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<49>";
		bb_audio_device.PlaySample(dbg_object(t_sound).m_sample,t_channel,t_flags);
	}
	pop_err();
	return 0;
}
function c_Enumerator(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator.m_new=function(t_list){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<326>";
	this.m__list=t_list;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<327>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<323>";
	pop_err();
	return this;
}
c_Enumerator.prototype.p_HasNext=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<331>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<332>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<334>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator.prototype.p_NextObject=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<338>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<339>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<340>";
	pop_err();
	return t_data;
}
function c_Enumerator2(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator2.m_new=function(t_list){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<326>";
	this.m__list=t_list;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<327>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator2.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<323>";
	pop_err();
	return this;
}
c_Enumerator2.prototype.p_HasNext=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<331>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<332>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<334>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator2.prototype.p_NextObject=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<338>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<339>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<340>";
	pop_err();
	return t_data;
}
function bb_squares_CollidingBelow(t_obj){
	push_err();
	err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<127>";
	if(dbg_object(dbg_object(t_obj).m_position).m_Y+32.0>=440.0){
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<128>";
		dbg_object(t_obj).m_isJumping=false;
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<129>";
		pop_err();
		return true;
	}else{
		err_info="C:/Users/aprieto.VMBCORP/Dropbox/PROJECTS/_Monkey-Bananas_/squares/squares.monkey<131>";
		pop_err();
		return false;
	}
}
function bb_input_KeyDown(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<36>";
	var t_=((bb_input_device.p_KeyDown(t_key))?1:0);
	pop_err();
	return t_;
}
var bb_random_Seed=0;
function bb_random_Rnd(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/random.monkey<21>";
	bb_random_Seed=bb_random_Seed*1664525+1013904223|0;
	err_info="C:/MonkeyX77a/modules/monkey/random.monkey<22>";
	var t_=(bb_random_Seed>>8&16777215)/16777216.0;
	pop_err();
	return t_;
}
function bb_random_Rnd2(t_low,t_high){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/random.monkey<30>";
	var t_=bb_random_Rnd3(t_high-t_low)+t_low;
	pop_err();
	return t_;
}
function bb_random_Rnd3(t_range){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/random.monkey<26>";
	var t_=bb_random_Rnd()*t_range;
	pop_err();
	return t_;
}
function bb_input_MouseHit(t_button){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<66>";
	var t_=bb_input_device.p_KeyHit(1+t_button);
	pop_err();
	return t_;
}
function bb_input_MouseX(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<54>";
	var t_=bb_input_device.p_MouseX();
	pop_err();
	return t_;
}
function bb_input_MouseY(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<58>";
	var t_=bb_input_device.p_MouseY();
	pop_err();
	return t_;
}
function bb_graphics_DebugRenderDevice(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<49>";
	if(!((bb_graphics_renderDevice)!=null)){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<49>";
		error("Rendering operations can only be performed inside OnRender");
	}
	pop_err();
	return 0;
}
function bb_graphics_Cls(t_r,t_g,t_b){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<376>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<378>";
	bb_graphics_renderDevice.Cls(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_DrawImage(t_image,t_x,t_y,t_frame){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<449>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<450>";
	if(t_frame<0 || t_frame>=dbg_object(t_image).m_frames.length){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<450>";
		error("Invalid image frame");
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<453>";
	var t_f=dbg_array(dbg_object(t_image).m_frames,t_frame)[dbg_index];
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<455>";
	bb_graphics_context.p_Validate();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<457>";
	if((dbg_object(t_image).m_flags&65536)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<458>";
		bb_graphics_renderDevice.DrawSurface(dbg_object(t_image).m_surface,t_x-dbg_object(t_image).m_tx,t_y-dbg_object(t_image).m_ty);
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<460>";
		bb_graphics_renderDevice.DrawSurface2(dbg_object(t_image).m_surface,t_x-dbg_object(t_image).m_tx,t_y-dbg_object(t_image).m_ty,dbg_object(t_f).m_x,dbg_object(t_f).m_y,dbg_object(t_image).m_width,dbg_object(t_image).m_height);
	}
	pop_err();
	return 0;
}
function bb_graphics_PushMatrix(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<332>";
	var t_sp=dbg_object(bb_graphics_context).m_matrixSp;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<333>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+0)[dbg_index]=dbg_object(bb_graphics_context).m_ix
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<334>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+1)[dbg_index]=dbg_object(bb_graphics_context).m_iy
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<335>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+2)[dbg_index]=dbg_object(bb_graphics_context).m_jx
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<336>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+3)[dbg_index]=dbg_object(bb_graphics_context).m_jy
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<337>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+4)[dbg_index]=dbg_object(bb_graphics_context).m_tx
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<338>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+5)[dbg_index]=dbg_object(bb_graphics_context).m_ty
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<339>";
	dbg_object(bb_graphics_context).m_matrixSp=t_sp+6;
	pop_err();
	return 0;
}
function bb_graphics_Transform(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<353>";
	var t_ix2=t_ix*dbg_object(bb_graphics_context).m_ix+t_iy*dbg_object(bb_graphics_context).m_jx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<354>";
	var t_iy2=t_ix*dbg_object(bb_graphics_context).m_iy+t_iy*dbg_object(bb_graphics_context).m_jy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<355>";
	var t_jx2=t_jx*dbg_object(bb_graphics_context).m_ix+t_jy*dbg_object(bb_graphics_context).m_jx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<356>";
	var t_jy2=t_jx*dbg_object(bb_graphics_context).m_iy+t_jy*dbg_object(bb_graphics_context).m_jy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<357>";
	var t_tx2=t_tx*dbg_object(bb_graphics_context).m_ix+t_ty*dbg_object(bb_graphics_context).m_jx+dbg_object(bb_graphics_context).m_tx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<358>";
	var t_ty2=t_tx*dbg_object(bb_graphics_context).m_iy+t_ty*dbg_object(bb_graphics_context).m_jy+dbg_object(bb_graphics_context).m_ty;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<359>";
	bb_graphics_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
	pop_err();
	return 0;
}
function bb_graphics_Transform2(t_m){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<349>";
	bb_graphics_Transform(dbg_array(t_m,0)[dbg_index],dbg_array(t_m,1)[dbg_index],dbg_array(t_m,2)[dbg_index],dbg_array(t_m,3)[dbg_index],dbg_array(t_m,4)[dbg_index],dbg_array(t_m,5)[dbg_index]);
	pop_err();
	return 0;
}
function bb_graphics_Translate(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<363>";
	bb_graphics_Transform(1.0,0.0,0.0,1.0,t_x,t_y);
	pop_err();
	return 0;
}
function bb_graphics_Rotate(t_angle){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<371>";
	bb_graphics_Transform(Math.cos((t_angle)*D2R),-Math.sin((t_angle)*D2R),Math.sin((t_angle)*D2R),Math.cos((t_angle)*D2R),0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_Scale(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<367>";
	bb_graphics_Transform(t_x,0.0,0.0,t_y,0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_PopMatrix(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<343>";
	var t_sp=dbg_object(bb_graphics_context).m_matrixSp-6;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<344>";
	bb_graphics_SetMatrix(dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+0)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+1)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+2)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+3)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+4)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+5)[dbg_index]);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<345>";
	dbg_object(bb_graphics_context).m_matrixSp=t_sp;
	pop_err();
	return 0;
}
function bb_graphics_DrawImage2(t_image,t_x,t_y,t_rotation,t_scaleX,t_scaleY,t_frame){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<467>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<468>";
	if(t_frame<0 || t_frame>=dbg_object(t_image).m_frames.length){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<468>";
		error("Invalid image frame");
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<471>";
	var t_f=dbg_array(dbg_object(t_image).m_frames,t_frame)[dbg_index];
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<473>";
	bb_graphics_PushMatrix();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<475>";
	bb_graphics_Translate(t_x,t_y);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<476>";
	bb_graphics_Rotate(t_rotation);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<477>";
	bb_graphics_Scale(t_scaleX,t_scaleY);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<479>";
	bb_graphics_Translate(-dbg_object(t_image).m_tx,-dbg_object(t_image).m_ty);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<481>";
	bb_graphics_context.p_Validate();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<483>";
	if((dbg_object(t_image).m_flags&65536)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<484>";
		bb_graphics_renderDevice.DrawSurface(dbg_object(t_image).m_surface,0.0,0.0);
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<486>";
		bb_graphics_renderDevice.DrawSurface2(dbg_object(t_image).m_surface,0.0,0.0,dbg_object(t_f).m_x,dbg_object(t_f).m_y,dbg_object(t_image).m_width,dbg_object(t_image).m_height);
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<489>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
function bb_graphics_DrawRect(t_x,t_y,t_w,t_h){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<391>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<393>";
	bb_graphics_context.p_Validate();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<394>";
	bb_graphics_renderDevice.DrawRect(t_x,t_y,t_w,t_h);
	pop_err();
	return 0;
}
function bbInit(){
	bb_app__app=null;
	bb_app__delegate=null;
	bb_app__game=BBGame.Game();
	bb_graphics_device=null;
	bb_graphics_context=c_GraphicsContext.m_new.call(new c_GraphicsContext);
	c_Image.m_DefaultFlags=0;
	bb_audio_device=null;
	bb_input_device=null;
	bb_graphics_renderDevice=null;
	bb_app__updateRate=0;
	bb_random_Seed=1234;
}
//${TRANSCODE_END}
