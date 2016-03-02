function zoomView(where, commData, pixels , minTime, span){
	var allContainer = d3.select(where).style("visibility","visible");
	var that=this;

	allContainer.selectAll("*").remove();


	var title = allContainer.append("div").attr("class","zoomTitleBar");
	var container = allContainer.append("div").attr("class","zoomContentContainer");

	var l = Math.ceil(Math.sqrt(pixels.length));
	var squareLPct = (100-l) / l;
	
	for (var i= 0; i<pixels.length;i++){
		container.append("div").attr("id","zoomBoxId"+i)
				.attr("class","zoomSquareDiv")
				.style("top", (Math.floor(i/l) * (squareLPct + 1) ) + "%")
				.style("left", (Math.floor(i % l) * (squareLPct + 1) ) + "%")
				.style("width", (squareLPct) + "%")
				.style("height", (squareLPct) + "%")
		var zoom = new pixelView("#zoomBoxId"+i,commData, pixels[i] ,minTime,span);

	}

	this.offX = 0;
	this.offY=0;
	this.dragging = false;

	var drag = d3.behavior.drag()
        .on("drag", function(d,i) {
            that.offX += d3.event.dx
            that.offY += d3.event.dy
            allContainer.attr("transform", function(d,i){
                return "translate(" + [ that.offX ,that.offY ] + ")"
            })
        });

	title.call(drag);
}