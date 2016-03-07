function parseFromFile(url,url2,callback){


	d3.json(url, function(error, json) {
	  if (error) return console.warn(error);
	  var d={}
	  for (var i=0;i<json["times"];i++){
	  	d[i] = [];
	 	for (var r=0; r<json["rows"];r++){
	 		for (var c=0; c<json["cols"];c++){
	 			if (json[i.toString()][(r*json["cols"]+c).toString()]){
	 				d[i].push(json[i.toString()][(r*json["cols"]+c).toString()]);
	 			}else{
	 				// [gColor,iColor,degree]
	 				d[i].push([0,0,0]);
	 			}
	 		}
	 	}
	  }

	  var s=[];
	  for (var i=0;i<json["times"];i++){
	  	s.push(json[i]["size"]);
	  }

	  d3.json(url2, function(error, json) {
		  if (error) return console.warn(error);
		  var d2={}
		  for (var i=0;i<json["times"];i++){
		  	d2[i] = [];
		 	for (var r=0; r<json["rows"];r++){
		 		for (var c=0; c<json["cols"];c++){
		 			if (json[i.toString()][(r*json["cols"]+c).toString()]){
		 				d2[i].push(json[i.toString()][(r*json["cols"]+c).toString()]);
		 			}else{
		 				// [gColor,iColor,degree]
		 				d2[i].push([0,0,0]);
		 			}
		 		}
		 	}
		  }

		  var s2=[];
		  for (var i=0;i<json["times"];i++){
		  	s2.push(json[i]["size"]);
		  }
		  //data = json;
		  //console.log(d);
		  callback(d,d2,s,s2);
		});
	 
	});

}

function parseFromSingleFile(url,callback){


	d3.json(url, function(error, json) {
	  if (error) return console.warn(error);
	  var d={}
	  for (var i=0;i<json["times"];i++){
	  	d[i] = [];
	 	for (var r=0; r<json["rows"];r++){
	 		for (var c=0; c<json["cols"];c++){
	 			if (json[i.toString()][(r*json["cols"]+c).toString()]){
	 				d[i].push(json[i.toString()][(r*json["cols"]+c).toString()]);
	 			}else{
	 				// [gColor,iColor,degree]
	 				d[i].push([0,0,0]);
	 			}
	 		}
	 	}
	  }

	  var s=[];
	  for (var i=0;i<json["times"];i++){
	  	s.push(json[i]["size"]);
	  }
		callback(d,s);
	});
}

