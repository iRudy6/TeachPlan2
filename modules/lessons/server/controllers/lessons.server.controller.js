'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Lesson = mongoose.model('Lesson'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a lesson
 */
exports.create = function (req, res) {
  var lesson = new Lesson(req.body);
  lesson.user = req.user;
  
  lesson.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lesson);
    }
  });
};

/**
 * Show the current lesson
 */
exports.read = function (req, res) {
  console.log('***************inside exports.read*******************');
  res.json(req.lesson);
};

/**
 * Update a lesson
 */
exports.update = function (req, res) {
  var lesson = req.lesson;

  lesson.name = req.body.name;
  lesson.students = req.body.students;

  lesson.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lesson);
    }
  });
};


/**
 * Delete an group
 */
exports.delete = function (req, res) {
  var lesson = req.lesson;

  lesson.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lesson);
    }
  });
};

/**
 * List of groups
 */
exports.list = function (req, res) { 

  //Lesson.find({ beginDate: {$gte: new Date(2015, 10, 15), $lt: new Date(2015, 10, 20)}})
   Lesson.find()
   .sort('beginDate')
   .populate('user', 'displayName')
   .populate('students.person')
   .exec(function (err, lessons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lessons);
    }
  });
};

exports.lessonFiltered = function (req, res, next) {

/*  var moment = require ('moment');
  var today = moment().startOf('day'),
      tomorrow = moment(today).add(1, 'days');
*/

  
  var from = new Date(req.params.from);
  var to = new Date(req.params.from);
  to.setHours(24);

   Lesson.find({'groups' : {'$in' : [req.params.groupid]}})
   .where('beginDate').gt(from).lt(to)
   .sort('beginDate')
   .populate('user', 'displayName')
   .populate('students.person')
   .exec(function (err, lessons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lessons);
    }
  });
};

/*exports.getByDate = function(req, res, next) {

  Invoice.findQ({
    tenant: req.user.id,
    'date.numeric': { $gte: req.params.from, $lte: req.params.to }
  })
  .then(convert.toDtoQ)
  .then(res.send.bind(res))
  .catch(next)
  .done();
};
*/

/**
 * group middleware
 */
exports.lessonByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'lesson is invalideee'
    });
  }

  Lesson.findById(id)
    .populate('user', 'displayName')
    .populate('students.person')
    .exec(function (err, lesson) {
    if (err) {
      return next(err);
    } else if (!lesson) {
      return res.status(404).send({
        message: 'No lesson with that identifier has been found'
      });
    }
    req.lesson = lesson;
    next();
  });
};

exports.findLessonByGroupId = function(req, res, next, id) { 
  console.log('inside findLessonByGroupId');
  Lesson.find({'groups' : {'$in' : [id]} })
  .sort('beginDate')
  .populate('user', 'displayName')
  .populate('students.person')
  .exec(function (err, lessons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('end findLessonByGroupId');
      res.jsonp(lessons);
    }
  });
};
