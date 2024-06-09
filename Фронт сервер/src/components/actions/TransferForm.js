import React, { useState, useEffect } from 'react';

const TransferForm = ({ onClose, onSave, data }) => {
    const [formData, setFormData] = useState({
        date: '',
        product_id: '',
        value: '',
        warehouse_name_from: '',
        warehouse_name_to: '',
        company_name: '',
        product_name: '',
        sales_sum: '',
        amount: '',
        segment_names: '',
        in_value: '',
        out_value: '',
        movement_type: ''
    });

    const [productOptions, setProductOptions] = useState([]);
    const [warehouseOptions, setWarehouseOptions] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const uniqueProductNames = [...new Set(data.map(item => item.product_name))];
        const uniqueWarehouseNames = [...new Set(data.map(item => item.warehouse_name))];
        const uniqueCompanyNames = [...new Set(data.map(item => item.company_name))];

        setProductOptions(uniqueProductNames);
        setWarehouseOptions(uniqueWarehouseNames);
        setCompanyOptions(uniqueCompanyNames);
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'product_name') {
            const selectedProduct = data.find(item => item.product_name === value);
            if (selectedProduct) {
                setFormData({
                    ...formData,
                    [name]: value,
                    product_id: selectedProduct.product_id,
                    company_name: selectedProduct.company_name,
                    value: 0,
                    sales_sum: selectedProduct.sales_sum,
                    amount: selectedProduct.amount,
                    segment_names: selectedProduct.segment_names,
                    in_value: selectedProduct.in_value,
                    out_value: selectedProduct.out_value,
                    movement_type: selectedProduct.movement_type
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            formData.date.trim() === '' ||
            formData.product_id.trim() === '' ||
            formData.value.trim() === '' ||
            formData.warehouse_name_from.trim() === '' ||
            formData.warehouse_name_to.trim() === '' ||
            formData.company_name.trim() === ''
        ) {
            setError('Заполните все поля!');
            return;
        }

        setError('');
        onSave(formData);
        onClose();
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Дата</label>
                    <input type="date" name="date" value={formData.date} onChange={handleDateChange} />
                </div>
                <div>
                    <label>Наименование продукта</label>
                    <select name="product_name" value={formData.product_name} onChange={handleChange}>
                        <option value="">Выберите наименование продукта</option>
                        {productOptions.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>ID продукта</label>
                    <input type="text" name="product_id" value={formData.product_id} readOnly />
                </div>
                <div>
                    <label>Компания</label>
                    <input type="text" name="company_name" value={formData.company_name} readOnly />
                </div>
                <div>
                    <label>Склад Откуда</label>
                    <select name="warehouse_name_from" value={formData.warehouse_name_from} onChange={handleChange} >
                        <option value="">Выберите склад</option>
                        {warehouseOptions.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Склад Куда</label>
                    <select name="warehouse_name_to" value={formData.warehouse_name_to} onChange={handleChange} >
                        <option value="">Выберите склад</option>
                        {warehouseOptions.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Значение</label>
                    <input type="number" name="value" value={formData.value} onChange={handleChange} />
                </div>
                <div>
                    <label>Количество</label>
                    <input type="number" name="amount" value={formData.amount} readOnly />
                </div>
                <div>
                    <label>Сегмент</label>
                    <input type="text" name="segment_names" value={formData.segment_names} readOnly />
                </div>
                <button type="submit">Отправить</button>
                <button type="button" onClick={onClose}>Отмена</button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </div>
    );
};

export default TransferForm;
