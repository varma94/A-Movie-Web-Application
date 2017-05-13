function initialize () {
}

function sendRequest () {
          
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("form-input").value);
   xhr.open("GET", "proxy.php?method=/3/search/movie&query=" + query);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {

          var myNode = document.getElementById("moviesList");
          if(myNode!=null)
          while (myNode.firstChild) {
              myNode.removeChild(myNode.firstChild);
          }
          
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
          for(i=0;i<json.results.length;i++){
          
          var div = document.createElement("div");
          console.log(json.results[i].title.length<0);
          div.innerHTML = "</br><a href=\"javascript:void(0)\">Movie Title: " + ((json.results[i].title.length==0)?'No data provided':json.results[i].title) + "</a>";
          div.onclick = (function() {
              var currentI = json.results[i].id ;
              return function() { 
                  setMovieDetails(currentI);
              }
           })();
          document.getElementById("moviesList").appendChild(div);
           var title = document.createElement("div");
          title.innerHTML = "<pre>Movie Release Date: " + ((json.results[i].release_date.substring(0,4).length==0)?"No data provided":json.results[i].release_date.substring(0,4))  + "</pre>";
          document.getElementById("moviesList").appendChild(title);
        }
       }
   };
   xhr.send(null);
}

function setMovieDetails (value) {
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("form-input").value);
   xhr.open("GET", "proxy.php?method=/3/movie/"+value);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {

          var myNode = document.getElementById("moviesInfo");

          if(myNode!=null)
          while (myNode.firstChild) {
              myNode.removeChild(myNode.firstChild);
          }
          var resp = JSON.parse(this.responseText);
          var str = "";
          
          var img = document.createElement("img");
          img.setAttribute("src", "https://image.tmdb.org/t/p/w500"+resp.poster_path);
          img.setAttribute("height", "400");
          img.setAttribute("width", "400");
          img.setAttribute("alt", "Flower");
          document.getElementById("moviesInfo").appendChild(img);
           
          var title = document.createElement("div");
          title.id = "title";
          title.innerHTML = "</br></br></br></br><p>Movie Title : " + ((resp.title==null || resp.title=="")?"No data provided":resp.title) + "</p>";
          document.getElementById("moviesInfo").appendChild(title);
              
          var genre = document.createElement("div");
          for(l=0;l<resp.genres.length;l++)
               str += resp.genres[l].name+",";
          str = str.replace(/,\s*$/, "");
          genre.innerHTML = "<p>Movie Genre : " + (str==null||str==""?"No data provided":str) + "</p>";
          genre.id = "genre";
          document.getElementById("moviesInfo").appendChild(genre);

          var description = document.createElement("p");
          var node = document.createTextNode("Movie Overview: "+((resp.overview==null ||resp.overview=="")?"No data provided":resp.overview));
          description.appendChild(node);
          document.getElementById("moviesInfo").appendChild(description);

          var cast = castAndCrew(resp.id);
        
       }
   };
   xhr.send(null);
}

function castAndCrew (value) {
  console.log(value);
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("form-input").value);
   xhr.open("GET", "proxy.php?method=/3/movie/"+value+"/credits");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          
          var str = "";
          var l=0;
          var resp = JSON.parse(this.responseText);
          var cast = document.createElement("div");
          for(l=0;l<resp.cast.length;l++){
               str += resp.cast[l].name+",";
               if(l==5)
                break;
          }
          cast.innerHTML = "<p>Movie Cast : " +str + "</p>";
          cast.id = "cast";
          document.getElementById("moviesInfo").appendChild(cast);

          str = "";l=0;
          var crew = document.createElement("div");
          for(l=0;l<resp.crew.length;l++){
               str += "<br/>"+resp.crew[l].department+" :"+ resp.crew[l].name;
               if(l==5)
                break;
             }
          
          crew.innerHTML = "<p>Movie Crew : "+ ((str==null||str=="")?"No data provided":str) + "</p></br>";
          crew.id = "crew";
          document.getElementById("moviesInfo").appendChild(crew);
          
       }
   };
   xhr.send(null);
}

