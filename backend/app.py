from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/submit', methods=['POST'])
def submit_data():
    data = request.get_json()  # Get the JSON data from the request
    title = data.get('title')
    article = data.get('article')
    
    # Here, you would pass `title` and `article` to your model
    # For now, we just return them as a response
    result = {
        'title': title,
        'article': article,
        'message': 'Data received successfully'
    }
    
    return jsonify(result)  # Send the response back to the frontend

if __name__ == '__main__':
    app.run(debug=True, port=5001)


