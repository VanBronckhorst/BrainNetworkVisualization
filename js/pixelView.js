function pixelView(where, commData, pixel, minTime, span){
	var container = d3.select(where);
	var that=this;

	var w =100;
	var h=100;
	this.svgW = w;
	this.svgH = h;


	container.selectAll("*").remove();
	var svg = container.append("svg").attr("class","mosaicSvg")
									.attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + (w)+ " " + (h));


	var l = Math.ceil(Math.sqrt(span));

	var data =[];
	for (var i= 0; i<span;i++){
		data.push(commData[minTime+i][pixel]);
	}

	var squareL = w/l;


	svg.selectAll(".timeTile").data(data).enter().append("rect")
							.attr("class","timeTile")
							.attr("width", squareL)
							.attr("height",squareL)
							.attr("stroke","black")
							.attr("x",function(d,i){
								return i % l * squareL;
							})
							.attr("y",function(d,i){
								return Math.floor(i / l)*squareL;
							})
							.attr("fill",function(d){
								return colorScale[d];
							})
}