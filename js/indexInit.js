var timeLine,timeLineRight;
var chooser;
var mosaic;
var mosaicRight;
var timeSync = true;
var zoomSync = true;
var knnFun;

function initWithData(data,dataRight,sizeData,sizeDataRight,network,networkRight,grayData,grayData2){

	var r = 130;
	var c = 172;

	var sword = new swordPlot("#swordDivContainerLeft",data,1,[]);
	var swordRight = new swordPlot("#swordDivContainerRight",dataRight,1,[]);

	mosaic = new mosaicView("#mosaicDivContainerLeft",r,c,data,20,10,"#swordDivContainerLeft","#starPlotDivContainerLeft",network,grayData);
	mosaicRight = new mosaicView("#mosaicDivContainerRight",r,c,dataRight,20,10,"#swordDivContainerRight","#starPlotDivContainerRight",networkRight,grayData2);
	
	
	var legend = new starPlotLegendView("#starPlotLegend");
	
	
	mosaic.onZoom(function(pixels,d){
		if (zoomSync){
			mosaicRight.zoomHere(pixels,d);
		}
	})

	mosaicRight.onZoom(function(pixels,d){
		if (zoomSync){
			mosaic.zoomHere(pixels,d);
		}
	})


	chooser = new groupsChooserView("#chooserDivContainer");
	chooser.onClick(function(){
		mosaic.updateColor();
		mosaicRight.updateColor();
	})


	timeLine = new timelineView("#leftTimelineDivContainer",sizeData);
	timeLine.onTimeChange(function(min,span){
		if (timeSync){
			timeLineRight.changeTime(min,span);
			mosaicRight.changeTimeSpan(min,span);
		}
		mosaic.changeTimeSpan(min,span);
	});

	timeLineRight = new timelineView("#rightTimelineDivContainer",sizeDataRight);
	timeLineRight.onTimeChange(function(min,span){
		if (timeSync){
			timeLine.changeTime(min,span);
			mosaic.changeTimeSpan(min,span);
		}
		mosaicRight.changeTimeSpan(min,span);
	});

	d3.select('.zoomSizeDiv').call(d3.slider()
							.min(1)
							.max(10)
							.value(4)
							.on("slide", function(evt, value) {
						      	mosaic.changeLensSize(value);
						      	mosaicRight.changeLensSize(value);
						    })
    );

    d3.select('.lensSizeDiv').call(d3.slider()
							.min(10)
							.max(70)
							.value(50)
							.on("slide", function(evt, value) {
						      	mosaic.changeLensDivSize(value);
						      	mosaicRight.changeLensDivSize(value);
						    })
    );

    var knnNum = 5;
    var proximity = 5;
    d3.select('#knnNumDiv').call(d3.slider()
							.min(3)
							.max(10)
							.value(5)
							.on("slide", function(evt, value) {
						      	knnNum = Math.floor(value);
						    })
    );

    d3.select('#proximityDiv').call(d3.slider()
							.min(3)
							.max(20)
							.value(5)
							.on("slide", function(evt, value) {
						      	proximity = Math.floor(value);
						    })
    );

    var overallLeft = new overallStarPlot("#overallStarPlotDivContainerLeft",network);
    var overallRight = new overallStarPlot("#overallStarPlotDivContainerRight",networkRight);
    d3.select("#overallStarPlotDivContainerLeft").style("visibility","hidden");
	d3.select("#overallStarPlotDivContainerRight").style("visibility","hidden");

    knnFun = function(data,pixel,min,span){
    	console.log("ToKNN");
    	var knn = new neighborsPlot("#knnDivContainer",data,pixel,min,span,knnNum,proximity)
    }

    //mosaic.onKNN(knnFun);
    //mosaicRight.onKNN(knnFun);

    d3.select(".loadingDiv").style("visibility","hidden");
}


function init(){
	parseFromFile("data/Young40_a1/dataCompressed.json","data/Old38_a1/dataCompressed.json",
				  "data/Young40_a1/network_metrics.csv","data/Old38_a1/network_metrics.csv",
				  "data/Young40_a1/pixelsGreyValue_f100.txt","data/Old38_a1/pixelsGreyValue_f100.txt",initWithData);
}


