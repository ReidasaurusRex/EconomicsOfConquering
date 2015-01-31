$(document).ready(function() {
	
function Player(num, styLeft, styTop, coLor) {
	this.num = num;
	this.styLeft = styLeft;
	this.styTop = styTop;
	this.dom = $(".player"+this.num);
	this.dom.css("left", styLeft);
	this.dom.css("top", styTop);
	this.dom.css("background-color", coLor);
	this.coLor = coLor;

}

player1 = new Player(1, "625px", "500px", "blue");
//console.log(player1.dom);

var tile = $(".tile");


Player.prototype.move = function(thisDom) {
	// console.log(thisDom);
	// var self = this;
		var difLeft = Math.abs(parseInt(thisDom.css("left"), 10) - parseInt(this.dom.css("left"), 10));
		var difTop = Math.abs(parseInt(thisDom.css("top"), 10)-parseInt(this.dom.css("top"), 10));
		var leftPar = (difLeft < 120); 
		var topPar = (difTop < 120);
		
		if ((topPar && leftPar) && ((difTop != 30) || (difLeft != 30))) {
			this.dom.css("left", ((parseInt((thisDom.css("left")), 10) + 30)));
			this.dom.css("top", ((parseInt((thisDom.css("top")), 10) + 30)));
			console.log(event);
			thisDom.css("border-color", this.coLor);
		}
};
// player1.move();

tile.on("click", function() {
	var tileDom = $(this);
	player1.move(tileDom);
	
});

});