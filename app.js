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
	this.armyCounter = 0;
	this.wins = localStorage.getItem("Player "+this.num + " Wins");

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
	var leftPar = (difLeft < 58); 
	// Max top/bottom difference allowed
	var topPar = (difTop < 67);
	// Player 1 same top check
	var playerOppDifTop = Math.abs(parseInt(thisDom.css("top"), 10) - (parseInt(game.oppositePlayer.dom.css("top"), 10) - 18));
	// Player 1 same left check
	var playerOppDifLeft = Math.abs(parseInt(thisDom.css("left"), 10) - (parseInt(game.oppositePlayer.dom.css("left"), 10) - 9));

	if (game.turnCounter === 1 || game.turnCounter === 2) {
		// Ensuring player only moves once
		if (this.moveCounter === 0) {
			// Ensuring player move distance equals one square
			if ((topPar && leftPar) && ((difTop != 18) || (difLeft != 9))) {
				// Ensuring players cannot move on top of each other
				if ((playerOppDifLeft !== 0) || (playerOppDifTop !== 0)) {
					game.currentTile = thisDom;
					this.dom.animate({"left": ((parseInt((game.currentTile.css("left")), 10) + 9))}, 250);
					this.dom.animate({"top": ((parseInt((game.currentTile.css("top")), 10) + 18))}, 250);
					// Ensuring player only moves once
					this.moveCounter++;
					// Ensuring purchase prompt doesn't show if player already owns property
					if (!thisDom.hasClass("player"+this.num+"Owned")) {
						setTimeout(function() {$(".purchasePrompt").fadeIn(250);}, 250);
						$(".moveOrInvest").fadeOut(250);
						$(".tooFarToInvest").fadeOut(250);
					}
				}
			}
		}
	}
};
// ******************************************************************

// ******************** Game Constructor ****************************
function Game() {
	this.attachListeners();
	this.turnCounter = 1;
	this.player1 = new Player(1, "630px", "264px", "#ed8584");
	this.player2 = new Player(2, "822px", "456px", "#f8efa2");
	this.currentPlayer = this.player1;
	this.oppositePlayer = this.player2;
	this.currentTile = $(".rowC .C");
	this.gameStartCheck = 0;
	this.logicId = setInterval(this.logic.bind(this), 10);
	
	// Hiding elements and prompts
	$("#readMePage").hide().css("visibility", "visible");
	$("#gameContent").hide().css("visibility", "visible");
	$(".purchasePrompt").hide().css("visibility", "visible");
	$(".notEnoughFunds").hide().css("visibility", "visible");
	$(".tooFarToInvest").hide().css("visibility", "visible");
	$(".moveOrInvest").hide().css("visibility", "visible");
	$(".fullyInvested").hide().css("visibility", "visible");
	$(".navBar h4").hide().css("visibility", "visible");
	$(".instruction instructTitle").hide();
	$(".instructions .instructMilitary").hide();
	$(".instructions .instructEconomy").hide();
	
	// Showing wins
	$(".player1WinCounter span").text(this.player1.wins);
	$(".player2WinCounter span").text(this.player2.wins);
}
// ******************************************************************

