import requests, json
import concurrent.futures
import signal
import sys

def process_facts(city, facts, cities, streetNames, size):
    known_places = {}
    street_facts_list = []
    for fact in facts[city]:
        print(fact, end=' ')
        for street in streetNames:
            if any(street + delimiter in fact["description"].lower() for delimiter in [" ", "."]):
                fact["area"] = size[street] if street in size else None
                if len(fact["entities_loc"]) != 0:
                    key_place = max(fact["entities_loc"]) + " " + cities[city]["name"]
                    if key_place not in known_places:
                        known_places[key_place] = get_coordinates(key_place)
                    fact["coord"] = known_places[key_place]
                    fact["street_loc"] = True
                else:
                    fact["coord"] = cities[city]["coordinates"]
                    fact["street_loc"] = False
                
                if fact["coord"] == (None, None):
                    fact["coord"] = cities[city]["coordinates"]
                    fact["street_loc"] = False
                
                street_facts_list.append(fact)
                print(city, end='/')
                break     
    return city, street_facts_list

# get coordinates
def get_coordinates(address):
    try:
        params = {
        "q": address,
        "format": "jsonv2"
        }

        response = requests.get("https://nominatim.openstreetmap.org/search", params=params)
        result = response.json()[0]

        latitude = result["lat"]
        longitude = result["lon"]
    
    except:
        latitude = None
        longitude = None
    
    return latitude, longitude

size = {
    "rue" : 0.0005,
    "avenue" : 0.001,
    "boulevard" : 0.002,
    "place" : 0.0008,
    "allée" : 0.0002,
    "impasse" : 0.0001,
    "chemin" : 0.0003,
    "cours" : 0.0004,
    "quai" : 0.0006,
    "passage" : 0.0007,
    "square" : 0.0009,
    "route" : 0.0011,
    "rond-point" : 0.001,
    "voie" : 0.0005,
    "promenade" : 0.0002,
    "parc" : 0.001,
}
streetNames = ["rue", "avenue", "boulevard", "place", "quai", "allée", "voie", "cours", "impasse", "passage", "route", "square", "chemin", "rond-point", "pont", "cité", "esplanade", "promenade", "voie", "cathédrale", "église", "île", "chapelle"]
with open('./citiesv3.json', encoding="utf-8") as cities_file, \
     open('./facts750k.json', encoding="utf-8") as facts_file:
    cities = json.load(cities_file)
    facts = json.load(facts_file)
street_facts = {}


def save_facts_and_exit(signal_number, frame):
  print("\nInterrupted by user. Saving facts and exiting...")
  with open('streetsfacts_test.json', 'w', encoding="utf-8") as outfile:
      json.dump(street_facts, outfile, indent=4, ensure_ascii=False)
  sys.exit(0)

signal.signal(signal.SIGINT, save_facts_and_exit)
signal.signal(signal.SIGTERM, save_facts_and_exit)

data =  process_facts("Q90", facts, cities, streetNames, size)
print(data[0])