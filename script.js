let myChart; // Variable global para mantener la referencia al gráfico

async function getCurrencyData() {
    const endpoint = "https://mindicador.cl/api/";

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error al obtener datos de la API: ${error.message}`);
    }
}

async function getCurrencyChartData(currency) {
    const endpoint = `https://mindicador.cl/api/${currency}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return data.serie;
    } catch (error) {
        throw new Error(`Error al obtener datos de la API para el gráfico: ${error.message}`);
    }
}

async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;

    try {
        // Limpiar el canvas antes de generar un nuevo gráfico
        if (myChart) {
            myChart.destroy();
        }

        const data = await getCurrencyData();
        const exchangeRate = data[currency].valor;

        const convertedAmount = amount / exchangeRate;

        displayResult(`${amount} Resultado: $${convertedAmount.toFixed(2)} ${currency}`);
        const chartData = await getCurrencyChartData(currency);
        generateChart(chartData);
    } catch (error) {
        displayError(error.message);
    }
}

function displayResult(message) {
    document.getElementById('result').textContent = message;
}

function displayError(errorMessage) {
    document.getElementById('error-message').textContent = errorMessage;
}

function generateChart(serie) {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: serie.slice(0, 10).map(entry => entry.fecha.substring(0, 10)),
            datasets: [{
                label: 'Historial Últimos 10 Días',
                data: serie.slice(0, 10).map(entry => entry.valor),
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 1
            }]
        }
    });
}