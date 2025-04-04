import requests
import json

url = "http://localhost:5000/api/predict"

data = {
    "title": "Sample News Article",
    "article": "This is the body of the article. It can be as long as you want."
}

# Send the POST request
response = requests.post(url, json=data)

# Print out the status code and response text for debugging
print("Status Code:", response.status_code)
print("Response Text:", response.text)
