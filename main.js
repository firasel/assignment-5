//api call & data receive
let mealsDataLoad = (userInput) => {
    //user input validation then call api or error message show 
    if (userInput !== '') {
        let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                mealData(data.meals)
                //error message empty
                document.getElementById('errorShow').innerHTML = ''
                //ingredient empty
                document.getElementById('ingredientShow').innerHTML = ''
            }).catch(() => errorMessage())
    } else {
        errorMessage()
    }
}


//error message function
let errorMessage = () => {
    let errorShow = document.getElementById('errorShow')
    let message = `<h2 class="text-center text-warning mt-3">Meals not Found</h2><p class="text-center text-muted">please try again</p>`
    errorShow.innerHTML = message
    // ingredient section empty
    document.getElementById('ingredientShow').innerHTML = ''
}


//get user input data function
let userInput = () => {
    let searchInput = document.getElementById('searchInput')
    mealsDataLoad(searchInput.value)
    searchInput.value = ''
}


// update search meals data in html
let updateData = (mealName, imageSrc) => {
    let displayResult = document.getElementById('resultShow')
    let cardColumn = `
        <div class="col rounded-3">
            <div class="card h-100 cardDesign">
            <img src="${imageSrc}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title text-center">${mealName}</h5>
            </div>
            </div>
        </div>
    `
    //update meals card
    displayResult.innerHTML = displayResult.innerHTML + cardColumn
}


// meal data function
let mealData = (data) => {
    data.map(meal => updateData(meal.strMeal, meal.strMealThumb))
    //call cardAddEvent function for new added card
    cardsAddEvent()
}


// add event listener for search button
document.getElementById('searchButton').addEventListener('click', () => {
    userInput()
    //old data remove
    document.getElementById('resultShow').innerHTML = ''
})


//update ingredient div
let ingredientShow = (meal) => {
    let displayResult = document.getElementById('ingredientShow')
    let ingredientList = ''
    // ingredient list create
    for (let i = 1; i < 21; i++) {
        if (meal[`strIngredient${i}`].trim() !== '' || meal[`strMeasure${i}`].trim() !== '') {
            let ingredientText = `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`;
            ingredientList += `<li>${ingredientText}</li>`;
        } else {
            break;
        }
    }
    // bootstrap card design html 
    let resultDiv = `
        <div class="card col-8 ingredientDesign">
            <img src="${meal.strMealThumb}" class="card-img-top" >
            <div class="card-body">
                <h3 class="card-title">${meal.strMeal}</h3>
                <h5 class="card-text">Ingredients</h5>
            </div>
            <ul class="list-group list-group-flush" >${ingredientList}</ul>
        </div>
    `
    //update ingredient result
    displayResult.innerHTML = resultDiv
}


// this function card click for new data collect in api
let uniqCard = (mealName) => {
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //check meal name then pass parameter meal data
            data.meals.forEach(mealsData => {
                if (mealsData.strMeal == mealName) {
                    ingredientShow(mealsData)
                }
            });
        })
}


// function for all cards event listener adding & card click then pass this card title
let cardsAddEvent = () => {
    let allCard = document.getElementsByClassName('cardDesign');
    let allCardDiv = [...allCard]
    allCardDiv.map(card => {
        card.addEventListener('click', (event) => {
            let mealName = event.currentTarget.children[1].innerText
            uniqCard(mealName)
        })
    })
}