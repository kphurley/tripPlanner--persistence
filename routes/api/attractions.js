var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');

router.get('/hotels', function(req, res, next){
   Hotel.findAll()
   .then(function(hotels) {
       res.send(hotels);
   })
   .catch(next);
});

router.get('/restaurants', function(req, res, next){
   Restaurant.findAll()
   .then(function(restaurants) {
       res.send(restaurants);
   })
   .catch(next);
});

router.get('/activities', function(req, res, next){
   Activity.findAll()
   .then(function(activities) {
       res.send(activities);
   })
   .catch(next);
});

module.exports = router;