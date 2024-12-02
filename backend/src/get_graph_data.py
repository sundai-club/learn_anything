from src.wiki_scraper import scrape_and_clean_wikipedia
from src.ranking_links import get_ranked_results
    

def create_graph(url):
    cleaned_data = scrape_and_clean_wikipedia(url)
    ranked_graph = get_ranked_results(cleaned_data)
    return ranked_graph

# wiki_url = "https://en.wikipedia.org/wiki/Artificial_intelligence"
# out = create_graph(wiki_url)

# print(out)