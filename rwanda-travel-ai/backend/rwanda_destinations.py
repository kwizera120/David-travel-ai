def _n(text: str) -> str:
    return (text or "").strip().lower()


DISTRICT_ATTRACTIONS: dict[str, list[str]] = {
    "gasabo": ["Kigali Golf Resort", "Nyarutarama area", "Kimironko Market"],
    "kicukiro": ["Kicukiro memorial sites", "Kigali neighborhoods tour", "Rebero viewpoints"],
    "nyarugenge": ["Kigali Genocide Memorial", "Nyamirambo cultural walk", "Kandt House Museum"],
    "burera": ["Lake Burera", "Lake Ruhondo", "Rugezi Marsh viewpoints"],
    "gakenke": ["Nemba hot springs area", "Hilly rural viewpoints", "Local craft villages"],
    "gicumbi": ["Miyove tea estates", "Byumba center", "Muko viewpoints"],
    "musanze": ["Volcanoes National Park", "Musanze Caves", "Iby'Iwacu Cultural Village"],
    "rulindo": ["Shyorongi stopover", "Rulindo tea landscapes", "Yanze viewpoints"],
    "gisagara": ["Save area markets", "Rural cycling routes", "Southern farm tours"],
    "huye": ["Ethnographic Museum", "Arboretum of Ruhande", "National University cultural area"],
    "kamonyi": ["Runda hills", "Nyabarongo riverside spots", "Musambira local market"],
    "muhanga": ["Kabgayi Cathedral", "Rural heritage sites", "Southern transit viewpoints"],
    "nyanza": ["King's Palace Museum", "Rwesero Art Museum", "Traditional royal dairy site"],
    "nyaruguru": ["Nyungwe edge viewpoints", "Tea plantation hills", "Nature walking trails"],
    "ruhango": ["Kinazi cassava area", "Southern cultural stops", "Rural landscape viewpoints"],
    "bugesera": ["Ntarama Genocide Memorial", "Nyamata memorial sites", "Cyohoha lake area"],
    "gatsibo": ["Gabiro area access", "Eastern savannah landscapes", "Local cattle routes"],
    "kayonza": ["Akagera National Park access", "Rwinkwavu area", "Lake Ihema route access"],
    "kirehe": ["Akagera eastern edge", "Nasho lakes zone", "Kirehe local markets"],
    "ngoma": ["Kibungo center", "Eastern culture stops", "Rural market trails"],
    "nyagatare": ["Akagera south gate access", "Mimuri viewpoints", "Cattle ranch landscapes"],
    "rwamagana": ["Muhazi Lake", "Nyakariro viewpoints", "Rwamagana local craft spots"],
    "karongi": ["Napoleon Island", "Lake Kivu boat tours", "Environmental Museum"],
    "ngororero": ["Congo Nile trail access", "Hilly forest drives", "Ruhango-ngororero viewpoints"],
    "nyabihu": ["Bigogwe hills", "Volcano foothill scenery", "Tea plantation drives"],
    "nyamasheke": ["Lake Kivu shores", "Shangi viewpoints", "Congo Nile trail sections"],
    "rubavu": ["Gisenyi Public Beach", "Lake Kivu Promenade", "Nyamyumba hot springs"],
    "rusizi": ["Kamembe town", "Rusizi river area", "Nyungwe southern gateway"],
    "rutsiro": ["Lake Kivu escarpments", "Bumba hill views", "Coffee washing station visits"],
}


LOCATION_ALIASES = {
    "kigali": "nyarugenge",
    "gisenyi": "rubavu",
    "butare": "huye",
    "kinigi": "musanze",
    "cyangugu": "rusizi",
    "kabgayi": "muhanga",
    "nyamata": "bugesera",
    "kibungo": "ngoma",
}


INTEREST_TO_PLACES = {
    "wildlife & safaris": ["Akagera National Park", "Volcanoes National Park", "Nyungwe National Park"],
    "culture & history": ["Kigali Genocide Memorial", "Ethnographic Museum Huye", "King's Palace Museum Nyanza"],
    "adventure sports": ["Congo Nile Trail", "Volcano hiking trails", "Lake Kivu kayaking"],
    "relaxation": ["Lake Kivu resorts", "Muhazi lakeside lodges", "Gisenyi beach front"],
    "photography": ["Twin Lakes viewpoints", "Akagera sunrise points", "Volcano foothill landscapes"],
    "local cuisine": ["Nyamirambo restaurants", "Kimironko food market", "Musanze local grills"],
}


ROUTE_STOPOVERS = {
    ("kigali", "musanze"): ["Shyorongi", "Nyirangarama", "Musanze viewpoints"],
    ("kigali", "rubavu"): ["Musanze", "Nyabihu", "Gisenyi waterfront"],
    ("kigali", "huye"): ["Kamonyi", "Ruhango", "Nyanza"],
    ("kigali", "rusizi"): ["Muhanga", "Karongi", "Nyamasheke"],
    ("kigali", "kayonza"): ["Rwamagana", "Kayonza center", "Akagera access"],
    ("kigali", "nyagatare"): ["Rwamagana", "Gatsibo corridor", "Nyagatare ranch zone"],
}


def resolve_district(location: str) -> str | None:
    value = _n(location)
    if not value:
        return None

    if value in DISTRICT_ATTRACTIONS:
        return value
    if value in LOCATION_ALIASES:
        return LOCATION_ALIASES[value]

    for district in DISTRICT_ATTRACTIONS:
        if district in value or value in district:
            return district
    return None


def get_attractions(location: str, limit: int = 3) -> list[str]:
    district = resolve_district(location)
    if not district:
        return []
    return DISTRICT_ATTRACTIONS[district][:limit]


def get_interest_places(interests: list[str], limit: int = 5) -> list[str]:
    results: list[str] = []
    for interest in interests:
        key = _n(interest)
        results.extend(INTEREST_TO_PLACES.get(key, []))
    unique = list(dict.fromkeys(results))
    return unique[:limit]


def get_route_stopovers(from_city: str, to_city: str, limit: int = 3) -> list[str]:
    from_key = _n(from_city)
    to_key = _n(to_city)
    direct = ROUTE_STOPOVERS.get((from_key, to_key), [])
    reverse = ROUTE_STOPOVERS.get((to_key, from_key), [])
    candidates = direct or reverse
    return candidates[:limit]
