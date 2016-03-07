var timeLine;
var chooser;
var mosaic;
var mosaicRight;

function initWithData(data,dataRight,sizeData,sizeDataRight){

	var r = 130;
	var c = 172;
	console.log(window);

	var sword = new swordPlot("#swordDivContainerLeft",data,1);
	var swordRight = new swordPlot("#swordDivContainerRight",dataRight,1);
	

	mosaic = new mosaicView("#mosaicDivContainerLeft",r,c,data,0,10,"#swordDivContainerLeft");
	mosaicRight = new mosaicView("#mosaicDivContainerRight",r,c,dataRight,0,10,"#swordDivContainerRight");


	chooser = new groupsChooserView("#chooserDivContainer");
	chooser.onClick(function(){
		mosaic.updateColor();
		mosaicRight.updateColor();
	})


	


	timeLine = new timelineView("#timelineDivContainer",sizeData,sizeDataRight);
	timeLine.onTimeChange(function(min,span){
		mosaic.changeTimeSpan(min,span);
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
}


function init(){
	parseFromFile("data/Young40_a1/dataCompressed.json","data/Old38_a1/dataCompressed.json",initWithData);
}


function changeLeftData(data,sizeData){

	var r = 130;
	var c = 172;

	mosaic = new mosaicView("#mosaicDivContainerLeft",r,c,data ,timeLine.minTime ,timeLine.span ,"#swordDivContainerLeft");
	
	timeLine.changeLeftData(sizeData);

}

function changeRightData(data,sizeData){

	var r = 130;
	var c = 172;

	mosaicRight = new mosaicView("#mosaicDivContainerRight",r,c,data ,timeLine.minTime ,timeLine.span ,"#swordDivContainerRight");
	timeLine.changeRightData(sizeData);

}

function changeLeftMosaicData(){
	var x = document.getElementById("dataOptionListLeft");
	var i = x.selectedIndex;
	var value = x.options[i].value;
	var url = "data/" + value + "_a1/dataCompressed.json";

	parseFromSingleFile(url,changeLeftData);
}
function changeRightMosaicData(){
	var x = document.getElementById("dataOptionListRight");
	var i = x.selectedIndex;
	var value = x.options[i].value;
	var url = "data/" + value + "_a1/dataCompressed.json";

	parseFromSingleFile(url,changeRightData);
}

function changeAction(act) {
	mosaic.changeAction(act);
	mosaicRight.changeAction(act);
}
