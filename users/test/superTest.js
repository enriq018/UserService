const supertest = require('supertest');
var expect = require('chai').expect;

describe('POST /userRecentSearch', function() {
  it('responds with a users recent search history (array)', function(done) {
    supertest('http://localhost:3000')
      .post('/userRecentSearch')
      .send({userId: 25})
      .expect(201)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        // console.log('-------------------', Array.isArray(res.body))
        expect(res.body).to.not.equal(null);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});

describe('POST /addUser', function() {
  it('responds with added users user id', function(done) {
    supertest('http://localhost:3000')
      .post('/addUser')
      .send({})
      .expect(201)
      .end((err, res) => {
        if (err) { 
          throw err;
        }
        // console.log('-------------------', Array.isArray(res.body))
        console.log('!!!!!!!!!!!!!!!!', res.body.userId);
        expect(res.body.userId).to.not.equal(null);
        expect(res.body.userId).to.be.a('string');


        done();
      });
  });
});

describe('POST /updateSearchHistory', function() {
  it( 'updates users search history', function(done) {
    supertest('http://localhost:3000')
      .post('/updateSearchHistory')
      .send({})
      .expect(201)
      .end((err, res) => {
        if (err) { 
          throw err;
        }
        // console.log('-------------------', Array.isArray(res.body))
        expect(res.body).to.not.equal(null);
        done();
      });
  });
});

