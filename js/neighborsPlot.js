function neighborsPlot(where,data,pixel,num,prox,sim) {

	this.container = d3.select(where);

	var r = 500;

	this.svg = this.container.append("svg").attr("viewBox", -r + " " + -r + " " + 2*r + " " + 2*r);

	var x = d3.scale.linear().range([-r,r]).domain([-prox,prox]);
	var y = d3.scale.linear().range([-r,r]).domain([-prox,prox]);

	var sortedNeigh = []

	var r= 130;
	var c = 172;

	var pR = Math.floor(pixel / c);
	var pC = Math.floor(pixel % c);

	var center = {r:pR,c:pC};


	this.sim = function(o1,o2) {
		var n1 = o1.r * c + o1.c;
		var n2 = o2.r * c + o2.c;

		var res = 0;

		//console.log("here");
		for (var i in data){
			//console.log(data[i][n1][0]+ " , "+ data[i][n2][0])
			if (data[i][n1][0] == data[i][n2][0]){
				res+=1;
			}
		}

		return res;

	}

	var sim = this.sim;

	for (var i = pR - prox;i<=pR+prox;i++){
		for (var j = pC - prox;j<=pC+prox;j++){
			var curr = {r:i,c:j};
			
			curr.sim = sim(curr,center);
			if (sortedNeigh.length < num ){
				sortedNeigh = insertSorted(curr,sortedNeigh,false);

			} else if (sortedNeigh[0].sim < curr.sim){

				sortedNeigh = insertSorted(curr,sortedNeigh,true);
			}

		}
	}

	console.log(sortedNeigh);


}




function insertSorted(el,arr,elimFirst){
	var tmp = arr;
	arr = [];

	var j=elimFirst ? 1: 0;
	var used = false;
	while (j < tmp.length){
		if (tmp[j].sim < el.sim || used){
			arr.push(tmp[j]);
			j +=1;
		} else{
			arr.push(el);
			used = true;
		}
	}

	if (!used){
		arr.push(el);
	}

	return arr;
}