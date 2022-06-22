var truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
var truncateEthAddress = function (address) {
    var match = address.match(truncateRegex);
    if (!match)
        return address;
    return match[1] + "\u2026" + match[2];
};
const CLONE_ADDRESS = "0x382e598adfD12696b4f61e0B29d1Ce808B0B1Fb4"
  
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
                    return App.initContract();
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

   initContract: async function(){
       const clone= await $.getJSON("./js/RootFactoryclone.json");
       const Contract = App.web3.eth.Contract
       App.contracts.clone = new Contract(clone.abi,CLONE_ADDRESS);
       App.contracts.clone.setProvider(App.web3Provider);  
    //    console.log(await App.contracts.clone.detectNetwork())
       console.log("clone Contract initialized at ")     
   },

   createClone: async function(){
        let name = $('#name').val()
        let symbol = $('#symbol').val()
        let result = await App.contracts.clone.methods.createClone("sample.uri",name,symbol).send({from: App.accounts})
        console.log(result)
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
