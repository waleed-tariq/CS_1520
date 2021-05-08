let name1;
let name2;

let airshipStart1;
let battleshipStart1;
let subStart1;
let airshipEnd1;
let battleshipEnd1;
let subEnd1;

let airshipStart2;
let battleshipStart2;
let subStart2;
let airshipEnd2;
let battleshipEnd2;
let subEnd2;

var gridP1 = [];
var gridE1 = [];

var gridP2 = [];
var gridE2 = [];

var p1Matrix = new Array(10);
var p2Matrix = new Array(10);

var aShip1 = 5;
var bShip1 = 4;
var sShip1 = 3;
var hit1 = 0;
var score1 = 0;

var aShip2 = 5;
var bShip2 = 4;
var sShip2 = 3;
var hit2 = 0;
var score2 = 0;

var pTurn = 1;

var scoreArray = [];
scoreArray.length= 10;

var regex = /([ABS]?:*[(]*[A-J]{1}\d{1}-[A-J]{1}\d{1}[)]*;?\s*){3}/gm;
var regexSplit = /\W+/gm;

var splitter1;
var splitter2;


function player2Entry() {
	var p1Entry = document.getElementById("startScreen");
	p1Entry.style.display="none";
	var p2Entry = document.getElementById("startScreen2");
	p2Entry.style.display="inline-block";

	var startGame = document.getElementById("startGame");
	startGame.setAttribute("onclick","buttonPress()");
}

function buttonPress() {

	var startScreen = document.getElementById("startScreen");
	startScreen.style.display="none";

	var startScreen2 = document.getElementById("startScreen2");
	startScreen2.style.display = "none";

	var shipString1 = document.getElementById("shipString1").value;

	var match = shipString1.search(regex);

	splitter1 = shipString1.split(regexSplit);

	var shipString2 = document.getElementById("shipString2").value;

	var match = shipString2.search(regex);

	splitter2 = shipString2.split(regexSplit);


	name1 = document.getElementById("name1").value;
	name2 = document.getElementById("name2").value;

	if (splitter1[0]=="A") {
		airshipStart1 = splitter1[1];
		airshipEnd1 = splitter1[2];
		if (splitter1[3]=="B") {
			battleshipStart1 = splitter1[4];
			battleshipEnd1 = splitter1[5];
			subStart1 = splitter1[7];
			subEnd1	= splitter1[8];
		}
		else if (splitter1[3]=="S") {
			subStart1 = splitter1[4];
			subEnd1	= splitter1[5];
			battleshipStart1 = splitter1[7];
			battleshipEnd1 = splitter1[8];
		}
	}
	else if (splitter1[0] == "B") {
		battleshipStart1 = splitter1[1];
		battleshipEnd1 = splitter1[2];
		if (splitter1[3]=="A") {
			airshipStart1 = splitter1[4];
			airshipEnd1 = splitter1[5];
			subStart1 = splitter1[7];
			subEnd1	= splitter1[8];
		}
		else if (splitter1[3]=="S") {
			subStart1 = splitter1[4];
			subEnd1	= splitter1[5];
			airshipStart1 = splitter1[7];
			airshipEnd1 = splitter1[8];
		}
	}
	else if (splitter1[0] == "S") {
		subStart1 = splitter1[1];
		subEnd1	= splitter1[2];
		if (splitter1[3]=="A") {
			airshipStart1 = splitter1[4];
			airshipEnd1 = splitter1[5];
			battleshipStart1 = splitter1[7];
			battleshipEnd1 = splitter1[8];
		}
		else if (splitter1[3]=="B") {
			battleshipStart1 = splitter1[4];
			battleshipEnd1 = splitter1[5];
			airshipStart1 = splitter1[7];
			airshipEnd1 = splitter1[8];
		}
	}

	if (splitter2[0]=="A") {
		airshipStart2 = splitter2[1];
		airshipEnd2 = splitter2[2];
		if (splitter2[3]=="B") {
			battleshipStart2 = splitter2[4];
			battleshipEnd2 = splitter2[5];
			subStart2 = splitter2[7];
			subEnd2	= splitter2[8];
		}
		else if (splitter2[3]=="S") {
			subStart2 = splitter2[4];
			subEnd2	= splitter2[5];
			battleshipStart2 = splitter2[7];
			battleshipEnd2 = splitter2[8];
		}
	}
	else if (splitter2[0] == "B") {
		battleshipStart2 = splitter2[1];
		battleshipEnd2 = splitter2[2];
		if (splitter2[3]=="A") {
			airshipStart2 = splitter2[4];
			airshipEnd2 = splitter2[5];
			subStart2 = splitter2[7];
			subEnd2	= splitter2[8];
		}
		else if (splitter2[3]=="S") {
			subStart2 = splitter2[4];
			subEnd2	= splitter2[5];
			airshipStart2 = splitter2[7];
			airshipEnd2 = splitter2[8];
		}
	}
	else if (splitter2[0] == "S") {
		subStart2 = splitter2[1];
		subEnd2	= splitter2[2];
		if (splitter1[3]=="A") {
			airshipStart2 = splitter2[4];
			airshipEnd2 = splitter1[5];
			battleshipStart2 = splitter2[7];
			battleshipEnd2 = splitter2[8];
		}
		else if (splitter2[3]=="B") {
			battleshipStart2 = splitter2[4];
			battleshipEnd2 = splitter2[5];
			airshipStart2 = splitter2[7];
			airshipEnd2 = splitter2[8];
		}
	}

	
	player1Board();
	player2Board();

	enemy1Board();
	enemy2Board();

	waitingScreen(pTurn);
	
}

