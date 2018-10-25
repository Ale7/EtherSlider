pragma solidity ^0.4.21;

/*
Determines the winner of a sliding puzzle game
*/
contract Winner {
    address public creator;
    uint256 public betAmount;
    uint256 public totalBet;
    uint256 public numberOfBets;
    uint256 public maxAmountOfBets = 50;
    uint256 public maxTime = 900000; // 900 seconds - 15 minutes
    address[] public players;
    
    struct Player {
        uint256 amountBet;
        uint256 solveTime;
    }
    
    // The address of the player and => player info  
    mapping(address => Player) public playerInfo;
    
    function() public payable {}

    // constructor - establish bet amount
    function Winner(uint256 _betAmount) public {
        creator = msg.sender;
        betAmount = _betAmount;
    }
    
    // used to destroy contract
    function kill() public {
        if(msg.sender == creator) selfdestruct(creator);
    }
    
    // checks that the user has not played already
    function checkPlayerExists(address player) public constant returns(bool){
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == player) return true;
        }
        return false;
    }
    
    // To submit time to solve puzzle
    function bet(uint256 solveTime) public payable {
        require(!checkPlayerExists(msg.sender));
        require(solveTime > 0 && solveTime <= maxTime);
        require(msg.value == betAmount);
        playerInfo[msg.sender].amountBet = msg.value;
        playerInfo[msg.sender].solveTime = solveTime;
        numberOfBets++;
        players.push(msg.sender);
        totalBet += msg.value;
    }
   
    // Determines the winner
    function determineFastestTime() public {
        uint256 fastestTime = maxTime;
        for (uint256 i = 0; i < players.length; i++) {
            address playerAddress = players[i];
            if(playerInfo[playerAddress].solveTime < fastestTime){   
                fastestTime = playerInfo[playerAddress].solveTime;   
            }
        }
        distributePrize(fastestTime);
    }
    
    // Sends the ether to the winner depending on the total amount bet
    function distributePrize(uint256 fastestTime) public {
        address winner; // address of winner
        for(uint256 i = 0; i < players.length; i++){
            address playerAddress = players[i];
            if(playerInfo[playerAddress].solveTime == fastestTime){
                winner = playerAddress;
            }
            delete playerInfo[playerAddress]; // Delete all the players
        }
        uint256 winnerEtherAmount = totalBet; // How much the winner gets
        if(winner != address(0)) // Check that the address in this fixed array is not empty
        winner.transfer(winnerEtherAmount);
        resetData();
    }
    
    // Resets variables
    function resetData() public {
        players.length = 0; // Delete all the players array
        totalBet = 0;
        numberOfBets = 0;
    }
}