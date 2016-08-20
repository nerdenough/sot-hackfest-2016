import sys
import json
import os
import os.path

ROOTDIR = "raw_data"
OUTPUTDIR = "data_json"

def parse(path):
    dhb_list = []
    disease_index_map = {}
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
                if not (disease in disease_index_map):
                    disease_index_map[disease] = {}
                submap = disease_index_map[disease]
                submap[dhb_index] = columns[j]
    return json.dumps(disease_index_map,
                      sort_keys=True,
                      indent=4, separators=(',', ': '))

def convert(path, output_path):
    with open(output_path, "w") as output_file:
        code = parse(path)
        output_file.write(code)

if __name__ == "__main__":
    try:
        os.mkdir(OUTPUTDIR)
    except OSError:
        pass # Directory already exists
    for subdir, dirs, files in os.walk(ROOTDIR):
        for file in files:
            print "Converting {0}...".format(file)
            input_path = os.path.join(ROOTDIR, file)
            file_without_ext = os.path.splitext(file)[0]
            output_path = os.path.join(OUTPUTDIR, file_without_ext + ".json")
            convert(input_path, output_path)
    print "Done."
