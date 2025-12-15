from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import random

LOGICA_SUSHI = {
    "Especial":        {"A": 10, "B": 10, "C": 10, "D": 10},
    "Nigiris":         {"A": 1, "B": 1, "C": 2, "D": 6},
    "Poke":            {"A": 1, "B": 1, "C": 3, "D": 5},
    "Tartar":          {"A": 3, "B": 1, "C": 3, "D": 4},
    "Hossomaki":       {"A": 1, "B": 2, "C": 2, "D": 5},
    "Ramen":           {"A": 1, "B": 2, "C": 3, "D": 4},
    "Onigiri":         {"A": 1, "B": 3, "C": 3, "D": 3},
    "Ensaladas":       {"A": 2, "B": 2, "C": 2, "D": 4},
    "Tempuras":        {"A": 2, "B": 2, "C": 3, "D": 3},
    "Arroces":         {"A": 1, "B": 2, "C": 1, "D": 6},
    "Gyoza":           {"A": 2, "B": 3, "C": 2, "D": 3},
    "Bebida":          {"A": 3, "B": 2, "C": 3, "D": 2},
    "Wok":             {"A": 1, "B": 2, "C": 6, "D": 1},
    "Carpaccio":       {"A": 4, "B": 3, "C": 2, "D": 1}
}

MENSAJES = {
    "Especial": "Felicidades, eres alguien único. Suerte encontrando pareja.", 
    "Nigiris": "Ah, Nigiris... clásico pero predecible. Qué sorpresa.", 
    "Poke": "Bueno, encajas más aquí que el menú infantil.",
    "Tartar": "Si, a mi también me gustaría ser rico", 
    "Hossomaki": "Un Hossomaki? És pequeño… Pero enrollado.", 
    "Ramen": "Te gusta lo caliente y complicado, ¿verdad?", 
    "Onigiri": "Simple, pero con relleno sorpresa", 
    "Ensaladas": "Ohh, no debe de ser divertido no ser nunca el escogido.", 
    "Tempuras": "Duros por fuera y blanditos por dentro, eso dice mucho de ti", 
    "Arroces": "Nunca falla." , 
    "Gyoza": "Un clásico, a todo el mundo le cae bien.", 
    "Bebida" : "Eres el único por el que tienen que pagar un extra, siéntete especial.", 
    "Wok" : "Eres un caos de cosas dentro de tu cabeza.", 
    "Carpaccio": "Ohh, alguien sabe que existes?", 
    "Menú infantil": "Vuelve pronto!!! Nos encanta la gente que paga un buffet de 20€ por unos nuggets."
}

def calcular_sushi(respuestas_usuario):
    """Calcula el tipo de sushi basado en las respuestas del test."""
    conteo = {"A": 0, "B": 0, "C": 0, "D": 0}
    for r in respuestas_usuario:
        if r in conteo:
            conteo[r] += 1

    total_respuestas = len(respuestas_usuario)
    if total_respuestas != 10:
        return {"sushi": "Error", "mensaje": "Se requieren exactamente 10 respuestas."}

    max_conteo = max(conteo.values())
    perfiles_dominantes = [perfil for perfil, count in conteo.items() if count == max_conteo]
    
    if max_conteo == 10:
        return {"sushi": "Especial", "mensaje": MENSAJES["Especial"]}
    if max_conteo <= 2:
        return {"sushi": "Menú infantil", "mensaje": MENSAJES["Menú infantil"]}

    perfil_dominante = random.choice(perfiles_dominantes)

    mejor_sushi = None
    max_puntuacion_sushi = -1

    for sushi, puntos in LOGICA_SUSHI.items():
        if sushi == "Especial": continue 
        puntuacion_actual = puntos.get(perfil_dominante, 0)
        
        if puntuacion_actual > max_puntuacion_sushi:
            max_puntuacion_sushi = puntuacion_actual
            mejor_sushi = sushi
        elif puntuacion_actual == max_puntuacion_sushi:
            if random.choice([True, False]):
                mejor_sushi = sushi

    return {"sushi": mejor_sushi, "mensaje": MENSAJES.get(mejor_sushi, "Mensaje no encontrado.")}

app = Flask(__name__)
CORS(app)

def connect_db():
    """Establece y devuelve la conexión a la base de datos del restaurante."""
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="Educem00.",
            database="restaurant_projecte" 
        )
    except mysql.connector.Error as err:
        print(f"Error al conectar con MySQL: {err}")
        raise

