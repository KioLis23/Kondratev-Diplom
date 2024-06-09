import sqlite3
import random
import string
import os


surnames = ["Иванов", "Петров", "Сидоров", "Козлов", "Смирнова", "Кузнецова", "Васильева", "Попов", "Алексеев", "Егорова"]
names = ["Иван", "Пётр", "Александр", "Елена", "Анна", "Михаил", "Сергей", "Татьяна", "Ольга", "Дмитрий"]
patronymics = ["Иванович", "Петрович", "Александрович", "Сергеевна", "Михайловна", "Владимирович", "Николаевна", "Андреевич", "Дмитриевна", "Олеговна"]


streets = ["Пушкинская", "Ленинская", "Гагарина", "Мира", "Советская", "Кирова", "Красноармейская", "Молодежная", "Садовая", "Центральная"]
cities = ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Нижний Новгород", "Казань", "Челябинск", "Омск", "Самара", "Ростов-на-Дону"]
postcodes = ["123456", "654321", "111222", "333444", "555666", "777888", "999000", "121212", "343434", "565656"]


schools = ["Школа №1", "Гимназия №2", "Лицей №3", "Школа №4", "Школа №5", "Школа №6", "Школа №7", "Школа №8", "Школа №9", "Школа №10"]
colleges = ["Колледж им. Менделеева", "Колледж им. Ломоносова", "Колледж им. Пушкина", "Колледж им. Гагарина", "Колледж им. Толстого", "Колледж им. Чехова", "Колледж им. Достоевского", "Колледж им. Горького", "Колледж им. Шевченко", "Колледж им. Лермонтова"]
universities = ["МГУ", "СПбГУ", "НГУ", "МФТИ", "МГТУ им. Баумана", "ТГУ", "УрФУ", "СГУ", "ВГУ", "КФУ"]


def generate_fullname():
    surname = random.choice(surnames)
    name = random.choice(names)
    patronymic = random.choice(patronymics)
    return surname + " " + name + " " + patronymic

def generate_address():
    street = random.choice(streets)
    city = random.choice(cities)
    postcode = random.choice(postcodes)
    return street, city, postcode

def generate_email(fullname):
    fullname = fullname.replace(" ", "_").lower()
    domain = random.choice(["gmail.com", "yahoo.com", "outlook.com", "mail.ru", "yandex.ru"])
    return f"{fullname}@{domain}"


def generate_password(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(characters) for i in range(length))
    return password


def generate_username():
    nouns = ["apple", "banana", "orange", "peach", "pear", "grape", "kiwi", "strawberry", "blueberry", "cherry"]
    adjectives = ["happy", "sad", "angry", "lucky", "unlucky", "brave", "scared", "hungry", "thirsty", "sleepy"]
    username = random.choice(adjectives) + "_" + random.choice(nouns) + "_" + str(random.randint(1, 100))
    return username


def create_user_database(database_name, num_users=10):
    conn = sqlite3.connect(database_name)
    c = conn.cursor()


    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, 
                 fullname TEXT, 
                 username TEXT, 
                 password TEXT, 
                 street TEXT, 
                 city TEXT, 
                 postcode TEXT, 
                 email TEXT, 
                 school_name TEXT, 
                 school_start_year INTEGER, 
                 school_end_year INTEGER,
                 college_name TEXT, 
                 college_start_year INTEGER, 
                 college_end_year INTEGER,
                 university_name TEXT, 
                 university_start_year INTEGER, 
                 university_end_year INTEGER)''')


    for _ in range(num_users):
        fullname = generate_fullname()
        username = generate_username()
        password = generate_password()
        street, city, postcode = generate_address()
        email = generate_email(fullname)
        school_data = {
            "name": random.choice(schools),
            "start_year": random.randint(2000, 2015),
            "end_year": random.randint(2000, 2020)
        }
        college_data = {
            "name": random.choice(colleges),
            "start_year": random.randint(2010, 2015),
            "end_year": random.randint(2010, 2020)
        }
        university_data = {
            "name": random.choice(universities),
            "start_year": random.randint(2015, 2020),
            "end_year": random.randint(2015, 2024)
        }
        c.execute("INSERT INTO users (fullname, username, password, street, city, postcode, email, school_name, school_start_year, school_end_year, college_name, college_start_year, college_end_year, university_name, university_start_year, university_end_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                  (fullname, username, password, street, city, postcode, email, 
                   school_data["name"], school_data["start_year"], school_data["end_year"], 
                   college_data["name"], college_data["start_year"], college_data["end_year"], 
                   university_data["name"], university_data["start_year"], university_data["end_year"]))

    conn.commit()


    c.execute("SELECT * FROM users")
    rows = c.fetchall()
    for row in rows:
        print(row)

    conn.close()


    os.rename(database_name, 'login.sqlite3')

if __name__ == "__main__":
    create_user_database("CRM_Database.db")
