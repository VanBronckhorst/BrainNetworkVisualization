function starPlot(where,data, pixel){
	var container = d3.select(where);
	var that=this;

	var w =200;
	var h=200;
	this.svgW = w;
	this.svgH = h;


	container.selectAll("*").remove();
	var svg = container.append("svg").attr("class","mosaicSvg")
									//.attr("preserveAspectRatio","none")
									.attr("viewBox",(-w/2)+" "+ (-h/2) +" " + (w)+ " " + (h));


	var key0 = Object.keys(data)[0]
	var nCat = Object.keys(data[key0]).length;
	var angleStep = 2 * Math.PI / nCat;

	for (var i=0; i< nCat;i++){
		svg.append("line").attr("x1",0)
						  .attr("y1",0)
						  .attr("stroke-dasharray", 1 +","+ 1)
						  .attr("x2",Math.cos( i * angleStep) * w/2)
						  .attr("y2",Math.sin( i * angleStep) * h/2)
						  .attr("class","starPlotAxis");
	}



	if (pixel in data){
		var d="";
		for (var i=0; i< nCat;i++){
			var key = Object.keys(data[key0])[i];
			d += (i==0? "M":"L") +  (Math.cos( i * angleStep) * w/2 * data[pixel][key]) + " " + (Math.sin( i * angleStep) * h/2 * data[pixel][key]) + " ";
		}

		d+= "Z";

		var line = svg.append("path").attr("d",d)
									 .attr("class","starPlotPath");
	}

}

function overallStarPlot(where,data){
	var container = d3.select(where);
	var that=this;

	var w =1000;
	var h=1000;
	this.svgW = w;
	this.svgH = h;


	container.selectAll("*").remove();
	var svg = container.append("svg").attr("class","mosaicSvg")
									//.attr("preserveAspectRatio","none")
									.attr("viewBox",(-w/2)+" "+ (-h/2) +" " + (w)+ " " + (h));


	var key0 = Object.keys(data)[0]
	var nCat = Object.keys(data[key0]).length;
	var angleStep = 2 * Math.PI / nCat;

	for (var i=0; i< nCat;i++){
		svg.append("line").attr("x1",0)
						  .attr("y1",0)
						  .attr("stroke-dasharray", 1 +","+ 1)
						  .attr("x2",Math.cos( i * angleStep) * w/2)
						  .attr("y2",Math.sin( i * angleStep) * h/2)
						  .attr("class","starPlotAxis");
	}



	for (var pixel in data){
		var d="";
		for (var i=0; i< nCat;i++){
			var key = Object.keys(data[key0])[i];
			d += (i==0? "M":"L") +  (Math.cos( i * angleStep) * w/2 * data[pixel][key]) + " " + (Math.sin( i * angleStep) * h/2 * data[pixel][key]) + " ";
		}

		d+= "Z";

		var line = svg.append("path").attr("d",d)
									 .attr("class","overallStarPlotPath");
	}
}