@app.route('/MenuPersonalitat', methods=['POST'])
def run_sushi_test():
    """Endpoint para ejecutar el test de personalidad de sushi."""
    data = request.get_json()
    
    respuestas = data.get('respuestas')

    if not isinstance(respuestas, list):
        return jsonify({'error': 'La entrada debe ser un array de respuestas (ej: ["A", "B", ...])'}), 400
    
    resultado = calcular_sushi(respuestas)

    if resultado.get('sushi') == "Error":
        return jsonify({'error': resultado.get('mensaje')}), 400
    
    return jsonify(resultado), 200

@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    """Obtiene la lista de restaurantes."""
    db = connect_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM restaurant")
    restaurants = cursor.fetchall()
    db.close()
    return jsonify(restaurants)

@app.route('/tables', methods=['GET'])
def get_tables():
    """Obtiene la lista de mesas."""
    db = connect_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM taula")
    tables = cursor.fetchall()
    db.close()
    return jsonify(tables)

@app.route('/clients', methods=['POST'])
def create_client():
    """Crea un nuevo cliente."""
    data = request.get_json()
    db = connect_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO clients (Nom, Al_lergies, Telefon, Correu)
            VALUES (%s, %s, %s, %s)
        """, (data['Nom'], data['Al_lergies'], data['Telefon'], data['Correu']))
        db.commit()
        return jsonify({'message': 'Cliente creado correctamente'}), 201
    except Exception as e:
        db.rollback()
        print("Error al insertar el cliente:", e)
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@app.route('/Conocenos', methods=['GET'])
def get_employees():
    """Obtiene la lista de empleados."""
    db = connect_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM empleats")
    employees = cursor.fetchall()
    db.close()
    
    return jsonify(employees)

@app.route('/Menu', methods=['GET'])
def get_menu():
    """Obtiene la lista de items del menú."""
    db = connect_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM menu")
    menu_items = cursor.fetchall()
    db.close()
    return jsonify(menu_items)


@app.route('/Reserves', methods=['GET'])
def get_reservations():
    """Obtiene la lista de reservas."""
    db = connect_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reserves")
    reservations = cursor.fetchall()
    db.close()
    return jsonify(reservations)

@app.route('/Reserves', methods=['POST'])
def create_reservation():
    """Crea una nueva reserva"""
    data = request.get_json()
    db = connect_db()
    cursor = db.cursor()

    taula_id = data.get('Taula')
    data_hora_reserva = data.get('Data_Hora')

    if not taula_id or not data_hora_reserva:
        db.close()
        return jsonify({'error': 'Faltan campos obligatorios (Taula, Data_Hora)'}), 400
    
    try:
        cursor.execute("""
            SELECT Id_Reserva FROM reserves 
            WHERE Taula = %s
            AND Data_Hora = %s
        """, (taula_id, data_hora_reserva))
        
        existing_reservation = cursor.fetchone()

        if existing_reservation:
            db.close()
            return jsonify({
                'error': 'Conflicto de reserva', 
                'message': f'La mesa {taula_id} ya está reservada para la hora exacta {data_hora_reserva}.'
            }), 409
        
        cursor.execute("""
            INSERT INTO reserves (Id_Client, Taula, Num_Persones, Data_Hora, Estat)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data['Id_Client'],
            taula_id,
            data['Num_Persones'],
            data_hora_reserva,
            data['Estat']
        ))
        
        db.commit()
        return jsonify({'message': 'Reserva registrada correctamente'}), 201

    except Exception as e:
        db.rollback()
        print("Error al insertar la reserva:", e)
        return jsonify({'error': str(e)}), 500
    finally:
        if db.is_connected():
            db.close()

@app.route('/contact_messages', methods=['POST'])
def create_contact_message():
    """Registra un mensaje de contacto de un usuario web."""
    data = request.get_json()
    db = connect_db()
    cursor = db.cursor()
    
    if not all(k in data for k in ('Nom', 'Correu', 'Missatge')):
         return jsonify({'error': 'Faltan campos requeridos (Nom, Correu, Missatge)'}), 400

    try:
        cursor.execute("""
            INSERT INTO contact_messages (Nom, Correu, Missatge)
            VALUES (%s, %s, %s)
        """, (data['Nom'], data['Correu'], data['Missatge']))
        
        db.commit()
        return jsonify({'message': 'Mensaje de contacto enviado correctamente'}), 201
    except mysql.connector.Error as e:
        db.rollback()
        print("Error al insertar el mensaje de contacto. Asegúrate de que la tabla 'contact_messages' exista.", e)
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        db.rollback()
        print("Error desconocido al insertar el mensaje de contacto:", e)
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

if __name__ == '__main__':
    app.run(debug=True)