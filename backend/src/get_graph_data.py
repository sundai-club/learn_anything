from backend.src.ranking_links import get_ranked_results
from backend.src.wiki_scraper import scrape_and_clean_wikipedia


def create_graph(url):
    cleaned_data = scrape_and_clean_wikipedia(url)
    ranked_graph = get_ranked_results(cleaned_data)
    return ranked_graph


def consolidate_node_info(graph):
    node_data = {}

    for node in graph:
        node_id = node["id"]
        node_data[node_id] = {
            "label": node["label"],
            "type": node["type"],
            "outgoing_edges": [],
            "incoming_edges": [],
        }


# wiki_url = "https://en.wikipedia.org/wiki/Artificial_intelligence"
# out = create_graph(wiki_url)

# print(out)
