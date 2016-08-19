'use strict';
/* global $ tripModule */

/*$(tripModule.load);*/
$(function() {
    
    $('.day-buttons').on('click', 'button', function() {
        if($(this).attr('id') !== 'day-add'){
            $('.current-day').removeClass('current-day');
            $(this).addClass('current-day');
            
            var dayNumber = +$(this).text();
            $.ajax({
                method: 'GET',
                url: '/api/days',
                data: {dayNumber}
            })
            .then(function(dayArray){
                showDay(dayArray[0]);
            })
        }
    })
    
    //Add a day to the DB
    $('#day-add').on('click', function() {
        $.ajax({
            method: 'POST',
            url: '/api/days'
        })
        .then(addDayButton);
    });
    
    //Handler to add activities to this day
    $('#options-panel').on('click', 'button', function() {
        var type = $(this).siblings('select').data('type');
        var value = $(this).siblings('select').val();
        var day = $('.current-day').text();
        $.ajax({
            method: 'PUT',
            url: '/api/days',
            data: {type: type, value: value, day: day, action: 'add'}
        })
        .then(function(day){
            showDay(day);
            
        })
    })
    
    $('#itinerary').on('click', 'button', function() {
        var type = $(this).parent().parent().attr('id');
        type = type.slice(0,type.length-5);
        var value = $(this).siblings('span').text();
        var day = $('.current-day').text();
        $.ajax({
            method: 'PUT',
            url: '/api/days',
            data: {type: type, value: value, day: day, action: 'delete'}
        })
        .then(function(day){
            showDay(day);
            
        })
        
    });
    
    $('#day-title button').on('click', function() {
        var dayNumber = currentDay.number;
        $.ajax({
            method: 'DELETE',
            url: '/api/days',
            data: {dayNumber}
        })
        .then(function(days){
            
            var theButtons = $('.day-btn').forEach(function(ele){
                if(!ele.attr('id')){
                    ele.detach();
                }
            });
            
             days.sort(function(a,b){return a.number-b.number});
        
            if(days.length === 0){
                //do a post THEN add a button to DOM
                $.ajax({
                    method: 'POST',
                    url: '/api/days'
                })
                .then(addDayButton);
            }
            else{
                days.forEach(addDayButton);
                $('.current-day').removeClass('current-day');
                $('.day-buttons').find('>:first-child').addClass('current-day');
                showDay(days[0]);
            }
        })
    })
    
     
})

function showDay(day) {

    if(currentDayMarkers.length > 0){
        currentDayMarkers.forEach(mapModule.hide);
    }
    
    currentDay = day;
    
    $('#day-title>span').text('Day '+currentDay.number);
    
    currentDayMarkers = [];
    
    //look at hotel, restaurants and activities in day and put relevant elements in DOM
    var $hotelList = $('#hotel-list');
    var $restaurantList = $('#restaurant-list');
    var $activityList = $('#activity-list');
    
    $hotelList.empty();
    $restaurantList.empty();
    $activityList.empty();
    
    if(day.hotel){
        $hotelList.append($(`<div class="itinerary-item">
            <span class="title">${day.hotel.name}</span>
            <button class="btn btn-xs btn-danger remove btn-circle">x</button>
        </div>`));
        var marker = mapModule.buildAttractionMarker(day.hotel);
        mapModule.draw(marker);
        currentDayMarkers.push(marker);
    }
    
    day.restaurants.forEach(function(restaurant){
        $restaurantList.append($(`<div class="itinerary-item">
            <span class="title">${restaurant.name}</span>
            <button class="btn btn-xs btn-danger remove btn-circle">x</button>
        </div>`));
        var marker = mapModule.buildAttractionMarker(restaurant);
        mapModule.draw(marker);
        currentDayMarkers.push(marker);
    });
    
     day.activities.forEach(function(activity){
        $activityList.append($(`<div class="itinerary-item">
            <span class="title">${activity.name}</span>
            <button class="btn btn-xs btn-danger remove btn-circle">x</button>
        </div>`));
         var marker = mapModule.buildAttractionMarker(activity);
        mapModule.draw(marker);
        currentDayMarkers.push(marker);
    });
}





