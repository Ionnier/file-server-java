const express = require('express');
const fs = require('fs');
var fileupload = require('express-fileupload');
const app = express();
app.use(fileupload());

if (!fs.existsSync('./files')) {
    fs.mkdirSync('./files');
}

app.get("/", (req, res, next) => {
    res.status(200).send("Hello World!");
})

app.post("/api/files/upload", (req, res, next) => {
    const file = req.files.photo;
    var ok = true;
    while (ok) {
        var curent_path = makeid(15);
        if (fs.existsSync('./files/' + curent_path + ".png") === false) {
            const file = req.files.photo;
            file.mv('./files/' + curent_path + ".png", (err, result) => {
                if (err)
                    res.status(500).send()
                var url = curent_path + ".png";
                res.status(200).send({
                    success: true,
                    url
                })
            })
            ok = false;
        }
    }
})

app.delete("/api/files/:id", (req, res, next) => {
    const file = req.files.photo;
    var ok = true;
    if (fs.existsSync('./files/' + req.params.id + ".png") === true) {
        fs.unlink('./files/' + req.params.id + ".png", (err) => {
            if (err) {
                console.error(err)
                return;
            }
            res.status(200).send({
                success: true
            })
        })
        ok = false;
    }
})

app.get("/api/files/:id", (req, res, next) => {
    var file = ('./files/' + req.params.id);
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', 'image/png');
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
})

app.listen(process.env.PORT || 3000, () => {
    console.log("App listening on port " + (process.env.PORT || 3000))
})

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}