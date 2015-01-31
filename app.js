$(document).ready(function() {
	
	function Player(num, styLeft, styTop) {
		this.num = num;
		this.styLeft = styLeft;
		this.styTop = styTop;
		this.dom = $(".player"+this.num);
		this.dom.css("left", styLeft);
		this.dom.css("top", styTop);

	}
	
	player1 = new Player(1, "625px", "500px");
	console.log(player1.dom);

	var tile = $(".tile");
	tile.on("click", function(event) {
		console.log($(this));
		player1.dom.css("left", ((parseInt(($(this).css("left")), 10) + 30)));
		player1.dom.css("top", ((parseInt(($(this).css("top")), 10) + 30)));
	});

});