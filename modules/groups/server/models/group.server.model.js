'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Group Schema
 */

var GroupSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Group name'
  },
  category: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


mongoose.model('Group', GroupSchema);
