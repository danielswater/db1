var app = angular.module('app');

app.controller('gameCtrl', ['$scope', '$uibModal', function($scope, $uibModal, $rootScope) {

    $scope.card = document.getElementsByClassName("cartao");
    $scope.cards = [...$scope.card];

    $scope.deck = document.getElementById("cartao-deck");

    // JOGADAS
    $scope.moves = 0;
    $scope.counter = document.querySelector(".moves");

    $scope.matchedCard = document.getElementsByClassName("match");

    $scope.openedCards = [];

    $scope._player = ""

    $scope.valueClose = false;

    $scope.player = [{ name: '', time: '', moves: '' }]

    // EMBARALHAR CARTAS
    $scope.shuffle = function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };


    // NOVO JOGO 
    $scope.startGame = function() {

        if (!localStorage.getItem('players')) {
            $scope.openModal();
        }

        $scope.players = JSON.parse(localStorage.getItem('players'));

        if ($scope.players) {
            $scope.players.sort((a, b) => (a.moves > b.moves) ? 1 : -1)
        }

        $scope.cards = $scope.shuffle($scope.cards);

        for (var i = 0; i < $scope.cards.length; i++) {
            $scope.deck.innerHTML = "";
            [].forEach.call($scope.cards, function(item) {
                $scope.deck.appendChild(item);
            });
            $scope.cards[i].classList.remove("show", "open", "match", "disabled");
            $scope.cards[i].style = "";
        }

        $scope.moves = 0;
        $scope.counter.innerHTML = $scope.moves;

        $scope.second = 0;
        $scope.minute = 0;
        $scope.hour = 0;
        $scope.timer = document.querySelector(".timer");
        $scope.timer.innerHTML = "<i class='fa fa-clock'></i> 0 minutos 0 segundos";
        clearInterval($scope.interval);

    }

    $scope.displayCard = function() {
        var foto = angular.element(this).attr('type');
        angular.element(this).css('background-image', "url(../../../../../assets/images/game/" + foto + ".jpg" + ")");
        this.classList.toggle("open");
        this.classList.toggle("show");
        this.classList.toggle("disabled");
    };

    $scope.cardOpen = function() {
        $scope.openedCards.push(this);
        var len = $scope.openedCards.length;
        if (len === 2) {
            $scope.moveCounter();
            if ($scope.openedCards[0].type === $scope.openedCards[1].type) {
                $scope.matched();
            } else {
                $scope.unmatched();
            }
        }
    };

    $scope.matched = function() {
        $scope.openedCards[0].classList.add("match", "disabled");
        $scope.openedCards[1].classList.add("match", "disabled");
        $scope.openedCards[0].classList.remove("show", "open", "no-event");
        $scope.openedCards[1].classList.remove("show", "open", "no-event");
        $scope.openedCards = [];
    }

    $scope.unmatched = function() {
        $scope.openedCards[0].classList.add("unmatched");
        $scope.openedCards[1].classList.add("unmatched");
        $scope.disable();
        setTimeout(function() {
            $scope.openedCards[0].style = "";
            $scope.openedCards[1].style = "";
            $scope.openedCards[0].classList.remove("show", "open", "no-event", "unmatched");
            $scope.openedCards[1].classList.remove("show", "open", "no-event", "unmatched");
            $scope.enable();
            $scope.openedCards = [];
        }, 1100);
    }

    $scope.disable = function() {
        Array.prototype.filter.call($scope.cards, function(card) {
            card.classList.add('disabled');
        });
    }

    $scope.enable = function() {
        Array.prototype.filter.call($scope.cards, function(card) {
            card.classList.remove('disabled');
            for (var i = 0; i < $scope.matchedCard.length; i++) {
                $scope.matchedCard[i].classList.add("disabled");
            }
        });
    }

    $scope.moveCounter = function() {
        $scope.moves++;
        $scope.counter.innerHTML = $scope.moves;

        if ($scope.moves == 1) {
            $scope.second = 0;
            $scope.minute = 0;
            $scope.hour = 0;
            $scope.startTimer();
        }
    }

    $scope.second = 0,
        $scope.minute = 0;
    $scope.hour = 0;
    $scope.timer = document.querySelector(".timer");
    $scope.interval;

    $scope.startTimer = function() {
        $scope.interval = setInterval(function() {
            $scope.timer.innerHTML = $scope.minute + " minutos " + $scope.second + " segundos";
            $scope.second++;
            if ($scope.second == 60) {
                $scope.minute++;
                $scope.second = 0;
            }
            if ($scope.minute == 60) {
                $scope.hour++;
                $scope.minute = 0;
            }
        }, 1000);
    }

    $scope.congratulations = function() {

        if ($scope.matchedCard.length == 2) {
            $scope.endGame();
            clearInterval($scope.interval);
            $scope.finalTime = $scope.timer.innerHTML;
            $scope.player = [{
                name: $scope._player,
                moves: $scope.moves,
                time: $scope.minute + " minutos " + $scope.second + " segundos"
            }]

            if (localStorage.getItem('players')) {
                var totalPlayers = JSON.parse(localStorage.getItem('players'));
                totalPlayers.push({
                    name: $scope._player,
                    moves: $scope.moves,
                    time: $scope.minute + " minutos " + $scope.second + " segundos"
                })
                localStorage.setItem('players', JSON.stringify(totalPlayers));
            } else {
                localStorage.setItem('players', JSON.stringify($scope.player));
            }

        };

    }

    //Modal
    $scope.openModal = function() {

        for (var i = 0; i < $scope.cards.length; i++) {
            $scope.card = $scope.cards[i];
            $scope.card.addEventListener("click", $scope.displayCard);
            $scope.card.addEventListener("click", $scope.cardOpen);
            $scope.card.addEventListener("click", $scope.congratulations);
        };
        var modalInstance = $uibModal.open({
            templateUrl: '../../../pages/component/modal.html',
            controller: function($scope, $uibModalInstance) {
                $scope.savePlayer = function(player) {
                    $uibModalInstance.close(player);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                }
            },
            backdrop: 'static'
        })

        modalInstance.result
            .then(function(player) {
                $scope._player = player
            }).catch(function(reason) {});
    };

    $scope.endGame = function() {
        var modalInstance2 = $uibModal.open({
            templateUrl: '../../../pages/component/modal-end-game.html',
            controller: function($scope, $uibModalInstance) {
                $scope.cancel = function(value) {
                    $uibModalInstance.close(value);
                }
            }
        })

        modalInstance2.result
            .then(function(value) {
                window.location.reload(false);
            }).catch(function(reason) {});
    }

    document.body.onload = $scope.startGame();

}])