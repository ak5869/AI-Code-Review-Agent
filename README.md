# AI Code Review & Refactoring Agent

An intelligent, full-stack web application that analyzes source code, provides expert reviews with categorized issues, and offers improvement suggestions. Powered by **LLaMA3-70B (via Groq API)**, this tool performs real-time static code analysis and stores review history for reference.

---

## Features

- **AI-Powered Code Review**  
  Uses LLaMA3-70B to detect bugs, performance issues, maintainability concerns, and style violations.

- **File Upload & Review**  
  Upload code files and receive a detailed review instantly.

- **Issue Categorization**  
  Review results are returned with line-level issue breakdowns categorized as `bug`, `style`, `performance`, etc.

- **Summarized Reports**  
  Includes severity-based stats and a score to measure code quality.

- **Review History**  
  View previous code reviews with full details and revisit any file by `Review ID`.

- **Modern UI**  
  Built with Vite + React + Tailwind for a sleek and responsive user experience.

- **Persistent Storage**  
  Uses SQLite to store all reviews, issues, and statuses.

---

## Tech Stack

| Frontend          | Backend            | AI/LLM API       | Database |
|-------------------|--------------------|------------------|----------|
| React + Vite + TS | FastAPI (Python)   | Groq (LLaMA3-70B)| SQLite   |

---

## Project Structure
```bash
ai-code-review-agent/
├── backend/
│ ├── main.py 
│ ├── database.py 
│ ├── .env 
│ ├── requirements.txt
├── frontend/
│ ├── src/
│ │ ├── components/ # UploadPanel, ReviewPanel, HistoryPanel, etc.
│ │ ├── App.tsx 
│ │ └── api/ 
└── README.md
```
---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-code-review-agent.git
cd ai-code-review-agent
```
### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt

# Create a .env file
touch .env
```
.env contents:

``` bash
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_oppenai_api_key
```
Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```
### 3. Frontend Setup
``` bash
cd frontend
npm install
npm run dev
```
Access the app at http://localhost:5173

---

<p align="center">
  <img src="https://github.com/user-attachments/assets/78009b86-58b6-4c98-b5b6-e8ead8176176" width="70%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/f6e6177d-9dfe-4aa2-bb4c-9ed827206cee" width="70%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/834487c6-8045-4a71-b63c-28715a0c8e41" width="70%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/50896774-17b2-40fb-b86b-23b125d493d5" width="70%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/95427493-4524-4831-b1ba-348b0897f7a3" width="70%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/27634908-b013-48fb-b74d-eb16c7c65bdd" width="70%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/8b052f71-a6a0-4512-8f4d-560bbd4f29ad" width="70%">
</p>


---

## API Endpoints
| Method | Endpoint        | Description                       |
| ------ | --------------- | --------------------------------- |
| POST   | `/review`       | Sends code to Groq LLM for review |
| POST   | `/save_review`  | Saves review result to database   |
| GET    | `/history`      | Fetches all past reviews          |
| GET    | `/history/{id}` | Fetches review by ID              |

---

## License
MIT License. Feel free to fork, improve, and contribute!

---

## Contributing
Pull requests and stars are always welcome!
For major changes, please open an issue first to discuss what you would like to change.

---

## Acknowledgements
- [Groq](https://groq.com/) for blazing-fast inference
- [LLaMA 3](https://ai.meta.com/llama/) for powerful review capability
- [FastAPI](https://fastapi.tiangolo.com/) — for the backend framework
- [Vite](https://vitejs.dev/) — for fast frontend development
- [Tailwind CSS](https://tailwindcss.com/) — for utility-first UI styling

