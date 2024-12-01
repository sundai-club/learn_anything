from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.graph_creation import create_graph
from src.bq_helper import save_graph_to_bq, get_graph_from_bq, save_wiki_info_to_bq, get_wiki_info_from_bq


dummy_data = {
  "domains": [
    {
      "id": "cs",
      "name": "Computer Science",
      "topics": [
        { "id": "cs_algo", "name": "Algorithms" },
        { "id": "cs_ds", "name": "Data Structures" },
        { "id": "cs_ai", "name": "Artificial Intelligence" }
      ]
    },
    {
      "id": "math",
      "name": "Mathematics",
      "topics": [
        { "id": "math_calc", "name": "Calculus" },
        { "id": "math_alg", "name": "Algebra" },
        { "id": "math_stats", "name": "Statistics" }
      ]
    }
  ]
}


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/get-graph")
def get_graph(request: dict):
    url = request["url"]
    # return {"graph": create_graph(url)}
    return dummy_data


# @app.post("/save_graph_to_bq")
# def save_graph_to_bq(request: dict):
#     user_id = request["user_id"]
#     url = request["url"]
#     graph = request["graph"]
#     save_graph_to_bq(user_id, url, graph)
#     return {"message": "Graph saved to BigQuery"}

# @app.post("/get_graph_from_bq")
# def get_graph_from_bq(request: dict):
#     user_id = request["user_id"]
#     url = request["url"]
#     return {"graph": get_graph_from_bq(user_id, url)}

# @app.post('/save_wiki_info')
# def save_wiki_info(request: dict):
#     url = request["url"]
#     wiki_info = request["wiki_info"]
#     save_wiki_info(url, wiki_info)
#     return {"message": "Wiki info saved to BigQuery"}

# @app.post('/get_wiki_info')
# def get_wiki_info(request: dict):
#     url = request["url"]
#     return {"wiki_info": get_wiki_info(url)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)