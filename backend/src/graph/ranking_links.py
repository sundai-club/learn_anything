from openai import OpenAI
import os
from dotenv import load_dotenv
import json
import ast

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")


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
    prompt = f"Analyze the following Wikipedia content and the provided links to determine the top ten most relevant links:\n\n"
    prompt += f"Wikipedia Content:\n{scraped_data}\n\n"
    prompt += f"Links:\n {links}\n"
    
    prompt += """Please provide the output strictly in the following format: 
    {"summary": sample summary, "top_links": [(topic1, link1), (topic2, link2), ...]} 
    The sample summary will provide a short concise summary of the main page,
    The top_links will include a list of the 10 most relevant links based on their connection to the original content except the main content itself.
    Each tuple contains a concise, descriptive topic and its corresponding link.
    """
    client = OpenAI(api_key=api_key)
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    result = completion.choices[0].message.content
    print(f"GPT result: ", result)
    return result
   
def main():
    url, scraped_data, links = get_data("cleaned_output.json")
    result = link_ranking(scraped_data, links)
    # with open("test.json", "w") as f:
    #     json.dump(result, f)
        
    parsed_result = parse_results(result)
    print("\n ------------------------ \n")
    if parsed_result:
    # Access the summary
        print("Summary:", parsed_result['summary'])
    
    # Access the top links
    print("\nTop Links:")
    for topic, link in parsed_result['top_links']:
        print(f"{topic}: {link}")
    
main()

