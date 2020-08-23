"""
This script will consolidate all heroes associated with a company having < 32 
characters into one large miscellaneous company. It will also only return weights 
in lbs. Missing height/weight values in the dataset, will be replaced by the median 
values of the overall dataset (grabbed via pandas) 
"""

import csv
import json

stats = {}
cols = [
    "Name", "Intelligence", "Strength", "Speed", "Durability", "Power", "Combat",
    "Full name", "Creator", "Alignment","Gender","Height","Weight","Total Power",
    "hero_names", "Agility","Accelerated Healing","Lantern Power Ring","Dimensional Awareness",
    "Cold Resistance","Durability","Stealth","Energy Absorption","Flight","Danger Sense",
    "Underwater breathing","Marksmanship","Weapons Master","Power Augmentation",
    "Animal Attributes","Longevity","Intelligence","Super Strength","Cryokinesis","Telepathy",
    "Energy Armor","Energy Blasts","Duplication","Size Changing","Density Control",
    "Stamina","Astral Travel","Audio Control","Dexterity","Omnitrix","Super Speed",
    "Possession","Animal Oriented Powers","Weapon-based Powers","Electrokinesis",
    "Darkforce Manipulation","Death Touch","Teleportation","Enhanced Senses",
    "Telekinesis","Energy Beams","Magic","Hyperkinesis","Jump","Clairvoyance",
    "Dimensional Travel","Power Sense","Shapeshifting","Peak Human Condition",
    "Immortality","Camouflage","Element Control","Phasing","Astral Projection",
    "Electrical Transport","Fire Control","Projection","Summoning","Enhanced Memory",
    "Reflexes","Invulnerability","Energy Constructs","Force Fields","Self-Sustenance",
    "Anti-Gravity","Empathy","Power Nullifier","Radiation Control","Psionic Powers",
    "Elasticity","Substance Secretion","Elemental Transmogrification",
    "Technopath/Cyberpath","Photographic Reflexes","Seismic Power","Animation",
    "Precognition","Mind Control","Fire Resistance","Power Absorption","Enhanced Hearing",
    "Nova Force","Insanity","Hypnokinesis","Animal Control","Natural Armor","Intangibility",
    "Enhanced Sight","Molecular Manipulation","Heat Generation","Adaptation","Gliding",
    "Power Suit","Mind Blast","Probability Manipulation","Gravity Control","Regeneration",
    "Light Control","Echolocation","Levitation","Toxin and Disease Control","Banish",
    "Energy Manipulation","Heat Resistance","Natural Weapons","Time Travel","Enhanced Smell",
    "Illusions","Thirstokinesis","Hair Manipulation","Illumination","Omnipotent",
    "Cloaking","Changing Armor","Power Cosmic","Biokinesis","Water Control",
    "Radiation Immunity","Vision - Telescopic","Toxin and Disease Resistance",
    "Spatial Awareness","Energy Resistance","Telepathy Resistance","Molecular Combustion",
    "Omnilingualism","Portal Creation","Magnetism","Mind Control Resistance","Plant Control",
    "Sonar","Sonic Scream","Time Manipulation","Enhanced Touch","Magic Resistance",
    "Invisibility","Sub-Mariner","Radiation Absorption","Intuitive aptitude",
    "Vision - Microscopic","Melting","Wind Control","Super Breath","Wallcrawling",
    "Vision - Night","Vision - Infrared","Grim Reaping","Matter Absorption","The Force",
    "Resurrection","Terrakinesis","Vision - Heat","Vitakinesis","Radar Sense","Qwardian Power Ring",
    "Weather Control","Vision - X-Ray","Vision - Thermal","Web Creation","Reality Warping",
    "Odin Force","Symbiote Costume","Speed Force","Phoenix Force","Molecular Dissipation",
    "Vision - Cryo","Omnipresent","Omniscient"

]
header = ",".join(cols) + "\n"
to_write = []

filled_in = 0
tot = 0
tot_weight = 0
misc_missing = 0
marvel_missing = 0
dc_missing = 0
dark_horse_missing = 0
missing_creator = {}

# statistics found via pandas library (get medians.ipynb)
median_height = "183"
median_weight = "83"

with open("joined_data.csv", newline = '') as f:
    reader = csv.reader(f)
    for row in reader:
        #skip the header row
        if row[8] == "Creator":
            continue
        creator = row[8]
        tot += 1
        if not (creator == "Marvel Comics" or creator == "DC Comics" or creator == "Dark Horse Comics"):
            row[8] = "Miscellaneous"

        if row[11].split(" ")[-1] == "meters":
            height = str(int(float(row[11].split(" ")[-2]) * 100))
        else:
            height = row[11].split(" ")[-2]
        if row[12].split(" ")[-1] == "tons":
            weight = str(int(float(row[11].split(" ")[-2]) * 1000))
        else:
            weight = row[12].split(" ")[-2]

        # filling in missing height/weight attributes
        if height == "0" or weight == "0":
            height = median_height
            weight = median_weight
        row[11] = height 
        row[12] = weight
            
        to_write.append(row)
        if creator in stats:
            stats[creator] += 1
        else:
            stats[creator] = 1

print(stats)
print()
print(missing_creator)

differences = {}
for creator in stats:
    if creator.lower() in missing_creator:
        differences[creator] =  stats[creator] - missing_creator[creator.lower()]

print()
print("number of characters per each company that has height/weight data")
print(differences)

with open("final_dataset.csv", 'w') as outf:
    outf.write(header)
    for row in to_write:
        w = ",".join(row)
        outf.write(w + "\n")