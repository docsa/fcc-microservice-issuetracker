/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

/* jshint -W117 */ 
/* jshint -W098 */ 
var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var issueId1 ; 
var issueId2 ;
var ObjectId = require('mongodb').ObjectID;
chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.approximately(new Date(res.body.updated_on).getTime(), new Date().getTime(), 300, "Not updated now")
          assert.approximately(new Date(res.body.created_on).getTime(), new Date().getTime(), 300, "Not updated now")
          issueId1=res.body._id;
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required field filled in',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Required field filled in');    
          issueId2=res.body._id;
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
        })
        .end(function(err, res){
          assert.equal(res.status, 500);
          done();
      });
      });
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 500);
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({_id: ObjectId(issueId1), issue_title: 'Modified Title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated "+issueId1, "res.text");
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({_id: ObjectId(issueId1), issue_title: 'Modified Title', issue_text :'Modified Text'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated "+issueId1, "res.text");
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200, "status not equals to 200");
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test?_id='+issueId1)
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200, "status not equals to 200");
          assert.equal(res.body.length,1);
          assert.equal(res.body[0]._id, issueId1);
          done();
        });
      
        
      });
      
     test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test?_id='+issueId1+"&open=true")
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200, "status not equals to 200");
          assert.equal(res.body.length,1);
          assert.equal(res.body[0]._id, issueId1);
          done();
        });
        
      }); 
      
    }); 
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 500);
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: ObjectId(issueId1)})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "deleted "+issueId1);
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: ObjectId(issueId2)})
        .end();
          done();
        })
      });
    });

});
