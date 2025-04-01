def process_article(title, article):
    result = {
        "title_length": len(title),
        "article_length": len(article),
        "word_count": len(article.split()),
        "character_count": sum(len(word) for word in article.split())
    }
    return result