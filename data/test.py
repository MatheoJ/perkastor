from SPARQLWrapper import SPARQLWrapper, JSON
def get_streets(city_id):
  sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
  sparql.setQuery(f"""
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

  SELECT ?location ?locationLabel ?wikipediaUrl ?coord WHERE {{
    ?location wdt:P131 wd:{city_id}.
    ?location rdfs:label ?locationLabel .
    FILTER (lang(?locationLabel) = "fr")
    
    OPTIONAL {{
      ?wikipediaUrl schema:about ?location .
      FILTER (STRSTARTS(STR(?wikipediaUrl), "https://fr.wikipedia.org/"))
    }}

    {{
      ?location wdt:P31/wdt:P279* wd:Q34442 .
    }} UNION {{
      ?location wdt:P31/wdt:P279* wd:Q79007 .
    }} UNION {{
      ?location wdt:P31/wdt:P279* wd:Q226649 .
    }} UNION {{
      ?location wdt:P31/wdt:P279* wd:Q41192 .
    }} UNION {{
      ?location wdt:P31/wdt:P279* wd:Q3257686 .
    }} UNION {{
      ?location wdt:P31/wdt:P279* wd:Q174782  .
    }}
    ?location wdt:P625 ?coord .
  }}
""")


  sparql.setReturnFormat(JSON)
  results = sparql.query().convert()
  return results

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
    "parc" : 0.0001,
}

import json
cities = json.load(open('cities.json'))


import concurrent.futures

def get_city_streets(city):
    attempts = 0
    results = None
    while attempts < 5:
        try:
            results = get_streets(city["id"])
            break
        except Exception as e:
            print(e, city["name"], end='/')
            attempts += 1
    streets = []
    seen = set()
    if results is not None:
        for result in results["results"]["bindings"]:
            if not result['locationLabel']['value'] in seen:
                streetArea = size[result['locationLabel']['value'].split(" ")[0].lower()] if result['locationLabel']['value'].split(" ")[0].lower() in size else None
                streets.append({"link" : result['location']['value'], "label" : result['locationLabel']['value'], "wikipediaUrl" : result['wikipediaUrl']['value'] if 'wikipediaUrl' in result else None, "coordinates": result['coord']['value'], "area": streetArea})
                seen.add(result['locationLabel']['value'])
    else:
        results = []
    return {"city": city, "streets": streets}

data = []

# Utilisez un ThreadPoolExecutor pour exécuter plusieurs appels à get_city_streets() en parallèle
with concurrent.futures.ThreadPoolExecutor() as executor:
    # Récupérez les rues pour chaque ville dans la liste "cities"
    future_to_city = {executor.submit(get_city_streets, city): city for city in cities}
    
    # Parcourez les résultats des threads et ajoutez-les à la liste "data"
    for future in concurrent.futures.as_completed(future_to_city):
        try:
            city_data = future.result()
            data.append(city_data)
            print(f"Rues récupérées pour {city_data['city']['name']}")
        except Exception as e:
            print(f"Erreur lors de l'exécution du thread: {e}")

# Enregistrez les données dans un fichier JSON
with open('data.json', 'w') as outfile:
    json.dump(data, outfile)
    