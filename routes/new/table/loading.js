module.exports = function (req, res) {

  setTimeout(() => {
    res.send({
      code: 200,
      data: '200ok, Hello World'
    });
  }, 2000)

}
