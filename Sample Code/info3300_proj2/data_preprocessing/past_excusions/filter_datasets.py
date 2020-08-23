"""
Filter out SuperheroDataset to remove unnecessary columns (e.g: Alter Egos,
Aliases,First appearance,Race,etc) then combine the rows of the filtered
SuperheroDataset and super_hero_powers on hero name
"""

import csv 

cols = ['Name','Intelligence','Strength','Speed','Durability','Power','Combat',
    'Full name','Creator','Alignment','Gender','Height','Weight','Total Power']
stats = set(['Intelligence','Strength','Speed','Durability','Power','Combat'])
header = ",".join(cols) + "\n"
to_write = []

with open("SuperheroDataset.csv", newline = '') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        if not (row["Intelligence"] and row["Strength"] and row["Speed"] and row["Durability"] and row["Power"] and row["Combat"]):
            print("adsf")
            continue
        res = []
        for c in cols:
            res.append(row[c])
        to_write.append(res)

with open("data2.csv", 'a') as outf:
    outf.write(header)
    for row in to_write:
        w = ",".join(row)
        outf.write(w + "\n")


