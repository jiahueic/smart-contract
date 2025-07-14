pragma solidity ^0.5.16;

contract ToDoList {
    uint public taskCount = 0;
    struct Task {
        // unsigned integer, cannot be negative
        uint id;
        string content;
        bool completed;
    }

    // equivalent to hashmap
    mapping(uint => Task) public tasks;
    constructor() public {
        createTask("Check out dappuniversity.com");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
    }
}
