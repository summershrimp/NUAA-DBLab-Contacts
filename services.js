/**
 * Created by Summer on 6/17/16.
 */

var md5 = require("md5");
var Q = require("q");

var services = function(db) {
  this.db = db;
};

services.prototype.initDB = function(purge){
  var db = this.db;
  db.serialize(function() {
    if(purge === true) {
      console.log("Database purging");
      db.exec("DROP TABLE IF EXISTS users;" +
        "DROP TABLE IF EXISTS contacts;" +
        "DROP TABLE IF EXISTS types;" +
        "DROP TABLE IF EXISTS items;", function(err){
        if(!err){
          console.log("Finish cleaning.")
        } else {
          console.log(err.stack);
        }
      });
    }
    db.exec(
      "CREATE TABLE IF NOT EXISTS users ( " +
      "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, " +
      "username VARCHAR NOT NULL," +
      "password VARCHAR NOT NULL);" +
      "CREATE UNIQUE INDEX IF NOT EXISTS UNI_USERNAME on users(username);", function(err){
        if(!err){
          console.log("Table users is fine.")
        } else {
          console.log(err.stack);
        }
      });
    db.exec(
      "CREATE TABLE IF NOT EXISTS contacts ( " +
      "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
      "user_id INTEGER NOT NULL," +
      "first_name VARCHAR," +
      "last_name VARCHAR," +
      "nick_name VARCHAR," +
      "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE);", function(err){
        if(!err){
          console.log("Table contacts is fine.")
        } else {
          console.log(err.stack);
        }
      });
    db.exec(
      "CREATE TABLE IF NOT EXISTS types (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
      "type_name VARCHAR NOT NULL);", function(err){
        if(!err){
          console.log("Table types is fine.")
        } else {
          console.log(err.stack);
        }
      });
    db.exec(
      "CREATE TABLE IF NOT EXISTS  items (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
      "contact_id INTEGER," +
      "type_id INTEGER," +
      "value VARCHAR," +
      "FOREIGN KEY(contact_id) REFERENCES contacts (id) ON DELETE CASCADE ON UPDATE CASCADE," +
      "FOREIGN KEY(type_id) REFERENCES types (id) ON DELETE SET NULL ON UPDATE CASCADE);", function(err){
        if(!err){
          console.log("Table items is fine.")
        } else {
          console.log(err.stack);
        }
      });
    if(purge === true){
      db.exec("INSERT INTO types (type_name) VALUES " +
        "('手机')," +
        "('固定电话')," +
        "('办公电话')," +
        "('电子邮件')," +
        "('QQ')", function(err){
        if(!err){
          console.log(this.changes + " table items' data is added.")
        } else {
          console.log(err.stack);
        }
      });
      db.exec("INSERT INTO users (username, password) VALUES " +
        "('xm1994', '"+md5("haha")+"')", function(err){
        if(!err){
          console.log(this.changes + " table users' data is added.")
        } else {
          console.log(err.stack);
        }
      });
      db.exec("INSERT INTO contacts (first_name, last_name, user_id) VALUES " +
        "('Test First', 'Test Last', 1);" +
        "Insert Into items (contact_id, type_id, value) VALUES " +
        "(1, 1, '123123123')," +
        "(1, 2, '123123123123123')," +
        "(1, 3, '12313123123')", function(err){
        if(!err){
          console.log(this.changes + " table contacts' data is added.")
        } else {
          console.log(err.stack);
        }
      });
    }
  });
};

services.prototype.checkLogin = function(username, password) {
  var deferred = Q.defer();
  var db = this.db;

  if(!username || !password) {
    deferred.reject(new Error("No username Or password"));
    return deferred.promise;
  }

  db.serialize(function() {
    var stmt = db.prepare("SELECT * FROM users WHERE username = ? ");
    stmt.get(username, function(err, result){
      if(err) {
        return deferred.reject(err);
      } else if(result && result.password) {
        check = md5(password);
        if(check === result.password) {
          delete result.password;
          return deferred.resolve(result);
        } else {
          return deferred.resolve(false);
        }
      } else {
        return deferred.resolve(false);
      }
    });
    stmt.finalize();
  });
  return deferred.promise;
};

services.prototype.getTypes = function(){
  var deferred = Q.defer();
  var db = this.db;

  db.serialize(function() {
    var stmt = db.prepare("SELECT * FROM types");
    stmt.all(function(err, result){
      if(err){
        return deferred.reject(err);
      }
      deferred.resolve(result);
    })
  });

  return deferred.promise;
};

