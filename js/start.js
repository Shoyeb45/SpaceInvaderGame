document.addEventListener('DOMContentLoaded', function() {
    const shipCards = document.querySelectorAll('.ship-card');
    const startButton = document.getElementById('start-game');
    const shipForm = document.getElementById('shipForm');
    
    // Add click event to all ship cards
    shipCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            shipCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Find the radio input within this card and check it
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Enable start button
            startButton.disabled = false;
        });
    });
    
    // Form submission
    shipForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        let choice = formData.get("choice");
        window.top.location.href = `./game.html?choice=${choice}`;
    });
});