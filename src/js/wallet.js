var truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
var truncateEthAddress = function (address) {
    var match = address.match(truncateRegex);
    if (!match)
        return address;
    return match[1] + "\u2026" + match[2];
};
const LOGIC_ADDRESS = "0x946AD54E639f5d85F49DC1962e91cFA8eadDD74e"
  
App= {
    web3Provider: null,
    web3: null,
    contracts: {},
    account: '0x0',
    accounts: [],
    Price: 0,

    init: function(){
        console.log("App initialized")

        if(window.ethereum){
            //If a web3 instance is already provided by Meta Mask
            App.web3Provider = window.ethereum;
            App.web3 = new Web3(App.web3Provider);
            App.initAccount().then((accounts)=>{
                if(accounts){
                    App.accounts = accounts;
                    console.log("Already connected")
                    // return App.initContract();
                    // return App.initProxyContract();
                }else{
                   // $('#btn-connect').show();
                    console.log("User has to connect first time")
                }
            });
           

        }else{
            //alert("Please use browser with metamask installed");
        }
        
    },

    connect: function(){
        if(window.ethereum){
            //If a web3 instance is already provided by Meta Mask
            App.web3Provider = window.ethereum;
            App.web3 = new Web3(App.web3Provider);
            try{
                    window.ethereum.request({method: "eth_requestAccounts"}).then(function(){
                           App.initAccount().then((accounts)=>{
                            if(accounts){
                                App.accounts = accounts;
                                console.log("user connected")
                                //return App.initContract();
                            }
                           });        
                    });
                } catch(error){
                    console.log("User denied account access")
                }
        }else{
            alert("Please use browser with metamask installed");
        }
     
    },


    initAccount: async function(){
        console.log("Init Accounts")
        let accounts = await App.web3.eth.getCoinbase();
        console.log("accounts "+accounts)
        if(accounts){  
            $('#btn-connect').show(); 
            $('#btn-connect').html(truncateEthAddress(accounts));
            $('#btn-connect').attr("class","btn btn-outline-danger btn-lg");
            return accounts;
        }else{
            return false;
        }
    },


   createProxy: async function(){
       const proxy= await $.getJSON("./js/abi/RootProxy.json");
       const root = await $.getJSON("./js/abi/RootNFT.json");

       const Contract = App.web3.eth.Contract
       App.contracts.proxy = new Contract(proxy.abi);
       App.contracts.proxy.setProvider(App.web3Provider);

       App.contracts.root = new Contract(root.abi);
       App.contracts.root.setProvider(App.web3Provider);

       const name = $('#name').val();
       const symbol = $('#symbol').val();
       const uri = $('#uri').val();
       const calldata = App.contracts.root.methods.initialize(uri,name,symbol).encodeABI();

       const ADMIN_ADDRESS = App.contracts.admin.options.address;
       const options = {
        data: proxy.bytecode,
        arguments: [LOGIC_ADDRESS, ADMIN_ADDRESS , calldata]
       } 
       App.contracts.proxy.deploy(options).send({
        from: App.accounts
       }).then((proxyi)=>{
        App.contracts.proxy = proxyi
        console.log("Proxy Contract deployed at "+proxyi.options.address)
       })
    //    console.log(await App.contracts.clone.detectNetwork())
    //    console.log("clone Contract deployed at ")     
   },

   createAdminProxy: async function(){
       const admin= await $.getJSON("./js/abi/ProxyAdmin.json");
       const Contract = App.web3.eth.Contract
       App.contracts.admin = new Contract(admin.abi);
       App.contracts.admin.setProvider(App.web3Provider);
       const options = {
        data: admin.bytecode
       } 
       App.contracts.admin.deploy(options).send({
        from: App.accounts
       }).then((admini)=>{
        console.log("Admin Contract deployed at "+admini.options.address)
            App.contracts.admin = admini
            return App.createProxy()
       })
   },

   callMethods: async function(){
        const root = await $.getJSON("./js/abi/RootNFT.json");
        const Contract = App.web3.eth.Contract
        const ROOT_PROXY = App.contracts.proxy.options.address
        App.contracts.root = new Contract(root.abi, ROOT_PROXY);
        App.contracts.root.setProvider(App.web3Provider);
        App.contracts.root.methods.owner().call().then(function(owner){
            console.log("Owner of this collection "+owner)
        })
        App.contracts.root.methods.name().call().then((name)=>{
            console.log("Name of this collection "+name)
        })
        App.contracts.root.methods.symbol().call().then((symbol)=>{
            console.log("symbol of this collection "+symbol)
        })
   }

}


$(function(){
    $(window).load(function(){
        App.init();
  		$('#btn-connect').on("click",()=>{
			App.connect();
		})
    })
})
