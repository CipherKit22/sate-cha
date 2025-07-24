import os
import requests
import json
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class DeepSeekService:
    def __init__(self):
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
<<<<<<< HEAD
        self.base_url = os.getenv('DEEPSEEK_BASE_URL', 'https://openrouter.ai/api/v1')
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',  # Optional, can be changed
            'X-Title': 'Cybersecurity Chatbot'  # Optional, can be changed
=======
        self.base_url = os.getenv('DEEPSEEK_BASE_URL', 'https://api.deepseek.com')
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
>>>>>>> daf97b202766d82f427622fa997fdfa044882444
        }
    
    def generate_response(self, prompt: str, context: str = "", max_tokens: int = 500) -> Optional[str]:
        """Generate response using DeepSeek API"""
        if not self.api_key or self.api_key == 'your_deepseek_api_key_here':
            # Fallback response when API key is not configured
            return self._generate_fallback_response(prompt, context)
        
        try:
            # Combine context and prompt
            full_prompt = f"Context: {context}\n\nUser: {prompt}\n\nAssistant:" if context else f"User: {prompt}\n\nAssistant:"
            
            payload = {
<<<<<<< HEAD
                "model": "deepseek/deepseek-chat-v3-0324:free",
=======
                "model": "deepseek-chat",
>>>>>>> daf97b202766d82f427622fa997fdfa044882444
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant. Use the provided context to answer questions accurately and helpfully."
                    },
                    {
                        "role": "user",
                        "content": full_prompt
                    }
<<<<<<< HEAD
                ]
            }
            
            response = requests.post(
                f"{self.base_url}/chat/completions",
=======
                ],
                "max_tokens": max_tokens,
                "temperature": 0.7
            }
            
            response = requests.post(
                f"{self.base_url}/v1/chat/completions",
>>>>>>> daf97b202766d82f427622fa997fdfa044882444
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content'].strip()
            else:
                print(f"DeepSeek API error: {response.status_code} - {response.text}")
                return self._generate_fallback_response(prompt, context)
                
        except Exception as e:
            print(f"Error calling DeepSeek API: {str(e)}")
            return self._generate_fallback_response(prompt, context)
    
    def _generate_fallback_response(self, prompt: str, context: str = "") -> str:
        """Generate a fallback response when DeepSeek API is not available"""
        prompt_lower = prompt.lower()
        
        # Simple keyword-based responses
        if any(word in prompt_lower for word in ['hello', 'hi', 'hey']):
            return "Hello! How can I help you today?"
        elif any(word in prompt_lower for word in ['how are you', 'how do you do']):
            return "I'm doing well, thank you for asking! How can I assist you?"
        elif any(word in prompt_lower for word in ['what', 'who', 'where', 'when', 'why', 'how']):
            if context:
                return f"Based on the available information: {context[:200]}... I'd be happy to help you with more specific questions!"
            else:
                return "I'd be happy to help answer your question! Could you provide more details or context?"
        elif any(word in prompt_lower for word in ['thank', 'thanks']):
            return "You're welcome! Is there anything else I can help you with?"
        else:
            if context:
                return f"I understand you're asking about this topic. Based on what I know: {context[:200]}... Feel free to ask more specific questions!"
            else:
                return "I'm here to help! Could you please provide more details about what you'd like to know?"

deepseek_service = DeepSeekService()