services.prototype.getContact = function(userId, contactId) {
  var deferred = Q.defer();
  var db = this.db;

  if(!userId || !contactId) {
    deferred.reject(new Error("No userId Or contactId"));
    return deferred.promise;
  }

  db.serialize(function() {
    var stmt = db.prepare("SELECT * FROM contacts WHERE user_id = ? AND id = ? ");
    stmt.get(userId, contactId, function(err, result) {
      if(err) {
        return deferred.reject(err);
      } else {
        return deferred.resolve(result);
      }
    });
    stmt.finalize();
  });
  return deferred.promise;
};

services.prototype.getAllContact = function(userId) {
  var deferred = Q.defer();
  var db = this.db;

  if(!userId) {
    deferred.reject(new Error("No userId"));
    return deferred.promise;
  }

  db.serialize(function() {
    var stmt = db.prepare("SELECT * FROM contacts WHERE user_id = ?");
    stmt.all(userId, function(err, result) {
      if(err) {
        return deferred.reject(err);
      } else {
        return deferred.resolve(result);
      }
    });
    stmt.finalize();
  });
  return deferred.promise;
};

services.prototype.getItem = function(contactId, itemId) {
  var deferred = Q.defer();
  var db = this.db;

  if(!contactId || !itemId) {
    deferred.reject(new Error("No userId Or contactId"));
    return deferred.promise;
  }

  db.serialize(function() {
    var stmt = db.prepare("SELECT * FROM items WHERE contact_id = ? AND id = ? ");
    stmt.get(contactId, itemId, function(err, result) {
      if(err) {
        return deferred.reject(err);
      } else {
        return deferred.resolve(result);
      }
    });
    stmt.finalize();
  });
  return deferred.promise;
};

services.prototype.getFullContact = function(userId, contactId) {
  var deferred = Q.defer();
  var db = this.db;

  if(!userId || !contactId) {
    deferred.reject(new Error("No userId Or contactId"));
    return deferred.promise;
  }
  var ret = {};
  var stmt = db.prepare("SELECT * FROM contacts WHERE user_id = ? AND id = ? ");
  stmt.get(userId, contactId, function(err, result) {
    if(err) {
      return deferred.reject(err);
    } else if(result && result.id) {
      ret = result;
      var stmt = db.prepare("SELECT items.*, types.type_name FROM items " +
        "LEFT JOIN types ON types.id = items.type_id " +
        "WHERE items.contact_id = ? ");
      return stmt.all(contactId, function(err, result){
        if(err) {
          return deferred.reject(err);
        } else {
          ret.items = result;
          deferred.resolve(ret);
        }
      })
    } else {
      return deferred.resolve(result)
    }
  });
  stmt.finalize();
  return deferred.promise;
};

services.prototype.search = function(userId, keyword) {
  var deferred = Q.defer();
  var db = this.db;
  keyword = "%" + keyword + "%";
  db.serialize(function(){
    var stmt = db.prepare("SELECT contacts.*, types.type_name, items.value From contacts " +
      "LEFT JOIN items ON items.contact_id = contacts.id " +
      "LEFT JOIN types ON items.type_id = types.id WHERE contacts.user_id = ? AND " +
      "(items.value LIKE ? OR contacts.first_name LIKE ? OR contacts.last_name LIKE ? OR contacts.nick_name LIKE ?) ");
    stmt.all(userId, keyword, keyword, keyword, keyword, function(err, result){
      if(err){
        deferred.reject(err);
      } else {
        deferred.resolve(result);
      }
    })
  });

  return deferred.promise;
};

services.prototype.newUser = function(username, password){
  var deferred = Q.defer();
  var db = this.db;

  if(!username || !password) {
    deferred.reject(new Error("No username Or password"));
    return deferred.promise;
  }

  db.serialize(function(){
    var stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    password = md5(password);
    stmt.run(username, password, function(err) {
      if(err){
        return deferred.reject(err);
      } else if (this.changes > 0){
        return deferred.resolve(true);
      } else {
        return deferred.resolve(false);
      }
    });
    stmt.finalize();
  });
  return deferred.promise;
};

