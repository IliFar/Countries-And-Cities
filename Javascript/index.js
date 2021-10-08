// Getting HTML ELEMENTS
const container = document.getElementById("container");
const citiesContainer = document.getElementById("city-group");
const selectBox = document.getElementById("select");

// Setting Variables To Fetch Data In Them.
let countries;
let cities;



// FETCH land.json
fetch ("./Json/land.json")
.then (res => res.json())
.then(data => showCountry(data))
.catch(err => console.log("Error", err));

// FETCH stad.json
fetch ("./Json/stad.json")
.then (res => res.json())
.then(data => showCity(data))
.catch(err => console.log("Error", err));


// FUNCTION : SHOW COUNTRY INSIDE SELECT BOX
showCountry = (countriesData) => {
    countries = countriesData;

    for (let i = 0; i < countries.length; i++) {
        let options = `<option class="option" value="${countries[i].id}">${countries[i].countryname}</option>`;
        selectBox.insertAdjacentHTML("beforeend", options);  
    }
    //Insert The Visited Option For The Visited Cities
    selectBox.insertAdjacentHTML("beforeend", `<option id="option" value="visited-cities">VISITED CITIES</option>`);
    console.log(countries);
}// END FUNCTION SHOWCOUNTRY


// FUNCTION : SHOW CITY IN FORMS OF BUTTONS WHEN A COUNTRY IS SELECTED
showCity = (cityData) => {
    cities = cityData;

    //Select Box Listener =>
    selectBox.addEventListener("change", ()=>{
        citiesContainer.textContent ="";

        // CREATING THE CITIES DIV INSIDE THE CITIES GROUP CONTAINER AND APPENDING IT TO CITY CONTAINER
        let citiesDiv = document.createElement("div");
        citiesDiv.id = "cities-div"
        citiesContainer.appendChild(citiesDiv); 
         
        //LOOP THROUGH CITIES IN JSON
        for (i = 0; i < cities.length; i++) {
            if (selectBox.value == cities[i].countryid) {
                citiesDiv.insertAdjacentHTML("beforeend", `<button class="btn" id="btn" value="${cities[i].id}">${cities[i].stadname}</button>`);
            }
        }
        //IN CASE USER CLICKS ON VISITED CITIES' OPTION
        if (selectBox.value == "visited-cities") {
            //CALL VISITED CITIES FUNCTION
            visitedCities();
        }

        //STILL ON EVENTLISTENER CALL THESE FUNCTIONS AFTER THE FIRST IF STATEMENT
        createVisitedButton();
        visitedButtonToDo();
        showCityFacts();
    })
    
    console.log(cities);
}//END FUNCTION SHOW CITY


// FUNCTION : CREATING THE 'BESÖKT' BUTTONS UNDER EACH CITY
createVisitedButton = () => {
    //CREATE A DIV DOR THE BUTTONS OF VISITED AND APPEND IT TO CITIES CONTAINER
    let visitedButtons = document.createElement("div");
    visitedButtons.id = "visited-button";
    citiesContainer.appendChild(visitedButtons);
    //GET CITIES' BUTTONS AND UNDER EACH ONE CREATE VISITED BUTTON
    cityButton = document.getElementsByClassName("btn")
    for (let i = 0; i < cityButton.length; i++) {
        visitedButtons.insertAdjacentHTML("beforeend", `<button class="visited" id="visited" value="${cityButton[i].value}" >Besökt ${cityButton[i].textContent}</button>`);
    }
}// END FUNCTION createVisitedButton


// DECLARING AN EMPTY ARRAY FOR THE CITIES ID
let citiesId = [];
// FUNCTION : TO DO WHEN 'BESÖKT' BUTTON IS CLICKED
visitedButtonToDo = () => {
    //GET THE BUTTONS OF VISITED
    let visitedButton = document.getElementsByClassName("visited");

    //CREATE A DIV FOR THE MESSAGE WHEN A CITY IS SAVED AS VISITED
    let citySaved = document.createElement("div");
    citySaved.id = "city-saved"
    citiesContainer.appendChild(citySaved);

    //LOOP THROUH EACH BUTTON OF VISITED
    for (let i = 0; i < visitedButton.length; i++) {
        //LISTEN TO THE VISITED BUTTON
        visitedButton[i].addEventListener("click", () => {

            //SHOW THIS MESSAGE WHEN A CITY IS SAVED AS VISITED
            citySaved.innerHTML = "";
            citySaved.insertAdjacentHTML("beforeend", `<p class="fade-out">City Saved</p>`);

            //PUSH CITIES.ID TO THE CITIESID ARRAY
            citiesId.push(visitedButton[i].value)

            //SET CITIES ID IN LOCAL STORAGE
            localStorage.setItem("Visited Cities", JSON.stringify(citiesId));

        },{once:true})//END EVENTLISTENER AND EXECUTE IT ONLY ONCE FOR EACH CITY
        
    }
}//END FUNCTION visitedButtonToDo


