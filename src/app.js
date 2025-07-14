App = {
  loading: false,
  web3Provider: null,
  account: null,
  contracts: {},

  load: async () => {
    console.log("Loading app...");
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("MetaMask connected.");
      } catch (error) {
        console.error("User denied account access", error);
        alert("Please allow MetaMask connection to use the app.");
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
      window.web3 = new Web3(window.web3.currentProvider);
      console.log("Legacy dapp browser detected.");
    } else {
      alert("Non-Ethereum browser detected. Please install MetaMask!");
    }
  },

  loadAccount: async () => {
    const accounts = await window.web3.eth.getAccounts();
    App.account = accounts[0];
    console.log("Connected account:", App.account);
  },

  loadContract: async () => {
    const todolist = await $.getJSON("ToDoList.json");
    App.contracts.ToDoList = TruffleContract(todolist);
    App.contracts.ToDoList.setProvider(App.web3Provider);
    App.todolist = await App.contracts.ToDoList.deployed();
    console.log("Contract loaded:", App.todolist.address);
  },

  render: async () => {
    if (App.loading) return;
    App.setLoading(true);

    $("#account").html(App.account);
    await App.renderTasks();

    App.setLoading(false);
  },

  renderTasks: async () => {
    const taskCount = await App.todolist.taskCount();
    console.log("Total tasks:", taskCount.toString());

    const $taskTemplate = $(".taskTemplate");

    // Clear existing tasks
    $("#taskList").html("");
    $("#completedTaskList").html("");

    for (var i = 1; i <= taskCount; i++) {
      const task = await App.todolist.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      console.log(
        `Task #${taskId}: ${taskContent}, completed: ${taskCompleted}`
      );

      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted)
        .on("click", App.toggleCompleted);

      $newTaskTemplate.show();

      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }
    }
  },

  createTask: async () => {
    App.setLoading(true);
    const content = $("#newTask").val().trim();
    if (!content) {
      alert("Please enter a valid task.");
      App.setLoading(false);
      return;
    }

    console.log("Creating task:", content);

    try {
      const result = await App.todolist.createTask(content, {
        from: App.account,
      });
      console.log("Transaction result:", result);
      $("#newTask").val(""); // clear input

      // Force reload to reflect new task immediately
      window.location.reload();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Transaction failed. Check console for details.");
      App.setLoading(false);
    }
  },

  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    console.log("Toggling task:", taskId);

    try {
      const result = await App.todolist.toggleCompleted(taskId, {
        from: App.account,
      });
      console.log("Transaction result:", result);

      // Force reload to reflect toggled status immediately
      window.location.reload();
    } catch (error) {
      console.error("Error toggling task:", error);
      alert("Transaction failed. Check console for details.");
      App.setLoading(false);
    }
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    if (boolean) {
      $("#loader").show();
      $("#content").hide();
    } else {
      $("#loader").hide();
      $("#content").show();
    }
  },
};

// Bootstrap the app on load
$(() => {
  App.load();
});
