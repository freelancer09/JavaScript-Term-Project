$(function() {
    // Default card size
    cardWidth = 47;
    cardHeight = 64;

    // Max card size
    maxCardWidth = 94;
    maxCardHeight = 128;

    bgMusic = false;

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
        $('#msg').html("")
        $('#buttonDeal').css("display","inline")
        drawTable();
    }
    function playerDeal() {
        // Player progresses game
        if (gamePhase < 5) {
            gamePhase++;
            drawTable();
        }
    }
    function playerMute() {
        if (bgMusic) {
            document.getElementById("bgMusic").pause();
            bgMusic = false;
        }
        else {
            document.getElementById("bgMusic").play();
            bgMusic = true;
        }
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
        highsecondTwo = 0;
        highThree = 0;
        for (i=2;i<freqArr.length;i++) {
            // Four of a kind
            if (freqArr[i] == 4) {
                if (score < 8) {
                    score = 8;
                    scoreHigh = i;
                }
                else if (score == 8 && i > scoreHigh) {
                    scoreHigh = i;
                }
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
            // One Pair
            else if (freqArr[i] == 2) {                
                countTwo++;
                highsecondTwo = highTwo;
                highTwo = i;
                if (score < 2) {
                    score = 2;
                    scoreHigh = i;
                }
                else if (score == 2 && i > scoreHigh) { scoreHigh = i; }
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
                for (k=2;k<11;k++) {
                    if (tempFreqArr[k] == 1 && tempFreqArr[k + 1] == 1 && tempFreqArr[k + 2] == 1 && tempFreqArr[k + 3] == 1 && tempFreqArr[k + 4] == 1) {
                        // Straight flush
                        if (score < 9) {
                            score = 9;
                            scoreHigh = tempFreqArr[k + 4];
                        }
                        else if (score == 9 && scoreHigh < tempFreqArr[k+4]) scoreHigh = tempFreqArr[k + 4];
                    }
                }
                if (tempFreqArr[2] == 1 && tempFreqArr[3] == 1 && tempFreqArr[4] == 1 && tempFreqArr[5] == 1 && tempFreqArr[14] == 1) {
                    // Straight flush, ace low
                    if (score < 9) {
                        score = 9;
                        scoreHigh = 5;
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
            // Straight, ace low             
            if (score < 5) {
                score = 5;
                scoreHigh = 5;
            }
            else if (score == 5 && 5 > scoreHigh) scoreHigh = 5;            
        }
        
        rscore = 0;
        firstKicker = 0;
        secondKicker = 0;
        thirdKicker = 0;
        // Calculate RScore; 11 digit ranking of hand. First digit is hand type. Next five pairs of digits are potential tie breaks
        // In texas hold'em, only 5 of the 7 cards are used for hand scoring
        if (score == 9) {
            // Straight Flush: high card wins.
            rscore = 90000000000 + scoreHigh;
        }
        else if (score == 8) {
            // Four of a Kind: high card wins.
            rscore = 80000000000 + scoreHigh;
        }
        else if (score == 7) {
            // Full house: high triple wins, high pair wins.
            rscore = 70000000000 + (highThree * 100) + highTwo;
        }
        else if (score == 6) {
            // Flush: high card wins.
            rscore = 60000000000 + scoreHigh;
        }
        else if (score == 5) {
            // Straight: high card wins.
            rscore = 50000000000 + scoreHigh;
        }
        else if (score == 4) {
            // Three of a kind: high triple wins, high first kicker wins, high second kicker wins.
            for (i=0;i<scoredHand.length;i++) {
                if (scoredHand[i].number != scoreHigh) {
                    secondKicker = firstKicker;
                    firstKicker = scoredHand[i].number;
                }
            }
            rscore = 40000000000 + (scoreHigh * 10000) + (firstKicker * 100) + secondKicker;
        }
        else if (score == 3) {
            // Two pair: high pair wins, high second pair wins, high kicker wins.
            for (i=0;i<scoredHand.length;i++) {
                if (scoredHand[i].number != highTwo && scoredHand[i].number != highsecondTwo) {
                    firstKicker = scoredHand[i].number;
                }
            }
            rscore = 30000000000 + (highTwo * 10000) + (highsecondTwo * 100) + firstKicker;
        }
        else if (score == 2) {
            // One pair: high pair wins, high non-tie kicker wins.
            for (i=0;i<scoredHand.length;i++) {
                if (scoredHand[i].number != scoreHigh) {
                    thirdKicker = secondKicker;
                    secondKicker = firstKicker;
                    firstKicker = scoredHand[i].number;
                }
            }
            rscore = 20000000000 + (scoreHigh * 1000000) + (firstKicker * 10000) + (secondKicker * 100) + thirdKicker;
        }
        else if (score == 1) {
            // High card: high non-tie kicker wins.
            rscore = 10000000000 + (scoredHand[6].number * 100000000) + (scoredHand[5].number * 1000000) + (scoredHand[4].number * 10000) + (scoredHand[3].number * 100) + scoredHand[2].number;
        }        

        return rscore;
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

            $('#buttonDeal').css("display","none")

            drawWinner();
        }
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
        scoreP = calcScore(playerHand);
        scoreC1 = calcScore(compHand1);
        scoreC2 = calcScore(compHand2);
        scoreC3 = calcScore(compHand3);
        scores = [{name:"PLAYER", score:scoreP}, {name:"COMPUTER 1", score:scoreC1}, {name:"COMPUTER 2", score:scoreC2}, {name:"COMPUTER 3", score:scoreC3}];
        scores.sort(function(a,b) { return b.score - a.score });

        $('#msg').html(scores[0].name + " IS THE WINNER!") 
    }

    // Page load functions
    newGame();

    // Event handlers
    $(window).resize(drawTable);
    $("#buttonNew").on("click",newGame);
    $("#buttonDeal").on("click",playerDeal);
    $("#buttonMute").on("click",playerMute);
});