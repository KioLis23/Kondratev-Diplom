import sqlite3
import random
import string
import os
import datetime


current_date = datetime.date.today()
end_date = current_date + datetime.timedelta(days=365)
start_date = current_date

conn = sqlite3.connect('CRM_Database.db')
cursor = conn.cursor()


cursor.execute('''CREATE TABLE IF NOT EXISTS Customers (
    id INTEGER PRIMARY KEY,
    name TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Deals (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    product_id INTEGER,
    deal_date DATE,
    deal_amount INTEGER,
    status TEXT,
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Contacts (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    name TEXT,
    position TEXT,
    email TEXT,
    phone TEXT,
    FOREIGN KEY (customer_id) REFERENCES Customers(id)
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Tasks (
    id INTEGER PRIMARY KEY,
    task_description TEXT,
    due_date DATE,
    assigned_to INTEGER,
    completed BOOLEAN,
    FOREIGN KEY (assigned_to) REFERENCES Users(id)
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS ActivityLog (
    id INTEGER PRIMARY KEY,
    activity_date DATE,
    activity_description TEXT,
    activity_type TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id)
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    price REAL
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT
)''')


def random_date(start_date, end_date):
    return start_date + (end_date - start_date) * random.random()




for i in range(10):
    name = ''.join(random.choices(string.ascii_uppercase, k=5))
    contact_person = ''.join(random.choices(string.ascii_uppercase, k=5))
    email = f"{name.lower()}@example.com"
    phone = ''.join(random.choices(string.digits, k=10))
    address = ''.join(random.choices(string.ascii_uppercase + string.digits, k=20))
    cursor.execute("INSERT INTO Customers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)", (name, contact_person, email, phone, address))


for i in range(20):
    customer_id = random.randint(1, 10)
    product_id = random.randint(1, 10)
    deal_date = random_date(start_date, end_date)
    deal_amount = random.randint(1, 100)
    status = random.choice(['Pending', 'Completed', 'Canceled'])
    cursor.execute("INSERT INTO Deals (customer_id, product_id, deal_date, deal_amount, status) VALUES (?, ?, ?, ?, ?)", (customer_id, product_id, deal_date, deal_amount, status))


for i in range(15):
    customer_id = random.randint(1, 10)
    name = ''.join(random.choices(string.ascii_uppercase, k=5))
    position = random.choice(['Manager', 'Director', 'Executive'])
    email = f"{name.lower()}@example.com"
    phone = ''.join(random.choices(string.digits, k=10))
    cursor.execute("INSERT INTO Contacts (customer_id, name, position, email, phone) VALUES (?, ?, ?, ?, ?)", (customer_id, name, position, email, phone))


for i in range(30):
    task_description = ''.join(random.choices(string.ascii_uppercase, k=10))
    due_date = random_date(start_date, end_date)
    assigned_to = random.randint(1, 5)
    completed = random.choice([True, False])
    cursor.execute("INSERT INTO Tasks (task_description, due_date, assigned_to, completed) VALUES (?, ?, ?, ?)", (task_description, due_date, assigned_to, completed))


for i in range(50):
    activity_date = random_date(start_date, end_date)
    activity_description = ''.join(random.choices(string.ascii_uppercase, k=10))
    activity_type = random.choice(['Call', 'Email', 'Meeting'])
    user_id = random.randint(1, 5)
    cursor.execute("INSERT INTO ActivityLog (activity_date, activity_description, activity_type, user_id) VALUES (?, ?, ?, ?)", (activity_date, activity_description, activity_type, user_id))


for i in range(10):
    name = ''.join(random.choices(string.ascii_uppercase, k=5))
    description = ''.join(random.choices(string.ascii_uppercase, k=10))
    price = round(random.uniform(10, 100), 2)
    cursor.execute("INSERT INTO Products (name, description, price) VALUES (?, ?, ?)", (name, description, price))


for i in range(5):
    name = ''.join(random.choices(string.ascii_uppercase, k=5))
    email = f"{name.lower()}@example.com"
    role = random.choice(['Admin', 'Manager', 'Employee'])
    cursor.execute("INSERT INTO Users (name, email, role) VALUES (?, ?, ?)", (name, email, role))

conn.commit()
conn.close()

os.rename('CRM_Database.db', 'CRM_Database.sqlite3')
