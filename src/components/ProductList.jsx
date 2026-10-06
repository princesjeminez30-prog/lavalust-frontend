import React, { useEffect, useState } from 'react';
import api from '../api';

const emptyForm = {
    id: null,
    product_name: '',
    description: '',
    price: '',
    quantity: '',
};

function ProductList({ onLogout }) {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await api.get('/products');

            setProducts(response.data?.data || []);
        } catch (error) {
            if (error.response?.status === 401) {
                onLogout();
                return;
            }

            setIsError(true);
            setMessage(
                error.response?.data?.message ||
                'Unable to load products.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setIsError(false);
        setSaving(true);

        const productData = {
            product_name: form.product_name.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            quantity: Number(form.quantity),
        };

        try {
            if (isEditing) {
                const response = await api.put(
                    `/products/${form.id}`,
                    productData
                );

                setMessage(
                    response.data?.message ||
                    'Product updated successfully.'
                );
            } else {
                const response = await api.post(
                    '/products',
                    productData
                );

                setMessage(
                    response.data?.message ||
                    'Product added successfully.'
                );
            }

            resetForm();
            await fetchProducts();
        } catch (error) {
            if (error.response?.status === 401) {
                onLogout();
                return;
            }

            setIsError(true);
            setMessage(
                error.response?.data?.message ||
                'Unable to save product.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (product) => {
        setForm({
            id: product.id,
            product_name: product.product_name || '',
            description: product.description || '',
            price: product.price || '',
            quantity: product.quantity ?? '',
        });

        setIsEditing(true);
        setMessage('');
        setIsError(false);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this product?'
        );

        if (!confirmed) return;

        setMessage('');
        setIsError(false);

        try {
            const response = await api.delete(`/products/${id}`);

            setMessage(
                response.data?.message ||
                'Product deleted successfully.'
            );

            await fetchProducts();
        } catch (error) {
            if (error.response?.status === 401) {
                onLogout();
                return;
            }

            setIsError(true);
            setMessage(
                error.response?.data?.message ||
                'Unable to delete product.'
            );
        }
    };

    return (
        <div className="app">
            <header className="navbar">
                <div>
                    <h1>Product Manager</h1>
                    <span>Product Management System</span>
                </div>

                <button
                    className="logout-button"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </header>

            <main className="container">
                {message && (
                    <div
                        className={`alert ${isError ? 'error' : 'success'
                            }`}
                    >
                        {message}
                    </div>
                )}

                <section className="form-card">
                    <div className="section-header">
                        <div>
                            <h2>
                                {isEditing
                                    ? 'Edit Product'
                                    : 'Add Product'}
                            </h2>

                            <p>
                                {isEditing
                                    ? 'Update the product information below.'
                                    : 'Enter the details for a new product.'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Product Name</label>

                                <input
                                    type="text"
                                    name="product_name"
                                    value={form.product_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Laptop"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Price</label>

                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Quantity</label>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Enter a short description"
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? 'Saving...'
                                    : isEditing
                                        ? 'Update Product'
                                        : 'Add Product'}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="table-card">
                    <div className="table-header">
                        <div>
                            <h2>Products</h2>
                            <span>
                                {products.length} product
                                {products.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="empty-state"
                                        >
                                            Loading products...
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="empty-state"
                                        >
                                            No products found.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <strong>
                                                    {product.product_name}
                                                </strong>
                                            </td>

                                            <td className="description">
                                                {product.description || '-'}
                                            </td>

                                            <td>
                                                ₱
                                                {Number(
                                                    product.price
                                                ).toLocaleString(
                                                    'en-PH',
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </td>

                                            <td>
                                                {product.quantity}
                                            </td>

                                            <td>
                                                <div className="actions">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(product)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ProductList;