// *********************** Turn Function ****************************
Game.prototype.turnChange = function() {
	var self = this;
	
	// Victory check
	if ($(".tile.player"+this.currentPlayer.num+"Owned").length === 61) {
		alert("Game, blouses");
		clearInterval(this.logicId);
		localStorage.setItem("Player "+this.currentPlayer.num + " Wins", this.currentPlayer.wins ++);
		$(".player1WinCounter span").text(this.player1.wins);
		$(".player2WinCounter span").text(this.player2.wins);
	}

	// Movement reset
	this.player1.moveCounter = 0;
	this.player2.moveCounter = 0;
	
	if (this.turnCounter < 3) {
		// Income from properties
		$(".player"+this.currentPlayer.num+"Owned.tile.v5").each(function(){
			self.currentPlayer.balance += 30;
		});

		$(".player"+this.currentPlayer.num+"Owned.tile.v4").each(function(){
			self.currentPlayer.balance += 35;
		});

		$(".player"+this.currentPlayer.num+"Owned.tile.v3").each(function(){
			self.currentPlayer.balance += 40;
		});

		$(".player"+this.currentPlayer.num+"Owned.tile.v2").each(function(){
			self.currentPlayer.balance += 45;
		});

		$(".player"+this.currentPlayer.num+"Owned.tile.v1").each(function(){
			self.currentPlayer.balance += 50;
		});

		// Income from investments
		$(".invested").each(function(){
			self.currentPlayer.balance += 10;
		});
	}

	if (this.turnCounter < 4) {
		this.turnCounter++;
		if (this.turnCounter === 3) {
			$(".instructions .instructEconomy").fadeOut(250);
			$("#phaseIndicator").fadeOut(250);
			setTimeout(function() {
				$(".instructions .instructMilitary").fadeIn(250);
				$("#phaseIndicator").text("Military");
				$("#phaseIndicator").fadeIn(250);
			}, 250);
		}
	}
	else if (this.turnCounter === 4) {
		this.turnCounter = 1;
		if (this.turnCounter === 1) {
			$(".instructions .instructMilitary").fadeOut(250);
			$("#phaseIndicator").fadeOut(250);
			setTimeout(function() {
				$(".instructions .instructEconomy").fadeIn(250);
				$("#phaseIndicator").text("Economic");
				$("#phaseIndicator").fadeIn(250);
			}, 250);
		}
	}

	console.log(this.currentPlayer.num);
	if (this.turnCounter === 1 || this.turnCounter === 3) {
		$(".turn").animate({"top": 338}, 250);
	}
	if (this.turnCounter ===2 || this.turnCounter === 4) {
		$(".turn").animate({"top": 383}, 250);
	}

	// Ensuring no right side prompts are left over
	$(".purchasePrompt").fadeOut(250);
	$(".moveOrInvest").fadeOut(250);
	$(".tooFarToInvest").fadeOut(250);

	$(".soldier").each(function(){
		// Ensuring no soldiers are left over selected
		$(this).removeClass("currentArmy");
		// Ensuring soldiers are free to move again next turn
		$(this).removeClass("moved");
	});
	this.currentArmy = "";

};
// ******************************************************************

// *********************** Purchase Function ************************
Game.prototype.purchase = function() {
	var self = this;
	if (this.currentTile.hasClass("owned")) {
		var cost = 0;
		self.currentTile.find(".invested").each(function(){cost += 25;});
		if (this.currentPlayer.balance >= (200 + cost)) {
			this.currentTile.removeClass("player1Owned player2Owned");
			$(".purchasePrompt").fadeOut(250);
			this.currentPlayer.balance = (this.currentPlayer.balance - (200 + cost));
			this.currentTile.addClass("player"+this.currentPlayer.num+"Owned");
			this.currentTile.find(".i1").attr("class", "invested i1 player"+this.currentPlayer.num+"Owned");
			this.currentTile.find(".i2").attr("class", "invested i2 player"+this.currentPlayer.num+"Owned");
			this.currentTile.find(".i3").attr("class", "invested i3 player"+this.currentPlayer.num+"Owned");
			this.currentTile.find(".i4	").attr("class", "invested i4 player"+this.currentPlayer.num+"Owned");
		}

		else {
			$(".notEnoughFunds").fadeIn(250);
		}
	}
	if (!this.currentTile.hasClass("owned")) {
		if (this.currentPlayer.balance >= 100) {
			this.currentPlayer.balance = (this.currentPlayer.balance - 100);
			this.currentTile.addClass("owned");
			this.currentTile.addClass("player"+this.currentPlayer.num+"Owned");
			$(".purchasePrompt").fadeOut(250);
			setTimeout(function() {$(".notEnoughFunds").fadeOut(250);}, 1200);
		}

		else {
			$(".notEnoughFunds").fadeIn(250);
			setTimeout(function() {$(".notEnoughFunds").fadeOut(250);}, 1200);
		}
	}
};
// ******************************************************************

