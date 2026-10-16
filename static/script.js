const searchinputele = document.getElementById("search-input");
const searchbtnele = document.getElementById("search-btn");
const moviescontainerEle = document.getElementById("movies-container");
const statusmessageele = document.getElementById("status-message");


const movieposterele = document.getElementById("movie-poster") || document.querySelector(".movie-poster");
const movietitleele = document.getElementById("movie-title") || document.querySelector(".movie-title");
const movieyearele = document.getElementById("movie-year") || document.querySelector(".movie-year");
const moviegenreele = document.getElementById("movie-genre") || document.querySelector(".movie-genre");
const movieplotele = document.getElementById("movie-plot") || document.querySelector(".movie-plot");
const movieratingele = document.getElementById("movie-rating") || document.querySelector(".movie-rating");



function SetToNA(){
    movieposterele.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    movietitleele.innerText = `N/A`;
    movieyearele.innerText = `N/A`;
    moviegenreele.innerText = `N/A`;
    movieplotele.innerText = `N/A`;
    movieratingele.innerText = `N/A`;
}

const showMovie = async () => {
try{
    const title_got = searchinputele.value.trim();
    let data={};
    if (!title_got) {
        statusmessageele.innerText = "Please enter a movie title";
        return;
    }
    searchbtnele.disabled=true;
    searchinputele.disabled=true;
    statusmessageele.innerText= "Loading ... "
    const response = await fetch(`/movies?title=${encodeURIComponent(title_got)}`);
    if(! response.ok){
        statusmessageele.innerText = 'Failer to connect to server';
        return;
    }
    else{
    data = await response.json();}

    

    if (data.error) {
        SetToNA();
        statusmessageele.innerText = data.error;
    } else {
        statusmessageele.innerText = "";
        movieposterele.src = data.Poster && data.Poster !== "N/A" ? data.Poster : "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
        movietitleele.innerText = data.Title || "N/A";
        movieyearele.innerText = data.Year || "N/A";
        moviegenreele.innerText = data.Genre || "N/A";
        movieplotele.innerText = data.Plot || "N/A";
        movieratingele.innerText = data.imdbRating || "N/A";
    }
}
catch (error){
    statusmessageele.innerText = 'Error searching try again later'
}
finally {
    searchbtnele.disabled = false;
    searchinputele.disabled = false;
}

}

searchbtnele.addEventListener('click',showMovie);
searchinputele.addEventListener("keydown",(event) =>{
    if(event.key == 'Enter'){
        event.preventDefault();
        
        showMovie();
    }
});
