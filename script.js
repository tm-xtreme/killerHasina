let hits = 0;    
let misses = 0;    
let attempts = 0;    

const movingPhoto = document.getElementById("moving-photo");    
const shoe = document.getElementById("shoe");    
const blast = document.getElementById("blast");    
const gameContainer = document.getElementById("game-container");    
const message = document.getElementById("message");    

const throwSound = document.getElementById("throw-sound");    
const hitSound = document.getElementById("hit-sound");    
const missSound = document.getElementById("miss-sound");    

const bgm = document.getElementById("bgm"); // Background music    
const muteBtn = document.getElementById("mute"); // Mute button    

bgm.loop = true; // Enable looping    
bgm.volume = 0.5; // Moderate volume    

let targetSpeed = 5;    
let targetDirectionX = 1;    
let targetDirectionY = 1;    
let gameRunning = true;    
let animationFrameId = null;    

// Start background music after user interaction (fix autoplay issue)    
document.addEventListener("click", () => {    
    if (bgm.paused) {    
        bgm.play().catch(err => console.log("BGM play blocked:", err));    
    }    
}, { once: true }); // Runs only once    

// Mute/Unmute functionality    
muteBtn.addEventListener("click", () => {    
    if (bgm.muted) {    
        bgm.muted = false;    
        muteBtn.innerText = "Mute";    
    } else {    
        bgm.muted = true;    
        muteBtn.innerText = "Unmute";    
    }    
});    

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("visitedBefore")) {
        showWelcomePopup();
    }
});

