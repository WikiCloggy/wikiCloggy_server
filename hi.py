import json
from collections import OrderedDict

res = [{"keyword" : "exciting", "probability" : "0.88"},
{"keyword" : "stomachache", 
"probability" : "0.10"},{"keyword" : "stressed", "probability" : "0.02"}]

# Write JSON
with open('sample.json', 'w', encoding="utf-8") as make_file:
    json.dump(res, make_file, ensure_ascii=False, indent="\t")