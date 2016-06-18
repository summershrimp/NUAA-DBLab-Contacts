/**
 * Created by Summer on 6/14/16.
 */

var config = module.exports;

config.db = {
  path: "contants.db"
};

config.session = {
  secret: 'LovelyCat',
  resave: false,
  saveUninitialized: true
};