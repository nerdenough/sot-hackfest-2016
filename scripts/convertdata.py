import sys
import json

def parse(path):
    dhb_list = []
    dhb_index_and_disease_case_map = {}
    with open(path, "r") as file:
        for idx, line in enumerate(file):
            if idx == 0:
                continue # skip first line
            if idx == 1:
                dhb_list.extend([l for l in line.strip().split(",") if l.strip() != ""])
                continue
            if idx % 2 != 0:
                continue # skip rows corresponding to cases
            columns = line.strip().split(",")
            disease = columns[0]
            for j in xrange(2, len(columns)):
                dhb_index = j - 1
                if not (dhb_index in dhb_index_and_disease_case_map):
                    dhb_index_and_disease_case_map[dhb_index] = {}
                submap = dhb_index_and_disease_case_map[dhb_index]
                submap[disease] = columns[j]
    print json.dumps(dhb_index_and_disease_case_map, sort_keys=True, indent=4, separators=(',', ': '))

if __name__ == "__main__":
    path = sys.argv[1]
    parse(path)
