function swordPlot(where,data,pixel,grayData){
	var container = d3.select(where);

	var w = 3000;
	var singleH = 300;
	var sword = 100

	container.selectAll("*").remove();

	var svg = container.append("svg").attr("class","mosaicSvg")
									.attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + w+ " " + (singleH * 2 + sword) );

	var upperY = d3.scale.linear().range([ singleH, 0]);
	var lowerY = d3.scale.linear().range([ 0,singleH ]);

	var x = d3.scale.linear().range([0,w]);

 	// Number of timestamps
	var times = Object.keys(data).length;
	x.domain([0,times-1]);

	var upperColor=[];
	var lowerColor=[];
	var degree = [];

	var max = 0;

	for (var i=0; i<times;i++){
		var d = data[i][pixel];

		upperColor.push(d[0]); //gcolor
		lowerColor.push(d[1]); //icolor
		if (d[2]){
			degree.push(d[2]);
			if (d[2]>max){
				max = d[2];
			}
		} else{
			degree.push(0);
		}
	}

	var barW = x(1)-x(0);
	upperY.domain([0,max]);
	lowerY.domain([0,max]);

	svg.append("rect").attr("class","sword")
						.attr("x",0)
						.attr("y",singleH)
						.attr("height",sword)
						.attr("width",w)
						.style("fill","#000000")

	svg.selectAll(".upperBar").data(upperColor).enter().append("rect")
							.attr("class","upperBar")
							.attr("x",function(d,i){
								return x(i);
							})
							.attr("y",function(d,i){
								return upperY(degree[i]);
							})
							.attr("width",barW)
							.attr("height",function(d,i){
								return singleH - upperY(degree[i]);
							})
							.style("fill",function(d,i){
								return colorScale[d];
							})

	svg.selectAll(".lowerBar").data(lowerColor).enter().append("rect")
							.attr("class","lowerBar")
							.attr("x",function(d,i){
								return x(i);
							})
							.attr("y",singleH + sword)
							.attr("width",barW)
							.attr("height",function(d,i){
								return lowerY(degree[i]);
							})
							.style("fill",function(d,i){
								return colorScale[d];
							});

	
	var maxG = 0;
	var minG = Infinity;
	var gray = [];
	for (var i=0;i<grayData.length;i++){
		gray.push(grayData[i][pixel])
		maxG = Math.max(grayData[i][pixel],maxG);
		minG = Math.min(grayData[i][pixel],minG);
	}

	// Set the ranges
	this.x = d3.scale.linear().range([0, w]);
	var x = this.x;
	this.y = d3.scale.linear().range([singleH+sword, singleH]);
	var y = this.y;
	x.domain([0,grayData.length]);
    y.domain([minG-1, maxG +1]);

	// Define the line
	var valueline = d3.svg.line()
	    .x(function(d,i) { return x(i); })
	    .y(function(d,i) { return y(d); });

	// Add the valueline path.
    svg.append("path")
        .attr("class", "swordLine")
        .attr("d", valueline(gray));


}