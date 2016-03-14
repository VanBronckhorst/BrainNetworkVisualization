
f = open('../data/Old38_a3/gColorTop10_f100.txt', 'rw')
f2 = open('../data/Old38_a3/iColorTop10_f100.txt', 'rw')
degree = open('../data/Old38_a3/nodeDegree_f100.txt', 'rw')
size = open('../data/Old38_a3/gSizeTop10_f100.txt', 'rw')
size2 = open('../data/Old38_a3/iSizeTop10_f100.txt', 'rw')

res ={}
res["rows"] = 130
res["cols"] = 172
timestamp =0;
for line in f:
    dic={}
    ar = line.split("\t")
    for (i,x) in enumerate(ar):
        if (x != '0' and x!="\n"):
            dic[i] = [int(x)]
    res[timestamp] = dic
    timestamp +=1

res["times"] = timestamp
timestamp =0;
for line in f2:
    dic = res[timestamp]
    ar = line.split("\t")
    for (i,x) in enumerate(ar):
        if (x != '0' and x!="\n"):
            if i in res[timestamp]:
                res[timestamp][i].append(int(x))
            else:
                res[timestamp][i] = [0,int(x)]
    timestamp +=1

timestamp =0;
for line in degree:
    ar = line.split("\t")
    for (i,x) in enumerate(ar):
        if (x != '0' and x!="\n"):
            if i in res[timestamp]:
                res[timestamp][i].append(int(x))
            else:
                res[timestamp][i] = [0,0,int(x)]
    timestamp +=1

#SIZE
timestamp =0;
for line in size:
    ar = line.split("\t")

    for (i,x) in enumerate(ar):
        if (i == len(ar)-2):
            res[timestamp]["size"] = [int(x)]

    timestamp +=1
timestamp =0;
for line in size2:
    ar = line.split("\t")

    for (i,x) in enumerate(ar):
        if (i == len(ar)-2):
            res[timestamp]["size"].append(int(x))

    timestamp +=1

import json

f2 = open('../data/Old38_a3/dataCompressed.json', 'w+')
json.dump(res,f2, sort_keys=True,indent=4, separators=(',', ': '))