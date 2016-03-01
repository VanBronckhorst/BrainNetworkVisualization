
// compute the correlation coefficient value (0~1) between node(x0, y0) and node(x1, y1)
float Similarity(int x0, int y0, int x1, int y1) {
   
  int windowSize = cellSize*cellSize;  // the window size for computing the correlation 
  int node0_index = y0*imgWidth+x0;
  int node1_index = y1*imgWidth+x1;
  
  // compute standard deviation
  float node0_sd, node0_s1 = 0, node0_s2 = 0;
  float node1_sd, node1_s1 = 0, node1_s2 = 0;
  float sum_node0_node1 = 0;
  
  for (int w=0; w<windowSize; w++) {
    node0_s1 += gColorFile.value[startTime+w][node0_index];
    node0_s2 += sq(gColorFile.value[startTime+w][node0_index]);
    node1_s1 += gColorFile.value[startTime+w][node1_index];
    node1_s2 += sq(gColorFile.value[startTime+w][node1_index]);
    sum_node0_node1 += gColorFile.value[startTime+w][node0_index] * gColorFile.value[startTime+w][node1_index];
  }
  node0_sd = sqrt((node0_s2 - node0_s1*node0_s1/windowSize)/(windowSize-1));
  node1_sd = sqrt((node1_s2 - node1_s1*node1_s1/windowSize)/(windowSize-1));
  
  // compute correlation
  float cor = (sum_node0_node1 - node0_s1*node1_s1/windowSize)/(windowSize-1)/node0_sd/node1_sd;
  return cor;
}
