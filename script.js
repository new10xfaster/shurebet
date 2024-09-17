document.addEventListener('DOMContentLoaded', function () {
    const passwordForm = document.getElementById('password-form');
    const loadingScreen = document.getElementById('loading-screen');
    const redDotBar = document.getElementById('red-dot-bar');
    const cardsContainer = document.querySelector('.cards');
    const result = document.getElementById('result');
    const finalResult = document.getElementById('final-result');
    const gameAlert = document.getElementById('game-alert');
    const uniqueCodeDiv = document.getElementById('unique-code');
    let userBetAmount = 0;

    // Password Form Submission
    passwordForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
        const passwordInput = document.getElementById('password');
        const betAmountInput = document.getElementById('bet-amount');
        const today = new Date();
        const day = today.getDate();
        const correctPassword = `footah${day}`;

        // Validate Password and Bet Amount
        if (passwordInput.value !== correctPassword) {
            showAlert('Incorrect password. Please try again.', 'danger');
            passwordInput.value = ''; // Clear the password field
            return; // Stop further execution
        }
        userBetAmount = parseInt(betAmountInput.value);
        if (isNaN(userBetAmount) || userBetAmount <= 0) {
            showAlert('Please enter a valid bet amount.', 'danger');
            betAmountInput.value = ''; // Clear the bet amount field
            return; // Stop further execution
        }

        // Show Loading Screen (if password is correct)
        passwordForm.style.display = 'none';
        loadingScreen.style.display = 'flex';

        // Enlarge the red dot to a bar and then revert it back to a dot
        setTimeout(() => {
            redDotBar.classList.add('bar');  // Enlarge to a bar
            setTimeout(() => {
                redDotBar.classList.remove('bar'); // Revert back to a dot
                loadingScreen.style.display = 'none';
                document.querySelector('.container').style.display = 'block';
                showAlert(`Bet placed: ${userBetAmount}`, 'success');
            }, 5000); // Revert after 5 seconds
        }, 5000); // Initially enlarge after 5 seconds
    });

    // Function to Generate Unique Code
    function generateUniqueCode() {
        return Math.floor(Math.random() * 1000) * 1234;
    }

    // Function to Handle Card Selection
    window.selectCard = function (userChoice) {
        cardsContainer.style.display = 'none';
        result.style.display = 'block';
        gameAlert.style.display = 'none';

        const biasFactor = 0.8;
        const maxPayoutFactor = 4;
        let computerChoice = Math.floor(Math.random() * 4);

        if (computerChoice < 2) {
            const modifiedBiasFactor = Math.random() * biasFactor;
            if (modifiedBiasFactor < 0.01) {
                computerChoice = userChoice;
            }
        }

        setTimeout(() => {
            result.style.display = 'none';
            finalResult.style.display = 'block';
            finalResult.classList.remove('win', 'lose');
            
            const winningTeam = teams[computerChoice].name;
            const userTeam = teams[userChoice].name;

            if (userChoice === computerChoice) {
                finalResult.textContent = `You win! 🎉 Winning team: ${winningTeam}`;
                finalResult.classList.add('win');
                const winnings = Math.min(userBetAmount * maxPayoutFactor, userBetAmount * 4);
                showAlert(`You won! Your unique code: ${generateUniqueCode()} (Winnings: ${winnings}, Winning team: ${winningTeam})`, 'success');
            } else {
                finalResult.textContent = `You lose! 😢 Winning team: ${winningTeam}`;
                finalResult.classList.add('lose');
                showAlert(`You lost! You chose ${userTeam}, but the winning team was ${winningTeam}. Try again next time.`, 'danger');
            }
        }, 9000);
    };

    // Function to Show Alerts
    function showAlert(message, type) {
        gameAlert.textContent = message;
        gameAlert.classList.add(type === 'success' ? 'alert-success' : 'alert-danger');
        gameAlert.style.display = 'block';
    }

    // Team Data
    const teams = [
        { image: "manu.png", name: "Man U" },
        { image: "chelsea.png", name: "Chelsea" },
        { image: "gor.jfif", name: "Gor Mahia" },
        { image: "logoharambee.png", name: "Harambee Stars" }
    ];

    // Create Card Elements Dynamically
    teams.forEach((team, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.setAttribute('onclick', `selectCard(${index})`);
        cardDiv.innerHTML = `
            <div class="team-image"><img src="${team.image}" alt="${team.name}"></div>
            <div class="team-name">${team.name}</div>
        `;
        cardsContainer.appendChild(cardDiv);
    });
});
