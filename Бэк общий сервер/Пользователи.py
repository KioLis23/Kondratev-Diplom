import sqlite3
import random
import string
import os

# Списки фамилий, имен и отчеств
surnames = ["Иванов", "Петров", "Сидоров", "Козлов", "Смирнова", "Кузнецова", "Васильева", "Попов", "Алексеев", "Егорова"]
names = ["Иван", "Пётр", "Александр", "Елена", "Анна", "Михаил", "Сергей", "Татьяна", "Ольга", "Дмитрий"]
patronymics = ["Иванович", "Петрович", "Александрович", "Сергеевна", "Михайловна", "Владимирович", "Николаевна", "Андреевич", "Дмитриевна", "Олеговна"]

# Функция генерации пароля
def generate_password(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(characters) for i in range(length))
    return password

# Функция генерации логина
def generate_username():
    nouns = ["apple", "banana", "orange", "peach", "pear", "grape", "kiwi", "strawberry", "blueberry", "cherry"]
    adjectives = ["happy", "sad", "angry", "lucky", "unlucky", "brave", "scared", "hungry", "thirsty", "sleepy"]
    username = random.choice(adjectives) + "_" + random.choice(nouns) + "_" + str(random.randint(1, 100))
    return username

# Функция генерации полного имени
def generate_fullname():
    surname = random.choice(surnames)
    name = random.choice(names)
    patronymic = random.choice(patronymics)
    return surname + " " + name + " " + patronymic

# Функция создания базы данных пользователей
def create_user_database(database_name, num_users=10):
    conn = sqlite3.connect(database_name)
    c = conn.cursor()

    # Создание таблицы пользователей
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, fullname TEXT, username TEXT, password TEXT)''')

    # Генерация и добавление пользователей в базу данных
    for _ in range(num_users):
        fullname = generate_fullname()
        username = generate_username()
        password = generate_password()
        c.execute("INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)", (fullname, username, password))

    conn.commit()

    # Проверка данных в базе данных
    c.execute("SELECT * FROM users")
    rows = c.fetchall()
    for row in rows:
        print(row)

    conn.close()

    # Переименование файла базы данных
    os.rename(database_name, 'login.sqlite3')

if __name__ == "__main__":
    create_user_database("CRM_Database.db")
