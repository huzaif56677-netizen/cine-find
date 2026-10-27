const searchinputele = document.getElementById("search-input");
const searchbtnele = document.getElementById("search-btn");
const moviescontainerEle = document.getElementById("movies-container");
const statusmessageele = document.getElementById("status-message");


const movieposterele = document.getElementById("movie-poster") || document.querySelector(".movie-poster");
const movietitleele = document.getElementById("movie-title") || document.querySelector(".movie-title");
const movieyearele = document.getElementById("movie-year") || document.querySelector(".movie-year");


const typeEle = document.getElementById("movie-type");





function createMovieElement({ Poster, Title, Type, Year, imdbID }) {
    const movie = document.createElement("article");
    movie.className = "movie-div";
    movie.tabIndex = 0;

    movie.innerHTML = `
        <div class="movie-poster-wrap">
            <img
    class="movie-poster"
    src="${Poster && Poster !== "N/A" ? Poster : 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}"
    alt="Poster for ${Title || "Unknown movie"}"
    onerror="this.onerror=null; this.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';"
>
        </div>

        <div class="movie-main">
            <h2 class="movie-title">${Title || "N/A"}</h2>

            <div class="movie-meta">
                <span class="movie-type">${Type || "N/A"}</span>
                <span class="movie-year">${Year || "N/A"}</span>
            </div>

            <div class="movie-details">
                <p class="movie-genre">N/A</p>
                <p class="movie-plot">N/A</p>
            </div>
        </div>

        <div class="movie-stub">
            <span class="stub-label">IMDb</span>
            <span class="movie-rating">N/A</span>
            <span class="stub-scale">out of 10</span>
        </div>
    `;
    movie.addEventListener("click",()=>{
        showMovieDetails(imdbID, movie);
    })

    return movie;
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
    moviescontainerEle.innerHTML="";
    statusmessageele.innerText= "Loading ... "
    const response = await fetch(`/movies?title=${encodeURIComponent(title_got)}&page=1`);
    if(! response.ok){
        statusmessageele.innerText = 'Failer to connect to server';
        return;
    }
    else{
    data = await response.json();}

    // console.log(data);

    if (data.error) {
        
        statusmessageele.innerText = data.error;
    } else {

        if(!Array.isArray(data.Search) || data.Search.length === 0){
            statusmessageele.innerText = "No movies found";
            return;
        }
        statusmessageele.innerText = '';
        data.Search.forEach((movie) => {
            const movieElement = createMovieElement(movie);
            moviescontainerEle.appendChild(movieElement);
        });
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


async function showMovieDetails(imdbID, movie){
    //implement cache later
    // movieDetailscache[imdbID] = {}
    // if(movieDetailscache[imdbID]){

    //     return;
    // }
    
    console.log(movie);
    
   const details_response =  await fetch(`/movies/details?imdbID=${encodeURIComponent(imdbID)}`);
   try{
    if(! details_response.ok){
        statusmessageele.innerText = 'Failer to connect to server';
        return;
    }
    else{
        const detailed_data = await details_response.json();
        // console.log(movie)
        // console.log(detailed_data)
        if(detailed_data.error){
            statusmessageele.innerText = `${detailed_data.error}`;
        }
        else{
            statusmessageele.innerText = '';
            const movieselected = document.querySelector('.movie-div.expanded');
            if(movieselected && movieselected !== movie){
                movieselected.classList.remove('expanded');
            }
        
            movie.classList.toggle('expanded');
            
           
            // moviegenreele.innerText = `${detailed_data.Genre}`;
            // movieplotele.innerText = `${detailed_data.Plot}`;
            // movieratingele.innerText =`${detailed_data.imdbRating}`;
            movie.querySelector('.movie-genre').innerText = detailed_data.Genre || "N/A";
            movie.querySelector('.movie-plot').innerText = detailed_data.Plot || "No plot available";
            movie.querySelector('.movie-rating').innerText = detailed_data.imdbRating || "N/A";


        }
    }
}
catch (error){
    statusmessageele.innerText = `${error}`;
}

}
