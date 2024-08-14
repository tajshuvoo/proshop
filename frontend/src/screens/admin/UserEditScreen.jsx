import React from 'react'
import { useState , useEffect } from 'react'
import { Form , Button } from 'react-bootstrap'
import { Link , useNavigate ,useParams } from 'react-router-dom'
import Message from '../../components/message'
import Loader from '../../components/loader'
import FormContainer from '../../components/FormContainer'
import {toast} from 'react-toastify'
import { useGetUserDetailsQuery , useUpdateUserMutation } from '../../slices/usersApiSlices'


const UserEditScreen = () => {
    const {id : _id} = useParams();

    const [name , setName] = useState('');
    const [email , setEmail] = useState('');
    const [isAdmin , setIsAdmin] = useState(false);

    const {data: user ,refetch, isLoading , error} = useGetUserDetailsQuery(_id);

    const [updateUser , {isLoading: loadingUpdate }] = useUpdateUserMutation();


    const navigate = useNavigate();

    useEffect(() => {
        if(user){
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
            
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateUser({_id , name , email , isAdmin});
            toast.success('User Updated');
            refetch();
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.error || err.error);
        }
    }



  return (
    <>
        <Link to='/admin/userlist' className='btn btn-light my-3'>Go Back</Link>
        <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader />}
            {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='my-2' >
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}>
                        </Form.Control>   
                    </Form.Group>

                    <Form.Group controlId='email' className='my-2'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isadmin' className='my-2'>
                        <Form.Check type='checkbox' label='Is Admin' checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}>
                        </Form.Check>
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

export default UserEditScreen
