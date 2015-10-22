'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
// var Person = require('./person.server.model');
// var Group = require('./group.server.model');


var yearValidation = [function(v) {
 return v >= 1900 && v <= 2200; }, 'Path `{PATH}` ({VALUE}) should be between 1900 and 2200'];
var monthValidation = [function(v) {
 return v >= 1 && v <= 12; }, 'Path `{PATH}` ({VALUE}) should be between 1 and 12'];
var dayValidation = [function(v) {
 return v >= 1 && v <= 31; }, 'Path `{PATH}` ({VALUE}) should be between 1 and 31'];

function createDateObject(date) {

  if(!date)
    return;

  var year = Math.floor(date / 10000);
  var month = Math.floor((date - (year * 10000)) / 100);
  var day = Math.floor(date - (year * 10000) - (month * 100));

  return {
    numeric: date,
    year: year,
    month: month,
    day: day
  };
}


/**
 * Lesson Schema
 */
var LessonSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Lesson name',
    trim: true
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  beginDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: Date.now
  },
  students: [{
    person: { 
      type : Schema.ObjectId, 
      ref: 'Person' 
    },
    status: {
      type : Number, 
      required : false
    }
  }],
  groups: [{ type : Schema.ObjectId, ref: 'Group' }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Lesson', LessonSchema);

// LessonSchema.statics.create = function(createDate, beginDate, endDate, groupId) {

//  var lesson = new this();

//  lesson.createDate = createDateObject(createDate);
//  lesson.beginDate = createDateObject(beginDate);
//  lesson.endDate = createDateObject(endDate);
//  lesson.students = [];
//  if (lesson.groups.contains(groupId))
//    {
//      console.log('already contains this group');
//    }
//    else
//    {
//      lesson.groups.push(groupId);
//    } 


//  return lesson;
// };


