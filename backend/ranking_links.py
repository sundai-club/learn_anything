from openai import OpenAI
import os
from dotenv import load_dotenv
import json
from pydantic import BaseModel

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

class LinkItem(BaseModel):
    topic: str
    link: str
    
class ResponseOutput(BaseModel):
    summary: str
    top_links: list[LinkItem]

def get_data(json_file):
    with open("cleaned_output.json", "r") as f:
        data = json.load(f)
        url = data.get("url")
        scraped_data = data.get("scraped_data")
        links = data.get("extracted_links", [])
    return url, scraped_data, links

def parse_results(output):
    try:
        parsed_dict = ast.literal_eval(output)
        return parsed_dict
    except Exception as e:
        print(f"An error occurred: {e}")
    
def link_ranking(scraped_data, links):
    prompt = (
        f"Analyze the following Wikipedia content and the provided links to determine the prerequisite topics needed to understand the main topic. "
        f"Create a learning path that leads up to the main topic, listing the prerequisites in order from foundational to advanced concepts.\n\n"
        f"Main Topic Content:\n{scraped_data}\n\n"
        f"Links:\n{links}\n\n"
        "Please provide the output strictly in the following JSON format:\n"
        "{\n"
        '  "summary": "Sample summary",\n'
        '  "top_links": [\n'
        '    {"topic": "Topic1", "link": "Link1"},\n'
        '    {"topic": "Topic2", "link": "Link2"},\n'
        '    ...\n'
        "  ]\n"
        "}\n"
        "- The 'summary' should be a short, concise summary of the main topic.\n"
        "- The 'top_links' should be an ordered list of 10 prerequisite topics chosen from the links, leading up to the main topic and shouldn't include the main topic itself.\n"
        "- Each object in 'top_links' contains a 'topic' and its corresponding 'link'.\n"
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
    parsed_result = link_ranking(scraped_data, links)
    # with open("test.json", "w") as f:
    #     json.dump(result, f)
        
    # parsed_result = parse_results(result)
    print("\n ------------------------ \n")
    if parsed_result:
    # Access the summary
        print("Summary:", parsed_result.summary)
    
    # Access the top links
    print("\nTop Links:")
    for item in parsed_result.top_links:
        print(f"{item.topic}: {item.link}")
    
main()

