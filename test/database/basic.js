/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions, no-confusing-arrow, no-underscore-dangle */

// ==================== SETUP ==========================
const expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const common = require('../common.js');
const mongoUri = common.mongo.uri;
const User = common.models.User;

const compare = require('../modelComparator.js');

// ==================== TEST DATA ==========================

const initialUser = new User({
  name: 'Initial User',
  secret: 'password',
  admin: false,
});
const updates = {
  name: 'Updated User',
  secret: 'password',
  admin: false,
};

// ==================== TESTS ==========================

describe('Database', () => {
  describe('Standalone', () => {

    // Connect to db if not connected
    before(done => mongoose.connect(mongoUri, { useMongoClient: true }, done()));

    // Create Initial User
    it('Create', (done) => {
      initialUser.save(done);
    });

    // Retrieve Initial User
    it('Retrieve', (done) => {
      User.findOne({ name: 'Initial User' }, (error, foundUser) => {
        compare(foundUser, initialUser, true);
        done();
      });
    });

    // Update Initial User to Updated User
    it('Update', (done) => {
      User.updateOne({ name: 'Initial User' }, updates, () => {
        User.findOne({ name: 'Updated User' }, (err1, foundUser) => {
          compare(foundUser, new User(updates), false);
          User.findOne({ name: 'Initial User' }, (err2, notFoundUser) => {
            expect(notFoundUser).to.be.null;
            done();
          });
        });
      });
    });

    it('Delete', (done) => {
      User.deleteOne({ name: 'Updated User' }, () => {
        User.findOne({ name: 'Updated User' }, (error, notFoundUser) => {
          expect(notFoundUser).to.be.null;
          done(error);
        });
      });
    });

    // Clear the collection
    after(done => User.delete({}, done()));
  });
});
