#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import json
import re
import os


ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../"))
data_dir = os.path.join(ROOT, "backend/data")
results_dir = os.path.join(ROOT, "backend/results")


# Extract all links from the page
def extract_links(soup):
    links = []
    for link in soup.find_all("a", href=True):
        url = link["href"]
        topic = link.get_text(strip=True)  # Extract the text of the link as the topic
        if not url.startswith("http"):
            url = "https://en.wikipedia.org" + url
        if topic:  # Avoid empty topics
            links.append({'link': url, 'topic': topic})
    return links

# Extract paragraphs from the page
def extract_paragraphs(soup):
    paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
    return [p for p in paragraphs if p and len(p) > 10]  # Filter out empty or short paragraphs

# Function to clean text: remove numbers, references, and special characters
def clean_text(text):
    text = re.sub(r'\[[^\]]*\]', '', text)  # Remove [references]
    text = re.sub(r'\(.*?\)', '', text)    # Remove parentheses and their content
    text = re.sub(r'\d+', '', text)        # Remove numbers
    text = re.sub(r'[^\w\s]', '', text)    # Remove special characters except whitespace
    text = re.sub(r'\s+', ' ', text).strip()  # Replace multiple spaces with a single space and trim
    return text

# Function to clean topics by removing numeric prefixes
def clean_topic(topic):
    return re.sub(r'^\d+(\.\d+)*', '', topic).strip()  # Remove leading numbers like 2.3, 3, etc.

# Scrape Wikipedia and return cleaned output
def scrape_and_clean_wikipedia(url):
    response = requests.get(url)  # Fetch the page content
    if response.status_code != 200:
        print(f"Failed to fetch the page: {response.status_code}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")  # Parse the content with BeautifulSoup

    # Extract data
    links = extract_links(soup)
    paragraphs = extract_paragraphs(soup)

    # Clean the data
    cleaned_paragraphs = [clean_text(paragraph) for paragraph in paragraphs]
    for link in links:
        link["topic"] = clean_topic(link["topic"])  # Clean the topic field

    # Prepare the cleaned output
    cleaned_data = {
        'url': url,
        'scraped_data': {
            'paragraphs': cleaned_paragraphs,
        },
        'extracted_links': links
    }

    return cleaned_data
