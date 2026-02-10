#####################################################################
# Rozwiązanie zadania z FastAPI na ocenę 5.0
# Autor: Rami Ayoush
# ###################################################################

from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import requests
from typing import Any
from http.client import responses
import sqlite3

app = FastAPI()

app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")

@app.get("/")
def serve_react_app():
   return FileResponse("../ui/build/index.html")


#######################################################################
# Część labu od punktu 5 (obsługa bazy danych)
#######################################################################

# Funkcja łączy się z bazą danych dbase, zwraca cursor i zamyka połączenie
def handle_connection():
    db = sqlite3.connect('movies-extended.db')
    try:
        yield db
        db.commit()
    except:
        db.rollback()
        raise
    finally:
        db.close()

#def init_connection(dbase: str):
#    db = sqlite3.connect(dbase)
#    cursor = db.cursor()
#    return db, cursor

######################################################################
# Funkcje do obsługi tabeli movie
######################################################################


# Pobiera informacje o filmach z bazy movies-extended.db; zwraca wynik 
# w formie listy słowników
@app.get('/movies')
def get_movies(db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        movies = cursor.execute('SELECT * FROM movie').fetchall()
        output = []
        for movie in movies:
            movie = {'id': movie[0], 'title': movie[1], 'director': movie[2], 'year': movie[3], 'description': movie[4]}
            output.append(movie)
        return output
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")

# Pobiera informacje o filmie z id = {movie_id} z tabeli movie
@app.get('/movies/{movie_id}')
def get_single_movie(movie_id:int, db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        #movie = cursor.execute(f"SELECT * FROM movie WHERE id={movie_id}").fetchone()
        movie = cursor.execute("SELECT * FROM movie WHERE id = ?", (movie_id,)).fetchone()
        if movie is None:
            return {"message": "Nie znaleziono filmu"}
        return {'id': movie[0], 'title': movie[1], 'director': movie[2], 'year': movie[3], 'description': movie[4]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")
    
# Dodaje film do tabeli movie
@app.post("/movies")
def add_movie(params: dict[str, Any], db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        cursor.execute('INSERT INTO movie (title, director, year, description) VALUES (?, ?, ?, ?)', (params["title"], params["director"], params["year"], params["description"]))
        #db.commit()
        movie_id = cursor.lastrowid
        if cursor.rowcount > 0:
            #return {"message": f"Film zostal dodany!"}
            return {
                "id": movie_id,
                "title": params["title"],
                "director": params["director"],
                "year": params["year"],
                "description": params["description"]
            }
        else:
            return {"message": f"Nic nie dodano!"}       
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")

# Usuwa wszystkie filmy z tabeli movie
@app.delete("/movies")
def rem_movies_all(db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        cursor.execute('DELETE FROM movie;')
        #cursor.execute('DELETE FROM movie_actor_through')

        #db.commit()

        if cursor.rowcount > 0:
            return {"message": f"Wszystkie filmy zostały usunięte!"}
        else:
            return {"message": f"Nic nie zostało zmodyfikowane/pusta tabela"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")


# Aktualizuje dane filmu o id = {id} z tabeli movie
@app.put("/movies/{id}")
def update_movie_id(id: int, params: dict[str, Any], db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        cursor.execute('UPDATE movie SET title = ?, director = ?, year = ?, description = ? WHERE id = ?;', (params["title"], params["director"], params["year"], params["description"], id))
        #db.commit()
        if cursor.rowcount > 0:
            return {"message": f"Dane filmu zostały zaktualizowane"}
        else:
            return {"message": f"Nic nie zostało zmodyfikowane"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")

# Usuwa film o id = {id} z tabeli movie
@app.delete("/movies/{id}")
def rem_movie_id(id: int, db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        cursor.execute('DELETE FROM movie WHERE id = ?;', (id,))
        cursor.execute('DELETE FROM movie_actor_through WHERE movie_id = ?;', (id,))

        #db.commit()
        if cursor.rowcount > 0:
            return {"message": f"Film został usunięty"}
        else:
            return {"message": f"Nic nie zostało zmodyfikowane"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")

##########################################################################
# Funkcje do obsługi tabeli actors
##########################################################################

# Pobiera informacje o aktorach z tabeli actors z bazy movies-extended.db;
# zwraca wynik w formie listy słowników
@app.get('/actors')
def get_actors(db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        actors = cursor.execute('SELECT * FROM actor').fetchall()
        output = []
        for act in actors:
            actor = {'id': act[0], 'name': act[1], 'surname': act[2]}
            output.append(actor)
        return output
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")

# Pobiera informacje o aktorze z id = {actor_id} z tabeli actor
@app.get('/actors/{actor_id}')
def get_single_actor(actor_id:int, db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        #act = cursor.execute(f"SELECT * FROM actor WHERE id={actor_id}").fetchone()
        act = cursor.execute("SELECT * FROM actor WHERE id = ?", (actor_id,)).fetchone()
        if act is None:
            return {"message": "Nie znaleziono aktora"}
        return {'id': act[0], 'name': act[1], 'surname': act[2]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")

# Dodaje aktora do tabeli actors
@app.post("/actors")
def add_actor(params: dict[str, Any], db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        cursor.execute('INSERT INTO actor (name, surname) VALUES (?, ?)', (params["name"], params["surname"]))
        
        actor_id = cursor.lastrowid

        #db.commit()
        if cursor.rowcount > 0:
            #return {"message": f"Aktor zostal dodany!"}
            return {
                "id": actor_id,
                "name": params["name"],
                "surname": params["surname"]
            }
        else:
            return {"message": f"Nikogo nie dodano!"}       
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")
    
# Usuwa aktora o id = {id} z tabeli actors
@app.delete("/actors/{id}")
def rem_actor_id(id: int, db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        cursor.execute('DELETE FROM actor WHERE id = ?;', (id,))
        cursor.execute('DELETE FROM movie_actor_through WHERE actor_id = ?;', (id,))
        #cursor.execute('DELETE FROM movie_actor_through WHERE actor_id = ?;', (id,))

        #db.commit()
        if cursor.rowcount > 0:
            return {"message": f"Aktor został usunięty"}
        else:
            return {"message": f"Nic nie zostało zmodyfikowane"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")
    
# Aktualizuje dane aktora o id = {id} z tabeli actor
@app.put("/actors/{id}")
def update_movie_id(id: int, params: dict[str, Any], db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        cursor.execute('UPDATE actor SET name = ?, surname = ? WHERE id = ?;', (params["name"], params["surname"], id))

        #db.commit()
        if cursor.rowcount > 0:
            return {"message": f"Dane aktora zostały zaktualizowane"}
        else:
            return {"message": f"Nic nie zostało zmodyfikowane"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")
    
#############################################################################
# Funkcja obsługująca joina tabel actor i movie_actor_through
#############################################################################

# Pobiera informacje o aktorach grających w filmie z id = {film_id} z tabeli
# actors
@app.get('/movies/{film_id}/actors')
def get_cast(film_id:int, db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        #actors = cursor.execute(f"SELECT a.id, a.name, a.surname FROM actor a INNER JOIN movie_actor_through m ON a.id = m.actor_id WHERE m.movie_id = {film_id};")
        actors = cursor.execute("SELECT a.id, a.name, a.surname FROM actor a INNER JOIN movie_actor_through m ON a.id = m.actor_id WHERE m.movie_id = ?;",(film_id,))

        #act = cursor.execute(f"SELECT * FROM actor WHERE id={actor_id}").fetchone()
        output = []
        for act in actors:
            actor = {'id': act[0], 'name': act[1], 'surname': act[2]}
            output.append(actor)
        return output
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")

# Funkcja usuwa aktora z obsady
@app.delete("/movies/{movie_id}/actors/{actor_id}")
def rem_actor_cast(movie_id: int, actor_id: int, db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        cursor.execute('DELETE FROM movie_actor_through WHERE movie_id=? AND actor_id = ?;', (movie_id, actor_id))
    
        #db.commit()
        if cursor.rowcount > 0:
            return {"message": f"Aktor został usunięty"}
        else:
            return {"message": f"Nic nie zostało zmodyfikowane"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")
    

# Funkcja dodaje aktora do obsady
@app.post("/movies/{movie_id}/actors/{actor_id}")
def add_actor_cast(movie_id: int, actor_id: int, db = Depends(handle_connection)):
    try:
        cursor = db.cursor()
        cursor.execute('INSERT INTO movie_actor_through (movie_id, actor_id) VALUES (?, ?)', (movie_id, actor_id))
        #db.commit()

        pair_id = cursor.lastrowid

        #db.commit()
        #cursor.execute('SELECT m.id as pair_id, a.id as actor_id, a.name, a.surname FROM movie_actor_through m JOIN actor a ON a.id = m.actor_id WHERE m.movie_id = ? AND m.actor_id = ?', (movie_id, actor_id))
    
        #row = cursor.fetchone()

        if cursor.rowcount>0:
            return {
                "id": pair_id,
                "movie_id": movie_id,
                "actor_id": actor_id 
            }
        else:
            return {"message": f"Nikogo nie dodano!"}       
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd: {str(e)}")