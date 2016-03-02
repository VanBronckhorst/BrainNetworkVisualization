// 2D Barcodes

//ReadFile pValueFile;
ReadFile gColorFile;

public int imgWidth = 172;
public int imgHeight = 130;
public int pixel = 130*172;
public int scale = 1;

// hard-coding some parameters
public int startTime = 90;
public int cellSize = 5;  // the number of sub-cells for an individual node
                          // for example, if cellSize = 5, then draw a 5-by-5 barcode showing the community identifications over 25 time steps
public int proximity_Min = 10;
public int proximity_Max = 25;
public double similarity_Min = 0.85;
public double similarity_Max = 0.95;
public int neighbors_Num = 5;


void setup() {

 size(imgWidth*cellSize*scale+imgWidth-1, imgHeight*cellSize*scale+imgHeight-1); 
 
 //pValueFile = new ReadFile("data/old38_pixelsGreyValue_f350-1349.txt", pixel);  
 //pValueFile.load();
 //println("pValueFile: " + pValueFile.timeline);
 
 gColorFile = new ReadFile("data/Old38a1_top10communities_f180_gColor.txt", pixel);  
 gColorFile.load();
 println("gColorFile: " + gColorFile.timeline);
 
 InitColor();
}

void draw() {
  background(255); 
  
  for (int i=0; i<172; i++) {
    for (int j=0; j<130; j++) {
      draw_Barcode(i, j);
    }
  }
  
  // highlight the selected node
  fill(clusterColor[5], 220);
  ellipse(selectedPixeX*cellSize*scale + selectedPixeX + cellSize*scale/2, 
          selectedPixeY*cellSize*scale + selectedPixeY + cellSize*scale/2, 
          cellSize*scale-1, cellSize*scale-1);
  
  // draw PAS (proximity and similarity) node-link diagram overlaid on the brain slice image
  int N = proximity_Max*2*(proximity_Max-int(proximity_Min/sqrt(2)));
  float[] similarity = new float[N];
  int r = 0;  
  // only check partial area in which the neighbors statisfy the proximity condition,
  // and also need adding conditions in the for loops for checking boundaries !!!
  for (int i=selectedPixeX-proximity_Max; i<selectedPixeX+proximity_Max && selectedPixeX!=0; i++) {
    for (int j=selectedPixeY-proximity_Max; j<selectedPixeY-int(proximity_Min/sqrt(2)) && selectedPixeY!=0; j++) {      
      similarity[r] = Similarity(selectedPixeX, selectedPixeY, i, j);
            
      // check if the neighbors satisfy the similarity condition and draw the node-link diagram
      if (similarity[r] >= similarity_Min && similarity[r] <= similarity_Max) {
        stroke(clusterColor[5]);
        strokeWeight(1);
        line(selectedPixeX*cellSize*scale + selectedPixeX + cellSize*scale/2, 
             selectedPixeY*cellSize*scale + selectedPixeY + cellSize*scale/2, 
             i*cellSize*scale + i + cellSize*scale/2, j*cellSize*scale + j + cellSize*scale/2);
        noStroke();
        fill(clusterColor[5], 220);
        ellipse(i*cellSize*scale + i + cellSize*scale/2, j*cellSize*scale + j + cellSize*scale/2, cellSize*scale-1, cellSize*scale-1);
      }
      
      println("cor: " + similarity[r]);
      r++;
    }
  }
  
  //save("test.tif");
  save("test.jpg");
}

void draw_Barcode(int i, int j) {
  int p = j*172+i;
  for (int t=0; t<cellSize*cellSize; t++) {
    //fill(pValueFile.value[46+t][p]/16);
    fill(clusterColor[(int)gColorFile.value[startTime+t][p]], 180);
    noStroke();
    rect((i*cellSize + t%cellSize)*scale + i, (j*cellSize + t/cellSize)*scale + j, scale, scale);
  }
  /*
  noFill();
  stroke(color(227, 26, 28), 180);
  strokeWeight(1);
  rect(i*cellSize*scale, j*cellSize*scale, cellSize*scale-1, cellSize*scale-1);
  */
}

/************************************************************/
public int selectedPixeX = 0;
public int selectedPixeY = 0;

void mouseClicked() {    
  if (mouseX%(cellSize*scale + 1) != 0) {
    selectedPixeX = mouseX/(cellSize*scale + 1);
  }
  if (mouseY%(cellSize*scale + 1) != 0) {
    selectedPixeY = mouseY/(cellSize*scale + 1);
  }  
  println("X: " + (selectedPixeX+1) + ", Y: " + (selectedPixeY+1));
}
