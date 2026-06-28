from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading model...")
model_path = "C:/Users/Anushka/Downloads/hate_speech_model_v3"
tokenizer = DistilBertTokenizer.from_pretrained(model_path, local_files_only=True)
model = DistilBertForSequenceClassification.from_pretrained(model_path, local_files_only=True)
model.eval()
print("Model ready!")

class TextInput(BaseModel):
    text: str

@app.post("/classify")
def classify(body: TextInput):
    inputs = tokenizer(
        body.text,
        return_tensors="pt",
        truncation=True,
        max_length=128,
        padding=True
    )
    with torch.no_grad():
        outputs = model(**inputs)
    probs = torch.softmax(outputs.logits, dim=1)
    hateful_prob = probs[0][1].item()
    return {
        "isHateful": hateful_prob > 0.75,
        "confidence": round(hateful_prob, 3)
    }