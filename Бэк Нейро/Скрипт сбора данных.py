import time
import random
import csv
import os
from datetime import datetime

# Функция для генерации случайного IP адреса
def generate_ip():
    return '.'.join(str(random.randint(0, 255)) for _ in range(4))

# Функция для генерации случайного порта
def generate_port():
    return random.randint(1024, 65535)

# Функция для генерации случайного протокола
def generate_protocol():
    return random.choice(['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'])

# Функция для генерации случайного размера пакета
def generate_packet_size():
    return random.randint(64, 1500)

# Основной скрипт для сбора данных
def collect_network_data(duration=10, interval=1):
    data = []
    start_time = time.time()

    while time.time() - start_time < duration:
        timestamp = time.time()
        source_ip = generate_ip()
        destination_ip = generate_ip()
        source_port = generate_port()
        destination_port = generate_port()
        protocol = generate_protocol()
        packet_size = generate_packet_size()

        record = {
            'timestamp': timestamp,
            'source_ip': source_ip,
            'destination_ip': destination_ip,
            'source_port': source_port,
            'destination_port': destination_port,
            'protocol': protocol,
            'packet_size': packet_size
        }

        data.append(record)
        
        time.sleep(interval)

    return data

# Функция для сохранения данных в CSV файл
def save_data_to_csv(data):
    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = f"{date_str}.Сбор трафика.csv"
    file_exists = os.path.isfile(filename)

    with open(filename, 'a', newline='') as csvfile:
        fieldnames = ['timestamp', 'source_ip', 'destination_ip', 'source_port', 'destination_port', 'protocol', 'packet_size']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()
        
        for record in data:
            writer.writerow(record)

# Главная функция, которая объединяет сбор и сохранение данных
def main():
    while True:
        network_data = collect_network_data()
        save_data_to_csv(network_data)
        print(f"Data saved to CSV file for {datetime.now().strftime('%Y-%m-%d')}")
        time.sleep(86400)  # Ожидание 24 часа перед следующей записью

# Запуск скрипта
if __name__ == "__main__":
    main()
