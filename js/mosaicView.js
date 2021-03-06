var overallColor={};
var overallColorLeft={};
var overallColorRight={};

function mosaicView(where,rows,cols,commData,min,span,swordID,starID,netData,grayData){
	var container = d3.select(where);
	container.selectAll("*").remove();

	var r = rows;
	var c = cols;
	var that = this;


	// var ZOOM_ID = "#zoomDivContainer";
	var SWORD_ID = swordID;

	this.cols = c;
	this.rows = rows;
	this.commData = commData;
	this.minTimeShown = min;
	this.span = span;
	this.action = "zoom"//"zoom";

	var cellSize = 10;

	var svg = container.append("svg").attr("class","mosaicSvg")
									.attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + c * cellSize + " " + r * cellSize);

	this.zoomDiv = container.append("div").attr("class","zoomDivContainer");

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
	

	this.onKNNFun = function(){};						

	this.lensRect = svg.append("rect").attr("class","lens")
									.attr("width", (this.action=="zoom"? this.lensSize : 1) * cellSize)
									.attr("height", (this.action=="zoom"? this.lensSize :1) * cellSize)
									.style("fill","transparent")
									.style("stroke","#000000")
									.style("stroke-width", Math.floor(cellSize / 3))
									.on("mouseup",function(d){
										if (that.action == "zoom"){
											var pixels = [];	

											for (var i=0;i<that.lensSize;i++){
												for (var j=0;j<that.lensSize;j++){
													pixels.push( (d["r"] + i)* that.cols + d["c"] + j);
												}
											}

											
											


											that.zoom = new zoomView(that.zoomDiv,that.commData,pixels,that.minTimeShown,that.span);
											that.onZoomFun(pixels , d);
										} else if (that.action=="sword"){
											// color star plot with its most common community color
											overallColor[r* this.cols + c] = that.mostCommon(d["r"],d["c"]);
											that.sword = new swordPlot(SWORD_ID,that.commData,(d["r"])* that.cols + d["c"],grayData );
											that.star = new starPlot(starID,netData,(d["r"])* that.cols + d["c"]);
										} else if (that.action == "KNN"){
											that.onKNNFun(that.commData,(d["r"]* that.cols + d["c"] ),that.minTimeShown,that.span);
										}

										svg.selectAll(".selectedLens").remove();
										svg.append("rect").attr("class","selectedLens")
															.attr("x", d.c * cellSize)
															  .attr("y", d.r * cellSize)
															  .attr("width", (that.action=="zoom"? that.lensSize : 1) * cellSize)
															  .attr("height", (that.action=="zoom"? that.lensSize : 1) * cellSize)
															  .style("fill","transparent")
															.style("stroke","#FF0000")
															.style("stroke-width", Math.floor(cellSize / 2))
									});


	svg.selectAll(".tile").on("mouseover",function(d){

												var c = Math.min(d["c"],cols-that.lensSize);
												var r = Math.min(d["r"],rows-that.lensSize);
												
												that.lensRect.attr("x", c * cellSize)
													.attr("y", r * cellSize)
													.datum({"r":r, "c":c});
												
											});

	this.onZoom = function(fun){
		this.onZoomFun = fun;
	}

	this.zoomHere = function(pixels,d){
		this.zoom = new zoomView(that.zoomDiv,that.commData,pixels,that.minTimeShown,that.span);
		svg.selectAll(".selectedLens").remove();
		svg.append("rect").attr("class","selectedLens")
							.attr("x", d.c * cellSize)
							  .attr("y", d.r * cellSize)
							  .attr("width", (that.action=="zoom"? that.lensSize : 1) * cellSize)
							  .attr("height", (that.action=="zoom"? that.lensSize : 1) * cellSize)
							  .style("fill","transparent")
							.style("stroke","#FF0000")
							.style("stroke-width", Math.floor(cellSize / 2))

	}

	this.updateColor = function(){
		this.zoomDiv.style("visibility","hidden");
		svg.selectAll(".tile").attr("fill",function(d,i){

												return that.mostCommon(d["r"],d["c"]);
											});
	}

	this.changeTimeSpan = function(min,span){
		this.minTimeShown = min;
		this.span = span;
		this.updateColor();
	}

	this.onKNN = function (fun){
		this.onKNNFun = fun;
	}

	this.changeAction = function(action){
		this.zoomDiv.style("visibility","hidden");
		this.action = action;
		this.lensRect.attr("width", (this.action=="zoom"? this.lensSize : 1) * cellSize)
					 .attr("height", (this.action=="zoom"? this.lensSize : 1) * cellSize);

	}

	this.mostCommon = function(r,c) {

		colors = {};
		for (var j in colorScale){
			colors[colorScale[j]] = 0;
		}

		for (var i = this.minTimeShown; i< this.minTimeShown + this.span; i++){
			colors[colorScale[this.commData[i][r* this.cols + c][0]]] +=1;//gcolor
		}

		colors[colorScale[0]] = 0;

		var max = 0;
		var maxInd = 0;

		

		for (var j in colorScale){
			if (colors[colorScale[j]]>max){
				max = colors[colorScale[j]];
				maxInd = j;
			}
		}
		
		overallColor[r* this.cols + c] = colorScale[maxInd];
		return colorScale[maxInd];
	}

	this.changeLensSize = function(num) {
		if (num>0){
			this.zoomDiv.style("visibility","hidden");

			this.lensSize = num;
			this.lensRect.attr("width", (this.action=="zoom"? this.lensSize : 1) * cellSize)
						 .attr("height", (this.action=="zoom"? this.lensSize : 1) * cellSize);
		}
	}

	this.changeLensDivSize = function(num){

		this.zoomDiv.style("width",num +"%").style("height",num +"%");
	}

	this.updateColor();

}