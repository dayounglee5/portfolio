// TV genre-song probabilities
const tvGenreSongProbabilities = {
    "Action": {"Rock": 0.9775, "Pop": 0.0225},
    "Comedy": {"Pop": 0.2046 + 0.2158, "Rock": 0.5796},
    "Crime": {"Pop": 0.3903 + 0.4773, "Rock": 0.0313},
    "Thriller": {"Pop": 0.3903 + 0.4773, "Rock": 0.0313},
    "Drama": {"Pop": 0.459, "Rock": 0.1202 + 0.2901},
    "Fantasy": {"Indie Rock": 0.6544},
    "Horror": {"Pop": 0.5982, "Rock": 0.3674, "Electronica": 0.1010},
    "Reality-TV": {"Pop": 1.0},
    "Romance": {"R&B/Hip-Hop": 0.2527, "Rock": 0.3484},
    "Sci-Fi": {"Pop": 0.0856, "Rock": 0.4330 + 0.4814}
  };
  
  // Song data
  const songs = [
    { title: "'Simple Man' by Lynard Skynyrd", genre: "Rock" },
    { title: "'Super Bon Bon' by Soul Coughing", genre: "Indie Rock" },
    { title: "'Drive' by Incubus", genre: "Rock" },
    { title: "'Snap' by Rosa Linn", genre: "Pop" },
    { title: "'Every Morning' by Sugar Ray", genre: "Pop" },
    { title: "'Mayonaise' by The Smashing Pumpkins", genre: "Rock" },
    { title: "'Bury a Friend' by Billie Eilish", genre: "Pop" },
    { title: "'Into Dust' by Mazzy Star", genre: "Rock" },
    { title: "'Exile' by Taylor Swift", genre: "Pop" },
    { title: "'Love Is A Bitch' by Two Feet", genre: "Electronica" },
    { title: "'Don't Give Up On Me' by Andy Grammer", genre: "Pop" },
    { title: "'Walked Through Hell' by Anson Seabra", genre: "Pop" },
    { title: "'She Drives Me Crazy' by Fine Young Cannibals", genre: "Pop" },
    { title: "'Right Down the Line' by Gerry Rafferty", genre: "Rock" },
    { title: "'The End' by JPOLND", genre: "Rock" },
    { title: "'All for Us' by Labrinth & Zendaya", genre: "Pop" },
    { title: "'Watermelon Moonshine' by Lainey Wilson", genre: "Country" },
    { title: "'Workin' Overtime' by Lainey Wilson", genre: "Country" },
    { title: "'Strange Currencies' by R.E.M.", genre: "Alternative" },
    { title: "'Trampoline' by SHAED", genre: "Pop" },
    { title: "'How To Save A Life' by The Fray", genre: "Rock" },
    { title: "'Space Song' by Beach House", genre: "Indie Rock" },
    { title: "'I Was Made for Lovin' You' by KISS", genre: "Rock" },
    { title: "'The Order of Death' by Public Image Ltd", genre: "Rock" },
    { title: "'Goo Goo Muck' by The Cramps", genre: "Rock" },
    { title: "'Take on Me' by a-ha", genre: "Pop" },
    { title: "'Long Long Time' by Linda Ronstadt", genre: "Pop" },
    { title: "'Down By The Water' by PJ Harvey", genre: "Alternative" },
    { title: "'Zombie' by The Cranberries", genre: "Rock" },
    { title: "'bad guy' by Billie Eilish", genre: "Pop" },
    { title: "'Looking At Me' by Sabrina Carpenter", genre: "Pop" },
    { title: "'September' by Earth, Wind & Fire", genre: "R&B/Hip-Hop" },
    { title: "'Songbird' by Fleetwood Mac", genre: "Rock" },
    { title: "'Sweet Child O' Mine' by Guns N' Roses", genre: "Rock" },
    { title: "'Good as Hell' by Lizzo", genre: "R&B/Hip-Hop" },
    { title: "'This Love (Taylor's Version)' by Taylor Swift", genre: "Pop" },
    { title: "'Running Up That Hill' by Kate Bush", genre: "Rock / Rock" },
    { title: "'Master of Puppets' by Metallica", genre: "Rock" },
    { title: "'I Don't Want to Set the World on Fire' by The Ink Spots", genre: "Pop" }
  ];
  
  function normalizeProbabilities(probDict) {
    const keys = Object.keys(probDict);
    const total = keys.reduce((sum, key) => sum + probDict[key], 0);
    if (total === 0) {
      const equalProb = 1.0 / keys.length;
      let normalized = {};
      keys.forEach(key => normalized[key] = equalProb);
      return normalized;
    }
    let normalized = {};
    keys.forEach(key => normalized[key] = probDict[key] / total);
    return normalized;
  }
  
  function predictSongGenre(tvShowGenre) {
    const lowerInput = tvShowGenre.trim().toLowerCase();
    let matchingKey = null;
  
    for (const key in tvGenreSongProbabilities) {
      if (key.toLowerCase() === lowerInput) {
        matchingKey = key;
        break;
      }
    }
  
    if (!matchingKey) {
      return null; 
    }
  
    const rawProbs = tvGenreSongProbabilities[matchingKey];
    const normalizedProbs = normalizeProbabilities(rawProbs);
  
    const sortedGenres = Object.entries(normalizedProbs)
      .sort((a, b) => b[1] - a[1]); 
  
    const highestProbabilityGenre = sortedGenres[0][0];
  
    const matchingSongs = songs.filter(song => song.genre === highestProbabilityGenre);
  
    return {
      rankedGenres: sortedGenres,
      highestProbabilityGenre: highestProbabilityGenre,
      songs: matchingSongs, 
    };
  }
  
  document.getElementById("predictButton").addEventListener("click", function() {
    const tvShowGenre = document.getElementById("genreInput").value;
    const result = predictSongGenre(tvShowGenre);
  
    if (!result) {
      document.getElementById("result").innerHTML = 
        `Unknown TV genre: '<strong>${tvShowGenre}</strong>'. Please try another.`;
      return;
    }
  
    const rankedGenres = result.rankedGenres;
    const matchingSongs = result.songs;
    const highestProbabilityGenre = result.highestProbabilityGenre;
  
    let resultString = `For a <b>${tvShowGenre}</b> show, here’s a ranking of recommended song genres:\n`;
    rankedGenres.forEach(([genre, prob], index) => {
      resultString += `${index + 1}. ${genre} (${(prob * 100).toFixed(1)}%)\n`;
    });
  
    resultString += `<br><br>Songs that match the <b>${highestProbabilityGenre}</b> genre:<ul>`;
    matchingSongs.forEach((song) => {
      resultString += `<li>${song.title}</li>`;
    });
    resultString += `</ul>`;
    
  
    document.getElementById("result").innerHTML = resultString.replace(/\n/g, '<br>');
  });
  
  
  
  // Help Button
  // document.addEventListener('DOMContentLoaded', function() {
  //   const helpButton = document.querySelector('.help-button');
  //   const helpCard = document.getElementById('need-help');
  //   const closeButton = document.querySelector('.close-btn-help');
    
  //   helpButton.addEventListener('click', function() {
  //       helpCard.classList.remove('hidden');
  //   });
    
  //   const speechBubble = document.querySelector('.speech-bubble');
  //   if (speechBubble) {
  //       speechBubble.addEventListener('click', function() {
  //           helpCard.classList.remove('hidden');
  //       });
  //   }
    
  //   closeButton.addEventListener('click', function() {
  //       helpCard.classList.add('hidden');
  //   });
  // });
  
  
  document.addEventListener('DOMContentLoaded', function() {
    const helpButton = document.querySelector('.help-button');
    const helpCard = document.getElementById('need-help');
    const closeButton = document.querySelector('.close-btn-help');
    
    helpButton.addEventListener('click', function() {
        helpCard.classList.remove('hidden');
    });
    
    const speechBubble = document.querySelector('.speech-bubble');
    if (speechBubble) {
        speechBubble.addEventListener('click', function() {
            helpCard.classList.remove('hidden');
        });
    }
    
    closeButton.addEventListener('click', function() {
        helpCard.classList.add('hidden');
    });
  });