function changeLeftData(data,sizeData,netData,grayData){

	var r = 130;
	var c = 172;

	timeLine.changeData(sizeData,timeLineRight.minTime,timeLineRight.span);
	mosaic = new mosaicView("#mosaicDivContainerLeft",r,c,data,timeLineRight.minTime,timeLineRight.span ,"#swordDivContainerLeft","#starPlotDivContainerLeft",netData,grayData);
	
	//mosaic.onKNN(knnFun);
	mosaic.onZoom(function(pixels,d){
		if (zoomSync){
			mosaicRight.zoomHere(pixels,d);
		}
	})

	var overall = new overallStarPlot("#overallStarPlotDivContainerLeft",netData);
	
	d3.select("#overallStarPlotDivContainerLeft").style("visibility","hidden");
	d3.select("#overallStarPlotDivContainerRight").style("visibility","hidden");
	
	d3.select(".loadingDiv").style("visibility","hidden");
}

function changeRightData(data,sizeData,netData,grayData){

	var r = 130;
	var c = 172;

	timeLineRight.changeData(sizeData,timeLine.minTime,timeLine.span);
	mosaicRight = new mosaicView("#mosaicDivContainerRight",r,c,data,timeLine.minTime,timeLine.span,"#swordDivContainerRight","#starPlotDivContainerRight",netData,grayData);
	
    //mosaicRight.onKNN(knnFun);
    mosaicRight.onZoom(function(pixels,d){
		if (zoomSync){
			mosaic.zoomHere(pixels,d);
		}
	})

	var overall = new overallStarPlot("#overallStarPlotDivContainerRight",netData);
	
	d3.select("#overallStarPlotDivContainerRight").style("visibility","hidden");
	d3.select("#overallStarPlotDivContainerLeft").style("visibility","hidden");
	
	d3.select(".loadingDiv").style("visibility","hidden");
}

function changeLeftMosaicData(){
	var x = document.getElementById("dataOptionListLeft");
	var i = x.selectedIndex;
	var value = x.options[i].value;
	var url = "data/" + value + "/dataCompressed.json";
	var netUrl = "data/" + value + "/network_metrics.csv";
	var pixUrl = "data/" + value + "/pixelsGreyValue_f100.txt";

	d3.select(".loadingDiv").style("visibility","visible");

	parseFromSingleFile(url,netUrl,pixUrl,changeLeftData);
}

function changeRightMosaicData(){
	var x = document.getElementById("dataOptionListRight");
	var i = x.selectedIndex;
	var value = x.options[i].value;
	var url = "data/" + value + "/dataCompressed.json";
	var netUrl = "data/" + value + "/network_metrics.csv";
	var pixUrl = "data/" + value + "/pixelsGreyValue_f100.txt";

	d3.select(".loadingDiv").style("visibility","visible");

	parseFromSingleFile(url,netUrl,pixUrl,changeRightData);
}

function changeAction(act) {
	mosaic.changeAction(act);
	mosaicRight.changeAction(act);

	/*d3.select("#sliderDivContainer").style("visibility", act == "zoom" ? "visible" : "hidden");
	d3.select("#knnOptionsDivContainer").style("visibility", act == "KNN" ? "visible" : "hidden");*/
	
	d3.select("#overallStarPlotDivContainerLeft").style("visibility", act == "KNN" ? "visible" : "hidden");
	d3.select("#overallStarPlotDivContainerRight").style("visibility", act == "KNN" ? "visible" : "hidden");
}

function changeTimeChain(val){
	timeSync = val;
}
function changeZoomChain(val){
	zoomSync = val;
}


function starPlotLegendView(where){
	var container = d3.select(where);
	var that=this;
	
	var w =200;
	var h=200;
	
	var svg = container.append("svg").attr("class","mosaicSvg")
	                                 .attr("viewBox","0 0 " + w + " " + h);
																		
	svg.append("text")
		   .attr("transform", "translate(" + 4 + "," + 10 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 18)
		   .style("fill", "black")
		   .text("Star Plot Axes:");
		   
    svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 30 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("0 - observed");	
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 48 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("1 - time span");	
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 66 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("2 - switching");	
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 84 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("3 - absence");	
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 102 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("4 - visiting");	
    svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 120 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("5 - homing");	
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 138 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("6 - avg group size");	
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 156 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("7 - avg community size");	
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 174 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("8 - avg community stay");	
	svg.append("text")
		   .attr("transform", "translate(" + 6 + "," + 192 + ")")
		   .attr("dy", ".35em")
		   .attr("text-anchor", "start")
		   .attr("font-size", 16)
		   .style("fill", "black")
		   .text("9 - max community stay");				 
}