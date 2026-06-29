# The Mute Button

A Chrome browser extension that detects and filters hate speech from webpages in real time using a fine-tuned DistilBERT transformer model. All inference runs locally on the user's machine ensuring complete data privacy.

---

## About The Project

The internet is filled with hate speech and toxic content that platforms fail to moderate consistently. The Mute Button solves this by putting the power directly in the user's hands — a Chrome extension that uses AI to automatically detect and filter hateful content from any webpage in real time with complete privacy. No data ever leaves your device.

---

## Features

- AI-Powered Detection — Fine-tuned DistilBERT model with 93.2% classification accuracy
- Real-Time Filtering — Scans and filters webpage content automatically on page load
- Works Everywhere — Functions across any website regardless of platform moderation policies
- Complete Privacy — All inference runs locally, no data sent to external servers
- Three Filter Modes:
  - Blur — Blurs hateful content, click to reveal
  - Hide — Removes content from the page entirely
  - Replace — Substitutes content with a warning banner
- Persistent Preferences — Settings saved automatically across browser sessions

---

## System Architecture
User visits webpage

|

Chrome Extension (content.js)

|

Scans all text elements on page

|

POST request to FastAPI Server (localhost:5000)

|

DistilBERT Model classifies text

|

Returns isHateful and confidence score

|

Extension applies blur/hide/replace filter
---

## Model Details

| Property | Details |
|---|---|
| Base Model | distilbert-base-uncased |
| Task | Text Classification |
| Labels | 0 = Hate Speech, 1 = Offensive, 2 = Neutral |
| Dataset Size | 19,539 balanced samples |
| Training Epochs | 4 |
| Learning Rate | 2e-5 |
| Batch Size | 16 |
| Accuracy | 93.2% |
| F1 Score | 93.3% |
| Training Environment | Google Colab T4 GPU |

---

## Tech Stack

| Category | Technology |
|---|---|
| Model Training | Python, PyTorch, HuggingFace Transformers |
| Backend | FastAPI, Uvicorn |
| Extension | JavaScript, Chrome Manifest V3, HTML, CSS |
| Tools | VS Code, Google Colab |

---

## Project Structure
The-Mute-Button/

├── manifest.json          # Extension configuration and permissions

├── content.js             # Webpage scanning and filtering logic

├── popup.html             # Extension popup user interface

├── popup.js               # Popup controls and Chrome storage logic

├── background.js          # Service worker and default settings

├── api.py                 # FastAPI backend server and inference logic

├── demo.html              # Demo webpage for testing

├── icon.png               # Extension icon

└── model/

├── model.onnx         # Exported ONNX model

├── config.json        # Model configuration

├── tokenizer.json     # Tokenizer configuration

├── tokenizer_config.json

└── vocab.txt          # DistilBERT vocabulary
---

## How To Run

### Prerequisites
- Python 3.10 or above
- Google Chrome
- Required Python libraries
pip install fastapi uvicorn transformers torch tf-keras
---
### Step 1 - Start the API Server

Open Command Prompt and run:
cd path/to/hateshield

set PYTHONDONTWRITEBYTECODE=1

uvicorn api:app --port 5000
Wait for `Model ready!` to appear in the terminal.

### Step 2 - Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable Developer Mode in the top right corner
3. Click Load Unpacked
4. Select the hateshield folder
5. The Mute Button extension will appear in your toolbar

### Step 3 - Test It

1. Open any webpage or the included demo.html file
2. The extension will automatically scan and filter hateful content
3. Click any blurred content to reveal it
4. Use the popup to switch filter modes or toggle the extension

---

## Dataset

The model was trained on a custom labeled dataset of 133,847 raw text samples cleaned and balanced to 19,539 rows across three categories:

| Label | Category | Samples |
|---|---|---|
| 0 | Hate Speech | 6,513 |
| 1 | Offensive Language | 6,513 |
| 2 | Neutral | 6,513 |

---

## Limitations

- Requires local FastAPI server to be running manually
- Limited detection of slang and coded language
- English language only
- Cannot process dynamically loaded content
- Occasional false positives and false negatives

---

## Future Enhancements

- Browser-side inference using ONNX Runtime Web eliminating the need for a local server
- Multilingual support using XLM-RoBERTa
- Expanded dataset including slang and coded language
- Dynamic content monitoring using MutationObserver
- Cross-browser support for Firefox and Edge
- User feedback mechanism for continuous model improvement

---

