$(function() {
    // Default card size
    cardWidth = 47;
    cardHeight = 64;

    // Max card size
    maxCardWidth = 94;
    maxCardHeight = 128;

    // Functions responsible for handling the deck

    function newDeck() {
        // Create a new deck of 52 cards
        deck = [];
        for (s=1;s<5;s++) {
            for (n=2;n<15;n++) {
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
        // Draw starting hands for players
        playerHand = [];
        compHand1 = [];
        compHand2 = [];
        compHand3 = [];
        community = [];

        playerHand.push(drawCard());
        playerHand.push(drawCard());
        compHand1.push(drawCard());
        compHand1.push(drawCard());
        compHand2.push(drawCard());
        compHand2.push(drawCard());
        compHand3.push(drawCard());
        compHand3.push(drawCard());
        community.push(drawCard());
        community.push(drawCard());
        community.push(drawCard());
        community.push(drawCard());
        community.push(drawCard());   
    }
    function newGame() {
        // Runs all functions to start a fresh game
        newDeck();
        shuffleDeck();
        dealHand();
        gamePhase = 1;
        drawTable();
    }
    function playerDeal() {
        // Player progresses game
        if (gamePhase < 5) {
            gamePhase++;
            drawTable();
        }
    }
    function playerFold() {
        // Player ends game
        gamePhase = 5;        
        drawTable();
    }

    function calcScore(hand) {
        // Returns hand ranking and high card, higher wins
        // 9 - Straight Flush
        // 8 - Four of a kind
        // 7 - Full house
        // 6 - Flush
        // 5 - Straight
        // 4 - Three of a kind
        // 3 - Two pair
        // 2 - One pair
        // 1 - High card
        score = 1;
        scoreHigh = 0;
        // Create master hand to score
        newCommunity = structuredClone(community);
        newHand = structuredClone(hand);
        scoredHand = newCommunity.concat(newHand);
        
        // Sort hand by number
        scoredHand.sort(function(a, b) { return a.number - b.number });

        // Create frequency array and find highest card
        freqArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        for (i=0;i<scoredHand.length;i++) {
            freqArr[scoredHand[i].number]++;
            if (scoredHand[i].number > scoreHigh) scoreHigh = scoredHand[i].number;
        }
        countThree = 0;
        countTwo = 0;
        highTwo = 0;
        highThree = 0;
        for (i=2;i<freqArr.length;i++) {
            // Four of a kind
            if (freqArr[i] == 4) {
                if (score < 8) {
                    score = 8;
                    scoreHigh = i;
                }
                else if (score == 8 && i > scoreHigh) scoreHigh = i;
            }
            // Three of a kind
            else if (freqArr[i] == 3) {
                countThree++;
                if (score < 4) {
                    score = 4;
                    scoreHigh = i;
                    highThree = i;
                }
                else if (score == 4 && i > scoreHigh) { scoreHigh = i; highThree = i; }
            }
            // One Pair
            else if (freqArr[i] == 2) {
                countTwo++;
                if (score < 2) {
                    score = 2;
                    scoreHigh = i;
                    highTwo = i;
                }
                else if (score == 2 && i > scoreHigh) { scoreHigh = i; highTwo = i; }
                // Two Pair
                if (countTwo > 1 && score < 3) score = 3;

                // Full house
                if (countTwo > 0 && countThree > 0 && score < 7) {
                    score = 7;
                    if (countThree > countTwo) scoreHigh = countThree;
                    else scoreHigh = countTwo;                
                }
                if (countThree > 1 && score < 7) {
                    score = 7;
                    scoreHigh = highThree;                
                }
            }
        }
        for (i=1;i<5;i++) {
            suitCount = 0;
            tempHighCard = 0;
            tempFreqArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            for (j=0;j<scoredHand.length;j++) {
                if (scoredHand[j].suit == i) {
                    suitCount++;
                    tempFreqArr[scoredHand[j].number] = 1;
                    if (scoredHand[j].number > tempHighCard) tempHighCard = scoredHand[j].number;
                }
            }
            if (suitCount > 4) {
                // Flush
                if (score < 6) {
                    score = 6;
                    scoreHigh = tempHighCard;
                } 
                for (k=2;k<15;k++) {
                    if (tempFreqArr[k] == 1 && tempFreqArr[k + 1] == 1 && tempFreqArr[k + 2] == 1 && tempFreqArr[k + 3] == 1 && tempFreqArr[k + 4] == 1) {
                        // Straight flush
                        if (score < 9) {
                            score = 9;
                            scoreHigh = tempFreqArr[k + 4];
                        }
                        else if (score == 9 && scoreHigh < tempFreqArr[k+4]) scoreHigh = tempFreqArr[k + 4];
                    }
                }
            }
        }

        // Straight
        for (i=2;i<11;i++) {
            if (freqArr[i] > 0 && freqArr[i+1] > 0 && freqArr[i+2] > 0 && freqArr[i+3] > 0 && freqArr[i+4] > 0) {                
                if (score < 5) {
                    score = 5;
                    scoreHigh = i + 4;
                }
                else if (score == 5 && i + 4 > scoreHigh) scoreHigh = i + 4;                
            }            
        }
        if (freqArr[2] > 0 && freqArr[3] > 0 && freqArr[4] > 0 && freqArr[5] > 0 && freqArr[14] > 0) {                
            if (score < 5) {
                score = 5;
                scoreHigh = 5;
            }
            else if (score == 5 && 5 > scoreHigh) scoreHigh = 5;            
        }

        return [score,scoreHigh];
    }

    // Functions responsible for visuals

    function drawTable() {
        // Determine card size        
        tableRatio = $('#table').outerWidth() / 1180
        cardWidth = Math.round(maxCardWidth * tableRatio)
        cardHeight = Math.round(maxCardHeight * tableRatio)

        // Resize cards
        $('#playerHand1').width(cardWidth).height(cardHeight)
        $('#playerHand2').width(cardWidth).height(cardHeight)
        $('#compHand1Card1').width(cardWidth).height(cardHeight)
        $('#compHand1Card2').width(cardWidth).height(cardHeight)
        $('#compHand2Card1').width(cardWidth).height(cardHeight)
        $('#compHand2Card2').width(cardWidth).height(cardHeight)
        $('#compHand3Card1').width(cardWidth).height(cardHeight)
        $('#compHand3Card2').width(cardWidth).height(cardHeight)
        $('#flop1').width(cardWidth).height(cardHeight)
        $('#flop2').width(cardWidth).height(cardHeight)
        $('#flop3').width(cardWidth).height(cardHeight)
        $('#turn').width(cardWidth).height(cardHeight)
        $('#river').width(cardWidth).height(cardHeight)

        // Resize table
        $('#table').outerHeight($('#table').outerWidth() / 2)

        // Position card zones
        $('#community').css('left',($('#table').outerWidth() / 2) - ($('#community').outerWidth() / 2))
        .css('top',($('#table').outerHeight() / 2) - ($('#community').outerHeight() / 2))

        $('#playerHand').css('left',($('#table').outerWidth() / 2) - ($('#playerHand').outerWidth() / 2))
        .css('top',$('#table').outerHeight() - $('#playerHand').outerHeight())

        $('#compHand1').css('top',($('#table').outerHeight() / 2) - ($('#compHand1').outerHeight() / 2))

        $('#compHand2').css('left',($('#table').outerWidth() / 2) - ($('#compHand2').outerWidth() / 2))

        $('#compHand3').css('left',$('#table').outerWidth() - $('#compHand3').outerWidth())
        .css('top',($('#table').outerHeight() / 2) - ($('#compHand3').outerHeight() / 2))
        
        // Change card images

        $('#playerHand1').attr("src","./media/cards/" + playerHand[0].suit + "/" + playerHand[0].number + ".png")
        $('#playerHand2').attr("src","./media/cards/" + playerHand[1].suit + "/" + playerHand[1].number + ".png")

        if (gamePhase == 1) hideCards();
        if (gamePhase > 1) {
            $('#flop1').attr("src","./media/cards/" + community[0].suit + "/" + community[0].number + ".png")
            $('#flop2').attr("src","./media/cards/" + community[1].suit + "/" + community[1].number + ".png")
            $('#flop3').attr("src","./media/cards/" + community[2].suit + "/" + community[2].number + ".png")
        }
        if (gamePhase > 2) {
            $('#turn').attr("src","./media/cards/" + community[3].suit + "/" + community[3].number + ".png")
        }
        if (gamePhase > 3) {
            $('#river').attr("src","./media/cards/" + community[4].suit + "/" + community[4].number + ".png")
        }
        if (gamePhase > 4) {
            $('#compHand1Card1').attr("src","./media/cards/" + compHand1[0].suit + "/" + compHand1[0].number + ".png")
            $('#compHand1Card2').attr("src","./media/cards/" + compHand1[1].suit + "/" + compHand1[1].number + ".png")

            $('#compHand2Card1').attr("src","./media/cards/" + compHand2[0].suit + "/" + compHand2[0].number + ".png")
            $('#compHand2Card2').attr("src","./media/cards/" + compHand2[1].suit + "/" + compHand2[1].number + ".png")

            $('#compHand3Card1').attr("src","./media/cards/" + compHand3[0].suit + "/" + compHand3[0].number + ".png")
            $('#compHand3Card2').attr("src","./media/cards/" + compHand3[1].suit + "/" + compHand3[1].number + ".png")

            //drawWinner();
        }

        // Debug info
        [scoreP, highP] = calcScore(playerHand);
        [scoreC1, highC1] = calcScore(compHand1);
        [scoreC2, highC2] = calcScore(compHand2);
        [scoreC3, highC3] = calcScore(compHand3);        
        $('#sort').html(
            "DEBUG INFO<br>P High: " + highP + " - P Score: " + scoreP
            + "<br>C1 High: " + highC1 + " - C1 Score: " + scoreC1
            + "<br>C2 High: " + highC2 + " - C2 Score: " + scoreC2
            + "<br>C3 High: " + highC3 + " - C3 Score: " + scoreC3)
    }
    function hideCards() {
        // Flip revealed cards back to hidden
        $('#compHand1Card1').attr("src","./media/cardback.png")
        $('#compHand1Card2').attr("src","./media/cardback.png")
        $('#compHand2Card1').attr("src","./media/cardback.png")
        $('#compHand2Card2').attr("src","./media/cardback.png")
        $('#compHand3Card1').attr("src","./media/cardback.png")
        $('#compHand3Card2').attr("src","./media/cardback.png")
        $('#flop1').attr("src","./media/cardback.png")
        $('#flop2').attr("src","./media/cardback.png")
        $('#flop3').attr("src","./media/cardback.png")
        $('#turn').attr("src","./media/cardback.png")
        $('#river').attr("src","./media/cardback.png")
    }
    function drawWinner() {
        [scoreP, highP] = calcScore(playerHand);
        [scoreC1, highC1] = calcScore(compHand1);
        [scoreC2, highC2] = calcScore(compHand2);
        [scoreC3, highC3] = calcScore(compHand3);
        winners = [];
        highs = [];
        winMax = Math.max(scoreP, scoreC1, scoreC2, scoreC3);
        if (scoreP == winMax) { winners.push("P"); highs.push(highP); }
        if (scoreC1 = winMax) { winners.push("C1"); highs.push(highC1); }
        if (scoreC2 = winMax) { winners.push("C2"); highs.push(highC2); }
        if (scoreC3 = winMax) { winners.push("C3"); highs.push(highC3); }

        while (winners.length > 1) {
            if (highs[highs.length - 1] < highs[highs.length - 2]) {
                winners.pop();
                highs.pop();
            }
        }

        $('#msg').html(winMax + " is the winning score.")        
        
    }

    // Page load functions
    newGame();

    // Event handlers
    $(window).resize(drawTable);
    $("#buttonNew").on("click",newGame);
    $("#buttonDeal").on("click",playerDeal);
    $("#buttonFold").on("click",playerFold);
});