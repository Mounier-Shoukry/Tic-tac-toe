
/**
* This code  Developed By Mounier Shoukry
* on 10/10/2016 
* all copy rights are reserved
* for any information Monier.s.gablla@gmail.com
*/

var ticTaxMat;  				  //data structure which holds values
var enableClick=true;			  // allow player to click
var ticksCounter=0;
var player1History='';
var player2History='';
var playerOneScore=0;
var playerTwoScore=0;
var blinkingCells='';
initGame();

function initGame(){
  initMatrix();
  ticksCounter=0;
  enableClick=true;
  player2History=''
  player1History='';
}

function initMatrix(){
	ticTaxMat=[3];
	for(var i=0;i<3;i++){
		ticTaxMat[i]=['','',''];
	}
}

// this function handle clicks from player one
function onCellClick(cell,x,y){
	if(enableClick && ticTaxMat[x][y]==''){
		ticTaxMat[x][y]='x';
		cell.innerHTML=ticTaxMat[x][y];
		enableClick=false;
		++ticksCounter;
		player1History+=x+''+y+',';
		setTimeout(function(){
		if(checkWinner(1)==""){
			player2Play();
		}
		}, 400);
		
			
	}
	
} 



function player2Play(){
	// this function will decide if player2 will defened or attack
	// best position for play is 11,20,22,02,00
	if(ticksCounter>=3){
		player2Defend()
		
	}else{
		var place=chooseTheBestPlace();
		player2HitScreen(place[0],place[1]);
		
	}
	
}

function player2HitScreen(x,y){
	var place=x+''+y;
	ticTaxMat[x][y]='o';
	var cellID="cell_"+place;
	document.getElementById(cellID).innerHTML=ticTaxMat[x][y];
	++ticksCounter;
	player2History+=place+',';
	setTimeout(function(){
	if(checkWinner(2)==''){
		enableClick=true;
	}
	
	}, 200);
	
}

function chooseTheBestPlace(){
	if(ticTaxMat[1][1]==''){
		return "11";
	}else if(ticTaxMat[2][0]==''){
		return "20";
	}else if(ticTaxMat[2][2]==''){
		return "22";
	}else if(ticTaxMat[0][0]==''){
		return "00";
	}
	else if(ticTaxMat[0][2]==''){
		return "02";
	}
	else
		return'';
	
	
}


function player2Defend(){
	//check if he could win using diagonal or column or row
	// if not will defend if other player will win
	var place='';
	if(ticksCounter<=3){
		//will decide to defend or choose the next place according to situation
	 player1CheckedPlaces=player1History.split(",");
	 //defense
		place=checkPoints(player1CheckedPlaces[0],player1CheckedPlaces[1]);
		if(place !='' && ticTaxMat[place[0]][place[1]]==''){
		player2HitScreen(place[0],place[1]);
		}else{
			place='';
		}
	}else{
		player2checkedPlaces=player2History.split(",");
		//attack to win
		if(player2checkedPlaces!=0){
			player2checkedPlaces.pop(player2checkedPlaces.length-1);
			for(var i=0;i<player2checkedPlaces.length;i++){
				for(var j=i+1;j<player2checkedPlaces.length;j++){
					place=checkPoints(player2checkedPlaces[i],player2checkedPlaces[j]);
					if(place!=''&& ticTaxMat[place[0]][place[1]]==''){
						player2HitScreen(place[0],place[1]);
						return;
					}else{
						place='';
					}
				}
			}
		}
		// if couldn't attack to to win he will attack to defend
		if(place==''){
			//attack to defend
			player1CheckedPlaces=player1History.split(",");
			if(player1CheckedPlaces!=0){
			player1CheckedPlaces.pop(player1CheckedPlaces.length-1);
			for(var i=0;i<player1CheckedPlaces.length;i++){
				for(var j=i+1;j<player1CheckedPlaces.length;j++){
					place=checkPoints(player1CheckedPlaces[i],player1CheckedPlaces[j]);
					if(place!=''&& ticTaxMat[place[0]][place[1]]==''){
						player2HitScreen(place[0],place[1]);
						return;
					}else{
						place='';
					}
				}
			}
		}
		
	}
	
	
	}
	// if nothing to defend then choose best place to play
	if(place=='' ){
	  place=chooseTheBestPlace();
	  if(place!=''){
	  player2HitScreen(place[0],place[1]);
	  }
	}	
		
}

function player2Attack(){
	
}

