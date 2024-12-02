from openai import OpenAI
from pydantic import BaseModel
from typing import List
import re
import ast
import tiktoken

client = OpenAI()


def limit_token_count(input_text):
    max_tokens = 100000
    tokenizer = tiktoken.encoding_for_model("gpt-4o-mini")

    tokens = tokenizer.encode(input_text)
    print(f"Token count: {len(tokens)}")
    if len(tokens) <= max_tokens:
        return input_text

    truncated_tokens = tokens[:max_tokens]

    truncated_text = tokenizer.decode(truncated_tokens)

    return truncated_text

def parse_response(response):
    try:
        matches = re.findall(r'```json(.*?)```', response, re.DOTALL)[0]
        return ast.literal_eval(matches)
    except Exception as e:
        print(f"Error parsing response: {e}")
        return []


# class LinkItem(BaseModel):
#     id: str
#     name: str
    
# class ResponseOutput(BaseModel):
#     id: str
#     name: str
#     topics: List[LinkItem]


def get_data(data):
    url = data.get("url")
    scraped_data = data.get("scraped_data")
    links = data.get("extracted_links", [])
    return url, scraped_data, links
    
def link_ranking(url, scraped_data, links):
    scraped_data = limit_token_count(str(scraped_data))
    links = limit_token_count(str(links))
    prompt ="""
        Analyze the following Wikipedia content and the provided links to determine the prerequisite topics needed to understand the main topic. 
        Create a learning path that leads up to the main topic, listing the prerequisites in order from foundational to advanced concepts.
        Main Topic Link: {url}
        
        Main Topic Content:{scraped_data}

        Links:{links}
        Please provide the output strictly in the following JSON format:

        ```json
        [
            {{
                "id": "main topic link",
                "name": "main  name", 
                "topics": [
                    {{"id": "Link1", "name": "Topic1"}},
                    {{"id": "Link2", "name": "Topic2"}},
                    ...
                ]
            }},
            ...
        ]
        ```
        
        - The topics should be an ordered list of 10 prerequisite topics chosen from the links, leading up to the main topic and shouldn't include the main topic itself.
        - Each object in topics contains an id and its corresponding name.

        Output:
        """
    prompt = prompt.format(url=url, scraped_data=scraped_data, links=links)
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        # response_format=ResponseOutput
    )
    result = completion.choices[0].message.content
    result = parse_response(result)
    print(f"GPT result: ", result)
    return result
   
def get_ranked_results(wiki_data):
    url, scraped_data, links = get_data(wiki_data)
    parsed_result = link_ranking(url, scraped_data, links)
    return parsed_result    
