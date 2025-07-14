const ToDoList = artifacts.require("ToDoList");

contract("ToDoList", (accounts) => {
  let todolist;

  before(async () => {
    todolist = await ToDoList.deployed();
  });

  it("deploys successfully", async () => {
    const address = todolist.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });
  it("list tasks", async () => {
    const taskCount = await todolist.taskCount();
    const task = await todolist.tasks(taskCount);
    assert.equal(task.id.toNumber(), taskCount.toNumber());
    assert.equal(task.content, "Check out dappuniversity.com");
    assert.equal(task.completed, false);
    assert.equal(taskCount.toNumber(), 1);
  });
});
