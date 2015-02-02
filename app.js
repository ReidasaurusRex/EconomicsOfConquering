$(document).ready(function() {


// *************** Player Constructor    ***************************
function Player(num, styLeft, styTop, coLor) {
	this.num = num;
	this.styLeft = styLeft;
	this.styTop = styTop;
	this.dom = $(".player"+this.num);
	this.dom.css("left", styLeft);
	this.dom.css("top", styTop);
	this.dom.css("background-color", coLor);
	this.coLor = coLor;
	this.moveCounter = 0;
	this.balance = 500;

}
// *****************************************************************

// ****************** Move Function  *******************************
Player.prototype.move = function(thisDom) {
		var self = this;
		// Difference between clicked tile and player left/right value
		var difLeft = Math.abs(parseInt(thisDom.css("left"), 10) - parseInt(this.dom.css("left"), 10));
		// Difference between clicked tile and player top/bottom value
		var difTop = Math.abs(parseInt(thisDom.css("top"), 10)-parseInt(this.dom.css("top"), 10));
		// Max left/right distance allowed
		var leftPar = (difLeft < 120); 
		// Max top/bottom difference allowed
		var topPar = (difTop < 120);
		// Player 1 same top check
		var player1DifTop = Math.abs(parseInt(thisDom.css("top"), 10) - (parseInt(game.player1.dom.css("top"), 10) - 30));
		// Player 1 same left check
		var player1DifLeft = Math.abs(parseInt(thisDom.css("left"), 10) - (parseInt(game.player1.dom.css("left"), 10) - 30));
		// Player 2 same top check
		var player2DifTop = Math.abs(parseInt(thisDom.css("top"), 10) - (parseInt(game.player2.dom.css("top"), 10) - 30));
		// Player 2 same left check
		var player2DifLeft = Math.abs(parseInt(thisDom.css("left"), 10) - (parseInt(game.player2.dom.css("left"), 10) - 30));

		// Moving player depending on turn
		if(game.turnCounter === this.num) { 
			// Ensuring player only moves once
			if (this.moveCounter === 0) {
				// Ensuring player move distance equals one square
				if ((topPar && leftPar) && ((difTop != 30) || (difLeft != 30))) {
					// Ensuring player2 cannot move on top of player1
					if (game.currentPlayer === game.player2) {
						if ((player1DifLeft !== 0) || (player1DifTop !== 0)) {
							game.currentTile = thisDom;
							this.dom.animate({"left": ((parseInt((thisDom.css("left")), 10) + 30))}, 500);
							this.dom.animate({"top": ((parseInt((thisDom.css("top")), 10) + 30))}, 500);
							// thisDom.addClass("player"+this.num+"Owned");
							console.log(game.currentTile);
							// See if state correlating to move counter
							this.moveCounter++;
							// Ensuring purchase prompt doesn't show if player already owns property
							if (!thisDom.hasClass("player"+this.num+"Owned")) {
								$(".purchasePrompt").fadeIn(500);
							}
						}
					}
					if (game.currentPlayer === game.player1) {
						if ((player2DifLeft !== 0) || (player2DifTop !== 0)) {
							game.currentTile = thisDom;
							this.dom.animate({"left": ((parseInt((thisDom.css("left")), 10) + 30))}, 500);
							this.dom.animate({"top": ((parseInt((thisDom.css("top")), 10) + 30))}, 500);
							// thisDom.addClass("player"+this.num+"Owned");
							console.log(game.currentTile);
							// See if state correlating to move counter
							this.moveCounter++;
							// Ensuring purchase prompt doesn't show if player already owns property
							if (!thisDom.hasClass("player"+this.num+"Owned")) {
								$(".purchasePrompt").fadeIn(500);
							}
						}
					}
				}
			}
		}
};
// *****************************************************************

// ******************** Game Constructor ****************************
function Game() {
	this.turnCounter = 1;
	this.attachListeners();
	this.player1 = new Player(1, "465px", "340px", "red");
	this.player2 = new Player(2, "785px", "660px", "yellow");
	this.currentPlayer = this.player1;
	this.logicId = setInterval(this.logic.bind(this), 1);
	$(".purchasePrompt").hide().css("visibility", "visible");
	$(".notEnoughFunds").hide().css("visibility", "visible");
	$(".tooFarToInvest").hide().css("visibility", "visible");
	$(".moveOrInvest").hide().css("visibility", "visible");
	this.currentTile = $(".rowC .C");
	$("#gameContent").hide().css("visibility", "visible");
	$(".fullyInvested").hide().css("visibility", "visible");

}
// ******************************************************************

// *********************** Turn Function ****************************
Game.prototype.turnChange = function() {
	var self = this;
	this.player1.moveCounter = 0;
	this.player2.moveCounter = 0;

	$(".player"+this.currentPlayer.num+"Owned").each(function(){
		self.currentPlayer.balance += 25;
		console.log(self.currentPlayer.balance);
	});
	
	if (this.turnCounter === 1) {
		this.turnCounter++;
	}
	else if (this.turnCounter === 2) {
		this.turnCounter--;
	}

	$(".purchasePrompt").fadeOut(500);
	
	$(".playerIndicator h3").text("Player Turn: " + this.turnCounter);
};
// ******************************************************************

// *********************** Purchase Function ************************
Game.prototype.purchase = function() {
	if (this.currentTile.hasClass("owned")) {
		if (this.currentPlayer.balance >= 200) {
			this.currentTile.removeClass("player1Owned player2Owned");
			$(".purchasePrompt").fadeOut(500);
			this.currentPlayer.balance = (this.currentPlayer.balance - 200);
			this.currentTile.addClass("player"+this.currentPlayer.num+"Owned");
		}

		else {
			$(".notEnoughFunds").fadeIn(500);
		}
	}
	if (!this.currentTile.hasClass("owned")) {
		if (this.currentPlayer.balance >= 100) {
			this.currentPlayer.balance = (this.currentPlayer.balance - 100);
			this.currentTile.addClass("owned");
			this.currentTile.addClass("player"+this.currentPlayer.num+"Owned");
			$(".purchasePrompt").fadeOut(500);
			setTimeout(function() {$(".notEnoughFunds").fadeOut(500);}, 1200);
		}

		else {
			$(".notEnoughFunds").fadeIn(500);
			setTimeout(function() {$(".notEnoughFunds").fadeOut(500);}, 1200);
		}
	}
};
// ******************************************************************

// ******************** Investment Check *************************
Game.prototype.investPromptFromClick = function(thisDom) {
	var self = this;
	this.currentTile = thisDom;
		// Difference between clicked tile and player left/right value
		var difLeft = Math.abs(parseInt(thisDom.css("left"), 10) - parseInt(this.currentPlayer.dom.css("left"), 10));
		// Difference between clicked tile and player top/bottom value
		var difTop = Math.abs(parseInt(thisDom.css("top"), 10)-parseInt(this.currentPlayer.dom.css("top"), 10));
		// Max left/right distance allowed
		var leftPar = (difLeft < 120); 
		// Farther than max distance left/right
		var leftFarPar = (difLeft >= 120);
		// Farther than max distance top/bottom
		var topFarPar = (difTop >= 120);
		// Max top/bottom difference allowed
		var topPar = (difTop < 120);

	if (thisDom.hasClass("player"+this.currentPlayer.num+"Owned")) {
		
		if (topPar && leftPar) {
			if (this.currentPlayer.moveCounter === 0) {
				console.log("checking for parameters");
				$(".moveOrInvest").fadeIn(500);
			}
			if (this.currentPlayer.moveCounter > 0) {
				console.log("Already moved");
				$(".tooFarToInvest").fadeIn(500);
			}
		}
		if (topFarPar || leftFarPar) {
			$(".tooFarToInvest").fadeIn(500);
			console.log("paramCheck");
		}
	}
};
// ******************************************************************

// ******************* Invest Function ******************************
Game.prototype.invest = function(tileDom) {
	var self = this;
	
	if (!this.currentTile.hasClass("invested1")) {
		this.currentTile.append("<div class = \"i1 player"+this.currentPlayer.num+"Owned\"></div>");
		this.currentTile.addClass("invested1");
		tileDom.parent().fadeOut(500);
	}

	else if (!this.currentTile.hasClass("invested2")) {
		this.currentTile.append("<div class = \"i2 player"+this.currentPlayer.num+"Owned\"></div>");
		this.currentTile.addClass("invested2");
		tileDom.parent().fadeOut(500);
	}

	else if (!this.currentTile.hasClass("invested3")) {
		this.currentTile.append("<div class = \"i3 player"+this.currentPlayer.num+"Owned\"></div>");
		this.currentTile.addClass("invested3");
		tileDom.parent().fadeOut(500);
	}

	else if (!this.currentTile.hasClass("invested4")) {
		this.currentTile.append("<div class = \"i4 player"+this.currentPlayer.num+"Owned\"></div>");
		this.currentTile.addClass("invested4");
		tileDom.parent().fadeOut(500);
	}

	else if (this.currentTile.hasClass("invested4")) {
		$(".fullyInvested").fadeIn(500);
		setTimeout(function() {$(".fullyInvested").fadeOut(500);}, 1500);
	}
};
// ******************************************************************

// ******************** Listener Attach *****************************
Game.prototype.attachListeners = function() {
	var self = this;
		
		// New Game
		$(".newGame").on("click", function(){
			$("#landingPage").fadeOut(600);
			setTimeout(function(){$("#gameContent").fadeIn(1500);}, 1000);
		});

		// Tile dblclick
		$(".tile").on("dblclick", function() {
		var tileDom = $(this);
		self.currentPlayer.move(tileDom);
		});

		// Tile invest check click
		$("div").on("click", ".owned", function(event) {
		var tileDom = $(this);
		self.investPromptFromClick(tileDom);
		});

		// Invest
		$(".investFunction").on("click", function(event) {
			var tileDom = $(this);
			self.invest(tileDom);

		});

		// Hide invest prompt
		$(".doNothing").on("click", function(event) {
			$(this).parent().fadeOut(500);
		});

		// Enter key turn change
		window.addEventListener("keyup", function(event) {
			if (event.keyCode === 13) {
				game.turnChange();
			}
		});

		// Purhcase click
		$(".purchaseYes").on("click", function() {
			self.purchase();
		});

		// No purchase click
		$(".purchaseNo").on("click", function() {
			$(".purchasePrompt").fadeOut(500);
		});
};
// ******************************************************************

// ******************* Logic function *******************************
Game.prototype.logic = function() {
	var self = this;

	if (this.turnCounter === 1) {
		this.currentPlayer = this.player1;
	}

	if (this.turnCounter === 2) {
		this.currentPlayer = this.player2;
	}

	$(".playerBalances h3:first-child").text(this.player1.balance);
	$(".playerBalances h3:last-child").text(this.player2.balance);
};
// ******************************************************************
var game = new Game();






 


});