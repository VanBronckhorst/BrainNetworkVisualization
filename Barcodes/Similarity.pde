
// compute the correlation coefficient value (0~1) between node(x0, y0) and node(x1, y1)
float Similarity(int x0, int y0, int x1, int y1) {
  
  int node0_index = y0*imgWidth+x0;
  int node1_index = y1*imgWidth+x1;
  float node0_sd, node0_s1 = 0, node0_s2 = 0;
  float node1_sd, node1_s1 = 0, node1_s2 = 0;
  float sum_node0_node1 = 0;
  
  /***************************************************/
  // Pearson Correlation -- Incorrect !!! (NOT USE IT)
  /*int windowSize = cellSize*cellSize;  // the window size for computing the correlation    
  // compute standard deviation  
  for (int w=0; w<windowSize; w++) {
    node0_s1 += gColorFile.value[startTime+w][node0_index];
    node0_s2 += sq(gColorFile.value[startTime+w][node0_index]);
    node1_s1 += gColorFile.value[startTime+w][node1_index];
    node1_s2 += sq(gColorFile.value[startTime+w][node1_index]);
    sum_node0_node1 += gColorFile.value[startTime+w][node0_index] * gColorFile.value[startTime+w][node1_index];
  }
  */
  /***************************************************/
  
  /*int windowSize = 10;
  int[] node0_gSize = new int[windowSize];
  int[] node1_gSize = new int[windowSize];
  for (int w=0; w<windowSize; w++) {
    node0_gSize[w] = 0;
    node1_gSize[w] = 0;
  }
  
  for (int i=0; i<cellSize*cellSize; i++) {
    if ((int)gColorFile.value[startTime+i][node0_index] > 0) {
      node0_gSize[(int)gColorFile.value[startTime+i][node0_index]-1]++;
    }
    if ((int)gColorFile.value[startTime+i][node1_index] > 0) {
      node1_gSize[(int)gColorFile.value[startTime+i][node1_index]-1]++;
    }    
  }
  
  // compute standard deviation
  for (int w=0; w<windowSize; w++) {
    node0_s1 += node0_gSize[w];
    node0_s2 += sq(node0_gSize[w]);
    node1_s1 += node1_gSize[w];
    node1_s2 += sq(node1_gSize[w]);
    sum_node0_node1 += node0_gSize[w] * node1_gSize[w];
  }
  */
  /***************************************************/
  
  // trying to use run lengths (BUT NOT GOOD...)
  // http://www.philippsinger.info/?p=413 
  // generate the vector showing the run lenghs matrix (the number of cases that a certain group with a certain length)
  /******************************************
    length   group1   group2   ...   group10
      1        3        1              2
      2        5        1              4
      3        10       2              1
     ...
     max       0        0              0
    max = cellSize*cellSize
  ******************************************/
  
  int windowSize = cellSize*cellSize*10;
  int[] node0_runLengths = new int[windowSize];
  int[] node1_runLengths = new int[windowSize];
  for (int w=0; w<windowSize; w++) {
    node0_runLengths[w] = 0;
    node1_runLengths[w] = 0;
  }
  
  int node0_len = 1, node1_len = 1;
  int index;
  for (int i=1; i<cellSize*cellSize; i++) {
    if (gColorFile.value[startTime+i][node0_index] == gColorFile.value[startTime+i-1][node0_index] 
        && gColorFile.value[startTime+i-1][node0_index] != 0) {
      node0_len++;
    } else if (gColorFile.value[startTime+i][node0_index] != gColorFile.value[startTime+i-1][node0_index] 
               && gColorFile.value[startTime+i-1][node0_index] != 0) {
      index = ((int)gColorFile.value[startTime+i-1][node0_index]-1) * (cellSize*cellSize) + (node0_len-1);
      node0_runLengths[index]++;
      node0_len = 1;
    }
    
    if (gColorFile.value[startTime+i][node1_index] == gColorFile.value[startTime+i-1][node1_index] 
        && gColorFile.value[startTime+i-1][node1_index] != 0) {
      node1_len++;
    } else if (gColorFile.value[startTime+i][node1_index] != gColorFile.value[startTime+i-1][node1_index] 
        && gColorFile.value[startTime+i-1][node1_index] != 0) {
      index = ((int)gColorFile.value[startTime+i-1][node1_index]-1) * (cellSize*cellSize) + (node1_len-1);
      node1_runLengths[index]++;
      node1_len = 1;
    }
  }
  
  // compute standard deviation    
  for (int w=0; w<windowSize; w++) {
    node0_s1 += node0_runLengths[w];
    node0_s2 += sq(node0_runLengths[w]);
    node1_s1 += node1_runLengths[w];
    node1_s2 += sq(node1_runLengths[w]);
    sum_node0_node1 += node0_runLengths[w] * node1_runLengths[w];
  }
  /***************************************************/
  
  node0_sd = sqrt((node0_s2 - node0_s1*node0_s1/windowSize)/(windowSize-1));
  node1_sd = sqrt((node1_s2 - node1_s1*node1_s1/windowSize)/(windowSize-1));
  
  // compute correlation
  float cor = (sum_node0_node1 - node0_s1*node1_s1/windowSize)/(windowSize-1)/node0_sd/node1_sd;
  return cor;
  /***************************************************/
  
  // It may be better to use sequence alignment method!
  // https://en.wikipedia.org/wiki/Needleman%E2%80%93Wunsch_algorithm
  // ...
}
