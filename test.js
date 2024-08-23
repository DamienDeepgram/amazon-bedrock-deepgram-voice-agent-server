const chai = require('chai');
const chaiHttp = require('chai-http');
const { should } = chai;

const { server } = require('./index.js');
const { v4: uuidv4 } = require('uuid');

should();
chai.use(chaiHttp);

describe('API Tests', function() {
  let callId;
  const newItem = {
    name: 'Meeting',
    description: '10:00am 11/11/2024',
  };

  before(async function() {
    // Start the server before running tests
    if (!server.listening) {
      await new Promise(resolve => server.listen(3001, resolve));
    }
  });

  after(async function() {
    // Close the server after running tests
    if (server.listening) {
      await new Promise(resolve => server.close(resolve));
    }
  });

  describe('POST /calls', () => {
    it('it should CREATE a call', (done) => {
      chai.request(server)
        .post('/calls')
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('string');
          callId = res.text;
          console.log('callId:', callId);
          done();
        });
    });
  });

  describe('GET /calls/:id', () => {
    it('it should GET a call by id', (done) => {
      chai.request(server)
        .get(`/calls/${callId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eql(callId);
          done();
        });
    });
  });

  describe('GET /calls/:id/events', () => {
    it('it should GET events by call id', (done) => {
      chai.request(server)
        .get(`/calls/${callId}/events`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('POST /calls/:id/events/items', () => {
    it('it should ADD an item to an event', (done) => {
      chai.request(server)
        .post(`/calls/${callId}/events/items`)
        .send({ item: newItem })
        .end((err, res) => {
          res.should.have.status(200);
          console.log
          res.text.should.equal('We were able to successfully add the item to the events!');
          done();
        });
    });
  });

});
