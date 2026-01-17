// script.js
let questions = []; // Loaded from Excel
let currentQuestionIndex = 0;
let score = 0;

// Load topics dynamically from Excel
async function loadContent() {
    const response = await fetch('content.xlsx');
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);
    questions = json;

    const topics = [...new Set(questions.map(q => q.Topic))];
    const select = document.getElementById('topic-select');
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.text = topic;
        select.appendChild(option);
    });
}

// Start lesson
document.getElementById('start-btn').addEventListener('click', () => {
    const selectedTopic = document.getElementById('topic-select').value;
    questions = questions.filter(q => q.Topic === selectedTopic);
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('lesson-container').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    showQuestion();
});

function showQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.Question;
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.innerText = q['Option ' + btn.dataset.option];
        btn.disabled = false;
    });
    document.getElementById('feedback').innerText = '';
    document.getElementById('next-btn').style.display = 'none';
}

// Check answer
document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const q = questions[currentQuestionIndex];
        if (e.target.dataset.option === q['Correct Option']) {
            document.getElementById('feedback').innerText = 'Correct!';
            score++;
        } else {
            document.getElementById('feedback').innerText = `Wrong! Correct answer: ${q['Correct Option']}`;
        }
        document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        document.getElementById('next-btn').style.display = 'block';
    });
});

// Next question
document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('result-container').style.display = 'block';
        document.getElementById('score').innerText = `Your score: ${score}/${questions.length}`;
    } else {
        showQuestion();
    }
});

// Restart lesson
document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('lesson-container').style.display = 'block';
});

loadContent();
