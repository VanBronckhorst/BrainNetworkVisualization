function mosaicView(where,rows,cols,commData,min,span){
	var container = d3.select(where);
	var r = rows;
	var c = cols;
	var that = this;
	var ZOOM_ID = "#zoomDivContainer";

	this.cols = c;
	this.rows = rows;
	this.commData = commData;
	this.minTimeShown = min;
	this.span = span;


	var cellSize = 10;

	// this.colorScale = [	"#cccccc",
	// 					"#a6cee3",
	// 					"#1f78b4",
	// 					"#b2df8a",
	// 					"#33a02c",
	// 					"#fb9a99",
	// 					"#e31a1c",
	// 					"#fdbf6f",
	// 					"#ff7f00",
	// 					"#cab2d6",
	// 					"#6a3d9a"]//d3.scale.category20();

	var svg = container.append("svg").attr("class","mosaicSvg")
									.attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + c * cellSize + " " + r * cellSize);

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
											});
											
											

	this.lensRect = svg.append("rect").attr("class","lens")
									.attr("width", this.lensSize * cellSize)
									.attr("height", this.lensSize * cellSize)
									.style("fill","transparent")
									.style("stroke","#000000")
									.style("stroke-width", Math.floor(cellSize / 3))
									.on("mouseup",function(d){
										var pixels = [];	

										for (var i=0;i<that.lensSize;i++){
											for (var j=0;j<that.lensSize;j++){
												pixels.push( (d["r"] + i)* that.cols + d["c"] + j);
											}
										}

										that.zoom = new zoomView("#zoomDivContainer",that.commData,pixels,that.minTimeShown,that.span);
									});


	svg.selectAll(".tile").on("mouseover",function(d){

												var c = Math.min(d["c"],cols-that.lensSize);
												var r = Math.min(d["r"],rows-that.lensSize);
												
												that.lensRect.attr("x", c * cellSize)
													.attr("y", r * cellSize)
													.datum({"r":r, "c":c});
												
											});

	this.updateColor = function(){
		d3.select(ZOOM_ID).style("visibility","hidden");
		svg.selectAll(".tile").attr("fill",function(d,i){

												return that.mostCommon(d["r"],d["c"]);
											});
	}

	this.changeTimeSpan = function(min,span){
		this.minTimeShown = min;
		this.span = span;
		this.updateColor();
	}

	this.mostCommon = function(r,c) {

		colors = {};
		for (var j in colorScale){
			colors[colorScale[j]] = 0;
		}

		for (var i = this.minTimeShown; i< this.minTimeShown + this.span; i++){
			colors[colorScale[this.commData[i][r* this.cols + c]]] +=1
		}



		var max = 0;
		var maxInd = 0;

		

		for (var j in colorScale){
			if (colors[colorScale[j]]>max){
				max = colors[colorScale[j]];
				maxInd = j;
			}
		}

		return colorScale[maxInd];
	}

	this.changeLensSize = function(num) {
		if (num>0){
			d3.select(ZOOM_ID).style("visibility","hidden");

			this.lensSize = num;
			this.lensRect.attr("width", this.lensSize * cellSize)
						 .attr("height", this.lensSize * cellSize);
		}
	}

	this.changeLensDivSize = function(num){

		d3.select(ZOOM_ID).style("width",num +"%").style("height",num +"%");
	}

	this.updateColor();

}