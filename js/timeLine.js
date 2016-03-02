function timelineView(where,data){


	var container = d3.select(where);
	var that=this;

	var w =1000;
	var h=100;
	this.svgW = w;
	this.svgH = h;

	var padding = 10;

	this.minTime = 0;
	this.span = 10;

	var svg = container.append("svg").attr("class","mosaicSvg")
									.attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + (w)+ " " + (h));

	this.timeWindow = svg.append("rect").attr("class","timeWindow");
	// Parse the date / time
	var parseDate = d3.time.format("%d-%b-%y").parse;

	// Set the ranges
	var x = d3.scale.linear().range([0, w]);
	var y = d3.scale.linear().range([h, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5);

	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(5);

	// Define the line
	var valueline = d3.svg.line()
	    .x(function(d,i) { return x(i); })
	    .y(function(d,i) { return y(d); });
	    								
	// Scale the range of the data
	this.numOfTimes = 0;

	for (var i in data){
		this.numOfTimes +=1;
	}


    x.domain([0,this.numOfTimes]);
    y.domain([0, 172*130]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));


    svg.on("mouseup",function(e){
    	var xPoint = d3.mouse(this)[0];
    	var xPerc = xPoint / w;
    	that.minTime = Math.floor(xPerc * that.numOfTimes); 
    	that.onChangeFunc(that.minTime,that.span);
    	that.updateTimeWindow();
    });
    // Add the X Axis
    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + h + ")")
    //     .call(xAxis);

    // // Add the Y Axis
    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis);

    this.onTimeChange = function(fun){
    	this.onChangeFunc = fun;
    }

    this.updateTimeWindow = function(){
    	this.timeWindow.attr("x",this.minTime * (this.svgW / this.numOfTimes))
    					.attr("y",0)
    					.attr("height",this.svgH)
    					.attr("width",this.span * (this.svgW / this.numOfTimes));
    }

   	this.updateTimeWindow();

}
