import pandas as pd
from faker import Faker
import random
import datetime

# Инициализация Faker
fake = Faker()

# Генерация случайных данных
num_samples = 1000  # Количество сэмплов для генерации

data = {
    'timestamp': [fake.date_time_this_decade() for _ in range(num_samples)],
    'source_ip': [fake.ipv4() for _ in range(num_samples)],
    'source_port': [random.randint(1024, 65535) for _ in range(num_samples)],
    'destination_ip': [fake.ipv4() for _ in range(num_samples)],
    'destination_port': [random.randint(1024, 65535) for _ in range(num_samples)],
    'protocol': [random.choice(['TCP', 'UDP', 'ICMP']) for _ in range(num_samples)],
    'packet_size': [random.randint(64, 1500) for _ in range(num_samples)],
}

# Создание DataFrame
df = pd.DataFrame(data)

# Сохранение данных в CSV файл
df.to_csv('сетевой_трафик.csv', index=False)

print("Файл 'сетевой_трафик.csv' успешно создан.")
