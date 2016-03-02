function init(){

	var r = 130;
	var c = 172;

	var chooser = new groupsChooserView("#chooserDivContainer");

	var mosaic = new mosaicView("#mosaicDivContainer",r,c,communityXTime,0,10);
	


	var timeLineData=[];
	for (var i in sizeXTime){
		timeLineData.push(sizeXTime[i]["tot"]);	
	}



	var timeLine = new timelineView("#timelineDivContainer",timeLineData);
	timeLine.onTimeChange(function(min,span){
		mosaic.changeTimeSpan(min,span);
	});
}