// ******************** Investment Check *************************
Game.prototype.investPromptFromClick = function(thisDom) {
	var self = this;
	this.currentTile = thisDom;
	$(".tooFarToInvest").fadeOut(250);
	$(".moveOrInvest").fadeOut(250);
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

	if (this.turnCounter === 1 || this.turnCounter === 2) {
		if (thisDom.hasClass("player"+this.currentPlayer.num+"Owned")) {
			if ((difTop === 18) && (difLeft === 9)) {
				setTimeout(function(){$(".tooFarToInvest").fadeIn(250);}, 250);
			}
			else if (topPar && leftPar) {
				if (this.currentPlayer.moveCounter === 0) {
					setTimeout(function(){$(".moveOrInvest").fadeIn(250);}, 250);
				}
				if (this.currentPlayer.moveCounter > 0) {
					setTimeout(function(){$(".tooFarToInvest").fadeIn(250);}, 250);
				}
			}
			else if (topFarPar || leftFarPar) {
				setTimeout(function(){$(".tooFarToInvest").fadeIn(250);}, 250);
			}
		}
	}
};
// ******************************************************************

// ******************* Invest Function ******************************
Game.prototype.invest = function(tileDom) {
	var self = this;
	
	if (!this.currentTile.hasClass("invested1")) {
			if (this.currentPlayer.balance >= 50) {
				this.currentTile.append("<div class = \"invested i1 player"+this.currentPlayer.num+"Owned\"></div>");
				this.currentTile.addClass("invested1");
				this.currentPlayer.balance = (this.currentPlayer.balance - 50);
				tileDom.parent().fadeOut(250);
			}
			else {
				$(".notEnoughFunds").fadeIn(250);
				setTimeout(function() {$(".notEnoughFunds").fadeOut(250);}, 1200);
			}
	}

	else if (!this.currentTile.hasClass("invested2")) {
		if (this.currentPlayer.balance >= 50) {
			this.currentTile.append("<div class = \"invested i2 player"+this.currentPlayer.num+"Owned\"></div>");
			this.currentTile.addClass("invested2");
			this.currentPlayer.balance = (this.currentPlayer.balance - 50);
			tileDom.parent().fadeOut(250);
		}
		else {
			$(".notEnoughFunds").fadeIn(250);
			setTimeout(function() {$(".notEnoughFunds").fadeOut(250);}, 1200);
		}
	}

	else if (!this.currentTile.hasClass("invested3")) {
		if (this.currentPlayer.balance >= 50) {	
			this.currentTile.append("<div class = \"invested i3 player"+this.currentPlayer.num+"Owned\"></div>");
			this.currentTile.addClass("invested3");
			this.currentPlayer.balance = (this.currentPlayer.balance - 50);
			tileDom.parent().fadeOut(250);
		}
		else {
			$(".notEnoughFunds").fadeIn(250);
			setTimeout(function() {$(".notEnoughFunds").fadeOut(250);}, 1200);	
		}
	}

	else if (!this.currentTile.hasClass("invested4")) {
		if (this.currentPlayer.balance >= 50) {	
			this.currentTile.append("<div class = \"invested i4 player"+this.currentPlayer.num+"Owned\"></div>");
			this.currentTile.addClass("invested4");
			this.currentPlayer.balance = (this.currentPlayer.balance - 50);
			tileDom.parent().fadeOut(250);
		}
		else {
			$(".notEnoughFunds").fadeIn(250);
			setTimeout(function() {$(".notEnoughFunds").fadeOut(250);}, 1200);
		}
	}

	else if (this.currentTile.hasClass("invested4")) {
		$(".fullyInvested").fadeIn(250);
		setTimeout(function() {$(".fullyInvested").fadeOut(250);}, 1250);
	}
};
// ******************************************************************

