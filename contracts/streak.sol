// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BuildStreak is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to streak count
    mapping(uint256 => uint256) public streakCount;
    
    // Mapping from user address to token ID
    mapping(address => uint256) public userToTokenId;
    
    // Mapping from token ID to last log day (timestamp)
    mapping(uint256 => uint256) public lastLogDay;
    
    // Events
    event StreakStarted(address indexed user, uint256 tokenId);
    event DayLogged(address indexed user, uint256 tokenId, uint256 newStreakCount);
    
    constructor() ERC721("Build Streak", "STREAK") {}
    
    /**
     * @dev Mint a new streak NFT for the caller
     * @return tokenId The ID of the newly minted token
     */
    function startStreak() public returns (uint256) {
        require(userToTokenId[msg.sender] == 0, "User already has a streak NFT");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        userToTokenId[msg.sender] = newTokenId;
        streakCount[newTokenId] = 0;
        lastLogDay[newTokenId] = 0;
        
        emit StreakStarted(msg.sender, newTokenId);
        
        return newTokenId;
    }
    
    /**
     * @dev Log a day for the caller's streak
     * @return newStreakCount The updated streak count
     */
    function logDay() public returns (uint256) {
        uint256 tokenId = userToTokenId[msg.sender];
        require(tokenId != 0, "User does not have a streak NFT");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of the streak NFT");
        
        uint256 today = block.timestamp / 1 days;
        uint256 lastDay = lastLogDay[tokenId];
        
        // Check if this is a consecutive day
        if (lastDay == 0 || today == lastDay + 1) {
            streakCount[tokenId]++;
        } else if (today > lastDay + 1) {
            // Streak broken, reset to 1
            streakCount[tokenId] = 1;
        }
        // If today == lastDay, do nothing (already logged today)
        
        lastLogDay[tokenId] = today;
        
        emit DayLogged(msg.sender, tokenId, streakCount[tokenId]);
        
        return streakCount[tokenId];
    }
    
    /**
     * @dev Get the streak count for a user
     * @param user The user's address
     * @return The user's streak count
     */
    function getStreak(address user) public view returns (uint256) {
        uint256 tokenId = userToTokenId[user];
        if (tokenId == 0) {
            return 0;
        }
        return streakCount[tokenId];
    }
    
    /**
     * @dev Get the token ID for a user
     * @param user The user's address
     * @return The user's token ID (0 if no streak NFT)
     */
    function getTokenId(address user) public view returns (uint256) {
        return userToTokenId[user];
    }
    
    /**
     * @dev Get the last log day for a user
     * @param user The user's address
     * @return The timestamp of the last log day
     */
    function getLastLogDay(address user) public view returns (uint256) {
        uint256 tokenId = userToTokenId[user];
        if (tokenId == 0) {
            return 0;
        }
        return lastLogDay[tokenId];
    }
    
    /**
     * @dev Override tokenURI to return metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        uint256 streak = streakCount[tokenId];
        string memory json = string(abi.encodePacked(
            '{"name": "Build Streak #', _toString(tokenId), '",',
            '"description": "A streak NFT tracking your daily build progress",',
            '"image": "https://buildstreaks.com/api/nft/', _toString(tokenId), '",',
            '"attributes": [',
            '{"trait_type": "Streak Count", "value": ', _toString(streak), '},',
            '{"trait_type": "Last Log Day", "value": ', _toString(lastLogDay[tokenId]), '}',
            ']}'
        ));
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(bytes(json))
        ));
    }
    
    /**
     * @dev Convert uint256 to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    /**
     * @dev Base64 encode
     */
    function _base64Encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen + 32);
        
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            
            for {
                let i := 0
            } lt(i, mload(data)) {
                i := add(i, 3)
            } {
                let input := and(mload(add(data, add(32, i))), 0xffffff)
                
                let out := mload(add(tablePtr, and(shr(250, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(244, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(238, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(232, input), 0x3F))), 0xFF))
                out := shl(224, out)
                
                mstore(resultPtr, out)
                
                resultPtr := add(resultPtr, 4)
            }
            
            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
        }
        
        return result;
    }
}
