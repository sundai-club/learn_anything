from fastapi import FastAPI
from backend.graph_creation import create_graph

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/get_graph")
def get_graph(request: dict):
    url = request["url"]
    return {"graph": create_graph(url)}