function waitingScreen(pTurn) {

	var middleScreen = document.getElementById("middleScreen");
	middleScreen.style.display = "inline-block";

	var overlay = document.getElementById("overlay");
	overlay.style.display="none";

	var p2Board = document.getElementById("player2Board");
	p2Board.style.display="none";
	var header = document.getElementById("header");
	header.style.display="none";
	var e2Board = document.getElementById("enemy2Board");
	e2Board.style.display="none";

	var p1Board = document.getElementById("player1Board");
	p1Board.style.display="none";
	var header2 = document.getElementById("header2");
	header2.style.display="none";
	var e1Board = document.getElementById("enemy1Board");
	e1Board.style.display="none";

	var playerTurn = document.getElementById("turnName");

	if (pTurn == 1) {
		playerTurn.innerText = "Click button to begin "+name1+"'s turn";
	}
	else {
		playerTurn.innerText ="Click button to begin "+name2+"'s turn";
	}
	
	var turnButton = document.getElementById("playerTurn");
	turnButton.setAttribute("onclick","displayGrid("+pTurn+")");

}

function displayGrid(pTurn) {
	var middleScreen = document.getElementById("middleScreen");
	middleScreen.style.display = "none";
	if (pTurn == 1) {
		var p1Board = document.getElementById("player1Board");
		p1Board.style.display="inline-block";
		var header = document.getElementById("header");
		header.style.display="inline-block";
		var e1Board = document.getElementById("enemy1Board");
		e1Board.style.display="inline-block";

	}
	else if (pTurn== 2) {
		var p2Board = document.getElementById("player2Board");
		p2Board.style.display="inline-block";
		var header2 = document.getElementById("header2");
		header2.style.display="inline-block";
		var e2Board = document.getElementById("enemy2Board");
		e2Board.style.display="inline-block";
	}
}

function hashMapping() {
	let letter2NumberMap = new Map();
	letter2NumberMap.set("A",0);
	letter2NumberMap.set("B",1);
	letter2NumberMap.set("C",2);
	letter2NumberMap.set("D",3);
	letter2NumberMap.set("E",4);
	letter2NumberMap.set("F",5);
	letter2NumberMap.set("G",6);
	letter2NumberMap.set("H",7);
	letter2NumberMap.set("I",8);
	letter2NumberMap.set("J",9);
	return letter2NumberMap;
}

function makePlayerGrid(element,grid) {
	var gridWidth = 10;
	var gridHeight = 10;

	for(var x = 0; x < gridHeight; x++)
	{
	    var newTR = document.createElement("tr");
	    element.appendChild(newTR);
	    grid.push([]);
	    for(var y = 0; y < gridWidth; y++)
	    {
	        var newEntry = document.createElement("td");
	        
	        newEntry.setAttribute("name",x+","+y);

	        newTR.appendChild(newEntry);
	        grid[x].push(newEntry);
	    }
	}
	return grid;
}

