import React from 'react'
import { useState , useEffect } from 'react'
import { Form , Button } from 'react-bootstrap'
import { Link , useNavigate ,useParams } from 'react-router-dom'
import Message from '../../components/message'
import Loader from '../../components/loader'
import FormContainer from '../../components/FormContainer'
import {toast} from 'react-toastify'
import { useUpdateProductMutation , useGetProductsDetailsQuery , useUploadProductImageMutation } from '../../slices/productApiSlice'


const ProductEditScreen = () => {
    const {id: productId} = useParams();

    const [name , setName] = useState('');
    const [price , setPrice] = useState(0);
    const [image , setImage] = useState('');
    const [brand , setBrand] = useState('');
    const [category , setCategory] = useState('');
    const [countInStock , setCountInStock] = useState(0);
    const [description , setDescription] = useState('');

    const {data: product , isLoading , error} = useGetProductsDetailsQuery(productId);

    const [updateProduct , {isLoading: loadingUpdate}] = useUpdateProductMutation(product);

    const [uploadProductImage , {isLoading: loadingUpload }] = useUploadProductImageMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if(product){
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }
        const {data , error} = await updateProduct(updatedProduct);
        if(data){
            toast.success('Product Updated Successfully');
            navigate('/admin/productlist');
        }else{
            toast.error(error);
        }
    }

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image' , e.target.files[0]);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }

  return (
    <>
        <Link to='/admin/productlist' className='btn btn-light my-3'>Go Back</Link>
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader />}
            {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}>
                        </Form.Control>   
                    </Form.Group>

                    <Form.Group controlId='price'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type='number' placeholder='Enter Price' value={price} onChange={(e) => setPrice(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='image'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control type='text' placeholder='Enter Image URL' value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
                        <Form.Control type='file' label='Choose File'  onChange={ uploadFileHandler }></Form.Control>
                        {loadingUpload && <Loader />}
                    </Form.Group>

                    <Form.Group controlId='brand'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control type='text' placeholder='Enter Brand' value={brand} onChange={(e) => setBrand(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock'>
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control type='number' placeholder='Enter Count In Stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='category'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control type='text' placeholder='Enter Category' value={category} onChange={(e) => setCategory(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='description'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type='text' placeholder='Enter Description' value={description} onChange={(e) => setDescription(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='my-2'>
                        Update
                    </Button>
                </Form>
            )}
        </FormContainer>
    </>
  )
}

export default ProductEditScreen
