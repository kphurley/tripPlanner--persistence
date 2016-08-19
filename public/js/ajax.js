var currentDay, currentDayMarkers = [];

$(function() {
    $.ajax({
      method: 'GET',
      url: '/api/hotels'
    })
    .then(function (hotels) {
      var $hotelChoices = $('#hotel-choices');
      hotels.forEach(function(hotel){
         var $option = $('<option></option>').text(hotel.name);
          $hotelChoices.append($option);
      });
    })
    .catch(function(err){
        console.log(err);
    });
    
    $.ajax({
      method: 'GET',
      url: '/api/restaurants'
    })
    .then(function (restaurants) {
      var $restaurantChoices = $('#restaurant-choices');
      restaurants.forEach(function(restaurant){
         var $option = $('<option></option>').text(restaurant.name);
          $restaurantChoices.append($option);
      });
    })
    .catch(function(err){
        console.log(err);
    });
    
    $.ajax({
      method: 'GET',
      url: '/api/activities'
    })
    .then(function (activities) {
      var $activityChoices = $('#activity-choices');
      activities.forEach(function(activity){
         var $option = $('<option></option>').text(activity.name);
          $activityChoices.append($option);
      });
    })
    .catch(function(err){
        console.log(err);
    });
    
    $.ajax({
      method: 'GET',
      url: '/api/days'
    })
    .then(function (days) {
        
        //MAKE DAY BUTTONS
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
         //END MAKE DAY BUTTONS   
    })
    .catch(function(err){
        console.log(err);
    });
    
})

function addDayButton(day) {
    $('.current-day').removeClass('current-day');
    var $button = $('<button class="btn btn-circle day-btn current-day"></button>').text(day.number);
    $('#day-add').before($button);
    

}