services.prototype.newContact = function(userId, data){
  var deferred = Q.defer();
  var db = this.db;

  if (!data.first_name && !data.last_name && !data.nick_name){
    deferred.reject(new Error("Null Contacts"));
    return deferred.promise
  }

  db.serialize(function(){
    var stmt = db.prepare("INSERT INTO contacts (user_id, first_name, last_name, nick_name) VALUES (?, ?, ?, ?)");
    stmt.run(userId, data.first_name, data.last_name, data.nick_name, function(err) {
      if(err){
        return deferred.reject(err);
      } else if (this.changes > 0){
        return deferred.resolve(true);
      } else {
        return deferred.resolve(false);
      }
    });
    stmt.finalize();
  });
  return deferred.promise;
};

services.prototype.newItem = function(contactId, typeId, value){
  var deferred = Q.defer();
  var db = this.db;

  if (!contactId && !typeId && !value){
    deferred.reject(new Error("Null Contacts"));
    return deferred.promise
  }

  db.serialize(function(){
    var stmt = db.prepare("INSERT INTO items (contact_id, type_id, value) VALUES (?, ?, ?)");
    stmt.run(contactId, typeId, value, function(err) {
      if(err){
        return deferred.reject(err);
      } else if (this.changes > 0){
        return deferred.resolve(true);
      } else {
        return deferred.resolve(false);
      }
    });
    stmt.finalize();
  });
  return deferred.promise;
};

services.prototype.delContact = function(userId, contactId){
  var deferred = Q.defer();
  var db = this.db;

  if (!userId || !contactId){
    deferred.reject(new Error("Null Contacts"));
    return deferred.promise
  }

  db.serialize(function(){
    var stmt = db.prepare("DELETE FROM contacts WHERE user_id = ? AND id = ?");
    stmt.run(userId, contactId, function(err) {
      if(err){
        return deferred.reject(err);
      } else if (this.changes > 0){
        return deferred.resolve(true);
      } else {
        return deferred.resolve(false);
      }
    });
    stmt.finalize();
  });
  return deferred.promise;
};


services.prototype.autoUpdateContact = function(userId, contact){
  var deferred = Q.defer();
  var db = this.db;

  if (!userId || !contact){
    deferred.reject(new Error("Null Contact"));
    return deferred.promise
  }

  if (!contact.first_name && !contact.last_name && !contact.nick_name){
    deferred.reject(new Error("Null Contacts"));
    return deferred.promise
  }
  var errs = [];

  var insertContact = function(){
    var inner_promise = Q.defer();
    db.serialize(function(){
      if(!contact.id) {
        var stmt = db.prepare("INSERT INTO contacts (first_name, last_name, nick_name, user_id) VALUES (?, ?, ?, ?)");
        stmt.run(contact.first_name, contact.last_name, contact.nick_name, userId, function(err){
          if(err){
            return inner_promise.reject(err);
          }
          if(this.changes > 0) {
            contact.id = this.lastID;
            return inner_promise.resolve(true);
          } else {
            return inner_promise.reject(new Error("Insert Failed"));
          }
        });
        stmt.finalize();
      } else {
        var stmt2 = db.prepare("UPDATE contacts SET first_name = ?, last_name = ?, nick_name = ? WHERE id = ? AND user_id = ? ");
        stmt2.run(contact.first_name, contact.last_name, contact.nick_name, contact.id, userId, function(err){
          if(err){
            return inner_promise.reject(err);
          }
          if(this.changes > 0) {
            return inner_promise.resolve(true);
          } else {
            return inner_promise.reject(new Error("Update Failed"));
          }
        });
        stmt2.finalize();
      }
    });
    return inner_promise.promise;
  };

  var insertItem = function(contact_id, item) {
    var inner_promise = Q.defer();
    db.serialize(function() {
      if (item.id) {
        var inner_stmt = db.prepare("UPDATE items SET type_id = ? AND value = ? WHERE contact_id = ? AND id = ?");
        inner_stmt.run(item.type_id, item.value, contact_id, item.id, function (err) {
          if (err) {
            return inner_promise.reject(err);
          }
          inner_promise.resolve(this.lastID);
        });
        inner_stmt.finalize();
      } else {
        var inner_stmt2 = db.prepare("INSERT INTO items (contact_id, type_id, value) VALUES (?, ?, ?)");
        inner_stmt2.run(contact_id, item.type_id, item.value, function (err) {
          if (err) {
            return inner_promise.reject(err);
          }
          inner_promise.resolve(this.lastID);
        });
        inner_stmt2.finalize();
      }
    });
    return inner_promise.promise;
  };

  return insertContact().then(function(lastId){
    var tasks = [];
    for (var i in contact.items) {
      tasks.push(insertItem(contact.id, contact.items[i]));
    }
    return Q.all(tasks);
  });
};

module.exports = services;