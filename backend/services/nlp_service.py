import re
from typing import List, Dict, Tuple, Optional
try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize, sent_tokenize
    # Download required NLTK data
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')
    NLTK_AVAILABLE = True
except ImportError:
    NLTK_AVAILABLE = False
    print("NLTK not available, using basic text processing")

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    print("Scikit-learn not available, using basic similarity")

try:
    from textblob import TextBlob
    TEXTBLOB_AVAILABLE = True
except ImportError:
    TEXTBLOB_AVAILABLE = False

class NLPService:
    def __init__(self):
        if NLTK_AVAILABLE:
            self.stop_words = set(stopwords.words('english'))
        else:
            # Basic English stop words
            self.stop_words = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'])
        
        if SKLEARN_AVAILABLE:
            self.tfidf_vectorizer = TfidfVectorizer(
                max_features=1000,
                stop_words='english',
                ngram_range=(1, 2)
            )
        else:
            self.tfidf_vectorizer = None
        
        self.sentence_model = None  # Simplified for now
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    def extract_keywords(self, text: str, num_keywords: int = 10) -> List[str]:
        """Extract keywords from text using TF-IDF or basic word frequency"""
        try:
            processed_text = self.preprocess_text(text)
            
            # Tokenize and remove stopwords
            if NLTK_AVAILABLE:
                tokens = word_tokenize(processed_text)
            else:
                # Basic tokenization
                tokens = processed_text.split()
            
            filtered_tokens = [word for word in tokens if word not in self.stop_words and len(word) > 2]
            
            if not filtered_tokens:
                return []
            
            if SKLEARN_AVAILABLE and self.tfidf_vectorizer:
                # Use TF-IDF to find important terms
                tfidf_matrix = self.tfidf_vectorizer.fit_transform([' '.join(filtered_tokens)])
                feature_names = self.tfidf_vectorizer.get_feature_names_out()
                tfidf_scores = tfidf_matrix.toarray()[0]
                
                # Get top keywords
                keyword_scores = list(zip(feature_names, tfidf_scores))
                keyword_scores.sort(key=lambda x: x[1], reverse=True)
                
                return [keyword for keyword, score in keyword_scores[:num_keywords] if score > 0]
            else:
                # Basic frequency-based keyword extraction
                word_freq = {}
                for word in filtered_tokens:
                    word_freq[word] = word_freq.get(word, 0) + 1
                
                # Sort by frequency
                sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
                return [word for word, freq in sorted_words[:num_keywords]]
        
        except Exception as e:
            print(f"Error extracting keywords: {e}")
            return []
    
    def find_similar_content(self, query: str, knowledge_base: List[Dict], threshold: float = 0.3) -> List[Tuple[Dict, float]]:
        """Find similar content in knowledge base using semantic similarity"""
        if not knowledge_base:
            return []
        
        try:
            # Use sentence transformer if available
            if self.sentence_model:
                return self._semantic_similarity_search(query, knowledge_base, threshold)
            else:
                return self._tfidf_similarity_search(query, knowledge_base, threshold)
        
        except Exception as e:
            print(f"Error finding similar content: {e}")
            return []
    
    def _semantic_similarity_search(self, query: str, knowledge_base: List[Dict], threshold: float) -> List[Tuple[Dict, float]]:
        """Use sentence transformers for semantic similarity"""
        query_embedding = self.sentence_model.encode([query])
        
        contents = [item.get('content', '') for item in knowledge_base]
        content_embeddings = self.sentence_model.encode(contents)
        
        similarities = cosine_similarity(query_embedding, content_embeddings)[0]
        
        similar_items = []
        for i, similarity in enumerate(similarities):
            if similarity >= threshold:
                similar_items.append((knowledge_base[i], float(similarity)))
        
        # Sort by similarity score (descending)
        similar_items.sort(key=lambda x: x[1], reverse=True)
        return similar_items[:5]  # Return top 5 matches
    
    def _tfidf_similarity_search(self, query: str, knowledge_base: List[Dict], threshold: float) -> List[Tuple[Dict, float]]:
        """Fallback TF-IDF similarity search"""
        contents = [item.get('content', '') for item in knowledge_base]
        all_texts = [query] + contents
        
        # Preprocess all texts
        processed_texts = [self.preprocess_text(text) for text in all_texts]
        
        # Calculate TF-IDF matrix
        tfidf_matrix = self.tfidf_vectorizer.fit_transform(processed_texts)
        
        # Calculate cosine similarity between query and all contents
        query_vector = tfidf_matrix[0:1]
        content_vectors = tfidf_matrix[1:]
        
        similarities = cosine_similarity(query_vector, content_vectors)[0]
        
        similar_items = []
        for i, similarity in enumerate(similarities):
            if similarity >= threshold:
                similar_items.append((knowledge_base[i], float(similarity)))
        
        # Sort by similarity score (descending)
        similar_items.sort(key=lambda x: x[1], reverse=True)
        return similar_items[:5]  # Return top 5 matches
    
    def summarize_text(self, text: str, max_sentences: int = 3) -> str:
        """Simple extractive summarization"""
        try:
            sentences = sent_tokenize(text)
            
            if len(sentences) <= max_sentences:
                return text
            
            # Simple approach: take first, middle, and last sentences
            if max_sentences == 3 and len(sentences) >= 3:
                indices = [0, len(sentences) // 2, -1]
                summary_sentences = [sentences[i] for i in indices]
                return ' '.join(summary_sentences)
            else:
                return ' '.join(sentences[:max_sentences])
        
        except Exception as e:
            print(f"Error summarizing text: {e}")
            return text[:200] + "..." if len(text) > 200 else text
    
    def analyze_intent(self, text: str) -> Dict[str, any]:
        """Simple intent analysis"""
        text_lower = text.lower()
        
        # Define intent patterns
        question_words = ['what', 'how', 'why', 'when', 'where', 'who', 'which']
        greeting_words = ['hello', 'hi', 'hey', 'good morning', 'good afternoon']
        request_words = ['please', 'can you', 'could you', 'would you']
        
        intent = {
            'type': 'unknown',
            'confidence': 0.0,
            'entities': []
        }
        
        # Check for questions
        if any(word in text_lower for word in question_words) or text.endswith('?'):
            intent['type'] = 'question'
            intent['confidence'] = 0.8
        
        # Check for greetings
        elif any(word in text_lower for word in greeting_words):
            intent['type'] = 'greeting'
            intent['confidence'] = 0.9
        
        # Check for requests
        elif any(phrase in text_lower for phrase in request_words):
            intent['type'] = 'request'
            intent['confidence'] = 0.7
        
        # Extract potential entities (simple approach)
        words = word_tokenize(text)
        entities = [word for word in words if word.istitle() and len(word) > 2]
        intent['entities'] = entities
        
        return intent

nlp_service = NLPService()
