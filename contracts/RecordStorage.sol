// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract RecordStorage {
    // 宣告變數儲存資料
    struct Record {
        uint id;
        string content;
        address creator;
    }

    mapping(uint => Record) public records;
    uint public nextId;

    // Event: 當資料更新時會觸發，可以在後端監聽
    event RecordUpdated(uint id, string content, address creator);

    // 寫入資料
    function addRecord(string memory _content) public {
        records[nextId] = Record(nextId, _content, msg.sender);
        emit RecordUpdated(nextId, _content, msg.sender);
        nextId++;
    }

    // 回傳struct各欄位
    function getRecord(uint _id) public view returns (uint, string memory, address) {
        Record memory rec = records[_id];
        return (rec.id, rec.content, rec.creator);
    }
}