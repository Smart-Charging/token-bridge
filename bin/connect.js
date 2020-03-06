/*
    Copyright 2020 Nordic Energy / Smart Charging Solutions

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
var AWS = require('aws-sdk')

var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  fs = require('fs')

async function getPem() {
  const s3 = new AWS.S3()
  const params = {
    Bucket: 'elasticbeanstalk-eu-central-1-429579106919',
    Key: 'rds-combined-ca-bundle.pem'
  };

  const response = await s3.getObject(params).promise()

  // @ts-ignore
  return response.Body.toString()
}

function getDb(client) {
  return client.connect().then(cli => cli.db('atomic-swap'))
}

async function run() {

//Specify the Amazon DocumentDB cert
  var ca = [await getPem()]

//Create a MongoDB client, open a connection to Amazon DocumentDB as a replica set,
//  and specify the read preference as secondary preferred
  var client = new MongoClient(
    'mongodb://sncadmin:920O44UNwwskqRT1cOo@docdb-2019-04-17-21-09-44.cgxqogob9wqy.eu-central-1.docdb.amazonaws.com:27017/snc-test?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred',
    {
      sslValidate: true,
      sslCA: ca,
      useNewUrlParser: true
    })

  console.log('isConnected', client.isConnected())
  const db = await getDb(client)
  console.log('isConnected', client.isConnected())
  console.log(await db.collection('chains').findOne({
    name: 'mainnet-xchf'
  }))
}

run()
  .then(() => {
    console.log('done')
    process.exit()
  })
  .catch((e) => console.log('error', e.toString()))
/*
function(err, client) {
    if(err)
        throw err;

    //Specify the database to be used
    db = client.db('snc-test');

    //Specify the collection to be used
    col = db.collection('test-collection');

    //Insert a single document
    col.insertOne({'hello':'Amazon DocumentDB'}, function(err, result){
      //Find the document that was previously written
      col.findOne({'hello':'Amazon DocumentDB'}, function(err, result){
        //Print the result to the screen
        console.log(result);

        //Close the connection
        client.close()
        console.log('inserted a document');
      });
   });
});*/
