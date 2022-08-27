import app from "./app.js"

const PORT = 3000
app.set('port', process.env.PORT || PORT)
app.listen(app.get('port'), () => {
    console.log('Server is listening on port', app.get('port'))
})