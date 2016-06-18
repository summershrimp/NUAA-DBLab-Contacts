var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  if(req.session.user){
    res.send(req.session.user);
  } else {
    res.status(403).send({});
  }
});

router.post('/login', function(req, res, next) {
  var srv = req.srv;
  srv.checkLogin(req.body.username, req.body.password)
     .then(function(result){
       if(result) {
         req.session.user = result;
         return res.send(result);
       } else {
         res.status(401).send({});
       }
     }).catch(function(err){
      res.next(err);
  })
});

router.delete('/login', function(req, res, next) {
  if(req.session) {
    req.session.destroy();
  }
  res.send({});
});

router.get('/types', function(req, res, next) {
  var srv = req.srv;
  srv.getTypes().then(function(result){
    res.send({data:result});
  }).catch(function(err){
    next(err);
  })
});

router.post('/register', function(req, res, next) {
  var srv = req.srv;
  srv.newUser(req.body.username, req.body.password).then(function(result){
    if(result){
      res.send({});
    } else {
      next(new Error("Cannot register"));
    }
  }).catch(function(err){
    next(err);
  });
});

router.get('/contacts', function(req, res, next) {
  if(!req.session.user) {
    return res.status(401).send({});
  }
  var srv = req.srv;
  srv.getAllContact(req.session.user.id).then(function(result){
      res.send({data: result});
  }).catch(function(err){
    next(err);
  });
});

router.delete('/contact/:contact_id', function(req, res, next) {
  if(!req.session.user) {
    return res.status(401).send({});
  }
  var srv = req.srv;
  srv.delContact(req.session.user.id, req.params.contact_id).then(function(result){
    res.send({data: result});
  }).catch(function(err){
    next(err);
  });
});

router.get('/contact/:contact_id', function(req, res, next) {
  if(!req.session.user) {
    return res.status(401).send({});
  }
  var srv = req.srv;
  srv.getFullContact(req.session.user.id, req.params.contact_id).then(function(result){
    res.send({data: result});
  }).catch(function(err){
    next(err);
  });
});

router.post('/contact', function(req, res, next) {
  if(!req.session.user) {
    return res.status(401).send({});
  }
  var srv = req.srv;
  srv.autoUpdateContact(req.session.user.id, req.body).then(function(result){
    res.send({data:result});
  }).catch(function(err){
    res.status(500).send({data:err});
  });
});

router.post('/search', function(req, res, next) {
  if(!req.session.user) {
    return res.status(401).send({});
  }
  if(!req.body.keyword) {
    return res.send({data:[]});
  }
  var srv = req.srv;
  srv.search(req.session.user.id, req.body.keyword).then(function(result){
    res.send({data:result});
  }).catch(function(err){
    next(err);
  });
});

module.exports = router;
