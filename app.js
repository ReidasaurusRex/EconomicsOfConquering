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
	var player1DifLeft = Math.abs(parseInt(thisDom.css("left"), 10) - (parseInt(game.player1.dom.css("left"), 10) - 18));
	// Player 2 same top check
	var player2DifTop = Math.abs(parseInt(thisDom.css("top"), 10) - (parseInt(game.player2.dom.css("top"), 10) - 30));
	// Player 2 same left check
	var player2DifLeft = Math.abs(parseInt(thisDom.css("left"), 10) - (parseInt(game.player2.dom.css("left"), 10) - 18));

	if (game.turnCounter === 1 || game.turnCounter === 2) {
		// Ensuring player only moves once
		if (this.moveCounter === 0) {
			// Ensuring player move distance equals one square
			if ((topPar && leftPar) && ((difTop != 30) || (difLeft != 18))) {
				// Ensuring player2 cannot move on top of player1
				if (game.currentPlayer === game.player2) {
					if ((player1DifLeft !== 0) || (player1DifTop !== 0)) {
						game.currentTile = thisDom;
						this.dom.animate({"left": ((parseInt((game.currentTile.css("left")), 10) + 18))}, 500);
						this.dom.animate({"top": ((parseInt((game.currentTile.css("top")), 10) + 30))}, 500);
						// thisDom.addClass("player"+this.num+"Owned");
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
						this.dom.animate({"left": ((parseInt((thisDom.css("left")), 10) + 18))}, 500);
						this.dom.animate({"top": ((parseInt((thisDom.css("top")), 10) + 30))}, 500);
						// thisDom.addClass("player"+this.num+"Owned");
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
// ******************************************************************

// ******************** Game Constructor ****************************
function Game() {
	this.turnCounter = 1;
	this.attachListeners();
	this.player1 = new Player(1, "453px", "340px", "red");
	this.player2 = new Player(2, "773px", "660px", "yellow");
	this.currentPlayer = this.player1;
	this.oppositePlayer = this.player2;
	this.logicId = setInterval(this.logic.bind(this), 10);
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
	
	// Movement reset
	this.player1.moveCounter = 0;
	this.player2.moveCounter = 0;

	// Income from properties
	$(".player"+this.currentPlayer.num+"Owned.tile").each(function(){
		self.currentPlayer.balance += 50;
	});

	// Income from investments
	$(".invested").each(function(){
		self.currentPlayer.balance += 10;
	});

	if (this.turnCounter < 4) {
		this.turnCounter++;
	}
	else if (this.turnCounter === 4) {
		this.turnCounter = 1;
	}
	console.log(this.currentPlayer.num);

	// Ensuring no right side prompts are left over
	$(".purchasePrompt").fadeOut(500);
	$(".moveOrInvest").fadeOut(500);
	$(".tooFarToInvest").fadeOut(500);
	// Ensuring no soldiers are left over selected
	$(".soldier").each(function(){
		$(this).removeClass("currentArmy");
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
			$(".purchasePrompt").fadeOut(500);
			this.currentPlayer.balance = (this.currentPlayer.balance - (200 + cost));
			this.currentTile.addClass("player"+this.currentPlayer.num+"Owned");
			this.currentTile.find(".i1").attr("class", "invested i1 player"+this.currentPlayer.num+"Owned");
			this.currentTile.find(".i2").attr("class", "invested i2 player"+this.currentPlayer.num+"Owned");
			this.currentTile.find(".i3").attr("class", "invested i3 player"+this.currentPlayer.num+"Owned");
			this.currentTile.find(".i4	").attr("class", "invested i4 player"+this.currentPlayer.num+"Owned");
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

	if (this.turnCounter === 1 || this.turnCounter === 2) {
		if (thisDom.hasClass("player"+this.currentPlayer.num+"Owned")) {
			if ((difTop === 30) && (difLeft === 18)) {
				$(".tooFarToInvest").fadeIn(500);
			}
			else if (topPar && leftPar) {
				if (this.currentPlayer.moveCounter === 0) {
					$(".moveOrInvest").fadeIn(500);
				}
				if (this.currentPlayer.moveCounter > 0) {
					$(".tooFarToInvest").fadeIn(500);
				}
			}
			else if (topFarPar || leftFarPar) {
				$(".tooFarToInvest").fadeIn(500);
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
				tileDom.parent().fadeOut(500);
			}
			else {
				$(".notEnoughFunds").fadeIn(500);
				setTimeout(function() {$(".notEnoughFunds").fadeOut(500);}, 1200);
			}
	}

	else if (!this.currentTile.hasClass("invested2")) {
		if (this.currentPlayer.balance >= 50) {
			this.currentTile.append("<div class = \"invested i2 player"+this.currentPlayer.num+"Owned\"></div>");
			this.currentTile.addClass("invested2");
			this.currentPlayer.balance = (this.currentPlayer.balance - 50);
			tileDom.parent().fadeOut(500);
		}
		else {
			$(".notEnoughFunds").fadeIn(500);
			setTimeout(function() {$(".notEnoughFunds").fadeOut(500);}, 1200);
		}
	}

	else if (!this.currentTile.hasClass("invested3")) {
		if (this.currentPlayer.balance >= 50) {	
			this.currentTile.append("<div class = \"invested i3 player"+this.currentPlayer.num+"Owned\"></div>");
			this.currentTile.addClass("invested3");
			this.currentPlayer.balance = (this.currentPlayer.balance - 50);
			tileDom.parent().fadeOut(500);
		}
		else {
			$(".notEnoughFunds").fadeIn(500);
			setTimeout(function() {$(".notEnoughFunds").fadeOut(500);}, 1200);	
		}
	}

	else if (!this.currentTile.hasClass("invested4")) {
		if (this.currentPlayer.balance >= 50) {	
			this.currentTile.append("<div class = \"invested i4 player"+this.currentPlayer.num+"Owned\"></div>");
			this.currentTile.addClass("invested4");
			this.currentPlayer.balance = (this.currentPlayer.balance - 50);
			tileDom.parent().fadeOut(500);
		}
		else {
			$(".notEnoughFunds").fadeIn(500);
			setTimeout(function() {$(".notEnoughFunds").fadeOut(500);}, 1200);
		}
	}

	else if (this.currentTile.hasClass("invested4")) {
		$(".fullyInvested").fadeIn(500);
		setTimeout(function() {$(".fullyInvested").fadeOut(500);}, 1500);
	}
};
// ******************************************************************

// ****************** Soldier Purchase Function *********************
Game.prototype.purchaseSoldier = function(tileDom) {
	var self = this;
	var styTop = (parseInt(this.currentTile.css("top"), 10) + 32 + "px");
	var styLeft = (parseInt(this.currentTile.css("left"), 10) + 45 + "px");
	
	if (this.currentPlayer.balance >= 75) {	
		if (!this.currentTile.hasClass("occupied")) {
			$("#gameContent").prepend("<div class = \"soldier player" + this.currentPlayer.num + "Owned army" + this.currentPlayer.armyCounter + "\"></div>");
			this.currentTile.addClass("occupied");
			$(".player" + this.currentPlayer.num + "Owned.army" + this.currentPlayer.armyCounter).css("top", styTop);
			$(".player" + this.currentPlayer.num + "Owned.army" + this.currentPlayer.armyCounter).css("left", styLeft);
			$(".player" + this.currentPlayer.num + "Owned.army" + this.currentPlayer.armyCounter).css("background-color", this.currentPlayer.coLor);
			$(".player" + this.currentPlayer.num + "Owned.army" + this.currentPlayer.armyCounter).text(1);
			this.currentPlayer.armyCounter ++;
			this.currentPlayer.balance = (this.currentPlayer.balance - 75);
		}
		else if (this.currentTile.hasClass("occupied")) {
			var selector = ".player" + this.currentPlayer.num + "Owned.soldier";
			// Adding new soldier to respective army in selected tile 
			$(selector).each(function() {
				if (($(this).css("top") === (parseInt(self.currentTile.css("top"), 10) + 32 + "px")) && 
					($(this).css("left") === (parseInt(self.currentTile.css("left"), 10) + 45 + "px"))) {
					$(this).text(parseInt($(this).text(), 10) + 1);
				} 
			});
			this.currentPlayer.balance = (this.currentPlayer.balance - 75);
		}
	}

	else if (this.currentPlayer.balance < 75) {
		$(".notEnoughFunds").fadeIn(500);
		setTimeout(function() {$(".notEnoughFunds").fadeOut(500);}, 1200);
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
	// Max left/right distance allowed
	var leftPar = (difLeft < 130 && difLeft !== 115); 
	// Max top/bottom difference allowed
	var topPar = (difTop < 120);
	
	if (game.turnCounter === 3 || game.turnCounter === 4) {
		// Ensuring player only moves once
		if (!this.currentArmy.hasClass("moved")) {
			// Ensuring player move distance equals one square
			if ((topPar && leftPar) && ((difTop != 32) || (difLeft != 45))) {
						// Moving player
						this.currentArmy.animate({"left": ((parseInt((game.currentTile.css("left")), 10) + 45))}, 500);
						this.currentArmy.animate({"top": ((parseInt((game.currentTile.css("top")), 10) + 32))}, 500);
						// Adding move exhaustion
						this.currentArmy.addClass("moved");
						$(".soldier.player"+this.currentPlayer.num+"Owned").each(function() {
							if (($(this).css("top") === (parseInt(self.currentTile.css("top"), 10) + 32 + "px")) && 
								($(this).css("left") === (parseInt(self.currentTile.css("left"), 10) + 45 + "px"))) {
								self.currentArmy.text(parseInt(self.currentArmy.text(), 10) + (parseInt($(this).text(), 10)));
								$(this).remove();
							}
						});
						$(".soldier.player"+this.oppositePlayer.num+"Owned").each(function() {
							var thisNumber = parseInt($(this).text(), 10);
							var playerNumber = parseInt(self.currentArmy.text(), 10);
							if (($(this).css("top") === (parseInt(self.currentTile.css("top"), 10) + 32 + "px")) && 
								($(this).css("left") === (parseInt(self.currentTile.css("left"), 10) + 45 + "px"))) {
								console.log("opposite player present");
								if (playerNumber > thisNumber) {
									self.currentArmy.text(playerNumber - thisNumber);
									$(this).remove();
								}
								else if (thisNumber > playerNumber) {
									$(this).text(thisNumber - playerNumber);
									self.currentArmy.remove();
								}

								else if (thisNumber === playerNumber) {
									self.currentArmy.remove();
									$(this).remove();
								}

								
							}
						});
			}
		}
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
			$(".moveOrInvest").fadeOut(500);
		});

		// Purchase Soldier
		$(".soldierPurchase").on("click", function(event) {
			var tileDom = $(this);
			self.purchaseSoldier(tileDom);
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

	if ((this.turnCounter === 1) || (this.turnCounter === 2)) {
		$(".phaseIndicator").text("Economy");
	}

	if ((this.turnCounter === 3) || (this.turnCounter === 4)) {
		$(".phaseIndicator").text("Military");
		this.variable = true;
	}

	$(".playerBalances h3:first-child").text(this.player1.balance);
	$(".playerBalances h3:last-child").text(this.player2.balance);
};
// ******************************************************************
var game = new Game();






 


});