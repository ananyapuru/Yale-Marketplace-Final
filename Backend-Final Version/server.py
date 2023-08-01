from flask import Flask, session, redirect, url_for, render_template, abort, jsonify, request, make_response
import mysql.connector
from flask_dance.consumer import OAuth2ConsumerBlueprint, oauth_authorized
import os
from flask_login import login_required, LoginManager
from datetime import datetime
from google.oauth2 import id_token
from google.auth.transport import requests
from functools import wraps
from flask_cors import CORS, cross_origin
import base64


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.secret_key = 'your_secret_key'
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = 'true'

db = mysql.connector.connect(
    host="localhost",
    # user="root",
    # password="",
    # database="oauth_project"
    user = "Cheems_user",
    password = "cheems1234",
    database="mock_marketplace_two"
)

cursor = db.cursor()
# cursor.execute("""
# DROP TABLE objects;
# """)
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        wishlist VARCHAR(255) DEFAULT '',
        oauth_token TEXT
    )
""")
# create the Objects table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS objects (
        obj_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(300) NOT NULL,
        price VARCHAR(200) NOT NULL,
        description VARCHAR(1000) NOT NULL,
        date VARCHAR(100) NOT NULL,
        tags VARCHAR(100),
        category VARCHAR(100) NOT NULL,
        contact VARCHAR(100) NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )
""")

# Create images table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS object_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        object_id INT NOT NULL,
        image LONGBLOB,
        FOREIGN KEY (object_id) REFERENCES objects(obj_id)
    );
