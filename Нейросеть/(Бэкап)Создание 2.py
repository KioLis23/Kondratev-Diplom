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

# Функция для загрузки меток аномалий из CSV-файла
def load_anomaly_labels(labels_file):
    labels = pd.read_csv(labels_file)
    return labels

# Загрузка данных о сетевом трафике и меток аномалий из CSV-файлов
data_file = 'сетевой_трафик.csv'
labels_file = 'аномалии.csv'
network_traffic_data = load_network_traffic_data(data_file)
anomaly_labels = load_anomaly_labels(labels_file)

# Удаление столбца 'timestamp'
network_traffic_data = network_traffic_data.drop('timestamp', axis=1)

# Преобразование IP-адресов и протоколов в числовой формат
label_encoder = LabelEncoder()
network_traffic_data['source_ip'] = label_encoder.fit_transform(network_traffic_data['source_ip'])
network_traffic_data['destination_ip'] = label_encoder.fit_transform(network_traffic_data['destination_ip'])
network_traffic_data['protocol'] = label_encoder.fit_transform(network_traffic_data['protocol'])

# Добавление столбца 'anomaly' в network_traffic_data
network_traffic_data['anomaly'] = anomaly_labels['anomaly']

# Нормализация данных
scaler = StandardScaler()
data = scaler.fit_transform(network_traffic_data.drop('anomaly', axis=1))  # Убираем столбец 'anomaly'

# Разделение данных на обучающий и тестовый наборы
X_train, X_test, y_train, y_test = train_test_split(data, network_traffic_data['anomaly'], test_size=0.2, random_state=42)

# Определение архитектуры нейросети (Autoencoder)
model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(X_train.shape[1], activation='linear')
])

# Компиляция модели
model.compile(optimizer='adam', loss='mean_squared_error', metrics=['accuracy'])

# Обучение модели
history = model.fit(X_train, X_train, epochs=10, batch_size=32, validation_data=(X_test, X_test))

# Оценка производительности модели
predictions = model.predict(X_test)
mse = tf.keras.losses.mean_squared_error(X_test, predictions).numpy()

# Порог для обнаружения аномалий
threshold = 0.025  # Порог можно настроить под вашу задачу

# Обнаружение атак
anomalies = (mse > threshold).astype(int)

print("Метрика MSE:", mse)
print("Аномалии (1 - аномальные, 0 - нормальные):", anomalies)

# Визуализация производительности модели
plt.figure(figsize=(12, 6))

plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Потери на обучении')
plt.plot(history.history['val_loss'], label='Потери на валидации')
plt.xlabel('Эпоха')
plt.ylabel('Потери')
plt.legend()

plt.subplot(1, 2, 2)
plt.scatter(range(len(mse)), mse, c=anomalies, cmap='coolwarm', s=50)
plt.xlabel('Индекс сэмпла')
plt.ylabel('MSE')
plt.colorbar()

# Визуальный вывод аномалий
plt.figure(figsize=(10, 6))
plt.scatter(range(len(mse)), mse, c=anomalies, cmap='coolwarm', s=50)
plt.xlabel('Индекс сэмпла')
plt.ylabel('MSE')
plt.title('Визуализация аномалий')
plt.show()

model.save('intrusion_detection_model.h5')
