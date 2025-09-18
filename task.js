const text = "Book Movie Tickets here...";
let index = 0;
const speed = 100;
let selectedMovie = "";
let selectedShowtime = "";
let selectedTheatre = "DreamMax Theatre";
let selectedPricing = { premium: 250, standard: 150 };

function typeHeading() {
  const heading = document.getElementById("animated-head");
  if (index < text.length) {
    heading.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeHeading, speed);
  }
}

function filterMovies(category) {
  document.querySelectorAll(".movie-box").forEach(box => {
    box.style.display =
      category === "all" || box.classList.contains(category) ? "block" : "none";
  });
}

const movies = [
  { title: "Kubera", src: "https://static.toiimg.com/photo/msid-108429646/108429646.jpg?8088", category: "new-releases", trailer: "https://youtube.com/embed/Zu4-jr0sSBE"},
  { title: "8Vasanthalu", src: "https://www.cinejosh.com/newsimg/newsmainimg/meet-shuddhi-from-8-vasanthalu_b_0706240946.jpg", category: "new-releases", trailer: "https://youtube.com/embed/aPPME4nMcJI"},
  { title: "Hit:The Third Case", src: "https://th.bing.com/th/id/OIP.17cqVPbY_Ai-u83tGtkNjQAAAA", category: "new-releases", trailer: "https://youtube.com/embed/kAtfaaUgDRU"},
  { title: "Single", src: "https://images.filmibeat.com/img/popcorn/movie_posters/single-20250210162519-23502.jpg", category: "new-releases", trailer: "https://youtube.com/embed/q2KdzXF_svA"},
  { title: "Bhairavam", src: "https://th.bing.com/th/id/OIP.Ed88SiMmU4IGB9mOxZNvggHaGg", category: "new-releases", trailer: "https://youtube.com/embed/3qiqCTvhpOg"},
  { title: "Andala Rakshasi", src: "https://1.bp.blogspot.com/-vHm2WtB_XsE/T8j34c1FjxI/AAAAAAAAOiA/mLi00xt_kHA/s1600/Andala-Rakshasi-Audio-Posters-HD+(2).jpg", category: "new-releases", trailer: "https://youtube.com/embed/sz3jGURM84I?si=i3MZtc7rqa_joTC5"},

  { title: "Kingdom", src: "https://images.filmibeat.com/img/popcorn/movie_posters/kingdom-20250212163707-21527.jpg", category: "upcoming-movies", trailer: ""},
  { title: "Thammudu", src: "https://th.bing.com/th/id/OIP.Wmxr_JwtAELsjD6HNsuAPQHaEK", category: "upcoming-movies", trailer: "https://youtube.com/embed/sZ0ED9oAI4o"},
  { title: "Veedokkade", src: "https://m.media-amazon.com/images/I/714QK8fCSkL._SL1500_.jpg", category: "upcoming-movies", trailer: ""},
  { title: "Haindhava", src: "https://images.filmibeat.com/webp/img/popcorn/movie_posters/haindava-20250108200458-23061.jpg", category: "upcoming-movies", trailer: ""},
  { title: "Rajasaab", src: "https://th.bing.com/th/id/OIF.Yn4szjHRQB8bm0AZAmIsAw", category: "upcoming-movies", trailer: "https://youtube.com/embed/NZbmcl0QUaU"}
];

function renderMovies() {
  const container = document.getElementById("moviesContainer");
  container.innerHTML = "";
  movies.forEach(movie => {
    const box = document.createElement("div");
    box.className = `movie-box ${movie.category}`;
    box.onclick = () => openBooking(movie);
    const img = document.createElement("img");
    img.src = movie.src;
    const span = document.createElement("span");
    span.textContent = movie.title;
    box.appendChild(img);
    box.appendChild(span);
    container.appendChild(box);
  });
}