""")



@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response



class Object():
    def __init__(self, title, price, description, date, tags, category, contact, user_id):
        self.title = title
        self.price = price
        self.description = description
        self.date = date
        self.tags = tags
        self.category = category
        self.contact = contact
        self.user_id = user_id

    @classmethod
    def get_object(cls, obj_id):
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM objects WHERE obj_id = %s", (obj_id,))
        row = cursor.fetchone()
        if row:
            return cls(**row)
        return None

    def save(self):
        cursor = db.cursor()
        categories = ""
        if self.category[0] == True:
            categories = categories + "Item,"
        if self.category[1] == True:
            categories = categories + "Renting,"
        if self.category[2] == True:
            categories = categories + "Service"
        
        query = "INSERT INTO objects (title, price, description, date, tags, category, contact, user_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        values = (self.title, self.price, self.description, self.date, self.tags, categories, self.contact, self.user_id)
        cursor.execute(query, values)
        db.commit()
        return self

    def delete(self, obj_id):
        cursor = db.cursor()
        query = "DELETE FROM Objects WHERE obj_id = %s"
        values = (obj_id,)
        cursor.execute(query, values)
        db.commit()

oauth_blueprint = OAuth2ConsumerBlueprint(
    "oauth",
    __name__,
    # client_id="",
    # client_secret="",
    client_id="301551154463-7qbd3c6gn76gfklqejbj9nt1lu3a141r.apps.googleusercontent.com",
    client_secret="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",
    authorization_url="https://accounts.google.com/o/oauth2/auth",
    token_url="https://accounts.google.com/o/oauth2/token",
    # redirect_url="http://localhost:5000/api/home",
    redirect_url="http://127.0.0.1:5000/api/home",
    scope=["https://www.googleapis.com/auth/userinfo.email", "openid", "https://www.googleapis.com/auth/userinfo.profile"],
)
app.register_blueprint(oauth_blueprint, url_prefix="/login")


@oauth_authorized.connect_via(oauth_blueprint)
def oauth_logged_in(blueprint, token):    
    cursor = db.cursor()
    userinfo = blueprint.session.get("https://www.googleapis.com/oauth2/v1/userinfo")
    if userinfo.ok:
        userinfo = userinfo.json()
        email = userinfo["email"]
        first_name = userinfo.get("given_name")
        last_name = userinfo.get("family_name")
        phone = userinfo.get("phone")
        # if email.endswith("@gmail.com") or email.endswith("@yale.edu"):
        if email.endswith("@yale.edu"):
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            result = cursor.fetchone()
            if result is None:
                cursor.execute("INSERT INTO users (email) VALUES (%s)", (email,))
                db.commit()
                user_id = cursor.lastrowid
            else:
                user_id = result[0]
            cursor.execute("UPDATE users SET first_name = %s, last_name = %s, email = %s, phone = %s, oauth_token = %s WHERE id = %s", (first_name, last_name, email, phone, str(token), user_id))
            db.commit()
            # session["user_id"] = user_id
            # session["access_token"] = token
            # create a response with the redirect URL and set a cookie
            # response = make_response(redirect('http://localhost:3000/home'))
            response = make_response(redirect('http://127.0.0.1:3000/home'))
            response.set_cookie('user_id', str(user_id).encode('utf-8'))
            response.set_cookie('access_token', str(token['id_token']).encode('utf-8'))
            return response
    else:
        response = make_response(redirect('http://127.0.0.1:3000/login'))
        return response

@app.route("/api/home")
def index():
    if "user_id" in session:
        return redirect(url_for("protected"))
    else:
        return render_template("index.html")

# @app.route("/protected")
# def protected():
#     if "user_id" not in session:
#         abort(401)
#     cursor = db.cursor()
#     cursor.execute("SELECT name, email FROM users WHERE id = %s", (session["user_id"],))
#     result = cursor.fetchone()
#     if result is None:
#         abort(401)
#     name, email = result
#     if not email.endswith("@gmail.com"):
#         abort(403)
#     print(validate_google_cookie())
#     return render_template("protected.html", name=name, email=email)

def validate_google_token(token):
    # # Get the token from the cookie
    # token = session.get('access_token')['id_token']
    # token = request.cookies.get('session')['access_token']
    # Specify the audience (client ID) of the token
    # audience = ""
    audience = "301551154463-7qbd3c6gn76gfklqejbj9nt1lu3a141r.apps.googleusercontent.com"
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), audience)
        # Check that the token is for this app
        if idinfo["aud"] != audience:
            raise ValueError("Token's audience is not for this app.")
        # Return the user ID
        return True

    except ValueError as e:
        # Invalid token
        #print(e)
        return False

def check_user_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        if validate_google_token(token):
            return func(*args, **kwargs)
        else:
            return jsonify({"error": "Unauthorized access"}), 401
    return wrapper

# Objects APIS
# Create a new Object
@app.route('/api/addObject', methods=['POST'])
@check_user_auth
def create_object():
    title = request.json.get('object_title')
    price = request.json.get('object_price')
    description = request.json.get('object_description')
    images = request.json.get('object_image')
    tags = request.json.get('object_tags')
    category = request.json.get('object_category')
    contact = request.json.get('contact')
    user_id = request.json.get('user_id')

    #print(title, price, description, images, tags, category, user_id)
    # Create a new Object and save it to the database
    new_object = Object(title=title, price=price, description=description, date=datetime.utcnow().date(), tags=tags, category=category, contact=contact, user_id=user_id)
    new_object.save()

    # get saved object id
    cursor = db.cursor()
    cursor.execute(f"SELECT * FROM objects WHERE title='{title}' AND price='{price}' AND description='{description}' AND tags='{tags}' AND contact='{contact}' AND user_id='{user_id}'")
    object_id = cursor.fetchall()[0][0]

    for image in images:
        cursor = db.cursor()
        query = "INSERT INTO object_images (object_id, image) VALUES (%s, %s)"
        values = (object_id, image)
        cursor.execute(query, values)
        db.commit()

    return jsonify({"message": "Product created successfully"}), 201

@app.route('/api/user/<int:user_id>', methods=['GET'])
# Get a user by id
@check_user_auth
# def get_user(user_id):
#     cursor = db.cursor()
#     cursor.execute(f"SELECT * FROM users WHERE id={user_id}")
#     user = cursor.fetchall()[0]
#     # convert the result to a list of dictionaries
#     returned_user = {
#         'user_id': user[0],
#         'first_name': user[1],
#         'last_name': user[2],
#         'email': user[3],
#         'whishlist': user[4],
#     }
#     #print(returned_user)
#     return jsonify(returned_user), 201  
def get_user(user_id):
    cursor = db.cursor()
    cursor.execute(f"SELECT * FROM users WHERE id={user_id}")
    user = cursor.fetchall()[0]
    # convert the result to a list of dictionaries
    returned_user = {
        'user_id': user[0],
        'first_name': user[1],
        'last_name': user[2],
        'email': user[3],
        'whishlist': user[4],
    }
    response = jsonify(returned_user)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 201  

# Get an object by id
@app.route('/api/object/<int:object_id>', methods=['GET'])
@check_user_auth
def get_object(object_id):
    cursor = db.cursor()
    cursor.execute(f"SELECT * FROM objects WHERE obj_id={object_id}")
    object = cursor.fetchall()[0]
    # convert the result to a list of dictionaries
    returned_object = {
        'object_id': object[0],
        'object_title': object[1],
        'object_price': object[2],
        'object_description': object[3],
        'object_date': object[4],
        'object_tags': object[5],
        'object_category': object[6],
        'object_contact': object[7],
        'user_id': object[8],
    }
    cursor = db.cursor()
    cursor.execute(f"SELECT * FROM object_images WHERE object_id={object_id}")
    images = cursor.fetchall()
    returned_images = []
    for image in images:
        returned_images.append(image[2].decode('utf-8'))

    returned_object['object_image'] = returned_images
    return jsonify(returned_object), 201  

# Update an object by id
@app.route('/api/updateObject/<int:object_id>', methods=['PUT'])
@check_user_auth
def update_object(object_id):
    title = request.json.get('object_title')
    price = request.json.get('object_price')
    description = request.json.get('object_description')
    images = request.json.get('object_image')
    tags = request.json.get('object_tags')
    category = request.json.get('object_category')
    contact = request.json.get('contact')
    
    categories = ""
    if category[0] == True:
        categories = categories + "Item,"
    if category[1] == True:
        categories = categories + "Renting,"
    if category[2] == True:
        categories = categories + "Service"

    cursor = db.cursor()
    # Update object in database
    cursor.execute("UPDATE objects SET title=%s, price=%s, description=%s, tags=%s, category=%s, contact=%s WHERE obj_id=%s", (title, price, description, tags, categories, contact, object_id))
    db.commit()

    cursor = db.cursor()
    # DELETE current images
    cursor.execute("DELETE FROM object_images WHERE object_id=%s", (object_id, ))
    db.commit()

    # Add new images in database
    for image in images:
        cursor = db.cursor()
        query = "INSERT INTO object_images (object_id, image) VALUES (%s, %s)"
        values = (object_id, image)
        cursor.execute(query, values)
        db.commit()    

    return {"success": "Object updated successfully"}, 200 

# Get all objects
@app.route('/api/objects', methods=['GET'])
@check_user_auth
def get_objects():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM objects")
    objects = cursor.fetchall()
    # convert the result to a list of dictionaries
    objects_list = []
    for object in objects:
        returned_object = {
            'object_id': object[0],
            'object_title': object[1],
            'object_price': object[2],
            'object_description': object[3],
            'object_date': object[4],
            'object_tags': object[5],
            'object_category': object[6],
            'contact': object[7],
            'user_id': object[8],
        }
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM object_images WHERE object_id={object[0]}")
        images = cursor.fetchall()
        returned_images = []
        for image in images:
            returned_images.append(image[2].decode('utf-8'))

        #print(returned_images)
        returned_object['object_image'] = returned_images
        objects_list.append(
          returned_object  
        )
    return jsonify(objects_list), 201  

# Add object to wishlist
@app.route('/api/addToWishlist', methods=['POST'])
@check_user_auth
def add_to_wishlist():
    object_id = request.json.get('object_id')
    user_id = request.json.get('user_id')

    # Insert an object to wishlist
    cursor = db.cursor()
    cursor.execute(
        f"""
            UPDATE users 
                SET wishlist = CONCAT(
                  IF(wishlist='', '', CONCAT(wishlist, ',')),
                  {object_id}
                )
            WHERE id = {user_id} AND FIND_IN_SET({object_id}, wishlist) = 0;   
        """
    )
    db.commit()
    return jsonify({"message": "Object added to wishlist successfully"}), 201

# Delete object from wishlist
@app.route('/api/deleteFromWishlist', methods=['POST'])
@check_user_auth
def delete_from_wishlist():
    object_id = request.json.get('object_id')
    user_id = request.json.get('user_id')

    # Insert an object to wishlist
    cursor = db.cursor()
    cursor.execute(
        f"""
            UPDATE users
            SET wishlist = IFNULL(
                (
                    SELECT GROUP_CONCAT(obj_id SEPARATOR ',')
                    FROM (
                        SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(wishlist, ',', n), ',', -1)) AS obj_id
                        FROM users
                        JOIN (SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) numbers
                        WHERE id = {user_id}
                        AND n <= 1 + LENGTH(wishlist) - LENGTH(REPLACE(wishlist, ',', ''))
                        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(wishlist, ',', n), ',', -1)) <> {object_id}
                    ) wish_objects
                ),
                ''
            )
            WHERE id = {user_id};
        """
    )
    db.commit()
    return jsonify({"message": "Object deleted from wishlist successfully"}), 201


# Delete object from Listing
@app.route('/api/deleteFromListing', methods=['POST'])
@check_user_auth
def delete_from_listing():
    object_id = request.json.get('object_id')
    user_id = request.json.get('user_id')

    # Insert an object to wishlist
    cursor = db.cursor()
    cursor.execute(
        f"""
            UPDATE users
            SET wishlist = IFNULL(
                (
                    SELECT GROUP_CONCAT(obj_id SEPARATOR ',')
                    FROM (
                        SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(wishlist, ',', n), ',', -1)) AS obj_id
                        FROM users
                        JOIN (SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) numbers
                        WHERE id = {user_id}
                        AND n <= 1 + LENGTH(wishlist) - LENGTH(REPLACE(wishlist, ',', ''))
                        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(wishlist, ',', n), ',', -1)) <> {object_id}
                    ) wish_objects
                ),
                ''
            )
            WHERE id = {user_id};
        """
    )
    db.commit()
    cursor = db.cursor()
    cursor.execute(
        f"""
            DELETE FROM object_images
            WHERE object_id = {object_id}
        """
    )
    db.commit()
    cursor = db.cursor()
    cursor.execute(
        f"""
            DELETE FROM objects
            WHERE obj_id = {object_id}
        """
    )
    db.commit()
    return jsonify({"message": "Object deleted from listing successfully"}), 201

# Get wishlist objects
@app.route('/api/getWishlist/<int:user_id>', methods=['GET'])
@check_user_auth
def get_wishlist_objects(user_id):
    # Insert an object to wishlist
    #print(user_id)
    cursor = db.cursor()
    cursor.execute(
        f"""
            SELECT *
            FROM objects
            WHERE obj_id IN (
                SELECT obj_id
                FROM (
                    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(wishlist, ',', n), ',', -1)) AS obj_id
                    FROM users
                    JOIN (SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) numbers
                    WHERE id = {user_id}
                    AND n <= 1 + LENGTH(wishlist) - LENGTH(REPLACE(wishlist, ',', ''))
                ) wish_objects
            );   
        """
    )
    objects = cursor.fetchall()
    objects_list = []
    # convert the result to a list of dictionaries
    for object in objects:
        returned_object = {
            'object_id': object[0],
            'object_title': object[1],
            'object_price': object[2],
            'object_description': object[3],
            # 'object_image': object[4].decode('utf-8'), #.decode('utf-8')
            'object_date': object[4],
            'object_tags': object[5],
            'object_category': object[6],
            'contact': object[7],
            'user_id': object[8],
        }
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM object_images WHERE object_id={object[0]}")
        images = cursor.fetchall()
        returned_images = []
        for image in images:
            returned_images.append(image[2].decode('utf-8'))

        returned_object['object_image'] = returned_images
        objects_list.append(returned_object)
    return jsonify(objects_list), 201 

# Get Listing objects
@app.route('/api/getListing/<int:user_id>', methods=['GET'])
@check_user_auth
def get_listing_objects(user_id):
    # Insert an object to wishlist
    #print(user_id)
    cursor = db.cursor()
    cursor.execute(
        f"""
            SELECT *
            FROM objects
            WHERE user_id = {user_id}
        """
    )
    objects = cursor.fetchall()
    objects_list = []
    # convert the result to a list of dictionaries
    for object in objects:
        returned_object = {
            'object_id': object[0],
            'object_title': object[1],
            'object_price': object[2],
            'object_description': object[3],
            # 'object_image': object[4].decode('utf-8'), #.decode('utf-8')
            'object_date': object[4],
            'object_tags': object[5],
            'object_category': object[6],
            'contact': object[7],
            'user_id': object[8],
        }
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM object_images WHERE object_id={object[0]}")
        images = cursor.fetchall()
        returned_images = []
        for image in images:
            returned_images.append(image[2].decode('utf-8'))

        returned_object['object_image'] = returned_images
        objects_list.append(returned_object)
    #print(objects_list)
    return jsonify(objects_list), 201 


if __name__ == '__main__':
    app.run(debug=True)
