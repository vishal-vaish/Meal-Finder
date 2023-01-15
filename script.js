let search_meal;
$('#search').on("keypress",(e)=>{
    if(e.keyCode==13)
    {
        searchMeal();
    }
})
$("#search-btn").on('click',searchMeal);
$("#random-btn").on('click',randomMeal);
function searchMeal()
{
    search_meal=$("#search").val();   
    search_meal=search_meal.trim();
    $("#single-meal").html("");
    $("#incorrect-search").html("");
    if(search_meal.length<1){
        alert("Enter Searching Meal");
    }
    else{
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search_meal}`)
            .then(res => res.json())
                .then(data=>{ 
                    console.log(data);
                    showResult(data);})
    }
}

function randomMeal(){
    $("#single-meal").html("");
    $("#incorrect-search").html("");
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res=>res.json())
            .then(data=>{ showResult(data);})

}

function showResult(data){
    $("#result-heading").html(`<h2>Search results for '${search_meal}':- </h2>`);
    $("#result-heading").css('font-family', 'Andika New Basic', 'sans-serif');  
    if(data.meals==null)
    {
        $("#incorrect-search").html("<h1>There are no search results. Try again!</h1>");
        $("#incorrect-search").css('font-family', 'Andika New Basic', 'sans-serif');
        $("#meals").html("");
       
    }
    else{
        $("#search").val("");
        $("#meals").html("");
        for(var i in  data.meals)
        {
            document.getElementById("meals").innerHTML+=
                `<div class="meal">
                <img src="${data.meals[i].strMealThumb}" alt="${data.meals[i].strMeal}" />
                <div class="meal-info" data-mealID="${data.meals[i].idMeal}">
                    <h3>${data.meals[i].strMeal}</h3>
                </div>
                </div>` 

        }
    }
}

document.getElementById("meals").addEventListener('click', e =>{
    const mealInfo = e.path.find(item=>{
        if (item.classList) {
            return item.classList.contains('meal-info');
          } else {
            return false;
          }
    })
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
      }
})

function getMealById(id){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res=>res.json())
            .then(actualdata=>{
                showDescription(actualdata.meals[0]);
           })
}

function showDescription(data){
    document.getElementById("single-meal").innerHTML=
        `<h1>${data.strMeal}</h1>
        <img src="${data.strMealThumb}" alt="${data.strMeal}"/>
        <div class="single-meal-info">
            ${data.strCategory ? `<p>${data.strCategory}</p>` : ''}
            ${data.strArea ? `<p>${data.strArea}</p>` : ''}
            
        </div>
        <div class="main">
            <p>${data.strInstructions}</p>
            <div id="link">
            <button><a href="${data.strYoutube}"><i class="fab fa-youtube" ></i>

            </a></button>
        </div>
            <h1>Ingredients</h1>
            <ul id="ingredints">
            </ul><br>
            
        </div>  `
        var j=0;
        while(true)
        {
            j++;
            var item=data[`strIngredient${j}`];
            var quantity=data[`strMeasure${j}`];
            if(item == "" || quantity == ""){
                break;
            }
            else{
            var ul = document.getElementById("ingredints");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(item+" - "+quantity));
            ul.appendChild(li);
                
            }
          
            
        }
        $('html, body').animate({
            scrollTop: $("#single-meal").offset().top
        }, 2000);
}