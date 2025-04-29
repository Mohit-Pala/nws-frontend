FROM pytorch/pytorch:latest
WORKDIR /app
RUN pip install torch transformers scikit-learn flask flask-cors Levenshtein
COPY app.py .
RUN python download_models.py
EXPOSE 8080
ENV FLASK_APP=app.py
CMD ["flask", "run", "--host=0.0.0.0"]
