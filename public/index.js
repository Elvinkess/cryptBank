let ws = new WebSocket("wss://stream.binance.com:9443/ws/ethusdt@trade");
let ethPrice = document.getElementById("eth_price");
let last_EthPrice = null;

let ws_btc = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
let btcPrice = document.getElementById("btc_price");
let last_BtcPrice = null;




ws.onmessage = (event) =>{
    let ethPrice_Object = JSON.parse(event.data);
    let Eth_price = parseFloat(ethPrice_Object.p).toFixed(2);
    let price = Eth_price;
    ethPrice.innerText = ("$" + price );
    ethPrice.style.color = !last_EthPrice || last_EthPrice === Eth_price ? "black" : price >last_EthPrice ? "green" : "red";
    last_EthPrice = price;
};

ws_btc.onmessage = (event) =>{
    let btcPrice_Object = JSON.parse(event.data);
    let Btc_price = parseFloat(btcPrice_Object.p).toFixed(2);
    let Btcprice = Btc_price;
    btcPrice.innerText = ("$" + Btcprice );
    btcPrice.style.color = !last_BtcPrice || last_BtcPrice === Btc_price ? "black" : Btcprice >last_BtcPrice ? "green" : "red";
    last_BtcPrice = Btcprice;
};
