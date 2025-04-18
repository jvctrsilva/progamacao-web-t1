function openModal(title, description) {
    document.getElementById('movie-title').textContent = title;
    document.getElementById('movie-description').textContent = description;
    document.getElementById('modal').style.display = 'block';
  }
  
  function closeModal() {
    document.getElementById('modal').style.display = 'none';
  }
  
  function goToSeats(time, room) {
    const movieTitle = document.getElementById('movie-title').textContent;

    // Salva tudo no localStorage
    localStorage.setItem('selectedMovie', movieTitle);
    localStorage.setItem('selectedTime', time);
    localStorage.setItem('selectedRoom', room);

    // Redireciona com todas as infos na URL
    const seatsUrl = `assentos.html?movie=${encodeURIComponent(movieTitle)}&time=${encodeURIComponent(time)}&room=${encodeURIComponent(room)}`;
    window.location.href = seatsUrl;
}
  
  window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }
  