function openBooking(movie) {
  selectedMovie = movie.title;

  document.querySelector(".tabs").style.display = "none";
  document.getElementById("moviesContainer").style.display = "none";
  document.getElementById("bookingView").style.display = "block";

  // Media and trailer
  const mediaWrapper = document.getElementById("mediaWrapper");
  mediaWrapper.innerHTML = `
    <div class="booking-movie-details animated-zoom">
      <img src="${movie.src}" alt="${movie.title}">
      <span>${movie.title}</span>
    </div>
    <div class="trailer-container">
      <iframe src="${movie.trailer}" allowfullscreen></iframe>
    </div>
  `;

  // Showtime
  const showtimeContainer = document.getElementById("showtimeContainer");
  showtimeContainer.innerHTML = "<p><strong>DreamMax Theatre</strong></p>";
  ["10:00 AM", "2:00 PM", "6:00 PM"].forEach(time => {
    const btn = document.createElement("button");
    btn.className = "showtime-btn";
    btn.textContent = time;
    btn.onclick = () => {
      selectedShowtime = time;
      document.getElementById("seatSection").style.display = "block";
      document.getElementById("pricingTag").innerHTML =
        `<strong>Seat Prices:</strong> ${selectedPricing.standard} (Special), ${selectedPricing.premium} (Recliner);`
      generateSeatGrid();
    };
    showtimeContainer.appendChild(btn);
  });
}


function generateSeatGrid() {
  const seatGrid = document.getElementById("seatGrid");
  seatGrid.innerHTML = "";

  for (let row = 1; row <= 6; row++) {
    for (let col = 1; col <= 31; col++) {
      if (col === 16) {
        const aisle = document.createElement("div");
        aisle.className = "aisle";
        seatGrid.appendChild(aisle);
        continue;
      }
      const seatNumber = (row - 1) * 30 + (col < 16 ? col : col - 1);
      const isRecliner = row <= 3;
      const seat = document.createElement("div");
      seat.className = "seat";
      seat.textContent = seatNumber;
      seat.dataset.type = isRecliner ? "premium" : "standard";
      seat.title = isRecliner ? "Recliner" : "Special";
      seat.onclick = () => seat.classList.toggle("selected");
      if (isRecliner) seat.style.backgroundColor = "#ff9800";
      seatGrid.appendChild(seat);
    }
  }
}

function confirmBooking() {
  const name = document.getElementById("userName").value.trim();
  const seats = Array.from(document.querySelectorAll(".seat.selected"));
  if (!name || seats.length === 0 || !selectedShowtime) {
    alert("Please enter your name, select a showtime, and choose your seats.");
    return;
  }

  const seatNumbers = seats.map(seat => seat.textContent);
  const seatTypes = seats.map(seat => seat.dataset.type);
  const total = seatTypes.reduce((sum, type) => {
    return sum + (type === "premium" ? selectedPricing.premium : selectedPricing.standard);
  }, 0);

  const ticketDisplay = document.getElementById("ticketDisplay");
  ticketDisplay.style.display = "block";
  ticketDisplay.innerHTML = `
    <h3>🎫 Ticket Confirmed</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Movie:</strong> ${selectedMovie}</p>
    <p><strong>Theatre:</strong> ${selectedTheatre}</p>
    <p><strong>Showtime:</strong> ${selectedShowtime}</p>
    <p><strong>Seats:</strong> ${seatNumbers.join(", ")}</p>
    <p><strong>Types:</strong> ${seatTypes.map(type => type === 'premium' ? "Recliner" : "Special").join(", ")}</p>
    <p><strong>Total:</strong> ₹${total}</p>
    <p><strong>Enjoy your show! 🍿</strong></p>
  `;

  document.getElementById("celebrationSound")?.play();
  confetti({ particleCount: 150, spread: 60, origin: { y: 0.6 } });
}

function goBack() {
  document.querySelector(".tabs").style.display = "flex";
  document.getElementById("moviesContainer").style.display = "flex";
  document.getElementById("bookingView").style.display = "none";
  document.getElementById("seatSection").style.display = "none";
  document.getElementById("ticketDisplay").style.display = "none";
  document.getElementById("userName").value = "";
}


function searchMovie() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll(".movie-box").forEach(box => {
    const title = box.querySelector("span").textContent.toLowerCase();
    box.style.display = title.includes(input) ? "block" : "none";
  });
}

window.onload = () => {
  typeHeading();
  renderMovies();
};