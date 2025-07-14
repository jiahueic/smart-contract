Pre-requisites

1. Install Ganache

```sh
https://archive.trufflesuite.com/ganache/
```

2. Get metamask google extension

```sh
https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en
```

3. Install Truffle framework

```sh
npm install -g truffle
```

4. Create project directory

```sh
mkdir eth-todo-list
cd eth-todo-list
truffle init
```

5. Copy contents of package.json and run:

```sh
npm install
```

6. Create first Solidity script in /contracts directory and run:

```sh
truffle compile
```

7. Create deploy_contracts.js which deploys ToDoList.sol on blockchain and run:

```sh
truffle migrate
```

8. After deploying onto blockchain, can use the following commands to explore:

```sh
truffle console
todolist = await ToDoList.deployed()
todolist.address
taskcount = await todolist.taskCount()
taskcount.toNumber()
```

9. Deploy a new copy of a smart contract if there is alrd an existing one:

```sh
truffle migrate --reset
```

Console commands:

```sh
 task = await todolist.tasks(1)
 task.content
```

10. Start frontend server

```sh
npm run dev
```

11. Create Ganache network in Metamask and import the wallet

```sh
https://support.metamask.io/configure/networks/how-to-add-a-custom-network-rpc/
https://support.metamask.io/start/how-to-import-an-account/
```

12. Running test scripts in Mocha

```sh
truffle test
```
