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
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    address TEXT DEFAULT ''
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price REAL DEFAULT 0
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Deals (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    deal_date DATE NOT NULL,
    deal_amount INTEGER NOT NULL,
    status TEXT NOT NULL,
    integration_id INTEGER,  -- Добавлено поле для связи с интеграцией
    process_id INTEGER,  -- Добавлено поле для связи со смарт-процессом
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (product_id) REFERENCES Products(id),
    FOREIGN KEY (integration_id) REFERENCES Integrations(id),  -- Связь с интеграциями
    FOREIGN KEY (process_id) REFERENCES SmartProcesses(id)  -- Связь со смарт-процессами
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Sales (
    id INTEGER PRIMARY KEY,
    deal_id INTEGER NOT NULL,
    sale_date DATE NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY (deal_id) REFERENCES Deals(id)
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Contacts (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    position TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    FOREIGN KEY (customer_id) REFERENCES Customers(id)
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Leads (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    source TEXT DEFAULT '',
    contact_person TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    status TEXT DEFAULT ''
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Tasks (
    id INTEGER PRIMARY KEY,
    task_description TEXT DEFAULT '',
    due_date DATE DEFAULT NULL,
    assigned_to INTEGER,
    completed BOOLEAN DEFAULT False,
    deal_id INTEGER NOT NULL,
    FOREIGN KEY (assigned_to) REFERENCES Users(id),
    FOREIGN KEY (deal_id) REFERENCES Deals(id)
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS ActivityLog (
    id INTEGER PRIMARY KEY,
    activity_date DATE DEFAULT NULL,
    activity_description TEXT DEFAULT '',
    activity_type TEXT DEFAULT '',
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id)  -- Связь с таблицей Users
)''')



cursor.execute('''CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    role TEXT DEFAULT ''
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS Analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_date DATE UNIQUE,
    revenue REAL DEFAULT 0,
    expenses REAL DEFAULT 0,
    deal_id INTEGER NOT NULL,
    contact_person_id INTEGER,  -- Добавлено поле для связи с контактным лицом
    FOREIGN KEY (deal_id) REFERENCES Deals(id),
    FOREIGN KEY (contact_person_id) REFERENCES Customers(id)  -- Связь с контактным лицом
)''')



cursor.execute('''CREATE TABLE IF NOT EXISTS Integrations (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    integration_type TEXT DEFAULT '',
    status TEXT DEFAULT ''
)''')


cursor.execute('''CREATE TABLE IF NOT EXISTS SmartProcesses (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT '',
    deal_id INTEGER NOT NULL,
    FOREIGN KEY (deal_id) REFERENCES Deals(id)
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


product_names = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E']
for name in product_names:
    description = ''.join(random.choices(string.ascii_lowercase, k=50))
    price = round(random.uniform(10, 100), 2)
    cursor.execute("INSERT INTO Products (name, description, price) VALUES (?, ?, ?)", (name, description, price))


for i in range(50):
    customer_id = random.randint(1, 10)
    product_id = random.randint(1, 5)  
    deal_date = random_date(start_date, end_date)
    deal_amount = random.randint(1, 100)
    status = random.choice(['Pending', 'Completed', 'Canceled'])
    cursor.execute("INSERT INTO Deals (customer_id, product_id, deal_date, deal_amount, status) VALUES (?, ?, ?, ?, ?)", (customer_id, product_id, deal_date, deal_amount, status))


for i in range(50):
    deal_id = random.randint(1, 50)
    sale_date = random_date(start_date, end_date)
    amount = random.randint(100, 1000)
    cursor.execute("INSERT INTO Sales (deal_id, sale_date, amount) VALUES (?, ?, ?)", (deal_id, sale_date, amount))


for i in range(15):
    customer_id = random.randint(1, 10)
    name = ''.join(random.choices(string.ascii_uppercase, k=5))
    position = random.choice(['Manager', 'Director', 'Executive'])
    email = f"{name.lower()}@example.com"
    phone = ''.join(random.choices(string.digits, k=10))
    cursor.execute("INSERT INTO Contacts (customer_id, name, position, email, phone) VALUES (?, ?, ?, ?, ?)", (customer_id, name, position, email, phone))


for i in range(10):
    name = ''.join(random.choices(string.ascii_uppercase, k=5))
    source = random.choice(['Website', 'Referral', 'Advertisement'])
    contact_person = ''.join(random.choices(string.ascii_uppercase, k=5))
    email = f"{name.lower()}@example.com"
    phone = ''.join(random.choices(string.digits, k=10))
    status = random.choice(['New', 'Contacted', 'Converted', 'Lost'])
    cursor.execute("INSERT INTO Leads (name, source, contact_person, email, phone, status) VALUES (?, ?, ?, ?, ?, ?)", (name, source, contact_person, email, phone, status))


for i in range(130):
    task_description = ''.join(random.choices(string.ascii_uppercase, k=10))
    due_date = random_date(start_date, end_date)
    assigned_to = random.randint(1, 5)
    completed = random.choice([True, False])
    cursor.execute("INSERT INTO Tasks (task_description, due_date, assigned_to, completed, deal_id) SELECT ?, ?, ?, ?, id FROM Deals ORDER BY RANDOM() LIMIT 1", (task_description, due_date, assigned_to, completed))


for i in range(12):  # Для каждого месяца года
    report_date = datetime.date(current_date.year, i + 1, 1)
    revenue = round(random.uniform(1000, 5000), 2)
    expenses = round(random.uniform(500, 2000), 2)
    deal_id = random.randint(1, 20)
    contact_person_id = random.randint(1, 10)  
    cursor.execute("INSERT INTO Analytics (report_date, revenue, expenses, deal_id, contact_person_id) VALUES (?, ?, ?, ?, ?)", (report_date, revenue, expenses, deal_id, contact_person_id))


for i in range(50):  
    activity_date = random_date(start_date, end_date)
    activity_description = ''.join(random.choices(string.ascii_uppercase, k=10))
    activity_type = random.choice(['Call', 'Email', 'Meeting'])
    user_id = random.randint(1, 5)  
    cursor.execute("INSERT INTO ActivityLog (activity_date, activity_description, activity_type, user_id) VALUES (?, ?, ?, ?)", (activity_date, activity_description, activity_type, user_id))


for i in range(5):
    name = ''.join(random.choices(string.ascii_uppercase, k=5))
    email = f"{name.lower()}@example.com"
    role = random.choice(['Admin', 'Manager', 'Employee'])
    cursor.execute("INSERT INTO Users (name, email, role) VALUES (?, ?, ?)", (name, email, role))


integration_data = [
    ('Integration A', 'API', 'Active'),
    ('Integration B', 'Webhook', 'Inactive'),
    ('Integration C', 'File Transfer', 'Active')
]
for integration in integration_data:
    cursor.execute("INSERT INTO Integrations (name, integration_type, status) VALUES (?, ?, ?)", integration)


smart_processes_data = [
    ('Process A', 'Automated process for lead scoring', 'Active'),
    ('Process B', 'Automated email follow-up for leads', 'Inactive'),
    ('Process C', 'Automated inventory management', 'Active')
]
for process in smart_processes_data:
    cursor.execute("INSERT INTO SmartProcesses (name, description, status, deal_id) SELECT ?, ?, ?, id FROM Deals ORDER BY RANDOM() LIMIT 1", process)

conn.commit()
conn.close()

os.rename('CRM_Database.db', 'CRM_Database.sqlite3')
