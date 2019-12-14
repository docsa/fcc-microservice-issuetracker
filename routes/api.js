/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
/* jshint -W098 */
var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
var db;

MongoClient.connect(process.env.DB, (err, data) => {
    if(err) console.log('Database error: ' + err);
    db=data
    console.log("Database connected")
});  

module.exports = function (app) {
  

  
    app.route('/api/issues/:project')

    

      .get(function (req, res, next){

        var project = req.params.project;
        let query={"project": project}
        if (req.query.open) {
          query.open= (req.query.open=="true");
        }
        if (req.query.issue_title) {
          query.issue_title= req.query.issue_title;
        }
        if (req.query.issue_text) {
          query.issue_text= req.query.issue_text;
        }
        if (req.query.created_by) {
          query.created_by= req.query.created_by;
        }
        if (req.query.assigned_to) {
          query.assigned_to= req.query.assigned_to;
        }
        if (req.query.status_text) {
          query.status_text= req.query.status_text;
        }
        if (req.query._id) {
          query._id= ObjectId(req.query._id);
        }


        db.collection("issues").find(query).toArray((err, data) =>{
          if (err) {
            return next(err)
          } else {
            return res.json(data)
          }
        })
         
    })
      
      .post(function (req, res,next) { 
        var project = req.params.project;
      
          let issueTitle = req.body.issue_title;
          if(!issueTitle) {
            return next(new Error("missing issue_title"));
          }
          let issueText = req.body.issue_text;
          if(!issueText) {
            return next(new Error("missing issue_text"));
          }
          let createdBy = req.body.created_by;
          if(!createdBy) {
            return next(new Error("missing created_by"));
          }
          let assignedTo=req.body.assigned_to ? req.body.assigned_to : "";
          let statusText=req.body.status_text ? req.body.status_text : "";
          let issue = {
            "project"   : project,
            "issue_title": issueTitle,
            "issue_text" : issueText,
            "created_by" : createdBy,
            "assigned_to": assignedTo,
            "status_text": statusText,
            "open"      : true ,
            "created_on": new Date(),
            "updated_on": new Date()
          }

          db.collection('issues').insertOne(issue, (err, data) => {
            if(err) {
              return next(err);
            } else 
              issue._id=data.insertedId;
              return res.json(issue);
          });
        })


      .put(function (req, res, next){
        var project = req.params.project;

      
          let _id = req.body._id;
          if(!_id) {
            return next(new Error("missing _id"));
          }
          let issue = {
            "updated_on": new Date()
          }
          if(req.body.issue_title) {
            issue.issue_title=req.body.issue_title;
          }
      
          if(req.body.issue_text) {
            issue.issue_text=req.body.issue_text;
          }
      
          if(req.body.created_by) {
            issue.created_by=req.body.created_by;
          }

          if(req.body.assigned_to) {
            issue.assigned_to=req.body.assigned_to;
          }
          if(req.body.status_text) {
            issue.status_text=req.body.status_text;
          }
          if(req.body.open) {
            console.log(req.body.open);
            issue.open=req.body.open==true;
          }

          if(Object.keys(issue).length===1) {
            return res.send("no updated field sent")
          }

          db.collection('issues').updateOne({"_id": ObjectId(_id)}, {$set: issue}, (err, data) => {
            if(err) {
              return res.send("could not update "+_id);
            } else 
              return res.send("successfully updated "+_id);
          });
        })


      .delete(function (req, res){
        var project = req.params.project;
        let _id = req.body._id;
        if(!_id) {
          return next(new Error("missing _id"));
        }
        
        db.collection('issues').deleteOne({"_id": ObjectId(_id)}, (err, data) => {
          if(err) {
            return res.send("could not delete "+_id);
          } else 
            return res.send("deleted "+_id);
        });
      });

    
};
