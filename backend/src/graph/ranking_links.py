#!/usr/bin/env python3

from openai import OpenAI
import os
from dotenv import load_dotenv
import json
from pydantic import BaseModel

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

class LinkItem(BaseModel):
    id: str
    name: str
    
class ResponseOutput(BaseModel):
    id: str
    name: str
    topics: list[LinkItem]
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../"))
data_dir = os.path.join(ROOT, "backend/data")
results_dir = os.path.join(ROOT, "backend/results")


def get_data(json_file):
    if not os.path.exists(json_file):
        raise ValueError(f"File {json_file} does not exist")
        return -1

    with open(json_file, "r") as f:
        data = json.load(f)
        url = data.get("url")
        scraped_data = data.get("scraped_data")
        links = data.get("extracted_links", [])
    return url, scraped_data, links
    
def link_ranking(url, scraped_data, links):
    prompt = (
        f"Analyze the following Wikipedia content and the provided links to determine the prerequisite topics needed to understand the main topic. "
        f"Create a learning path that leads up to the main topic, listing the prerequisites in order from foundational to advanced concepts.\n\n"
        f"Main Topic Link: \n{url}\n"
        f"Main Topic Content:\n{scraped_data}\n\n"
        f"Links:\n{links}\n\n"
        "Please provide the output strictly in the following JSON format:\n"
        "{\n"
        '  "id": "main topic link",\n'
        '  "name": "main  name", \n'
        '  "topics": [\n'
        '    {"id": "Link1", "name": "Topic1"},\n'
        '    {"id": "Link2", "name": "Topic2"},\n'
        '    ...\n'
        "  ]\n"
        "}\n"
        "- The 'topics' should be an ordered list of 10 prerequisite topics chosen from the links, leading up to the main topic and shouldn't include the main topic itself.\n"
        "- Each object in 'topics' contains an 'id' and its corresponding 'name'.\n"
    )
    
    client = OpenAI(api_key=api_key)
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format=ResponseOutput
    )
    result = completion.choices[0].message.parsed
    print(f"GPT result: ", result)
    return result
   
def main():
    url, scraped_data, links = get_data("cleaned_output.json")
    parsed_result = link_ranking(url, scraped_data, links)
    # with open("test.json", "w") as f:
    #     json.dump(result, f)
        
    # parsed_result = parse_results(result)
    print("\n ------------------------ \n")
    with open("result.json", "w") as f:
        json.dump(parsed_result.dict(), f)
    print(f"Main Link: {parsed_result.id}")
    print(f"{parsed_result.name}")
    
    # Access the top links
    print("\nTop Links:")
    for item in parsed_result.topics:
        print(f"{item.name}: {item.id}")
    
main()


