
var express = require('express');
var router = express.Router();
var UserController = require("../Controller/UserController")
usercontroller = new UserController();

const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

var upload = multer({ storage: storage })

/* GET users listing. */
router.post('/add-product', function (req, res, next) {

  usercontroller.RegisterUser(req.body).then((result) => {

    res.status(result.httpstatus).json(result);
  }).catch((error) => {
    res.status(error.httpstatus).json(error);
  })


});

router.get('/get-product/:id', function (req, res, next) {

  usercontroller.GetUser(req.params.id).then((result) => {

    res.status(result.httpstatus).json(result);
  }).catch((error) => {
    res.status(error.httpstatus).json(error);
  })


});

router.post('/upload-excel', upload.single('file'), function (req, res, next) {

  usercontroller.uploadExcel(req).then((result) => {

    res.status(result.httpstatus).json(result);
  }).catch((error) => {
    res.status(error.httpstatus).json(error);
  })


});

module.exports = router;
