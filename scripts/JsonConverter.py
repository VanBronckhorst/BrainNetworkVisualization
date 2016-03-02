
f = open('../data/Old38a1_top10communities_f180_gColor.txt', 'rw')
res ={}
timestamp =0;
for line in f:
    ar = line.split("\t")
    for (i,x) in enumerate(ar):
        if (i != len(ar)-1):
            ar[i] = int(x)
    res[timestamp] = ar[:-2]
    timestamp +=1

import json

f2 = open('../data/colorByTimestamp.json', 'r+')
json.dump(res,f2, sort_keys=True,indent=4, separators=(',', ': '))