// ****************** Soldier Purchase Function *********************
Game.prototype.purchaseSoldier = function(tileDom) {
	var self = this;
	var styTop = (parseInt(this.currentTile.css("top"), 10) + 18 + "px");
	var styLeft = (parseInt(this.currentTile.css("left"), 10) + 28 + "px");
	var selector = ".player" + this.currentPlayer.num + "Owned.soldier";	

	// Ensuring player has enough dolla dolla bills y'all
	if (this.currentPlayer.balance >= 75) {
		var tempArr = [];
		$(selector).each(function() {
			if (($(this).css("top") === (parseInt(self.currentTile.css("top"), 10) + 18 + "px")) && 
				($(this).css("left") === (parseInt(self.currentTile.css("left"), 10) + 28 + "px"))) {
					tempArr.push($(this));
					console.log(tempArr.length);
			}
		});
		
		// Adding a new army if tile is unoccupied
		if (tempArr.length === 0) {
			$("#gameContent").prepend("<div class = \"soldier player" + self.currentPlayer.num + "Owned army" + self.currentPlayer.armyCounter + "\"></div>");
			self.currentTile.addClass("occupied");
			$(".player" + self.currentPlayer.num + "Owned.army" + self.currentPlayer.armyCounter).css("top", styTop);
			$(".player" + self.currentPlayer.num + "Owned.army" + self.currentPlayer.armyCounter).css("left", styLeft);
			$(".player" + self.currentPlayer.num + "Owned.army" + self.currentPlayer.armyCounter).css("background-color", self.currentPlayer.coLor);
			$(".player" + self.currentPlayer.num + "Owned.army" + self.currentPlayer.armyCounter).text(1);
			self.currentPlayer.armyCounter ++;
			self.currentPlayer.balance = (self.currentPlayer.balance - 75);
		}

		// Adding a soldier to current occupying army
		if (tempArr.length === 1) {
			$(selector).each(function() {
				if (($(this).css("top") === (parseInt(self.currentTile.css("top"), 10) + 18 + "px")) && 
					($(this).css("left") === (parseInt(self.currentTile.css("left"), 10) + 28 + "px"))) {
					$(this).text(parseInt($(this).text(), 10) + 1);
					self.currentPlayer.balance = (self.currentPlayer.balance - 75);
				}
			});
		}
	}

	// If the player is too broke
	else if (this.currentPlayer.balance < 75) {
		$(".notEnoughFunds").fadeIn(250);
		setTimeout(function() {$(".notEnoughFunds").fadeOut(250);}, 1200);
	}
};
// ******************************************************************



// ****************** Army Select Function **************************
Game.prototype.armySelect = function(armyDom) {
	if (this.turnCounter === 3 || this.turnCounter === 4) {
		$(".soldier").each(function(){
			$(this).removeClass("currentArmy");
		});
		if (armyDom.hasClass("player"+this.currentPlayer.num+"Owned")) {
			armyDom.addClass("currentArmy");
			this.currentArmy = armyDom;
		}
	}
};
// ******************************************************************

