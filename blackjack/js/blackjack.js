$(function() {
    const CARDWIDTH = 141;
    const CARDHEIGHT = 192;

    // Functions responsible for handling the deck

    function newDeck() {
        // Create a new deck of 52 cards
        deck = [];
        for (s=1;s<5;s++) {
            for (n=1;n<14;n++) {
                const newCard = {suit:s, number:n};
                deck.push(newCard);
            }
        }
    }
    function shuffleDeck() {
        // Fisher-Yates shuffle
        for (i = deck.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
    }
    function drawCard() {
        // Returns the top card of the deck and removes it from the array
        drawnCard = deck.pop();        
        return drawnCard;
    }
    function dealHand() {
        // Draw starting hands for player and dealer
        playerHand = [];
        dealerHand = [];
        gameActive = true;
        playerBust = false;
        dealerBust = false;

        playerHand.push(drawCard());
        playerHand.push(drawCard());
        dealerHand.push(drawCard());
        dealerHand.push(drawCard());   
    }
    function playerHit() {
        // Player draws a card
        if (gameActive) {
            playerHand.push(drawCard());
            if (calcScore(playerHand) > 21) {
                playerBust = true;
                gameActive = false;
            }
            drawBoard();
        }
    }
    function playerStand() {
        // Player stops drawing cards
        if (gameActive) {
            gameActive = false;
            // Dealer draws until 17 is reached.
            while (calcScore(dealerHand) < 17) {
                dealerHand.push(drawCard());
            }
            if (calcScore(dealerHand) > 21) {
                dealerBust = true;
            }
            drawBoard();
        }
    }
    function calcScore(hand) {
        // Returns total score for given hand
        score = 0;
        aces = 0;
        for (i=0;i<hand.length;i++) {
            card = hand[i];
            if (card.number > 1 && card.number < 11) {
                // Number cards - Worth value
                score += hand[i].number;
            }
            else if (card.number > 10) {
                // Face cards - Worth 10
                score += 10;
            }
            else if (card.number = 1) {
                // Ace - Worth 1 OR 11
                score += 1;
                aces++;
            }
        }
        for (i=0;i<aces;i++) {
            // Find max score using any aces
            if (score + 10 <= 21) score += 10;
        }
        return score;        
    }
    function newHand() {
        // Runs all functions to start a fresh game
        newDeck();
        shuffleDeck();
        dealHand();
        drawBoard();
    }

    // Functions responsible for visuals

    function drawBoard() {
        // Runs all functions to draw entire playing area
        drawHand();
        drawDealer();
        drawStats();
        if (!gameActive) {
            $('#buttonHit').hide();
            $('#buttonStand').hide();
        }
        else {
            $('#buttonHit').show();
            $('#buttonStand').show();
        }
    }
    function drawDealer() {
        // Create all display elements for dealers hand
        $('#dealerHand').empty();
        if (gameActive) {
            if (calcScore(dealerHand) == 21) { 
                // Hand is revealed if dealer has blackjack           
                for (i=0;i<dealerHand.length;i++) {
                    $('#dealerHand').append("<img id='handCard" + i + "' src='./media/cards/" + dealerHand[i].suit + "/" + dealerHand[i].number + ".png' height='" + CARDHEIGHT + "' width='" + CARDWIDTH + "'/>");
                }
            }
            else {
                // Hide first card of dealer hand
                $('#dealerHand').append("<img id='handCard" + i + "' src='./media/cardback.png' height='" + CARDHEIGHT + "' width='" + CARDWIDTH + "'/>"); 
                for (i=1;i<dealerHand.length;i++) {
                    $('#dealerHand').append("<img id='handCard" + i + "' src='./media/cards/" + dealerHand[i].suit + "/" + dealerHand[i].number + ".png' height='" + CARDHEIGHT + "' width='" + CARDWIDTH + "'/>");
                }
            }
        }
        else {
            for (i=0;i<dealerHand.length;i++) {
                $('#dealerHand').append("<img id='handCard" + i + "' src='./media/cards/" + dealerHand[i].suit + "/" + dealerHand[i].number + ".png' height='" + CARDHEIGHT + "' width='" + CARDWIDTH + "'/>");
            }
        }
    }
    function drawHand() {
        // Create all display elements for players hand
        $('#playerHand').empty();
        for (i=0;i<playerHand.length;i++) {
            $('#playerHand').append("<img id='handCard" + i + "' src='./media/cards/" + playerHand[i].suit + "/" + playerHand[i].number + ".png' height='" + CARDHEIGHT + "' width='" + CARDWIDTH + "'/>");
        }  
    }
    function drawStats() {
        // Displays game status information
        msg = "";
        if (!gameActive) {
            if (playerBust) {
                msg += "You Bust!";
                sessionStorage.losses++;
            }
            else if (dealerBust) {
                msg += "Dealer Bust!";
                sessionStorage.wins++;
            }
            else if (calcScore(playerHand) > calcScore(dealerHand)) {
                msg += "You Win!";
                sessionStorage.wins++;
            }
            else if (calcScore(playerHand) < calcScore(dealerHand)) {
                msg += "Dealer Wins!";
                sessionStorage.losses++;
            }
            else msg += "The game is a draw!";
        }
        $('#comm').html(msg)
        $('#stats').html("Record: " + sessionStorage.wins + "-" + sessionStorage.losses)
    }

    // Begin a new game on load.

    if (isNaN(sessionStorage.wins)) sessionStorage.wins = 0;
    if (isNaN(sessionStorage.losses)) sessionStorage.losses = 0;
    newHand();

    // Button Event handlers

    $("#buttonNew").on("click",newHand);
    $("#buttonHit").on("click",playerHit);
    $("#buttonStand").on("click",playerStand);
});