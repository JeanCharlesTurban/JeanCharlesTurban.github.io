"""
This script truncates the columns of consolidated_copmanies.csv to be only 
name, creator, weight, and height so that the csv can be easily read into a 
dataframe and the median of weight and height can be easily grabbed via the 
.describe() function in the pandas library
"""

import csv
to_write = []


with open("joined_data.csv", newline = '') as f:
    reader = csv.reader(f)
    for row in reader:
        #skip the header row
        if row[8] == "Creator":
            continue
        creator = row[8]
        name = row[0]
        if row[11].split(" ")[-1] == "meters":
            height = str(int(float(row[11].split(" ")[-2]) * 100))
        else:
            height = row[11].split(" ")[-2]
        if row[12].split(" ")[-1] == "tons":
            weight = str(int(float(row[12].split(" ")[-2]) * 1000))
        else:
            weight = row[12].split(" ")[-2]

        # make missing height/weight attributes NaN so pandas can deal with it
        if height == "0" or weight == "0":
            height, weight = "", ""
        row[11] = height 
        row[12] = weight
            
        to_write.append([name, creator, weight, height])
        if creator in stats:
            stats[creator] += 1
        else:
            stats[creator] = 1

with open("tmp.csv", 'w') as outf:
    header = "name, creator, weight (kg), height (cm)\n"
    outf.write(header)
    for row in to_write:
        w = ",".join(row)
        outf.write(w + "\n")