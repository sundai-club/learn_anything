from fastapi import FastAPI
from backend.src.graph_creation import create_graph
from backend.src.bq_utils import save_graph_to_bq, get_graph_from_bq, save_wiki_info_to_bq, get_wiki_info_from_bq

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/get_graph")
def get_graph(request: dict):
    url = request["url"]
    return {"graph": create_graph(url)}

@app.post("/save_graph_to_bq")
def save_graph_to_bq(request: dict):
    user_id = request["user_id"]
    url = request["url"]
    graph = request["graph"]
    save_graph_to_bq(user_id, url, graph)
    return {"message": "Graph saved to BigQuery"}

@app.post("/get_graph_from_bq")
def get_graph_from_bq(request: dict):
    user_id = request["user_id"]
    url = request["url"]
    return {"graph": get_graph_from_bq(user_id, url)}

@app.post('/save_wiki_info')
def save_wiki_info(request: dict):
    url = request["url"]
    wiki_info = request["wiki_info"]
    save_wiki_info(url, wiki_info)
    return {"message": "Wiki info saved to BigQuery"}

@app.post('/get_wiki_info')
def get_wiki_info(request: dict):
    url = request["url"]
    return {"wiki_info": get_wiki_info(url)}