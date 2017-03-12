$(function () {
  // Functions

  function firebaseRef () {
    return window.firebase_database.ref('/calories');
  }

  function bindCaloriesFromFirebase(data) {
    data = data.val();
    var date = Object.keys(data)[0];
    console.log('date', date);
    var calories = data[date];

    var dateIsToday = window.moment(date).isSame(moment(), 'day');
    $('#app').show();
    $('#current-calorie-count').text(dateIsToday ? calories : 0)
  }

  function currentDateRef() {
    const currentDateStr = moment().format('YYYY-MM-DD');
    return firebaseRef().child(currentDateStr);
  }

  function updateCaloriesOnFirebase(calories) {
    currentDateRef().set(calories);
  }

  function addCaloriesOnFirebase() {
    currentDateRef().once('value').then(function(data) {
      var previousCalories = data.val();
      var newCalories = previousCalories + 15;
      updateCaloriesOnFirebase(newCalories)
    });
  }

  function subtractCaloriesOnFirebase() {
    currentDateRef().once('value').then(function(data) {
      var previousCalories = data.val();
      var newCalories = Math.max(0, previousCalories - 15);
      updateCaloriesOnFirebase(newCalories)
    });
  }

  // Getting to Business
  firebaseRef()
    .orderByKey()
    .limitToLast(1)
    .on('value', bindCaloriesFromFirebase);

  $('#plus-button').click(addCaloriesOnFirebase);
  $('#minus-button').click(subtractCaloriesOnFirebase);
});