function makeEnemy1Grid(element,grid,player) {
	var gridWidth = 10;
	var gridHeight = 10;

	for(var y = 0; y < gridHeight; y++)
	{
	    var newTR = document.createElement("tr");
	    element.appendChild(newTR);
	    grid.push([]);
	    for(var x = 0; x < gridWidth; x++)
	    {
	    	var tmpX = x;
	    	var tmpY = y;
	        var newEntry = document.createElement("td");
	        if (player == 1) newEntry.setAttribute("onclick", "start1(this,"+x+","+y+")");
	        else newEntry.setAttribute("onclick", "start2(this,"+x+","+y+")");
	        newEntry.setAttribute("name",x+","+y);
	        newTR.appendChild(newEntry);
	        grid[y].push(newEntry);
	    }
	}
	return grid;
}


function labelPlayerBoard(aStart,aEnd,bStart,bEnd,sStart,sEnd,pGrid,pMatrix,map,grid) {
	var airshipArr = Array.from(aStart);
	var aX1 = map.get(airshipArr[0]);
	var aY1 = airshipArr[1] - 1;

	var airshipArr1 = Array.from(aEnd);
	var aX2 = map.get(airshipArr1[0]);
	var aY2 = airshipArr1[1] - 1;


	for (var i=aX1;i<=aX2;i++){
		for (var j=aY1;j<=aY2;j++) {
			var x = grid[j][i];
			pMatrix[i][j] = 1;
			const airShipLetters = document.createTextNode("A");
			x.appendChild(airShipLetters);
		}
	}

	var battleshipArr = Array.from(bStart);
	var bX1 = map.get(battleshipArr[0]);
	var bY1 = battleshipArr[1] - 1;

	var battleshipArr1 = Array.from(bEnd);
	var bX2 = map.get(battleshipArr1[0]);
	var bY2 = battleshipArr1[1] - 1;


	for (var i=bX1;i<=bX2;i++){
		for (var j=bY1;j<=bY2;j++) {
			var x = grid[j][i];
			pMatrix[i][j] = 2;
			const battleShipLetters = document.createTextNode("B");
			x.appendChild(battleShipLetters);
		}
	}

	var subArr = Array.from(sStart);
	var sX1 = map.get(subArr[0]);
	var sY1 = subArr[1] - 1;

	var subArr1 = Array.from(sEnd);
	var sX2 = map.get(subArr1[0]);
	var sY2 = subArr1[1] - 1;


	for (var i=sX1;i<=sX2;i++){
		for (var j=sY1;j<=sY2;j++) {
			var x = grid[j][i];
			pMatrix[i][j] = 3;
			const subLetters = document.createTextNode("S");
			x.appendChild(subLetters);
		}
	}
}

function player1Board() {

	for (var i = 0; i < p1Matrix.length; i++) {
  		p1Matrix[i] = new Array(10);
	}

	var p1Board = document.getElementById("player1Board");

	var header = document.getElementById("header");
	var h2 = document.createElement("h2");
	var headTxt = document.createTextNode(name1+"'s Turn");
	h2.appendChild(headTxt);
	header.appendChild(h2);


	var p1Grid = document.createElement("table");
	p1Grid.setAttribute("id","p1Grid");

	gridP1 = makePlayerGrid(p1Grid,gridP1);

	// append our ships to the board
	// make hashmap
	var map = hashMapping();

	labelPlayerBoard(airshipStart1,airshipEnd1,battleshipStart1,battleshipEnd1,subStart1,subEnd1,p1Grid,p1Matrix,map,gridP1);
	
	p1Board.appendChild(p1Grid);
	const ya = document.createTextNode("Your Board");
	p1Board.appendChild(ya);

}

function player2Board() {

	for (var i = 0; i < p2Matrix.length; i++) {
  		p2Matrix[i] = new Array(10);
	}

	var p2Board = document.getElementById("player2Board");

	var header = document.getElementById("header2");
	var h2 = document.createElement("h2");
	var headTxt = document.createTextNode(name2+"'s Turn");
	h2.appendChild(headTxt);
	header.appendChild(h2);


	var p2Grid = document.createElement("table");
	p2Grid.setAttribute("id","p2Grid");

	gridP2 = makePlayerGrid(p2Grid,gridP2);

	// append our ships to the board
	// make hashmap
	var map = hashMapping();

	// change the paramters to p2matrix and so on so it looks at the enemies grid
	labelPlayerBoard(airshipStart2,airshipEnd2,battleshipStart2,battleshipEnd2,subStart2,subEnd2,p2Grid,p2Matrix,map,gridP2);
	
	p2Board.appendChild(p2Grid);
	const ya = document.createTextNode("Your Board");
	p2Board.appendChild(ya);

}

