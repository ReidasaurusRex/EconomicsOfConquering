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

		// Moving player depending on turn
		if(game.turnCounter === this.num) { 
			// Ensuring player only moves once
			if (this.moveCounter === 0) {
				// Ensuring player move distance equals one square
				if ((topPar && leftPar) && ((difTop != 30) || (difLeft != 30))) {
					// Ensuring players cannot move on top of one another
					if ((thisDom.css("left") != game.player1.dom.css("left")) && (thisDom.css("top") != game.player1.dom.css("left"))){
						game.currentTile = thisDom;
						this.dom.css("left", ((parseInt((thisDom.css("left")), 10) + 30)));
						this.dom.css("top", ((parseInt((thisDom.css("top")), 10) + 30)));
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
};
// *****************************************************************

// ******************** Game Constructor ****************************
function Game() {
	this.turnCounter = 1;
	this.attachListeners();
	this.player1 = new Player(1, "465px", "340px", "red");
	this.player2 = new Player(2, "785px", "660px", "yellow");
	this.currentPlayer = this.player1;
	setInterval(this.logic.bind(this), 1);
	$(".purchasePrompt").hide().css("visibility", "visible");
	this.currentTile = $(".rowC .C");
	console.log(this.currentTile);
}
// ******************************************************************

// *********************** Turn Function ****************************
Game.prototype.turnChange = function() {
	this.player1.moveCounter = 0;
	this.player2.moveCounter = 0;
	
	if (this.turnCounter === 1) {
		this.turnCounter++;
	}
	else if (this.turnCounter === 2) {
		this.turnCounter--;
	}
	
	$(".playerIndicator h3").text("Player Turn: " + this.turnCounter);
};
// ******************************************************************

// *********************** Purchase Function ************************
Game.prototype.purchase = function() {
	this.currentPlayer.balance = (this.currentPlayer.balance - 100);
	this.currentTile.addClass("player"+this.currentPlayer.num+"Owned").addClass("owned");
	$(".purchasePrompt").fadeOut(500);
};
// ******************************************************************

// ******************** Listener Attach *****************************
Game.prototype.attachListeners = function() {
	var self = this;
		
		// Tile click
		$(".tile").on("click", function() {
		var tileDom = $(this);
		self.currentPlayer.move(tileDom);
		});

		// Turn button click
		$(".turn").on("click", function() {
			game.turnChange();
			console.log(self.currentPlayer.balance);
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