import chai from 'chai';
import _ from 'lodash';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import Promise from 'bluebird';



global.sinonAsPromised = require('sinon-as-promised')(Promise);
global.should = chai.should();

chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));
chai.use(sinonChai);

// Set globals
global._ = _;
//global.should = should;
global.expect = chai.expect;
global.Promise = Promise;
global.proxyquire = require('proxyquire').noPreserveCache();
global.socketStub = require('./socket.stub');
global.sinon = sinon;

var e = {};
e.ROOTDIR = __dirname + '/../';
e.APPDIR = e.ROOTDIR + 'src/';


export const ROOTDIR = __dirname + '/../';
export const APPDIR = e.ROOTDIR + 'src/';
