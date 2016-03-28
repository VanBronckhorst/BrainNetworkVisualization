function timelineView(where,data){


	var container = d3.select(where);
	var that=this;

	var w =1000;
	var h=100;
	this.svgW = w;
	this.svgH = h;

	var padding = 10;

	this.minTime = 20;
	this.span = 10;
	this.onChangeFunc = function(){};

	this.svg = container.append("svg").attr("class","mosaicSvg")
									.attr("preserveAspectRatio","none")
									.attr("viewBox","0 0 " + (w)+ " " + (h));
	var svg = this.svg;

	var LEFT=1;
	var RIGHT = 2;

	this.timeWindow = svg.append("rect").attr("class","timeWindow");
	this.leftHandle = svg.append("circle").attr("class", "left timeHandle").datum(LEFT);
	this.rightHandle = svg.append("circle").attr("class", "right timeHandle").datum(RIGHT);



	// handles behavior
	var drag = d3.behavior.drag()
        .on("drag", function(d,i) {
        	
        	var xPoint = d3.event.x;
	    	var xPerc = xPoint / w;
	    	var time = Math.floor(xPerc * that.numOfTimes); 
	    	if (d == RIGHT){
	    		if (time != that.minTime + that.span){
	    			that.span = time - that.minTime;
	    			that.updateTimeWindow();
	    		}
	    	}else{
	    		if (time != that.minTime ){
	    			var dTime = that.minTime - time;
	    			that.minTime = time;
	    			that.span += dTime;
	    			that.updateTimeWindow();
	    		}
	    	}
        })
        .on("dragend",function(){
        	that.onChangeFunc(that.minTime,that.span);
        });
	
	this.rightHandle.call(drag);
	this.leftHandle.call(drag);


	// Set the ranges
	this.x = d3.scale.linear().range([0, w]);
	var x = this.x;
	this.y = d3.scale.linear().range([h, 0]);
	var y = this.y;

	// Define the axes
	this.xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5);
	var xAxis = this.xAxis

	this.yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(5);
	var yAxis = this.yAxis

	// Define the line
	this.valueline = d3.svg.line()
	    .x(function(d,i) { return x(i); })
	    .y(function(d,i) { return y(d[0]); });
	var valueline = this.valueline; 

	// Scale the range of the data
	this.numOfTimes = 0;


	var maxS = 0;

	for (var i in data){
		this.numOfTimes +=1;
		maxS = (data[i][0] > maxS )? data[i][0] : maxS;
	}


    x.domain([0,this.numOfTimes]);
    y.domain([0, maxS +1]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // svg.append("path")
    //     .attr("class", "lineRight")
    //     .attr("d", valueline(data2));


    svg.on("click",function(e){
    	// check if the click is not the end of a drag event
    	if (d3.event.defaultPrevented) return;

    	var xPoint = d3.mouse(this)[0];
    	var xPerc = xPoint / w;
    	that.minTime = Math.floor(xPerc * that.numOfTimes); 
    	that.updateTimeWindow();
    	that.onChangeFunc(that.minTime,that.span);
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

    this.changeTime = function(min,span){
    	this.minTime = min;
    	this.span = span; 
    	this.updateTimeWindow();
    	//this.onChangeFunc(this.minTime,this.span); // Causes loop
    }

    this.updateTimeWindow = function(){
    	if (this.minTime + this.span >= this.numOfTimes){
    		this.minTime = this.numOfTimes - this.span -1;
    	}

    	this.timeWindow.attr("x",this.minTime * (this.svgW / this.numOfTimes))
    					.attr("y",0)
    					.attr("height",this.svgH)
    					.attr("width",this.span * (this.svgW / this.numOfTimes));

    	this.leftHandle.attr("cx",this.minTime * (this.svgW / this.numOfTimes))
    					.attr("cy",0)
    					.attr("r",5)

    	this.rightHandle.attr("cx",(this.minTime + this.span) * (this.svgW / this.numOfTimes))
    					.attr("cy",0)
    					.attr("r",5)
    	
    }

    this.changeData= function(data, min, span){
    	this.minTime = min; //0;
    	this.span = span; //10;
    	this.numOfTimes = 0;
    	var maxS = 0;
		for (var i in data){
			this.numOfTimes +=1;
			maxS = (data[i][0] > maxS )? data[i][0] : maxS;

		}


	    x.domain([0,this.numOfTimes]);
	    y.domain([0, maxS]);
    	this.updateTimeWindow();
    	this.svg.select(".line")
    			.attr("d", this.valueline(data));
    }

    // this.changeRightData= function(data){
    // 	this.svg.select(".lineRight")
    // 			.attr("d", this.valueline(data));
    // }

   	this.updateTimeWindow();

}
