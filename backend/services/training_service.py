import json
import os
from typing import List, Dict, Any

class TrainingService:
    def __init__(self, data_dir: str = 'data'):
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', data_dir)
        self.cybersecurity_knowledge: List[Dict[str, Any]] = []
        self.team_information: Dict[str, Any] = {}

    def load_data(self):
        """Load training data from JSON files."""
        self._load_cybersecurity_knowledge()
        self._load_team_information()

    def _load_cybersecurity_knowledge(self):
        """Load cybersecurity knowledge from the JSON file."""
        file_path = os.path.join(self.data_dir, 'cybersecurity_knowledge.json')
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                self.cybersecurity_knowledge = json.load(f)
            print(f"Successfully loaded {len(self.cybersecurity_knowledge)} cybersecurity knowledge items.")
        except FileNotFoundError:
            print(f"Warning: Cybersecurity knowledge file not found at {file_path}")
        except json.JSONDecodeError:
            print(f"Warning: Could not decode cybersecurity knowledge file at {file_path}")

    def _load_team_information(self):
        """Load team information from the JSON file."""
        file_path = os.path.join(self.data_dir, 'team_information.json')
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                self.team_information = json.load(f)
            print("Successfully loaded team information.")
        except FileNotFoundError:
            print(f"Warning: Team information file not found at {file_path}")
        except json.JSONDecodeError:
            print(f"Warning: Could not decode team information file at {file_path}")

    def get_all_cybersecurity_knowledge(self) -> List[Dict[str, Any]]:
        """Return all cybersecurity knowledge items."""
        return self.cybersecurity_knowledge

    def get_team_information(self) -> Dict[str, Any]:
        """Return team information."""
        return self.team_information

# Instantiate and load data on startup
training_service = TrainingService()
training_service.load_data()
