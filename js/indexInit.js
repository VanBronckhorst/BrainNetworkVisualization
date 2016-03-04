function init(){

	var r = 130;
	var c = 172;




	var mosaic = new mosaicView("#mosaicDivContainer",r,c,communityXTime,0,10);
	
	var chooser = new groupsChooserView("#chooserDivContainer");
	chooser.onClick(function(){
		mosaic.updateColor();
	})


	var timeLineData=[];
	for (var i in sizeXTime){
		timeLineData.push(sizeXTime[i]["tot"]);	
	}



	var timeLine = new timelineView("#timelineDivContainer",timeLineData);
	timeLine.onTimeChange(function(min,span){
		mosaic.changeTimeSpan(min,span);
	});

	d3.select('.zoomSizeDiv').call(d3.slider()
							.min(1)
							.max(10)
							.value(4)
							.on("slide", function(evt, value) {
						      	mosaic.changeLensSize(value);
						    })
    );

    d3.select('.lensSizeDiv').call(d3.slider()
							.min(10)
							.max(70)
							.value(50)
							.on("slide", function(evt, value) {
						      	mosaic.changeLensDivSize(value);
						    })
    );
}