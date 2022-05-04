const express = require('express');
const redis = require('redis');

var grpc = require("@grpc/grpc-js");
var protoLoader  = require("@grpc/proto-loader");



//////////////////////// gRPC
var PROTO_PATH = "./setup.proto";

var options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    arrays: true
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
var searchPckg = grpc.loadPackageDefinition(packageDefinition);
var searchitem = searchPckg.searchPackage;
var client = new searchitem.SearchItem("server:50051", grpc.credentials.createInsecure());






//REDIS CONNECTION
const redisClient = redis.createClient({ url: 'redis://redis-server:6379'});
redisClient.on('error', (err) => {
    console.log('An error ocurred', err);
});
redisClient.on('connect', (err) => {
    console.log('Redis connection succesfull');
});
redisClient.connect();



const port = 3000;

const app = express();
const router = express.Router();

app.use(express.json());



//gRPC 
app.get('/inventory/search', async(req, res) =>{
    var term = { term: req.query.q };
    console.log(term);
    var reply = await redisClient.get(term.term);
    console.log(reply);
    if(reply){
        console.log("Cache");
        res.send(reply);
    }else{
        console.log(term);
        //var cosas = searchGet(term);
        client.getSearch(term, async (err, list) =>  {
            if (err) {
                console.log('Error al enviar/recibir rpc');
            } else {
                console.log(term.term);
                var cosas = JSON.stringify(list.listEl);
                console.log(cosas);
                res.send(cosas);
                await redisClient.setEx(term.term, 600, cosas)
            }    
        });
        
    }
});



app.listen(port, () =>{
    console.log('Server running on port', port);
}); 