function enemy1Board() {

	var e1Board = document.getElementById("enemy1Board");

	var e1Grid = document.createElement("table");
	e1Grid.setAttribute("id","e1Grid");

	gridE2 = makeEnemy1Grid(e1Grid,gridE2,2);

	e1Board.appendChild(e1Grid);
	const ya = document.createTextNode("Target Board");
	e1Board.appendChild(ya);

}

function enemy2Board() {

	var e2Board = document.getElementById("enemy2Board");

	var e2Grid = document.createElement("table");
	e2Grid.setAttribute("id","e2Grid");

	// change the paramters to p1matrix and so on so it looks at the enemies grid
	gridE1 = makeEnemy1Grid(e2Grid,gridE1,1);

	e2Board.appendChild(e2Grid);
	const ya = document.createTextNode("Target Board");
	e2Board.appendChild(ya);

}

function start2(element,x,y) {
	// will check x and y coordinates with enemies board and see if they equal a ship
	// if they do it will change it to red and then check to see if that ship has been eliminated
	// will inform user if it has and then end turn and go to blank function to ask user to switch

	element.removeAttribute("onclick");

	if (p2Matrix[x][y] == 1) {
		element.style.backgroundColor = "red";
		aShip2 = aShip2-1;
		var changeColor = gridP2[y][x];
		changeColor.style.backgroundColor = "red";
		hit2 = hit2+1;
		if (aShip2 == 0 && bShip2 == 0 && sShip2 == 0)
			createOverlay(aShip2,"Airship",1,0,1);

		else 
			createOverlay(aShip2,"Airship",2,0,0);

	}
	else if (p2Matrix[x][y] == 2) {
		element.style.backgroundColor = "red";
		bShip2 = bShip2-1;
		var changeColor = gridP2[y][x];
		changeColor.style.backgroundColor = "red";
		hit2 = hit2+1;
		if (aShip2 == 0 && bShip2 == 0 && sShip2 == 0)
			createOverlay(bShip2,"Airship",1,0,1);
		else
			createOverlay(bShip2,"Battleship",2,0,0);
	}
	else if (p2Matrix[x][y] == 3) {
		element.style.backgroundColor = "red";
		sShip2 = sShip2-1;
		var changeColor = gridP2[y][x];
		changeColor.style.backgroundColor = "red";
		hit2 = hit2+1;
		if (aShip2 == 0 && bShip2 == 0 && sShip2 == 0)
			createOverlay(sShip2,"Airship",1,0,1);
		else
			createOverlay(sShip2,"Submarine",2,0,0);

	}
	else {
		element.style.backgroundColor = "white";
		var changeColor = gridP2[y][x];
		changeColor.style.backgroundColor = "white";
		createOverlay(aShip2,"Airship",2,1,0);
	}
}

function createOverlay(ship,shipType,player,miss,gameover) {
	var overlay;

	overlay = document.getElementById("overlay");

	overlay.style.display="block";
	var txt = document.getElementById("overlayText")


	if (ship == 0 && miss == 0 && gameover == 0) {
		txt.innerText = shipType+" has been sunk";
		var waitButton = document.getElementById("buttonforWait");
		waitButton.setAttribute("onclick","waitingScreen("+player+")");
	}
	else if (miss == 1) {
		txt.innerText = "Miss";
		var waitButton = document.getElementById("buttonforWait");
		waitButton.setAttribute("onclick","waitingScreen("+player+")");
	}
	else if (ship > 0 && miss == 0) {
		txt.innerText = "Hit";
		var waitButton = document.getElementById("buttonforWait");
		waitButton.setAttribute("onclick","waitingScreen("+player+")");
	}
	else {
		txt.innerText = "Game Over! Player " +player+" Wins";
		var waitButton = document.getElementById("buttonforWait");
		waitButton.setAttribute("value", "Go to Scores Page");
		waitButton.setAttribute("onclick","gameover("+player+")");
	}
	

}