function showWelcomePopup() {
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            height: auto;
            width: 80%;
            transform: translate(-50%, -50%);
            background: #E6A273;
            padding: 20px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            text-align: center;
            z-index: 1000;
        ">
            <h2>🎉 Throw Sandle to Killer Hasina!</h2>
            <p>Throw the shoe and hit the target 6 times to win! Play at least 3 games to enjoy more. Good luck! 🚀</p>
            <button id="popup-ok" style="
                padding: 10px 20px;
                font-size: 16px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">OK</button>
        </div>
    `;
    
    document.body.appendChild(popup);

    document.getElementById("popup-ok").addEventListener("click", () => {
        localStorage.setItem("visitedBefore", "true"); // Store visit status
        popup.remove(); // Close popup
    });
}


// Set initial position    
movingPhoto.style.left = "50px";    
movingPhoto.style.top = "50px";    

// Move target like a bouncing ball    
function moveTarget() {    
    if (!gameRunning) return;    

    let maxX = gameContainer.clientWidth - movingPhoto.clientWidth;    
    let maxY = gameContainer.clientHeight - movingPhoto.clientHeight;    

    function animate() {    
        if (!gameRunning) return;    

        let currentX = movingPhoto.offsetLeft;    
        let currentY = movingPhoto.offsetTop;    

        if (currentX >= maxX || currentX <= 0) targetDirectionX *= -1;    
        if (currentY >= maxY || currentY <= 0) targetDirectionY *= -1;    

        movingPhoto.style.left = `${currentX + targetSpeed * targetDirectionX}px`;    
        movingPhoto.style.top = `${currentY + targetSpeed * targetDirectionY}px`;    

        animationFrameId = requestAnimationFrame(animate);    
    }    

    cancelAnimationFrame(animationFrameId);    
    animationFrameId = requestAnimationFrame(animate);    
}    

moveTarget(); // Start movement    

function throwShoe() {    
    if (!gameRunning) return;    

    attempts++;    
    document.getElementById("attempts").innerText = attempts;    

    throwSound.play();    

    let shoeSpeed = 20;    
    let shoeMove = setInterval(() => {    
        shoe.style.top = `${shoe.offsetTop - shoeSpeed}px`;    

        let shoeRect = shoe.getBoundingClientRect();    
        let targetRect = movingPhoto.getBoundingClientRect();    

        let shoeCenterX = shoeRect.left + shoeRect.width / 2;    
        let shoeCenterY = shoeRect.top + shoeRect.height / 2;    
        let targetCenterX = targetRect.left + targetRect.width / 2;    
        let targetCenterY = targetRect.top + targetRect.height / 2;    

        let hitboxX = targetRect.width * 0.4;    
        let hitboxY = targetRect.height * 0.4;    

        let distanceX = Math.abs(shoeCenterX - targetCenterX);    
        let distanceY = Math.abs(shoeCenterY - targetCenterY);    

        if (distanceX < hitboxX && distanceY < hitboxY) {      
            clearInterval(shoeMove);    
            hits++;    
            document.getElementById("hits").innerText = hits;    
            showMessage("💥 BOOM! Perfect Hit!", 1000);    

            blast.style.display = "block";    
            blast.style.left = `${targetCenterX - blast.clientWidth / 2}px`;    
            blast.style.top = `${targetCenterY - blast.clientHeight / 2}px`;    

            hitSound.play();    

            setTimeout(() => {    
                blast.style.display = "none";    
                resetShoe();    
            }, 800);    

            if (hits === 6) {    
                gameWin();    
            }    
        } else if (shoe.offsetTop < 0) {    
            clearInterval(shoeMove);    
            misses++;    
            document.getElementById("misses").innerText = misses;    
            showMessage("😢 Missed! Try Again.", 1000);    

            missSound.play();
            missSound.volume = 1; 

            setTimeout(resetShoe, 200);    
        }    
    }, 30);    
}    

// Smooth shoe reset animation    
function resetShoe() {    
    shoe.style.transition = "top 0.3s ease";    
    shoe.style.top = "auto";    
    shoe.style.bottom = "10px";    

    setTimeout(() => {    
        shoe.style.transition = "none";    
    }, 300);    
}    

// Function to show a message for a limited time    
function showMessage(text, duration) {    
    message.innerText = text;    
    message.style.display = "block";    

    setTimeout(() => {    
        if (!message.innerHTML.includes("Start Again")) {    
            message.style.display = "none";    
        }    
    }, duration);    
}    

function gameWin() {    
    gameRunning = false;    
    cancelAnimationFrame(animationFrameId);    

    movingPhoto.style.display = "none";    
    shoe.style.display = "none";    
    blast.style.display = "none";    

    // Define matching success sounds and images
    const successData = [
        { sound: "success1.m4a", image: "mgi1.png" },
        { sound: "success2.m4a", image: "mgi2.png" },
        { sound: "success3.m4a", image: "mgi3.png" }
    ];

    // Select a random index
    const randomIndex = Math.floor(Math.random() * successData.length);

    // Get the corresponding sound and image
    const randomSuccessSound = new Audio(successData[randomIndex].sound);
    const randomWinnerImage = successData[randomIndex].image;

    message.innerHTML = `  
    <div style="  
        display: flex;   
        flex-direction: column;   
        align-items: center;   
        justify-content: center;   
        text-align: center;   
        width: 100%;   
        max-width: 400px;  
        color: white;   
        border-radius: 10px;  
    ">  
        <img src="${randomWinnerImage}" alt="Winner" style="width: 200px; height: auto;">  
        <h2 style="font-size: 28px;">🎉 Congratulations, You Won! Gen-Z hits: ${hits}</h2>  
        <button onclick="restartGame()">Start Again</button>  
    </div>`;  

    message.style.display = "block";    

    bgm.pause(); // Pause background music    
    randomSuccessSound.play();  
}    

function restartGame() {    
    hits = 0;    
    misses = 0;    
    attempts = 0;    
    gameRunning = true;    

    document.getElementById("hits").innerText = hits;    
    document.getElementById("misses").innerText = misses;    
    document.getElementById("attempts").innerText = attempts;    

    movingPhoto.style.display = "block";    
    shoe.style.display = "block";    

    message.style.display = "none";    

    resetShoe();    
    moveTarget();    

    bgm.play();    
}    

// Handle orientation change    
window.addEventListener("orientationchange", function () {  
    shoe.style.width = window.innerWidth < 768 ? "60px" : "80px";  
});