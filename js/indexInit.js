var timeLine,timeLineRight;
var chooser;
var mosaic;
var mosaicRight;
var timeSync = true;

function initWithData(data,dataRight,sizeData,sizeDataRight,network,networkRight){

	var r = 130;
	var c = 172;

	var sword = new swordPlot("#swordDivContainerLeft",data,1);
	var swordRight = new swordPlot("#swordDivContainerRight",dataRight,1);

	mosaic = new mosaicView("#mosaicDivContainerLeft",r,c,data,0,10,"#swordDivContainerLeft","#starPlotDivContainerLeft",network);
	mosaicRight = new mosaicView("#mosaicDivContainerRight",r,c,dataRight,0,10,"#swordDivContainerRight","#starPlotDivContainerRight",networkRight);

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

    var overallLeft = new overallStarPlot("#overallStarPlotDivContainerLeft",network);
    var overallRight = new overallStarPlot("#overallStarPlotDivContainerRight",networkRight);
    

    var knnFun = function(data,pixel){
    	console.log("ToKNN");
    	var knn = new neighborsPlot("#knnDivContainer",data,pixel,5,5,0)
    }

    mosaic.onKNN(knnFun);
    mosaicRight.onKNN(knnFun);
}


function init(){
	parseFromFile("data/Young40_a1/dataCompressed.json","data/Old38_a1/dataCompressed.json",
				  "data/Young40_a1/network_metrics.csv","data/Old38_a1/network_metrics.csv",initWithData);
}


function changeLeftData(data,sizeData,netData){

	var r = 130;
	var c = 172;

	timeLine.changeData(sizeData);
	mosaic = new mosaicView("#mosaicDivContainerLeft",r,c,data ,timeLine.minTime ,timeLine.span ,"#swordDivContainerLeft","#starPlotDivContainerLeft",netData);
	
	
	var overall = new overallStarPlot("#overallStarPlotDivContainerLeft",netData);
}

function changeRightData(data,sizeData,netData){

	var r = 130;
	var c = 172;

	rightTimeLine.changeData(sizeData);
	mosaicRight = new mosaicView("#mosaicDivContainerRight",r,c,data ,rightTimeLine.minTime ,rightTimeLine.span ,"#swordDivContainerRight","#starPlotDivContainerRight",netData);
	
	var overall = new overallStarPlot("#overallStarPlotDivContainerRight",netData);


}

function changeLeftMosaicData(){
	var x = document.getElementById("dataOptionListLeft");
	var i = x.selectedIndex;
	var value = x.options[i].value;
	var url = "data/" + value + "/dataCompressed.json";
	var netUrl = "data/" + value + "/network_metrics.csv";
	parseFromSingleFile(url,netUrl,changeLeftData);
}
function changeRightMosaicData(){
	var x = document.getElementById("dataOptionListRight");
	var i = x.selectedIndex;
	var value = x.options[i].value;
	var url = "data/" + value + "/dataCompressed.json";
	var netUrl = "data/" + value + "/network_metrics.csv";
	parseFromSingleFile(url,netUrl,changeRightData);
}

function changeAction(act) {
	mosaic.changeAction(act);
	mosaicRight.changeAction(act);
}

function changeTimeChain(val){
	timeSync = val;
}