function checkWinner(player){
	var winner='';
	if(ticksCounter>4){
		if(player==1){
			//attack to defend
			player1CheckedPlaces=player1History.split(",");
			if(player1CheckedPlaces!=0){
			player1CheckedPlaces.pop(player1CheckedPlaces.length-1);
			for(var i=0;i<player1CheckedPlaces.length;i++){
				for(var j=i+1;j<player1CheckedPlaces.length;j++){
					place=checkPoints(player1CheckedPlaces[i],player1CheckedPlaces[j]);
					if(place!=''&& ticTaxMat[place[0]][place[1]]=='x'){
						//alert('Player 1 is winning');
						winner=1;
						blinkingCells=place+','+player1CheckedPlaces[i]+','+player1CheckedPlaces[j];
						handleBlinking();
						return handleScore(winner);
					}
				}
			}
		}
			
		}else if(player==2){
			player2checkedPlaces=player2History.split(",");
		if(player2checkedPlaces!=0){
			player2checkedPlaces.pop(player2checkedPlaces.length-1);
			for(var i=0;i<player2checkedPlaces.length;i++){
				for(var j=i+1;j<player2checkedPlaces.length;j++){
					place=checkPoints(player2checkedPlaces[i],player2checkedPlaces[j]);
					if(place!=''&& ticTaxMat[place[0]][place[1]]=='o'){
						//alert('Player 2 is winning');
						winner=2;
						blinkingCells=place+','+player2checkedPlaces[i]+','+player2checkedPlaces[j];
						handleBlinking();
						return  handleScore(winner);
					}
				}
			}
		}
			
		}
		
	}
	return  handleScore(winner);
} 

function checkPoints(place1,place2){
	
	//if two points at the same row
	if(place1[0]==place2[0]){
		return place1[0]+''+guessTheNextNumber(place1[1],place2[1])
	}
	// if two points at the same column
	if(place1[1]==place2[1]){
		return guessTheNextNumber(place1[0],place2[0])+''+place1[1];
		 
	}
	// if the same digonal
	//left diagonal
	if(place1[0]==place1[1]&&place2[0]==place2[1]){
		var temp=guessTheNextNumber(place1[1],place2[1]);
		return temp+''+temp;
	}
	//right diagonal
	if(parseInt(place1[0])+parseInt(place1[1])==2&&parseInt(place2[0])+parseInt(place2[1])==2 ){
		return guessTheNextNumber(place1[0],place2[0])+''+guessTheNextNumber(place1[1],place2[1]);
	}
	return'';
}

function guessTheNextNumber(num1,num2){
	var max= Math.max(num1,num2);
	var min= Math.min(num1,num2);
	if(min==0 && max==1)
		return 2;
	
	if(min==1 && max==2)
		return 0;
	if(min==0 && max==2)
		return 1;
	
}

function handleScore(winner){
	if(winner ==1){
		alert("Player 1 is winner");
		++playerOneScore;
		document.getElementById("player1Score").innerHTML=playerOneScore;
	}else if(winner==2){
		alert("Player 2 is winner");
		++playerTwoScore;
		document.getElementById("player2Score").innerHTML=playerTwoScore;
	}
	if(ticksCounter >=9&&winner==''){
		alert("this is tie");
		winner='tie';
	}
	if(winner!=''){
	setTimeout(function(){
	restartGame();
	
	}, 500);
	}
	return winner;
}

function restartGame(){
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			var cellID="cell_"+i+''+j;
		    document.getElementById(cellID).innerHTML='';
		}
	}
	initGame();
	clearBliniking();
} 

function handleBlinking(){
	
	if(blinkingCells!=''){
		var blinkingPlaces=blinkingCells.split(",");
		for(var i=0;i<blinkingPlaces.length;i++){
			binkingWinner('cell_'+blinkingPlaces[i]);
		}
	}
}

// blink cells for the winner
function binkingWinner(id)
{
	
    var state = false;
    setInterval(function()
        {
            state = !state;
            var color = (state?'red':'green');
            document.getElementById(id).style.backgroundColor = color;
        }, 10);
}

function clearBliniking(){
	for (var i = 1; i < 99999; i++)
        window.clearInterval(i);
	// here we want to clear blinkingCells background then clear blinking cells
	
	var blinkingPlaces=blinkingCells.split(",");
		for(var i=0;i<blinkingPlaces.length;i++){
		document.getElementById('cell_'+blinkingPlaces[i]).style.backgroundColor='white';
		}
	blinkingCells='';
}