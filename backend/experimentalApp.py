from apiKeys import openAiKey

from scrapegraphai.graphs import SmartScraperGraph

graph_config = {
   "llm": {
       "api_key": openAiKey,
       "model": "openai/gpt-4o-mini",
   },
   "verbose": True,
   "headless": False,
}

# Create the SmartScraperGraph instance
smart_scraper_graph = SmartScraperGraph(
    prompt="You are provided a URL to most likely a news site. Only extract the article title and the article body. Do not include any other information. Clean up any special characters, if you see escaped characters, remove them. Do not include any HTML tags. Do not include any links. Do not include any images. Do not include any videos. Do not include any audio. Do not include any tables. Do not include any lists. Do not include any quotes. Do not include any references.",
    source="https://www.npr.org/2025/04/25/nx-s1-5374984/pope-francis-funeral-how-to-watch",
    config=graph_config
)

# Run the pipeline
result = smart_scraper_graph.run()

import json
print(json.dumps(result, indent=4))