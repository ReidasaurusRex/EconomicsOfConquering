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
	//console.log(player1.dom);

	var tile = $(".tile");
	tile.on("click", function(event) {
		var difLeft = Math.abs(parseInt($(this).css("left"), 10) - parseInt(player1.dom.css("left"), 10));
		var difTop = Math.abs(parseInt($(this).css("top"), 10)-parseInt(player1.dom.css("top"), 10));
		var leftPar = (difLeft < 120); 
		var topPar = (difTop < 120);
		//console.log(difTop);
		if (   (topPar && leftPar) && (     (difTop != 30) || (difLeft != 30)     )     ) {
		player1.dom.css("left", ((parseInt(($(this).css("left")), 10) + 30)));
		player1.dom.css("top", ((parseInt(($(this).css("top")), 10) + 30)));
		console.log(event);
		$(this).css("border-color", "green");
	}
	});

});