function start1(element,x,y) {
	// will check x and y coordinates with enemies board and see if they equal a ship
	// if they do it will change it to red and then check to see if that ship has been eliminated
	// will inform user if it has and then end turn and go to blank function to ask user to switch

	element.removeAttribute("onclick");

	if (p1Matrix[x][y] == 1) {
		element.style.backgroundColor = "red";
		aShip1 = aShip1-1;
		var changeColor = gridP1[y][x];
		changeColor.style.backgroundColor = "red";
		hit1 = hit1+1;
		if (aShip1 == 0 && bShip1 == 0 && sShip1 == 0)
			createOverlay(aShip1,"Airship",2,0,1);
		else
			createOverlay(aShip1,"Airship",1,0,0);

	}
	else if (p1Matrix[x][y] == 2) {
		element.style.backgroundColor = "red";
		bShip1 = bShip1-1;
		var changeColor = gridP1[y][x];
		changeColor.style.backgroundColor = "red";
		hit1 = hit1+1;
		if (aShip1 == 0 && bShip1 == 0 && sShip1 == 0)
			createOverlay(bShip1,"Airship",2,0,1);
		else
			createOverlay(bShip1,"battleship",1,0,0);
	}
	else if (p1Matrix[x][y] == 3) {
		element.style.backgroundColor = "red";
		sShip1 = sShip1-1;
		var changeColor = gridP1[y][x];
		changeColor.style.backgroundColor = "red";
		hit1 = hit1+1;
		if (aShip1 == 0 && bShip1 == 0 && sShip1 == 0)
			createOverlay(sShip1,"Airship",2,0,1);
		else
			createOverlay(sShip1,"Submarine",1,0,0);
	}
	else {
		element.style.backgroundColor = "white";
		var changeColor = gridP1[y][x];
		changeColor.style.backgroundColor = "white";
		createOverlay(aShip1,"Airship",1,1,0);
	}
}

function gameover(player) {
	//localStorage.clear();
	localStorage.removeItem(10)

	var endScreen = document.getElementById("scores")
	endScreen.style.display = "inline-block";

	var over = document.getElementById("overlay");
	over.style.display = "none";

	var middleScreen = document.getElementById("middleScreen");
	middleScreen.style.display = "none";

	var p2Board = document.getElementById("player2Board");
	p2Board.style.display="none";
	var header = document.getElementById("header");
	header.style.display="none";
	var e2Board = document.getElementById("enemy2Board");
	e2Board.style.display="none";

	var p1Board = document.getElementById("player1Board");
	p1Board.style.display="none";
	var header2 = document.getElementById("header2");
	header2.style.display="none";
	var e1Board = document.getElementById("enemy1Board");
	e1Board.style.display="none";

	if (player == 1) {
		score1 = 24-(2*hit1);
		add(score1,name1);
	}
	else {
		score2 = 24-(2*hit2);
		add(score2,name2);
	}
	readLocalData();


}


function readLocalData() {
	// check that storage is supported
	if (typeof(Storage) !== "undefined") {
		theList = document.getElementById("theList");
		for (let i = 0; i < localStorage.length; i++) {
			addListItem(localStorage.getItem(i));
		}
	}
}

function addListItem(newText) {
	const theList = document.getElementById("theList");
	const listItem = document.createElement("li");
	listItem.appendChild(document.createTextNode(newText));
	theList.appendChild(listItem);
}

function add(score,player) {
	var response = score+" "+player;

	if (localStorage.length == 0) {
		scoreArray[0] = response;
		localStorage.setItem(0,response);
	}
	else {
		var index=0;
		for ( index=0;index<localStorage.length;index++) {
			scoreArray[index]=localStorage.getItem(index);
		}
		scoreArray[localStorage.length] = response;
		scoreArray.sort((a, b) => {
	  		let aParts = a.split(' ');
	  		let bParts = b.split(' ');
	  		let aNum = Number.parseInt(aParts[0]);
	  		let bNum = Number.parseInt(bParts[0]);
	  		return bNum - aNum;
		});

		for (var i=0;i<index+1 && i <10;i++) {
			localStorage.setItem(i,scoreArray[i]);
		}
	}
}



function setup() {
	document.getElementById("p2Entry").addEventListener("click",player2Entry);
}

window.addEventListener("load",setup);