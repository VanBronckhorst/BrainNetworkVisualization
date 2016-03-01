function mosaicView(where){
	var container = d3.select(where);
	var r = 200;
	var c = 200;

	var cellSize = 10;

	var colorScale = d3.scale.category20();

	var svg = container.append("svg").attr("class","mosaicSvg")
									.attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + r * cellSize + " " + c * cellSize);

	var data = [];
	for (var i = 0; i < r; i++){
		for (var j = 0; j < c; j++){
			data.push({ "r": i, "c":j});
		}
	}

	this.lensSize = 5;

	// Create the mosaic tiles
	svg.selectAll(".tile").data(data).enter().append("rect")
											.attr("class","tile")
											.attr("width", cellSize)
											.attr("height",cellSize)
											.attr("x",function(d){
												return d["c"] * cellSize;
											})
											.attr("y",function(d){
												return d["r"] * cellSize;
											})
											.attr("fill",function(d,i){
												return colorScale(d["r"]*d["c"]);
											});
											

	var lensRect = svg.append("rect").attr("class","lens")
									.attr("width", this.lensSize * cellSize)
									.attr("height", this.lensSize * cellSize)
									.style("fill","transparent")
									.style("stroke","#000000")
									.style("stroke-width", Math.floor(cellSize / 3));


	svg.selectAll(".tile").on("mouseover",function(d){
												lensRect.attr("x", d["c"] * cellSize)
														.attr("y", d["r"] * cellSize)
											});

}