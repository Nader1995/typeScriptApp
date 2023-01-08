// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NaderToken is ERC20, Ownable{
    constructor(uint256 totalSupply) ERC20("NaderToken", "Cloud"){
        _mint(msg.sender, totalSupply);
    }
}