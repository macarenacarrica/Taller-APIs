document.getElementById('searchButton').addEventListener('click', () => {
    const cocktailName = document.getElementById('cocktailInput').value;
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; 
            if (data.drinks) {
                data.drinks.forEach(cocktail => {
                    const cocktailCard = `
                        <div class="col-md-4 col-lg-4 cocktail-card">
                            <div class="card">
                                <img src="${cocktail.strDrinkThumb}" class="card-img-top" alt="${cocktail.strDrink}">
                                <div class="card-body">
                                    <h5 class="card-title">${cocktail.strDrink}</h5>
                                    <p class="card-text"><strong>Instrucciones:</strong> ${cocktail.strInstructions}</p>
                                </div>
                            </div>
                        </div>`;
                    resultsDiv.insertAdjacentHTML('beforeend', cocktailCard);
                });
            } else {
                resultsDiv.innerHTML = '<div class="col-12"><p>No se encontraron cócteles.</p></div>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
