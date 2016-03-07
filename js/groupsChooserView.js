var activeColorScale = [	"#cccccc",
						"#a6cee3",
						"#1f78b4",
						"#b2df8a",
						"#33a02c",
						"#fb9a99",
						"#e31a1c",
						"#fdbf6f",
						"#ff7f00",
						"#cab2d6",
						"#6a3d9a"];
var colorScale = [	"#cccccc",
						"#a6cee3",
						"#1f78b4",
						"#b2df8a",
						"#33a02c",
						"#fb9a99",
						"#e31a1c",
						"#fdbf6f",
						"#ff7f00",
						"#cab2d6",
						"#6a3d9a"];

function groupsChooserView(where){
	var container = d3.select(where);
	var that=this;

	var w =1000;
	var h=100;
	this.svgW = w;
	this.svgH = h;

	var padding = 10;
	var len = activeColorScale.length;
	
	var svg = container.append("svg").attr("class","mosaicSvg")
									.attr("viewBox","0 0 " + (w + padding * (2 + len))+ " " + (h + padding * 2));
	this.onClickFun = function(){};
	
	// Show the color circles
	this.update = function(){
		svg.selectAll(".colorChooser").style("fill",function(d){
									return colorScale[d];
								});
		this.onClickFun();
	}



	for (var i = 1; i<len;i++){
		svg.append("circle").attr("class","colorChooser").datum(i)
							.style("fill",function(d){
								return colorScale[d];
							})
							.style("stroke",function(d){
								return activeColorScale[d];
							})
							.attr("cx", function(d){
								
								return d * w / len + padding * d;
							})
							.attr("cy", h/2)
							.attr("r", Math.min(h/2, w / len/2))
							.on("mouseup",function(j){
								if (colorScale[j]==activeColorScale[j]){
									colorScale[j] = colorScale[0];
								}else{
									colorScale[j]=activeColorScale[j];
								}
								that.update();
							});
	}

	this.onClick = function(fun){
		this.onClickFun = fun;
	}

}