// ******************* Army Move Function ***************************
Game.prototype.armyMove = function(thisDom) {
	// Changing currentTile to reflect most recent click
	game.currentTile = thisDom;
	var self = this;
	// Difference between clicked tile and player left/right value
	var difLeft = Math.abs(parseInt(thisDom.css("left"), 10) - parseInt(this.currentArmy.css("left"), 10));
	// Difference between clicked tile and player top/bottom value
	var difTop = Math.abs(parseInt(thisDom.css("top"), 10)-parseInt(this.currentArmy.css("top"), 10));
	// Left/right difference between target tile and opposite player
	var oppDifLeft = Math.abs(parseInt(thisDom.css("left"), 10) - parseInt(this.oppositePlayer.dom.css("left"), 10));
	// Top/bottom difference between target tile and opposite player
	var oppDifTop = Math.abs(parseInt(thisDom.css("top"), 10) - parseInt(this.oppositePlayer.dom.css("top"), 10));

	// Max left/right distance allowed
	var leftPar = (difLeft < 79 && difLeft !== 66); 
	// Max top/bottom difference allowed
	var topPar = (difTop < 67);
	
	if (game.turnCounter === 3 || game.turnCounter === 4) {
		// Ensuring army only moves once
		if (!this.currentArmy.hasClass("moved")) {
			// Ensuring player move distance equals one square, no diagonal
			if (((topPar && difLeft === 28) || (leftPar && difTop === 18)) && ((difTop !== 18) || (difLeft !== 28))) {
				// Ensuring army cannot move to a tile containing opposite player
				if ((oppDifLeft !== 9) || (oppDifTop !== 18)) {
					// Moving player
					this.currentArmy.animate({"left": ((parseInt((thisDom.css("left")), 10) + 28))}, 250);
					this.currentArmy.animate({"top": ((parseInt((thisDom.css("top")), 10) + 18))}, 250);
					console.log(self.currentTile);
					console.log(self.oppositePlayer);
					if (this.currentTile.hasClass("player"+this.currentPlayer.num+"Owned")) {
						console.log("Owned by player " + this.currentPlayer.num);
					}
					if(this.currentTile.hasClass("player"+this.oppositePlayer.num+"Owned")) {
						console.log("Owned by player " + this.oppositePlayer.num);
					}
					// Adding move exhaustion
					this.currentArmy.addClass("moved");
					// Combinging same player armies if present
					$(".soldier.player"+this.currentPlayer.num+"Owned").each(function() {
						if (($(this).css("top") === (parseInt(self.currentTile.css("top"), 10) + 18 + "px")) && 
							($(this).css("left") === (parseInt(self.currentTile.css("left"), 10) + 28 + "px"))) {
							self.currentArmy.text(parseInt(self.currentArmy.text(), 10) + (parseInt($(this).text(), 10)));
							$(this).remove();
						}
					});
					var tempArr = [];
					// Opposite player armies defeating each other
					$(".soldier.player"+this.oppositePlayer.num+"Owned").each(function() {
						var thisNumber = parseInt($(this).text(), 10);
						var playerNumber = parseInt(self.currentArmy.text(), 10);
						if (($(this).css("top") === (parseInt(self.currentTile.css("top"), 10) + 18 + "px")) && 
							($(this).css("left") === (parseInt(self.currentTile.css("left"), 10) + 28 + "px"))) {
							console.log("opposite player present");
							tempArr.push($(this));
							// Current player wins
							if (playerNumber > thisNumber) {
								self.currentArmy.text(playerNumber - thisNumber);
								$(this).remove();
								// Conquering Functionaity
								// var ownershipSelector = "player"+self.oppositePlayer.num+"Owned";
								console.log(self.oppositePlayer.num);
								if (self.currentTile.hasClass("player"+self.oppositePlayer.num+"Owned")) {
									console.log("fish");
									$(self.currentTile).find(".invested").each(function() {
										($(this)).remove();
									});
									self.currentTile.removeClass("player"+self.oppositePlayer.num+"Owned");
									self.currentTile.addClass("player"+self.currentPlayer.num+"Owned");
								}
							}
							// Opposite player wins
							else if (playerNumber < thisNumber) {
								$(this).text(thisNumber - playerNumber);
								self.currentArmy.remove();
							}
							// Tie: both defeated
							else if (thisNumber === playerNumber) {
								self.currentArmy.remove();
								$(this).remove();
							}
						}
					});
					if (tempArr.length === 0) {
								console.log("holla holla holla holla holla");
								if (self.currentTile.hasClass("player"+self.oppositePlayer.num+"Owned")) {
									$(self.currentTile).find(".invested").each(function() {
										($this).remove();
									});
								self.currentTile.removeClass("player"+self.oppositePlayer.num+"Owned");
								self.currentTile.addClass("player"+self.currentPlayer.num+"Owned");
								}
					}
				}

			}
		}
	}
};
// ******************************************************************

