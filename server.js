const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; 

app.use(bodyParser.urlencodedj({ extended: true }));
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});


app.get('/', (req, res) => {
    
    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Калькулятор ИМТ</title>
            <link rel="stylesheet" href="/styles.css"> </head>
        <body>
            <div class="container">
                <h2>Калькулятор ИМТ</h2>
                <form action="/calculate-bmi" method="POST">
                    <label for="weight">Вес (кг):</label>
                    <input type="number" step="0.01" id="weight" name="weight" required min="0.1">

                    <label for="height">Рост (м):</label>
                    <input type="number" step="0.01" id="height" name="height" required min="0.1">

                    <label for="fat_density">Плотность жира (%):</label>
                    <input type="number" step="0.01" id="fat_density" name="fat_density" min="0">

                    <label for="muscle_index">Индекс мышц:</label>
                    <input type="number" step="0.01" id="muscle_index" name="muscle_index" min="0">

                    <button type="submit">Рассчитать ИМТ</button>
                </form>
                <div id="result"></div>
            </div>
            <script src="/script.js"></script>
        </body>
        </html>
    `);
});


const recommendations = {
    'Underweight': 'Недостаточный вес. Рекомендуется проконсультироваться с врачом для разработки плана набора веса.',
    'Normal weight': 'Нормальный вес. Продолжайте поддерживать здоровый образ жизни и сбалансированное питание.',
    'Overweight': 'Избыточный вес. Рекомендуется увеличить физическую активность и скорректировать рацион.',
    'Obese': 'Ожирение. Крайне рекомендуется немедленно обратиться к специалисту для разработки комплексного плана по снижению веса.',
};


function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight'; 
    if (bmi < 24.9) return 'Normal weight'; 
    if (bmi < 29.9) return 'Overweight'; 
    return 'Obese'; 
}

app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);


    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        return res.status(400).send(`
            <script>
                alert('Некорректный ввод: Вес и рост должны быть положительными числами.');
                window.location.href = '/'; // Перенаправление обратно на форму
            </script>
        `);
    }

    
    const bmi = weight / (height * height);
    const category = getBMICategory(bmi);
    const recommendation = recommendations[category]; 

    
    let colorClass = '';
    if (category === 'Normal weight') colorClass = 'normal'; // Зеленый
    else if (category === 'Overweight') colorClass = 'overweight'; // Желтый
    else if (category === 'Obese') colorClass = 'obese'; // Красный
    else colorClass = 'underweight';

   
    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Результат ИМТ</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <h2>Ваш результат ИМТ</h2>
                <div class="bmi-result ${colorClass}">
                    <p>Значение ИМТ: <strong>${bmi.toFixed(2)}</strong></p>
                    <p>Категория: <strong>${category}</strong></p>
                </div>
                <h3>Рекомендация:</h3>
                <p>${recommendation}</p>
                <a href="/">Рассчитать снова</a>
            </div>
        </body>
        </html>
    `);

// ... (после расчета ИМТ и категории)
    const fatDensity = parseFloat(req.body.fat_density);
    const muscleIndex = parseFloat(req.body.muscle_index);

    let additionalNote = '';
    if (fatDensity > 30 && category === 'Normal weight') {
        additionalNote = `<p class="warning">Примечание: Хотя ваш ИМТ в норме, высокий процент жира (${fatDensity}%) требует внимания к составу тела.</p>`;
    } else if (muscleIndex > 15 && category === 'Overweight') {
        additionalNote = `<p class="info">Примечание: Ваш избыточный вес может быть связан с высоким индексом мышечной массы (${muscleIndex}).</p>`;
    }
    
    // ... (Возврат результата)
    res.send(`
        ...
        <p>Категория: <strong>${category}</strong></p>
        </div>
        <h3>Рекомендация:</h3>
        <p>${recommendation}</p>
        ${additionalNote} <a href="/">Рассчитать снова</a>
        ...
    `);
});