document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!localStorage.getItem('sellerToken')) {
        window.location.href = '/';
    }

    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', document.getElementById('productName').value);
        formData.append('description', document.getElementById('productDescription').value);
        formData.append('price', document.getElementById('productPrice').value);
        formData.append('image', document.getElementById('productImage').files[0]);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`
                },
                body: formData
            });

            if (response.ok) {
                alert('Product added successfully!');
                document.getElementById('productForm').reset();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add product');
        }
    });
});