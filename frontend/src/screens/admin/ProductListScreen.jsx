import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row , Col } from 'react-bootstrap'
import { FaTrash , FaTimes , FaEdit } from 'react-icons/fa'
import Message from '../../components/message'
import Loader from '../../components/loader'
import {useParams} from 'react-router-dom'
import {toast } from 'react-toastify'
import { useGetProductsQuery , useCreateProductMutation , useDeleteProductMutation } from '../../slices/productApiSlice'
import Paginate from '../../components/Paginate'

const ProductListScreen = () => {
    const { pageNumber } = useParams();
    const { data, error, isLoading , refetch } = useGetProductsQuery({pageNumber});

    const [createProduct, {isLoading: LoadingCreate , error: errorCreate} ] = useCreateProductMutation();

    const [deleteProduct, {isLoading: LoadingDelete , error: errorDelete} ] = useDeleteProductMutation();

   const deleteHandler = async (id) => {
        if(window.confirm('Are you sure you want to delete this product?')){
            try {
                await deleteProduct(id);
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.message);
            }
        }
   }    

    const createProductHandler = async () => {
        if(window.confirm('Are you sure you want to create a product?')){
            try {
                await createProduct();
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
        }
    }

  return (
    <>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-end' >
                <Button className='btn-sm m-3' onClick={createProductHandler}> 
                    <FaEdit/> Create Product
                </Button>
            </Col>
        </Row>
        {LoadingCreate && <Loader/>}
        {LoadingDelete && <Loader/>}
        {
            isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                <Table striped  hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='light' className='btn-sm'>
                                                <FaEdit/>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger' className='btn-sm' onClick={()=> deleteHandler(product._id)} >
                                            <FaTrash style={{color: 'white'}} />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <Paginate pages={data.pages} page={data.page} isAdmin={true}/>
             </>
        )}

    </>
  )
}

export default ProductListScreen
