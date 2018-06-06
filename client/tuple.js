Template.tupleDescription.helpers({
  tuple(){
    return tuplesList.find().fetch();
  },

  'tuple_title': function(){
      var url = location.href;
      var tuple_id = url.substring(url.indexOf("tupleDescription")+17);
      return tuplesList.find({_id: tuple_id}).fetch()[0].title;
  },
  'tuple_description': function(){
      var url = location.href;
      var tuple_id = url.substring(url.indexOf("tupleDescription")+17);
      return tuplesList.find({_id: tuple_id}).fetch()[0].description;
  },
  'button': function(){ 
      var user = Meteor.user().emails[0]["address"];
      var description = user+" wants to join your tuple.";
      var notifications = Notifications.find({description:description}).fetch();

      var url = location.href;
      var tuple_id = url.substring(url.indexOf("tupleDescription")+17);
      var title = tuplesList.find({_id: tuple_id}).fetch()[0].title;

      for (var i =0; i<notifications.length; i++){
        if (notifications[i].title==title){
          return true;
        }
      }
      return ;
  },
});


Template.tupleDescription.events({
  'click button':function(event){
    event.preventDefault();
    if (!Meteor.user()) {
      alert("You need to be logged in");
      Router.go("login");
      return false;
    }
    var user = Meteor.user().emails[0]["address"];
    var url = location.href;
    var tuple_id = url.substring(url.indexOf("tupleDescription")+17);
    var creator = tuplesList.find({_id: tuple_id}).fetch()[0].creator;
    var title = tuplesList.find({_id: tuple_id}).fetch()[0].title;

    Notifications.insert({
      title: title,
      description: user + " wants to join your tuple.",
      type: "tuple join request",
      read: false,
      user: creator
    });
    return false;
  }
});

Template.commentbox.helpers({
    'tup_comment': function(){
        var url = location.href;
        var tuple_id = url.substring(url.indexOf("tupleDescription")+17);
        return Comments.find({tuple_id: tuple_id}).fetch();
    }
});

Template.commentbox.events({
  'click button':function(event){
      event.preventDefault();
      if (!Meteor.user()) {
        alert("You need to be logged in");
        Router.go("login");
        return false;
      }
      var madeBy = Meteor.user().emails[0]["address"];
      var comment = document.getElementById('comment_text').value;
      var url = location.href;
      var tuple_id = url.substring(url.indexOf("tupleDescription")+17);
      var created_time = new Date();

      var day = created_time.getDate();
      if (day < 10){
        day = "0" + day;
      }
      var month = created_time.getMonth();
      if (month < 10){
        month = "0" + month;
      }

      var year = created_time.getFullYear().toString().substring(2);

      var hour = created_time.getHours();
      if (hour < 10){
        hour = "0" + hour;
      }

      var minutes = created_time.getMinutes();
      if (minutes < 10){
        minutes = "0" + minutes;
      }

      var time =  hour + ":"+ minutes;

      var disp_time = day+"/"+month+"/"+year+ " " + time;

      if (comment == "") {
        alert("You need to be logged in");
        return false;
      } else {
        Comments.insert({
          comment: comment,
          createdAt: disp_time,
          madeBy: madeBy,
          tuple_id: tuple_id,
        });
        document.getElementById('comment_text').value='';
        return false;
      }
    }
});
