from flask import Flask, request, jsonify
from flask_cors import CORS
from difflib import SequenceMatcher

app = Flask(__name__)
CORS(app)

def similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

@app.route("/grade", methods=["POST"])
def grade():
    data = request.json

    model_answer = data.get("modelAnswer", "")
    student_answer = data.get("studentAnswer", "")
    max_marks = int(data.get("maxMarks", 10))

    if not student_answer.strip():
        return jsonify({
            "marks": 0,
            "feedback": "Answer is empty."
        })

    score = similarity(model_answer, student_answer)
    marks = round(score * max_marks, 2)

    if score >= 0.80:
        feedback = "Excellent answer."
    elif score >= 0.60:
        feedback = "Good answer. Some points are missing."
    elif score >= 0.40:
        feedback = "Average answer. Needs improvement."
    else:
        feedback = "Poor answer. Not close to the expected answer."

    return jsonify({
        "similarity": round(score, 2),
        "marks": marks,
        "feedback": feedback
    })

@app.route("/", methods=["GET"])
def home():
    return "AI Grading Service Running"

if __name__ == "__main__":
    app.run(port=5000, debug=True)