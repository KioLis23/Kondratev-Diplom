import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt

# Функция для загрузки данных о сетевом трафике из CSV-файла
def load_network_traffic_data(data_file):
    data = pd.read_csv(data_file)
    return data

# Загрузка данных о сетевом трафике
data_file = 'сетевой_трафик.csv'
network_traffic_data = load_network_traffic_data(data_file)

# Удаление столбца 'timestamp'
network_traffic_data = network_traffic_data.drop('timestamp', axis=1)

# Преобразование IP-адресов и протоколов в числовой формат
label_encoder = LabelEncoder()
network_traffic_data['source_ip'] = label_encoder.fit_transform(network_traffic_data['source_ip'])
network_traffic_data['destination_ip'] = label_encoder.fit_transform(network_traffic_data['destination_ip'])
network_traffic_data['protocol'] = label_encoder.fit_transform(network_traffic_data['protocol'])

# Нормализация данных
scaler = StandardScaler()
data = scaler.fit_transform(network_traffic_data)

# Определение архитектуры нейросети (Autoencoder)
model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=(data.shape[1],)),
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(data.shape[1], activation='linear')
])

# Компиляция модели
model.compile(optimizer='adam', loss='mean_squared_error', metrics=['accuracy'])

# Обучение модели
history = model.fit(data, data, epochs=10, batch_size=32, validation_split=0.2)

# Сохранение модели
model.save('intrusion_detection_model.h5')

# Функция для обнаружения аномалий
def detect_anomalies(new_data_file):
    # Загрузка новых данных
    new_data = pd.read_csv(new_data_file)

    # Преобразование IP-адресов и протоколов в числовой формат
    new_data['source_ip'] = label_encoder.transform(new_data['source_ip'])
    new_data['destination_ip'] = label_encoder.transform(new_data['destination_ip'])
    new_data['protocol'] = label_encoder.transform(new_data['protocol'])

    # Нормализация данных
    new_data_normalized = scaler.transform(new_data)

    # Предсказание
    predictions = model.predict(new_data_normalized)

    # Вычисление MSE
    mse = tf.keras.losses.mean_squared_error(new_data_normalized, predictions).numpy()

    # Порог для обнаружения аномалий
    threshold = 0.025  # Порог можно настроить под вашу задачу

    # Обнаружение аномалий
    anomalies = (mse > threshold).astype(int)

    # Визуализация результатов
    plt.scatter(range(len(mse)), mse, c=anomalies, cmap='coolwarm', s=50)
    plt.xlabel('Индекс сэмпла')
    plt.ylabel('MSE')
    plt.title('Визуализация аномалий')
    plt.show()

    # Запись аномалий в файл
    anomalies_df = new_data.copy()
    anomalies_df['anomaly'] = anomalies
    anomalies_df.to_csv('anomaly_detection.log', index=False)

# Пример использования функции для обнаружения аномалий
new_data_file = 'новые_данные.csv'
detect_anomalies(new_data_file)
