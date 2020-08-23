""" This script will return the number of superheroes per company and return, 
for each company, the average height and weight (in cm and kg, respectively) of 
all the characters where those attributes were given of each company and of the 
to-be-created column: Miscellaneous); It will return as a json"""
import csv 
import json 

total_weights = {}
total_heights = {}
total_characters = {}
average_weights = {}
average_heights = {}

no_creator = 0

def add_to_dict(d, key, value):
    if key not in d:
        d[key] = value
    else: 
        d[key] += value

with open("joined_data.csv", newline = '') as f:
    reader = csv.reader(f)
    for row in reader:
        #skip the header row
        if row[8] == "Creator":
            continue
        creator = row[8]
        # if len(creator) == 0:
        #     no_creator += 1
        #     print(row)
        #     input()
        height = float(row[11].split(" ")[-2])
        # if row[12].split(" ")[-1] == "tons":
        #     continue
        weight = float(row[12].split(" ")[-2])
        if height == 0 or weight == 0 or row[12].split(" ")[-1] == "tons":
            # add_to_dict(total_weights, creator, 0)
            # add_to_dict(total_heights, creator, 0)
            # add_to_dict(total_characters, creator, 0)
            continue
        add_to_dict(total_weights, creator, weight)
        add_to_dict(total_heights, creator, height)
        add_to_dict(total_characters, creator, 1)
        if not (creator == "Marvel Comics" or creator == "DC Comics" or creator == "Dark Horse Comics"):
            add_to_dict(total_weights, "Miscellaneous", weight)
            add_to_dict(total_heights, "Miscellaneous", height)
            add_to_dict(total_characters, "Miscellaneous", 1)

for creator in total_weights:
    den = total_characters[creator]
    if den == 0:
        avg_weight = 0
        avg_height = 0
    else:
        avg_weight = total_weights[creator] / den
        avg_height = total_heights[creator] / den

    add_to_dict(average_weights, creator, avg_weight)
    add_to_dict(average_heights, creator, avg_height)


# for creator in total_heights:


print("HEIGHT")
print(average_heights)
print()
print("WEIGHT")
print(average_weights)
print()
print('NUMBER OF CHARACTERS')
print(total_characters)

print()
print()
print('no_creators', no_creator)


# save to jsons
# with open("average_heights.json", 'w') as outf: 
#     json.dump(average_heights, outf)
# with open("average_weights.json", 'w') as outf:
#     json.dump(average_weights, outf)