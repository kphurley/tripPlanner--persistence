var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Day = require('../../models/day');

router.get('/days', function(req, res, next){
    var theWhereObject = {};
    if(req.query.dayNumber){
        theWhereObject = {number: req.query.dayNumber}
    }
    Day.findAll({
       where: theWhereObject,
       include: [
           {model: Hotel},
           {model: Restaurant},
           {model: Activity}
       ]
   })
   .then(function(days) {
       res.send(days);
   })
   .catch(next);
});

router.post('/days', function(req, res, next){
   
    Day.findAll()
    .then(function(days){
        return Day.create({
            number: days.length + 1
        });
    })
   .then(function(createdDay) {
       res.send(createdDay);
   })
   .catch(next);
});

router.delete('/days', function(req, res, next) {
    var dayNumber = req.body.dayNumber;
    Day.findOne({
        where: {
            number: dayNumber
        }
    })
    .then(function(day){
        return day.destroy();
    })
    .then(function() {
        return Day.findAll({
            where:{
                number: 
                    {$gt: dayNumber}
            }
        })
    })
    .then(function(daysGreaterThanDayNumber){
        var promisesArray = [];
        daysGreaterThanDayNumber.forEach(function(day){
            day.number--;
            promisesArray.push(day.save());
        });
        return Promise.all(promisesArray);
    })
    .then(function(resolutionOfThosePromises){
        return Day.findAll();
    })
    .then(function(days){
        res.send(days);
    })
    
})

router.put('/days', function(req, res, next){
    var promise;
    
    /*
    var things = {
        hotel: {model: Hotel, method: setHotel}, ...etc
    }
    */
    
    if(req.body.type === 'hotel'){
        promise = Hotel.findOne(
        {
            where: {name: req.body.value}
        });
    }
    else if(req.body.type === 'restaurant'){
        promise = Restaurant.findOne(
        {
            where: {name: req.body.value}
        });
    }
    else if(req.body.type === 'activity'){
        promise = Activity.findOne(
        {
            where: {name: req.body.value}
        });
    }
    
    Day.findOne({
        where: {number: +req.body.day},

    })
    .then(function(day){
        return promise
        .then(function(item){
            if(req.body.action === 'add'){
                if(req.body.type === 'hotel'){
                    return day.setHotel(item);
                }
                else if(req.body.type === 'restaurant'){
                    return day.addRestaurant(item);
                }
                else if(req.body.type === 'activity'){
                    return day.addActivity(item);
                }
                
            }
            else if(req.body.action === 'delete'){
                if(req.body.type === 'hotel'){
                    return day.setHotel(null);
                }
                else if(req.body.type === 'restaurant'){
                    return day.removeRestaurant(item);
                }
                else if(req.body.type === 'activity'){
                    return day.removeActivity(item);
                }
            }
        })
    })
    .then(function(thing){
        return Day.findOne({
            where: {number: +req.body.day},
            include: [Hotel, Restaurant, Activity]
        })
    })
    .then(function(newDay){
        res.send(newDay);   
    })
    .catch(next);
});

module.exports = router;