// ******************** Listener Attach *****************************
Game.prototype.attachListeners = function() {
	var self = this;
		
		// ReadMe Show
		$(".viewReadMe").on("click", function() {
			$("#landingPage").fadeOut(600);
			$("#gameContent").fadeOut(600);
			$(".navBar .viewReadMe").fadeOut(600);
			$(".navBar .startNewGame").fadeOut(600);
			setTimeout(function() {
				$("#readMePage").fadeIn(600);
			}, 800);
		});

		$(".goToGame").on("click", function() {
			self.gameStartCheck ++;
			$("#readMePage").fadeOut(600);
			setTimeout(function() {
				$("#gameContent").fadeIn(1250);
				$(".navBar .viewReadMe").fadeIn(1250);
				$(".navBar .startNewGame").fadeIn(1250);
			}, 800);
		});

		// New Game
		$(".firstGame").on("click", function() {
			$("#landingPage").fadeOut(600);
			setTimeout(function(){
				$("#gameContent").fadeIn(1250);
				$(".navBar .viewReadMe").fadeIn(1250);
				$(".navBar .startNewGame").fadeIn(1250);
				$(".instructions .instructTitle").fadeIn(1250);
				$(".instructions .instructEconomy").fadeIn(1250);
			}, 800);
			self.gameStartCheck ++;
		});

		// Tile dblclick
		$(".tile").on("dblclick", function() {
		var tileDom = $(this);
		self.currentPlayer.move(tileDom);
		self.armyMove(tileDom);
		});


		// Tile invest check click
		$("div").on("click", ".owned", function(event) {
		var tileDom = $(this);
		self.investPromptFromClick(tileDom);
		});

		// Soldier select
		$("#gameContent").on("click", ".soldier", function() {
			var armyDom = $(this);
			self.armySelect(armyDom);
			console.log(self.currentArmy);
		});

		// Invest
		$(".investFunction").on("click", function(event) {
			var tileDom = $(this);
			self.invest(tileDom);

		});

		// Move from invest
		$(".investMove").on("click", function(event) {
			var tileDom = self.currentTile;
			self.currentPlayer.move(tileDom);
			$(".moveOrInvest").fadeOut(250);
		});

		// Purchase Soldier
		$(".soldierPurchase").on("click", function(event) {
			var tileDom = $(this);
			self.purchaseSoldier(tileDom);
		});

		// Hide invest prompt
		$(".doNothing").on("click", function(event) {
			$(this).parent().fadeOut(250);
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
			$(".purchasePrompt").fadeOut(250);
		});
};
// ******************************************************************

// ******************* Logic function *******************************
Game.prototype.logic = function() {
	var self = this;

	// Defining players based on turn
	if ((this.turnCounter === 1) || (this.turnCounter === 3)) {
		this.currentPlayer = this.player1;
		this.oppositePlayer = this.player2;
		$(".playerIndicator h3").text("Player Turn: 1");
	}
	if ((this.turnCounter === 2) || (this.turnCounter === 4)) {
		this.currentPlayer = this.player2;
		this.oppositePlayer = this.player1;
		$(".playerIndicator h3").text("Player Turn: 2");
	}

	if (this.gameStartCheck === 1) {
		$(".goToGame h3").text("Return To Game");
	}

	$(".player1Balance").text(this.player1.balance);
	$(".player2Balance").text(this.player2.balance);
};
// ******************************************************************
var game = new Game();






 


});