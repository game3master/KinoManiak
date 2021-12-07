const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// getLastId = (notesJson) => {
//     var maxId = 0;
//     var notes = JSON.parse(notesJson);
//     for (let i = 0; i < notes.length; i++) {
//         if (notes[i].noteId >= maxId)
//             maxId = notes[i].noteId;
//     }

//     return maxId;
// }

app.get('/films', (req, res) => {
    fs.readFile('./films.json', 'utf8', (err, filmsJson) => {
        if (err) {
            console.log("File read failed in GET /film"+" : "+ err);
            res.status(500).send('File read failed');
            return;
        }
        console.log("GET: /films");
        res.send(filmsJson);
    });
});

app.get('/film/:id', (req, res) => {
    fs.readFile('./films.json', 'utf8', (err, filmsJson) => {
        if (err) {
            console.log("File read failed in GET /film/" + req.params.id + " : "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var films = JSON.parse(filmsJson);
        var film = films.find(filmtmp => filmtmp.filmId == req.params.id);
        if (!film) {
            console.log("Can't find film with id: " + req.params.id);
            res.status(500).send('Cant find film with id: ' + req.params.id);
            return;
        }
        var filmJSON = JSON.stringify(film);
        console.log("GET /films/" + req.params.id);
        res.send(filmJSON);
    });

});


// app.get('/date/:date', (req, res) => {
//     fs.readFile('./films.json', 'utf8', (err, filmsJson) => {
//         if (err) {
//             console.log("File read failed in GET /note/" + req.params.date + " : "+ err);
//             res.status(500).send('File read failed');
//             return;
//         }
//         var notes = JSON.parse(notesJson);
//         var note = notes.filter(notetmp => notetmp.date == req.params.date);
//         if (!note) {
//             console.log("Can't find note with id: " + req.params.id);
//             res.status(500).send('Cant find note with id: ' + req.params.date);
//             return;
//         }
//         var noteJSON = JSON.stringify(note);
//         console.log("GET /notes/" + req.params.date);
//         res.send(noteJSON);
//     });
// });

app.post('/film', (req, res) => {
    fs.readFile('./films.json', 'utf8', (err, filmsJson) => {
        if (err) {
            console.log("File read failed in POST /film"+" : "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var films = JSON.parse(filmsJson);
        var id = getLastId(filmsJson);
        id = id + 1;
        if (id) {
            req.body.filmId = id;
            films.push(req.body);
            var newList = JSON.stringify(films);
            fs.writeFile('./films.json', newList, err => {
                if (err) {
                    console.log('Error writing file in POST /film', err);
                    res.status(500).send('Error writing file films.json');
                } else {
                    res.status(201).send(req.body);
                    console.log('Successfully wrote file films.json and added new film with id = ' + req.body.filmId);
                }
            });
        } else {
            console.log("File read failed in POST /film", err);
            res.status(500).send('File read failed');
            return;
        }
    });
});

app.put('/film/:id', (req, res) => {
    fs.readFile('./films.json', 'utf8', (err, filmsJson) => {
        if (err) {
            console.log("File read failed in PUT /film/" + req.params.id+" : "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var films = JSON.parse(filmsJson);
        var filmBody = films.find(filmtmp => filmtmp.filmId == req.body.filmId);
        if (filmBody && filmBody.filmId != req.params.id) {
            console.log("film by id = " + filmBody.filmId + " already exists");
            res.status(500).send('Note by id = ' + filmBody.filmId + ' already exists');
            return;
        }
        var film = films.find(filmtmp => filmtmp.filmId == req.params.id);
        var id = getLastId(filmsJson);

        if (!film) {
            id = id + 1;
            req.body.filmId = id;
            films.push(req.body);
            var newList = JSON.stringify(films);
            fs.writeFile('./films.json', newList, err => {
                if (err) {
                    console.log('Error writing file in PUT /film/' + req.params.id+" : "+ err);
                    res.status(500).send('Error writing file films.json');
                } else {
                    res.status(201).send(req.body);
                    console.log('Successfully wrote file films.json and added new film with id = ' + req.body.filmId);
                }
            });
        } else {
            for (var i = 0; i < films.length; i++) {
                if (films[i].filmId == film.filmId) {
                    films[i] = req.body;
                }
            }
            var newList = JSON.stringify(films);
            fs.writeFile('./films.json', newList, err => {
                if (err) {
                    console.log('Error writing file in PUT /film/' + req.params.id, err);
                    res.status(500).send('Error writing file films.json');
                } else {
                    res.status(200).send(req.body);
                    console.log('Successfully wrote file films.json and edit film with old id = ' + req.params.id);
                }
            });
        }
    });
});

app.delete('/film/:id', (req, res) => {
    fs.readFile('./films.json', 'utf8', (err, filmJson) => {
        if (err) {
            console.log("File read failed in DELETE /film" +" : "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var films = JSON.parse(filmsJson);
        var filmIndex = films.findIndex(filmtmp => filmtmp.filmId == req.params.id);
        
        if (filmIndex != -1) {
            films.splice(filmIndex, 1);
            var newList = JSON.stringify(films);

            fs.writeFile('./films.json', newList, err => {
                if (err) {
                    console.log('Error writing file in DELETE /film/' + req.params.id, err);
                    res.status(500).send('Error writing file films.json');
                } else {
                    res.status(204).send();
                    console.log('Successfully deleted film with id = ' + req.params.id);
                }
            });
        } else {
            console.log("film by id = " + req.params.id + " does not exists");
            res.status(500).send('film by id = ' + req.params.id + ' does not exists');
            return;
        }
    });
});

app.listen(7777, () => console.log("Server address http://localhost:7777"));