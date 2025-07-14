App = {
  loading: false,
  web3Provider: null,
  account: null,
  contracts: {},
  load: async () => {
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
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access", error);
      }
    } else if (window.web3) {
      // Legacy dapp browsers
      App.web3Provider = window.web3.currentProvider;
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected. Please install MetaMask!");
    }
  },

  loadAccount: async () => {
    const accounts = await window.web3.eth.getAccounts();
    App.account = accounts[0];
    console.log("Connected account:", App.account);
  },
  loadContract: async () => {
    // build/contracts exposed as root of project in bs-config.json
    const todolist = await $.getJSON("ToDoList.json");
    App.contracts.ToDoList = TruffleContract(todolist);
    App.contracts.ToDoList.setProvider(App.web3Provider);
    App.todolist = await App.contracts.ToDoList.deployed();
  },
  render: async () => {
    if (App.loading) {
      return;
    }

    App.setLoading(true);
    $("#account").html(App.account);
    await App.renderTasks();
    App.setLoading(false);
  },
  renderTasks: async () => {
    // Load the total task acount from the blockchain
    const taskCount = await App.todolist.taskCount();
    const $taskTemplate = $(".taskTemplate");
    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      const task = await App.todolist.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      console.log("taskContent: ", taskContent);
      const taskCompleted = task[2];

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted);
      // .on("click", App.toggleCompleted);

      // Put the task in the correct list
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }
      // Show the task
      $newTaskTemplate.show();
    }
  },
  createTask: async () => {
    App.setLoading(true);
    const content = $("#newTask").val();
    await App.todolist.createTask(content, { from: App.account });
    window.location.reload();
  },
  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};

// Bootstrap the app on load
$(() => {
  App.load();
});