// FUNCTION : SHOW CITY FACTS WHEN A CITY IS SELECTED
showCityFacts = () => {

    //GET THE CITY BUTTON
    let button = document.getElementsByClassName("btn");

    //CREATE A DIV FOR CITY FACTS AND APPEND IT TO CITIES CONTAINER
    let cityFacts = document.createElement("div");
    cityFacts.id = "city-facts";
    citiesContainer.appendChild(cityFacts);

    // FIRST LOOP THROUGH CITIES BUTTONS
    for (let i = 0; i < button.length; i++) {
        //THEN LISTEN TO CITIES BUTTON
        button[i].addEventListener("click", () => {
            cityFacts.innerHTML = "";
            //THEN LOOP THROUGH CITIES FROM JSON FILE AND CHECK IF BUTTON'S VALUE MATCHES TO cities[i].id
            for (let j = 0; j < cities.length; j++) {
                if (button[i].value == cities[j].id) {
                    //THEN LOOP THROUGH COUNTRIES FROM JSON FILE AND CHECK IF COUNTRY'S ID MATCHES TO CITIES' COUNTRY ID
                    for (let x = 0; x < countries.length; x++) {
                        if (countries[x].id == cities[j].countryid) {
                            cityFacts.insertAdjacentHTML("afterbegin", `<p id="p" value="">${cities[j].stadname} är en stad i ${countries[x].countryname} med ${cities[j].population} invånare.</p>`);
                        } 
                    }//END COUNTRIES LOOP
                }  
            }//END CITIES LOOP
        })//End EventListerner
    }//END BUTTON LOOP
}//END FUNCTION showCityFacts


//FUNCTION : SHOW VISITED CITIES, SUM OF THEIR POPULATION AND THE RESET.
visitedCities = () => {
    // document.body.removeChild(citySaved);
    //GET CITIES IDs FROM LOCAL STORAGE
    const storage = JSON.parse(localStorage.getItem("Visited Cities"));

    //IF VALUE EXISTS IN LOCAL STORAGE
    if (storage) {
        //CREATE A DIV FOR THE VISITED CITIES AND APPEND IT TO BODY
        let visitedCities = document.createElement("div");
        visitedCities.id = "visited-cities"
        document.body.appendChild(visitedCities);
        
        visitedCities.insertAdjacentHTML ("beforeend", `<p>The Cities You visited Are : </p>`)
        
        //REMOVE/HIDE THE CONTAINER OF COUTNRIES AND CITIES
        document.body.removeChild(container);
        
        //CREATE AN EMPTY ARRAY 
        let array = [];

        //LOOP THROUGH LOCAL STORAGE AND CITIES, THEN CHECK IF LOCAL STORAGE VALUE MATCHES THE ID OF THE CITIES, THEN SHOW THE EXISTING CITIES
        storage.forEach(storage => {
            cities.forEach(city => {
                if (storage == city.id) {
                    visitedCities.insertAdjacentHTML ("beforeend", `<h2>${city.stadname}</h2>`)
                    //PUSH VISITED CITIES POPULATION TO THE EMPTY ARRAY
                    array.push(city.population)
                }
            });//END CITIES LOOP
        });//END LOCAL STORAGE LOOP

        //CALCULATE THE VISITED CITIES POPULATION AND SHOW THE RESULT
        const reducer = (a, b) => a + b;
        visitedCities.insertAdjacentHTML("beforeend", `<p>The number of people you might have met is approximately : <h1>${array.reduce(reducer)} <span>people.</span></h1></p>`);

        //CREATE RESET BUTTON
        visitedCities.insertAdjacentHTML("beforeend", `<button id="reset">Reset</button>`);

        //GET RESET BUTTON AND LISTEM TO IT
        let reset = document.getElementById("reset");
        reset.addEventListener("click", ()=> {

            //EMPTY LOCAL STORAGE
            localStorage.removeItem("Visited Cities");

            //SET CITIES ID ARRAY TO EMPTY
            citiesId = [];

            //SHOW/APPEND CITIES AND COUNTRIES CONTAINER
            document.body.appendChild(container);

            //SET SELECT BOX INDEX TO 0
            selectBox.selectedIndex = 0;

            //REMOVE/HIDE VISITED CITIES DIV
            document.body.removeChild(visitedCities);

        })//End RESET BUTTON LISTENER
    }// END IF STATMENT

    //IN CASE LOCAL STORAGE IS EMPTY
    else {
        citiesContainer.insertAdjacentHTML("beforeend", `<p class="choose" >Please choose a country first and then choose the city you visited</p>`);
        selectBox.selectedIndex = 0
    }      
}//END FUNCTION VISITED CITIES.








  


    









