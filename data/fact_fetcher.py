import spacy
from spacy.matcher import Matcher
import regex as re
import json
import requests
from bs4 import BeautifulSoup
import sys
import signal
def detect_historical_facts_v3(text, only_street_facts=False):

    historical_facts = []
    nlp = spacy.load("fr_core_news_sm")
    date_pattern = r"\b(?:\d{1,2}\s)?(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|\d{1,2}(?:er)?\s(?:siècle)|X{1,3}V{0,1}I{0,3}e\s(?:siècle)|\d{4})\b"
    date_matches = [match for match in re.finditer(
        date_pattern, text, re.IGNORECASE)]

    doc = nlp(text)

    matcher = Matcher(nlp.vocab)
    date_token_ids = []

    for match in date_matches:
        date_start, date_end = match.span()
        date_text = match.group()

        char_span = doc.char_span(date_start, date_end)
        if char_span is not None:
            token_start = char_span.start
            date_token_ids.append(token_start)

    pattern = [{"POS": "NUM", "OP": "?"}, {"TEXT": {"REGEX": date_pattern}}, {
        "POS": "ADP", "OP": "?"}, {"POS": "NOUN", "OP": "?"}]
    matcher.add("DATE_PATTERN", [pattern])
    matches = matcher(doc)
    coords = {}
    for match_id, start, end in matches:
        if start in date_token_ids:
            sent = doc[start:end].sent
            if only_street_facts:
                for street_name in ["rue", "avenue", "boulevard", "place", "quai", "allée", "voie", "cours", "impasse", "passage", "route", "square", "chemin", "rond-point", "pont", "cité", "esplanade", "promenade", "voie", "cathédrale", "église", "île", "chapelle"]:
                    if street_name in sent.text.lower():
                        fact = {"date": doc[start:end].text, "entities_loc": [], "entities_per": [], "entities_org": [], "description": sent.text}
                        for ent in sent.ents:
                            if ent.label_ == "LOC":
                                fact["entities_loc"].append(ent.text)
                            elif ent.label_ == "PER":
                                fact["entities_per"].append(ent.text)
                            elif ent.label_ == "ORG":
                                fact["entities_org"].append(ent.text)
                                '''
                                if len(city_name) > 0 and len(fact["entities_loc"]) > 0:
                                    if coords.get(max(fact['entities_loc'] , key=len) + ", " + city_name) is None:
                                        coords[max(fact['entities_loc'] , key=len) + ", " + city_name] = get_coordinates(max(fact['entities_loc'] , key=len) + ", " + city_name)
                                    fact["coordinates"] = coords[max(fact['entities_loc'] , key=len) + ", " + city_name]
                                else:
                                    fact["coordinates"] = (None, None)
                                '''

                        historical_facts.append(fact)
                        break
            else:

                fact = {"date": doc[start:end].text, "entities_loc": [], "entities_per": [], "entities_org": [], "description": sent.text}
                for ent in sent.ents:
                    if ent.label_ == "LOC":
                        fact["entities_loc"].append(ent.text)
                    elif ent.label_ == "PER":
                        fact["entities_per"].append(ent.text)
                    elif ent.label_ == "ORG":
                        fact["entities_org"].append(ent.text)
                '''
                if len(city_name) > 0 and len(fact["entities_loc"]) > 0:
                    if coords.get(max(fact['entities_loc'] , key=len) + ", " + city_name) is None:
                        coords[max(fact['entities_loc'] , key=len) + ", " + city_name] = get_coordinates(max(fact['entities_loc'] , key=len) + ", " + city_name)
                    fact["coordinates"] = coords[max(fact['entities_loc'] , key=len) + ", " + city_name]
                else:
                    fact["coordinates"] = (None, None)
                '''
                historical_facts.append(fact)
    #historical_facts = [fact for fact in historical_facts if np.array([street in fact["description"].lower() for street in ["rue", "avenue", "boulevard", "place", "quai", "allée", "voie", "cours", "impasse", "passage", "route", "square", "chemin", "rond-point", "pont", "cité", "esplanade", "promenade", "voie", "cathédrale","église","île","chapelle"]]).any()]
    return historical_facts



def get_section_contents(url, regex_list):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    sections = ""

    for regex in regex_list:
        pattern = re.compile(regex, re.IGNORECASE)

        headers = soup.find_all(lambda tag: tag.name in {"h2"} and pattern.match(tag.text))

        for header in headers:
            content = ""
            for sibling in header.find_next_siblings():
                if sibling.name in {"h2"}:
                    break
                if sibling.name in {"h3", "h4", "h5", "h6"}:
                    continue
                sibling_text = re.sub(r'\[\d+\]', '', sibling.text)
                content += sibling_text.strip() + "\n"

            #section_title = header.text.strip().split('[')[0]
            sections += content
    
    return sections

import concurrent.futures

def find_facts_wikipedia(url, city_name="", only_streets=False, city_id=""):
    regex_list = [r'(?i)\bhist', r'(?i)\bcultur', r'(?i)\bpatrimo']
    histoire = get_section_contents(url, regex_list)
    historic_facts = detect_historical_facts_v3(histoire, only_streets)
    return {"id": city_id, "name": city_name, "facts": historic_facts}

def main():
    # Utilisez un ThreadPoolExecutor pour exécuter plusieurs appels à get_city_streets() en parallèle
    with concurrent.futures.ThreadPoolExecutor() as executor:
        # Récupérez les rues pour chaque ville dans la liste "cities"
        future_to_city = {executor.submit(find_facts_wikipedia, city["wikipediaUrl"], city["name"], False , city["id"]): city for city in cities[:10000]}
        
        # Parcourez les résultats des threads et ajoutez-les à la liste "data"
        i = 1
        for future in concurrent.futures.as_completed(future_to_city):
            try:
                data = future.result()
                facts[data["id"]] = data["facts"]
                print(f"Faits historiques récupérés : {data['name']} - {len(data['facts'])} - [{i}/{10000}]")
                i += 1
            
            except Exception as e:
                print(f"Erreur lors de l'exécution du thread: {e}")

    # Enregistrez les données dans un fichier JSON
    with open('facts2.json', 'w', encoding="utf-8") as outfile:
        json.dump(facts, outfile, indent=4, ensure_ascii=False)


def save_facts_and_exit(signal_number, frame):
    print("\nInterrupted by user. Saving facts and exiting...")
    with open('facts3.json', 'w', encoding="utf-8") as outfile:
        json.dump(facts, outfile, indent=4, ensure_ascii=False)
    sys.exit(0)

facts = {}
cities = json.load(open("citiesv2.json", "r", encoding="utf-8"))

signal.signal(signal.SIGINT, save_facts_and_exit)
signal.signal(signal.SIGTERM, save_facts_and_exit)

main()
